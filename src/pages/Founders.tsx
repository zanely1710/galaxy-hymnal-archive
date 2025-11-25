import Navigation from "@/components/Navigation";
import Galaxy3D from "@/components/Galaxy3D";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Heart, Music } from "lucide-react";
export default function Founders() {
  return <div className="min-h-screen bg-transparent relative">
      <Galaxy3D />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-blue-950/30 to-blue-900/40 backdrop-blur-sm pointer-events-none" />
      <Navigation />

      <main className="relative container mx-auto px-4 pt-24 pb-16">
        <div className="mb-12 text-center animate-fade-in-up">
          <h1 className="font-display text-5xl font-bold text-gradient-blue mb-4">
            About the Founders
          </h1>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Meet the passionate individuals behind Gloriae Musica
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Main Founder Card */}
          <Card className="glass-card backdrop-blur-md glow-blue overflow-hidden animate-fade-in-up" style={{
          animationDelay: "0.1s"
        }}>
            <div className="md:flex">
              <div className="md:w-1/3 bg-gradient-to-br from-primary to-secondary p-8 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Music className="w-24 h-24 text-white" />
                </div>
              </div>
              <CardContent className="md:w-2/3 p-8">
                <h2 className="text-3xl font-bold text-primary mb-2">Sem. Eleandre John Del Rosario</h2>
                <p className="text-accent font-semibold mb-4">Founder & Creator       </p>
                
                <div className="space-y-4 text-foreground">
                  <p>
                    A dedicated seminarian and passionate advocate for sacred music, Sem. Eleandre John has devoted his ministry to preserving and sharing the rich tradition of liturgical music within the Catholic Church.
                  </p>
                  <p>
                      His deep love for both traditional and contemporary sacred compositions, he founded Gloriae Musica to create a free, accessible resource for parishes, choirs, and music ministers around the Philippines.
                  </p>
                  <p>
                    His vision is to make quality sacred music available to all, fostering deeper worship and bringing 
                    communities closer to God through the beauty of liturgical song.
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2 text-primary">
                  <Mail className="w-5 h-5" />
                  <a href="mailto:ejdelrosario.jhs@assumptaseminary.ph.education" className="hover:underline">
                    ejdelrosario.jhs@assumptaseminary.ph.education
                  </a>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Mission Statement */}
          <Card className="glass-card backdrop-blur-md glow-gold animate-fade-in-up" style={{
          animationDelay: "0.2s"
        }}>
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <Heart className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-3">Our Mission</h3>
                  <p className="text-foreground leading-relaxed">
                    Gloriae Musica exists to serve the Church by providing free access to high-quality sacred music sheets. We believe that beautiful liturgical music should be available to every parish, choir, and individual who wishes to glorify God through song. Our archive grows through the dedication of contributors worldwide, united in the mission of making sacred music accessible to all.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vision Statement */}
          <Card className="glass-card backdrop-blur-md glow-blue animate-fade-in-up" style={{
          animationDelay: "0.3s"
        }}>
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <Music className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-3">Our Vision</h3>
                  <p className="text-foreground leading-relaxed">
                    We envision a place where every Catholic community, regardless of resources, has access to the rich treasury of sacred music. Through Gloriae Musica, we aim to foster a renewed appreciation for liturgical music excellence, encourage participation in worship, and support music ministers in their sacred calling to lead God's people in praise.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>;
}