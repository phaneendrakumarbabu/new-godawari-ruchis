import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus, ArrowLeft, UtensilsCrossed, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";

const Menu = () => {
  const navigate = useNavigate();
  const { menuItems, cart, addToCart, updateCartQuantity } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const cats = new Map<string, typeof menuItems>();
    menuItems.forEach((item) => {
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return;
      }
      const cat = item.category || "Other";
      if (!cats.has(cat)) cats.set(cat, []);
      cats.get(cat)!.push(item);
    });
    return cats;
  }, [menuItems, searchQuery]);

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

      {/* Search Bar */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for biryani, tiffins..."
            className="pl-9 h-11 bg-card border-border rounded-xl"
          />
        </div>
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
                    className={`bg-card rounded-lg shadow-sm border border-border p-3 flex items-center gap-3 ${
                      !item.isAvailable ? "opacity-50" : ""
                    }`}
                  >
                    {/* Food Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
                      {item.imageURL ? (
                        <img
                          src={item.imageURL}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <UtensilsCrossed className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-semibold text-foreground text-sm truncate">
                          {item.name}
                        </h3>
                        {item.isSpecial && (
                          <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 text-[10px] px-1.5 py-0 border-orange-500/20 whitespace-nowrap shrink-0">
                            ⭐ Special
                          </Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 mb-1">
                          {item.description}
                        </p>
                      )}
                      <p className="text-primary font-bold text-base mt-0.5">₹{item.price}</p>

                      <div className="mt-2">
                        {!item.isAvailable ? (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                            Sold Out
                          </Badge>
                        ) : qty === 0 ? (
                          <Button
                            size="sm"
                            onClick={() => addToCart(item)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 h-8 text-xs font-semibold"
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQuantity(item.id, qty - 1)}
                              className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-foreground"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-display font-bold text-foreground w-5 text-center text-sm">{qty}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, qty + 1)}
                              className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
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
