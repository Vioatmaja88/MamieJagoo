import { Star } from "lucide-react";
import { formatRupiah } from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string | null;
    image_url?: string | null;
    rating: number | null;
    variants?: string[];
    variantCount?: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const imgSrc = product.image_url || product.image || "/placeholder.svg";
  const navigate = useNavigate();

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-foreground truncate">{product.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
          <span className="text-xs text-muted-foreground">{product.rating ?? 0}</span>
        </div>
        <p className="text-primary font-bold text-sm mt-1">{formatRupiah(product.price)}</p>
        {(product.variants?.length || product.variantCount) ? (
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {product.variants?.length || product.variantCount} varian
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}
