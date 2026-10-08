"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Users, 
  CreditCard, 
  Activity,
  ArrowUpRight,
  MoreVertical,
  Search,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  X,
  Image as ImageIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getMenuItems, getMenuCategories, getOffers, saveMenuItem, deleteMenuItem, saveMenuCategory, deleteMenuCategory, saveOffer, deleteOffer } from "@/lib/api";
import { 
  restaurantData, 
  MenuItem,
  MenuCategory,
  Offer
} from "@/lib/mockData";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [isManaging, setIsManaging] = useState(false);
  const [activeTab, setActiveTab] = useState("menu");

  // State for data
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [offersList, setOffersList] = useState<Offer[]>([]);

  // Load Data on mount
  React.useEffect(() => {
    // Only load if managing
    if (!isManaging) return;
    
    // We are currently using the hardcoded Malabar Table ID as per seed.js
    const restId = "6e26cf81-f09b-4f9f-a2e6-76cd3c5c56d7"; 
    
    async function loadData() {
      const fetchedCategories = await getMenuCategories(restId);
      const fetchedItems = await getMenuItems(restId);
      const fetchedOffers = await getOffers(restId);
      
      setCategories(fetchedCategories);
      setItems(fetchedItems);
      setOffersList(fetchedOffers);
    }
    loadData();
  }, [isManaging]);

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

  // We are currently using the hardcoded Malabar Table ID as per seed.js
  const restId = "6e26cf81-f09b-4f9f-a2e6-76cd3c5c56d7"; 

  async function loadData() {
    const fetchedCategories = await getMenuCategories(restId);
    const fetchedItems = await getMenuItems(restId);
    const fetchedOffers = await getOffers(restId);
    setCategories(fetchedCategories);
    setItems(fetchedItems);
    setOffersList(fetchedOffers);
  }

  // Menu Items Handlers
  const openItemModal = (item?: MenuItem) => {
    setEditingItem(item || null);
    setItemForm(item || { name: "", description: "", price: 0, category: categories[0]?.id || "", isVeg: true, isPopular: false, image: "" });
    setIsItemModalOpen(true);
  };
  const saveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveMenuItem(itemForm as MenuItem, restId);
      await loadData();
      setIsItemModalOpen(false);
    } catch(err) { console.error(err); alert("Failed to save item"); }
  };
  const deleteItem = async (id: string) => {
    if (confirm("Delete this item?")) {
      try {
        await deleteMenuItem(id);
        await loadData();
      } catch(err) { console.error(err); alert("Failed to delete item"); }
    }
  };

  // Categories Handlers
  const openCategoryModal = (cat?: MenuCategory) => {
    setEditingCategory(cat || null);
    setCategoryForm(cat || { name: "", icon: "" });
    setIsCategoryModalOpen(true);
  };
  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveMenuCategory(categoryForm as MenuCategory, restId);
      await loadData();
      setIsCategoryModalOpen(false);
    } catch(err) { console.error(err); alert("Failed to save category"); }
  };
  const deleteCategory = async (id: string) => {
    if (confirm("Delete category?")) {
      try {
        await deleteMenuCategory(id);
        await loadData();
      } catch(err) { console.error(err); alert("Failed to delete category"); }
    }
  };

  // Offers Handlers
  const openOfferModal = (offer?: Offer) => {
    setEditingOffer(offer || null);
    setOfferForm(offer || { title: "", description: "", discount: "", code: "", image: "" });
    setIsOfferModalOpen(true);
  };
  const saveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveOffer(offerForm as Offer, restId);
      await loadData();
      setIsOfferModalOpen(false);
    } catch(err) { console.error(err); alert("Failed to save offer"); }
  };
  const deleteOfferHandler = async (id: string) => {
    if (confirm("Delete offer?")) {
      try {
        await deleteOffer(id);
        await loadData();
      } catch(err) { console.error(err); alert("Failed to delete offer"); }
    }
  };

  if (isManaging) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        <div className="flex items-center gap-4 border-b pb-4">
          <Button variant="ghost" size="icon" onClick={() => setIsManaging(false)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Managing: {restaurantData.name}</h1>
            <p className="text-muted-foreground mt-1">Update menus, categories, and active offers for this restaurant.</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="menu">Menu Items</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Menu Items</h2>
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
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</div>
                        </td>
                        <td className="px-6 py-4">{categories.find(c => c.id === item.category)?.name || item.category}</td>
                        <td className="px-6 py-4">₹{item.price}</td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => openItemModal(item)}><Edit className="h-4 w-4"/></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)} className="text-destructive"><Trash2 className="h-4 w-4"/></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Menu Categories</h2>
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
                          <Button variant="ghost" size="icon" onClick={() => openCategoryModal(cat)}><Edit className="h-4 w-4"/></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteCategory(cat.id)} className="text-destructive"><Trash2 className="h-4 w-4"/></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Active Offers</h2>
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
                          <Button variant="ghost" size="icon" onClick={() => openOfferModal(offer)}><Edit className="h-4 w-4"/></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteOfferHandler(offer.id)} className="text-destructive"><Trash2 className="h-4 w-4"/></Button>
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
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
              <div className="flex justify-between p-4 border-b">
                <h2 className="font-bold">{editingItem ? "Edit Item" : "Add Item"}</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsItemModalOpen(false)} className="h-6 w-6"><X className="h-4 w-4"/></Button>
              </div>
              <form onSubmit={saveItem} className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input required value={itemForm.name || ""} onChange={e => setItemForm({...itemForm, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input required value={itemForm.description || ""} onChange={e => setItemForm({...itemForm, description: e.target.value})} />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Price</label>
                    <Input type="number" required value={itemForm.price || 0} onChange={e => setItemForm({...itemForm, price: Number(e.target.value)})} />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium">Category</label>
                    <select className="flex h-9 w-full rounded-md border px-3 py-1 text-sm" value={itemForm.category} onChange={e => setItemForm({...itemForm, category: e.target.value})}>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Item Image</label>
                  <div className="flex items-center gap-3">
                    {itemForm.image && (
                      <img src={itemForm.image} alt="Preview" className="w-12 h-12 rounded object-cover" />
                    )}
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        try {
                          const { uploadImage } = await import('@/lib/api');
                          const url = await uploadImage(file, 'menu-images');
                          if (url) {
                            setItemForm({...itemForm, image: url});
                          } else {
                            alert("Failed to upload image. Please check Supabase configuration in .env.local.");
                          }
                        } catch (err) {
                          console.error(err);
                          alert("Supabase client is not fully configured yet.");
                        }
                      }} 
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Or provide an image URL manually:</p>
                  <Input value={itemForm.image || ""} onChange={e => setItemForm({...itemForm, image: e.target.value})} placeholder="https://..." />
                </div>
                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsItemModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Categories */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
              <div className="flex justify-between p-4 border-b">
                <h2 className="font-bold">{editingCategory ? "Edit Category" : "Add Category"}</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsCategoryModalOpen(false)} className="h-6 w-6"><X className="h-4 w-4"/></Button>
              </div>
              <form onSubmit={saveCategory} className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input required value={categoryForm.name || ""} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium">Icon (Emoji)</label>
                  <Input required value={categoryForm.icon || ""} onChange={e => setCategoryForm({...categoryForm, icon: e.target.value})} />
                </div>
                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCategoryModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Offers */}
        {isOfferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
              <div className="flex justify-between p-4 border-b">
                <h2 className="font-bold">{editingOffer ? "Edit Offer" : "Add Offer"}</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsOfferModalOpen(false)} className="h-6 w-6"><X className="h-4 w-4"/></Button>
              </div>
              <form onSubmit={saveOffer} className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input required value={offerForm.title || ""} onChange={e => setOfferForm({...offerForm, title: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input required value={offerForm.description || ""} onChange={e => setOfferForm({...offerForm, description: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium">Discount</label>
                  <Input required value={offerForm.discount || ""} onChange={e => setOfferForm({...offerForm, discount: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium">Code</label>
                  <Input required value={offerForm.code || ""} onChange={e => setOfferForm({...offerForm, code: e.target.value})} />
                </div>
                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOfferModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Save</Button>
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
          <Button variant="outline">Export Report</Button>
          <Button>Add Restaurant</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              Only showing registered mock data
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

        <Card className="shadow-none border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">MRR</CardTitle>
            <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-foreground" strokeWidth={2} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">$99</div>
          </CardContent>
        </Card>

        <Card className="shadow-none border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active End Users</CardTitle>
            <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
              <Users className="h-4 w-4 text-foreground" strokeWidth={2} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">1,240</div>
          </CardContent>
        </Card>
      </div>

      {/* Restaurants Table */}
      <Card className="shadow-none border-border mt-4">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 mb-4 gap-4">
          <div>
            <CardTitle>Your Restaurants</CardTitle>
            <CardDescription>Businesses on the YoMenu platform.</CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search restaurants..." 
              className="w-full pl-9 h-9 border-muted"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-muted-foreground font-medium text-xs uppercase tracking-wider">
                  <th className="px-6 py-4">Restaurant Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-right">Scans (This Month)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-foreground flex items-center gap-3">
                    <img src={restaurantData.logo} alt="logo" className="w-8 h-8 rounded-full" />
                    {restaurantData.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{restaurantData.location}</td>
                  <td className="px-6 py-4 text-right tabular-nums text-muted-foreground font-medium">12,430</td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="text-emerald-600 bg-emerald-500/10 border-0 shadow-none hover:bg-transparent font-medium">
                      Active
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => setIsManaging(true)}>
                      Manage Data
                    </Button>
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
