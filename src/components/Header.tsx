import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, LogOut, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpeg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState("EN");
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const languages = [
    { code: "EN", name: "English" },
    { code: "FR", name: "Français" },
    { code: "RW", name: "Kinyarwanda" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Therapal Logo" className="h-10 w-10 rounded-lg shadow-soft" />
          <span className="text-2xl font-bold text-gradient">Therapal</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium">
            Home
          </a>
          <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
            About
          </a>
          <a href="#doctors" className="text-foreground hover:text-primary transition-colors font-medium">
            Our Doctors
          </a>
          <a href="#services" className="text-foreground hover:text-primary transition-colors font-medium">
            Services
          </a>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium">
            Contact
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="font-medium">
                <Globe className="h-4 w-4 mr-2" />
                {language}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={language === lang.code ? "bg-primary/10" : ""}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {user ? (
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="font-medium">
                    <User className="h-4 w-4 mr-2" />
                    {profile?.full_name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                Login
              </Button>
              <Button 
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
                onClick={() => navigate('/auth')}
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <a href="#home" className="block text-foreground hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a href="#about" className="block text-foreground hover:text-primary transition-colors font-medium">
              About
            </a>
            <a href="#doctors" className="block text-foreground hover:text-primary transition-colors font-medium">
              Our Doctors
            </a>
            <a href="#services" className="block text-foreground hover:text-primary transition-colors font-medium">
              Services
            </a>
            <a href="#contact" className="block text-foreground hover:text-primary transition-colors font-medium">
              Contact
            </a>
            <div className="flex items-center space-x-2 pt-4 border-t">
              {user ? (
                <>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={signOut}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate('/auth')}>
                    Login
                  </Button>
                  <Button className="bg-gradient-primary hover:opacity-90 transition-opacity flex-1" onClick={() => navigate('/auth')}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;