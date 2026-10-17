export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  isPopular: boolean;
  spicyLevel?: 1 | 2 | 3;
};

export type MenuCategory = {
  id: string;
  name: string;
  icon: string;
};

export type RestaurantInfo = {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewsCount: number;
  location: string;
  address: string;
  openUntil: string;
  openHours?: string;
  currency: string;
  currencySymbol: string;
  phone: string;
  email?: string;
  instagram?: string;
  whatsapp?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  website?: string;
  mapsUrl?: string;
  branches?: { name: string; address: string }[];
};

export type Notice = {
  id: string;
  title: string;
  description: string;
  image?: string;
  discount?: string;
  code?: string;
};

export type Offer = Notice;

export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatar?: string;
};

// --- RESTAURANT 1: Malabar Table ---
export const restaurantData: RestaurantInfo = {
  id: "6e26cf81-f09b-4f9f-a2e6-76cd3c5c56d7",
  name: "Malabar Table",
  description: "Authentic South Indian & Kerala Cuisine",
  logo: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=150&h=150&q=80",
  coverImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&h=400&q=80",
  rating: 4.7,
  reviewsCount: 238,
  location: "Trivandrum, Kerala",
  address: "123 MG Road, Near Pattom, Trivandrum 695004",
  openUntil: "10:30 PM",
  openHours: "11:00 AM - 10:30 PM",
  currency: "INR",
  currencySymbol: "₹",
  phone: "+91 98765 43210",
  email: "contact@malabartable.com",
  instagram: "https://instagram.com/malabartable",
  whatsapp: "+91 98765 43210",
  facebook: "https://facebook.com/malabartable",
  twitter: "https://x.com/malabartable",
  youtube: "https://youtube.com/@malabartable",
  website: "https://malabartable.com",
  mapsUrl: "https://maps.google.com/?q=MG+Road+Trivandrum",
  branches: [
    { name: "Kochi Branch", address: "456 Marine Drive, Kochi 682031" },
    { name: "Calicut Branch", address: "789 Beach Road, Calicut 673032" }
  ]
};

// --- RESTAURANT 2: The Spice Coast Grill ---
export const restaurantData2: RestaurantInfo = {
  id: "rest-spice-coast-2",
  name: "The Spice Coast Grill",
  description: "Coastal Seafood, Tandoor & Charcoal Barbecue",
  logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&h=150&q=80",
  coverImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&h=400&q=80",
  rating: 4.8,
  reviewsCount: 312,
  location: "Kochi, Kerala",
  address: "456 Marine Drive, Near High Court, Kochi 682031",
  openUntil: "11:30 PM",
  openHours: "12:00 PM - 11:30 PM",
  currency: "INR",
  currencySymbol: "₹",
  phone: "+91 98450 12345",
  email: "contact@spicecoastgrill.com",
  instagram: "https://instagram.com/spicecoastgrill",
  whatsapp: "+91 98450 12345",
  facebook: "https://facebook.com/spicecoastgrill",
  twitter: "https://x.com/spicecoast",
  youtube: "https://youtube.com/@spicecoastgrill",
  website: "https://spicecoastgrill.com",
  mapsUrl: "https://maps.google.com/?q=Marine+Drive+Kochi",
  branches: [
    { name: "Fort Kochi Branch", address: "Princess St, Fort Kochi 682001" }
  ]
};

export const initialRestaurantsList: RestaurantInfo[] = [
  restaurantData,
  restaurantData2
];

// --- RESTAURANT 1 CATEGORIES & ITEMS ---
export const menuCategories: MenuCategory[] = [
  { id: "cat-1", name: "Specials", icon: "✨" },
  { id: "cat-2", name: "Starters", icon: "🥟" },
  { id: "cat-3", name: "Main Course", icon: "🍛" },
  { id: "cat-4", name: "Breads", icon: "🫓" },
  { id: "cat-5", name: "Desserts", icon: "🍨" },
  { id: "cat-6", name: "Beverages", icon: "🍹" }
];

export const menuItems: MenuItem[] = [
  {
    id: "item-1",
    name: "Kerala Beef Fry",
    description: "Slow-roasted beef with coconut slices, curry leaves, and traditional Kerala spices.",
    price: 320,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&h=300&q=80",
    category: "cat-1",
    isVeg: false,
    isPopular: true,
    spicyLevel: 3,
  },
  {
    id: "item-2",
    name: "Malabar Chicken Biryani",
    description: "Fragrant kaima rice cooked with tender chicken and authentic Malabar spices.",
    price: 280,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&h=300&q=80",
    category: "cat-3",
    isVeg: false,
    isPopular: true,
    spicyLevel: 2,
  },
  {
    id: "item-3",
    name: "Parippu Vada",
    description: "Crispy lentil fritters served with coconut chutney. A perfect evening snack.",
    price: 120,
    image: "https://images.unsplash.com/photo-1601050690117-94f5f6af8bd3?auto=format&fit=crop&w=300&h=300&q=80",
    category: "cat-2",
    isVeg: true,
    isPopular: false,
    spicyLevel: 1,
  },
  {
    id: "item-4",
    name: "Paneer Butter Masala",
    description: "Soft paneer cubes simmered in a rich and creamy tomato-based gravy.",
    price: 250,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&h=300&q=80",
    category: "cat-3",
    isVeg: true,
    isPopular: true,
  },
  {
    id: "item-5",
    name: "Kerala Parotta",
    description: "Flaky, layered flatbread made from maida, perfect to pair with curries.",
    price: 25,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&h=300&q=80",
    category: "cat-4",
    isVeg: true,
    isPopular: true,
  },
  {
    id: "item-6",
    name: "Appam",
    description: "Lace-edged rice pancake with a soft center.",
    price: 20,
    image: "https://images.unsplash.com/photo-1626509653294-01306b997e06?auto=format&fit=crop&w=300&h=300&q=80",
    category: "cat-4",
    isVeg: true,
    isPopular: true,
  },
  {
    id: "item-7",
    name: "Payasam",
    description: "Traditional South Indian dessert made with jaggery, coconut milk, and rice flakes.",
    price: 150,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=300&h=300&q=80",
    category: "cat-5",
    isVeg: true,
    isPopular: false,
  },
  {
    id: "item-8",
    name: "Fresh Lime Soda",
    description: "Refreshing sweet and salty lime soda.",
    price: 80,
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=300&h=300&q=80",
    category: "cat-6",
    isVeg: true,
    isPopular: false,
  },
  {
    id: "item-9",
    name: "Mango Lassi",
    description: "Sweet and creamy yogurt-based drink flavored with fresh ripe mangoes.",
    price: 90,
    image: "https://images.unsplash.com/photo-1550461716-ba455913e61c?auto=format&fit=crop&w=300&h=300&q=80",
    category: "cat-6",
    isVeg: true,
    isPopular: true,
  }
];

