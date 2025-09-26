import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [userSignupForm, setUserSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: ''
  });

  const [doctorSignupForm, setDoctorSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    specialization: '',
    experienceYears: '',
    bio: '',
    languages: [] as string[],
    hourlyRate: ''
  });

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(loginForm.email, loginForm.password);
    
    if (error) {
      setError(error.message);
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Login Successful',
        description: 'Welcome back to Therapal!'
      });
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  const handleUserSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userSignupForm.password !== userSignupForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await signUp(userSignupForm.email, userSignupForm.password, {
      full_name: userSignupForm.fullName,
      phone: userSignupForm.phone,
      role: 'user'
    });

    if (error) {
      setError(error.message);
      toast({
        title: 'Signup Failed',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Signup Successful',
        description: 'Please check your email to confirm your account.'
      });
    }
    
    setLoading(false);
  };

  const handleDoctorSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (doctorSignupForm.password !== doctorSignupForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await signUp(doctorSignupForm.email, doctorSignupForm.password, {
      full_name: doctorSignupForm.fullName,
      phone: doctorSignupForm.phone,
      role: 'doctor',
      specialization: doctorSignupForm.specialization,
      experience_years: parseInt(doctorSignupForm.experienceYears) || 0,
      bio: doctorSignupForm.bio,
      languages: doctorSignupForm.languages.length > 0 ? doctorSignupForm.languages : ['English'],
      hourly_rate: parseFloat(doctorSignupForm.hourlyRate) || 50.00
    });

    if (error) {
      setError(error.message);
      toast({
        title: 'Signup Failed',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Doctor Application Submitted',
        description: 'Please check your email and await admin approval.'
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gradient">
            Welcome to Therapal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="user-signup">User Signup</TabsTrigger>
              <TabsTrigger value="doctor-signup">Doctor Signup</TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="user-signup">
              <form onSubmit={handleUserSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-name">Full Name</Label>
                  <Input
                    id="user-name"
                    value={userSignupForm.fullName}
                    onChange={(e) => setUserSignupForm({...userSignupForm, fullName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={userSignupForm.email}
                    onChange={(e) => setUserSignupForm({...userSignupForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-phone">Phone</Label>
                  <Input
                    id="user-phone"
                    type="tel"
                    value={userSignupForm.phone}
                    onChange={(e) => setUserSignupForm({...userSignupForm, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-password">Password</Label>
                  <Input
                    id="user-password"
                    type="password"
                    value={userSignupForm.password}
                    onChange={(e) => setUserSignupForm({...userSignupForm, password: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-confirm-password">Confirm Password</Label>
                  <Input
                    id="user-confirm-password"
                    type="password"
                    value={userSignupForm.confirmPassword}
                    onChange={(e) => setUserSignupForm({...userSignupForm, confirmPassword: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                  Sign Up as User
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="doctor-signup">
              <form onSubmit={handleDoctorSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor-name">Full Name</Label>
                  <Input
                    id="doctor-name"
                    value={doctorSignupForm.fullName}
                    onChange={(e) => setDoctorSignupForm({...doctorSignupForm, fullName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-email">Email</Label>
                  <Input
                    id="doctor-email"
                    type="email"
                    value={doctorSignupForm.email}
                    onChange={(e) => setDoctorSignupForm({...doctorSignupForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-specialization">Specialization</Label>
                  <Select onValueChange={(value) => setDoctorSignupForm({...doctorSignupForm, specialization: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Clinical Psychology">Clinical Psychology</SelectItem>
                      <SelectItem value="Counseling Psychology">Counseling Psychology</SelectItem>
                      <SelectItem value="Child Psychology">Child Psychology</SelectItem>
                      <SelectItem value="Family Therapy">Family Therapy</SelectItem>
                      <SelectItem value="Trauma Therapy">Trauma Therapy</SelectItem>
                      <SelectItem value="Addiction Counseling">Addiction Counseling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-bio">Bio</Label>
                  <Textarea
                    id="doctor-bio"
                    value={doctorSignupForm.bio}
                    onChange={(e) => setDoctorSignupForm({...doctorSignupForm, bio: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-password">Password</Label>
                  <Input
                    id="doctor-password"
                    type="password"
                    value={doctorSignupForm.password}
                    onChange={(e) => setDoctorSignupForm({...doctorSignupForm, password: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-confirm-password">Confirm Password</Label>
                  <Input
                    id="doctor-confirm-password"
                    type="password"
                    value={doctorSignupForm.confirmPassword}
                    onChange={(e) => setDoctorSignupForm({...doctorSignupForm, confirmPassword: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                  Apply as Doctor
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;