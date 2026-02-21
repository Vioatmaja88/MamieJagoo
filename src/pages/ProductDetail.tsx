import { useParams, useNavigate } from "react-router-dom";
import { formatRupiah } from "@/lib/mock-data";
import { ArrowLeft, ShoppingCart, Star, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DBProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string | null;
  image_url: string | null;
  rating: number;
}

interface ReviewItem {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<DBProduct | null>(null);
  const [variants, setVariants] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState("");

  // Review state
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    async function load() {
      const { data: p } = await supabase.from("products").select("*").eq("id", id).single();
      if (p) {
        setProduct(p);
        const { data: v } = await supabase.from("product_variants").select("variant_name").eq("product_id", p.id);
        const varNames = (v ?? []).map((x: any) => x.variant_name);
        setVariants(varNames);
        if (varNames.length > 0) setSelectedVariant(varNames[0]);
      }
      setLoading(false);
    }
    load();
    loadReviews();
  }, [id]);

  // Load display name for logged-in user
  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          setDisplayName(data?.display_name ?? user.email?.split("@")[0] ?? "User");
        });
    }
  }, [user]);

  const loadReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("id, customer_name, rating, comment, created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    setReviews(data ?? []);
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/auth");
      return;
    }
    setSubmittingReview(true);
    const { error } = await supabase.from("reviews").insert({
      customer_name: displayName,
      rating: reviewRating,
      comment: reviewComment.trim() || null,
      is_approved: true,
    });
    if (error) {
      toast.error("Gagal mengirim review");
    } else {
      toast.success("Review berhasil dikirim!");
      setReviewRating(5);
      setReviewComment("");
      loadReviews();
    }
    setSubmittingReview(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Produk tidak ditemukan</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url ?? "/placeholder.svg",
      variant: selectedVariant,
    });
    toast.success("Ditambahkan ke cart!", { description: `${product.name} — ${selectedVariant}` });
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Halo MamieJago! Saya mau pesan:\n\n📦 ${product.name}\n🔸 Varian: ${selectedVariant}\n💰 ${formatRupiah(product.price)}\n\nTerima kasih!`
    );
    window.open(`https://wa.me/62881023406838?text=${msg}`, "_blank");
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center gap-3 px-5 py-3.5 max-w-lg mx-auto">
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </motion.button>
          <h1 className="text-base font-bold text-foreground truncate">{product.name}</h1>
        </div>
      </div>

      <main className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="aspect-square overflow-hidden">
          <img src={product.image_url ?? "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
        </motion.div>

        <div className="px-5 py-5 space-y-5">
          {/* Product info */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">{product.name}</h2>
              <div className="flex items-center gap-1 bg-secondary/10 px-2.5 py-1 rounded-lg">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span className="text-sm font-semibold text-secondary">{product.rating}</span>
              </div>
            </div>
            <p className="text-primary text-2xl font-bold mt-2">{formatRupiah(product.price)}</p>
            {product.description && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{product.description}</p>}
          </motion.div>

          {/* Variants */}
          {variants.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h3 className="text-sm font-semibold text-foreground mb-2.5">Varian Rasa</h3>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <motion.button
                    key={v}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedVariant === v
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {v}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-3 pt-1"
          >
            <Button
              onClick={handleAddToCart}
              className="flex-1 rounded-xl h-12 text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Tambah ke Cart
            </Button>
            <Button
              onClick={handleWhatsApp}
              variant="outline"
              className="rounded-xl h-12 px-5 border-green-500/50 text-green-600 hover:bg-green-500/10 dark:text-green-400 dark:border-green-500/30 dark:hover:bg-green-500/10 transition-all duration-200 hover:scale-[1.02]"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Review Section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="border-t border-border/50 pt-6 mt-2 space-y-5"
          >
            <h3 className="text-base font-bold text-foreground">Tulis Review</h3>
            {user ? (
              <div className="bg-card rounded-2xl border border-border/60 p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {displayName[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="text-sm font-semibold text-foreground">{displayName}</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Rating</p>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <motion.button key={s} whileTap={{ scale: 0.8 }} onClick={() => setReviewRating(s)}>
                        <Star
                          className={`h-7 w-7 transition-colors duration-150 ${
                            s <= reviewRating ? "fill-secondary text-secondary" : "text-muted-foreground/30"
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tulis komentar (opsional)"
                  rows={3}
                  className="w-full px-4 py-3 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all duration-200"
                />
                <Button
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className="w-full rounded-xl h-11 text-sm font-semibold shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {submittingReview ? "Mengirim..." : "Kirim Review"}
                </Button>
              </div>
            ) : (
              <div className="bg-muted rounded-2xl p-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">Login untuk menulis review</p>
                <Button onClick={() => navigate("/auth")} variant="outline" className="rounded-xl">
                  Login / Register
                </Button>
              </div>
            )}

            {/* Existing reviews */}
            {reviews.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Review ({reviews.length})</h3>
                {reviews.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-card rounded-2xl border border-border/60 p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
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
                    {r.comment && <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{r.comment}</p>}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
