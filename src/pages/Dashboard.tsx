import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Galaxy3D from "@/components/Galaxy3D";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Music, Users, MessageSquare } from "lucide-react";

export default function Dashboard() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Galaxy3D />
        <div className="relative z-10 text-center">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Galaxy3D />
      <Navigation />

      <main className="relative z-10 container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="font-display text-5xl font-bold text-gradient-nebula mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage Gloriae Musica content and users
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="glass-card glow-cyan hover:scale-105 transition-transform">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-primary">
                <Music className="w-5 h-5" />
                Music Sheets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground mb-2">0</p>
              <p className="text-sm text-muted-foreground">Total sheets in archive</p>
            </CardContent>
          </Card>

          <Card className="glass-card glow-purple hover:scale-105 transition-transform">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-secondary">
                <Users className="w-5 h-5" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground mb-2">0</p>
              <p className="text-sm text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card className="glass-card glow-gold hover:scale-105 transition-transform">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-accent">
                <MessageSquare className="w-5 h-5" />
                Song Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground mb-2">0</p>
              <p className="text-sm text-muted-foreground">Pending requests</p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card mt-8">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-primary">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Dashboard features coming soon: Upload music sheets, manage categories,
              handle song requests, send notifications, and more.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
