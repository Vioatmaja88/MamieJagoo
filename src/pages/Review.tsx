import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface ReviewData {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const Review = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);

  useEffect(() => {
    supabase
      .from("reviews")
      .select("id, customer_name, rating, comment, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setReviews(data ?? []));
  }, []);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div className="pb-24">
      <header className="sticky top-0 z-40 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-5 py-3.5 max-w-lg mx-auto">
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">Review</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 mt-5 space-y-5">
        {/* Stats card */}
        {reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border/60 p-5 flex items-center gap-5 shadow-sm"
          >
            <div className="text-center">
              <p className="text-3xl font-extrabold text-foreground">{avgRating}</p>
              <div className="flex gap-0.5 mt-1 justify-center">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`h-3.5 w-3.5 ${j < Math.round(Number(avgRating)) ? "fill-secondary text-secondary" : "text-muted-foreground/20"}`}
                  />
                ))}
              </div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <p className="text-sm font-semibold text-foreground">{reviews.length} review</p>
              <p className="text-xs text-muted-foreground">dari pelanggan kami</p>
            </div>
          </motion.div>
        )}

        {/* Reviews list */}
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {reviews.map((r) => (
            <motion.div
              key={r.id}
              variants={item}
              className="bg-card rounded-2xl border border-border/60 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {r.customer_name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{r.customer_name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`h-3.5 w-3.5 ${j < r.rating ? "fill-secondary text-secondary" : "text-muted-foreground/20"}`}
                    />
                  ))}
                </div>
              </div>
              {r.comment && <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>}
            </motion.div>
          ))}
        </motion.div>

        {reviews.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">⭐</p>
            <p className="text-muted-foreground text-sm">Belum ada review.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Review;
