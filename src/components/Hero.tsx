import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Shield, Users, Clock } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="min-h-screen bg-gradient-hero flex items-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-light rounded-full animate-float"></div>
        <div className="absolute top-60 right-32 w-20 h-20 bg-primary-dark rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/3 w-24 h-24 bg-primary rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-white animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Mental Health
              <span className="block text-primary-light">Matters</span>
            </h1>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Access professional, confidential, and affordable mental health support from licensed therapists in Rwanda. Break the silence, break the stigma.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 transition-all shadow-medium">
                Book a Session
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-light">500+</div>
                <div className="text-sm opacity-80">Happy Patients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-light">15+</div>
                <div className="text-sm opacity-80">Expert Therapists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-light">24/7</div>
                <div className="text-sm opacity-80">Support Available</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="grid grid-cols-2 gap-4 animate-slide-up">
            <Card className="p-6 bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20 transition-all shadow-medium">
              <Heart className="h-8 w-8 text-primary-light mb-4" />
              <h3 className="font-semibold mb-2">Compassionate Care</h3>
              <p className="text-sm opacity-80">Professional therapists who understand your journey</p>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20 transition-all shadow-medium">
              <Shield className="h-8 w-8 text-primary-light mb-4" />
              <h3 className="font-semibold mb-2">Complete Privacy</h3>
              <p className="text-sm opacity-80">Confidential sessions in a safe environment</p>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20 transition-all shadow-medium">
              <Users className="h-8 w-8 text-primary-light mb-4" />
              <h3 className="font-semibold mb-2">Expert Therapists</h3>
              <p className="text-sm opacity-80">Licensed professionals with years of experience</p>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20 transition-all shadow-medium">
              <Clock className="h-8 w-8 text-primary-light mb-4" />
              <h3 className="font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-sm opacity-80">Book sessions that fit your lifestyle</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;