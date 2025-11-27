import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Galaxy3D from "@/components/Galaxy3D";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Music, Users, MessageSquare } from "lucide-react";
import UploadMusicSheet from "@/components/admin/UploadMusicSheet";
import ManageCategories from "@/components/admin/ManageCategories";
import SongRequests from "@/components/admin/SongRequests";
import SendNotification from "@/components/admin/SendNotification";
import ManageUsers from "@/components/admin/ManageUsers";
import ManageEvents from "@/components/admin/ManageEvents";
import ModerateComments from "@/components/admin/ModerateComments";

interface Stats {
  totalSheets: number;
  totalUsers: number;
  pendingRequests: number;
}

interface Category {
  id: string;
  name: string;
}

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

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
  user_roles: { role: string }[];
}

interface MusicEvent {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  stock_limit: number | null;
  stock_remaining: number | null;
  created_at: string;
}

export default function Dashboard() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ totalSheets: 0, totalUsers: 0, pendingRequests: 0 });
  const [categories, setCategories] = useState<Category[]>([]);
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [events, setEvents] = useState<MusicEvent[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    } else if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, loading, navigate]);

  const fetchData = async () => {
    try {
      setDataLoading(true);

      // Fetch stats
      const [sheetsCount, usersCount, requestsCount] = await Promise.all([
        supabase.from('music_sheets').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('song_requests').select('*', { count: 'exact', head: true }).eq('completed', false),
      ]);

      setStats({
        totalSheets: sheetsCount.count || 0,
        totalUsers: usersCount.count || 0,
        pendingRequests: requestsCount.count || 0,
      });

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesData) setCategories(categoriesData);

      // Fetch song requests
      const { data: requestsData } = await supabase
        .from('song_requests')
        .select(`
          *,
          profiles (name, email)
        `)
        .order('created_at', { ascending: false });

      if (requestsData) setRequests(requestsData);

      // Fetch users
      const { data: usersData } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (role)
        `)
        .order('created_at', { ascending: false });

      if (usersData) setUsers(usersData);

      // Fetch events
      const { data: eventsData } = await supabase
        .from('music_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (eventsData) setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-transparent relative particle-bg overflow-hidden flex items-center justify-center">
        <Galaxy3D />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-blue-950/50 to-blue-900/60 backdrop-blur-lg pointer-events-none" />
        <div className="text-center relative z-10 animate-fade-in">
          <Shield className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse-glow drop-shadow-2xl" />
          <p className="text-xl text-foreground/90 font-medium shimmer">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-transparent relative particle-bg overflow-hidden">
      <Galaxy3D />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-blue-950/50 to-blue-900/60 backdrop-blur-lg pointer-events-none" />
      <div className="absolute inset-0 gradient-overlay-radial pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/15 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      <Navigation />

      <main className="relative container mx-auto px-4 pt-24 pb-16">
        <div className="mb-10 animate-fade-in-down">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gradient-animated mb-4 shimmer hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]">
            Admin Dashboard
          </h1>
          <p className="text-lg md:text-xl text-foreground/90 animate-fade-in font-medium" style={{animationDelay: "0.1s"}}>
            Manage Gloriae Musica content and users
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="glass-card-intense hover-lift group animate-scale-in relative overflow-hidden border-primary/30" style={{ animationDelay: "0.1s" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 -z-10" />
            <CardHeader className="relative z-10 pb-3">
              <CardTitle className="flex items-center gap-3 font-display text-2xl">
                <Music className="w-7 h-7 text-primary group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 drop-shadow-lg" />
                <span className="text-gradient-blue">Music Sheets</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-5xl font-bold text-foreground mb-3 group-hover:scale-110 transition-transform duration-300 drop-shadow-md">{stats.totalSheets}</p>
              <p className="text-sm text-muted-foreground/80 font-medium">Total sheets in archive</p>
            </CardContent>
          </Card>

          <Card className="glass-card-intense hover-lift group animate-scale-in relative overflow-hidden border-secondary/30" style={{ animationDelay: "0.2s" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/15 via-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-300/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 -z-10" />
            <CardHeader className="relative z-10 pb-3">
              <CardTitle className="flex items-center gap-3 font-display text-2xl">
                <Users className="w-7 h-7 text-secondary group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 drop-shadow-lg" />
                <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">Users</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-5xl font-bold text-foreground mb-3 group-hover:scale-110 transition-transform duration-300 drop-shadow-md">{stats.totalUsers}</p>
              <p className="text-sm text-muted-foreground/80 font-medium">Registered users</p>
            </CardContent>
          </Card>

          <Card className="glass-card-intense hover-lift group animate-scale-in relative overflow-hidden border-yellow-500/30 glow-gold" style={{ animationDelay: "0.3s" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/15 via-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 -z-10" />
            <CardHeader className="relative z-10 pb-3">
              <CardTitle className="flex items-center gap-3 font-display text-2xl">
                <MessageSquare className="w-7 h-7 text-yellow-500 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-pulse-glow drop-shadow-lg" />
                <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Song Requests</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-5xl font-bold text-foreground mb-3 group-hover:scale-110 transition-transform duration-300 drop-shadow-md">{stats.pendingRequests}</p>
              <p className="text-sm text-muted-foreground/80 font-medium">Pending requests</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="upload" className="space-y-8 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 glass-card p-2 gap-2 h-auto border border-primary/20">
            <TabsTrigger 
              value="upload"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:glow-blue transition-all duration-300 hover:scale-105 font-medium"
            >
              Upload
            </TabsTrigger>
            <TabsTrigger 
              value="categories"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:glow-blue transition-all duration-300 hover:scale-105 font-medium"
            >
              Categories
            </TabsTrigger>
            <TabsTrigger 
              value="requests"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:glow-blue transition-all duration-300 hover:scale-105 font-medium"
            >
              Requests
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:glow-blue transition-all duration-300 hover:scale-105 font-medium"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:glow-blue transition-all duration-300 hover:scale-105 font-medium"
            >
              Notify
            </TabsTrigger>
            <TabsTrigger 
              value="events"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:glow-blue transition-all duration-300 hover:scale-105 font-medium"
            >
              Events
            </TabsTrigger>
            <TabsTrigger 
              value="comments"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:glow-blue transition-all duration-300 hover:scale-105 font-medium"
            >
              Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <UploadMusicSheet categories={categories} events={events} onUploadSuccess={fetchData} />
          </TabsContent>

          <TabsContent value="categories">
            <ManageCategories categories={categories} onUpdate={fetchData} />
          </TabsContent>

          <TabsContent value="requests">
            <SongRequests requests={requests} onUpdate={fetchData} />
          </TabsContent>

          <TabsContent value="users">
            <ManageUsers users={users} onUpdate={fetchData} />
          </TabsContent>

          <TabsContent value="notifications">
            <SendNotification />
          </TabsContent>

          <TabsContent value="events">
            <ManageEvents events={events} onUpdate={fetchData} />
          </TabsContent>

          <TabsContent value="comments">
            <ModerateComments />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
