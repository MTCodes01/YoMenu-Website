"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { Space_Mono } from "next/font/google";
import { menuCategories, menuItems, restaurantData } from "@/lib/mockData";

const spaceMono = Space_Mono({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
});

export default function CustomerMenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "veg" | "non-veg">("all");

  const categories = [{ id: "All", name: "All", icon: "" }, ...menuCategories];

  // Filtering
  let filteredItems = menuItems;
  
  if (activeCategory !== "All") {
    filteredItems = filteredItems.filter(item => item.category === activeCategory);
  }

  if (searchQuery) {
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (dietaryFilter === "veg") {
    filteredItems = filteredItems.filter(item => item.isVeg);
  } else if (dietaryFilter === "non-veg") {
    filteredItems = filteredItems.filter(item => !item.isVeg);
  }

  return (
    <div className={`${spaceMono.variable} font-mono bg-white text-black min-h-screen pb-12 p-4 md:max-w-3xl md:mx-auto md:border-x`}>
      
      {/* Search Bar */}
      <div className="relative mb-6 mt-2">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search in Menu"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-200 outline-none focus:border-[#133F31] transition-colors text-sm"
        />
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2.5 mb-5">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors border ${
              activeCategory === cat.id 
                ? "bg-[#133F31] text-white border-[#133F31]" 
                : "bg-white text-black border-gray-200 hover:border-gray-300"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Dietary Filter (Subtle secondary filter) */}
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setDietaryFilter('all')}
          className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${dietaryFilter === 'all' ? 'bg-gray-100 border-gray-300 text-black' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
        >
          All Diet
        </button>
        <button 
          onClick={() => setDietaryFilter('veg')}
          className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${dietaryFilter === 'veg' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
        >
          Veg Only
        </button>
        <button 
          onClick={() => setDietaryFilter('non-veg')}
          className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${dietaryFilter === 'non-veg' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
        >
          Non-Veg Only
        </button>
      </div>

      {/* Items Count & Swipe indicator */}
      <div className="flex justify-between items-center text-[10px] text-gray-400 mb-4 px-1 tracking-widest uppercase">
        <span>{filteredItems.length} items</span>
        <span className="flex items-center gap-1">
          &lt; Swipe for more &gt;
        </span>
      </div>

      {/* Item List */}
      <div className="flex flex-col gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item.id} className="border border-gray-200 rounded-3xl p-5 flex justify-between gap-4 bg-white hover:border-gray-300 transition-colors">
              <div className="flex flex-col max-w-[65%]">
                <h3 className="text-[17px] font-bold text-black mb-1.5 leading-tight">{item.name}</h3>
                <div className="text-[20px] font-bold text-[#133F31] mb-2">{item.price} {restaurantData.currencySymbol}</div>
                <p className="text-[11px] text-gray-400 mt-auto line-clamp-2 leading-relaxed">{item.description}</p>
              </div>
              <div className="relative w-24 h-24 shrink-0 rounded-[1.25rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                <Image 
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-gray-400 text-sm">
            No items found matching your filters.
          </div>
        )}
      </div>

    </div>
  );
}
