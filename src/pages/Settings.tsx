import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Galaxy3D from "@/components/Galaxy3D";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Settings as SettingsIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, [user]);

  useEffect(() => {
    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const fetchSettings = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("profiles")
      .select("appearance_mode")
      .eq("id", user.id)
      .single();

    if (data) {
      setDarkMode(data.appearance_mode === "dark");
    }
    setLoading(false);
  };

  const handleToggleDarkMode = async (checked: boolean) => {
    setDarkMode(checked);
    
    const { error } = await supabase
      .from("profiles")
      .update({ appearance_mode: checked ? "dark" : "light" })
      .eq("id", user?.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Settings updated",
        description: `${checked ? "Dark" : "Light"} mode enabled`,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <SettingsIcon className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent relative particle-bg">
      <Galaxy3D />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-blue-950/40 to-blue-900/50 backdrop-blur-md pointer-events-none" />
      <Navigation />

      <main className="relative container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white">Settings</h1>
            <p className="text-muted-foreground">Manage your preferences</p>
          </div>

          <Card className="glass-card-intense">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how Gloriae Musica looks for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={handleToggleDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gloriae Musica - A free, open-access archive of sacred liturgical music sheets.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}