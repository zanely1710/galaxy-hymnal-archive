import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Music, Send } from "lucide-react";
import { z } from "zod";

const requestSchema = z.object({
  title: z.string().min(1, "Song title is required").max(200, "Title is too long"),
  message: z.string().max(1000, "Message is too long").optional(),
});

export default function RequestSong() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to request a song",
      });
      return;
    }

    try {
      setLoading(true);
      
      const validated = requestSchema.parse({ title, message });

      const { error } = await supabase.from("song_requests").insert({
        title: validated.title,
        message: validated.message || null,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Request submitted!",
        description: "We'll review your song request soon.",
      });

      setTitle("");
      setMessage("");
      navigate("/archive");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: error.errors[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Request failed",
          description: error.message || "Failed to submit request",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="font-display text-5xl font-bold text-gradient-blue mb-4">
            Request a Song
          </h1>
          <p className="text-lg text-muted-foreground">
            Can't find the music you're looking for? Let us know and we'll try to add it to our archive.
          </p>
        </div>

        <Card className="glass-card glow-blue animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-primary">
              <Music className="w-6 h-6" />
              Song Request Form
            </CardTitle>
            <CardDescription>
              Tell us what sacred music you'd like to see in our archive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Song Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Ave Maria, O Holy Night..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={200}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Details (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add any details like composer name, specific arrangement, or why you'd like this piece..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={1000}
                  rows={5}
                  className="bg-background/50 resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {message.length}/1000 characters
                </p>
              </div>

              <Button
                type="submit"
                className="w-full glow-blue"
                disabled={loading}
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
