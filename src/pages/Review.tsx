import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

const Review = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    supabase
      .from("reviews")
      .select("id, customer_name, rating, comment, created_at")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setReviews(data ?? []));
  }, []);

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <h1 className="text-lg font-extrabold text-foreground">Review</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 mt-4 space-y-3">
        {reviews.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-card rounded-2xl border border-border p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
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
                    className={`h-3.5 w-3.5 ${j < r.rating ? "fill-secondary text-secondary" : "text-muted"}`}
                  />
                ))}
              </div>
            </div>
            {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
          </motion.div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-muted-foreground py-8 text-sm">Belum ada review.</p>
        )}
      </main>
    </div>
  );
};

export default Review;
