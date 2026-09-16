"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Search,
  MenuSquare,
  Store
} from "lucide-react";
import { 
  restaurantData, 
  menuCategories, 
  menuItems
} from "@/lib/mockData";

export default function CustomerMenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "veg" | "non-veg">("all");

  const categories = [{ id: "All", name: "All" }, ...menuCategories];

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
    <div className="bg-white text-gray-900 min-h-screen pb-24 md:max-w-md md:mx-auto md:border-x md:shadow-xl relative font-sans selection:bg-orange-200 selection:text-orange-900">
      
      {/* Header */}
      <div className="pt-8 px-5 pb-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{restaurantData.name}</h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">{restaurantData.description}</p>
      </div>

      {/* Search Bar */}
      <div className="px-5 mb-6 mt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search in Menu"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-200 bg-gray-50 outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium shadow-sm"
          />
        </div>
      </div>

      {/* Category Chips (Wrapping) */}
      <div className="px-5 flex flex-wrap gap-2.5 mb-5">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border ${
              activeCategory === cat.id 
                ? "bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/25 scale-[1.02]" 
                : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Dietary Filter */}
      <div className="px-5 flex gap-2 mb-6">
        <button 
          onClick={() => setDietaryFilter('all')}
          className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${dietaryFilter === 'all' ? 'bg-gray-800 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
        >
          All
        </button>
        <button 
          onClick={() => setDietaryFilter('veg')}
          className={`px-3 py-1.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 transition-colors ${dietaryFilter === 'veg' ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
        >
          <span className={`w-2 h-2 rounded-full ${dietaryFilter === 'veg' ? 'bg-white' : 'bg-green-600'}`}></span> Veg
        </button>
        <button 
          onClick={() => setDietaryFilter('non-veg')}
          className={`px-3 py-1.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 transition-colors ${dietaryFilter === 'non-veg' ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
        >
          <span className={`w-2 h-2 rounded-full ${dietaryFilter === 'non-veg' ? 'bg-white' : 'bg-red-600'}`}></span> Non-Veg
        </button>
      </div>

      <hr className="border-gray-100 mx-5 mb-5" />

      {/* Items Count */}
      <div className="px-5 flex justify-between items-center text-xs text-gray-400 mb-4 font-bold uppercase tracking-wider">
        <span>{filteredItems.length} items</span>
      </div>

      {/* Item List (Horizontal Cards) */}
      <div className="px-5 flex flex-col gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item.id} className="border border-gray-100 rounded-[28px] p-4 flex justify-between gap-4 bg-white shadow-sm hover:shadow-lg hover:border-orange-100 transition-all duration-300 group">
              <div className="flex flex-col max-w-[62%]">
                <h3 className="text-[17px] font-bold text-gray-900 mb-1 leading-tight group-hover:text-orange-600 transition-colors">{item.name}</h3>
                <div className="text-[18px] font-extrabold text-orange-600 mb-2 tabular-nums">
                  {restaurantData.currencySymbol}{item.price}
                </div>
                
                <p className="text-[13px] text-gray-500 mt-auto line-clamp-2 leading-relaxed mb-3">
                  {item.description}
                </p>

                {/* Dietary Indicator */}
                <div className="mt-auto flex">
                  {item.isVeg ? (
                    <div className="flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded text-[10px] font-bold text-green-700 border border-green-100 uppercase tracking-wider">
                      Veg
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-red-50 px-2 py-0.5 rounded text-[10px] font-bold text-red-700 border border-red-100 uppercase tracking-wider">
                      Non-Veg
                    </div>
                  )}
                </div>
              </div>
              
              <div className="relative w-[110px] h-[110px] shrink-0 rounded-[20px] overflow-hidden bg-gray-50 shadow-sm border border-gray-100">
                <Image 
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.isPopular && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-white bg-orange-600 text-[9px] leading-tight font-bold tracking-wide shadow-sm uppercase">
                    Popular
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-gray-400 text-sm flex flex-col items-center">
            <Search className="w-8 h-8 mb-3 opacity-20" />
            No items found matching your filters.
          </div>
        )}
      </div>

      {/* Futuristic Floating Bottom Nav */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-1.5 bg-black/85 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/15 supports-[backdrop-filter]:bg-black/60">
        <button className="flex items-center justify-center gap-2.5 py-2.5 px-6 rounded-full bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-white/30 transition-all duration-300 active:scale-95">
          <MenuSquare className="w-4 h-4 text-white" />
          <span className="text-[11px] font-bold tracking-wider uppercase">Home</span>
        </button>
        <button className="flex items-center justify-center gap-2.5 py-2.5 px-6 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 active:scale-95">
          <Store className="w-4 h-4" />
          <span className="text-[11px] font-bold tracking-wider uppercase">About</span>
        </button>
      </nav>
    </div>
  );
}
