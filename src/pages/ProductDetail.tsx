import { useParams, useNavigate } from "react-router-dom";
import { formatRupiah } from "@/lib/mock-data";
import { ArrowLeft, ShoppingCart, Star, MessageCircle } from "lucide-react";
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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<DBProduct | null>(null);
  const [variants, setVariants] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedSpice, setSelectedSpice] = useState("");

  const spiceLevels = product?.category === "Mie" || product?.category === "Wonton"
    ? ["Tidak Pedas", "Pedas", "Extra Pedas", "Pedas Nampol"]
    : [];

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
  }, [id]);

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
      spiceLevel: selectedSpice || undefined,
    });
    toast.success("Ditambahkan ke cart!", { description: `${product.name} — ${selectedVariant}` });
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Halo MamieJago! Saya mau pesan:\n\n📦 ${product.name}\n🔸 Varian: ${selectedVariant}${selectedSpice ? `\n🌶️ Level: ${selectedSpice}` : ""}\n💰 ${formatRupiah(product.price)}\n\nTerima kasih!`
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

          {spiceLevels.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">🌶️ Level Pedas</h3>
              <div className="flex flex-wrap gap-2">
                {spiceLevels.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSpice(s)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedSpice === s ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s}
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
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
