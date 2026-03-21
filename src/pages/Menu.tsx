import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";

const Menu = () => {
  const navigate = useNavigate();
  const { menuItems, cart, addToCart, updateCartQuantity } = useStore();

  const availableItems = menuItems.filter((m) => true); // show all, mark sold out
  const categories = useMemo(() => {
    const cats = new Map<string, typeof menuItems>();
    availableItems.forEach((item) => {
      const cat = item.category || "Other";
      if (!cats.has(cat)) cats.set(cat, []);
      cats.get(cat)!.push(item);
    });
    return cats;
  }, [availableItems]);

  const cartTotal = cart.reduce((s, c) => s + c.quantity, 0);
  const getCartQty = (id: string) => cart.find((c) => c.id === id)?.quantity || 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-lg font-bold text-foreground">Our Menu</h1>
        <div className="w-5" />
      </div>

      {/* Categories */}
      <div className="p-4 space-y-6">
        {Array.from(categories.entries()).map(([cat, items]) => (
          <div key={cat} className="animate-fade-in">
            <h2 className="font-display text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full" />
              {cat}
            </h2>
            <div className="space-y-3">
              {items.map((item) => {
                const qty = getCartQty(item.id);
                return (
                  <div
                    key={item.id}
                    className={`bg-card rounded-lg shadow-sm border border-border p-4 flex items-center justify-between gap-3 ${
                      !item.isAvailable ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-foreground text-sm truncate">
                        {item.name}
                      </h3>
                      <p className="text-primary font-bold text-base mt-0.5">₹{item.price}</p>
                    </div>
                    {!item.isAvailable ? (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs shrink-0">
                        Sold Out
                      </Badge>
                    ) : qty === 0 ? (
                      <Button
                        size="sm"
                        onClick={() => addToCart(item)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 h-9 text-sm font-semibold shrink-0"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => updateCartQuantity(item.id, qty - 1)}
                          className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-display font-bold text-foreground w-5 text-center">{qty}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, qty + 1)}
                          className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Cart FAB */}
      {cartTotal > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-30 animate-slide-up">
          <Button
            onClick={() => navigate("/cart")}
            className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-base font-bold shadow-lg gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            View Cart ({cartTotal} items) — ₹{cart.reduce((s, c) => s + c.price * c.quantity, 0)}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Menu;
