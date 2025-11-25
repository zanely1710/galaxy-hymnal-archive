import { Link } from "react-router-dom";
import { Music, Library, Sparkles, LogOut, UserCircle, Shield, Info, MessageSquare, Menu, X, ChevronUp, ChevronDown, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import NotificationButton from "./NotificationButton";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export default function Navigation() {
  const { user, isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <nav className={`fixed left-0 right-0 z-50 glass-card border-b border-border transition-all duration-300 ${isCollapsed ? '-top-full' : 'top-0'}`}>
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Music className="w-6 h-6 md:w-8 md:h-8 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-bold text-gradient-animated font-sans text-2xl md:text-4xl">
              Gloriae Musica
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            <Link to="/founders">
              <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-primary transition-colors">
                <Info className="w-4 h-4" />
                <span>About</span>
              </Button>
            </Link>

            {user && (
              <>
                <Link to="/archive">
                  <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-primary transition-colors">
                    <Library className="w-4 h-4" />
                    <span>Archive</span>
                  </Button>
                </Link>

                <Link to="/reflections">
                  <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-secondary transition-colors">
                    <Sparkles className="w-4 h-4" />
                    <span>Reflections</span>
                  </Button>
                </Link>

                <Link to="/request-song">
                  <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-accent transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>Request</span>
                  </Button>
                </Link>

                <Link to="/donate">
                  <Button variant="ghost" size="sm" className="gap-2 text-foreground hover:text-primary transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>Donate</span>
                  </Button>
                </Link>

                {isAdmin && (
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="gap-2 text-accent hover:text-accent/80 transition-colors">
                      <Shield className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                )}

                <NotificationButton />

                <Button
                  variant="ghost"
                  size="sm"
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
                <Button variant="default" size="sm" className="gap-2 glow-blue">
                  <UserCircle className="w-4 h-4" />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex lg:hidden items-center gap-2">
            {user && <NotificationButton />}
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  <Link to="/founders" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Info className="w-4 h-4" />
                      <span>About</span>
                    </Button>
                  </Link>

                  {user && (
                    <>
                      <Link to="/archive" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <Library className="w-4 h-4" />
                          <span>Archive</span>
                        </Button>
                      </Link>

                      <Link to="/reflections" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <Sparkles className="w-4 h-4" />
                          <span>Reflections</span>
                        </Button>
                      </Link>

                      <Link to="/request-song" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <MessageSquare className="w-4 h-4" />
                          <span>Request</span>
                        </Button>
                      </Link>

                      <Link to="/donate" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <Heart className="w-4 h-4" />
                          <span>Donate</span>
                        </Button>
                      </Link>

                      {isAdmin && (
                        <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            <Shield className="w-4 h-4" />
                            <span>Dashboard</span>
                          </Button>
                        </Link>
                      )}

                      <Button
                        variant="ghost"
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </Button>
                    </>
                  )}

                  {!user && (
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="default" className="w-full gap-2 glow-blue">
                        <UserCircle className="w-4 h-4" />
                        <span>Sign In</span>
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          </div>
        </div>
      </nav>

      {/* Toggle Button */}
      <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        size="icon"
        variant="outline"
        className={`fixed right-4 z-50 transition-all duration-300 glass-card glow-blue ${isCollapsed ? 'top-4' : 'top-20'}`}
        title={isCollapsed ? "Show navigation" : "Hide navigation"}
      >
        {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
      </Button>
    </>
  );
}