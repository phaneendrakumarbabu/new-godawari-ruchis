import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Godavari Orders API is running!</h1><p>The backend is working perfectly. Please open your Vite frontend (usually <b>http://localhost:5173</b>) to view the website.</p>");
});

// Routes for Menu
app.get("/api/menu", async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany({
      orderBy: { name: "asc" },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

app.post("/api/menu", async (req, res) => {
  const { name, price, category, description, imageURL, isAvailable, isSpecial } = req.body;
  try {
    const item = await prisma.menuItem.create({
      data: { name, price, category, description, imageURL, isAvailable, isSpecial },
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

// Routes for Orders
app.post("/api/orders", async (req, res) => {
  let { orderID, mobileNumber, totalAmount, paymentStatus, orderStatus, items } = req.body;
  try {
    if (!orderID) {
      const lastOrder = await prisma.order.findFirst({ orderBy: { createdAt: "desc" } });
      let nextId = 1;
      if (lastOrder && lastOrder.orderID.startsWith("#TOG-")) {
        nextId = (parseInt(lastOrder.orderID.replace(/\\D/g, "")) || 0) + 1;
      }
      orderID = `#TOG-${String(nextId).padStart(2, "0")}`;
    }

    const order = await prisma.order.create({
      data: {
        orderID,
        mobileNumber,
        totalAmount,
        paymentStatus: paymentStatus || "Pending",
        orderStatus: orderStatus || "New",
        items: {
          create: items.map((item: any) => ({
            menuItemId: item.id || item.menuItemId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });
    res.status(201).json(order);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.patch("/api/orders/:orderID/status", async (req, res) => {
  const { orderID } = req.params;
  const { orderStatus, paymentStatus } = req.body;
  try {
    const data: any = {};
    if (orderStatus) data.orderStatus = orderStatus;
    if (paymentStatus) data.paymentStatus = paymentStatus;

    const order = await prisma.order.update({
      where: { orderID },
      data,
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
