import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Galaxy3D from "@/components/Galaxy3D";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CommunityChat from "@/components/CommunityChat";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Download, Music, Trash2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EditMusicSheet from "@/components/admin/EditMusicSheet";
import { cn } from "@/lib/utils";

interface MusicSheet {
  id: string;
  title: string;
  composer: string | null;
  description: string | null;
  file_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
  category_id: string | null;
  event_id: string | null;
  categories: { name: string } | null;
  music_events: {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    stock_limit: number | null;
    stock_remaining: number | null;
  } | null;
}

interface Category {
  id: string;
  name: string;
}

export default function Archive() {
  const [sheets, setSheets] = useState<MusicSheet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (categoriesData) setCategories(categoriesData);

      // Fetch music sheets
      let query = supabase
        .from("music_sheets")
        .select(`
          *,
          categories (name),
          music_events (
            id,
            title,
            start_date,
            end_date,
            stock_limit,
            stock_remaining
          )
        `)
        .order("created_at", { ascending: false });

      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }

      const { data: sheetsData, error } = await query;

      if (error) throw error;
      if (sheetsData) setSheets(sheetsData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading archive",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSheets = sheets.filter(
    (sheet) =>
      sheet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sheet.composer && sheet.composer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isNew = (createdAt: string) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(createdAt) > weekAgo;
  };

  const isEventExpired = (sheet: MusicSheet) => {
    if (!sheet.music_events) return false;
    const now = new Date();
    const endDate = new Date(sheet.music_events.end_date);
    const hasStock = !sheet.music_events.stock_limit || 
      (sheet.music_events.stock_remaining && sheet.music_events.stock_remaining > 0);
    return now > endDate || !hasStock;
  };

  const isEventActive = (sheet: MusicSheet) => {
    if (!sheet.music_events) return false;
    const now = new Date();
    const startDate = new Date(sheet.music_events.start_date);
    const endDate = new Date(sheet.music_events.end_date);
    const hasStock = !sheet.music_events.stock_limit || 
      (sheet.music_events.stock_remaining && sheet.music_events.stock_remaining > 0);
    return now >= startDate && now <= endDate && hasStock;
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("music_sheets")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast({
        title: "Sheet deleted",
        description: "Music sheet has been removed from the archive",
      });

      fetchData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message,
      });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative particle-bg">
      <Galaxy3D />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-blue-950/40 to-blue-900/50 backdrop-blur-md pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/15 via-transparent to-transparent pointer-events-none" />
      <Navigation />

      <div className="flex relative">
        <main className="relative container mx-auto px-4 pt-24 pb-16 flex-1">
        <div className="mb-8 animate-fade-in-down">
          <h1 className="font-display text-5xl font-bold text-gradient-blue mb-4 shimmer hover:scale-105 transition-transform duration-300">
            Music Archive
          </h1>
          <p className="text-lg text-white/90 animate-fade-in" style={{animationDelay: "0.1s"}}>
            Browse and download sacred liturgical music
          </p>
        </div>

        <div className="mb-8 space-y-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by title or composer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
              className={selectedCategory === null ? "glow-blue" : ""}
            >
              All Categories
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                size="sm"
                className={selectedCategory === cat.id ? "glow-blue" : ""}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Music className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Loading archive...</p>
          </div>
        ) : filteredSheets.length === 0 ? (
          <Card className="glass-card text-center py-12">
            <CardContent>
              <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No music sheets found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSheets.map((sheet, index) => {
              const expired = isEventExpired(sheet);
              const active = isEventActive(sheet);
              
              return (
                <Card 
                  key={sheet.id} 
                  className={cn(
                    "glass-card-intense group animate-scale-in relative overflow-hidden",
                    expired ? "grayscale opacity-60 cursor-not-allowed" : "hover-lift",
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <CardTitle className="font-display text-xl text-primary group-hover:text-blue-400 transition-colors">
                        {sheet.title}
                      </CardTitle>
                      <div className="flex gap-2">
                        {isNew(sheet.created_at) && !expired && (
                          <Badge variant="secondary" className="bg-accent text-accent-foreground animate-pulse-glow">
                            New
                          </Badge>
                        )}
                        {active && (
                          <Badge className="bg-green-500 text-white">
                            Event: {sheet.music_events?.title}
                          </Badge>
                        )}
                        {expired && (
                          <Badge variant="destructive">
                            Event Ended
                          </Badge>
                        )}
                      </div>
                    </div>
                  {sheet.composer && (
                    <p className="text-sm text-muted-foreground">by {sheet.composer}</p>
                  )}
                  {sheet.categories && (
                    <Badge variant="outline" className="w-fit border-primary">
                      {sheet.categories.name}
                    </Badge>
                  )}
                </CardHeader>
                  <CardContent className="relative z-10">
                    {expired && (
                      <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                        <p className="text-sm font-medium text-destructive">
                          Event ended - not available anymore
                        </p>
                      </div>
                    )}
                    {active && sheet.music_events && sheet.music_events.stock_limit && (
                      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                        <p className="text-sm font-medium text-green-600">
                          Limited Stock: {sheet.music_events.stock_remaining}/{sheet.music_events.stock_limit} remaining
                        </p>
                      </div>
                    )}
                    {sheet.description && (
                      <p className="text-sm text-foreground mb-4 line-clamp-2">
                        {sheet.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {sheet.file_url && !expired && (
                        <Button
                          size="sm"
                          className="flex-1 min-w-[120px] glow-blue hover:scale-105 transition-all duration-300 group/btn shimmer"
                          onClick={() => window.open(sheet.file_url!, "_blank")}
                        >
                          <Download className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                          Download
                        </Button>
                      )}
                      {isAdmin && (
                        <>
                          <EditMusicSheet
                            sheet={sheet}
                            categories={categories}
                            onUpdate={fetchData}
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteId(sheet.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        </main>

        {/* Chat Sidebar - Desktop */}
        {user && (
          <aside className="hidden lg:block w-96 pt-24 pb-16 pr-4 relative">
            <div className="sticky top-24">
              <CommunityChat />
            </div>
          </aside>
        )}

        {/* Chat Toggle - Mobile */}
        {user && (
          <div className="lg:hidden fixed bottom-4 right-4 z-40">
            <Button
              onClick={() => setShowChat(!showChat)}
              size="lg"
              className="rounded-full w-14 h-14 shadow-lg glow-blue"
            >
              <MessageSquare className="w-6 h-6" />
            </Button>
          </div>
        )}

        {/* Chat Modal - Mobile */}
        {showChat && user && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm p-4">
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-primary">Community Chat</h2>
                <Button variant="ghost" onClick={() => setShowChat(false)}>
                  Close
                </Button>
              </div>
              <div className="flex-1 overflow-hidden">
                <CommunityChat />
              </div>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Music Sheet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this music sheet? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
