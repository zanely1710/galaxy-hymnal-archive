import { Link } from "react-router-dom";
import { Music, Library, Sparkles, LogOut, UserCircle, Shield, Info, MessageSquare, Menu, X, ChevronUp, ChevronDown, Heart, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import NotificationButton from "./NotificationButton";
import { useState, useEffect } from "react";
import gloriaeLogoImage from "@/assets/gloriae-logo.png";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export default function Navigation() {
  const { user, isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('nav-collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('nav-collapsed', isCollapsed.toString());
  }, [isCollapsed]);

  return (
    <>
      <nav className={`fixed left-0 right-0 z-50 glass-card border-b border-border transition-all duration-300 ${isCollapsed ? '-top-full' : 'top-0'}`}>
        <div className="container mx-auto px-3 md:px-4 py-2 md:py-3">
          <div className="flex items-center justify-start gap-4 md:gap-6">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-0 group hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <img 
              src={gloriaeLogoImage} 
              alt="Gloriae Musica" 
              className="w-8 h-8 md:w-10 md:h-10 group-hover:rotate-12 transition-transform duration-300 drop-shadow-2xl shrink-0" 
            />
            <span className="font-bold text-gradient-animated font-sans text-xl lg:text-2xl xl:text-3xl whitespace-nowrap max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500">
              Gloriae Musica
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 flex-wrap">
            <Link to="/founders">
              <Button variant="ghost" size="sm" className="gap-0 text-foreground hover:text-primary transition-all duration-300 px-2 xl:px-3 group overflow-hidden">
                <Info className="w-4 h-4 shrink-0" />
                <span className="text-sm max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-1 transition-all duration-300 whitespace-nowrap">About</span>
              </Button>
            </Link>

            {user && (
              <>
                <Link to="/archive">
                  <Button variant="ghost" size="sm" className="gap-0 text-foreground hover:text-primary transition-all duration-300 px-2 xl:px-3 group overflow-hidden">
                    <Library className="w-4 h-4 shrink-0" />
                    <span className="text-sm max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-1 transition-all duration-300 whitespace-nowrap">Archive</span>
                  </Button>
                </Link>

                <Link to="/reflections">
                  <Button variant="ghost" size="sm" className="gap-0 text-foreground hover:text-secondary transition-all duration-300 px-2 xl:px-3 group overflow-hidden">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span className="text-sm max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-1 transition-all duration-300 whitespace-nowrap">Reflections</span>
                  </Button>
                </Link>

                <Link to="/request-song">
                  <Button variant="ghost" size="sm" className="gap-0 text-foreground hover:text-accent transition-all duration-300 px-2 xl:px-3 group overflow-hidden">
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span className="text-sm max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-1 transition-all duration-300 whitespace-nowrap">Request</span>
                  </Button>
                </Link>

                <Link to="/donate">
                  <Button variant="ghost" size="sm" className="gap-0 text-foreground hover:text-primary transition-all duration-300 px-2 xl:px-3 group overflow-hidden">
                    <Heart className="w-4 h-4 shrink-0" />
                    <span className="text-sm max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-1 transition-all duration-300 whitespace-nowrap">Donate</span>
                  </Button>
                </Link>

                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-0 text-foreground hover:text-primary transition-all duration-300 px-2 xl:px-3 group overflow-hidden">
                    <UserCircle className="w-4 h-4 shrink-0" />
                    <span className="text-sm max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-1 transition-all duration-300 whitespace-nowrap">Profile</span>
                  </Button>
                </Link>
                
                <Link to="/settings">
                  <Button variant="ghost" size="sm" className="gap-0 text-foreground hover:text-primary transition-all duration-300 px-2 xl:px-3 group overflow-hidden">
                    <Settings className="w-4 h-4 shrink-0" />
                    <span className="text-sm max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-1 transition-all duration-300 whitespace-nowrap">Settings</span>
                  </Button>
                </Link>

                {isAdmin && (
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="gap-0 text-accent hover:text-accent/80 transition-all duration-300 px-2 xl:px-3 group overflow-hidden">
                      <Shield className="w-4 h-4 shrink-0" />
                      <span className="text-sm max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-1 transition-all duration-300 whitespace-nowrap">Dashboard</span>
                    </Button>
                  </Link>
                )}

                <NotificationButton />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="gap-0 text-foreground hover:text-destructive transition-all duration-300 px-2 xl:px-3 group overflow-hidden"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span className="text-sm max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-1 transition-all duration-300 whitespace-nowrap">Sign Out</span>
                </Button>
              </>
            )}

            {!user && (
              <Link to="/auth">
                <Button variant="default" size="sm" className="gap-0 glow-blue px-3 xl:px-4 group overflow-hidden">
                  <UserCircle className="w-4 h-4 shrink-0" />
                  <span className="text-sm max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-1 transition-all duration-300 whitespace-nowrap">Sign In</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex lg:hidden items-center gap-2 ml-auto">
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
                      
                      <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <UserCircle className="w-4 h-4" />
                          <span>Profile</span>
                        </Button>
                      </Link>
                      
                      <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
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