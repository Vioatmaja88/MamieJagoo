import { ProductCard } from "@/components/ProductCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CATEGORIES = ["Semua", "Mie", "Wonton", "Dimsum", "Minuman"];

interface DBProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
  rating: number;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const Menu = () => {
  const [selectedCat, setSelectedCat] = useState("Semua");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<DBProduct[]>([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("id, name, price, category, image_url, rating")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setProducts(data ?? []));
  }, []);

  const filtered = products
    .filter((p) => selectedCat === "Semua" || p.category === selectedCat)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="pb-24">
      <header className="sticky top-0 z-40 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-5 py-3.5 max-w-lg mx-auto">
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">Menu</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 space-y-5 mt-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari menu..."
            className="w-full pl-11 pr-4 py-3 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
          />
        </div>

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

        <motion.div
          key={selectedCat + search}
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
      </main>
    </div>
  );
};

export default Menu;
