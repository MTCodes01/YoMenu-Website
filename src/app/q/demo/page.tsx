"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Star, 
  MapPin, 
  Clock, 
  Share2, 
  Globe, 
  Search,
  Phone,
  Info,
  ChevronRight,
  Flame,
  Leaf
} from "lucide-react";
import { 
  restaurantData, 
  menuCategories, 
  menuItems, 
  offers, 
  reviews 
} from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CustomerMenuPage() {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:max-w-md md:mx-auto md:border-x md:shadow-xl md:bg-white relative">
      {/* Header / Cover Image */}
      <div className="relative h-48 w-full bg-muted">
        <Image 
          src={restaurantData.coverImage} 
          alt={restaurantData.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-md text-white border-0 hover:bg-white/40">
            <Globe className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-md text-white border-0 hover:bg-white/40">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Restaurant Info in Header */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
          <div className="relative h-16 w-16 rounded-xl border-2 border-white overflow-hidden bg-white shadow-md shrink-0">
            <Image 
              src={restaurantData.logo}
              alt={`${restaurantData.name} Logo`}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-white flex-1 pb-1">
            <h1 className="text-xl font-bold leading-tight">{restaurantData.name}</h1>
            <p className="text-sm text-white/80 line-clamp-1">{restaurantData.description}</p>
          </div>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="px-4 py-4 flex items-center justify-between bg-white border-b">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span>{restaurantData.rating}</span>
          <span className="text-muted-foreground underline decoration-dotted">({restaurantData.reviewsCount})</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Until {restaurantData.openUntil}</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <Button variant="ghost" size="sm" className="h-auto p-0 text-primary hover:text-primary hover:bg-transparent font-medium">
          <Info className="h-4 w-4 mr-1.5" />
          Info
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 py-4 sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for dishes..." 
            className="pl-9 bg-white rounded-full shadow-sm border-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Offers Carousel */}
      {!searchQuery && (
        <div className="px-4 pb-2 mt-4">
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className="flex w-max space-x-3">
              {offers.map((offer) => (
                <Card key={offer.id} className="w-[260px] shrink-0 border border-border shadow-none bg-muted/20">
                  <CardContent className="p-4 flex flex-col gap-1">
                    <Badge variant="outline" className="w-fit mb-1 border-primary/20 text-primary bg-primary/5 uppercase text-[10px] tracking-wider">Offer</Badge>
                    <h3 className="font-bold text-foreground text-sm">{offer.title}</h3>
                    <p className="text-xs text-muted-foreground">{offer.description}</p>
                    <div className="mt-2 text-[10px] font-mono font-medium border border-border rounded-sm px-1.5 py-0.5 w-fit bg-background text-foreground/70">
                      CODE: {offer.code}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>
      )}

      {/* Category Navigation (Sticky) */}
      {!searchQuery && (
        <div className="sticky top-[73px] z-10 bg-background pt-2 pb-3 shadow-sm border-b">
          <ScrollArea className="w-full whitespace-nowrap px-4">
            <div className="flex w-max space-x-2">
              {menuCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className="rounded-full shadow-sm"
                  onClick={() => scrollToCategory(category.id)}
                >
                  <span className="mr-1.5">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>
      )}

      {/* Menu Items */}
      <div className="px-4 py-4 space-y-8">
        {searchQuery ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Search Results</h3>
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredItems.map(item => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-3 opacity-20" />
                <p>No dishes found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        ) : (
          menuCategories.map(category => {
            const categoryItems = menuItems.filter(item => item.category === category.id);
            if (categoryItems.length === 0) return null;
            
            return (
              <div key={category.id} id={category.id} className="scroll-mt-[140px]">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {category.name}
                  </h2>
                  <Badge variant="secondary" className="rounded-full">{categoryItems.length}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {categoryItems.map(item => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      <Separator className="my-4" />

      {/* Restaurant Details Section */}
      <div className="px-4 py-6 bg-white space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-4">About {restaurantData.name}</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5 text-foreground shrink-0" />
              <span>{restaurantData.address}</span>
            </div>
            <div className="flex items-start gap-3 text-muted-foreground">
              <Clock className="h-5 w-5 text-foreground shrink-0" />
              <span>Open today until {restaurantData.openUntil}</span>
            </div>
            <div className="flex items-start gap-3 text-muted-foreground">
              <Phone className="h-5 w-5 text-foreground shrink-0" />
              <span>{restaurantData.phone}</span>
            </div>
          </div>
        </div>

        {/* Reviews Snippet */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Reviews</h3>
            <div className="flex items-center gap-1 font-semibold">
              <Star className="h-4 w-4 fill-primary text-primary" />
              {restaurantData.rating}
            </div>
          </div>
          
          <div className="space-y-4">
            {reviews.slice(0, 2).map(review => (
              <div key={review.id} className="bg-muted/50 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={review.avatar} />
                    <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{review.author}</div>
                    <div className="text-xs text-muted-foreground">{review.date}</div>
                  </div>
                  <div className="flex items-center bg-white px-1.5 py-0.5 rounded text-xs font-medium border">
                    {review.rating} <Star className="h-3 w-3 fill-primary text-primary ml-1" />
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-snug">"{review.comment}"</p>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4 rounded-full font-medium">
            Read all {restaurantData.reviewsCount} reviews
          </Button>
        </div>
      </div>
      
      {/* Footer Powered By */}
      <div className="py-8 text-center bg-background">
        <p className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1">
          Powered by <span className="text-primary font-bold">YoMenu</span>
        </p>
      </div>
      
      {/* Floating Action Button for View Cart (Removed as per request) */}
    </div>
  );
}

// Subcomponent for Menu Items
function MenuItemCard({ item }: { item: typeof menuItems[0] }) {
  // Generate a mock rating for the UI
  const mockRating = item.isPopular ? "4.5" : "4.0";
  const mockCount = item.isPopular ? "(124)" : "(42)";

  return (
    <Card className="overflow-hidden border border-border shadow-none bg-white rounded-xl flex flex-col h-full">
      {/* Top Image */}
      <div className="relative w-full aspect-square bg-muted shrink-0">
        <Image 
          src={item.image} 
          alt={item.name} 
          fill 
          className="object-cover" 
        />
        {item.isPopular && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-white text-primary border-0 shadow-sm rounded-sm font-bold">
              Bestseller
            </Badge>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        {/* Veg/Non-Veg & Rating Row */}
        <div className="flex items-center justify-between gap-2 mb-1">
          {item.isVeg ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700">
              <div className="border border-green-600 rounded-sm p-0.5 flex items-center justify-center h-3.5 w-3.5">
                <div className="bg-green-600 rounded-full h-1.5 w-1.5" />
              </div>
              Veg
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-red-700">
              <div className="border border-red-600 rounded-sm p-0.5 flex items-center justify-center h-3.5 w-3.5">
                <div className="bg-red-600 rounded-full h-1.5 w-1.5" />
              </div>
              Non-Veg
            </div>
          )}

          <div className="flex items-center gap-0.5 text-[10px] font-bold text-green-700">
            <Star className="h-3 w-3 fill-green-700 text-green-700" />
            <span>{mockRating}</span>
            <span className="text-muted-foreground font-medium">{mockCount}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm leading-tight line-clamp-2">{item.name}</h3>
        
        {/* Price & Description */}
        <div className="mt-auto pt-1">
          <div className="flex items-end gap-1.5">
            <div className="font-bold text-sm tabular-nums">
              {restaurantData.currencySymbol}{item.price}
            </div>
            {/* Mock original price for UI parity with reference */}
            <div className="text-xs text-muted-foreground line-through tabular-nums pb-[1px]">
              {restaurantData.currencySymbol}{Math.round(item.price * 1.2)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
