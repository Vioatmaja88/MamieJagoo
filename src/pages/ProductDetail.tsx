import { useParams, useNavigate } from "react-router-dom";
import { formatRupiah } from "@/lib/mock-data";
import { ArrowLeft, ShoppingCart, Star, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  const [product, setProduct] = useState<DBProduct | null>(null);
  const [variants, setVariants] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState("");

  // Review state
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

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

  const loadReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("id, customer_name, rating, comment, created_at")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(10);
    setReviews(data ?? []);
  };

  const handleSubmitReview = async () => {
    if (!reviewName.trim()) { toast.error("Masukkan nama kamu"); return; }
    setSubmittingReview(true);
    const { error } = await supabase.from("reviews").insert({
      customer_name: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim() || null,
    });
    if (error) {
      toast.error("Gagal mengirim review");
    } else {
      toast.success("Review terkirim! Menunggu persetujuan admin.");
      setReviewName("");
      setReviewRating(5);
      setReviewComment("");
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
    <div className="pb-20">
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-base font-bold text-foreground truncate">{product.name}</h1>
        </div>
      </div>

      <main className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="aspect-square overflow-hidden">
          <img src={product.image_url ?? "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
        </motion.div>

        <div className="px-4 py-4 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">{product.name}</h2>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
            </div>
            <p className="text-primary text-xl font-bold mt-1">{formatRupiah(product.price)}</p>
            {product.description && <p className="text-sm text-muted-foreground mt-2">{product.description}</p>}
          </div>

          {variants.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Varian Rasa</h3>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedVariant === v ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button onClick={handleAddToCart} className="flex-1 rounded-xl h-12 text-sm font-semibold">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Tambah ke Cart
            </Button>
            <Button
              onClick={handleWhatsApp}
              variant="outline"
              className="rounded-xl h-12 px-4 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>

          {/* Review Section */}
          <div className="border-t border-border pt-4 mt-4 space-y-4">
            <h3 className="text-base font-bold text-foreground">Tulis Review</h3>
            <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
              <input
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="Nama kamu"
                className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setReviewRating(s)}>
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          s <= reviewRating ? "fill-secondary text-secondary" : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Komentar (opsional)"
                rows={2}
                className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition"
              />
              <Button
                onClick={handleSubmitReview}
                disabled={submittingReview || !reviewName.trim()}
                className="w-full rounded-xl h-10 text-sm"
              >
                <Send className="h-4 w-4 mr-2" />
                {submittingReview ? "Mengirim..." : "Kirim Review"}
              </Button>
            </div>

            {/* Existing reviews */}
            {reviews.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Review Terbaru</h3>
                {reviews.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-2xl border border-border p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {r.customer_name[0]}
                        </div>
                        <p className="font-semibold text-sm text-foreground">{r.customer_name}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            className={`h-3 w-3 ${j < r.rating ? "fill-secondary text-secondary" : "text-muted"}`}
                          />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-xs text-muted-foreground mt-1">{r.comment}</p>}
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(r.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