export const notices1: Notice[] = [
  {
    id: "not-1",
    title: "Weekend Kerala Seafood Fest",
    description: "Special Karimeen Pollichathu and Seer Fish Fry prepared by our Master Chef this Saturday & Sunday.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: "not-2",
    title: "Live Acoustic Music Nights",
    description: "Relax with traditional and fusion acoustic music every Friday from 7:30 PM onwards.",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=300&h=300&q=80"
  }
];

// --- RESTAURANT 2 CATEGORIES & ITEMS ---
export const menuCategories2: MenuCategory[] = [
  { id: "sc-cat-1", name: "Chef's Specials", icon: "🔥" },
  { id: "sc-cat-2", name: "Tandoori Starters", icon: "🍢" },
  { id: "sc-cat-3", name: "Seafood Curries", icon: "🦐" },
  { id: "sc-cat-4", name: "Breads & Rice", icon: "🫓" },
  { id: "sc-cat-5", name: "Sweets & Desserts", icon: "🍨" },
  { id: "sc-cat-6", name: "Beverages", icon: "🍹" }
];

export const menuItems2: MenuItem[] = [
  {
    id: "sc-item-1",
    name: "Tandoori King Prawns",
    description: "Jumbo prawns marinated in ajwain, curd and mustard oil, grilled to smoky perfection.",
    price: 490,
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=300&h=300&q=80",
    category: "sc-cat-1",
    isVeg: false,
    isPopular: true,
    spicyLevel: 2
  },
  {
    id: "sc-item-2",
    name: "Neymeen Fish Fry",
    description: "Crispy tava-fried Seer Fish slice marinated with shallots, crushed pepper and lemon.",
    price: 360,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=300&h=300&q=80",
    category: "sc-cat-2",
    isVeg: false,
    isPopular: true,
    spicyLevel: 3
  },
  {
    id: "sc-item-3",
    name: "Crab Roast Masala",
    description: "Fresh mud crabs slow cooked in caramelized onions, green chilies and thick coconut paste.",
    price: 420,
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=300&h=300&q=80",
    category: "sc-cat-3",
    isVeg: false,
    isPopular: true,
    spicyLevel: 3
  },
  {
    id: "sc-item-4",
    name: "Garlic Butter Naan",
    description: "Leavened oven-baked flatbread brushed with minced roasted garlic and butter.",
    price: 65,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&h=300&q=80",
    category: "sc-cat-4",
    isVeg: true,
    isPopular: true
  },
  {
    id: "sc-item-5",
    name: "Elaneer Payasam",
    description: "Exquisite tender coconut pudding crafted with coconut cream and milk.",
    price: 160,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=300&h=300&q=80",
    category: "sc-cat-5",
    isVeg: true,
    isPopular: true
  },
  {
    id: "sc-item-6",
    name: "Tender Coconut Shake",
    description: "Creamy shake made with freshly scooped malai and sweet tender coconut water.",
    price: 110,
    image: "https://images.unsplash.com/photo-1550461716-ba455913e61c?auto=format&fit=crop&w=300&h=300&q=80",
    category: "sc-cat-6",
    isVeg: true,
    isPopular: true
  },
  {
    id: "sc-item-7",
    name: "Kulukki Sarbath",
    description: "Shaken iced lemonade with basil seeds, green chili hint, and crushed pineapple.",
    price: 70,
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=300&h=300&q=80",
    category: "sc-cat-6",
    isVeg: true,
    isPopular: false
  }
];

export const notices2: Notice[] = [
  {
    id: "not-21",
    title: "Catch of the Day: Live Mud Crabs",
    description: "Fresh mud crabs and tiger prawns arriving straight from Munambam harbor every afternoon.",
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: "not-22",
    title: "Sunset Terrace Barbecue",
    description: "Open-air grilling and coastal breeze on our 2nd floor terrace overlooking Marine Drive.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&h=300&q=80"
  }
];

// Alias for backwards compatibility
export const offers: Notice[] = notices1;

export const reviews: Review[] = [
  {
    id: "rev-1",
    author: "Rahul S.",
    rating: 5,
    date: "2 days ago",
    comment: "The Beef Fry here is legendary! Just exactly how it tastes back in Kerala. The parottas were flaky and fresh.",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "rev-2",
    author: "Anjali M.",
    rating: 4,
    date: "1 week ago",
    comment: "Great ambiance and good food. The biryani was slightly less spicy than I expected, but very flavorful.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "rev-3",
    author: "Kiran V.",
    rating: 5,
    date: "2 weeks ago",
    comment: "Absolutely love the Appam and stew combo. Fast service and very clean place.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
  }
];
