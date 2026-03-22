import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || "file:./dev.db"
});

const DEFAULT_ITEMS = [
  { id: "1", name: "Chicken Biryani", price: 180, imageURL: "https://source.unsplash.com/400x400/?chicken%20biryani", isAvailable: true, category: "Biryani", description: "Authentic dum biryani with tender chicken pieces.", isSpecial: true },
  { id: "2", name: "Mutton Biryani", price: 250, imageURL: "https://source.unsplash.com/400x400/?mutton%20biryani", isAvailable: true, category: "Biryani", description: "Rich and flavorful mutton biryani cooked to perfection." },
  { id: "3", name: "Veg Biryani", price: 140, imageURL: "https://source.unsplash.com/400x400/?veg%20biryani", isAvailable: true, category: "Biryani", description: "Aromatic basmati rice cooked with mixed vegetables." },
  { id: "4", name: "Masala Dosa", price: 80, imageURL: "https://source.unsplash.com/400x400/?masala%20dosa", isAvailable: true, category: "Tiffins", description: "Crispy crepe filled with spiced potato mash." },
  { id: "5", name: "Idli (2 pcs)", price: 50, imageURL: "https://source.unsplash.com/400x400/?idli", isAvailable: true, category: "Tiffins", description: "Soft and fluffy steamed rice cakes." },
  { id: "6", name: "Pesarattu", price: 70, imageURL: "https://source.unsplash.com/400x400/?pesarattu", isAvailable: true, category: "Tiffins", description: "Nutritious green gram dosa, a local favorite." },
  { id: "7", name: "Chicken 65", price: 160, imageURL: "https://source.unsplash.com/400x400/?chicken%2065", isAvailable: true, category: "Starters", description: "Spicy, deep-fried chicken bites.", isSpecial: true },
  { id: "8", name: "Paneer Tikka", price: 140, imageURL: "https://source.unsplash.com/400x400/?paneer%20tikka", isAvailable: true, category: "Starters", description: "Marinated paneer cubes grilled to perfection." },
  { id: "9", name: "Gulab Jamun (2 pcs)", price: 60, imageURL: "https://source.unsplash.com/400x400/?gulab%20jamun", isAvailable: true, category: "Desserts", description: "Sweet, melt-in-the-mouth Indian dessert." },
  { id: "10", name: "Double Ka Meetha", price: 80, imageURL: "https://source.unsplash.com/400x400/?double%20ka%20meetha", isAvailable: true, category: "Desserts", description: "Traditional Hyderabadi bread pudding.", isSpecial: true },
];

async function main() {
  console.log("Seeding database...");
  for (const item of DEFAULT_ITEMS) {
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }
  console.log("Seeding complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
