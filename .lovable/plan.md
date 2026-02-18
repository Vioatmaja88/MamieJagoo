

# 🍜 MamieJago — Website Jualan Makanan Siap Saji

## Ringkasan
Website mobile-first untuk jualan Mie Jebew, Wonton, Dimsum, dan menu sejenis. Desain premium merah-putih-kuning dengan dark mode, admin panel lengkap, dan checkout via WhatsApp. Backend menggunakan Lovable Cloud (Supabase).

---

## 🎨 Desain & Tema
- **Warna dominan**: Merah premium, putih bersih, kuning hangat sebagai aksen
- **Dark mode**: Merah gelap premium dengan transisi smooth 200–300ms
- **Font**: Modern sans-serif, clean dan mudah dibaca
- **Style**: Mobile-app style seperti RumahOTP — rounded cards, shadow lembut, spacing konsisten
- **Toggle tema** tersimpan di localStorage

---

## 📱 Halaman Customer

### 1. Home
- **Banner slider** full-width dengan auto-slide (3–5 detik), swipe manual, indicator dot/oval
- Overlay teks promo + tombol "Pesan Sekarang"
- **Kategori produk** (Mie, Wonton, Dimsum, dll)
- **Grid produk populer** — card modern dengan gambar, nama, harga, rating

### 2. Menu
- Semua produk dalam grid, filter berdasarkan kategori
- Card produk: gambar, nama, harga, rating, varian rasa
- Klik card → halaman detail produk

### 3. Detail Produk
- Layout gambar besar + info lengkap
- Pilihan **varian rasa** dan **level pedas** (opsional)
- Tombol "Tambah ke Cart" dan "Pesan via WhatsApp"

### 4. Cart
- Slide panel / modal modern
- Update qty, hapus item, total realtime
- Data disimpan di **localStorage**
- Form checkout: Nama, WhatsApp, Catatan
- Tombol "Lihat Struk" → tampilan struk bersih (logo, nomor pesanan unik, detail, total)
- Tombol "Kirim ke Penjual" → buka WhatsApp dengan pesan pre-formatted

### 5. Review
- Halaman ulasan dari pelanggan
- Rating bintang + komentar

### 6. Profile
- Halaman sederhana (info customer, riwayat pesanan lokal)

### 7. Bottom Navigation Bar
- Fixed di bawah: **Home, Menu, Cart, Review, Profile**
- Icon + teks kecil, active state merah
- Badge jumlah item di ikon Cart
- Shadow ke atas

---

## 🔐 Admin Panel

### Autentikasi
- Login admin menggunakan **Supabase Auth** (email + password)
- Role-based access control (tabel `user_roles` terpisah)

### Dashboard
- Desain SaaS modern dengan **sidebar kiri**
- Menu: Dashboard, Produk, Banner, Review, Logout

### Fitur Admin
- **Produk**: Tambah / Edit / Hapus produk, upload gambar (Supabase Storage), kelola varian rasa, harga, deskripsi
- **Banner**: Upload & edit banner promo
- **Review**: Moderasi ulasan pelanggan
- Ikon menggunakan **Lucide Icons**

---

## ⚙️ Backend (Lovable Cloud / Supabase)

### Database Tables
- `products` — data produk (nama, harga, deskripsi, kategori, rating)
- `product_variants` — varian rasa per produk
- `banners` — banner promo
- `reviews` — ulasan pelanggan
- `user_roles` — role admin (terpisah dari auth)

### Storage
- Bucket untuk gambar produk dan banner

### Security
- RLS policies untuk akses data
- Admin-only access untuk operasi CRUD

---

## 📋 Urutan Implementasi

1. **Setup tema & design system** — warna merah premium, dark mode, animasi
2. **Layout utama** — bottom nav, routing halaman
3. **Home page** — banner slider dengan auto-slide & indicator
4. **Menu & detail produk** — grid produk, halaman detail, varian
5. **Cart & checkout** — localStorage cart, struk, WhatsApp integration
6. **Review & Profile** — halaman ulasan dan profil sederhana
7. **Backend setup** — database tables, storage bucket, RLS
8. **Admin panel** — login, dashboard, CRUD produk/banner/review
9. **Polish** — animasi, transisi, responsive fine-tuning

