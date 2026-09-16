import React from "react";
import Link from "next/link";
import { 
  Building2, 
  CreditCard,
  Users,
  Settings,
  Shield,
  BarChart4,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 text-slate-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Shield className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold text-xl text-white">YoMenu Admin</span>
        </div>
        <div className="p-4 flex-1">
          <nav className="space-y-1">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 bg-primary/20 text-white rounded-md font-medium">
              <BarChart4 className="h-4 w-4 text-primary" />
              Platform Overview
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-900 hover:text-white rounded-md font-medium transition-colors">
              <Building2 className="h-4 w-4" />
              Restaurants
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-900 hover:text-white rounded-md font-medium transition-colors">
              <Users className="h-4 w-4" />
              Users
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-900 hover:text-white rounded-md font-medium transition-colors">
              <CreditCard className="h-4 w-4" />
              Billing & Subscriptions
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-900 hover:text-white rounded-md font-medium transition-colors">
              <Settings className="h-4 w-4" />
              System Settings
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800 flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-slate-700">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80" />
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-white">Super Admin</p>
            <p className="text-xs text-slate-400">admin@yomenu.com</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar for mobile */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6 z-10 md:hidden">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">YoMenu Admin</span>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
