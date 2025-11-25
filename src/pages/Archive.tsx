import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Galaxy3D from "@/components/Galaxy3D";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Search, Download, Music, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EditMusicSheet from "@/components/admin/EditMusicSheet";

interface MusicSheet {
  id: string;
  title: string;
  composer: string | null;
  description: string | null;
  file_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
  category_id: string | null;
  categories: { name: string } | null;
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
  const { toast } = useToast();
  const { isAdmin } = useAuth();

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
          categories (name)
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
    <div className="min-h-screen bg-transparent relative">
      <Galaxy3D />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-blue-950/30 to-blue-900/40 backdrop-blur-sm pointer-events-none" />
      <Navigation />

      <main className="relative container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="font-display text-5xl font-bold text-gradient-blue mb-4">
            Music Archive
          </h1>
          <p className="text-lg text-white">
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
            {filteredSheets.map((sheet, index) => (
              <Card 
                key={sheet.id} 
                className="glass-card backdrop-blur-md hover:scale-105 transition-all glow-blue animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-display text-xl text-primary">
                      {sheet.title}
                    </CardTitle>
                    {isNew(sheet.created_at) && (
                      <Badge variant="secondary" className="bg-accent text-accent-foreground">
                        New
                      </Badge>
                    )}
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
                <CardContent>
                  {sheet.description && (
                    <p className="text-sm text-foreground mb-4 line-clamp-2">
                      {sheet.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {sheet.file_url && (
                      <Button
                        size="sm"
                        className="flex-1 min-w-[120px] glow-blue"
                        onClick={() => window.open(sheet.file_url!, "_blank")}
                      >
                        <Download className="w-4 h-4 mr-2" />
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
            ))}
          </div>
        )}
      </main>

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
