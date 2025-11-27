import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Trash2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  is_moderated: boolean;
  music_sheet_id: string;
  profiles: {
    name: string | null;
    email: string;
  } | null;
  music_sheets: {
    title: string;
  } | null;
}

export default function ModerateComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();

    const channel = supabase
      .channel('admin-comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'music_comments',
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("music_comments")
        .select(`
          *,
          profiles (name, email),
          music_sheets (title)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading comments",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const handleDelete = async (commentId: string) => {
    if (!confirm("Delete this comment permanently?")) return;

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

  const pendingComments = comments.filter(c => !c.is_moderated);
  const approvedComments = comments.filter(c => c.is_moderated);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Loading comments...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moderate Comments</CardTitle>
        <CardDescription>
          Review and approve user comments on music sheets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pending Comments */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold">Pending Approval ({pendingComments.length})</h3>
          </div>
          
          {pendingComments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
              No comments pending approval
            </p>
          ) : (
            <div className="space-y-3">
              {pendingComments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 border border-yellow-200 rounded-lg bg-yellow-50/50 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary">
                          {comment.music_sheets?.title || "Unknown Sheet"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          by {comment.profiles?.name || "Anonymous"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { 
                            addSuffix: true 
                          })}
                        </span>
                      </div>
                      <p className="text-sm">{comment.comment}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApprove(comment.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approved Comments */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold">Approved Comments ({approvedComments.length})</h3>
          </div>
          
          {approvedComments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
              No approved comments yet
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {approvedComments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 border rounded-lg bg-background/30 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">
                          {comment.music_sheets?.title || "Unknown Sheet"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          by {comment.profiles?.name || "Anonymous"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { 
                            addSuffix: true 
                          })}
                        </span>
                      </div>
                      <p className="text-sm">{comment.comment}</p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(comment.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}