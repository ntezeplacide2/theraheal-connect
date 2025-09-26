import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Heart, Mail, Phone, MapPin, Globe } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Therapal Logo" className="h-10 w-10 rounded-lg" />
              <span className="text-2xl font-bold">Therapal</span>
            </div>
            <p className="text-primary-light leading-relaxed">
              Breaking barriers to mental health care in Rwanda. Accessible, confidential, 
              and professional therapy services for everyone.
            </p>
            <div className="flex items-center space-x-2 text-primary-light">
              <Heart className="h-4 w-4" />
              <span className="text-sm">Mental Health Matters</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <nav className="space-y-3">
              <a href="#home" className="block text-primary-light hover:text-white transition-colors">
                Home
              </a>
              <a href="#about" className="block text-primary-light hover:text-white transition-colors">
                About Us
              </a>
              <a href="#doctors" className="block text-primary-light hover:text-white transition-colors">
                Our Therapists
              </a>
              <a href="#services" className="block text-primary-light hover:text-white transition-colors">
                Services
              </a>
              <a href="#contact" className="block text-primary-light hover:text-white transition-colors">
                Contact
              </a>
            </nav>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <nav className="space-y-3">
              <a href="#" className="block text-primary-light hover:text-white transition-colors">
                Individual Therapy
              </a>
              <a href="#" className="block text-primary-light hover:text-white transition-colors">
                Group Sessions
              </a>
              <a href="#" className="block text-primary-light hover:text-white transition-colors">
                Crisis Support
              </a>
              <a href="#" className="block text-primary-light hover:text-white transition-colors">
                Video Consultations
              </a>
              <a href="#" className="block text-primary-light hover:text-white transition-colors">
                Family Counseling
              </a>
            </nav>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-primary-light">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+250 788 123 456</span>
              </div>
              <div className="flex items-center space-x-3 text-primary-light">
                <Mail className="h-4 w-4" />
                <span className="text-sm">support@therapal.rw</span>
              </div>
              <div className="flex items-center space-x-3 text-primary-light">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Kigali, Rwanda</span>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Newsletter</h4>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Your email" 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  />
                  <Button variant="secondary" size="sm">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-primary-light">
            © 2024 Therapal. All rights reserved. | Licensed Mental Health Platform
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="text-primary-light hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-primary-light hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-primary-light hover:text-white transition-colors">
              HIPAA Compliance
            </a>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span className="text-primary-light">EN | FR | RW</span>
            </div>
          </div>
        </div>

        {/* Crisis Support Notice */}
        <div className="mt-8 p-4 bg-destructive/20 rounded-lg border border-destructive/30">
          <div className="text-center">
            <p className="text-sm font-medium mb-2">
              🚨 Mental Health Crisis? Get Immediate Help
            </p>
            <p className="text-xs text-primary-light mb-3">
              If you're having thoughts of self-harm or suicide, please reach out immediately
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Button size="sm" variant="destructive">
                Crisis Hotline: 113
              </Button>
              <Button size="sm" variant="outline" className="border-white text-white hover:bg-white/10">
                Emergency Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;