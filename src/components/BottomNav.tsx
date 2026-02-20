import { Home, UtensilsCrossed, ShoppingCart, Star, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/lib/cart-context";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/menu", icon: UtensilsCrossed, label: "Menu" },
  { path: "/cart", icon: ShoppingCart, label: "Cart" },
  { path: "/review", icon: Star, label: "Review" },
  { path: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();

  // Hide bottom nav on admin pages
  if (location.pathname.startsWith("/admin") || location.pathname === "/auth") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card shadow-nav border-t border-border">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full"
            >
              <div className="relative">
                <item.icon
                  className={`h-5 w-5 transition-colors duration-200 ${active ? "text-primary" : "text-muted-foreground"}`}
                />
                {item.label === "Cart" && totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                {item.label}
              </span>
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
