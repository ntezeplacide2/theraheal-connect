import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Video, 
  Calendar, 
  CreditCard, 
  Smartphone, 
  Clock,
  Shield,
  Globe
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: MessageCircle,
      title: "One-on-One Therapy",
      description: "Private therapy sessions with licensed professionals in your preferred language",
      features: ["45-60 minute sessions", "Confidential environment", "Personalized treatment plans"]
    },
    {
      icon: Video,
      title: "Video Consultations",
      description: "Secure video calls for remote therapy sessions from anywhere in Rwanda",
      features: ["High-quality video", "Screen sharing capabilities", "Session recordings available"]
    },
    {
      icon: MessageCircle,
      title: "Crisis Support Chat",
      description: "24/7 crisis intervention and immediate support when you need it most",
      features: ["Immediate response", "Trained crisis counselors", "Emergency protocols"]
    },
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description: "Book, reschedule, or cancel appointments easily through our platform",
      features: ["Real-time availability", "Automated reminders", "Easy rescheduling"]
    }
  ];

  const paymentMethods = [
    {
      icon: CreditCard,
      title: "Bank Card Payments",
      description: "Secure payment processing with major credit and debit cards",
      methods: ["Visa", "Mastercard", "Local bank cards"]
    },
    {
      icon: Smartphone,
      title: "Mobile Money",
      description: "Pay conveniently using popular mobile money services",
      methods: ["MTN Mobile Money", "Airtel Money", "Tigo Cash"]
    }
  ];

  const features = [
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Access therapy in English, French, and Kinyarwanda"
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Early morning to evening sessions to fit your schedule"
    },
    {
      icon: Shield,
      title: "Complete Privacy",
      description: "End-to-end encryption and strict confidentiality protocols"
    }
  ];

  return (
    <section id="services" className="py-20 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Our Services</Badge>
          <h2 className="text-4xl font-bold mb-6 text-gradient">
            Comprehensive Mental Health Support
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From individual therapy to crisis support, we offer a full range of mental health services 
            designed to meet your unique needs and preferences.
          </p>
        </div>

        {/* Main Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="shadow-soft hover:shadow-medium transition-all bg-gradient-card">
              <CardHeader className="text-center">
                <service.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Payment Options</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {paymentMethods.map((method, index) => (
              <Card key={index} className="shadow-soft bg-gradient-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <method.icon className="h-8 w-8 text-primary mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{method.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {method.methods.map((m, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {m}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-soft text-center">
              <CardContent className="p-6">
                <feature.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-hero max-w-2xl mx-auto">
            <CardContent className="p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Your Healing Journey?</h3>
              <p className="mb-6 opacity-90">
                Take the first step towards better mental health. Book your first session today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Book Your Session
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Services;