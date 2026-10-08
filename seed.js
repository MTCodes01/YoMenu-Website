import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing SUPABASE URL or KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const restaurantData = {
  id: "6e26cf81-f09b-4f9f-a2e6-76cd3c5c56d7", // Use a static valid UUID
  name: "Malabar Table",
  description: "Authentic South Indian & Kerala Cuisine",
  logo: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=150&h=150&q=80",
  cover_image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&h=400&q=80",
  rating: 4.7,
  reviews_count: 238,
  location: "Trivandrum, Kerala",
  address: "123 MG Road, Near Pattom, Trivandrum 695004",
  open_until: "10:30 PM",
  currency: "INR",
  currency_symbol: "₹",
  phone: "+919876543210",
  instagram: "https://instagram.com/malabartable",
  whatsapp: "+919876543210"
};

const categories = [
  { id: "e6a117b8-154a-4d2c-80b6-1d13f9c6d48a", name: "Specials", icon: "✨" },
  { id: "d69a5323-8cc2-4df3-a15d-8521a0fb8720", name: "Starters", icon: "🥟" },
  { id: "e2c347ad-323a-4be2-af2f-7f55bdfd9418", name: "Main Course", icon: "🍛" },
  { id: "1be550e5-79e5-4a6c-b362-e6b3eb9ebce9", name: "Breads", icon: "🫓" },
  { id: "6c9d747d-8152-4ea5-802c-4613c713b177", name: "Desserts", icon: "🍨" },
  { id: "eb35f8d0-60b6-4dfc-acfa-79fbb249d375", name: "Beverages", icon: "🍹" }
];

const menuItems = [
  { name: "Kerala Beef Fry", description: "Slow-roasted beef with coconut slices, curry leaves, and traditional Kerala spices.", price: 320, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&h=300&q=80", category_id: categories[0].id, is_veg: false, is_popular: true, spicy_level: 3 },
  { name: "Malabar Chicken Biryani", description: "Fragrant kaima rice cooked with tender chicken and authentic Malabar spices.", price: 280, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&h=300&q=80", category_id: categories[2].id, is_veg: false, is_popular: true, spicy_level: 2 },
  { name: "Parippu Vada", description: "Crispy lentil fritters served with coconut chutney. A perfect evening snack.", price: 120, image: "https://images.unsplash.com/photo-1601050690117-94f5f6af8bd3?auto=format&fit=crop&w=300&h=300&q=80", category_id: categories[1].id, is_veg: true, is_popular: false, spicy_level: 1 },
  { name: "Paneer Butter Masala", description: "Soft paneer cubes simmered in a rich and creamy tomato-based gravy.", price: 250, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&h=300&q=80", category_id: categories[2].id, is_veg: true, is_popular: true },
  { name: "Kerala Parotta", description: "Flaky, layered flatbread made from maida, perfect to pair with curries.", price: 25, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&h=300&q=80", category_id: categories[3].id, is_veg: true, is_popular: true },
  { name: "Appam", description: "Lace-edged rice pancake with a soft center.", price: 20, image: "https://images.unsplash.com/photo-1626509653294-01306b997e06?auto=format&fit=crop&w=300&h=300&q=80", category_id: categories[3].id, is_veg: true, is_popular: true }
];

const offers = [
  { title: "Flat 20% Off", description: "On all main course items", discount: "20%", code: "MALABAR20", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&h=300&q=80" },
  { title: "Free Dessert", description: "On orders above ₹1000", discount: "Free", code: "SWEETREAT", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=300&h=300&q=80" }
];

async function seed() {
  console.log("Starting seed...");
  
  // Clean up existing
  await supabase.from('restaurants').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const { error: rErr } = await supabase.from('restaurants').insert([restaurantData]);
  if (rErr) console.error("Error inserting restaurant", rErr);
  else console.log("Restaurant seeded.");

  const categoriesToInsert = categories.map(c => ({ ...c, restaurant_id: restaurantData.id }));
  const { error: cErr } = await supabase.from('menu_categories').insert(categoriesToInsert);
  if (cErr) console.error("Error inserting categories", cErr);
  else console.log("Categories seeded.");

  const itemsToInsert = menuItems.map(i => ({ ...i, restaurant_id: restaurantData.id }));
  const { error: iErr } = await supabase.from('menu_items').insert(itemsToInsert);
  if (iErr) console.error("Error inserting items", iErr);
  else console.log("Items seeded.");

  const offersToInsert = offers.map(o => ({ ...o, restaurant_id: restaurantData.id }));
  const { error: oErr } = await supabase.from('offers').insert(offersToInsert);
  if (oErr) console.error("Error inserting offers", oErr);
  else console.log("Offers seeded.");

  console.log("Seeding complete!");
}

seed();
