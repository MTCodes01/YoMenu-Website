"use client";

import React from "react";
import { 
  TrendingUp, 
  Users, 
  Utensils, 
  QrCode,
  ArrowUpRight,
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening at your restaurant today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <QrCode className="h-4 w-4 mr-2" />
            Download QR
          </Button>
          <Button>
            View Live Menu
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-none border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="h-8 w-8 bg-primary/10 rounded-md flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" strokeWidth={2} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">₹45,231</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center font-medium">
              <span className="text-emerald-600 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +20.1%
              </span>
              from last week
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-none border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scans Today</CardTitle>
            <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
              <QrCode className="h-4 w-4 text-foreground" strokeWidth={2} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">124</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center font-medium">
              <span className="text-emerald-600 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +12
              </span>
              since yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
            <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
              <Utensils className="h-4 w-4 text-foreground" strokeWidth={2} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">18</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center font-medium">
              5 ready to serve
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Customers</CardTitle>
            <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
              <Users className="h-4 w-4 text-foreground" strokeWidth={2} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">32</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center font-medium">
              <span className="text-emerald-600 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +4%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        {/* Recent Orders List */}
        <Card className="lg:col-span-4 shadow-none border-border">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest table orders in real-time.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 font-medium">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "ORD-932", table: "T-12", items: 4, total: "₹1,240", status: "Preparing", color: "bg-orange-100 text-orange-700" },
                { id: "ORD-931", table: "T-05", items: 2, total: "₹560", status: "Ready", color: "bg-emerald-100 text-emerald-700" },
                { id: "ORD-930", table: "T-08", items: 6, total: "₹2,890", status: "Served", color: "bg-muted text-foreground" },
                { id: "ORD-929", table: "T-02", items: 1, total: "₹120", status: "Served", color: "bg-muted text-foreground" },
                { id: "ORD-928", table: "T-14", items: 3, total: "₹950", status: "Served", color: "bg-muted text-foreground" },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center font-bold text-sm">
                      {order.table}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.items} items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold tabular-nums">{order.total}</p>
                    </div>
                    <Badge variant="secondary" className={`${order.color} border-0 hover:${order.color} shadow-none`}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Menu Items */}
        <Card className="lg:col-span-3 shadow-none border-border">
          <CardHeader className="border-b pb-4 mb-4">
            <CardTitle>Top Selling Items</CardTitle>
            <CardDescription>Your most popular menu items this week.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: "Kerala Beef Fry", sales: 142, revenue: "₹45,440", img: "https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=100&h=100&q=80" },
                { name: "Malabar Chicken Biryani", sales: 128, revenue: "₹35,840", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=100&h=100&q=80" },
                { name: "Paneer Butter Masala", sales: 94, revenue: "₹23,500", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&w=100&h=100&q=80" },
                { name: "Kerala Parotta", sales: 340, revenue: "₹8,500", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=100&h=100&q=80" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="font-bold text-muted-foreground w-4 text-xs tabular-nums">{i + 1}</div>
                  <Avatar className="h-10 w-10 rounded-md border border-border">
                    <AvatarImage src={item.img} className="object-cover" />
                    <AvatarFallback>Food</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">{item.sales} orders</p>
                  </div>
                  <div className="font-semibold text-sm tabular-nums">
                    {item.revenue}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
