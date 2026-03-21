import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, CreditCard, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import OrderReceipt from "@/components/OrderReceipt";
import type { Order } from "@/lib/store";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, removeFromCart, placeOrder } = useStore();
  const [mobile, setMobile] = useState("");
  const [receipt, setReceipt] = useState<Order | null>(null);

  const total = cart.reduce((s, c) => s + c.price * c.quantity, 0);

  const handleOrder = (paymentType: "Paid" | "Cash") => {
    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    const order = placeOrder(mobile, paymentType);
    setReceipt(order);
    toast.success(`Order ${order.orderID} placed!`);
  };

  if (receipt) {
    return <OrderReceipt order={receipt} onClose={() => navigate("/menu")} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/menu")} className="text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-lg font-bold text-foreground">Your Cart</h1>
      </div>

      <div className="p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Your cart is empty</p>
            <Button onClick={() => navigate("/menu")} variant="outline" className="mt-4 rounded-lg">
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} className="bg-card rounded-lg border border-border p-4 flex items-center gap-3 animate-fade-in">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-foreground text-sm truncate">{item.name}</h3>
                  <p className="text-muted-foreground text-xs">₹{item.price} × {item.quantity}</p>
                </div>
                <p className="font-bold text-foreground text-sm">₹{item.price * item.quantity}</p>
                <button onClick={() => removeFromCart(item.id)} className="text-destructive p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="bg-card rounded-lg border border-border p-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="font-display font-bold text-foreground text-lg">Total</span>
                <span className="font-display font-bold text-primary text-xl">₹{total}</span>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-foreground mb-2 block">Mobile Number</label>
              <Input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="h-12 rounded-lg text-base bg-card border-border"
                maxLength={10}
              />
            </div>

            <div className="space-y-3 mt-6">
              <Button
                onClick={() => handleOrder("Paid")}
                className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-base font-bold gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Pay with Razorpay — ₹{total}
              </Button>
              <Button
                onClick={() => handleOrder("Cash")}
                variant="outline"
                className="w-full h-14 rounded-lg text-base font-bold gap-2 border-border text-foreground hover:bg-muted"
              >
                <Banknote className="w-5 h-5" />
                Pay by Cash at Stall
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
