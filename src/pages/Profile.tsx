import { User, ShoppingBag, Settings, LogIn } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <h1 className="text-lg font-extrabold text-foreground">Profile</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 mt-6 space-y-4">
        {/* Avatar placeholder */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <User className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Customer</h2>
          <p className="text-sm text-muted-foreground">Selamat datang di MamieJago!</p>
        </div>

        {/* Menu items */}
        <div className="space-y-2">
          <button
            onClick={() => navigate("/cart")}
            className="w-full flex items-center gap-3 p-4 bg-card rounded-2xl border border-border hover:shadow-sm transition"
          >
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Pesanan Saya</span>
          </button>
          <button className="w-full flex items-center gap-3 p-4 bg-card rounded-2xl border border-border hover:shadow-sm transition">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Pengaturan</span>
          </button>
        </div>

        {/* Admin link */}
        <div className="pt-4">
          <Button
            onClick={() => navigate("/admin")}
            variant="outline"
            className="w-full rounded-xl h-11"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Masuk sebagai Admin
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
