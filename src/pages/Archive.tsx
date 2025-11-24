import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Galaxy3D from "@/components/Galaxy3D";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MusicSheet {
  id: string;
  title: string;
  composer: string | null;
  description: string | null;
  file_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
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
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-background">
      <Galaxy3D />
      <Navigation />

      <main className="relative z-10 container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="font-display text-5xl font-bold text-gradient-nebula mb-4">
            Music Archive
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse and download sacred liturgical music
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by title or composer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/50 border-border/50"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
              className={selectedCategory === null ? "glow-cyan" : ""}
            >
              All Categories
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                size="sm"
                className={selectedCategory === cat.id ? "glow-purple" : ""}
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
            {filteredSheets.map((sheet) => (
              <Card key={sheet.id} className="glass-card hover:scale-105 transition-transform glow-purple">
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
                    <Badge variant="outline" className="w-fit border-primary/50">
                      {sheet.categories.name}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  {sheet.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {sheet.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    {sheet.file_url && (
                      <Button
                        size="sm"
                        className="flex-1 glow-cyan"
                        onClick={() => window.open(sheet.file_url!, "_blank")}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
