import { useState, useEffect, useRef } from "react";
import { User, ShoppingBag, Settings, LogIn, LogOut, Camera, Lock, Save, ChevronRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProfileData {
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("display_name, avatar_url, phone")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setProfile(data);
            setEditName(data.display_name ?? "");
            setEditPhone(data.phone ?? "");
          }
        });
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error("Upload gagal", { description: uploadError.message });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const avatarUrl = urlData.publicUrl + "?t=" + Date.now();

    await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("user_id", user.id);
    setProfile((p) => p ? { ...p, avatar_url: avatarUrl } : p);
    toast.success("Foto profil berhasil diubah!");
    setUploading(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: editName.trim(), phone: editPhone.trim() })
      .eq("user_id", user.id);
    if (error) {
      toast.error("Gagal menyimpan");
    } else {
      setProfile((p) => p ? { ...p, display_name: editName.trim(), phone: editPhone.trim() } : p);
      toast.success("Profil berhasil diperbarui!");
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Password tidak cocok");
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error("Gagal mengubah password", { description: error.message });
    } else {
      toast.success("Password berhasil diubah!");
      setShowPasswordDialog(false);
      setNewPassword("");
      setConfirmPassword("");
    }
    setChangingPassword(false);
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Berhasil logout");
    navigate("/");
  };

  // Not logged in state
  if (!authLoading && !user) {
    return (
      <div className="pb-20">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
            <h1 className="text-lg font-extrabold text-foreground">Profile</h1>
            <ThemeToggle />
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-12"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <User className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-1">Belum Login</h2>
            <p className="text-sm text-muted-foreground mb-6">Masuk untuk mengakses profil kamu</p>
            <Button
              onClick={() => navigate("/auth")}
              className="rounded-xl h-12 px-8 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login / Register
            </Button>
          </motion.div>

          {/* Admin link */}
          <div className="pt-4">
            <Button
              onClick={() => navigate("/admin")}
              variant="outline"
              className="w-full rounded-xl h-11 transition-all duration-200 hover:scale-[1.01]"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Masuk sebagai Admin
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <h1 className="text-lg font-extrabold text-foreground">Profile</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 mt-6 space-y-5">
        {/* Avatar section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="relative group">
            <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
              <AvatarImage src={profile?.avatar_url ?? undefined} alt="Avatar" />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {(profile?.display_name ?? user?.email ?? "U")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
            >
              {uploading ? (
                <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <h2 className="text-lg font-bold text-foreground mt-3">{profile?.display_name ?? "User"}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </motion.div>

        {/* Edit profile form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-4 space-y-4"
        >
          <h3 className="font-semibold text-foreground text-sm">Informasi Profil</h3>

          <div className="space-y-1.5">
            <Label htmlFor="edit-name" className="text-xs">Nama</Label>
            <Input
              id="edit-name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Nama kamu"
              className="rounded-xl h-11"
              maxLength={100}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-phone" className="text-xs">No. Telepon</Label>
            <Input
              id="edit-phone"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              placeholder="+62..."
              className="rounded-xl h-11"
              maxLength={20}
            />
          </div>

          <Button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full rounded-xl h-11 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98]"
          >
            {saving ? (
              <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </motion.div>

        {/* Menu items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <button
            onClick={() => navigate("/cart")}
            className="w-full flex items-center gap-3 p-4 bg-card rounded-2xl border border-border hover:shadow-sm transition-all duration-200 hover:scale-[1.01]"
          >
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground flex-1 text-left">Pesanan Saya</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          <button
            onClick={() => setShowPasswordDialog(true)}
            className="w-full flex items-center gap-3 p-4 bg-card rounded-2xl border border-border hover:shadow-sm transition-all duration-200 hover:scale-[1.01]"
          >
            <Lock className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground flex-1 text-left">Ubah Password</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="w-full flex items-center gap-3 p-4 bg-card rounded-2xl border border-border hover:shadow-sm transition-all duration-200 hover:scale-[1.01]"
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground flex-1 text-left">Admin Panel</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full rounded-xl h-11 text-destructive border-destructive/30 hover:bg-destructive/10 transition-all duration-200 hover:scale-[1.01]"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </motion.div>
      </main>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-sm mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Ubah Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Password Baru</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="rounded-xl h-11"
                minLength={6}
                maxLength={128}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Konfirmasi Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                className="rounded-xl h-11"
                maxLength={128}
              />
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={changingPassword}
              className="w-full rounded-xl h-11"
            >
              {changingPassword ? (
                <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
              ) : "Simpan Password"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
