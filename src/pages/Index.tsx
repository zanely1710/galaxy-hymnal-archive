import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Library, Music4, Heart, Users, Gift } from "lucide-react";
import Navigation from "@/components/Navigation";
import Galaxy3D from "@/components/Galaxy3D";
import { useEffect, useRef } from "react";
import gloriaeIcon from "@/assets/gloriae-icon.png";
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
  return <div className="min-h-screen bg-transparent relative particle-bg">
      <Galaxy3D />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-blue-950/40 to-blue-900/50 backdrop-blur-md pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />
      <Navigation />

      <main className="relative flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="text-center space-y-4 max-w-5xl mx-auto animate-fade-in-down">
          <div className="inline-block animate-scale-in">
            <img 
              src={gloriaeIcon} 
              alt="Gloriae Musica" 
              className="w-32 h-32 mx-auto mb-3 animate-float glow-blue rounded-3xl drop-shadow-2xl hover:scale-110 transition-transform duration-500"
            />
          </div>

          <h1 className="text-8xl font-bold text-gradient-animated leading-tight font-horizon md:text-9xl -my-2 drop-shadow-[0_0_40px_rgba(59,130,246,0.7)] hover:scale-105 transition-transform duration-300 shimmer">
            Gloriae Musica
          </h1>

          <p className="text-xl text-accent font-semibold md:text-4xl">
            Where Faith Meets Harmony
          </p>

          <p className="text-lg text-white max-w-2xl mx-auto">
            Explore our free, open-access archive of sacred liturgical music sheets.
            Discover timeless compositions and share in the beauty of sacred music.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-fade-in-up" style={{animationDelay: "0.2s"}}>
            <Link to="/archive">
              <Button size="lg" className="gap-2 text-lg px-8 py-6 glow-blue hover:scale-110 hover:shadow-2xl transition-all duration-300 shimmer group">
                <Library className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Browse Archive
              </Button>
            </Link>

            <Link to="/auth">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-2 border-primary hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-2xl transition-all duration-300 group">
                <Music4 className="w-5 h-5 group-hover:scale-125 transition-transform" />
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
          }].map((feature, i) => <div key={i} className="glass-card-intense p-8 rounded-xl hover-lift scroll-fade-in group relative overflow-hidden" style={{
            animationDelay: `${i * 0.15}s`
          }}>
                <div className="relative z-10">
                  <feature.icon className="w-14 h-14 text-primary mx-auto mb-4 drop-shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-pulse-glow" />
                  <h3 className="text-xl font-bold text-primary mb-3 font-sans group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-foreground group-hover:text-foreground/90 transition-colors">{feature.desc}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>)}
          </div>
        </div>
      </main>
    </div>;
};
export default Index;