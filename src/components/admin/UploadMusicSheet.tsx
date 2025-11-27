import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Music } from "lucide-react";
import { z } from "zod";

const musicSheetSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  composer: z.string().trim().max(100, "Composer name must be less than 100 characters").optional(),
  description: z.string().trim().max(1000, "Description must be less than 1000 characters").optional(),
  category_id: z.string().uuid("Please select a category"),
});

interface Category {
  id: string;
  name: string;
}

interface MusicEvent {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  stock_limit: number | null;
  stock_remaining: number | null;
}

interface Props {
  categories: Category[];
  events?: MusicEvent[];
  onUploadSuccess: () => void;
}

export default function UploadMusicSheet({ categories, events = [], onUploadSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [composer, setComposer] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [eventId, setEventId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validatedData = musicSheetSchema.parse({
        title,
        composer: composer || undefined,
        description: description || undefined,
        category_id: categoryId,
      });

      if (!file) {
        toast({
          variant: "destructive",
          title: "File required",
          description: "Please select a music sheet file to upload",
        });
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "File size must be less than 10MB",
        });
        return;
      }

      setUploading(true);

      // Upload main file
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `sheets/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('music-sheets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl: fileUrl } } = supabase.storage
        .from('music-sheets')
        .getPublicUrl(filePath);

      // Upload thumbnail if provided
      let thumbnailUrl = null;
      if (thumbnail) {
        if (thumbnail.size > 5 * 1024 * 1024) {
          toast({
            variant: "destructive",
            title: "Thumbnail too large",
            description: "Thumbnail size must be less than 5MB",
          });
          return;
        }

        const thumbExt = thumbnail.name.split('.').pop();
        const thumbName = `${Date.now()}-thumb-${Math.random().toString(36).substring(7)}.${thumbExt}`;
        const thumbPath = `thumbnails/${thumbName}`;

        const { error: thumbError } = await supabase.storage
          .from('music-sheets')
          .upload(thumbPath, thumbnail);

        if (thumbError) throw thumbError;

        const { data: { publicUrl } } = supabase.storage
          .from('music-sheets')
          .getPublicUrl(thumbPath);
        
        thumbnailUrl = publicUrl;
      }

      // Insert into database
      const { error: dbError } = await supabase
        .from('music_sheets')
        .insert({
          title: validatedData.title,
          composer: validatedData.composer || null,
          description: validatedData.description || null,
          category_id: validatedData.category_id,
          event_id: eventId || null,
          file_url: fileUrl,
          thumbnail_url: thumbnailUrl,
        });

      if (dbError) throw dbError;

      // Send notification to all users about the new song
      try {
        await supabase.functions.invoke('send-notifications', {
          body: {
            type: 'new_song',
            songData: {
              title: validatedData.title,
              composer: validatedData.composer || 'Unknown',
            },
          },
        });
      } catch (notifError) {
        console.error('Error sending notifications:', notifError);
        // Don't fail the upload if notification fails
      }

      toast({
        title: "Success!",
        description: "Music sheet uploaded successfully and users notified!",
      });

      // Reset form
      setTitle("");
      setComposer("");
      setDescription("");
      setCategoryId("");
      setEventId(null);
      setFile(null);
      setThumbnail(null);
      
      onUploadSuccess();
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
          title: "Upload failed",
          description: error.message || "An error occurred during upload",
        });
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-primary">
          <Upload className="w-5 h-5" />
          Upload Music Sheet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Amazing Grace"
              required
              maxLength={200}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="composer">Composer</Label>
            <Input
              id="composer"
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              placeholder="John Newton"
              maxLength={100}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {events.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="event">Event (Optional)</Label>
              <Select value={eventId || "none"} onValueChange={(val) => setEventId(val === "none" ? null : val)}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="No event (regular upload)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No event (regular upload)</SelectItem>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the music sheet..."
              rows={3}
              maxLength={1000}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Music Sheet File (PDF, PNG, JPG) *</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="bg-background/50"
            />
            {file && (
              <p className="text-xs text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail (Optional)</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              className="bg-background/50"
            />
            {thumbnail && (
              <p className="text-xs text-muted-foreground">
                Selected: {thumbnail.name}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={uploading}
            className="w-full glow-cyan"
            size="lg"
          >
            <Music className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Music Sheet"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
