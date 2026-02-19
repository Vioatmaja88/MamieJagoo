import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/mock-data";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string | null;
  image_url: string | null;
  rating: number;
  is_active: boolean;
}

interface Variant {
  id: string;
  product_id: string;
  variant_name: string;
}

const CATEGORIES = ["Mie", "Wonton", "Dimsum", "Minuman"];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Record<string, Variant[]>>({});
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [variantNames, setVariantNames] = useState<string[]>([""]);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data ?? []);

    // Fetch all variants
    const { data: vData } = await supabase.from("product_variants").select("*");
    const grouped: Record<string, Variant[]> = {};
    (vData ?? []).forEach((v: Variant) => {
      if (!grouped[v.product_id]) grouped[v.product_id] = [];
      grouped[v.product_id].push(v);
    });
    setVariants(grouped);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openNew = () => {
    setEditing(null);
    setName(""); setPrice(""); setCategory(CATEGORIES[0]); setDescription(""); setImageUrl(""); setImageFile(null);
    setVariantNames([""]);
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setName(p.name); setPrice(String(p.price)); setCategory(p.category); setDescription(p.description ?? "");
    setImageUrl(p.image_url ?? ""); setImageFile(null);
    setVariantNames((variants[p.id] ?? []).map((v) => v.variant_name).concat(""));
    setOpen(true);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name,
        price: Number(price),
        category,
        description,
        image_url: finalImageUrl || null,
      };

      let productId: string;

      if (editing) {
        const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
        if (error) throw error;
        productId = editing.id;

        // Delete old variants and re-insert
        await supabase.from("product_variants").delete().eq("product_id", productId);
      } else {
        const { data, error } = await supabase.from("products").insert(payload).select("id").single();
        if (error) throw error;
        productId = data.id;
      }

      // Insert variants
      const validVariants = variantNames.filter((v) => v.trim());
      if (validVariants.length > 0) {
        await supabase.from("product_variants").insert(
          validVariants.map((v) => ({ product_id: productId, variant_name: v.trim() }))
        );
      }

      toast.success(editing ? "Produk diperbarui!" : "Produk ditambahkan!");
      setOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast.error("Gagal menyimpan", { description: err.message });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("Gagal menghapus");
    else { toast.success("Produk dihapus"); fetchProducts(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Produk</h1>
        <Button onClick={openNew} className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Tambah
        </Button>
      </div>

      <div className="grid gap-3">
        {products.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-2xl p-4 flex gap-4">
            {p.image_url && (
              <img src={p.image_url} alt={p.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm truncate">{p.name}</h3>
              <p className="text-xs text-muted-foreground">{p.category}</p>
              <p className="text-primary font-bold text-sm">{formatRupiah(p.price)}</p>
              {variants[p.id] && (
                <p className="text-xs text-muted-foreground mt-1">
                  Varian: {variants[p.id].map((v) => v.variant_name).join(", ")}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => openEdit(p)} className="text-muted-foreground hover:text-primary transition">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(p.id)} className="text-muted-foreground hover:text-destructive transition">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Produk" : "Tambah Produk"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Produk</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Mie Jebew..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Harga</Label>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="15000" />
              </div>
              <div className="space-y-2">
                <Label>Kategori</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                placeholder="Deskripsi produk..."
              />
            </div>
            <div className="space-y-2">
              <Label>Gambar</Label>
              <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
              {imageUrl && !imageFile && (
                <img src={imageUrl} alt="preview" className="w-20 h-20 rounded-xl object-cover" />
              )}
            </div>
            <div className="space-y-2">
              <Label>Varian Rasa</Label>
              {variantNames.map((v, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={v}
                    onChange={(e) => {
                      const arr = [...variantNames];
                      arr[i] = e.target.value;
                      setVariantNames(arr);
                    }}
                    placeholder="Nama varian..."
                  />
                  {variantNames.length > 1 && (
                    <button onClick={() => setVariantNames(variantNames.filter((_, j) => j !== i))}>
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setVariantNames([...variantNames, ""])}
              >
                + Tambah Varian
              </Button>
            </div>
            <Button onClick={handleSave} className="w-full rounded-xl" disabled={loading || !name || !price}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
