import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Lightbulb, Users, MapPin } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-20 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">About Therapal</Badge>
          <h2 className="text-4xl font-bold mb-6 text-gradient">
            Bridging the Mental Health Gap in Rwanda
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Therapal addresses the critical shortage of mental health professionals and geographical barriers 
            that prevent young people from accessing timely, professional therapy services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-semibold mb-6">The Challenge We're Solving</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <p className="text-muted-foreground">
                  <strong>Limited Access:</strong> Shortage of mental health specialists creates long waiting times
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <p className="text-muted-foreground">
                  <strong>Geographic Barriers:</strong> Rural areas lack accessible mental health services
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <p className="text-muted-foreground">
                  <strong>Stigma & Silence:</strong> Cultural barriers discourage seeking help
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <p className="text-muted-foreground">
                  <strong>Escalating Issues:</strong> Untreated cases lead to severe outcomes
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-card rounded-2xl p-8 shadow-medium">
            <h3 className="text-2xl font-semibold mb-6">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              To provide accessible, confidential, and affordable mental health support that complements 
              existing services and empowers young people to take control of their mental wellbeing.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">3</div>
                <div className="text-sm text-muted-foreground">Languages Supported</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Platform Access</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card className="shadow-soft hover:shadow-medium transition-all">
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Our Vision</h4>
              <p className="text-sm text-muted-foreground">
                A Rwanda where mental health support is accessible to all
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-all">
            <CardContent className="p-6 text-center">
              <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Innovation</h4>
              <p className="text-sm text-muted-foreground">
                Digital-first approach to mental health care
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-all">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Community</h4>
              <p className="text-sm text-muted-foreground">
                Building supportive networks for healing
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-all">
            <CardContent className="p-6 text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Local Focus</h4>
              <p className="text-sm text-muted-foreground">
                Designed specifically for Rwandan communities
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;