import { Link } from "react-router-dom";
import { Music, Library, Sparkles, LogOut, UserCircle, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Music className="w-8 h-8 text-primary group-hover:text-glow-cyan transition-colors animate-pulse-glow" />
            <span className="font-display text-2xl font-bold text-gradient-cyan">
              Gloriae Musica
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/archive">
              <Button variant="ghost" className="gap-2 text-foreground hover:text-primary transition-colors">
                <Library className="w-4 h-4" />
                <span>Archive</span>
              </Button>
            </Link>

            <Link to="/reflections">
              <Button variant="ghost" className="gap-2 text-foreground hover:text-secondary transition-colors">
                <Sparkles className="w-4 h-4" />
                <span>Reflections</span>
              </Button>
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link to="/dashboard">
                    <Button variant="ghost" className="gap-2 text-accent hover:text-glow-gold transition-colors">
                      <Shield className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                )}
                
                <Button
                  variant="ghost"
                  onClick={signOut}
                  className="gap-2 text-foreground hover:text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default" className="gap-2 glow-cyan">
                  <UserCircle className="w-4 h-4" />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
