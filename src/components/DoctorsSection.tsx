import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Calendar, Award } from "lucide-react";

const DoctorsSection = () => {
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Mukamana",
      specialization: "Clinical Psychology",
      experience: "8+ years",
      rating: 4.9,
      reviews: 156,
      languages: ["English", "Kinyarwanda", "French"],
      location: "Kigali",
      expertise: ["Anxiety Disorders", "Depression", "Trauma Therapy", "Youth Counseling"],
      education: "PhD Clinical Psychology - University of Rwanda",
      bio: "Specialized in trauma-informed care and youth mental health with extensive experience in community-based interventions.",
      availability: "Mon-Fri, 8AM-6PM",
      image: "/api/placeholder/300/300"
    },
    {
      id: 2,
      name: "Dr. Jean Baptiste Nzeyimana",
      specialization: "Psychiatry",
      experience: "12+ years",
      rating: 4.8,
      reviews: 203,
      languages: ["English", "Kinyarwanda"],
      location: "Butare",
      expertise: ["Mood Disorders", "PTSD", "Substance Abuse", "Family Therapy"],
      education: "MD Psychiatry - King Faisal Hospital",
      bio: "Leading psychiatrist with focus on culturally-sensitive approaches to mental health treatment in rural communities.",
      availability: "Tue-Sat, 9AM-5PM",
      image: "/api/placeholder/300/300"
    },
    {
      id: 3,
      name: "Dr. Grace Uwimana",
      specialization: "Counseling Psychology",
      experience: "6+ years",
      rating: 4.9,
      reviews: 124,
      languages: ["English", "Kinyarwanda", "French"],
      location: "Musanze",
      expertise: ["Adolescent Therapy", "Group Counseling", "Crisis Intervention", "Mindfulness"],
      education: "MA Counseling Psychology - University of Rwanda",
      bio: "Passionate about adolescent mental health and implementing mindfulness-based therapeutic interventions.",
      availability: "Mon-Thu, 10AM-7PM",
      image: "/api/placeholder/300/300"
    }
  ];

  return (
    <section id="doctors" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Our Expert Team</Badge>
          <h2 className="text-4xl font-bold mb-6 text-gradient">
            Meet Our Licensed Therapists
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our team consists of highly qualified, licensed mental health professionals 
            with deep understanding of Rwandan culture and mental health challenges.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="shadow-medium hover:shadow-strong transition-all bg-gradient-card">
              <CardContent className="p-6">
                {/* Doctor Image */}
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-12 w-12 text-primary" />
                </div>

                {/* Doctor Info */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{doctor.name}</h3>
                  <Badge variant="outline" className="mb-2">{doctor.specialization}</Badge>
                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span>{doctor.rating}</span>
                      <span>({doctor.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{doctor.location}</span>
                    <span>•</span>
                    <span>{doctor.experience}</span>
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Languages:</h4>
                  <div className="flex flex-wrap gap-1">
                    {doctor.languages.map((lang) => (
                      <Badge key={lang} variant="secondary" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Expertise */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Specializes in:</h4>
                  <div className="flex flex-wrap gap-1">
                    {doctor.expertise.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {doctor.expertise.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{doctor.expertise.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {doctor.bio}
                </p>

                {/* Availability */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
                  <Calendar className="h-4 w-4" />
                  <span>{doctor.availability}</span>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button className="w-full bg-gradient-primary hover:opacity-90">
                    Book Session
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Full Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Therapists
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;