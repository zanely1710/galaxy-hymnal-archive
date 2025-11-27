import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Trash2, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  user_id: string;
  is_moderated: boolean;
  profiles: {
    name: string | null;
    email: string;
  } | null;
}

interface MusicSheetCommentsProps {
  musicSheetId: string;
}

export default function MusicSheetComments({ musicSheetId }: MusicSheetCommentsProps) {
  const { user, isAdmin } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel(`comments:${musicSheetId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'music_comments',
          filter: `music_sheet_id=eq.${musicSheetId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [musicSheetId]);

  const fetchComments = async () => {
    try {
      const { data: commentsData, error } = await supabase
        .from("music_comments")
        .select("*")
        .eq("music_sheet_id", musicSheetId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      const userIds = [...new Set(commentsData?.map(c => c.user_id) || [])];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, name, email")
        .in("id", userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      
      const data = commentsData?.map(comment => ({
        ...comment,
        profiles: profilesMap.get(comment.user_id) || null,
      }));

      setComments((data || []) as unknown as Comment[]);
    } catch (error: any) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("music_comments")
        .insert({
          music_sheet_id: musicSheetId,
          user_id: user.id,
          comment: newComment.trim(),
          is_moderated: isAdmin, // Auto-approve admin comments
        });

      if (error) throw error;

      toast({
        title: "Comment posted",
        description: isAdmin 
          ? "Your comment is now visible" 
          : "Your comment will be visible after moderation",
      });

      setNewComment("");
      fetchComments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    try {
      const { error } = await supabase
        .from("music_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      toast({
        title: "Comment deleted",
      });
      fetchComments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("music_comments")
        .update({ is_moderated: true })
        .eq("id", commentId);

      if (error) throw error;

      toast({
        title: "Comment approved",
      });
      fetchComments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const visibleComments = isAdmin 
    ? comments 
    : comments.filter(c => c.is_moderated || c.user_id === user?.id);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Comments ({visibleComments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts, ask questions, or give feedback..."
              rows={3}
              maxLength={500}
              className="bg-background/50"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {newComment.length}/500 characters
              </span>
              <Button 
                type="submit" 
                disabled={!newComment.trim() || submitting}
                size="sm"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </form>
        )}

        {!user && (
          <p className="text-center text-muted-foreground py-4">
            Please sign in to comment
          </p>
        )}

        <div className="space-y-4 mt-6">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading comments...</p>
          ) : visibleComments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            visibleComments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 border rounded-lg space-y-2 bg-background/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {comment.profiles?.name?.charAt(0) || 
                         comment.profiles?.email?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">
                          {comment.profiles?.name || "Anonymous"}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { 
                            addSuffix: true 
                          })}
                        </span>
                        {!comment.is_moderated && (
                          <Badge variant="secondary" className="text-xs">
                            Pending approval
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm mt-1 text-foreground/90">
                        {comment.comment}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {isAdmin && !comment.is_moderated && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApprove(comment.id)}
                        title="Approve comment"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </Button>
                    )}
                    {(isAdmin || comment.user_id === user?.id) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(comment.id)}
                        title="Delete comment"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}