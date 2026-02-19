import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, Image, Star, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, banners: 0, reviews: 0, pendingReviews: 0 });

  useEffect(() => {
    async function load() {
      const [p, b, r, pr] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("banners").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("id", { count: "exact", head: true }).eq("is_approved", false),
      ]);
      setStats({
        products: p.count ?? 0,
        banners: b.count ?? 0,
        reviews: r.count ?? 0,
        pendingReviews: pr.count ?? 0,
      });
    }
    load();
  }, []);

  const cards = [
    { label: "Total Produk", value: stats.products, icon: Package, color: "text-primary" },
    { label: "Banner Aktif", value: stats.banners, icon: Image, color: "text-secondary" },
    { label: "Total Review", value: stats.reviews, icon: Star, color: "text-accent-foreground" },
    { label: "Review Pending", value: stats.pendingReviews, icon: TrendingUp, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-foreground">Selamat Datang, Admin! 👋</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-card border border-border rounded-2xl p-4 space-y-2">
            <c.icon className={`h-6 w-6 ${c.color}`} />
            <p className="text-2xl font-bold text-foreground">{c.value}</p>
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
