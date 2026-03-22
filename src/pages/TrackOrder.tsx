import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, CheckCircle2, Clock, ChefHat } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import type { Order } from "@/lib/store";

const TrackOrder = () => {
  const navigate = useNavigate();
  const { orders } = useStore();
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!search.trim()) return;
    setHasSearched(true);
    const query = search.trim().toUpperCase();
    const found = orders.find((o) => o.orderID === query || o.mobileNumber === query);
    setResult(found || null);
  };

  const steps = ["New", "Preparing", "Completed"];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-lg font-bold text-foreground">Track Order</h1>
      </div>

      <div className="p-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Order ID (e.g. #TOG-01) or Mobile"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 rounded-lg bg-card border-border uppercase"
          />
          <Button onClick={handleSearch} className="h-12 px-4 bg-primary text-primary-foreground rounded-lg">
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {hasSearched && !result && (
          <p className="text-center text-muted-foreground py-8">Order not found.</p>
        )}

        {result && (
          <div className="mt-8 bg-card rounded-lg border border-border p-6 animate-fade-in shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="font-display font-bold text-xl text-foreground">{result.orderID}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(result.timestamp).toLocaleString()}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={
                  result.paymentStatus === "Paid"
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }
              >
                {result.paymentStatus}
              </Badge>
            </div>

            {/* Timeline */}
            <div className="relative pl-6 space-y-8 mt-8 border-l-2 border-muted">
              {steps.map((step, index) => {
                const currentStepIndex = steps.indexOf(result.orderStatus);
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                let Icon = Clock;
                if (step === "Preparing") Icon = ChefHat;
                if (step === "Completed") Icon = CheckCircle2;

                return (
                  <div key={step} className="relative">
                    <div
                      className={`absolute -left-[35px] w-8 h-8 rounded-full flex items-center justify-center border-4 border-card ${
                        isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className={`font-display font-bold ${isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                        {step}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {step === "New" && "Order placed successfully"}
                        {step === "Preparing" && "Chef is preparing your food"}
                        {step === "Completed" && "Order is ready / delivered"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 border-t border-dashed border-border pt-4">
              <h4 className="font-bold text-sm mb-3 text-foreground">Order Items</h4>
              {result.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm mb-2 text-muted-foreground">
                  <span>{item.quantity}x {item.name}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-foreground mt-4 pt-4 border-t border-border">
                <span>Total</span>
                <span>₹{result.totalAmount}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
