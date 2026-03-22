import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const {
    menuItems, orders, toggleAvailability, addMenuItem, deleteMenuItem,
    updateOrderStatus, markOrderPaid,
  } = useStore();

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newIsSpecial, setNewIsSpecial] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("tog-admin") !== btoa("godavari2024-admin-token")) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const prevOrdersLength = useRef(orders.length);

  useEffect(() => {
    if (orders.length > prevOrdersLength.current) {
      const newOrder = orders[0];
      toast.info(`New Order: ${newOrder.orderID}`, { duration: 5000 });
      const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
      audio.play().catch(() => {});
    }
    prevOrdersLength.current = orders.length;
  }, [orders]);

  const handleAddItem = () => {
    if (!newName.trim() || !newPrice.trim()) {
      toast.error("Name and price are required");
      return;
    }
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Invalid price");
      return;
    }
    addMenuItem({
      name: newName.trim(),
      price,
      imageURL: "",
      isAvailable: true,
      category: newCategory.trim() || "Other",
      description: newDescription.trim() || undefined,
      isSpecial: newIsSpecial,
    });
    setNewName("");
    setNewPrice("");
    setNewCategory("");
    setNewDescription("");
    setNewIsSpecial(false);
    toast.success("Item added!");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("tog-admin");
    navigate("/");
  };

  const activeOrders = orders.filter((o) => o.orderStatus !== "Completed");
  const completedOrders = orders.filter((o) => o.orderStatus === "Completed");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="font-display text-lg font-bold text-primary">Admin Dashboard</h1>
        <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <Tabs defaultValue="orders" className="p-4">
        <TabsList className="w-full bg-muted rounded-lg h-11 mb-4">
          <TabsTrigger value="orders" className="flex-1 rounded-md font-display text-sm data-[state=active]:bg-card data-[state=active]:text-primary">
            Orders ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex-1 rounded-md font-display text-sm data-[state=active]:bg-card data-[state=active]:text-primary">
            Inventory
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1 rounded-md font-display text-sm data-[state=active]:bg-card data-[state=active]:text-primary hidden md:inline-flex">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="add" className="flex-1 rounded-md font-display text-sm data-[state=active]:bg-card data-[state=active]:text-primary">
            Add
          </TabsTrigger>
        </TabsList>

        {/* ORDERS TAB */}
        <TabsContent value="orders" className="space-y-3 mt-0">
          {activeOrders.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No active orders</p>
          )}
          {activeOrders.map((order) => (
            <div key={order.orderID} className="bg-card rounded-lg border border-border p-4 animate-fade-in">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-display font-bold text-foreground">{order.orderID}</p>
                  <p className="text-xs text-muted-foreground">{order.mobileNumber}</p>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      order.paymentStatus === "Paid"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {order.paymentStatus}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-border text-foreground">
                    {order.orderStatus}
                  </Badge>
                </div>
              </div>

              <div className="text-sm text-muted-foreground mb-3">
                {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
              </div>

              <div className="flex justify-between items-center">
                <p className="font-bold text-primary">₹{order.totalAmount}</p>
                <div className="flex gap-2">
                  {order.paymentStatus === "Pending" && (
                    <Button
                      size="sm"
                      onClick={() => { markOrderPaid(order.orderID); toast.success("Marked as paid"); }}
                      className="h-8 rounded-md bg-success text-success-foreground hover:bg-success/90 text-xs"
                    >
                      Mark Paid
                    </Button>
                  )}
                  {order.orderStatus === "New" && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.orderID, "Preparing")}
                      className="h-8 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs"
                    >
                      Start Preparing
                    </Button>
                  )}
                  {order.orderStatus === "Preparing" && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.orderID, "Completed")}
                      className="h-8 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {completedOrders.length > 0 && (
            <>
              <h3 className="font-display font-bold text-muted-foreground text-sm pt-4">
                Completed ({completedOrders.length})
              </h3>
              {completedOrders.slice(0, 5).map((order) => (
                <div key={order.orderID} className="bg-card rounded-lg border border-border p-3 opacity-60">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-display font-semibold text-foreground text-sm">{order.orderID}</p>
                      <p className="text-xs text-muted-foreground">{order.mobileNumber}</p>
                    </div>
                    <p className="font-bold text-foreground text-sm">₹{order.totalAmount}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </TabsContent>

        {/* INVENTORY TAB */}
        <TabsContent value="inventory" className="space-y-3 mt-0">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-card rounded-lg border border-border p-4 flex items-center justify-between animate-fade-in relative overflow-hidden">
              {item.isSpecial && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />}
              <div className="flex-1 min-w-0 mr-3 pl-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-foreground text-sm truncate">{item.name}</h3>
                  {item.isSpecial && <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 px-1 text-[9px] py-0 border-none">Special</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{item.category} · ₹{item.price}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Switch
                  checked={item.isAvailable}
                  onCheckedChange={() => toggleAvailability(item.id)}
                  className="data-[state=checked]:bg-success"
                />
                <button onClick={() => { deleteMenuItem(item.id); toast.success("Item deleted"); }} className="text-destructive p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="mt-0">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
              <p className="text-xs font-medium text-muted-foreground mb-1">Total Revenue</p>
              <h3 className="text-xl font-bold text-foreground">₹{orders.reduce((sum, o) => sum + o.totalAmount, 0)}</h3>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
              <p className="text-xs font-medium text-muted-foreground mb-1">Total Orders</p>
              <h3 className="text-xl font-bold text-foreground">{orders.length}</h3>
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-lg border border-border shadow-sm h-64">
            <h3 className="text-xs font-medium text-muted-foreground mb-4">Orders by Status</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: "New", value: orders.filter(o => o.orderStatus === "New").length },
                { name: "Prep", value: orders.filter(o => o.orderStatus === "Preparing").length },
                { name: "Done", value: orders.filter(o => o.orderStatus === "Completed").length }
              ]}>
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        {/* ADD ITEM TAB */}
        <TabsContent value="add" className="mt-0">
          <div className="bg-card rounded-lg border border-border p-6 space-y-4 animate-fade-in">
            <h2 className="font-display font-bold text-foreground text-lg">Add New Item</h2>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Item Name</label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Chicken Dum Biryani" className="h-11 rounded-lg bg-background border-border" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Price (₹)</label>
              <Input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="e.g. 200" className="h-11 rounded-lg bg-background border-border" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Category</label>
              <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="e.g. Biryani, Starters" className="h-11 rounded-lg bg-background border-border" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Description (Optional)</label>
              <Input value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="e.g. Authentic dum cooked..." className="h-11 rounded-lg bg-background border-border" />
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background/50">
              <label htmlFor="special" className="text-sm font-medium text-foreground cursor-pointer">Mark as Special / Bestseller</label>
              <Switch checked={newIsSpecial} onCheckedChange={setNewIsSpecial} id="special" />
            </div>
            <Button onClick={handleAddItem} className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-semibold gap-2">
              <Plus className="w-5 h-5" /> Add Item
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
