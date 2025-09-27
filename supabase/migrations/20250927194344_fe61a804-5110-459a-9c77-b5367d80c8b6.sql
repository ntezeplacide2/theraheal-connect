-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  specialization TEXT NOT NULL,
  bio TEXT,
  hourly_rate NUMERIC NOT NULL DEFAULT 0,
  languages TEXT[] DEFAULT ARRAY['English'],
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for doctors
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration INTEGER NOT NULL DEFAULT 60,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  total_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Add user_id column to profiles (needed for joins)
ALTER TABLE public.profiles ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing profiles to set user_id = id
UPDATE public.profiles SET user_id = id;

-- Make user_id NOT NULL after setting values
ALTER TABLE public.profiles ALTER COLUMN user_id SET NOT NULL;

-- Create RLS policies for doctors
CREATE POLICY "Users can view all approved doctors" ON public.doctors
FOR SELECT USING (status = 'approved');

CREATE POLICY "Doctors can update their own profile" ON public.doctors
FOR UPDATE USING (user_id IN (
  SELECT id FROM profiles WHERE profiles.user_id = auth.uid()
));

CREATE POLICY "Admins can manage all doctors" ON public.doctors
FOR ALL USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Create RLS policies for appointments
CREATE POLICY "Users can view their own appointments" ON public.appointments
FOR SELECT USING (
  patient_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  OR doctor_id IN (SELECT doctors.id FROM doctors 
    JOIN profiles ON doctors.user_id = profiles.id 
    WHERE profiles.user_id = auth.uid())
);

CREATE POLICY "Users can create appointments" ON public.appointments
FOR INSERT WITH CHECK (
  patient_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update their appointments" ON public.appointments
FOR UPDATE USING (
  patient_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  OR doctor_id IN (SELECT doctors.id FROM doctors 
    JOIN profiles ON doctors.user_id = profiles.id 
    WHERE profiles.user_id = auth.uid())
);

-- Create RLS policies for chat_messages
CREATE POLICY "Users can view messages for their appointments" ON public.chat_messages
FOR SELECT USING (
  appointment_id IN (
    SELECT appointments.id FROM appointments
    WHERE appointments.patient_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR appointments.doctor_id IN (SELECT doctors.id FROM doctors 
      JOIN profiles ON doctors.user_id = profiles.id 
      WHERE profiles.user_id = auth.uid())
  )
);

CREATE POLICY "Users can send messages for their appointments" ON public.chat_messages
FOR INSERT WITH CHECK (
  sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  AND appointment_id IN (
    SELECT appointments.id FROM appointments
    WHERE appointments.patient_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR appointments.doctor_id IN (SELECT doctors.id FROM doctors 
      JOIN profiles ON doctors.user_id = profiles.id 
      WHERE profiles.user_id = auth.uid())
  )
);

-- Create triggers for updated_at columns
CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();