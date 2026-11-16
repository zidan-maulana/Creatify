# Creatify — Digital Portfolio & Creative CMS

<p align="center">
  <strong>Website portofolio digital dan Content Management System (CMS) resmi tim kreatif Fakultas Ilmu Komputer, Universitas Mercu Buana.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.4.3-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.3.0-blue?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-7.10-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

---

## 🌟 Fitur Utama

### 🎨 Antarmuka Publik (*Public Interface*)
- **Fluid & Responsive Design**: Komposisi layout adaptif dari perangkat mobile layar kecil (320px) hingga layar desktop ultra-wide (1440px+).
- **Cinematic Hero Showcase**: Transisi video hybrid (YouTube embed & file upload) dengan efek parallax dinamis dan micro-interactions.
- **Direktori Tim Interaktif**: Halaman pengurus (`/team`) dengan filter dropdown divisi mobile, badge tabs desktop, kutipan personal, dan foto profil teroptimasi.
- **Animasi Halus & Aksesibel**: Entrance animations dengan kurva cubic-bezier kustom, *ScrollReveal* berbasis `IntersectionObserver` singleton, serta dukungan penuh `prefers-reduced-motion`.

### ⚡ Dashboard CMS Administrator (`/admin`)
- **Autentikasi Sesi Aman**: Proteksi rute berbasis JWT terenkripsi (*jose*), cookie sesi `HttpOnly` + `SameSite=Lax`, dan middleware server-side.
- **Live Content Management**: Pengelolaan dinamis konten seksi Hero, Tentang Kami, Layanan, FAQ, status Rekrutmen, dan informasi kontak resmi.
- **Manajemen Portofolio & Kategori**: CRUD portofolio karya multi-kategori dengan pembuat slug otomatis, thumbnail generator, dan proteksi transaksi atomik saat penghapusan kategori.
- **Editor Gambar & Crop Interaktif**: Modal pemotong (*crop*), *pan*, dan *zoom* gambar terintegrasi untuk menjaga rasio foto pengurus dan karya tetap presisi.
- **Proteksi Data Belum Tersimpan**: *Unsaved changes detector* dan *navigation guard* untuk mencegah administrator kehilangan perubahan data yang belum disimpan.
- **Pipeline Media Anti-Bocor (*Zero Storage Leak*)**: Sinkronisasi aset media ke Cloudinary dan local storage dengan pembersihan berkas otomatis saat gambar diperbarui atau dihapus.

---

## 🛠️ Arsitektur & Teknologi

| Lapisan | Teknologi | Deskripsi |
|---|---|---|
| **Framework Full-Stack** | Next.js 16 (App Router) | Server Components (RSC), Server Actions, dan Route Handlers |
| **Bahasa Pemrograman** | TypeScript 5.x | *Strict type-safety* menyeluruh dari skema basis data hingga komponen antarmuka |
| **Styling & Desain** | Tailwind CSS v4 & Lucide React | Sistem utilitas modern, transisi responsif, dan ikonografi vektor |
| **Basis Data & ORM** | PostgreSQL 16 & Prisma ORM 7 | Skema relasional, adapter koneksi teroptimasi (*pg pool*), dan migrasi terversi |
| **Autentikasi & Keamanan** | Bcrypt.js & Jose | Hashing kata sandi *salt rounds 12* dan penandatanganan token sesi JWT |
| **Validasi Skema** | Zod | Validasi ketat pada setiap masukan form, Server Actions, dan REST endpoints |
| **Penyimpanan Media** | Cloudinary / Local Uploads | Transformasi WebP otomatis, global CDN, serta fallback penyimpanan lokal |
| **Deployment** | Vercel & Supabase | Serverless edge deployment dan database PostgreSQL cloud |

---

## 📁 Struktur Direktori

```text
├── prisma/                    # Skema basis data relasional, migrasi, dan seeder
│   ├── migrations/            # Riwayat migrasi PostgreSQL
│   ├── schema.prisma          # Definisi model Prisma
│   └── seed.ts                # Seeder data awal (admin, kategori, anggota tim)
├── public/                    # Aset statis publik (logo SVG vektor, favicon, gambar)
├── scripts/                   # Skrip operasional darurat (reset kata sandi admin CLI)
├── src/
│   ├── actions/               # Next.js Server Actions (Auth, Portofolio, Tim, CMS, Media)
│   ├── app/                   # App Router: Rute publik, dashboard admin, dan REST API
│   │   ├── admin/             # Dashboard CMS internal (/admin, /admin/login, /admin/team)
│   │   ├── api/               # Endpoint REST API publik dan internal
│   │   ├── team/              # Halaman publik kepengurusan tim
│   │   ├── layout.tsx         # Root layout aplikasi publik
│   │   └── page.tsx           # Halaman utama landing page
│   ├── components/            # Komponen React modular
│   │   ├── admin/             # Komponen editor CMS, modal crop, dan shell dashboard
│   │   ├── public/            # Seksi landing page (Hero, About, Services, Team, FAQ)
│   │   └── ui/                # Komponen atomik (ScrollReveal, ArrowBadge, Buttons)
│   ├── config/                # Konfigurasi konten default dan batas masukan form
│   ├── data/                  # Data statis awal dan referensi divisi
│   ├── lib/                   # Utilitas inti (db client singleton, auth, media, video sanitizer)
│   ├── middleware.ts          # Proteksi rute admin berbasis Next.js middleware
│   └── types/                 # Definisi tipe TypeScript dan format respon API
├── docker-compose.yml         # Konfigurasi container PostgreSQL lokal
└── package.json               # Konfigurasi proyek dan skrip build
```

---

## 🚀 Memulai Pengembangan (*Quick Start*)

### 1. Prasyarat
- **Node.js**: Versi `20.x` atau lebih baru
- **NPM**: Versi `10.x` atau lebih baru
- **Basis Data**: PostgreSQL 16 (Lokal via Docker Desktop atau Cloud via Supabase)

### 2. Kloning Repositori & Instalasi
```bash
git clone https://github.com/zidan-maulana/Creatify.git
cd Creatify
npm install
```

### 3. Konfigurasi Variabel Lingkungan
Salin berkas template environment:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi pada `.env` (koneksi database dan `AUTH_SECRET`).

### 4. Migrasi & Seeding Basis Data
Jalankan migrasi skema tabel dan suntikkan data awal:
```bash
# Menjalankan migrasi skema database
npx prisma migrate deploy

# Mengisi akun admin awal dan data default
npx prisma db seed
```

> **Akun Administrator Default:**  
> Email: `admin@creatify.fasilkom.ac.id`  
> Password: `PasswordSuperAman123!`

### 5. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada peramban Anda. Dashboard CMS dapat diakses melalui [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## 📜 Perintah yang Tersedia (*Available Scripts*)

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Menjalankan server pengembangan Next.js dengan Turbopack |
| `npm run build` | Melakukan kompilasi produksi dan optimasi static pages |
| `npm run start` | Menjalankan server aplikasi Next.js mode produksi |
| `npm run type-check` | Menjalankan validasi tipe TypeScript (`tsc --noEmit`) |
| `npm run lint` | Menjalankan analisis kualitas kode dengan ESLint |
| `npm run db:seed` | Menjalankan seeder basis data awal via Prisma |
| `npm run admin:reset` | CLI pemulihan darurat untuk mereset kata sandi administrator |

---

<p align="center">
  Dikembangkan dengan penuh dedikasi oleh <strong>Creatify</strong> — Fakultas Ilmu Komputer, Universitas Mercu Buana.
</p>
