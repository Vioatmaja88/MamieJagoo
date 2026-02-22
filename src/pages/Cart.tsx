import { useCart, CartItem } from "@/lib/cart-context";
import { formatRupiah } from "@/lib/mock-data";
import { Minus, Plus, Trash2, MessageCircle, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function generateOrderId() {
  return "MJ-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
}

const Cart = () => {
  const { items, updateQty, removeItem, clearCart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  const [showReceipt, setShowReceipt] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerWA, setCustomerWA] = useState("");
  const [note, setNote] = useState("");
  const [orderId] = useState(generateOrderId);

  const handleSendWA = () => {
    const itemLines = items
      .map((i) => `• ${i.name} (${i.variant ?? "-"}) x${i.qty} = ${formatRupiah(i.price * i.qty)}`)
      .join("\n");
    const msg = encodeURIComponent(
      `📦 *Pesanan MamieJago*\n🆔 ${orderId}\n\n👤 ${customerName}\n📱 ${customerWA}\n\n${itemLines}\n\n💰 *Total: ${formatRupiah(totalPrice)}*${note ? `\n📝 Catatan: ${note}` : ""}\n\nTerima kasih! 🙏`
    );
    window.open(`https://wa.me/62881023406838?text=${msg}`, "_blank");
    clearCart();
    setShowReceipt(false);
  };

  if (items.length === 0) {
    return (
      <div className="pb-24">
        <header className="sticky top-0 z-40 bg-background/70 backdrop-blur-xl border-b border-border/50">
          <div className="flex items-center justify-between px-5 lg:px-8 py-3.5 max-w-lg lg:max-w-2xl mx-auto">
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">Cart</h1>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-col items-center justify-center py-24 px-5 max-w-lg mx-auto">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-6xl mb-5">🛒</motion.div>
          <p className="text-muted-foreground text-sm mb-5">Cart kamu masih kosong</p>
          <Button onClick={() => navigate("/menu")} className="rounded-xl shadow-md shadow-primary/20 hover:scale-[1.02] transition-all">
            Lihat Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <header className="sticky top-0 z-40 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-5 lg:px-8 py-3.5 max-w-lg lg:max-w-2xl mx-auto">
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">Cart ({totalItems})</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg lg:max-w-2xl mx-auto px-5 lg:px-8 mt-5 space-y-3">
        <AnimatePresence>
          {items.map((item) => (
            <CartItemRow key={`${item.id}-${item.variant}`} item={item} updateQty={updateQty} removeItem={removeItem} />
          ))}
        </AnimatePresence>

        {/* Checkout form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border/60 p-5 space-y-3 mt-2 shadow-sm"
        >
          <h3 className="font-semibold text-foreground text-sm">Info Pemesan</h3>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nama"
            className="w-full px-4 py-3 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <input
            value={customerWA}
            onChange={(e) => setCustomerWA(e.target.value)}
            placeholder="No. WhatsApp"
            className="w-full px-4 py-3 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Catatan (opsional)"
            rows={2}
            className="w-full px-4 py-3 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all"
          />
        </motion.div>

        {/* Total & Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border/60 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">{formatRupiah(totalPrice)}</span>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowReceipt(true)}
              variant="outline"
              className="flex-1 rounded-xl h-12 font-semibold hover:scale-[1.01] transition-all"
              disabled={!customerName || !customerWA}
            >
              <Receipt className="h-4 w-4 mr-2" />
              Lihat Struk
            </Button>
            <Button
              onClick={handleSendWA}
              className="flex-1 rounded-xl h-12 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md shadow-green-600/20 hover:scale-[1.01] transition-all"
              disabled={!customerName || !customerWA}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Kirim WA
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-sm mx-auto rounded-2xl border-border/60">
          <DialogHeader>
            <DialogTitle className="text-center text-primary font-extrabold text-xl">MamieJago</DialogTitle>
          </DialogHeader>
          <div className="text-center text-xs text-muted-foreground mb-3">
            Makanan Siap Saji Premium 🍜
          </div>
          <div className="border-t border-dashed border-border pt-3 space-y-1 text-sm">
            <p><strong>No. Pesanan:</strong> {orderId}</p>
            <p><strong>Nama:</strong> {customerName}</p>
            <p><strong>WhatsApp:</strong> {customerWA}</p>
          </div>
          <div className="border-t border-dashed border-border mt-3 pt-3 space-y-2">
            {items.map((item) => (
              <div key={`${item.id}-${item.variant}`} className="flex justify-between text-sm">
                <span>{item.name} ({item.variant}) x{item.qty}</span>
                <span className="font-medium">{formatRupiah(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-border mt-3 pt-3 flex justify-between font-bold text-base">
            <span>Total</span>
            <span className="text-primary">{formatRupiah(totalPrice)}</span>
          </div>
          {note && <p className="text-xs text-muted-foreground mt-2">📝 {note}</p>}
          <Button
            onClick={handleSendWA}
            className="w-full mt-4 rounded-xl h-12 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Kirim via WhatsApp
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function CartItemRow({
  item,
  updateQty,
  removeItem,
}: {
  item: CartItem;
  updateQty: (id: string, variant: string | undefined, qty: number) => void;
  removeItem: (id: string, variant?: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-card rounded-2xl border border-border/60 p-4 flex gap-3.5 shadow-sm"
    >
      <img src={item.image} alt={item.name} className="w-18 h-18 rounded-xl object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-foreground truncate">{item.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>
        <p className="text-primary font-bold text-sm mt-1">{formatRupiah(item.price)}</p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => removeItem(item.id, item.variant)}>
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
        </motion.button>
        <div className="flex items-center gap-2.5">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => updateQty(item.id, item.variant, item.qty - 1)}
            className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-accent transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
          </motion.button>
          <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => updateQty(item.id, item.variant, item.qty + 1)}
            className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center"
          >
            <Plus className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default Cart;
