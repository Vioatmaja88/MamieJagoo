import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Banner {
  id: string;
  image_url: string;
  title: string;
  subtitle: string | null;
}

export function BannerSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("banners")
      .select("id, image_url, title, subtitle")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => setBanners(data ?? []));
  }, []);

  const next = useCallback(() => {
    if (banners.length === 0) return;
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, banners.length]);

  if (banners.length === 0) return null;

  const b = banners[current];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-lg">
      <div className="aspect-[2/1] relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={b.id}
            src={b.image_url}
            alt={b.title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-bold text-white drop-shadow-md">{b.title}</h2>
              {b.subtitle && <p className="text-sm text-white/80">{b.subtitle}</p>}
            </motion.div>
          </AnimatePresence>
          <button
            onClick={() => navigate("/menu")}
            className="mt-2 inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:opacity-90 transition"
          >
            Pesan Sekarang <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      {banners.length > 1 && (
        <div className="absolute bottom-2 right-4 flex gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${i === current ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
