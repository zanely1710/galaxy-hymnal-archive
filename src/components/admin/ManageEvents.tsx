import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  stock_limit: number | null;
  stock_remaining: number | null;
  created_at: string;
}

interface ManageEventsProps {
  events: Event[];
  onUpdate: () => void;
}

export default function ManageEvents({ events, onUpdate }: ManageEventsProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [stockLimit, setStockLimit] = useState<number | undefined>();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate(undefined);
    setEndDate(undefined);
    setStockLimit(undefined);
    setIsCreating(false);
    setEditingEvent(null);
  };

  const loadEventForEdit = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description || "");
    setStartDate(new Date(event.start_date));
    setEndDate(new Date(event.end_date));
    setStockLimit(event.stock_limit || undefined);
    setIsCreating(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !startDate || !endDate) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (endDate < startDate) {
      toast({
        title: "Invalid dates",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    const eventData = {
      title,
      description: description || null,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      stock_limit: stockLimit || null,
      stock_remaining: stockLimit || null,
    };

    if (editingEvent) {
      const { error } = await supabase
        .from("music_events")
        .update(eventData)
        .eq("id", editingEvent.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update event",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    } else {
      const { error } = await supabase
        .from("music_events")
        .insert([eventData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create event",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Event created successfully",
      });
    }

    resetForm();
    onUpdate();
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const { error } = await supabase
      .from("music_events")
      .delete()
      .eq("id", eventId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Event deleted successfully",
    });
    onUpdate();
  };

  const isEventActive = (event: Event) => {
    const now = new Date();
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    const hasStock = !event.stock_limit || (event.stock_remaining && event.stock_remaining > 0);
    return now >= start && now <= end && hasStock;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Events</CardTitle>
        <CardDescription>
          Create limited-time or limited-stock events for music sheets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isCreating ? (
          <Button onClick={() => setIsCreating(true)} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Create New Event
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Christmas Special"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Limited time Christmas music collection"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Limit (Optional)</Label>
              <Input
                id="stock"
                type="number"
                min="1"
                value={stockLimit || ""}
                onChange={(e) => setStockLimit(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Leave empty for unlimited"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingEvent ? "Update Event" : "Create Event"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No events created yet
            </p>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className={cn(
                  "p-4 border rounded-lg space-y-2",
                  isEventActive(event) ? "bg-green-50/50 border-green-200" : "bg-gray-50/50"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    {event.description && (
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => loadEventForEdit(event)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(event.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    Start: {format(new Date(event.start_date), "PPP")} | 
                    End: {format(new Date(event.end_date), "PPP")}
                  </p>
                  {event.stock_limit && (
                    <p>
                      Stock: {event.stock_remaining}/{event.stock_limit} remaining
                    </p>
                  )}
                  <p className={cn(
                    "font-medium",
                    isEventActive(event) ? "text-green-600" : "text-red-600"
                  )}>
                    {isEventActive(event) ? "● Active" : "● Inactive"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}