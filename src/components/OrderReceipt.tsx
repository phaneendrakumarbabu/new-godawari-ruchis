import { CheckCircle, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order } from "@/lib/store";

interface Props {
  order: Order;
  onClose: () => void;
}

const OrderReceipt = ({ order, onClose }: Props) => {
  const isPaid = order.paymentStatus === "Paid";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl border border-border w-full max-w-sm p-6 animate-fade-in relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          {isPaid ? (
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-3" />
          ) : (
            <Clock className="w-16 h-16 text-warning mx-auto mb-3" />
          )}
          <h2 className="font-display text-xl font-bold text-foreground">{order.orderID}</h2>
          <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
            isPaid
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning"
          }`}>
            {isPaid ? "PAID" : "PENDING"}
          </div>
        </div>

        <div className="border-t border-dashed border-border pt-4 space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-foreground">
                {item.name} <span className="text-muted-foreground">×{item.quantity}</span>
              </span>
              <span className="font-semibold text-foreground">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-border mt-4 pt-4 flex justify-between items-center">
          <span className="font-display font-bold text-foreground">Total</span>
          <span className="font-display font-bold text-primary text-xl">₹{order.totalAmount}</span>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          {new Date(order.timestamp).toLocaleString()}
        </p>

        <Button onClick={onClose} className="w-full mt-6 h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-semibold">
          Done
        </Button>
      </div>
    </div>
  );
};

export default OrderReceipt;
