"use client";

import React from "react";
import { 
  Building2, 
  Users, 
  CreditCard, 
  Activity,
  ArrowUpRight,
  MoreVertical,
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AdminPage() {
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
            <div className="text-2xl font-bold tabular-nums">1,432</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center font-medium">
              <span className="text-emerald-600 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +12%
              </span>
              from last month
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
            <div className="text-2xl font-bold tabular-nums">8.4M</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center font-medium">
              <span className="text-emerald-600 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +24%
              </span>
              from last month
            </p>
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
            <div className="text-2xl font-bold tabular-nums">$42,800</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center font-medium">
              <span className="text-emerald-600 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +8%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active End Users (30d)</CardTitle>
            <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
              <Users className="h-4 w-4 text-foreground" strokeWidth={2} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">1.2M</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center font-medium">
              <span className="text-emerald-600 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +18%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Restaurants Table */}
      <Card className="shadow-none border-border mt-4">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 mb-4 gap-4">
          <div>
            <CardTitle>Recent Restaurants</CardTitle>
            <CardDescription>Latest businesses joined YoMenu.</CardDescription>
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
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4 text-right">Scans (This Month)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { name: "Malabar Table", location: "Trivandrum, IN", plan: "Pro", scans: "12,430", status: "Active", color: "text-emerald-600 bg-emerald-500/10" },
                  { name: "The Pasta Palace", location: "New York, USA", plan: "Enterprise", scans: "45,210", status: "Active", color: "text-emerald-600 bg-emerald-500/10" },
                  { name: "Sushi Symphony", location: "Tokyo, JP", plan: "Starter", scans: "2,100", status: "Active", color: "text-emerald-600 bg-emerald-500/10" },
                  { name: "Burger Bros", location: "London, UK", plan: "Pro", scans: "8,920", status: "Past Due", color: "text-amber-600 bg-amber-500/10" },
                  { name: "Green Bowl", location: "Berlin, DE", plan: "Starter", scans: "0", status: "Onboarding", color: "text-foreground bg-muted" },
                ].map((restaurant, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{restaurant.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{restaurant.location}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-muted-foreground">{restaurant.plan}</span>
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums text-muted-foreground font-medium">{restaurant.scans}</td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className={`${restaurant.color} border-0 shadow-none hover:bg-transparent font-medium`}>
                        {restaurant.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t flex justify-center">
            <Button variant="outline" size="sm" className="font-medium text-muted-foreground">View All Restaurants</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
