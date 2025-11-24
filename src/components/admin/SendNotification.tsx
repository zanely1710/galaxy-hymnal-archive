import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";
import { z } from "zod";

const notificationSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  message: z.string().trim().min(1, "Message is required").max(500, "Message must be less than 500 characters"),
});

export default function SendNotification() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = notificationSchema.parse({ title, message });
      
      setSending(true);

      // Get all user IDs
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id');

      if (usersError) throw usersError;

      if (!users || users.length === 0) {
        toast({
          title: "No users found",
          description: "There are no users to send notifications to",
        });
        return;
      }

      // Create notifications for all users
      const notifications = users.map(user => ({
        user_id: user.id,
        title: validatedData.title,
        message: validatedData.message,
      }));

      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) throw error;

      toast({
        title: "Notifications sent!",
        description: `Sent to ${users.length} user${users.length > 1 ? 's' : ''}`,
      });

      setTitle("");
      setMessage("");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.errors[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error sending notifications",
          description: error.message,
        });
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-glow-gold">
          <Bell className="w-5 h-5" />
          Send Notification to All Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSend} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notif-title">Title *</Label>
            <Input
              id="notif-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New music sheets available!"
              required
              maxLength={100}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notif-message">Message *</Label>
            <Textarea
              id="notif-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Check out our latest collection of sacred music..."
              rows={4}
              required
              maxLength={500}
              className="bg-background/50"
            />
            <p className="text-xs text-muted-foreground">
              {message.length}/500 characters
            </p>
          </div>

          <Button
            type="submit"
            disabled={sending}
            className="w-full glow-gold"
            size="lg"
          >
            <Bell className="w-4 h-4 mr-2" />
            {sending ? "Sending..." : "Send to All Users"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
