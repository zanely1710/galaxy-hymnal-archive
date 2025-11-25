import { Link } from "react-router-dom";
import { Music, Library, Sparkles, LogOut, UserCircle, Shield, Info, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Music className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-bold text-gradient-animated font-sans text-4xl">
              Gloriae Musica
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/founders">
              <Button variant="ghost" className="gap-2 text-foreground hover:text-primary transition-colors">
                <Info className="w-4 h-4" />
                <span>About</span>
              </Button>
            </Link>

            {user && (
              <>
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

                <Link to="/request-song">
                  <Button variant="ghost" className="gap-2 text-foreground hover:text-accent transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>Request</span>
                  </Button>
                </Link>

                {isAdmin && (
                  <Link to="/dashboard">
                    <Button variant="ghost" className="gap-2 text-accent hover:text-accent/80 transition-colors">
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
            )}

            {!user && (
              <Link to="/auth">
                <Button variant="default" className="gap-2 glow-blue">
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