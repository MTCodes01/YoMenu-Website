"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search,
  MenuSquare,
  Store,
  MapPin,
  Clock,
  Phone,
  Star,
  Building2
} from "lucide-react";
import { 
  restaurantData, 
  menuCategories, 
  menuItems,
  reviews
} from "@/lib/mockData";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

export default function CustomerMenuPage() {
  const [activeView, setActiveView] = useState<"menu" | "about">("menu");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

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
      <div className="pt-8 px-5 pb-2 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{restaurantData.name}</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">{restaurantData.description}</p>
        </div>
        <div className="flex gap-2">
          {restaurantData.instagram && (
            <a href={restaurantData.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 rounded-full text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors">
              <InstagramIcon className="w-5 h-5" />
            </a>
          )}
          {restaurantData.whatsapp && (
            <a href={`https://wa.me/${restaurantData.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 rounded-full text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors">
              <WhatsAppIcon className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      {activeView === "menu" ? (
        <>
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

      {/* Item List (Grid Cards) */}
      <div className="px-5 grid grid-cols-2 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item.id} className="border border-gray-100 rounded-[12px] p-3 flex flex-col gap-3 bg-white shadow-sm hover:shadow-lg hover:border-orange-100 transition-all duration-300 group">
              <div className="relative w-full aspect-square rounded-[9px] overflow-hidden bg-gray-50 shadow-sm border border-gray-100">
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
              <div className="flex flex-col flex-1">
                {/* Dietary Indicator */}
                <div className="flex mb-1">
                  {item.isVeg ? (
                    <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded text-[9px] font-bold text-green-700 border border-green-100 uppercase tracking-wider">
                      Veg
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-red-50 px-1.5 py-0.5 rounded text-[9px] font-bold text-red-700 border border-red-100 uppercase tracking-wider">
                      Non-Veg
                    </div>
                  )}
                </div>
                <h3 className="text-[14px] font-bold text-gray-900 mb-1 leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">{item.name}</h3>
                <div className="text-[15px] font-extrabold text-orange-600 tabular-nums mt-auto">
                  {restaurantData.currencySymbol}{item.price}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-16 text-gray-400 text-sm flex flex-col items-center">
            <Search className="w-8 h-8 mb-3 opacity-20" />
            No items found matching your filters.
          </div>
        )}
      </div>
        </>
      ) : (
        <div className="px-5 mt-4 space-y-6">
          <div className="relative w-full h-48 rounded-[12px] overflow-hidden shadow-sm">
            <Image
              src={restaurantData.coverImage}
              alt="Restaurant Cover"
              fill
              className="object-cover"
            />
          </div>

          <div className="bg-white border border-gray-100 rounded-[12px] p-5 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Hours</h4>
                <p className="text-sm text-gray-500">Open until {restaurantData.openUntil}</p>
              </div>
            </div>

            <hr className="border-gray-50" />

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Contact</h4>
                <a href={`tel:${restaurantData.phone}`} className="text-sm text-gray-500 hover:text-orange-600 transition-colors">{restaurantData.phone}</a>
              </div>
            </div>
          </div>

          {restaurantData.branches && restaurantData.branches.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-[12px] p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-orange-600" />
                <h4 className="text-[17px] font-bold text-gray-900">Our Branches</h4>
              </div>
              <div className="space-y-3">
                {restaurantData.branches.map((branch, idx) => (
                  <div key={idx} className="border-l-2 border-orange-200 pl-3">
                    <h5 className="text-sm font-bold text-gray-900">{branch.name}</h5>
                    <p className="text-sm text-gray-500 leading-relaxed mt-0.5">{branch.address}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-100 rounded-[12px] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-orange-400 fill-orange-400" />
              <h4 className="text-[17px] font-bold text-gray-900">{restaurantData.rating} ({restaurantData.reviewsCount} reviews)</h4>
            </div>
            
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-gray-900">{review.author}</span>
                    <span className="text-xs text-gray-400 font-medium">{review.date}</span>
                  </div>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rating Section */}
      <div className="px-5 mt-10 mb-2 flex flex-col items-center">
        <h4 className="text-[15px] font-bold text-gray-900 mb-3 text-center">Rate your experience with us</h4>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setUserRating(star)}
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  (hoverRating || userRating) >= star
                    ? "text-orange-400 fill-orange-400"
                    : "text-gray-200 fill-gray-50"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 flex justify-center">
        <Link href="/" className="text-xs font-medium text-gray-400 hover:text-black-600 transition-colors flex items-center gap-1">
          Powered by <span className="font-bold text-orange-600">YoMenu</span>
        </Link>
      </div>

      {/* Futuristic Floating Bottom Nav */}
      <div className="sticky bottom-6 w-full flex justify-center z-50 mt-4 pointer-events-none">
        <nav className="flex items-center p-1.5 bg-black/85 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/15 supports-[backdrop-filter]:bg-black/60 relative w-[220px] pointer-events-auto">
          {/* Sliding Indicator */}
          <div 
            className={`absolute left-1.5 top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white/20 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              activeView === 'about' ? 'translate-x-full' : 'translate-x-0'
            }`}
          />
          <button 
            onClick={() => setActiveView("menu")}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full transition-colors duration-300 active:scale-95 ${
              activeView === "menu" 
                ? "text-white" 
                : "text-white/60 hover:text-white"
            }`}
          >
            <MenuSquare className="w-4 h-4" />
            <span className="text-[11px] font-bold tracking-wider uppercase">Menu</span>
          </button>
          <button 
            onClick={() => setActiveView("about")}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full transition-colors duration-300 active:scale-95 ${
              activeView === "about" 
                ? "text-white" 
                : "text-white/60 hover:text-white"
            }`}
          >
            <Store className="w-4 h-4" />
            <span className="text-[11px] font-bold tracking-wider uppercase">About</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
