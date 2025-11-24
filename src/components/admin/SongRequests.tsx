import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Trash2, MessageSquare } from "lucide-react";

interface SongRequest {
  id: string;
  title: string;
  message: string | null;
  completed: boolean;
  created_at: string;
  profiles: {
    name: string | null;
    email: string;
  } | null;
}

interface Props {
  requests: SongRequest[];
  onUpdate: () => void;
}

export default function SongRequests({ requests, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('song_requests')
        .update({ completed: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: currentStatus ? "Marked as incomplete" : "Marked as complete",
        description: "Request status updated successfully",
      });

      onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating request",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete request "${title}"?`)) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('song_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Request deleted",
        description: "Song request has been deleted successfully",
      });

      onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting request",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-accent">
          <MessageSquare className="w-5 h-5" />
          Song Requests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No song requests yet
          </p>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className="p-4 bg-card/50 rounded-lg border border-border/50 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{request.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    by {request.profiles?.name || request.profiles?.email || "Unknown"}
                  </p>
                  {request.message && (
                    <p className="text-sm text-foreground/80 mt-2">{request.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={request.completed ? "default" : "secondary"}>
                  {request.completed ? "Completed" : "Pending"}
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleComplete(request.id, request.completed)}
                  disabled={loading}
                  className={request.completed ? "" : "border-primary text-primary"}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {request.completed ? "Reopen" : "Complete"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(request.id, request.title)}
                  disabled={loading}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
