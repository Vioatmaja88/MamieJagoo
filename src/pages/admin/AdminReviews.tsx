import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const fetchReviews = async () => {
    let q = supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (filter === "pending") q = q.eq("is_approved", false);
    if (filter === "approved") q = q.eq("is_approved", true);
    const { data } = await q;
    setReviews(data ?? []);
  };

  useEffect(() => { fetchReviews(); }, [filter]);

  const toggleApprove = async (r: Review) => {
    await supabase.from("reviews").update({ is_approved: !r.is_approved }).eq("id", r.id);
    toast.success(r.is_approved ? "Review dibatalkan" : "Review disetujui");
    fetchReviews();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus review ini?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    toast.success("Review dihapus");
    fetchReviews();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Review</h1>
        <div className="flex gap-2">
          {(["all", "pending", "approved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {f === "all" ? "Semua" : f === "pending" ? "Pending" : "Approved"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {reviews.map((r) => (
          <div key={r.id} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {r.customer_name[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{r.customer_name}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`h-3 w-3 ${j < r.rating ? "fill-secondary text-secondary" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  r.is_approved ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}>
                  {r.is_approved ? "Approved" : "Pending"}
                </span>
              </div>
            </div>
            {r.comment && <p className="text-sm text-muted-foreground mt-2">{r.comment}</p>}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => toggleApprove(r)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  r.is_approved
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                }`}
              >
                {r.is_approved ? <X className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                {r.is_approved ? "Batalkan" : "Setujui"}
              </button>
              <button
                onClick={() => handleDelete(r.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-destructive/10 text-destructive transition"
              >
                <Trash2 className="h-3 w-3" />
                Hapus
              </button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-muted-foreground py-8 text-sm">Tidak ada review.</p>
        )}
      </div>
    </div>
  );
}
