import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import OrderReceipt from "@/components/OrderReceipt";
import type { Order } from "@/lib/store";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { getOrdersByMobile } = useStore();
  const [mobile, setMobile] = useState("");
  const [results, setResults] = useState<Order[] | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleSearch = () => {
    if (!/^\d{10}$/.test(mobile)) return;
    setResults(getOrdersByMobile(mobile));
  };

  if (selectedOrder) {
    return <OrderReceipt order={selectedOrder} onClose={() => setSelectedOrder(null)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-lg font-bold text-foreground">Order History</h1>
      </div>

      <div className="p-4">
        <div className="flex gap-2">
          <Input
            type="tel"
            placeholder="Enter 10-digit mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            className="h-12 rounded-lg bg-card border-border"
            maxLength={10}
          />
          <Button onClick={handleSearch} className="h-12 px-4 bg-primary text-primary-foreground rounded-lg">
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {results !== null && (
          <div className="mt-6 space-y-3">
            {results.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No orders found</p>
            ) : (
              results.map((order) => (
                <button
                  key={order.orderID}
                  onClick={() => setSelectedOrder(order)}
                  className="w-full bg-card rounded-lg border border-border p-4 text-left animate-fade-in hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-display font-bold text-foreground">{order.orderID}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">₹{order.totalAmount}</p>
                      <Badge
                        variant="secondary"
                        className={`mt-1 text-xs ${
                          order.paymentStatus === "Paid"
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {order.items.map((i) => i.name).join(", ")}
                  </p>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
