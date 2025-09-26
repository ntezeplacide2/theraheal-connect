-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('user', 'doctor', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role public.user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctors table for additional doctor info
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  specialization TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  languages TEXT[] DEFAULT ARRAY['English'],
  availability JSONB DEFAULT '{}',
  hourly_rate DECIMAL(10,2) DEFAULT 50.00,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  payment_id TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create security definer functions
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.profiles WHERE user_id = user_uuid;
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE user_id = user_uuid AND role = 'admin');
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_doctor(user_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE user_id = user_uuid AND role = 'doctor');
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" ON public.profiles
FOR UPDATE USING (public.is_admin(auth.uid()));

-- RLS Policies for doctors
CREATE POLICY "Anyone can view approved doctors" ON public.doctors
FOR SELECT USING (is_approved = true);

CREATE POLICY "Doctors can view their own profile" ON public.doctors
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Doctors can update their own profile" ON public.doctors
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all doctors" ON public.doctors
FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for appointments
CREATE POLICY "Users can view their own appointments" ON public.appointments
FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

CREATE POLICY "Users can create appointments" ON public.appointments
FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Doctors can update their appointments" ON public.appointments
FOR UPDATE USING (auth.uid() = doctor_id);

CREATE POLICY "Admins can manage all appointments" ON public.appointments
FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for chat messages
CREATE POLICY "Users can view messages from their appointments" ON public.chat_messages
FOR SELECT USING (
  EXISTS(
    SELECT 1 FROM public.appointments 
    WHERE id = appointment_id 
    AND (patient_id = auth.uid() OR doctor_id = auth.uid())
  )
);

CREATE POLICY "Users can send messages to their appointments" ON public.chat_messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS(
    SELECT 1 FROM public.appointments 
    WHERE id = appointment_id 
    AND (patient_id = auth.uid() OR doctor_id = auth.uid())
  )
);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'user')
  );
  
  -- If user is a doctor, create doctor profile
  IF (NEW.raw_user_meta_data->>'role') = 'doctor' THEN
    INSERT INTO public.doctors (user_id, specialization, bio, languages)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'specialization', 'General Therapy'),
      COALESCE(NEW.raw_user_meta_data->>'bio', ''),
      ARRAY[COALESCE(NEW.raw_user_meta_data->>'languages', 'English')]
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create update triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();