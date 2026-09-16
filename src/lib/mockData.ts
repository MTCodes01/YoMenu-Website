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
  currency: string;
  currencySymbol: string;
  phone: string;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  image?: string;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatar?: string;
};

export const restaurantData: RestaurantInfo = {
  id: "rest-1",
  name: "Malabar Table",
  description: "Authentic South Indian & Kerala Cuisine",
  logo: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=150&h=150&q=80",
  coverImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&h=400&q=80",
  rating: 4.7,
  reviewsCount: 238,
  location: "Trivandrum, Kerala",
  address: "123 MG Road, Near Pattom, Trivandrum 695004",
  openUntil: "10:30 PM",
  currency: "INR",
  currencySymbol: "₹",
  phone: "+91 98765 43210"
};

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
    image: "https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=300&h=300&q=80",
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
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&w=300&h=300&q=80",
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
    image: "https://images.unsplash.com/photo-1605658607902-6014e82b3d36?auto=format&fit=crop&w=300&h=300&q=80",
    category: "cat-5",
    isVeg: true,
    isPopular: false,
  },
  {
    id: "item-8",
    name: "Fresh Lime Soda",
    description: "Refreshing sweet and salty lime soda.",
    price: 80,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&h=300&q=80",
    category: "cat-6",
    isVeg: true,
    isPopular: false,
  }
];

export const offers: Offer[] = [
  {
    id: "off-1",
    title: "Flat 20% Off",
    description: "On all main course items",
    discount: "20%",
    code: "MALABAR20",
  },
  {
    id: "off-2",
    title: "Free Dessert",
    description: "On orders above ₹1000",
    discount: "Free",
    code: "SWEETREAT",
  }
];

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
  }
];
