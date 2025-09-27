import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, DollarSign, User, LogOut, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Doctor extends Profile {
  specialization: string;
  is_approved: boolean;
}

interface Appointment {
  id: string;
  appointment_date: string;
  status: string;
  payment_status: string;
  total_amount: number;
  patient: { full_name: string };
  doctor: { full_name: string };
}

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch all doctors with approval status
      const { data: doctorsData, error: doctorsError } = await supabase
        .from('doctors')
        .select('*')
        .order('created_at', { ascending: false });

      if (doctorsError) throw doctorsError;

      // Fetch doctor profiles separately
      const doctorsWithProfiles = await Promise.all(
        doctorsData?.map(async (doc) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', doc.user_id)
            .single();
          
          return {
            id: profile?.id || '',
            user_id: doc.user_id,
            full_name: profile?.full_name || 'Unknown',
            email: profile?.email || '',
            role: profile?.role || 'doctor',
            created_at: profile?.created_at || '',
            specialization: doc.specialization,
            is_approved: doc.is_approved
          };
        }) || []
      );

      // Fetch all appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: false });

      if (appointmentsError) throw appointmentsError;

      // Fetch appointment details with patient and doctor names
      const appointmentsWithDetails = await Promise.all(
        appointmentsData?.map(async (apt) => {
          const [patientProfile, doctorProfile] = await Promise.all([
            supabase.from('profiles').select('full_name').eq('user_id', apt.patient_id).single(),
            supabase.from('profiles').select('full_name').eq('user_id', apt.doctor_id).single()
          ]);
          
          return {
            ...apt,
            patient: { full_name: patientProfile.data?.full_name || 'Unknown Patient' },
            doctor: { full_name: doctorProfile.data?.full_name || 'Unknown Doctor' }
          };
        }) || []
      );

      setUsers(usersData || []);
      setDoctors(doctorsWithProfiles);
      setAppointments(appointmentsWithDetails);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const approveDoctorStatus = async (doctorUserId: string, approve: boolean) => {
    try {
      const { error } = await supabase
        .from('doctors')
        .update({ is_approved: approve })
        .eq('user_id', doctorUserId);

      if (error) throw error;

      setDoctors(prev =>
        prev.map(doc =>
          doc.user_id === doctorUserId ? { ...doc, is_approved: approve } : doc
        )
      );

      toast({
        title: 'Success',
        description: `Doctor ${approve ? 'approved' : 'rejected'} successfully`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update doctor status',
        variant: 'destructive'
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Delete from auth.users (cascade will handle related records)
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      setUsers(prev => prev.filter(user => user.user_id !== userId));
      setDoctors(prev => prev.filter(doc => doc.user_id !== userId));

      toast({
        title: 'Success',
        description: 'User deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive'
      });
    }
  };

  const totalRevenue = appointments
    .filter(apt => apt.payment_status === 'paid')
    .reduce((sum, apt) => sum + apt.total_amount, 0);

  const pendingDoctors = doctors.filter(doc => !doc.is_approved);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold">{profile?.full_name}</h1>
              <p className="text-sm text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {doctors.filter(doc => doc.is_approved).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{appointments.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">RWF {totalRevenue}</div>
                </CardContent>
              </Card>
            </div>

            {pendingDoctors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Doctor Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingDoctors.slice(0, 5).map((doctor) => (
                      <div key={doctor.user_id} className="flex items-center justify-between p-4 border rounded">
                        <div>
                          <p className="font-medium">{doctor.full_name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.email}</p>
                          <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => approveDoctorStatus(doctor.user_id, true)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => approveDoctorStatus(doctor.user_id, false)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading users...</p>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.user_id} className="flex items-center justify-between p-4 border rounded">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>{user.full_name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.full_name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-sm text-muted-foreground">
                              Joined: {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                          {user.role !== 'admin' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteUser(user.user_id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors">
            <Card>
              <CardHeader>
                <CardTitle>Doctors Management</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading doctors...</p>
                ) : (
                  <div className="space-y-4">
                    {doctors.map((doctor) => (
                      <div key={doctor.user_id} className="flex items-center justify-between p-4 border rounded">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>{doctor.full_name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Dr. {doctor.full_name}</p>
                            <p className="text-sm text-muted-foreground">{doctor.email}</p>
                            <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={doctor.is_approved ? 'default' : 'secondary'}>
                            {doctor.is_approved ? 'Approved' : 'Pending'}
                          </Badge>
                          {!doctor.is_approved && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => approveDoctorStatus(doctor.user_id, true)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteUser(doctor.user_id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading appointments...</p>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded">
                        <div>
                          <p className="font-medium">
                            {appointment.patient.full_name} → Dr. {appointment.doctor.full_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(appointment.appointment_date).toLocaleDateString()} at{' '}
                            {new Date(appointment.appointment_date).toLocaleTimeString()}
                          </p>
                          <p className="text-sm font-medium">RWF {appointment.total_amount}</p>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                            {appointment.status}
                          </Badge>
                          <Badge variant={appointment.payment_status === 'paid' ? 'default' : 'secondary'}>
                            {appointment.payment_status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Paid:</span>
                      <span className="font-medium">
                        RWF {appointments.filter(apt => apt.payment_status === 'paid').reduce((sum, apt) => sum + apt.total_amount, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending:</span>
                      <span className="font-medium">
                        RWF {appointments.filter(apt => apt.payment_status === 'pending').reduce((sum, apt) => sum + apt.total_amount, 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appointments by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Confirmed:</span>
                      <span className="font-medium">
                        {appointments.filter(apt => apt.status === 'confirmed').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending:</span>
                      <span className="font-medium">
                        {appointments.filter(apt => apt.status === 'pending').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span className="font-medium">
                        {appointments.filter(apt => apt.status === 'completed').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;