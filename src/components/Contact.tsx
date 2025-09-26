import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, MessageCircle, Calendar } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Get in Touch</Badge>
          <h2 className="text-4xl font-bold mb-6 text-gradient">
            Contact Therapal
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have questions about our services? Need immediate support? We're here to help.
            Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name</label>
                    <Input placeholder="Enter your full name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email Address</label>
                    <Input type="email" placeholder="your.email@example.com" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone Number</label>
                    <Input placeholder="+250 XXX XXX XXX" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Preferred Language</label>
                    <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="rw">Kinyarwanda</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                    <option value="">Select a subject</option>
                    <option value="booking">Session Booking</option>
                    <option value="support">Technical Support</option>
                    <option value="emergency">Crisis Support</option>
                    <option value="general">General Inquiry</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea 
                    placeholder="Tell us how we can help you..." 
                    rows={6}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="urgent" className="rounded" />
                  <label htmlFor="urgent" className="text-sm text-muted-foreground">
                    This is an urgent matter requiring immediate attention
                  </label>
                </div>

                <Button className="w-full bg-gradient-primary hover:opacity-90">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Crisis Support Card */}
            <Card className="shadow-medium bg-destructive/5 border-destructive/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <MessageCircle className="h-6 w-6 text-destructive" />
                  <h3 className="font-semibold text-destructive">Crisis Support</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  If you're experiencing a mental health crisis, please reach out immediately.
                </p>
                <Button variant="destructive" className="w-full mb-2">
                  Emergency Chat
                </Button>
                <Button variant="outline" className="w-full">
                  Call Crisis Hotline
                </Button>
              </CardContent>
            </Card>

            {/* Contact Details */}
            <Card className="shadow-medium">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">Phone</div>
                        <div className="text-sm text-muted-foreground">+250 788 123 456</div>
                        <div className="text-sm text-muted-foreground">+250 788 654 321</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-sm text-muted-foreground">support@therapal.rw</div>
                        <div className="text-sm text-muted-foreground">crisis@therapal.rw</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">Locations</div>
                        <div className="text-sm text-muted-foreground">Kigali, Butare, Musanze</div>
                        <div className="text-sm text-muted-foreground">& Remote Services</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">Business Hours</div>
                        <div className="text-sm text-muted-foreground">Mon-Fri: 8AM - 8PM</div>
                        <div className="text-sm text-muted-foreground">Sat-Sun: 10AM - 6PM</div>
                        <div className="text-sm text-muted-foreground font-medium text-primary">
                          Crisis Support: 24/7
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-medium bg-gradient-card">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book a Session
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Live Chat
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Request Callback
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;