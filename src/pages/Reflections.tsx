import { useState } from "react";
import Navigation from "@/components/Navigation";
import Galaxy3D from "@/components/Galaxy3D";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function Reflections() {
  const [reflection, setReflection] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const generateReflection = async () => {
    setLoading(true);
    // Placeholder for AI integration
    setTimeout(() => {
      setReflection(
        "Like a warm cup of coffee in the morning, faith nourishes our souls. In the midst of our busy lives, let us pause and remember: God's grace is always present, gentle as a sunrise, constant as the morning dew. May your day be blessed with peace and harmony."
      );
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Galaxy3D />
      <Navigation />

      <main className="relative z-10 container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl font-bold text-gradient-nebula mb-4">
            Spiritual Reflections
          </h1>
          <p className="text-lg text-muted-foreground">
            Inspired by the warmth of Kape't Pandesal
          </p>
        </div>

        <Card className="glass-card glow-purple">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-center text-primary">
              Generate a Reflection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={generateReflection}
              disabled={loading}
              className="w-full glow-cyan"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {loading ? "Reflecting..." : "Generate Reflection"}
            </Button>

            {reflection && (
              <div className="p-6 bg-card/50 rounded-lg border border-primary/20 animate-fade-in">
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
