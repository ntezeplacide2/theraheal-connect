-- Create proper role system with access control (correct mapping)

-- First, create an enum for roles
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'doctor', 'admin');
    END IF;
END $$;

-- Add a new role column with proper type
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS new_role user_role DEFAULT 'user';

-- Migrate existing data (only admin exists)
UPDATE public.profiles SET new_role = 
  CASE 
    WHEN role = 'admin' THEN 'admin'::user_role
    ELSE 'user'::user_role
  END;

-- Drop old column and rename new one
ALTER TABLE public.profiles DROP COLUMN role;
ALTER TABLE public.profiles RENAME COLUMN new_role TO role;

-- Set NOT NULL constraint
ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;

-- Create a function to automatically assign doctor role when someone registers as a doctor
CREATE OR REPLACE FUNCTION public.handle_doctor_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the profile role to doctor when a doctor record is created
  UPDATE public.profiles 
  SET role = 'doctor'::user_role 
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger for doctor signup
DROP TRIGGER IF EXISTS on_doctor_created ON public.doctors;
CREATE TRIGGER on_doctor_created
  AFTER INSERT ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.handle_doctor_signup();

-- Create a function to check user roles (security definer to bypass RLS)
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

-- Create a function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.profiles
  WHERE id = _user_id
  LIMIT 1
$$;

-- Update RLS policies for better access control

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view profiles in their workspace" ON public.profiles;
DROP POLICY IF EXISTS "Users can update profiles in their workspace" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert profiles in their workspace" ON public.profiles;

-- Create new role-based policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (id = auth.uid());

-- Update appointments policies for better role-based access
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their appointments" ON public.appointments;

CREATE POLICY "Users can view their appointments" 
ON public.appointments FOR SELECT 
USING (
  patient_id = auth.uid() OR 
  doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()) OR
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Users can create appointments" 
ON public.appointments FOR INSERT 
WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Users and doctors can update appointments" 
ON public.appointments FOR UPDATE 
USING (
  patient_id = auth.uid() OR 
  doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()) OR
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete appointments" 
ON public.appointments FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));