import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Library, Music4, Heart, Users, Gift } from "lucide-react";
import Navigation from "@/components/Navigation";
import Galaxy3D from "@/components/Galaxy3D";
import { useEffect, useRef } from "react";
const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, {
      threshold: 0.1
    });
    const elements = document.querySelectorAll(".scroll-fade-in");
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return <div className="min-h-screen bg-transparent relative">
      <Galaxy3D />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-blue-950/30 to-blue-900/40 pointer-events-none" />
      <Navigation />

      <main className="relative flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="text-center space-y-4 max-w-5xl mx-auto animate-fade-in">
          <div className="inline-block">
            <Music4 className="w-24 h-24 text-primary mx-auto mb-3 animate-float glow-blue" />
          </div>

          <h1 className="text-8xl font-bold text-gradient-animated leading-tight font-sans md:text-9xl -my-2">
            Gloriae Musica
          </h1>

          <p className="text-xl text-accent font-semibold md:text-4xl">
            Where Faith Meets Harmony
          </p>

          <p className="text-lg text-white max-w-2xl mx-auto">
            Explore our free, open-access archive of sacred liturgical music sheets.
            Discover timeless compositions and share in the beauty of sacred music.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link to="/archive">
              <Button size="lg" className="gap-2 text-lg px-8 py-6 glow-blue hover:scale-105 transition-transform">
                <Library className="w-5 h-5" />
                Browse Archive
              </Button>
            </Link>

            <Link to="/auth">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <Music4 className="w-5 h-5" />
                Join Community
              </Button>
            </Link>
          </div>

          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-3xl mx-auto">
            {[{
            title: "Free Access",
            desc: "All music sheets available at no cost",
            icon: Gift
          }, {
            title: "Sacred Heritage",
            desc: "Timeless liturgical compositions",
            icon: Heart
          }, {
            title: "Community Driven",
            desc: "Request songs and share feedback",
            icon: Users
          }].map((feature, i) => <div key={i} className="glass-card p-6 rounded-lg hover:scale-105 transition-all glow-blue scroll-fade-in" style={{
            animationDelay: `${i * 0.1}s`
          }}>
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2 font-sans">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>)}
          </div>
        </div>
      </main>
    </div>;
};
export default Index;