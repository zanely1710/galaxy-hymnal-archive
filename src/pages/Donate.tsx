import { Card } from "@/components/ui/card";
import { Copy, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
export default function Donate() {
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`
    });
  };
  return <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Button variant="outline" size="icon" onClick={() => navigate("/")} className="mb-4">
          <X className="w-4 h-4" />
        </Button>
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Support Gloriae Musica
          </h1>
          <p className="text-lg text-foreground">
            Your donations help us maintain and grow this free archive of sacred music
          </p>
        </div>

        <Card className="glass-card glow-blue p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Support Our Mission</h2>
            <p className="text-sm text-foreground mb-6">
              You can send donations via Maya, GCash to Maya, or bank transfer to the account below
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
                <Button variant="outline" size="icon" onClick={() => copyToClipboard("@eleandrejohn", "Username")}>
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
                <Button variant="outline" size="icon" onClick={() => copyToClipboard("09684109059", "Phone number")}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Email */}
            <div className="bg-background/50 rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email for Inquiries</p>
                  <p className="text-lg font-mono font-semibold break-all">eleandrejohn503@gmail.com</p>
                </div>
                <Button variant="outline" size="icon" onClick={() => copyToClipboard("eleandrejohn503@gmail.com", "Email")}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-6">
            <p className="text-sm text-center">
              Every donation, no matter the size, helps us continue providing free access to sacred music. You can use Maya, GCash to Maya, bank transfer, or any payment method that works for you. For custom donation options or inquiries, feel free to reach out via email. Thank you for your generosity! 🙏
            </p>
          </div>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Suggested donations: ₱100 - ₱500 monthly</p>
          <p className="mt-2">All donations are voluntary and deeply appreciated (OPTIONAL) </p>
        </div>
      </div>
    </div>;
}