import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Tag } from "lucide-react";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required").max(50, "Category name must be less than 50 characters"),
});

interface Category {
  id: string;
  name: string;
}

interface Props {
  categories: Category[];
  onUpdate: () => void;
}

export default function ManageCategories({ categories, onUpdate }: Props) {
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = categorySchema.parse({ name: newCategory });
      
      setLoading(true);

      const { error } = await supabase
        .from('categories')
        .insert({ name: validatedData.name });

      if (error) throw error;

      toast({
        title: "Category added",
        description: `${validatedData.name} has been added successfully`,
      });

      setNewCategory("");
      onUpdate();
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
          title: "Error adding category",
          description: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will remove the category from all associated music sheets.`)) {
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Category deleted",
        description: `${name} has been deleted successfully`,
      });

      onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting category",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-secondary">
          <Tag className="w-5 h-5" />
          Manage Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAdd} className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="new-category" className="sr-only">New Category</Label>
            <Input
              id="new-category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name..."
              maxLength={50}
              className="bg-background/50"
            />
          </div>
          <Button type="submit" disabled={loading} className="glow-purple">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </form>

        <div className="space-y-2">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No categories yet
            </p>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50"
              >
                <span className="text-foreground">{category.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(category.id, category.name)}
                  disabled={loading}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
