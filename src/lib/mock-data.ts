export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: number;
  variants: string[];
  spiceLevels?: string[];
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

export const categories = ["Semua", "Mie", "Wonton", "Dimsum", "Minuman"];

export const banners: Banner[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=400&fit=crop",
    title: "Mie Jebew Pedas Nampol 🔥",
    subtitle: "Diskon 20% untuk pembelian pertama!",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&h=400&fit=crop",
    title: "Dimsum Premium Homemade",
    subtitle: "Fresh setiap hari, pesan sekarang!",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1552611052-33e04de886c0?w=800&h=400&fit=crop",
    title: "Wonton Kuah Spesial 🍜",
    subtitle: "Beli 2 gratis 1 — cuma hari ini!",
  },
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Mie Jebew Original",
    price: 15000,
    category: "Mie",
    description: "Mie pedas khas MamieJago dengan bumbu rahasia yang bikin nagih. Tekstur mie kenyal dengan topping lengkap.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop",
    rating: 4.8,
    variants: ["Original", "Keju", "Seaweed"],
    spiceLevels: ["Tidak Pedas", "Pedas", "Extra Pedas", "Pedas Nampol"],
  },
  {
    id: "p2",
    name: "Mie Jebew Carbonara",
    price: 18000,
    category: "Mie",
    description: "Perpaduan unik mie jebew dengan saus carbonara creamy. Comfort food level premium!",
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop",
    rating: 4.6,
    variants: ["Carbonara", "Carbonara Keju"],
    spiceLevels: ["Tidak Pedas", "Pedas", "Extra Pedas"],
  },
  {
    id: "p3",
    name: "Dimsum Ayam",
    price: 12000,
    category: "Dimsum",
    description: "Dimsum ayam homemade isi 4 pcs. Kulit lembut, isian juicy.",
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=400&fit=crop",
    rating: 4.7,
    variants: ["Ayam", "Ayam Udang"],
  },
  {
    id: "p4",
    name: "Dimsum Udang",
    price: 14000,
    category: "Dimsum",
    description: "Dimsum premium dengan udang segar pilihan. Isi 4 pcs per porsi.",
    image: "https://images.unsplash.com/photo-1576577445504-6af96477db52?w=400&h=400&fit=crop",
    rating: 4.9,
    variants: ["Original", "Mayo"],
  },
  {
    id: "p5",
    name: "Wonton Kuah",
    price: 13000,
    category: "Wonton",
    description: "Wonton kuah bening dengan isian daging ayam cincang. Hangat dan menyegarkan.",
    image: "https://images.unsplash.com/photo-1552611052-33e04de886c0?w=400&h=400&fit=crop",
    rating: 4.5,
    variants: ["Kuah Bening", "Kuah Pedas"],
    spiceLevels: ["Tidak Pedas", "Pedas"],
  },
  {
    id: "p6",
    name: "Wonton Goreng",
    price: 12000,
    category: "Wonton",
    description: "Wonton goreng crispy dengan saus cocol spesial. Isi 6 pcs.",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop",
    rating: 4.4,
    variants: ["Original", "Keju"],
  },
  {
    id: "p7",
    name: "Es Teh Manis",
    price: 5000,
    category: "Minuman",
    description: "Es teh manis segar, teman sempurna untuk semua menu MamieJago.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
    rating: 4.3,
    variants: ["Manis", "Less Sugar"],
  },
  {
    id: "p8",
    name: "Es Jeruk Segar",
    price: 7000,
    category: "Minuman",
    description: "Jeruk peras segar dengan es batu. Vitamin C tinggi!",
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=400&fit=crop",
    rating: 4.6,
    variants: ["Original", "Madu"],
  },
];

export const mockReviews = [
  { id: "r1", name: "Aisyah", rating: 5, comment: "Mie Jebew nya enak banget! Pedas tapi nagih 🔥", date: "2025-02-10" },
  { id: "r2", name: "Budi S.", rating: 4, comment: "Dimsum ayamnya lembut, next order lagi.", date: "2025-02-08" },
  { id: "r3", name: "Citra W.", rating: 5, comment: "Wonton kuahnya seger! Recommended banget.", date: "2025-02-05" },
  { id: "r4", name: "Dimas P.", rating: 4, comment: "Porsinya pas, harga terjangkau. Mantap!", date: "2025-01-30" },
  { id: "r5", name: "Eva R.", rating: 5, comment: "Suka banget sama Mie Jebew Carbonara! Unik dan creamy.", date: "2025-01-28" },
];

export function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}
