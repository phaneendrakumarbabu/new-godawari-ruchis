import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initialProducts = [
  {
    name: "Special Godavari Thali",
    price: 350,
    category: "Main Course",
    description: "A complete meal with rice, dal, curry, fry, curd, and sweet.",
  },
  {
    name: "Hyderabadi Chicken Biryani",
    price: 320,
    category: "Biryani",
    description: "Authentic spicy chicken biryani served with raita.",
  },
  {
    name: "Paneer Butter Masala",
    price: 280,
    category: "Curry",
    description: "Creamy paneer cubes in a rich tomato-based gravy.",
  },
  {
    name: "Butter Naan",
    price: 40,
    category: "Bread",
    description: "Soft leavened bread cooked in a tandoor with butter.",
  },
  {
    name: "Gulab Jamun",
    price: 80,
    category: "Dessert",
    description: "Two pieces of soft milk-based dumplings in sugar syrup.",
  }
];

async function main() {
  console.log("Seeding products...");
  for (const product of initialProducts) {
    await prisma.product.create({ data: product });
  }
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
