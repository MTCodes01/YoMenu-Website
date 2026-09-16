"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Search,
  MapPin,
  MenuSquare,
  Bookmark,
  Store,
  Tag,
  Star
} from "lucide-react";
import { 
  restaurantData, 
  menuCategories, 
  menuItems
} from "@/lib/mockData";

export default function CustomerMenuPage() {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].id);
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "veg" | "non-veg">("all");

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky headers
      const y = element.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen pb-24 font-sans selection:bg-orange-200 selection:text-orange-900 md:max-w-md md:mx-auto md:border-x md:shadow-xl relative">
      
      {/* TopAppBar */}
      <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center w-full px-5 py-3 mx-auto">
          <div className="flex items-center gap-3">
            <button aria-label="Menu list" className="text-orange-600 hover:bg-gray-100 transition-colors active:scale-95 duration-150 p-1.5 rounded-full flex items-center justify-center">
              <MenuSquare className="w-5 h-5" />
            </button>
            <span className="text-lg font-bold tracking-tight">{restaurantData.name}</span>
          </div>
          <div className="flex items-center">
            <button aria-label="Search" className="text-orange-600 hover:bg-gray-100 transition-colors active:scale-95 duration-150 p-1.5 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero / Branch Identity Banner */}
      <section className="px-5 pt-4 pb-2">
        <div className="bg-white rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                <span className="text-xs text-green-600 font-semibold tracking-wide">Open Now • Until {restaurantData.openUntil}</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight mt-1">Artisan Indian Dining</h1>
              <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{restaurantData.description}</p>
            </div>
            <div className="bg-gray-50 px-2.5 py-1.5 rounded-lg flex flex-col items-center border border-gray-200 shrink-0 ml-4">
              <span className="text-sm text-orange-600 font-bold">Dine-In</span>
              <span className="text-xs text-gray-500">Table 14</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-gray-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span className="text-xs line-clamp-1 text-gray-600">{restaurantData.address}</span>
            </div>
            {/* Ratings removed */}
          </div>
        </div>
      </section>

      {/* Sticky Category Navigation Bar */}
      <nav className="sticky top-[60px] z-30 bg-white/90 backdrop-blur-md py-3 px-5 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5" style={{ scrollbarWidth: 'none' }}>
          {menuCategories.map((category) => (
            <button 
              key={category.id}
              onClick={() => scrollToCategory(category.id)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all active:scale-95 duration-150 ${
                activeCategory === category.id 
                  ? 'bg-orange-600 text-white shadow-sm' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Dietary Filter */}
      <div className="px-5 py-2.5 flex gap-2 bg-[#f8f9fa]">
        <button 
          onClick={() => setDietaryFilter('all')}
          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${dietaryFilter === 'all' ? 'bg-gray-200 border-gray-300 text-gray-900 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
        >
          All
        </button>
        <button 
          onClick={() => setDietaryFilter('veg')}
          className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-colors ${dietaryFilter === 'veg' ? 'bg-green-50 border-green-200 text-green-800 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
        >
          <span className="w-[10px] h-[10px] rounded-[2px] border border-green-600 flex items-center justify-center p-[1.5px]">
            <span className="w-[4px] h-[4px] rounded-full bg-green-600"></span>
          </span>
          Veg
        </button>
        <button 
          onClick={() => setDietaryFilter('non-veg')}
          className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-colors ${dietaryFilter === 'non-veg' ? 'bg-red-50 border-red-200 text-red-800 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
        >
          <span className="w-[10px] h-[10px] rounded-[2px] border border-red-700 flex items-center justify-center p-[1.5px]">
            <span className="w-[4px] h-[4px] rounded-full bg-red-700"></span>
          </span>
          Non-Veg
        </button>
      </div>

      {/* Categories & Items Grid */}
      <div className="pb-12">
        {menuCategories.map((category) => {
          let categoryItems = menuItems.filter(item => item.category === category.id);
          if (dietaryFilter === 'veg') categoryItems = categoryItems.filter(item => item.isVeg);
          if (dietaryFilter === 'non-veg') categoryItems = categoryItems.filter(item => !item.isVeg);
          
          if (categoryItems.length === 0) return null;

          return (
            <div key={category.id} id={category.id} className="pt-4">
              {/* Section Heading */}
              <section className="px-5 pb-2">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-[19px] font-bold text-gray-900 tracking-tight">{category.name}</h2>
                  <span className="text-xs text-gray-500 font-medium">({categoryItems.length} items)</span>
                </div>
              </section>

              {/* 2-Column Responsive Menu Grid */}
              <section className="grid grid-cols-2 gap-3 px-4 pt-1">
                {categoryItems.map(item => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </section>
            </div>
          );
        })}
      </div>

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 md:max-w-md md:left-1/2 md:-translate-x-1/2 flex justify-around items-center px-2 py-2 pb-safe bg-white/95 backdrop-blur-md rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border-t border-gray-100">
        <div className="w-full flex justify-around items-center">
          <button className="flex flex-col items-center justify-center text-orange-600 font-bold py-1.5 px-4 rounded-full bg-orange-50 active:scale-95 transition-transform duration-150">
            <MenuSquare className="w-5 h-5 fill-orange-100 text-orange-600" />
            <span className="text-[10px] mt-1 font-bold">Menu</span>
          </button>
          <button className="flex flex-col items-center justify-center text-gray-500 hover:text-orange-600 transition-colors py-1.5 px-4 active:scale-95 duration-150">
            <Tag className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Specials</span>
          </button>
          <button className="flex flex-col items-center justify-center text-gray-500 hover:text-orange-600 transition-colors py-1.5 px-4 active:scale-95 duration-150">
            <Store className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Info</span>
          </button>
          <button className="flex flex-col items-center justify-center text-gray-500 hover:text-orange-600 transition-colors py-1.5 px-4 active:scale-95 duration-150">
            <Bookmark className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Saved</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function MenuItemCard({ item }: { item: typeof menuItems[0] }) {

  return (
    <article className="bg-white rounded-xl p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-200 group">
      <div>
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50">
          <Image 
            src={item.image} 
            alt={item.name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          {item.isPopular && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-white bg-orange-600 text-[10px] leading-tight font-bold tracking-wide shadow-sm">
              Popular
            </span>
          )}
        </div>
        
        {/* Dietary & Rating Row */}
        <div className="flex items-center justify-between mt-2.5 mb-1.5">
          {item.isVeg ? (
            <div className="flex items-center gap-1.5">
              <span className="w-[14px] h-[14px] rounded-[3px] border border-green-600 flex items-center justify-center p-[2px]">
                <span className="w-[6px] h-[6px] rounded-full bg-green-600"></span>
              </span>
              <span className="text-green-700 text-[10px] font-bold uppercase tracking-wider">Veg</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="w-[14px] h-[14px] rounded-[3px] border border-red-700 flex items-center justify-center p-[2px]">
                <span className="w-[6px] h-[6px] rounded-full bg-red-700"></span>
              </span>
              <span className="text-red-700 text-[10px] font-bold uppercase tracking-wider">Non-Veg</span>
            </div>
          )}

          {/* Rating removed */}
        </div>

        {/* Item Details */}
        <h3 className="text-[14px] leading-snug font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{item.name}</h3>
        <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">{item.description}</p>
      </div>

      {/* Price Display */}
      <div className="flex items-baseline gap-1.5 mt-3 pt-2 border-t border-gray-100/80">
        <span className="text-[15px] font-bold text-orange-600 tabular-nums">{restaurantData.currencySymbol}{item.price}</span>
        <span className="text-[11px] text-gray-400 line-through tabular-nums">{restaurantData.currencySymbol}{Math.round(item.price * 1.2)}</span>
      </div>
    </article>
  );
}
