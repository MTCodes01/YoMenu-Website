import Link from "next/link";
import { ArrowRight, QrCode, LayoutDashboard, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8 mx-auto">
        <QrCode className="h-12 w-12 text-primary" strokeWidth={1.5} />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
        YoMenu <span className="text-primary font-normal italic">Prototype</span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-16 font-medium">
        Your Menu. One Scan Away. Explore the static frontend prototypes for the customer, restaurant, and admin experiences.
      </p>

      <div className="grid gap-6 md:grid-cols-3 w-full max-w-5xl mx-auto">
        {/* Customer Menu */}
        <Link href="/q/demo" className="group block h-full">
          <div className="h-full border border-border bg-card p-8 hover:border-primary transition-all text-left flex flex-col">
            <div className="mb-6">
              <QrCode className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold mb-3">Customer Menu</h2>
            <p className="text-muted-foreground flex-1 mb-8 text-sm leading-relaxed">
              The mobile-first QR scan experience. See the beautiful menu, search for items, and discover offers.
            </p>
            <div className="flex items-center text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              View Prototype <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Restaurant Dashboard */}
        <Link href="/dashboard" className="group block h-full">
          <div className="h-full border border-border bg-card p-8 hover:border-primary transition-all text-left flex flex-col">
            <div className="mb-6">
              <LayoutDashboard className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold mb-3">Restaurant Dashboard</h2>
            <p className="text-muted-foreground flex-1 mb-8 text-sm leading-relaxed">
              The control center for restaurant owners to manage orders, menu items, and view metrics.
            </p>
            <div className="flex items-center text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              View Prototype <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Admin Dashboard */}
        <Link href="/admin" className="group block h-full">
          <div className="h-full border border-border bg-card p-8 hover:border-primary transition-all text-left flex flex-col">
            <div className="mb-6">
              <ShieldCheck className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold mb-3">Admin Panel</h2>
            <p className="text-muted-foreground flex-1 mb-8 text-sm leading-relaxed">
              The platform overview for YoMenu staff to monitor health, restaurants, and overall billing.
            </p>
            <div className="flex items-center text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              View Prototype <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
