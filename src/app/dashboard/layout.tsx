import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  MenuSquare, 
  ShoppingBag, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <Store className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold text-xl text-primary">YoMenu</span>
        </div>
        <div className="p-4 flex-1">
          <div className="mb-6 px-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Restaurant Management
            </h2>
            <div className="flex items-center gap-3 bg-muted p-2 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=150&h=150&q=80" />
                <AvatarFallback>MT</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">Malabar Table</p>
                <p className="text-xs text-muted-foreground truncate">Trivandrum</p>
              </div>
            </div>
          </div>
          
          <nav className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-md font-medium">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
              <ShoppingBag className="h-4 w-4" />
              Orders
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
              <MenuSquare className="h-4 w-4" />
              Menu Items
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium transition-colors">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96 hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search orders, menu items..." 
                className="w-full bg-muted/50 pl-9 border-none focus-visible:ring-1 focus-visible:bg-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full"></span>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
