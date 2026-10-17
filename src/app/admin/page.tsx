"use client";

import React, { useState } from "react";
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
  Tag
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
  RestaurantInfo,
  MenuItem,
  MenuCategory,
  Offer
} from "@/lib/mockData";

export default function AdminPage() {
  const [isManaging, setIsManaging] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // State for data
  const [restaurant, setRestaurant] = useState<RestaurantInfo>(restaurantData);
  const [restaurantForm, setRestaurantForm] = useState<RestaurantInfo>(restaurantData);
  const [isSavingRestaurant, setIsSavingRestaurant] = useState(false);
  const [restaurantSaveMsg, setRestaurantSaveMsg] = useState("");

  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [offersList, setOffersList] = useState<Offer[]>([]);

  // Hardcoded ID from seed.js
  const restId = "6e26cf81-f09b-4f9f-a2e6-76cd3c5c56d7"; 

  // Load Data
  const loadData = React.useCallback(async () => {
    try {
      const [fetchedRest, fetchedCategories, fetchedItems, fetchedOffers] = await Promise.all([
        getRestaurant(restId),
        getMenuCategories(restId),
        getMenuItems(restId),
        getOffers(restId)
      ]);
      
      if (fetchedRest) {
        setRestaurant(prev => ({ ...prev, ...fetchedRest }));
        setRestaurantForm(prev => ({ ...prev, ...fetchedRest }));
      }
      setCategories(fetchedCategories);
      setItems(fetchedItems);
      setOffersList(fetchedOffers);
    } catch (err) {
      console.warn("Could not load from Supabase, using mockData fallback:", err);
    }
  }, [restId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // Edit states
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  // Form states
  const [itemForm, setItemForm] = useState<Partial<MenuItem>>({});
  const [categoryForm, setCategoryForm] = useState<Partial<MenuCategory>>({});
  const [offerForm, setOfferForm] = useState<Partial<Offer>>({});

  // Restaurant details save handler
  const handleSaveRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingRestaurant(true);
    setRestaurantSaveMsg("");
    try {
      await saveRestaurant(restaurantForm, restId);
      setRestaurant({ ...restaurantForm });
      setRestaurantSaveMsg("Restaurant & owner details saved successfully!");
      setTimeout(() => setRestaurantSaveMsg(""), 4000);
    } catch (err) {
      console.warn("Supabase update error, saved in session state:", err);
      setRestaurant({ ...restaurantForm });
      setRestaurantSaveMsg("Saved to local session (Supabase not connected)");
      setTimeout(() => setRestaurantSaveMsg(""), 4000);
    } finally {
      setIsSavingRestaurant(false);
    }
  };

  // Menu Items Handlers
  const openItemModal = (item?: MenuItem) => {
    setEditingItem(item || null);
    setItemForm(
      item || { 
        name: "", 
        description: "", 
        price: 0, 
        category: categories[0]?.id || "", 
        isVeg: true, 
        isPopular: false, 
        image: "" 
      }
    );
    setIsItemModalOpen(true);
  };

  const saveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveMenuItem(itemForm as MenuItem, restId);
      await loadData();
      setIsItemModalOpen(false);
    } catch(err) { 
      console.error(err); 
      // fallback local update
      if (itemForm.id) {
        setItems(prev => prev.map(it => it.id === itemForm.id ? { ...it, ...(itemForm as MenuItem) } : it));
      } else {
        const newItem: MenuItem = {
          id: `item-${Date.now()}`,
          name: itemForm.name || "Untitled",
          description: itemForm.description || "",
          price: Number(itemForm.price) || 0,
          category: itemForm.category || categories[0]?.id || "",
          isVeg: itemForm.isVeg ?? true,
          isPopular: itemForm.isPopular ?? false,
          image: itemForm.image || ""
        };
        setItems(prev => [newItem, ...prev]);
      }
      setIsItemModalOpen(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (confirm("Delete this item?")) {
      try {
        await deleteMenuItem(id);
        await loadData();
      } catch(err) { 
        console.error(err);
        setItems(prev => prev.filter(it => it.id !== id));
      }
    }
  };

  // Categories Handlers
  const openCategoryModal = (cat?: MenuCategory) => {
    setEditingCategory(cat || null);
    setCategoryForm(cat || { name: "", icon: "🍽️" });
    setIsCategoryModalOpen(true);
  };

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveMenuCategory(categoryForm as MenuCategory, restId);
      await loadData();
      setIsCategoryModalOpen(false);
    } catch(err) { 
      console.error(err);
      if (categoryForm.id) {
        setCategories(prev => prev.map(c => c.id === categoryForm.id ? { ...c, ...(categoryForm as MenuCategory) } : c));
      } else {
        const newCat: MenuCategory = {
          id: `cat-${Date.now()}`,
          name: categoryForm.name || "New Category",
          icon: categoryForm.icon || "🍽️"
        };
        setCategories(prev => [...prev, newCat]);
      }
      setIsCategoryModalOpen(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (confirm("Delete category?")) {
      try {
        await deleteMenuCategory(id);
        await loadData();
      } catch(err) { 
        console.error(err); 
        setCategories(prev => prev.filter(c => c.id !== id));
      }
    }
  };

  // Offers Handlers
  const openOfferModal = (offer?: Offer) => {
    setEditingOffer(offer || null);
    setOfferForm(offer || { title: "", description: "", discount: "", code: "", image: "" });
    setIsOfferModalOpen(true);
  };

  const saveOfferHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveOffer(offerForm as Offer, restId);
      await loadData();
      setIsOfferModalOpen(false);
    } catch(err) { 
      console.error(err); 
      if (offerForm.id) {
        setOffersList(prev => prev.map(o => o.id === offerForm.id ? { ...o, ...(offerForm as Offer) } : o));
      } else {
        const newOff: Offer = {
          id: `off-${Date.now()}`,
          title: offerForm.title || "Special Offer",
          description: offerForm.description || "",
          discount: offerForm.discount || "10%",
          code: offerForm.code || "SAVE10",
          image: offerForm.image
        };
        setOffersList(prev => [...prev, newOff]);
      }
      setIsOfferModalOpen(false);
    }
  };

  const deleteOfferHandler = async (id: string) => {
    if (confirm("Delete offer?")) {
      try {
        await deleteOffer(id);
        await loadData();
      } catch(err) { 
        console.error(err); 
        setOffersList(prev => prev.filter(o => o.id !== id));
      }
    }
  };

  // --- MANAGEMENT & EDIT DATA VIEW ---
  if (isManaging) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setIsManaging(false)} title="Back to Overview">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Editing: {restaurant.name}</h1>
                <Badge variant="outline" className="text-xs">Live Editor</Badge>
              </div>
              <p className="text-muted-foreground text-sm mt-0.5">
                Update restaurant & owner profile, menu details, categories, and active offers.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsManaging(false)}>
            Close Editor
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-4 w-full md:w-auto h-auto p-1 bg-muted/60">
            <TabsTrigger value="details" className="flex items-center gap-2 py-2">
              <Store className="h-4 w-4" />
              <span>Owner & Restaurant</span>
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-2 py-2">
              <Utensils className="h-4 w-4" />
              <span>Menu Items</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2 py-2">
              <Layers className="h-4 w-4" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="offers" className="flex items-center gap-2 py-2">
              <Tag className="h-4 w-4" />
              <span>Offers</span>
            </TabsTrigger>
          </TabsList>
          
          {/* TAB 1: RESTAURANT & OWNER DETAILS */}
          <TabsContent value="details" className="space-y-6">
            <Card className="shadow-none border-border">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  Restaurant Profile & Owner Details
                </CardTitle>
                <CardDescription>
                  Update the restaurant name, owner contact number, email, address, and branding.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {restaurantSaveMsg && (
                  <div className="mb-6 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-md text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    {restaurantSaveMsg}
                  </div>
                )}

                <form onSubmit={handleSaveRestaurant} className="space-y-6">
                  {/* General Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-1.5">
                        <Store className="h-4 w-4 text-muted-foreground" /> Restaurant Name
                      </label>
                      <Input 
                        required 
                        value={restaurantForm.name || ""} 
                        onChange={e => setRestaurantForm({ ...restaurantForm, name: e.target.value })} 
                        placeholder="e.g. Malabar Table"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-1.5">
                        <Phone className="h-4 w-4 text-muted-foreground" /> Owner / Contact Number
                      </label>
                      <Input 
                        required 
                        value={restaurantForm.phone || ""} 
                        onChange={e => setRestaurantForm({ ...restaurantForm, phone: e.target.value })} 
                        placeholder="e.g. +91 98765 43210"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-1.5">
                        <Mail className="h-4 w-4 text-muted-foreground" /> Owner / Business Email
                      </label>
                      <Input 
                        type="email" 
                        value={restaurantForm.email || ""} 
                        onChange={e => setRestaurantForm({ ...restaurantForm, email: e.target.value })} 
                        placeholder="e.g. owner@malabartable.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-1.5">
                        <Phone className="h-4 w-4 text-muted-foreground" /> WhatsApp Number
                      </label>
                      <Input 
                        value={restaurantForm.whatsapp || ""} 
                        onChange={e => setRestaurantForm({ ...restaurantForm, whatsapp: e.target.value })} 
                        placeholder="e.g. +91 98765 43210"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-muted-foreground" /> City / Location
                      </label>
                      <Input 
                        required 
                        value={restaurantForm.location || ""} 
                        onChange={e => setRestaurantForm({ ...restaurantForm, location: e.target.value })} 
                        placeholder="e.g. Trivandrum, Kerala"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-muted-foreground" /> Open Until / Hours
                      </label>
                      <Input 
                        value={restaurantForm.openUntil || ""} 
                        onChange={e => setRestaurantForm({ ...restaurantForm, openUntil: e.target.value })} 
                        placeholder="e.g. 10:30 PM"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Full Address</label>
                    <Input 
                      value={restaurantForm.address || ""} 
                      onChange={e => setRestaurantForm({ ...restaurantForm, address: e.target.value })} 
                      placeholder="e.g. 123 MG Road, Near Pattom, Trivandrum 695004"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Description / Tagline</label>
                    <Input 
                      value={restaurantForm.description || ""} 
                      onChange={e => setRestaurantForm({ ...restaurantForm, description: e.target.value })} 
                      placeholder="e.g. Authentic South Indian & Kerala Cuisine"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Instagram Link</label>
                    <Input 
                      value={restaurantForm.instagram || ""} 
                      onChange={e => setRestaurantForm({ ...restaurantForm, instagram: e.target.value })} 
                      placeholder="https://instagram.com/yourrestaurant"
                    />
                  </div>

                  {/* Branding Images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold">Restaurant Logo</label>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-muted border flex items-center justify-center shrink-0">
                          {restaurantForm.logo ? (
                            <img src={restaurantForm.logo} alt="Logo" className="w-full h-full object-cover" />
                          ) : (
                            <Store className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <Input 
                            value={restaurantForm.logo || ""} 
                            onChange={e => setRestaurantForm({ ...restaurantForm, logo: e.target.value })} 
                            placeholder="Logo URL"
                            className="text-xs"
                          />
                          <Input 
                            type="file" 
                            accept="image/*"
                            className="text-xs h-8"
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

                    <div className="space-y-3">
                      <label className="text-sm font-semibold">Cover Banner Image</label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-14 rounded overflow-hidden bg-muted border flex items-center justify-center shrink-0">
                          {restaurantForm.coverImage ? (
                            <img src={restaurantForm.coverImage} alt="Cover" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <Input 
                            value={restaurantForm.coverImage || ""} 
                            onChange={e => setRestaurantForm({ ...restaurantForm, coverImage: e.target.value })} 
                            placeholder="Cover Image URL"
                            className="text-xs"
                          />
                          <Input 
                            type="file" 
                            accept="image/*"
                            className="text-xs h-8"
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

                  {/* Submit Button */}
                  <div className="pt-4 flex items-center justify-end gap-3 border-t">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setRestaurantForm({ ...restaurant })}
                    >
                      Reset Changes
                    </Button>
                    <Button type="submit" disabled={isSavingRestaurant}>
                      {isSavingRestaurant ? "Saving..." : "Save Restaurant & Owner Details"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: MENU ITEMS */}
          <TabsContent value="menu" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Menu Details & Items</h2>
                <p className="text-xs text-muted-foreground">Manage dishes, prices, descriptions, and dietary options.</p>
              </div>
              <Button onClick={() => openItemModal()}><Plus className="h-4 w-4 mr-2"/> Add Item</Button>
            </div>
            <Card className="shadow-none border-border">
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr className="text-left text-muted-foreground font-medium text-xs uppercase">
                      <th className="px-6 py-4">Image</th>
                      <th className="px-6 py-4">Name & Desc</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {items.map(item => (
                      <tr key={item.id} className="hover:bg-muted/30">
                        <td className="px-6 py-4">
                          <div className="w-10 h-10 rounded overflow-hidden bg-muted flex items-center justify-center">
                            {item.image ? <img src={item.image} alt="" className="object-cover w-full h-full"/> : <ImageIcon className="h-4 w-4 text-muted-foreground"/>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium flex items-center gap-2">
                            <span>{item.name}</span>
                            {item.isVeg && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">VEG</span>}
                            {item.isPopular && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">STAR</span>}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</div>
                        </td>
                        <td className="px-6 py-4">{categories.find(c => c.id === item.category)?.name || item.category}</td>
                        <td className="px-6 py-4 font-semibold">₹{item.price}</td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => openItemModal(item)} title="Edit Item"><Edit className="h-4 w-4"/></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)} className="text-destructive" title="Delete Item"><Trash2 className="h-4 w-4"/></Button>
                        </td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                          No menu items found. Click &quot;Add Item&quot; to create one.
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
                <h2 className="text-xl font-bold">Menu Categories</h2>
                <p className="text-xs text-muted-foreground">Create and categorize courses for simple navigation.</p>
              </div>
              <Button onClick={() => openCategoryModal()}><Plus className="h-4 w-4 mr-2"/> Add Category</Button>
            </div>
            <Card className="shadow-none border-border">
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr className="text-left text-muted-foreground font-medium text-xs uppercase">
                      <th className="px-6 py-4">Icon</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {categories.map(cat => (
                      <tr key={cat.id} className="hover:bg-muted/30">
                        <td className="px-6 py-4 text-xl">{cat.icon}</td>
                        <td className="px-6 py-4 font-medium">{cat.name}</td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => openCategoryModal(cat)} title="Edit Category"><Edit className="h-4 w-4"/></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteCategory(cat.id)} className="text-destructive" title="Delete Category"><Trash2 className="h-4 w-4"/></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: OFFERS */}
          <TabsContent value="offers" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Active Offers & Discounts</h2>
                <p className="text-xs text-muted-foreground">Special deals highlighted for customers upon scanning.</p>
              </div>
              <Button onClick={() => openOfferModal()}><Plus className="h-4 w-4 mr-2"/> Add Offer</Button>
            </div>
            <Card className="shadow-none border-border">
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr className="text-left text-muted-foreground font-medium text-xs uppercase">
                      <th className="px-6 py-4">Offer Details</th>
                      <th className="px-6 py-4">Discount</th>
                      <th className="px-6 py-4">Code</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {offersList.map(offer => (
                      <tr key={offer.id} className="hover:bg-muted/30">
                        <td className="px-6 py-4">
                          <div className="font-medium">{offer.title}</div>
                          <div className="text-xs text-muted-foreground">{offer.description}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-600">{offer.discount}</td>
                        <td className="px-6 py-4"><Badge variant="outline">{offer.code}</Badge></td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => openOfferModal(offer)} title="Edit Offer"><Edit className="h-4 w-4"/></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteOfferHandler(offer.id)} className="text-destructive" title="Delete Offer"><Trash2 className="h-4 w-4"/></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal for Items */}
        {isItemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-background border rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-bold text-lg">{editingItem ? "Edit Menu Item" : "Add Menu Item"}</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsItemModalOpen(false)} className="h-7 w-7"><X className="h-4 w-4"/></Button>
              </div>
              <form onSubmit={saveItem} className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input required value={itemForm.name || ""} onChange={e => setItemForm({...itemForm, name: e.target.value})} placeholder="Dish name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input required value={itemForm.description || ""} onChange={e => setItemForm({...itemForm, description: e.target.value})} placeholder="Ingredients, taste, specifics" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Price (₹)</label>
                    <Input type="number" required value={itemForm.price || 0} onChange={e => setItemForm({...itemForm, price: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select 
                      className="flex h-9 w-full rounded-md border bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                      value={itemForm.category} 
                      onChange={e => setItemForm({...itemForm, category: e.target.value})}
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={itemForm.isVeg ?? true} 
                      onChange={e => setItemForm({ ...itemForm, isVeg: e.target.checked })} 
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={itemForm.isPopular ?? false} 
                      onChange={e => setItemForm({ ...itemForm, isPopular: e.target.checked })} 
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
                    />
                    <span>Popular / Chef Recommendation</span>
                  </label>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t">
                  <label className="text-sm font-medium">Dish Image</label>
                  <div className="flex items-center gap-3">
                    {itemForm.image && (
                      <img src={itemForm.image} alt="Preview" className="w-12 h-12 rounded object-cover border" />
                    )}
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const url = await uploadImage(file, 'menu-images');
                          if (url) {
                            setItemForm({...itemForm, image: url});
                          }
                        } catch (err) {
                          console.error(err);
                        }
                      }} 
                    />
                  </div>
                  <Input value={itemForm.image || ""} onChange={e => setItemForm({...itemForm, image: e.target.value})} placeholder="Or enter image URL (https://...)" />
                </div>
                <div className="pt-4 flex justify-end gap-2 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsItemModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Dish</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Categories */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-background border rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-bold text-lg">{editingCategory ? "Edit Category" : "Add Category"}</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsCategoryModalOpen(false)} className="h-7 w-7"><X className="h-4 w-4"/></Button>
              </div>
              <form onSubmit={saveCategory} className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input required value={categoryForm.name || ""} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} placeholder="e.g. Desserts" />
                </div>
                <div>
                  <label className="text-sm font-medium">Icon (Emoji)</label>
                  <Input required value={categoryForm.icon || ""} onChange={e => setCategoryForm({...categoryForm, icon: e.target.value})} placeholder="e.g. 🍨" />
                </div>
                <div className="pt-4 flex justify-end gap-2 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsCategoryModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Category</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Offers */}
        {isOfferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-background border rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-bold text-lg">{editingOffer ? "Edit Offer" : "Add Offer"}</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsOfferModalOpen(false)} className="h-7 w-7"><X className="h-4 w-4"/></Button>
              </div>
              <form onSubmit={saveOfferHandler} className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input required value={offerForm.title || ""} onChange={e => setOfferForm({...offerForm, title: e.target.value})} placeholder="e.g. Flat 20% Off" />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input required value={offerForm.description || ""} onChange={e => setOfferForm({...offerForm, description: e.target.value})} placeholder="On all main courses" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Discount</label>
                    <Input required value={offerForm.discount || ""} onChange={e => setOfferForm({...offerForm, discount: e.target.value})} placeholder="20% Off" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Coupon Code</label>
                    <Input required value={offerForm.code || ""} onChange={e => setOfferForm({...offerForm, code: e.target.value})} placeholder="YOMENU20" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-2 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsOfferModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Offer</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- PLATFORM OVERVIEW (Non-managing state) ---
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
          <p className="text-muted-foreground mt-1">Monitor the overall health of YoMenu across all restaurants.</p>
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
            <div className="text-2xl font-bold tabular-nums">1</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center font-medium">
              Registered restaurant: {restaurant.name}
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
            <div className="text-2xl font-bold tabular-nums">12.4K</div>
          </CardContent>
        </Card>
      </div>

      {/* Restaurants Table */}
      <Card className="shadow-none border-border mt-4">
        <CardHeader className="border-b pb-4 mb-4">
          <CardTitle>Your Restaurants</CardTitle>
          <CardDescription>Businesses on the YoMenu platform.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-muted-foreground font-medium text-xs uppercase tracking-wider">
                  <th className="px-6 py-4">Restaurant</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Owner Contact</th>
                  <th className="px-6 py-4 text-right">Scans (30d)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-foreground flex items-center gap-3">
                    <img src={restaurant.logo} alt="logo" className="w-9 h-9 rounded-full object-cover border" />
                    <div>
                      <div className="font-semibold text-foreground">{restaurant.name}</div>
                      <div className="text-xs text-muted-foreground font-normal">{restaurant.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{restaurant.location}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex flex-col text-xs space-y-0.5">
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <Phone className="h-3 w-3 text-muted-foreground" /> {restaurant.phone}
                      </span>
                      {restaurant.email && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="h-3 w-3" /> {restaurant.email}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right tabular-nums text-muted-foreground font-medium">12,430</td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="text-emerald-600 bg-emerald-500/10 border-0 shadow-none hover:bg-transparent font-medium">
                      Active
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
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
                        setActiveTab("details");
                        setIsManaging(true);
                      }}
                    >
                      Manage Data
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td colSpan={6} className="px-6 py-2.5 bg-muted/20">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setActiveTab("details");
                          setIsManaging(true);
                        }}
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit Owner & Restaurant Info
                      </Button>
                      <span className="text-muted-foreground text-xs">•</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setActiveTab("menu");
                          setIsManaging(true);
                        }}
                      >
                        <Utensils className="h-3.5 w-3.5" />
                        Edit Menu Items ({items.length})
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
