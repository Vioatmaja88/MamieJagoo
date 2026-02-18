import { useParams, useNavigate } from "react-router-dom";
import { products, formatRupiah } from "@/lib/mock-data";
import { ArrowLeft, ShoppingCart, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const product = products.find((p) => p.id === id);

  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0] ?? "");
  const [selectedSpice, setSelectedSpice] = useState(product?.spiceLevels?.[0] ?? "");

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
      image: product.image,
      variant: selectedVariant,
      spiceLevel: selectedSpice || undefined,
    });
    toast.success("Ditambahkan ke cart!", { description: `${product.name} — ${selectedVariant}` });
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Halo MamieJago! Saya mau pesan:\n\n📦 ${product.name}\n🔸 Varian: ${selectedVariant}${selectedSpice ? `\n🌶️ Level: ${selectedSpice}` : ""}\n💰 ${formatRupiah(product.price)}\n\nTerima kasih!`
    );
    window.open(`https://wa.me/6281234567890?text=${msg}`, "_blank");
  };

  return (
    <div className="pb-20">
      {/* Back button */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-base font-bold text-foreground truncate">{product.name}</h1>
        </div>
      </div>

      <main className="max-w-lg mx-auto">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="aspect-square overflow-hidden"
        >
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
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
            <p className="text-sm text-muted-foreground mt-2">{product.description}</p>
          </div>

          {/* Variants */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Varian Rasa</h3>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedVariant === v
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Spice */}
          {product.spiceLevels && product.spiceLevels.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">🌶️ Level Pedas</h3>
              <div className="flex flex-wrap gap-2">
                {product.spiceLevels.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSpice(s)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedSpice === s
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
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
