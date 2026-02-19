import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Banner {
  id: string;
  image_url: string;
  title: string;
  subtitle: string | null;
  is_active: boolean;
  sort_order: number;
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  const fetchBanners = async () => {
    const { data } = await supabase.from("banners").select("*").order("sort_order");
    setBanners(data ?? []);
  };

  useEffect(() => { fetchBanners(); }, []);

  const openNew = () => {
    setEditing(null);
    setTitle(""); setSubtitle(""); setImageUrl(""); setImageFile(null); setSortOrder("0");
    setOpen(true);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setTitle(b.title); setSubtitle(b.subtitle ?? ""); setImageUrl(b.image_url); setImageFile(null); setSortOrder(String(b.sort_order));
    setOpen(true);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("banner-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("banner-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let finalImageUrl = imageUrl;
      if (imageFile) finalImageUrl = await uploadImage(imageFile);

      const payload = { title, subtitle: subtitle || null, image_url: finalImageUrl, sort_order: Number(sortOrder) };

      if (editing) {
        const { error } = await supabase.from("banners").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("banners").insert(payload);
        if (error) throw error;
      }

      toast.success(editing ? "Banner diperbarui!" : "Banner ditambahkan!");
      setOpen(false);
      fetchBanners();
    } catch (err: any) {
      toast.error("Gagal menyimpan", { description: err.message });
    }
    setLoading(false);
  };

  const toggleActive = async (b: Banner) => {
    await supabase.from("banners").update({ is_active: !b.is_active }).eq("id", b.id);
    fetchBanners();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus banner ini?")) return;
    await supabase.from("banners").delete().eq("id", id);
    toast.success("Banner dihapus");
    fetchBanners();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Banner</h1>
        <Button onClick={openNew} className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Tambah
        </Button>
      </div>

      <div className="grid gap-3">
        {banners.map((b) => (
          <div key={b.id} className="bg-card border border-border rounded-2xl overflow-hidden">
            <img src={b.image_url} alt={b.title} className="w-full h-32 object-cover" />
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-foreground">{b.title}</h3>
                {b.subtitle && <p className="text-xs text-muted-foreground">{b.subtitle}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(b)} className="text-muted-foreground hover:text-foreground transition">
                  {b.is_active ? <Eye className="h-4 w-4 text-green-500" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => openEdit(b)} className="text-muted-foreground hover:text-primary transition">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(b.id)} className="text-muted-foreground hover:text-destructive transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Banner" : "Tambah Banner"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Judul</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Promo hari ini..." />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Diskon 20%..." />
            </div>
            <div className="space-y-2">
              <Label>Gambar</Label>
              <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
              {imageUrl && !imageFile && <img src={imageUrl} alt="preview" className="w-full h-24 rounded-xl object-cover" />}
            </div>
            <div className="space-y-2">
              <Label>Urutan</Label>
              <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
            </div>
            <Button onClick={handleSave} className="w-full rounded-xl" disabled={loading || !title || (!imageUrl && !imageFile)}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
