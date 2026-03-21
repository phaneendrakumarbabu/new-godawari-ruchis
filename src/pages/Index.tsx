import { useNavigate } from "react-router-dom";
import { ShoppingBag, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import heroFood from "@/assets/hero-food.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img src={heroFood} alt="Delicious South Indian food spread" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 to-foreground/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={logo} alt="Tastes of Godavari" className="w-40 h-40 object-contain drop-shadow-lg" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 -mt-8 relative z-10">
        <div className="bg-card rounded-lg shadow-xl p-8 w-full max-w-sm animate-fade-in">
          <h1 className="font-display text-2xl font-bold text-center text-foreground mb-2">
            Tastes of Godavari
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-8">
            Authentic South Indian flavours, served fresh
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => navigate("/menu")}
              className="w-full h-14 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue as Customer
            </Button>

            <Button
              onClick={() => navigate("/admin-login")}
              variant="outline"
              className="w-full h-14 text-base font-semibold rounded-lg gap-2 border-border text-foreground hover:bg-muted"
            >
              <Shield className="w-5 h-5" />
              Login as Admin
            </Button>
          </div>

          <button
            onClick={() => navigate("/order-history")}
            className="mt-6 w-full text-center text-sm text-primary font-medium hover:underline"
          >
            Track your order →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
