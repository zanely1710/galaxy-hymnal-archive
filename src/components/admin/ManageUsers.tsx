import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, User, Shield, RotateCcw, UserCog } from "lucide-react";
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

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
  user_roles: { role: string }[];
}

interface ManageUsersProps {
  users: UserProfile[];
  onUpdate: () => void;
}

export default function ManageUsers({ users, onUpdate }: ManageUsersProps) {
  const { toast } = useToast();
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [roleChangeUserId, setRoleChangeUserId] = useState<string | null>(null);

  const handlePasswordReset = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: `A password reset link has been sent to ${email}`,
      });
      setResetUserId(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to send reset email",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    setLoading(true);
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      
      // Delete old role
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Insert new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });

      if (insertError) throw insertError;

      toast({
        title: "Role updated",
        description: `User role changed to ${newRole}`,
      });
      
      setRoleChangeUserId(null);
      onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update role",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <Shield className="w-5 h-5" />
          Manage Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      {user.name || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.user_roles[0]?.role === 'admin' 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {user.user_roles[0]?.role || 'user'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRoleChangeUserId(user.id)}
                        className="gap-2"
                      >
                        <UserCog className="w-4 h-4" />
                        Toggle Admin
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setResetUserId(user.id)}
                        className="gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset Password
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <AlertDialog open={!!resetUserId} onOpenChange={() => setResetUserId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Send Password Reset Email?</AlertDialogTitle>
              <AlertDialogDescription>
                This will send a password reset link to the user's email address. They will be able to set a new password.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  const user = users.find(u => u.id === resetUserId);
                  if (user) handlePasswordReset(user.email);
                }}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Email"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!roleChangeUserId} onOpenChange={() => setRoleChangeUserId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Change User Role?</AlertDialogTitle>
              <AlertDialogDescription>
                {(() => {
                  const user = users.find(u => u.id === roleChangeUserId);
                  const currentRole = user?.user_roles[0]?.role || 'user';
                  const newRole = currentRole === 'admin' ? 'user' : 'admin';
                  return `This will change the user's role from "${currentRole}" to "${newRole}".`;
                })()}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  const user = users.find(u => u.id === roleChangeUserId);
                  if (user) {
                    const currentRole = user.user_roles[0]?.role || 'user';
                    handleRoleToggle(user.id, currentRole);
                  }
                }}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Role"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
