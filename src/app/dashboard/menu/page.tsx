"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search,
  Edit,
  Trash2,
  X,
  Image as ImageIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { menuItems as initialMenuItems, menuCategories, MenuItem } from "@/lib/mockData";

export default function MenuManagementPage() {
  const [items, setItems] = useState<MenuItem[]>(initialMenuItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: menuCategories[0]?.id || "",
    isVeg: true,
    isPopular: false,
  });

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryName = (id: string) => {
    return menuCategories.find(c => c.id === id)?.name || id;
  };

  const handleOpenModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        description: "",
        price: 0,
        image: "",
        category: menuCategories[0]?.id || "",
        isVeg: true,
        isPopular: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      // Update
      setItems(items.map(item => item.id === editingItem.id ? { ...item, ...formData } as MenuItem : item));
    } else {
      // Create
      const newItem: MenuItem = {
        ...(formData as Omit<MenuItem, "id">),
        id: `item-${Date.now()}`
      };
      setItems([newItem, ...items]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Items</h1>
          <p className="text-muted-foreground mt-1">Manage your restaurant's menu, categories, and pricing.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </Button>
        </div>
      </div>

      <Card className="shadow-none border-border mt-4">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 mb-4 gap-4">
          <div>
            <CardTitle>All Menu Items</CardTitle>
            <CardDescription>A complete list of items across all categories.</CardDescription>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search items..." 
              className="w-full pl-9 h-9 border-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr className="text-left text-muted-foreground font-medium text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 w-20">Image</th>
                  <th className="px-6 py-4">Item Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{item.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-xs">{item.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-muted-foreground">
                        {getCategoryName(item.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums text-foreground font-medium">
                      ₹{item.price}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Badge variant="secondary" className={item.isVeg ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10" : "bg-red-500/10 text-red-600 hover:bg-red-500/10"}>
                          {item.isVeg ? "Veg" : "Non-Veg"}
                        </Badge>
                        {item.isPopular && (
                          <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/10">
                            Popular
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleOpenModal(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No menu items found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold">{editingItem ? "Edit Menu Item" : "Add New Item"}</h2>
              <Button variant="ghost" size="icon" onClick={handleCloseModal} className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Item Name</label>
                <Input 
                  required
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. Masala Dosa" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  required
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Short description of the dish..." 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price (₹)</label>
                  <Input 
                    type="number"
                    required
                    min="0"
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                  >
                    {menuCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL</label>
                <Input 
                  value={formData.image || ""} 
                  onChange={e => setFormData({...formData, image: e.target.value})} 
                  placeholder="https://example.com/image.jpg" 
                />
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    checked={formData.isVeg}
                    onChange={e => setFormData({...formData, isVeg: e.target.checked})}
                  />
                  <span className="text-sm font-medium">Vegetarian</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    checked={formData.isPopular}
                    onChange={e => setFormData({...formData, isPopular: e.target.checked})}
                  />
                  <span className="text-sm font-medium">Popular Item</span>
                </label>
              </div>
            </form>
            
            <div className="border-t p-4 px-6 flex justify-end gap-2 bg-muted/30">
              <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit">{editingItem ? "Save Changes" : "Add Item"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
