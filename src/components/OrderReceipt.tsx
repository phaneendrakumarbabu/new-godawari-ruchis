import { useRef } from "react";
import { CheckCircle, Clock, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order } from "@/lib/store";

interface Props {
  order: Order;
  onClose: () => void;
}

const OrderReceipt = ({ order, onClose }: Props) => {
  const isPaid = order.paymentStatus === "Paid";
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!receiptRef.current) return;

    // Build a standalone HTML string for the receipt
    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Receipt ${order.orderID}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 40px; background: #f5f5f5; }
  .receipt { max-width: 360px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { text-align: center; margin-bottom: 24px; }
  .brand { font-size: 14px; color: #888; margin-bottom: 4px; }
  .order-id { font-size: 22px; font-weight: 700; color: #1a1a1a; }
  .badge { display: inline-block; margin-top: 8px; padding: 4px 16px; border-radius: 999px; font-size: 12px; font-weight: 700; }
  .badge-paid { background: #dcfce7; color: #16a34a; }
  .badge-pending { background: #fef3c7; color: #d97706; }
  .divider { border: none; border-top: 1px dashed #e5e5e5; margin: 16px 0; }
  .item { display: flex; justify-content: space-between; font-size: 14px; padding: 4px 0; color: #333; }
  .item .qty { color: #888; }
  .total { display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; padding: 8px 0; }
  .total .amount { color: #dc2626; }
  .footer { text-align: center; font-size: 11px; color: #999; margin-top: 16px; }
</style>
</head>
<body>
<div class="receipt">
  <div class="header">
    <div class="brand">Tastes of Godavari</div>
    <div class="order-id">${order.orderID}</div>
    <span class="badge ${isPaid ? 'badge-paid' : 'badge-pending'}">${isPaid ? 'PAID' : 'PENDING'}</span>
  </div>
  <hr class="divider"/>
  ${order.items.map(item => `
  <div class="item">
    <span>${item.name} <span class="qty">×${item.quantity}</span></span>
    <span>₹${item.price * item.quantity}</span>
  </div>`).join('')}
  <hr class="divider"/>
  <div class="total">
    <span>Total</span>
    <span class="amount">₹${order.totalAmount}</span>
  </div>
  <div class="footer">
    ${new Date(order.timestamp).toLocaleString()}<br/>
    Thank you for your order!
  </div>
</div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${order.orderID.replace("#", "")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div ref={receiptRef} className="bg-card rounded-lg shadow-xl border border-border w-full max-w-sm p-6 animate-fade-in relative">
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

        <div className="flex gap-2 mt-6">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex-1 h-12 rounded-lg font-semibold gap-2 border-border text-foreground"
          >
            <Download className="w-4 h-4" /> Download
          </Button>
          <Button onClick={onClose} className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-semibold">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
