import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Doctor {
  user_id: string;
  full_name: string;
  specialization: string;
  bio?: string;
  hourly_rate: number;
  languages: string[];
}

interface BookingFormProps {
  onBookingComplete: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBookingComplete }) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: '',
    duration: 60
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          user_id,
          specialization,
          bio,
          hourly_rate,
          languages
        `)
        .eq('status', 'approved');
      
      if (error) throw error;

      // Fetch profiles for each doctor
      const doctorIds = data?.map(d => d.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', doctorIds);

      if (error) throw error;

      const formattedDoctors = data?.map(doc => {
        const profile = profilesData?.find(p => p.user_id === doc.user_id);
        return {
          user_id: doc.user_id,
          full_name: profile?.full_name || 'Unknown Doctor',
          specialization: doc.specialization,
          bio: doc.bio,
          hourly_rate: doc.hourly_rate,
          languages: doc.languages
        };
      }) || [];

      setDoctors(formattedDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load doctors',
        variant: 'destructive'
      });
    }
  };

  const selectedDoctor = doctors.find(doc => doc.user_id === formData.doctorId);
  const totalAmount = selectedDoctor ? (selectedDoctor.hourly_rate * formData.duration / 60) : 0;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.user_id) return;

    setLoading(true);

    try {
      const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);
      
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: profile.id,
          doctor_id: formData.doctorId,
          appointment_date: formData.appointmentDate,
          appointment_time: formData.appointmentTime,
          duration: formData.duration,
          notes: formData.notes,
          total_amount: totalAmount,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Initiate payment
      await handlePayment(data.id, totalAmount);

      toast({
        title: 'Booking Successful',
        description: 'Your appointment has been booked successfully!'
      });

      // Reset form
      setFormData({
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: '',
        duration: 60
      });

      onBookingComplete();
    } catch (error: any) {
      toast({
        title: 'Booking Failed',
        description: error.message || 'Failed to book appointment',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (appointmentId: string, amount: number) => {
    try {
      // Using your exact IremboPay integration code
      const url = "https://api.sandbox.irembopay.com/payments/invoices";
      const secretKey = 'sk_live_6bbf4b14f03844a8a8c094469221e805';
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Accept", "application/json");
      headers.append("irembopay-secretKey", secretKey);

      const data = JSON.stringify({
        "transactionId": `THERAPAL-${appointmentId}`,
        "paymentAccountIdentifier": "TST-RWF",
        "customer": {
          "email": profile?.email || "user@email.com",
          "phoneNumber": profile?.phone || "0780000001",
          "name": profile?.full_name || "Therapal User"
        },
        "paymentItems": [
          {
            "unitAmount": Math.round(amount * 100), // Convert to cents
            "quantity": 1,
            "code": "THERAPY-SESSION"
          }
        ],
        "description": "Therapy session payment",
        "expiryAt": new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        "language": "EN"
      });

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: data,
        redirect: "follow" as RequestRedirect
      };

      const response = await fetch(url, requestOptions);
      const result = await response.json();
      
      if (result.success) {
        // Update appointment with payment ID
        await supabase
          .from('appointments')
          .update({ 
            payment_id: result.data.id,
            payment_status: 'pending'
          })
          .eq('id', appointmentId);

        // Redirect to payment page if provided
        if (result.data.paymentUrl) {
          window.open(result.data.paymentUrl, '_blank');
        }
      } else {
        throw new Error(result.message || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: 'Failed to initialize payment. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Book a Therapy Session
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBooking} className="space-y-6">
          {/* Doctor Selection */}
          <div className="space-y-2">
            <Label htmlFor="doctor">Select Doctor</Label>
            <Select onValueChange={(value) => setFormData({...formData, doctorId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a therapist" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.user_id} value={doctor.user_id}>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{doctor.full_name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Dr. {doctor.full_name}</p>
                        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                        <p className="text-xs text-muted-foreground">RWF {doctor.hourly_rate}/hour</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Doctor Details */}
          {selectedDoctor && (
            <Card className="p-4 bg-accent/20">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarFallback>{selectedDoctor.full_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold">Dr. {selectedDoctor.full_name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedDoctor.specialization}</p>
                  {selectedDoctor.bio && (
                    <p className="text-sm mt-2">{selectedDoctor.bio}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm font-medium">RWF {selectedDoctor.hourly_rate}/hour</span>
                    <span className="text-sm text-muted-foreground">
                      Languages: {selectedDoctor.languages.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.appointmentDate}
                onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Select onValueChange={(value) => setFormData({...formData, appointmentTime: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {time}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration Selection */}
          <div className="space-y-2">
            <Label htmlFor="duration">Session Duration</Label>
            <Select onValueChange={(value) => setFormData({...formData, duration: parseInt(value)})}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">60 minutes (recommended)</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any specific concerns or topics you'd like to discuss..."
              rows={3}
            />
          </div>

          {/* Payment Summary */}
          {selectedDoctor && formData.duration && (
            <Card className="p-4 bg-primary/5">
              <h4 className="font-semibold mb-2">Payment Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{formData.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span>RWF {selectedDoctor.hourly_rate}/hour</span>
                </div>
                <div className="flex justify-between font-semibold text-base border-t pt-1">
                  <span>Total:</span>
                  <span>RWF {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !formData.doctorId || !formData.appointmentDate || !formData.appointmentTime}
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Book Session & Pay'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;