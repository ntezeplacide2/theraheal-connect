import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MessageSquare, User, LogOut } from 'lucide-react';
import BookingForm from '@/components/BookingForm';
import ChatComponent from '@/components/ChatComponent';

interface Appointment {
  id: string;
  appointment_date: string;
  status: string;
  payment_status: string;
  total_amount: number;
  doctor: {
    full_name: string;
    specialization: string;
  };
}

const UserDashboard = () => {
  const { profile, signOut } = useAuth();
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
        .select(`
          *,
          doctors!appointments_doctor_id_fkey(
            specialization,
            profiles!doctors_user_id_fkey(full_name)
          )
        `)
        .eq('patient_id', profile?.id)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      
      const formattedAppointments = data?.map((apt: any) => ({
        ...apt,
        doctor: {
          full_name: apt.doctors?.profiles?.full_name || 'Unknown Doctor',
          specialization: apt.doctors?.specialization || 'Therapy'
        }
      })) || [];
      
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

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
              <h1 className="text-xl font-semibold">Welcome, {profile?.full_name}</h1>
              <p className="text-sm text-muted-foreground">Patient Dashboard</p>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="book">Book Session</TabsTrigger>
            <TabsTrigger value="chat">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{appointments.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {appointments.filter(apt => apt.status === 'confirmed' && new Date(apt.appointment_date) > new Date()).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading appointments...</p>
                ) : appointments.length === 0 ? (
                  <p>No appointments yet. Book your first session!</p>
                ) : (
                  <div className="space-y-4">
                    {appointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded">
                        <div>
                          <p className="font-medium">{appointment.doctor.full_name}</p>
                          <p className="text-sm text-muted-foreground">{appointment.doctor.specialization}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(appointment.appointment_date).toLocaleDateString()} at{' '}
                            {new Date(appointment.appointment_date).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                          <Badge className={getPaymentStatusColor(appointment.payment_status)}>
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

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading appointments...</p>
                ) : appointments.length === 0 ? (
                  <p>No appointments yet. Book your first session!</p>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarFallback>{appointment.doctor.full_name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{appointment.doctor.full_name}</p>
                              <p className="text-sm text-muted-foreground">{appointment.doctor.specialization}</p>
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
                          <Badge className={getPaymentStatusColor(appointment.payment_status)}>
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

          <TabsContent value="book">
            <BookingForm onBookingComplete={fetchAppointments} />
          </TabsContent>

          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <ChatComponent appointments={appointments} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;