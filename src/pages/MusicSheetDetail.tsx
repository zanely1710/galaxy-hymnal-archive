import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Galaxy3D from "@/components/Galaxy3D";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Music } from "lucide-react";
import MusicSheetComments from "@/components/MusicSheetComments";
import { toast } from "@/hooks/use-toast";

interface MusicSheet {
  id: string;
  title: string;
  composer: string | null;
  arranger: string | null;
  description: string | null;
  file_url: string | null;
  difficulty: string | null;
  created_at: string;
  categories: { name: string } | null;
  music_events: {
    title: string;
    start_date: string;
    end_date: string;
    stock_limit: number | null;
    stock_remaining: number | null;
  } | null;
}

export default function MusicSheetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<MusicSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSheet();
    }
  }, [id]);

  const fetchSheet = async () => {
    try {
      const { data, error } = await supabase
        .from("music_sheets")
        .select(`
          *,
          categories (name),
          music_events (
            title,
            start_date,
            end_date,
            stock_limit,
            stock_remaining
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setSheet(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      navigate("/archive");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!sheet?.file_url) return;

    setDownloading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to download music sheets",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Call edge function to handle download and stock decrement
      const { data, error } = await supabase.functions.invoke('download-event-sheet', {
        body: { musicSheetId: sheet.id }
      });

      if (error) throw error;

      if (data?.fileUrl) {
        // Open the file in a new tab
        window.open(data.fileUrl, '_blank');
        
        toast({
          title: "Success",
          description: data.message || "Download started",
        });

        // Refresh the sheet data to show updated stock
        await fetchSheet();
      }
    } catch (error: any) {
      toast({
        title: "Download Error",
        description: error.message || "Failed to download music sheet",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  const isEventExpired = () => {
    if (!sheet?.music_events) return false;
    const now = new Date();
    const endDate = new Date(sheet.music_events.end_date);
    const hasStock = !sheet.music_events.stock_limit || 
      (sheet.music_events.stock_remaining && sheet.music_events.stock_remaining > 0);
    return now > endDate || !hasStock;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Music className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  if (!sheet) {
    return null;
  }

  const expired = isEventExpired();

  return (
    <div className="min-h-screen bg-transparent relative particle-bg">
      <Galaxy3D />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-blue-950/40 to-blue-900/50 backdrop-blur-md pointer-events-none" />
      <Navigation />

      <main className="relative container mx-auto px-4 pt-24 pb-16">
        <Button
          variant="ghost"
          onClick={() => navigate("/archive")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Archive
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card-intense">
              <CardHeader>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-display text-primary mb-2">
                      {sheet.title}
                    </CardTitle>
                    {sheet.composer && (
                      <p className="text-lg text-muted-foreground">
                        Composed by {sheet.composer}
                      </p>
                    )}
                    {sheet.arranger && (
                      <p className="text-sm text-muted-foreground">
                        Arranged by {sheet.arranger}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {sheet.categories && (
                      <Badge variant="outline" className="border-primary">
                        {sheet.categories.name}
                      </Badge>
                    )}
                    {sheet.difficulty && (
                      <Badge variant="secondary">
                        {sheet.difficulty}
                      </Badge>
                    )}
                    {sheet.music_events && (
                      <Badge className="bg-green-500 text-white">
                        Event: {sheet.music_events.title}
                      </Badge>
                    )}
                    {expired && (
                      <Badge variant="destructive">Event Ended</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {expired && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="font-medium text-destructive">
                      Event ended - not available anymore
                    </p>
                  </div>
                )}

                {sheet.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-foreground/90">{sheet.description}</p>
                  </div>
                )}

                {sheet.file_url && !expired && (
                  <Button
                    size="lg"
                    className="w-full glow-blue"
                    onClick={handleDownload}
                    disabled={downloading}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {downloading ? "Processing..." : "Download Music Sheet"}
                  </Button>
                )}
              </CardContent>
            </Card>

            <MusicSheetComments musicSheetId={sheet.id} />
          </div>

          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <p className="font-medium">
                    {sheet.categories?.name || "Uncategorized"}
                  </p>
                </div>
                {sheet.difficulty && (
                  <div>
                    <span className="text-muted-foreground">Difficulty:</span>
                    <p className="font-medium">{sheet.difficulty}</p>
                  </div>
                )}
                {sheet.music_events && (
                  <div>
                    <span className="text-muted-foreground">Event:</span>
                    <p className="font-medium">{sheet.music_events.title}</p>
                    {sheet.music_events.stock_limit && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Stock: {sheet.music_events.stock_remaining}/
                        {sheet.music_events.stock_limit}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Added:</span>
                  <p className="font-medium">
                    {new Date(sheet.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}