import { useCart, CartItem } from "@/lib/cart-context";
import { formatRupiah } from "@/lib/mock-data";
import { Minus, Plus, Trash2, MessageCircle, Receipt, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import mamiejagoLogo from "@/assets/mamiejago-logo-text.png";

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
      <div className="pb-24 min-h-screen bg-background">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
          <div className="flex items-center justify-between px-5 lg:px-8 py-4 max-w-2xl lg:max-w-3xl mx-auto">
            <h1 className="text-lg font-bold text-foreground tracking-tight">Keranjang</h1>
            <ThemeToggle />
          </div>
        </header>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-28 px-5 max-w-lg mx-auto text-center"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <ShoppingBag className="h-9 w-9 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Keranjang Kosong</h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-[260px]">Belum ada item di keranjang. Yuk pilih menu favorit kamu!</p>
          <Button onClick={() => navigate("/menu")} className="rounded-xl px-8 h-11 font-semibold shadow-sm">
            Lihat Menu
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pb-24 min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="flex items-center justify-between px-5 lg:px-8 py-4 max-w-2xl lg:max-w-3xl mx-auto">
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-bold text-foreground tracking-tight">Keranjang</h1>
            <span className="text-xs font-semibold bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full">{totalItems}</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-2xl lg:max-w-3xl mx-auto px-5 lg:px-8 py-5 space-y-4">
        {/* Cart Items */}
        <div className="space-y-3">
          <AnimatePresence>
            {items.map((item, index) => (
              <CartItemRow key={`${item.id}-${item.variant}`} item={item} updateQty={updateQty} removeItem={removeItem} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Checkout Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl border border-border/50 p-5 space-y-3.5 shadow-sm"
        >
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">1</span>
            Info Pemesan
          </h3>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nama lengkap"
            className="w-full px-4 py-3 bg-muted/60 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 border border-border/40 transition-all"
          />
          <input
            value={customerWA}
            onChange={(e) => setCustomerWA(e.target.value)}
            placeholder="No. WhatsApp (08xxx)"
            className="w-full px-4 py-3 bg-muted/60 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 border border-border/40 transition-all"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Catatan pesanan (opsional)"
            rows={2}
            className="w-full px-4 py-3 bg-muted/60 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 border border-border/40 resize-none transition-all"
          />
        </motion.div>

        {/* Summary & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Total Pembayaran</p>
              <p className="text-2xl font-extrabold text-primary">{formatRupiah(totalPrice)}</p>
            </div>
            <span className="text-xs text-muted-foreground">{totalItems} item</span>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowReceipt(true)}
              variant="outline"
              className="flex-1 rounded-xl h-12 font-semibold border-border/60"
              disabled={!customerName || !customerWA}
            >
              <Receipt className="h-4 w-4 mr-2" />
              Struk
            </Button>
            <Button
              onClick={handleSendWA}
              className="flex-1 rounded-xl h-12 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md shadow-green-600/20"
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
        <DialogContent className="max-w-sm mx-auto rounded-2xl border-border/50 p-0 overflow-hidden">
          <div className="bg-primary/5 dark:bg-primary/10 px-6 pt-6 pb-4 text-center">
            <img src={mamiejagoLogo} alt="MamieJago" className="h-10 mx-auto mb-2 object-contain" />
            <p className="text-xs text-muted-foreground">Makanan Siap Saji Premium 🍜</p>
          </div>
          <div className="px-6 pb-6 space-y-4">
            <div className="border-t border-dashed border-border pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">No. Pesanan</span>
                <span className="font-mono font-medium text-foreground">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nama</span>
                <span className="font-medium text-foreground">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">WhatsApp</span>
                <span className="font-medium text-foreground">{customerWA}</span>
              </div>
            </div>
            <div className="border-t border-dashed border-border pt-4 space-y-2.5">
              {items.map((item) => (
                <div key={`${item.id}-${item.variant}`} className="flex justify-between text-sm">
                  <span className="text-foreground">{item.name} <span className="text-muted-foreground">({item.variant}) x{item.qty}</span></span>
                  <span className="font-semibold text-foreground">{formatRupiah(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed border-border pt-4 flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-primary">{formatRupiah(totalPrice)}</span>
            </div>
            {note && <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2.5">📝 {note}</p>}
            <Button
              onClick={handleSendWA}
              className="w-full rounded-xl h-12 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Kirim via WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function CartItemRow({
  item,
  updateQty,
  removeItem,
  index,
}: {
  item: CartItem;
  updateQty: (id: string, variant: string | undefined, qty: number) => void;
  removeItem: (id: string, variant?: string) => void;
  index: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-2xl border border-border/50 p-4 flex gap-4 shadow-sm"
    >
      <img src={item.image} alt={item.name} className="w-[72px] h-[72px] rounded-xl object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm text-foreground truncate">{item.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>
        </div>
        <p className="text-primary font-bold text-sm">{formatRupiah(item.price)}</p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => removeItem(item.id, item.variant)} className="p-1 rounded-lg hover:bg-destructive/10 transition-colors">
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
        </motion.button>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => updateQty(item.id, item.variant, item.qty - 1)}
            className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-accent transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
          </motion.button>
          <span className="text-sm font-bold w-5 text-center text-foreground">{item.qty}</span>
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
