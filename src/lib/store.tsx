import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import chickenBiryaniImg from "@/assets/food/chicken-biryani.jpg";
import muttonBiryaniImg from "@/assets/food/mutton-biryani.jpg";
import vegBiryaniImg from "@/assets/food/veg-biryani.jpg";
import masalaDosaImg from "@/assets/food/masala-dosa.jpg";
import idliImg from "@/assets/food/idli.jpg";
import pesarattuImg from "@/assets/food/pesarattu.jpg";
import chicken65Img from "@/assets/food/chicken-65.jpg";
import paneerTikkaImg from "@/assets/food/paneer-tikka.jpg";
import gulabJamunImg from "@/assets/food/gulab-jamun.jpg";
import doubleKaMeethaImg from "@/assets/food/double-ka-meetha.jpg";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageURL: string;
  isAvailable: boolean;
  category?: string;
  description?: string;
  isSpecial?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  orderID: string;
  mobileNumber: string;
  items: CartItem[];
  totalAmount: number;
  paymentStatus: "Paid" | "Pending" | "Cash";
  timestamp: number;
  orderStatus: "New" | "Preparing" | "Completed";
}

// Generate a food image URL from item name using Unsplash
export const getFoodImageURL = (name: string) =>
  `https://source.unsplash.com/400x400/?${encodeURIComponent(name + " indian food")}`;

const DEFAULT_ITEMS: MenuItem[] = [
  { id: "1", name: "Chicken Biryani", price: 180, imageURL: chickenBiryaniImg, isAvailable: true, category: "Biryani", description: "Authentic dum biryani with tender chicken pieces.", isSpecial: true },
  { id: "2", name: "Mutton Biryani", price: 250, imageURL: muttonBiryaniImg, isAvailable: true, category: "Biryani", description: "Rich and flavorful mutton biryani cooked to perfection." },
  { id: "3", name: "Veg Biryani", price: 140, imageURL: vegBiryaniImg, isAvailable: true, category: "Biryani", description: "Aromatic basmati rice cooked with mixed vegetables." },
  { id: "4", name: "Masala Dosa", price: 80, imageURL: masalaDosaImg, isAvailable: true, category: "Tiffins", description: "Crispy crepe filled with spiced potato mash." },
  { id: "5", name: "Idli (2 pcs)", price: 50, imageURL: idliImg, isAvailable: true, category: "Tiffins", description: "Soft and fluffy steamed rice cakes." },
  { id: "6", name: "Pesarattu", price: 70, imageURL: pesarattuImg, isAvailable: true, category: "Tiffins", description: "Nutritious green gram dosa, a local favorite." },
  { id: "7", name: "Chicken 65", price: 160, imageURL: chicken65Img, isAvailable: true, category: "Starters", description: "Spicy, deep-fried chicken bites.", isSpecial: true },
  { id: "8", name: "Paneer Tikka", price: 140, imageURL: paneerTikkaImg, isAvailable: true, category: "Starters", description: "Marinated paneer cubes grilled to perfection." },
  { id: "9", name: "Gulab Jamun (2 pcs)", price: 60, imageURL: gulabJamunImg, isAvailable: true, category: "Desserts", description: "Sweet, melt-in-the-mouth Indian dessert." },
  { id: "10", name: "Double Ka Meetha", price: 80, imageURL: doubleKaMeethaImg, isAvailable: true, category: "Desserts", description: "Traditional Hyderabadi bread pudding.", isSpecial: true },
];

interface StoreContextType {
  menuItems: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (mobileNumber: string, paymentStatus: "Paid" | "Cash") => Order;
  getOrdersByMobile: (mobile: string) => Order[];
  toggleAvailability: (itemId: string) => void;
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateOrderStatus: (orderID: string, status: Order["orderStatus"]) => void;
  markOrderPaid: (orderID: string) => void;
  deleteMenuItem: (itemId: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};

let orderCounter = 1;

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_ITEMS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/menu");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setMenuItems(data);
        }
      } catch (e) {
        console.error("Failed to fetch menu", e);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
          if (data.length > 0) {
            const maxId = Math.max(...data.map((o: Order) => parseInt(o.orderID.replace(/\\D/g, "")) || 0));
            orderCounter = maxId + 1;
          }
        }
      } catch (e) {
        console.error("Failed to fetch orders", e);
      }
    };

    fetchMenu();
    fetchOrders();

    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

// Removing raw localStorage effects

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => setCart((prev) => prev.filter((c) => c.id !== itemId));

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(itemId);
    setCart((prev) => prev.map((c) => c.id === itemId ? { ...c, quantity } : c));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (mobileNumber: string, paymentStatus: "Paid" | "Cash") => {
    const order: Order = {
      orderID: `#TOG-${String(orderCounter).padStart(2, "0")}`,
      mobileNumber,
      items: [...cart],
      totalAmount: cart.reduce((sum, c) => sum + c.price * c.quantity, 0),
      paymentStatus: paymentStatus === "Cash" ? "Pending" : "Paid",
      timestamp: Date.now(),
      orderStatus: "New",
    };
    orderCounter++;
    
    setOrders((prev) => [order, ...prev]);
    clearCart();

    fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    }).catch(console.error);

    return order;
  };

  const getOrdersByMobile = (mobile: string) => orders.filter((o) => o.mobileNumber === mobile);

  const toggleAvailability = (itemId: string) =>
    setMenuItems((prev) => prev.map((m) => m.id === itemId ? { ...m, isAvailable: !m.isAvailable } : m));

  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const imageURL = item.imageURL || getFoodImageURL(item.name);
    const newItem = { ...item, imageURL, id: String(Date.now()) };
    setMenuItems((prev) => [...prev, newItem]);
    
    fetch("http://localhost:5000/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem)
    }).catch(console.error);
  };

  const deleteMenuItem = (itemId: string) =>
    setMenuItems((prev) => prev.filter((m) => m.id !== itemId));

  const updateOrderStatus = (orderID: string, status: Order["orderStatus"]) => {
    setOrders((prev) => prev.map((o) => o.orderID === orderID ? { ...o, orderStatus: status } : o));
    fetch(`http://localhost:5000/api/orders/${encodeURIComponent(orderID)}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus: status })
    }).catch(console.error);
  };

  const markOrderPaid = (orderID: string) => {
    setOrders((prev) => prev.map((o) => o.orderID === orderID ? { ...o, paymentStatus: "Paid" } : o));
    fetch(`http://localhost:5000/api/orders/${encodeURIComponent(orderID)}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: "Paid" })
    }).catch(console.error);
  };

  return (
    <StoreContext.Provider value={{
      menuItems, cart, orders, addToCart, removeFromCart, updateCartQuantity,
      clearCart, placeOrder, getOrdersByMobile, toggleAvailability, addMenuItem,
      updateOrderStatus, markOrderPaid, deleteMenuItem,
    }}>
      {children}
    </StoreContext.Provider>
  );
};
