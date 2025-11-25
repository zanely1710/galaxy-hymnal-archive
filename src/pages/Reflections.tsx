import { useState } from "react";
import Navigation from "@/components/Navigation";
import Galaxy3D from "@/components/Galaxy3D";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Reflections() {
  const [reflection, setReflection] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const generateReflection = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Sign in required",
        description: "Please sign in to generate reflections",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-reflection", {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) {
        if (error.message.includes("429")) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        if (error.message.includes("402")) {
          throw new Error("Payment required. Please add credits to continue.");
        }
        throw error;
      }

      setReflection(data.reflection);
    } catch (error: any) {
      console.error("Error generating reflection:", error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: error.message || "Failed to generate reflection",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      <Galaxy3D />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-blue-950/30 to-blue-900/40 backdrop-blur-sm pointer-events-none" />
      <Navigation />

      <main className="relative container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="font-display text-5xl font-bold text-gradient-blue mb-4">
            Spiritual Reflections
          </h1>
          <p className="text-lg text-white">
            Inspired by the warmth of Kape't Pandesal
          </p>
        </div>

        <Card className="glass-card backdrop-blur-md glow-blue animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="font-display text-2xl text-center text-primary">
              Generate a Reflection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={generateReflection}
              disabled={loading}
              className="w-full glow-blue"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {loading ? "Reflecting..." : "Generate Reflection"}
            </Button>

            {reflection && (
              <div className="p-6 bg-card rounded-lg border border-primary/20 animate-fade-in">
                <p className="text-foreground leading-relaxed text-center italic">
                  "{reflection}"
                </p>
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground">
              <p>
                These reflections are inspired by Catholic devotional traditions,
                offering warm, spiritual insights for daily meditation.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
