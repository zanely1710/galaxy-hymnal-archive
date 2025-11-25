import { Card } from "@/components/ui/card";
import { Copy, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Donate() {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Support Gloriae Musica
          </h1>
          <p className="text-muted-foreground text-lg">
            Your donations help us maintain and grow this free archive of sacred music
          </p>
        </div>

        <Card className="glass-card glow-blue p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Donate via PayMaya</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Send your donation to our PayMaya account
            </p>
          </div>

          <div className="space-y-4">
            {/* PayMaya Username */}
            <div className="bg-background/50 rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">PayMaya Username</p>
                  <p className="text-xl font-mono font-semibold">@eleandrejohn</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard("@eleandrejohn", "Username")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Phone Number */}
            <div className="bg-background/50 rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                  <p className="text-xl font-mono font-semibold">09684109059</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard("09684109059", "Phone number")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-6">
            <p className="text-sm text-center">
              Every donation, no matter the size, helps us continue providing free access to sacred music. 
              Thank you for your generosity! 🙏
            </p>
          </div>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Suggested donations: ₱100 - ₱500 monthly</p>
          <p className="mt-2">All donations are voluntary and deeply appreciated</p>
        </div>
      </div>
    </div>
  );
}
