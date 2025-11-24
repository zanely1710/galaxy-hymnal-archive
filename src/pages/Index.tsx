import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Library, Music4 } from "lucide-react";
import Galaxy3D from "@/components/Galaxy3D";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Galaxy3D />
      <Navigation />
      
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto animate-fade-in">
          <div className="inline-block">
            <Music4 className="w-24 h-24 text-primary mx-auto mb-6 animate-float glow-cyan" />
          </div>
          
          <h1 className="font-display text-6xl md:text-8xl font-bold text-gradient-nebula leading-tight">
            Gloriae Musica
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Where Faith Meets Harmony
          </p>
          
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Explore our free, open-access archive of sacred liturgical music sheets. 
            Discover timeless compositions and share in the beauty of sacred music.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link to="/archive">
              <Button size="lg" className="gap-2 text-lg px-8 py-6 glow-cyan hover:scale-105 transition-transform">
                <Library className="w-5 h-5" />
                Browse Archive
              </Button>
            </Link>
            
            <Link to="/auth">
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 text-lg px-8 py-6 border-primary/50 hover:border-primary hover:bg-primary/10 transition-all"
              >
                <Music4 className="w-5 h-5" />
                Join Community
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-3xl mx-auto">
            {[
              { title: "Free Access", desc: "All music sheets available at no cost" },
              { title: "Sacred Heritage", desc: "Timeless liturgical compositions" },
              { title: "Community Driven", desc: "Request songs and share feedback" }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="glass-card p-6 rounded-lg hover:scale-105 transition-transform glow-purple"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <h3 className="font-display text-xl font-semibold text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
