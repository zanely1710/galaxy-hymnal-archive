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

export default function Dashboard() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ totalSheets: 0, totalUsers: 0, pendingRequests: 0 });
  const [categories, setCategories] = useState<Category[]>([]);
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
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
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-50">
      <Galaxy3D />
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="font-display text-5xl font-bold text-gradient-blue mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage Gloriae Musica content and users
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card glow-blue hover:scale-105 transition-transform animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-primary">
                <Music className="w-5 h-5" />
                Music Sheets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground mb-2">{stats.totalSheets}</p>
              <p className="text-sm text-muted-foreground">Total sheets in archive</p>
            </CardContent>
          </Card>

          <Card className="glass-card glow-blue hover:scale-105 transition-transform animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-secondary">
                <Users className="w-5 h-5" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground mb-2">{stats.totalUsers}</p>
              <p className="text-sm text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card className="glass-card glow-gold hover:scale-105 transition-transform animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-accent">
                <MessageSquare className="w-5 h-5" />
                Song Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground mb-2">{stats.pendingRequests}</p>
              <p className="text-sm text-muted-foreground">Pending requests</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="upload" className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <TabsList className="grid w-full grid-cols-5 bg-card">
            <TabsTrigger value="upload">Upload Music</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <UploadMusicSheet categories={categories} onUploadSuccess={fetchData} />
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
        </Tabs>
      </main>
    </div>
  );
}
