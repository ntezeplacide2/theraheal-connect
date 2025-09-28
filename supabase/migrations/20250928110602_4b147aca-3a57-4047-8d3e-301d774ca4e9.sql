-- Drop all existing policies to start clean
DROP POLICY IF EXISTS "Doctors can update their own profile" ON public.doctors;
DROP POLICY IF EXISTS "Users can view all approved doctors" ON public.doctors;
DROP POLICY IF EXISTS "Admins can manage all doctors" ON public.doctors;
DROP POLICY IF EXISTS "Users can view approved doctors" ON public.doctors;
DROP POLICY IF EXISTS "Doctors can view their own profile" ON public.doctors;
DROP POLICY IF EXISTS "Users can insert doctor profile" ON public.doctors;

DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can view their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users and doctors can update appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can delete appointments" ON public.appointments;

DROP POLICY IF EXISTS "Users can view messages for their appointments" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can send messages for their appointments" ON public.chat_messages;
DROP POLICY IF EXISTS "Admins can manage all messages" ON public.chat_messages;

-- Create proper role system if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'doctor', 'admin');
    END IF;
END $$;

-- Only add column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT column_name FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='new_role') THEN
        ALTER TABLE public.profiles ADD COLUMN new_role user_role DEFAULT 'user';
        
        -- Migrate existing data
        UPDATE public.profiles SET new_role = 
          CASE 
            WHEN role = 'admin' THEN 'admin'::user_role
            WHEN role = 'doctor' THEN 'doctor'::user_role
            WHEN role = 'owner' THEN 'admin'::user_role
            WHEN role = 'member' THEN 'user'::user_role
            ELSE 'user'::user_role
          END;
        
        -- Drop old column and rename new one
        ALTER TABLE public.profiles DROP COLUMN role CASCADE;
        ALTER TABLE public.profiles RENAME COLUMN new_role TO role;
        ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;
    END IF;
END $$;

-- Create access control functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = _role
  )
$$;

-- Function to handle doctor signup
CREATE OR REPLACE FUNCTION public.handle_doctor_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'doctor'::user_role 
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

-- Trigger for doctor signup
DROP TRIGGER IF EXISTS on_doctor_created ON public.doctors;
CREATE TRIGGER on_doctor_created
  AFTER INSERT ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.handle_doctor_signup();