import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MessageSquare, Send, Trash2, ChevronRight, ChevronLeft, ImagePlus, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  image_url: string | null;
  created_at: string;
  profiles: {
    name: string | null;
    email: string;
  };
}

export default function CommunityChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('chat-collapsed');
    return saved === 'true';
  });
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('chat-collapsed', isCollapsed.toString());
  }, [isCollapsed]);

  useEffect(() => {
    if (!user) return;

    loadMessages();

    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        () => {
          loadMessages();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        id,
        user_id,
        message,
        image_url,
        created_at,
        profiles (
          name,
          email
        )
      `)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      console.error('Error loading messages:', error);
    } else {
      setMessages(data || []);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select an image file"
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Image must be less than 5MB"
      });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile || !user) return null;

    setUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Failed to upload image",
        description: error.message
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !imageFile) || !user) return;

    setLoading(true);
    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl && !newMessage.trim()) {
          setLoading(false);
          return;
        }
      }

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: newMessage.trim() || '',
          image_url: imageUrl
        });

      if (error) throw error;

      setNewMessage("");
      clearImage();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId: string, imageUrl: string | null) => {
    try {
      // Delete image from storage if exists
      if (imageUrl && user) {
        const path = imageUrl.split('/chat-images/')[1];
        if (path) {
          await supabase.storage.from('chat-images').remove([path]);
        }
      }

      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      toast({
        title: "Message deleted",
        description: "Your message has been removed"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to delete message",
        description: error.message
      });
    }
  };

  if (!user) return null;

  if (isCollapsed) {
    return (
      <div className="glass-card p-2 flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <MessageSquare className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Card className="glass-card h-[600px] flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-display">
              <MessageSquare className="w-5 h-5" />
              Community Chat
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(true)}
              title="Minimize chat"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            <div className="space-y-3">
              {messages.map((msg) => {
                const isOwnMessage = msg.user_id === user.id;
                const displayName = msg.profiles?.name || msg.profiles?.email.split('@')[0] || 'Anonymous';
                
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[80%]`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-primary">
                          {displayName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <div className={`rounded-lg px-4 py-2 ${
                        isOwnMessage 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        {msg.image_url && (
                          <img
                            src={msg.image_url}
                            alt="Chat image"
                            className="max-w-[200px] max-h-[200px] rounded-md mb-2 cursor-pointer hover:opacity-90 transition-opacity object-cover"
                            onClick={() => setViewImage(msg.image_url)}
                          />
                        )}
                        {msg.message && <p className="text-sm break-words">{msg.message}</p>}
                      </div>
                      {isOwnMessage && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMessage(msg.id, msg.image_url)}
                          className="mt-1 h-6 text-xs text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-24 rounded-md object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 w-6 h-6"
                onClick={clearImage}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}

          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || uploading}
            >
              <ImagePlus className="w-4 h-4" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={loading || uploading}
              maxLength={500}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={loading || uploading || (!newMessage.trim() && !imageFile)} 
              size="icon"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Image Lightbox */}
      <Dialog open={!!viewImage} onOpenChange={() => setViewImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          {viewImage && (
            <img
              src={viewImage}
              alt="Full size"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
