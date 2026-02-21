import { BannerSlider } from "@/components/BannerSlider";
import { ProductCard } from "@/components/ProductCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Flame, Sparkles } from "lucide-react";

const CATEGORIES = ["Semua", "Mie", "Wonton", "Dimsum", "Minuman"];

interface DBProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
  rating: number;
  is_active: boolean;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

const Index = () => {
  const [selectedCat, setSelectedCat] = useState("Semua");
  const [products, setProducts] = useState<DBProduct[]>([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("id, name, price, category, image_url, rating, is_active")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setProducts(data ?? []));
  }, []);

  const filtered = selectedCat === "Semua" ? products : products.filter((p) => p.category === selectedCat);
  const popular = products.filter((p) => Number(p.rating) >= 4.6).slice(0, 4);

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-5 py-3.5 max-w-lg mx-auto">
          <div>
            <h1 className="text-xl font-extrabold text-primary tracking-tight">MamieJago</h1>
            <p className="text-[11px] text-muted-foreground -mt-0.5 tracking-wide">Makanan Siap Saji Premium 🍜</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 space-y-7 mt-5">
        <BannerSlider />

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-250 ${
                selectedCat === cat
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Popular */}
        {selectedCat === "Semua" && popular.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">Populer</h2>
            </div>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-3.5"
            >
              {popular.map((p) => (
                <motion.div key={p.id} variants={item}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* All products */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-secondary" />
            <h2 className="text-base font-bold text-foreground">
              {selectedCat === "Semua" ? "Semua Menu" : selectedCat}
            </h2>
          </div>
          <motion.div
            key={selectedCat}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3.5"
          >
            {filtered.map((p) => (
              <motion.div key={p.id} variants={item}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12 text-sm">Tidak ada menu ditemukan.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
