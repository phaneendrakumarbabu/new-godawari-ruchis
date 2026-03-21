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
  { id: "1", name: "Chicken Biryani", price: 180, imageURL: chickenBiryaniImg, isAvailable: true, category: "Biryani" },
  { id: "2", name: "Mutton Biryani", price: 250, imageURL: muttonBiryaniImg, isAvailable: true, category: "Biryani" },
  { id: "3", name: "Veg Biryani", price: 140, imageURL: vegBiryaniImg, isAvailable: true, category: "Biryani" },
  { id: "4", name: "Masala Dosa", price: 80, imageURL: masalaDosaImg, isAvailable: true, category: "Tiffins" },
  { id: "5", name: "Idli (2 pcs)", price: 50, imageURL: idliImg, isAvailable: true, category: "Tiffins" },
  { id: "6", name: "Pesarattu", price: 70, imageURL: pesarattuImg, isAvailable: true, category: "Tiffins" },
  { id: "7", name: "Chicken 65", price: 160, imageURL: chicken65Img, isAvailable: true, category: "Starters" },
  { id: "8", name: "Paneer Tikka", price: 140, imageURL: paneerTikkaImg, isAvailable: true, category: "Starters" },
  { id: "9", name: "Gulab Jamun (2 pcs)", price: 60, imageURL: gulabJamunImg, isAvailable: true, category: "Desserts" },
  { id: "10", name: "Double Ka Meetha", price: 80, imageURL: doubleKaMeethaImg, isAvailable: true, category: "Desserts" },
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
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem("tog-menu");
    if (saved) {
      const parsed = JSON.parse(saved) as MenuItem[];
      // Re-map default item images from imports (localStorage can't store blob URLs)
      const defaultMap = new Map(DEFAULT_ITEMS.map((d) => [d.id, d.imageURL]));
      return parsed.map((item) => ({
        ...item,
        imageURL: defaultMap.get(item.id) || item.imageURL,
      }));
    }
    return DEFAULT_ITEMS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("tog-orders");
    if (saved) {
      const parsed = JSON.parse(saved);
      orderCounter = parsed.length + 1;
      return parsed;
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("tog-menu", JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem("tog-orders", JSON.stringify(orders));
  }, [orders]);

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
    return order;
  };

  const getOrdersByMobile = (mobile: string) => orders.filter((o) => o.mobileNumber === mobile);

  const toggleAvailability = (itemId: string) =>
    setMenuItems((prev) => prev.map((m) => m.id === itemId ? { ...m, isAvailable: !m.isAvailable } : m));

  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const imageURL = item.imageURL || getFoodImageURL(item.name);
    setMenuItems((prev) => [...prev, { ...item, imageURL, id: String(Date.now()) }]);
  };

  const deleteMenuItem = (itemId: string) =>
    setMenuItems((prev) => prev.filter((m) => m.id !== itemId));

  const updateOrderStatus = (orderID: string, status: Order["orderStatus"]) =>
    setOrders((prev) => prev.map((o) => o.orderID === orderID ? { ...o, orderStatus: status } : o));

  const markOrderPaid = (orderID: string) =>
    setOrders((prev) => prev.map((o) => o.orderID === orderID ? { ...o, paymentStatus: "Paid" } : o));

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
