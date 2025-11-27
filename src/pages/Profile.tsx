import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Galaxy3D from "@/components/Galaxy3D";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Clock, FileText, Edit2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchFavorites();
      fetchRecentlyViewed();
      fetchRequests();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();
    
    if (data) {
      setProfile(data);
      setName(data.name || "");
    }
  };

  const fetchFavorites = async () => {
    const { data } = await supabase
      .from("favorites")
      .select(`
        *,
        music_sheets (*)
      `)
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });
    
    setFavorites(data || []);
  };

  const fetchRecentlyViewed = async () => {
    const { data } = await supabase
      .from("recently_viewed")
      .select(`
        *,
        music_sheets (*)
      `)
      .eq("user_id", user?.id)
      .order("viewed_at", { ascending: false })
      .limit(10);
    
    setRecentlyViewed(data || []);
  };

  const fetchRequests = async () => {
    const { data } = await supabase
      .from("song_requests")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });
    
    setRequests(data || []);
  };

  const handleSaveProfile = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ name })
      .eq("id", user?.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated",
      });
      setEditing(false);
      fetchProfile();
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    await supabase.from("favorites").delete().eq("id", favoriteId);
    fetchFavorites();
    toast({ title: "Removed from favorites" });
  };

  return (
    <div className="min-h-screen bg-transparent relative particle-bg">
      <Galaxy3D />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-blue-950/40 to-blue-900/50 backdrop-blur-md pointer-events-none" />
      <Navigation />

      <main className="relative container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto space-y-6">
          <Card className="glass-card-intense">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="text-2xl">
                      {name?.charAt(0) || profile?.email?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    {editing ? (
                      <div className="space-y-2">
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          className="max-w-xs"
                        />
                      </div>
                    ) : (
                      <>
                        <h1 className="text-3xl font-bold">{name || "Anonymous"}</h1>
                        <p className="text-muted-foreground">{profile?.email}</p>
                      </>
                    )}
                  </div>
                </div>
                {editing ? (
                  <Button onClick={handleSaveProfile}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="favorites" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-card">
              <TabsTrigger value="favorites">
                <Heart className="w-4 h-4 mr-2" />
                Favorites ({favorites.length})
              </TabsTrigger>
              <TabsTrigger value="recent">
                <Clock className="w-4 h-4 mr-2" />
                Recently Viewed
              </TabsTrigger>
              <TabsTrigger value="requests">
                <FileText className="w-4 h-4 mr-2" />
                My Requests ({requests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="favorites" className="space-y-4">
              {favorites.length === 0 ? (
                <Card className="glass-card">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No favorites yet. Start favoriting songs!
                  </CardContent>
                </Card>
              ) : (
                favorites.map((fav) => (
                  <Card key={fav.id} className="glass-card hover-lift cursor-pointer" onClick={() => navigate(`/sheet/${fav.music_sheet_id}`)}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <h3 className="font-semibold">{fav.music_sheets?.title}</h3>
                        <p className="text-sm text-muted-foreground">{fav.music_sheets?.composer}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(fav.id);
                      }}>
                        <Heart className="w-4 h-4 fill-current text-red-500" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="recent" className="space-y-4">
              {recentlyViewed.length === 0 ? (
                <Card className="glass-card">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No recently viewed sheets
                  </CardContent>
                </Card>
              ) : (
                recentlyViewed.map((rv) => (
                  <Card key={rv.id} className="glass-card hover-lift cursor-pointer" onClick={() => navigate(`/sheet/${rv.music_sheet_id}`)}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{rv.music_sheets?.title}</h3>
                      <p className="text-sm text-muted-foreground">{rv.music_sheets?.composer}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="requests" className="space-y-4">
              {requests.length === 0 ? (
                <Card className="glass-card">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No song requests yet
                  </CardContent>
                </Card>
              ) : (
                requests.map((req) => (
                  <Card key={req.id} className="glass-card">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{req.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          req.status === 'completed' ? 'bg-green-500/20 text-green-600' :
                          req.status === 'approved' ? 'bg-blue-500/20 text-blue-600' :
                          req.status === 'rejected' ? 'bg-red-500/20 text-red-600' :
                          'bg-yellow-500/20 text-yellow-600'
                        }`}>
                          {req.status || 'pending'}
                        </span>
                      </div>
                      {req.message && <p className="text-sm text-muted-foreground">{req.message}</p>}
                      {req.admin_notes && (
                        <div className="p-2 bg-muted/50 rounded text-sm">
                          <strong>Admin Note:</strong> {req.admin_notes}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}