import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  message: string;
  sent_at: string;
  sender_id: string;
  sender_name?: string;
}

interface Appointment {
  id: string;
  status: string;
  doctor: {
    full_name: string;
  };
}

interface ChatComponentProps {
  appointments: Appointment[];
}

const ChatComponent: React.FC<ChatComponentProps> = ({ appointments }) => {
  const { profile } = useAuth();
  const [selectedAppointment, setSelectedAppointment] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed');

  useEffect(() => {
    if (selectedAppointment) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [selectedAppointment]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('appointment_id', selectedAppointment)
        .order('sent_at', { ascending: true });

      if (error) throw error;

      // Fetch sender names separately
      const messagesWithSenders = await Promise.all(
        data?.map(async (msg) => {
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', msg.sender_id)
            .single();
          
          return {
            ...msg,
            sender_name: senderProfile?.full_name || 'Unknown'
          };
        }) || []
      );

      setMessages(messagesWithSenders);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`chat:${selectedAppointment}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `appointment_id=eq.${selectedAppointment}`
        },
        (payload) => {
          fetchMessages(); // Refetch to get sender name
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedAppointment || !profile?.user_id) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          appointment_id: selectedAppointment,
          sender_id: profile.user_id,
          message: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (confirmedAppointments.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No confirmed appointments available for messaging.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Appointment Selection */}
      <div>
        <label className="text-sm font-medium">Select Appointment to Chat</label>
        <select
          className="w-full mt-1 p-2 border rounded"
          value={selectedAppointment}
          onChange={(e) => setSelectedAppointment(e.target.value)}
        >
          <option value="">Choose an appointment...</option>
          {confirmedAppointments.map((apt) => (
            <option key={apt.id} value={apt.id}>
              Chat with Dr. {apt.doctor.full_name}
            </option>
          ))}
        </select>
      </div>

      {selectedAppointment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Chat Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages Area */}
            <div className="h-64 overflow-y-auto border rounded p-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-center">No messages yet. Start the conversation!</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === profile?.user_id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender_id === profile?.user_id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender_id !== profile?.user_id && (
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {message.sender_name?.[0] || 'D'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1">
                          {message.sender_id !== profile?.user_id && (
                            <p className="text-xs font-medium mb-1">{message.sender_name}</p>
                          )}
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.sent_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChatComponent;