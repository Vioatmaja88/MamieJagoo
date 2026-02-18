import { BannerSlider } from "@/components/BannerSlider";
import { ProductCard } from "@/components/ProductCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { categories, products } from "@/lib/mock-data";
import { useState } from "react";
import { motion } from "framer-motion";

const Index = () => {
  const [selectedCat, setSelectedCat] = useState("Semua");
  const filtered = selectedCat === "Semua" ? products : products.filter((p) => p.category === selectedCat);
  const popular = products.filter((p) => p.rating >= 4.6).slice(0, 4);

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <div>
            <h1 className="text-lg font-extrabold text-primary">MamieJago</h1>
            <p className="text-[11px] text-muted-foreground -mt-0.5">Makanan Siap Saji Premium 🍜</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 space-y-6 mt-4">
        {/* Banner */}
        <BannerSlider />

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCat === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Popular */}
        {selectedCat === "Semua" && (
          <section>
            <h2 className="text-base font-bold text-foreground mb-3">🔥 Populer</h2>
            <div className="grid grid-cols-2 gap-3">
              {popular.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* All / Filtered */}
        <section>
          <h2 className="text-base font-bold text-foreground mb-3">
            {selectedCat === "Semua" ? "Semua Menu" : selectedCat}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
