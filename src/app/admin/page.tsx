"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Activity, 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Image as ImageIcon, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Check, 
  Utensils, 
  Store, 
  Layers, 
  Bell, 
  Globe, 
  Share2 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  getMenuItems, 
  getMenuCategories, 
  getOffers, 
  getRestaurant, 
  saveRestaurant, 
  saveMenuItem, 
  deleteMenuItem, 
  saveMenuCategory, 
  deleteMenuCategory, 
  saveOffer, 
  deleteOffer, 
  uploadImage 
} from "@/lib/api";
import { 
  restaurantData, 
  restaurantData2, 
  initialRestaurantsList, 
  RestaurantInfo, 
  MenuItem, 
  MenuCategory, 
  Notice, 
  menuItems, 
  menuItems2, 
  menuCategories, 
  menuCategories2, 
  notices1, 
  notices2 
} from "@/lib/mockData";

export default function AdminPage() {
  const [isManaging, setIsManaging] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Multi-restaurant support (2 restaurants with their own dishes, categories, notices, profiles)
  const [restaurants, setRestaurants] = useState<RestaurantInfo[]>(initialRestaurantsList);
  const [selectedRestId, setSelectedRestId] = useState<string>(restaurantData.id);

  // Per-restaurant data maps
  const [itemsMap, setItemsMap] = useState<Record<string, MenuItem[]>>({
    [restaurantData.id]: menuItems,
    [restaurantData2.id]: menuItems2,
  });

  const [categoriesMap, setCategoriesMap] = useState<Record<string, MenuCategory[]>>({
    [restaurantData.id]: menuCategories,
    [restaurantData2.id]: menuCategories2,
  });

  const [noticesMap, setNoticesMap] = useState<Record<string, Notice[]>>({
    [restaurantData.id]: notices1,
    [restaurantData2.id]: notices2,
  });

  // Active restaurant info & edit form state
  const currentRestaurant = restaurants.find(r => r.id === selectedRestId) || restaurants[0];
  const [restaurantForm, setRestaurantForm] = useState<RestaurantInfo>(currentRestaurant);
  const [isSavingRestaurant, setIsSavingRestaurant] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Keep restaurant form updated when active restaurant changes
  useEffect(() => {
    const target = restaurants.find(r => r.id === selectedRestId) || restaurants[0];
    setRestaurantForm(target);
    setSaveSuccessMsg("");
  }, [selectedRestId, restaurants]);

  // Load from Supabase on mount if available for primary restaurant
  useEffect(() => {
    async function fetchSupabaseData() {
      try {
        const [fetchedRest, fetchedCategories, fetchedItems, fetchedOffers] = await Promise.all([
          getRestaurant(restaurantData.id),
          getMenuCategories(restaurantData.id),
          getMenuItems(restaurantData.id),
          getOffers(restaurantData.id)
        ]);

        if (fetchedRest) {
          setRestaurants(prev => prev.map(r => r.id === restaurantData.id ? { ...r, ...fetchedRest } : r));
        }
        if (fetchedCategories && fetchedCategories.length > 0) {
          setCategoriesMap(prev => ({ ...prev, [restaurantData.id]: fetchedCategories }));
        }
        if (fetchedItems && fetchedItems.length > 0) {
          setItemsMap(prev => ({ ...prev, [restaurantData.id]: fetchedItems }));
        }
        if (fetchedOffers && fetchedOffers.length > 0) {
          setNoticesMap(prev => ({ ...prev, [restaurantData.id]: fetchedOffers }));
        }
      } catch (err) {
        console.warn("Supabase load fallback to mockData:", err);
      }
    }
    fetchSupabaseData();
  }, []);

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);

  // Edit target states
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  // Forms state
  const currentCategories = categoriesMap[selectedRestId] || [];
  const currentItems = itemsMap[selectedRestId] || [];
  const currentNotices = noticesMap[selectedRestId] || [];

  const [itemForm, setItemForm] = useState<Partial<MenuItem>>({});
  const [categoryForm, setCategoryForm] = useState<Partial<MenuCategory>>({});
  const [noticeForm, setNoticeForm] = useState<Partial<Notice>>({});

  // Helper: check if a category is a drink / beverage
  const isDrinkCategory = (catId?: string) => {
    if (!catId) return false;
    const cat = currentCategories.find(c => c.id === catId);
    const name = (cat?.name || catId).toLowerCase();
    return name.includes("drink") || name.includes("beverage") || name.includes("cooler") || name.includes("shake") || name.includes("juice") || name.includes("soda");
  };

  // --- RESTAURANT PROFILE SAVE ---
  const handleSaveRestaurantProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingRestaurant(true);
    setSaveSuccessMsg("");

    try {
      if (selectedRestId === restaurantData.id) {
        await saveRestaurant(restaurantForm, selectedRestId);
      }
      setRestaurants(prev => prev.map(r => r.id === selectedRestId ? { ...restaurantForm } : r));
      setSaveSuccessMsg("Profile & owner details saved successfully!");
      setTimeout(() => setSaveSuccessMsg(""), 3500);
    } catch (err) {
      console.warn("Saved locally in session:", err);
      setRestaurants(prev => prev.map(r => r.id === selectedRestId ? { ...restaurantForm } : r));
      setSaveSuccessMsg("Saved successfully to session!");
      setTimeout(() => setSaveSuccessMsg(""), 3500);
    } finally {
      setIsSavingRestaurant(false);
    }
  };

  // --- MENU ITEMS HANDLERS ---
  const openItemModal = (item?: MenuItem) => {
    setEditingItem(item || null);
    setItemForm(
      item || {
        name: "",
        description: "",
        price: 0,
        category: currentCategories[0]?.id || "",
        isVeg: true,
        isPopular: false,
        image: ""
      }
    );
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedRestId === restaurantData.id) {
        await saveMenuItem(itemForm as MenuItem, selectedRestId);
      }
      if (itemForm.id) {
        setItemsMap(prev => ({
          ...prev,
          [selectedRestId]: (prev[selectedRestId] || []).map(it => it.id === itemForm.id ? { ...it, ...(itemForm as MenuItem) } : it)
        }));
      } else {
        const newItem: MenuItem = {
          id: `item-${Date.now()}`,
          name: itemForm.name || "New Dish",
          description: itemForm.description || "",
          price: Number(itemForm.price) || 0,
          category: itemForm.category || currentCategories[0]?.id || "",
          isVeg: isDrinkCategory(itemForm.category) ? true : (itemForm.isVeg ?? true),
          isPopular: itemForm.isPopular ?? false,
          image: itemForm.image || ""
        };
        setItemsMap(prev => ({
          ...prev,
          [selectedRestId]: [newItem, ...(prev[selectedRestId] || [])]
        }));
      }
      setIsItemModalOpen(false);
    } catch (err) {
      console.error(err);
      setIsItemModalOpen(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm("Delete this dish from the menu?")) {
      try {
        if (selectedRestId === restaurantData.id) {
          await deleteMenuItem(id);
        }
      } catch (err) {
        console.warn(err);
      }
      setItemsMap(prev => ({
        ...prev,
        [selectedRestId]: (prev[selectedRestId] || []).filter(it => it.id !== id)
      }));
    }
  };

  // --- CATEGORIES HANDLERS ---
  const openCategoryModal = (cat?: MenuCategory) => {
    setEditingCategory(cat || null);
    setCategoryForm(cat || { name: "", icon: "🍽️" });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedRestId === restaurantData.id) {
        await saveMenuCategory(categoryForm as MenuCategory, selectedRestId);
      }
      if (categoryForm.id) {
        setCategoriesMap(prev => ({
          ...prev,
          [selectedRestId]: (prev[selectedRestId] || []).map(c => c.id === categoryForm.id ? { ...c, ...(categoryForm as MenuCategory) } : c)
        }));
      } else {
        const newCat: MenuCategory = {
          id: `cat-${Date.now()}`,
          name: categoryForm.name || "New Category",
          icon: categoryForm.icon || "🍽️"
        };
        setCategoriesMap(prev => ({
          ...prev,
          [selectedRestId]: [...(prev[selectedRestId] || []), newCat]
        }));
      }
      setIsCategoryModalOpen(false);
    } catch (err) {
      console.error(err);
      setIsCategoryModalOpen(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Delete this category?")) {
      try {
        if (selectedRestId === restaurantData.id) {
          await deleteMenuCategory(id);
        }
      } catch (err) {
        console.warn(err);
      }
      setCategoriesMap(prev => ({
        ...prev,
        [selectedRestId]: (prev[selectedRestId] || []).filter(c => c.id !== id)
      }));
    }
  };

  // --- NOTICE HANDLERS (No discount, no coupon code, no required fields) ---
  const openNoticeModal = (notice?: Notice) => {
    setEditingNotice(notice || null);
    setNoticeForm(notice || { title: "", description: "", image: "" });
    setIsNoticeModalOpen(true);
  };

  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedRestId === restaurantData.id) {
        await saveOffer(noticeForm as Notice, selectedRestId);
      }
      if (noticeForm.id) {
        setNoticesMap(prev => ({
          ...prev,
          [selectedRestId]: (prev[selectedRestId] || []).map(n => n.id === noticeForm.id ? { ...n, ...(noticeForm as Notice) } : n)
        }));
      } else {
        const newNotice: Notice = {
          id: `not-${Date.now()}`,
          title: noticeForm.title || "Notice",
          description: noticeForm.description || "",
          image: noticeForm.image || ""
        };
        setNoticesMap(prev => ({
          ...prev,
          [selectedRestId]: [newNotice, ...(prev[selectedRestId] || [])]
        }));
      }
      setIsNoticeModalOpen(false);
    } catch (err) {
      console.error(err);
      setIsNoticeModalOpen(false);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (confirm("Delete this notice?")) {
      try {
        if (selectedRestId === restaurantData.id) {
          await deleteOffer(id);
        }
      } catch (err) {
        console.warn(err);
      }
      setNoticesMap(prev => ({
        ...prev,
        [selectedRestId]: (prev[selectedRestId] || []).filter(n => n.id !== id)
      }));
    }
  };

  // ==========================================
  // MANAGEMENT VIEW (when editing a restaurant)
  // ==========================================
  if (isManaging) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Header with Back, Title and Restaurant Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setIsManaging(false)} title="Back to Overview">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Editing: {currentRestaurant.name}
                </h1>
                <Badge variant="secondary" className="text-xs font-semibold bg-primary/10 text-primary border-0">
                  {currentRestaurant.location}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mt-0.5">
                Manage owner details, dishes, categories, and customer notices.
              </p>
            </div>
          </div>

          {/* Restaurant Switcher Pills */}
          <div className="flex items-center gap-2 self-start lg:self-auto">
            <div className="flex items-center bg-muted/60 p-1 rounded-lg border">
              <span className="text-xs font-semibold text-muted-foreground px-2.5 flex items-center gap-1.5">
                <Store className="h-3.5 w-3.5" /> Restaurant:
              </span>
              {restaurants.map(rest => (
                <button
                  key={rest.id}
                  type="button"
                  onClick={() => setSelectedRestId(rest.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${
                    selectedRestId === rest.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {rest.name}
                </button>
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={() => setIsManaging(false)}>
              Done
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-4 w-full md:w-auto h-auto p-1 bg-muted/60">
            <TabsTrigger value="details" className="flex items-center gap-2 py-2">
              <Store className="h-4 w-4" />
              <span>Restaurant & Owner</span>
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-2 py-2">
              <Utensils className="h-4 w-4" />
              <span>Dishes ({currentItems.length})</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2 py-2">
              <Layers className="h-4 w-4" />
              <span>Categories ({currentCategories.length})</span>
            </TabsTrigger>
            <TabsTrigger value="notices" className="flex items-center gap-2 py-2">
              <Bell className="h-4 w-4" />
              <span>Notices ({currentNotices.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: RESTAURANT PROFILE & OWNER DETAILS */}
          <TabsContent value="details" className="space-y-6">
            <Card className="shadow-none border-border">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  Restaurant Profile & Owner Details
                </CardTitle>
                <CardDescription>
                  Update basic info, owner contact numbers, opening hours, and all connected social accounts.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {saveSuccessMsg && (
                  <div className="mb-6 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-md text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    {saveSuccessMsg}
                  </div>
                )}

                <form onSubmit={handleSaveRestaurantProfile} className="space-y-6">
                  {/* General Info */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      General Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold">Restaurant Name</label>
                        <Input 
                          value={restaurantForm.name || ""} 
                          onChange={e => setRestaurantForm({ ...restaurantForm, name: e.target.value })} 
                          placeholder="Restaurant Name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold">Tagline / Short Description</label>
                        <Input 
                          value={restaurantForm.description || ""} 
                          onChange={e => setRestaurantForm({ ...restaurantForm, description: e.target.value })} 
                          placeholder="e.g. Authentic Kerala Cuisine"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> City / Location
                        </label>
                        <Input 
                          value={restaurantForm.location || ""} 
                          onChange={e => setRestaurantForm({ ...restaurantForm, location: e.target.value })} 
                          placeholder="e.g. Trivandrum, Kerala"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold">Street Address</label>
                        <Input 
                          value={restaurantForm.address || ""} 
                          onChange={e => setRestaurantForm({ ...restaurantForm, address: e.target.value })} 
                          placeholder="Full address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Owner Contact & Hours */}
                  <div className="pt-4 border-t">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Owner Contact & Operating Hours
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Owner Phone Number
                        </label>
                        <Input 
                          value={restaurantForm.phone || ""} 
                          onChange={e => setRestaurantForm({ ...restaurantForm, phone: e.target.value })} 
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Owner / Business Email
                        </label>
                        <Input 
                          type="email"
                          value={restaurantForm.email || ""} 
                          onChange={e => setRestaurantForm({ ...restaurantForm, email: e.target.value })} 
                          placeholder="owner@restaurant.com"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Opening Hours
                        </label>
                        <Input 
                          value={restaurantForm.openHours || ""} 
                          onChange={e => setRestaurantForm({ ...restaurantForm, openHours: e.target.value })} 
                          placeholder="e.g. 11:00 AM - 11:00 PM"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Open Until
                        </label>
                        <Input 
                          value={restaurantForm.openUntil || ""} 
                          onChange={e => setRestaurantForm({ ...restaurantForm, openUntil: e.target.value })} 
                          placeholder="e.g. 11:00 PM"
                        />
                      </div>
                    </div>
                  </div>

                  {/* All Social Media Accounts */}
                  <div className="pt-4 border-t">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                      <Share2 className="h-3.5 w-3.5 text-primary" /> All Social Media Accounts & Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700">WhatsApp Number</label>
                        <Input 
                          value={restaurantForm.whatsapp || ""} 
                          onChange={e => setRestaurantForm({ ...restaurantForm, whatsapp: e.target.value })} 
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700">Instagram URL / Handle</label>
                        <Input 
                          value={restaurantForm.instagram || ""} 
                          onChange={e => setRestaurantForm({ ...restaurantForm, instagram: e.target.value })} 
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700">Facebook Page URL</label>
                        <Input 
                          value={restaurantForm.facebook || ""} 
                          onChange={e => setRestaurantForm({ ...restaurantForm, facebook: e.target.value })} 
                          placeholder="https://facebook.com/page"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700">Twitter / X Profile</label>
                        <Input 
                          value={restaurantForm.twitter || ""} 
                          onChange={e => setRestaurantForm({ ...restaurantForm, twitter: e.target.value })} 
                          placeholder="https://x.com/username"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700">YouTube Channel</label>
                        <Input 
                          value={restaurantForm.youtube || ""} 
                          onChange={e => setRestaurantForm({ ...restaurantForm, youtube: e.target.value })} 
                          placeholder="https://youtube.com/@channel"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                          <Globe className="h-3 w-3" /> Official Website
                        </label>
                        <Input 
                          value={restaurantForm.website || ""} 
                          onChange={e => setRestaurantForm({ ...restaurantForm, website: e.target.value })} 
                          placeholder="https://yourrestaurant.com"
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
                        <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> Google Maps Location URL
                        </label>
                        <Input 
                          value={restaurantForm.mapsUrl || ""} 
                          onChange={e => setRestaurantForm({ ...restaurantForm, mapsUrl: e.target.value })} 
                          placeholder="https://maps.google.com/?q=..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Branding Images */}
                  <div className="pt-4 border-t">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Branding & Images
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Logo</label>
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-full overflow-hidden bg-muted border flex items-center justify-center shrink-0">
                            {restaurantForm.logo ? (
                              <img src={restaurantForm.logo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                              <Store className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="space-y-1 flex-1">
                            <Input 
                              value={restaurantForm.logo || ""} 
                              onChange={e => setRestaurantForm({ ...restaurantForm, logo: e.target.value })} 
                              placeholder="Logo Image URL"
                              className="text-xs"
                            />
                            <Input 
                              type="file" 
                              accept="image/*"
                              className="text-xs h-8 cursor-pointer"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  const url = await uploadImage(file, 'restaurant-images');
                                  if (url) setRestaurantForm(prev => ({ ...prev, logo: url }));
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Cover Banner</label>
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-14 rounded-md overflow-hidden bg-muted border flex items-center justify-center shrink-0">
                            {restaurantForm.coverImage ? (
                              <img src={restaurantForm.coverImage} alt="Cover" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="space-y-1 flex-1">
                            <Input 
                              value={restaurantForm.coverImage || ""} 
                              onChange={e => setRestaurantForm({ ...restaurantForm, coverImage: e.target.value })} 
                              placeholder="Cover Image URL"
                              className="text-xs"
                            />
                            <Input 
                              type="file" 
                              accept="image/*"
                              className="text-xs h-8 cursor-pointer"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  const url = await uploadImage(file, 'restaurant-images');
                                  if (url) setRestaurantForm(prev => ({ ...prev, coverImage: url }));
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex items-center justify-end gap-3 border-t">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setRestaurantForm({ ...currentRestaurant })}
                    >
                      Reset Changes
                    </Button>
                    <Button type="submit" disabled={isSavingRestaurant}>
                      {isSavingRestaurant ? "Saving..." : "Save Profile & Owner Details"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: DISHES (MENU ITEMS) */}
          <TabsContent value="menu" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Dishes for {currentRestaurant.name}</h2>
                <p className="text-xs text-muted-foreground">Manage dishes, prices, descriptions, and dietary options.</p>
              </div>
              <Button onClick={() => openItemModal()}><Plus className="h-4 w-4 mr-2"/> Add Dish</Button>
            </div>
            <Card className="shadow-none border-border">
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr className="text-left text-muted-foreground font-medium text-xs uppercase">
                      <th className="px-6 py-4">Image</th>
                      <th className="px-6 py-4">Name & Details</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {currentItems.map(item => {
                      const isDrink = isDrinkCategory(item.category);
                      return (
                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="w-10 h-10 rounded overflow-hidden bg-muted flex items-center justify-center border">
                              {item.image ? (
                                <img src={item.image} alt="" className="object-cover w-full h-full" />
                              ) : (
                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold flex items-center gap-2">
                              <span>{item.name}</span>
                              {/* NO veg/non-veg tag for drinks */}
                              {!isDrink && (
                                item.isVeg ? (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                                    VEG
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-bold uppercase">
                                    NON-VEG
                                  </span>
                                )
                              )}
                              {item.isPopular && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold uppercase">
                                  STAR
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground truncate max-w-[280px]">
                              {item.description}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {currentCategories.find(c => c.id === item.category)?.name || item.category}
                          </td>
                          <td className="px-6 py-4 font-bold text-foreground">₹{item.price}</td>
                          <td className="px-6 py-4 text-right space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => openItemModal(item)} title="Edit Dish">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)} className="text-destructive" title="Delete Dish">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                    {currentItems.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                          No dishes found. Click &quot;Add Dish&quot; to add dishes to this restaurant.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: CATEGORIES */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Categories for {currentRestaurant.name}</h2>
                <p className="text-xs text-muted-foreground">Organize your dishes for customers to browse smoothly.</p>
              </div>
              <Button onClick={() => openCategoryModal()}><Plus className="h-4 w-4 mr-2"/> Add Category</Button>
            </div>
            <Card className="shadow-none border-border">
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr className="text-left text-muted-foreground font-medium text-xs uppercase">
                      <th className="px-6 py-4">Icon</th>
                      <th className="px-6 py-4">Category Name</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {currentCategories.map(cat => (
                      <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-2xl">{cat.icon}</td>
                        <td className="px-6 py-4 font-semibold">{cat.name}</td>
                        <td className="px-6 py-4 text-right space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => openCategoryModal(cat)} title="Edit Category">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id)} className="text-destructive" title="Delete Category">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: NOTICE (Renamed from Offers, No discount/code, perfect alignment) */}
          <TabsContent value="notices" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Notices for {currentRestaurant.name}</h2>
                <p className="text-xs text-muted-foreground">Display announcements, specials, and notes on customer menu.</p>
              </div>
              <Button onClick={() => openNoticeModal()}><Plus className="h-4 w-4 mr-2"/> Add Notice</Button>
            </div>
            <Card className="shadow-none border-border">
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr className="text-left text-muted-foreground font-medium text-xs uppercase">
                      <th className="px-6 py-4">Notice Image</th>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {currentNotices.map(notice => (
                      <tr key={notice.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted border flex items-center justify-center shrink-0">
                            {notice.image ? (
                              <img src={notice.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Bell className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-foreground">
                          {notice.title || "Untitled Notice"}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground max-w-[380px]">
                          {notice.description || "No description provided."}
                        </td>
                        <td className="px-6 py-4 text-right space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => openNoticeModal(notice)} title="Edit Notice">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteNotice(notice.id)} className="text-destructive" title="Delete Notice">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {currentNotices.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                          No active notices found. Click &quot;Add Notice&quot; to post one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* MODAL: ITEM / DISH */}
        {isItemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-background border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center p-5 border-b">
                <h2 className="font-bold text-lg">{editingItem ? "Edit Dish" : "Add Dish"}</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsItemModalOpen(false)} className="h-7 w-7"><X className="h-4 w-4"/></Button>
              </div>
              <form onSubmit={handleSaveItem} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Dish Name</label>
                  <Input value={itemForm.name || ""} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} placeholder="e.g. Kerala Beef Fry" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold">Description</label>
                  <Input value={itemForm.description || ""} onChange={e => setItemForm({ ...itemForm, description: e.target.value })} placeholder="Ingredients, preparation or flavor notes" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Price (₹)</label>
                    <Input type="number" value={itemForm.price || 0} onChange={e => setItemForm({ ...itemForm, price: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Category</label>
                    <select
                      className="flex h-9 w-full rounded-md border bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={itemForm.category}
                      onChange={e => setItemForm({ ...itemForm, category: e.target.value })}
                    >
                      {currentCategories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Dietary Tag - HIDE VEG/NON-VEG FOR DRINKS */}
                <div className="pt-2 border-t">
                  {isDrinkCategory(itemForm.category) ? (
                    <p className="text-xs text-muted-foreground italic">
                      🥤 Drinks & Beverages do not require a Veg/Non-Veg marking.
                    </p>
                  ) : (
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={itemForm.isVeg ?? true}
                          onChange={e => setItemForm({ ...itemForm, isVeg: e.target.checked })}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                        />
                        <span className="font-medium">Vegetarian Dish</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={itemForm.isPopular ?? false}
                          onChange={e => setItemForm({ ...itemForm, isPopular: e.target.checked })}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
                        />
                        <span className="font-medium">Popular / Recommended</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Image */}
                <div className="space-y-2 pt-2 border-t">
                  <label className="text-sm font-semibold">Dish Image</label>
                  <div className="flex items-center gap-3">
                    {itemForm.image ? (
                      <img src={itemForm.image} alt="" className="w-12 h-12 rounded object-cover border" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted border flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <Input 
                      type="file" 
                      accept="image/*"
                      className="cursor-pointer text-xs"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const url = await uploadImage(file, 'menu-images');
                          if (url) setItemForm(prev => ({ ...prev, image: url }));
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    />
                  </div>
                  <Input 
                    value={itemForm.image || ""} 
                    onChange={e => setItemForm({ ...itemForm, image: e.target.value })} 
                    placeholder="Or enter image URL (https://...)"
                    className="text-xs"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsItemModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Dish</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CATEGORY */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-background border rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center p-5 border-b">
                <h2 className="font-bold text-lg">{editingCategory ? "Edit Category" : "Add Category"}</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsCategoryModalOpen(false)} className="h-7 w-7"><X className="h-4 w-4"/></Button>
              </div>
              <form onSubmit={handleSaveCategory} className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Category Name</label>
                  <Input value={categoryForm.name || ""} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} placeholder="e.g. Starters, Breads" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Icon / Emoji</label>
                  <Input value={categoryForm.icon || ""} onChange={e => setCategoryForm({ ...categoryForm, icon: e.target.value })} placeholder="e.g. 🥟, 🍛, 🍹" />
                </div>
                <div className="pt-3 flex justify-end gap-2 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsCategoryModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Category</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: NOTICE (Correct Alignment, Only Title, Description, Image; No required fields, No discount/code) */}
        {isNoticeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-background border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  {editingNotice ? "Edit Notice" : "Add Notice"}
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setIsNoticeModalOpen(false)} className="h-7 w-7"><X className="h-4 w-4"/></Button>
              </div>
              <form onSubmit={handleSaveNotice} className="p-6 space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Notice Title</label>
                  <Input 
                    value={noticeForm.title || ""} 
                    onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })} 
                    placeholder="e.g. Special Seafood Weekend Fest" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Notice Description</label>
                  <textarea
                    rows={3}
                    className="flex w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={noticeForm.description || ""}
                    onChange={e => setNoticeForm({ ...noticeForm, description: e.target.value })}
                    placeholder="Write notice details or announcement for customers..."
                  />
                </div>

                {/* Image upload & preview for Notice */}
                <div className="space-y-2 pt-2 border-t">
                  <label className="text-sm font-semibold">Notice Banner Image</label>
                  <div className="flex items-center gap-3">
                    {noticeForm.image ? (
                      <div className="w-14 h-14 rounded-lg overflow-hidden border bg-muted shrink-0">
                        <img src={noticeForm.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-muted border flex items-center justify-center shrink-0">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="space-y-1.5 flex-1">
                      <Input 
                        type="file" 
                        accept="image/*"
                        className="text-xs h-8 cursor-pointer"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const url = await uploadImage(file, 'menu-images');
                            if (url) setNoticeForm(prev => ({ ...prev, image: url }));
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      />
                      <Input 
                        value={noticeForm.image || ""} 
                        onChange={e => setNoticeForm({ ...noticeForm, image: e.target.value })} 
                        placeholder="Or image URL (https://...)" 
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-2 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsNoticeModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Notice</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // PLATFORM OVERVIEW (Non-managing state)
  // Displays BOTH restaurants
  // ==========================================
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Platform Overview</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage your restaurants, menus, and owner details.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Section to Edit Data next to Add Restaurant */}
          <Button 
            variant="outline" 
            onClick={() => {
              setActiveTab("details");
              setIsManaging(true);
            }}
            className="flex items-center gap-2 border-primary/40 hover:bg-primary/5 hover:text-primary transition-colors font-medium shadow-sm"
          >
            <Edit className="h-4 w-4 text-primary" />
            Edit Data
          </Button>
          <Button>Add Restaurant</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-none border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Restaurants</CardTitle>
            <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
              <Building2 className="h-4 w-4 text-foreground" strokeWidth={2} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">{restaurants.length}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              {restaurants.map(r => r.name).join(" • ")}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-none border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Scans (30d)</CardTitle>
            <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
              <Activity className="h-4 w-4 text-foreground" strokeWidth={2} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">21.3K</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Combined scans across all restaurants
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Restaurants Table showing BOTH restaurants */}
      <Card className="shadow-none border-border mt-4">
        <CardHeader className="border-b pb-4 mb-2">
          <CardTitle>Your Restaurants ({restaurants.length})</CardTitle>
          <CardDescription>Each restaurant contains their own unique dishes, categories, notices, and owner profile.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr className="text-left text-muted-foreground font-medium text-xs uppercase tracking-wider">
                  <th className="px-6 py-4">Restaurant</th>
                  <th className="px-6 py-4">Location & Hours</th>
                  <th className="px-6 py-4">Owner Contact</th>
                  <th className="px-6 py-4 text-center">Dishes</th>
                  <th className="px-6 py-4 text-right">Scans (30d)</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {restaurants.map((rest, idx) => {
                  const restItems = itemsMap[rest.id] || [];
                  const restScans = idx === 0 ? "12,430" : "8,920";
                  return (
                    <tr key={rest.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-foreground">
                        <div className="flex items-center gap-3">
                          <img src={rest.logo} alt="logo" className="w-10 h-10 rounded-full object-cover border" />
                          <div>
                            <div className="font-bold text-foreground text-sm">{rest.name}</div>
                            <div className="text-xs text-muted-foreground font-normal line-clamp-1">{rest.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        <div className="font-medium text-foreground">{rest.location}</div>
                        <div className="text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {rest.openHours || rest.openUntil}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        <div className="flex flex-col space-y-0.5">
                          <span className="flex items-center gap-1 font-medium text-foreground">
                            <Phone className="h-3 w-3 text-muted-foreground" /> {rest.phone}
                          </span>
                          {rest.email && (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Mail className="h-3 w-3" /> {rest.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-foreground">
                        <Badge variant="outline" className="text-xs font-semibold">
                          {restItems.length} items
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right tabular-nums text-muted-foreground font-medium">
                        {restScans}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRestId(rest.id);
                            setActiveTab("menu");
                            setIsManaging(true);
                          }}
                        >
                          Edit Menu
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setSelectedRestId(rest.id);
                            setActiveTab("details");
                            setIsManaging(true);
                          }}
                        >
                          Manage Data
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
