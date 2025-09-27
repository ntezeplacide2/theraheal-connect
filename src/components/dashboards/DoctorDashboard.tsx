import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, LogOut, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  appointment_date: string;
  status: string;
  payment_status: string;
  total_amount: number;
  notes?: string;
  patient: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

const DoctorDashboard = () => {
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', profile?.user_id)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      
      // Fetch patient profiles separately
      const appointmentsWithPatients = await Promise.all(
        data?.map(async (apt) => {
          const { data: patientProfile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('user_id', apt.patient_id)
            .single();
          
          return {
            ...apt,
            patient: {
              full_name: patientProfile?.full_name || 'Unknown Patient',
              email: patientProfile?.email || ''
            }
          };
        }) || []
      );
      
      setAppointments(appointmentsWithPatients);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (error) throw error;

      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status } : apt
        )
      );

      toast({
        title: 'Success',
        description: `Appointment ${status} successfully`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update appointment status',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const todayAppointments = appointments.filter(apt => {
    const today = new Date();
    const aptDate = new Date(apt.appointment_date);
    return aptDate.toDateString() === today.toDateString();
  });

  const upcomingAppointments = appointments.filter(apt => {
    const now = new Date();
    const aptDate = new Date(apt.appointment_date);
    return aptDate > now && apt.status === 'confirmed';
  });

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
              <h1 className="text-xl font-semibold">Dr. {profile?.full_name}</h1>
              <p className="text-sm text-muted-foreground">Doctor Dashboard</p>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">All Appointments</TabsTrigger>
            <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Set(appointments.map(apt => apt.patient.email)).size}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayAppointments.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Pending Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading appointments...</p>
                ) : (
                  <div className="space-y-4">
                    {appointments
                      .filter(apt => apt.status === 'pending')
                      .slice(0, 5)
                      .map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded">
                        <div className="flex-1">
                          <p className="font-medium">{appointment.patient.full_name}</p>
                          <p className="text-sm text-muted-foreground">{appointment.patient.email}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(appointment.appointment_date).toLocaleDateString()} at{' '}
                            {new Date(appointment.appointment_date).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Deny
                          </Button>
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
                ) : appointments.length === 0 ? (
                  <p>No appointments yet.</p>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarFallback>{appointment.patient.full_name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{appointment.patient.full_name}</p>
                              <p className="text-sm text-muted-foreground">{appointment.patient.email}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(appointment.appointment_date).toLocaleDateString()} at{' '}
                                {new Date(appointment.appointment_date).toLocaleTimeString()}
                              </p>
                              <p className="text-sm font-medium">RWF {appointment.total_amount}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                          {appointment.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
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

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                {todayAppointments.length === 0 ? (
                  <p>No appointments scheduled for today.</p>
                ) : (
                  <div className="space-y-4">
                    {todayAppointments
                      .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())
                      .map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarFallback>{appointment.patient.full_name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{appointment.patient.full_name}</p>
                              <p className="text-sm text-muted-foreground">{appointment.patient.email}</p>
                              <p className="text-sm font-medium">
                                {new Date(appointment.appointment_date).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;