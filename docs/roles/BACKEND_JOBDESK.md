# PANDUAN KERJA & BATASAN TUGAS: BACK-END DEVELOPER
## Creatify Digital Portfolio

**Peran:** Back-end Engineer / Core & Data Implementation  
**Status:** Disetujui  
**Dokumen Acuan Utama:** `02_SRS.md`, `04_SYSTEM_DESIGN.md`, `05_DATABASE_DESIGN.md`, `07_DECISION_LOG.md`, `08_DEPLOYMENT_AND_MAINTENANCE.md`, `09_API_CONTRACT.md`

---

## 1. Ringkasan Peran & Tujuan Utama

Sebagai **Back-end Developer**, tanggung jawab utama Anda adalah membangun **lapisan data, logika bisnis, keamanan sistem, pipeline pengelolaan media, transaksi basis data relasional, serta antarmuka komunikasi (*Server Actions & REST Handlers*)** yang kokoh, teruji, dan berkinerja tinggi.

Anda bertugas menjamin bahwa setiap mutasi data yang dilakukan oleh administrator berjalan secara aman, terisolasi, dan konsisten, serta menyajikan data publik secara cepat dan teroptimasi.

---

## 2. Ruang Lingkup Pekerjaan (*In-Scope Responsibilities*)

### 2.1 Manajemen Basis Data & ORM (`prisma/` & `src/lib/db.ts`)
- **Skema Database:** Mengelola dan memelihara berkas skema [prisma/schema.prisma](../../prisma/schema.prisma) sesuai spesifikasi [05_DATABASE_DESIGN.md](../05_DATABASE_DESIGN.md).
- **Inisialisasi Singleton Prisma Client:** Membuat berkas `src/lib/db.ts` yang menginisialisasi Prisma Client secara singleton agar tidak terjadi kebocoran koneksi (*connection pool exhaustion*) pada lingkungan Next.js.
- **Eksekusi Migrasi:** Menjalankan `npx prisma migrate dev` saat membuat perubahan skema tabel di lingkungan lokal dan `npx prisma migrate deploy` di lingkungan produksi.
- **Data Seeding (`prisma/seed.ts`):** Menulis skrip inisialisasi basis data awal yang menyuntikkan:
  1. Tiga kategori bawaan: *Graphic Design*, *Social Media Content*, *Video*.
  2. Akun administrator default dengan kata sandi ter-hash secara aman.
  3. Konfigurasi awal seksi konten publik (`site_settings`) agar tidak terjadi galat *null value*.

---

### 2.2 Server Actions & Logika Bisnis (`src/actions/`)
Mengimplementasikan fungsi mutasi data di sisi server yang mematuhi standar [09_API_CONTRACT.md](../09_API_CONTRACT.md) dan mengembalikan format *Universal Response Envelope*:

1. **Modul Autentikasi (`src/actions/auth-actions.ts`):**
   - `loginAction`: Memvalidasi email & password (menggunakan Argon2id/Bcrypt), mencatat cookie sesi terenkripsi *HttpOnly*.
   - `logoutAction`: Menghanguskan cookie sesi administrator.
   - `requestPasswordResetAction`: Menghasilkan token pemulihan acak kriptografis (masa berlaku 1 jam) dan mengirimkannya via layanan email.
   - `resetPasswordAction`: Menetapkan kata sandi baru menggunakan token yang valid dan menghanguskan token setelahnya.
2. **Modul Portofolio (`src/actions/portfolio-actions.ts`):**
   - `createPortfolioItem`: Validasi input, pembuatan *slug* unik otomatis berbasis judul, penyimpanan URL media dan embed video, serta pembongkaran cache publik (`revalidatePath`).
   - `updatePortfolioItem`: Pembaruan parsial/penuh dengan kebijakan *slug immutability* (slug tidak berubah otomatis saat judul diedit untuk mencegah *broken link*).
   - `deletePortfolioItem`: Penghapusan permanen dari database yang sekaligus memicu fungsi pembersihan aset berkas di Cloud Storage menggunakan `mediaPublicId`.
   - `toggleFeaturedAction`: Validasi kuota karya unggulan (maksimal 4 karya unggulan aktif di Home).
3. **Modul Kategori (`src/actions/category-actions.ts`):**
   - `createCategory` & `updateCategory`.
   - `deleteCategoryWithMigration`: Menjalankan **transaksi atomik database** (`prisma.$transaction`):
     - Validasi proteksi: Menolak penghapusan jika total kategori di sistem ≤ 1.
     - Jika kategori memiliki karya terhubung: Memindahkan seluruh karya ke `replacementCategoryId` yang valid.
     - Menghapus kategori target setelah pemindahan berhasil.
4. **Modul Konten & Kepengurusan (`src/actions/content-actions.ts` & `member-actions.ts`):**
   - Mutasi data seksi Home, About, Rekrutmen (toggle buka/tutup & form URL), dan Kontak/Medsos ke tabel `site_settings`.
   - CRUD anggota tim pengurus, pembaruan nomor urutan tampilan (`sort_order`), dan pembersihan foto lama di Cloud Storage saat foto diganti atau anggota dihapus.

---

### 2.3 Keamanan Sistem & Middleware (`middleware.ts` & `src/lib/`)
- **Proteksi Rute CMS (`middleware.ts`):** Mencegat seluruh akses ke rute `/admin/*` (kecuali `/admin/login` dan rute reset password). Memeriksa tanda tangan cookie sesi dan melakukan redirect ke halaman login jika sesi tidak valid.
- **Validasi Skema Berlapis (`src/lib/validations.ts`):** Menulis skema validasi **Zod** untuk seluruh payload Server Actions (mencegah SQL injection, format email invalid, ukuran teks berlebih, dll.).
- **Sanitasi Pemutar Video (`src/lib/video.ts`):** Fungsi regex parser yang mengekstrak Video ID dari URL YouTube atau Vimeo, serta menghasilkan URL embed yang aman dan tervalidasi sesuai ADR-005.
- **Rate Limiting:** Mengamankan rute login dari serangan tebak kata sandi (*brute force*).

---

### 2.4 Pipeline Penyimpanan Media (`src/lib/media.ts`)
- Menghubungkan SDK Cloud Storage (Cloudinary atau Supabase Storage) menggunakan kredensial rahasia dari `.env`.
- Menyediakan fungsi upload media dengan validasi MIME type (`image/jpeg`, `image/png`, `image/webp`) dan batas ukuran maksimal (5 MB).
- Menyediakan fungsi `deleteMediaAsset(publicId: string)` untuk membersihkan berkas secara otomatis saat karya/anggota dihapus.

---

### 2.5 Operasional & Pemantauan Sistem
- **Skrip Darurat CLI (`scripts/reset-admin.ts`):** Menulis skrip terminal yang dapat dijalankan teknisi (`npm run admin:reset`) untuk mereset kata sandi admin langsung ke database lokal/server tanpa ketergantungan pada email SMTP.
- **Endpoint Healthcheck (`src/app/api/health/route.ts`):** Menyediakan rute API publik ringan untuk memantau status kesehatan koneksi database dan uptime server.

---

## 3. Batasan Tugas & Hal di Luar Lingkup (*Out-of-Scope / Hands-Off*)

Untuk menjaga pembagian kerja yang rapi, **Back-end DILARANG:**
1. **Mengubah Tata Letak Tampilan atau Styling Komponen:** Dilarang mengubah kode Tailwind, layout HTML, atau CSS di folder `src/components/public/` dan `src/components/ui/`.
2. **Mengubah Format Respon Tanpa Koordinasi:** Seluruh respon Server Actions wajib mematuhi standar *Universal Response Envelope* (`{ success, data, error }`) agar tidak merusak penanganan status di antarmuka Front-end.

---

## 4. Titik Kolaborasi dengan Front-end (*Integration Points*)

| Komponen Back-end | Pengguna di Front-end | Dokumen Acuan |
|---|---|---|
| Ekspor Server Actions di `src/actions/*` | Dipanggil langsung oleh form & tombol di komponen Front-end | [09_API_CONTRACT.md](../09_API_CONTRACT.md) |
| Definisi Tipe Data di `src/types/*` | Digunakan Front-end untuk type-safety props komponen | [05_DATABASE_DESIGN.md](../05_DATABASE_DESIGN.md) |
| Format Galat `error.details` | Dirender oleh Front-end tepat di bawah kolom input terkait | [09_API_CONTRACT.md](../09_API_CONTRACT.md) Bagian 2.3 |
| Invalidation Cache (`revalidatePath`) | Memastikan perubahan yang disimpan admin langsung muncul di halaman publik | [04_SYSTEM_DESIGN.md](../04_SYSTEM_DESIGN.md) Bagian 4.2 |

---

## 5. Standar Kualitas & Kriteria Penerimaan Back-end

- **Atomisitas Data:** Seluruh operasi yang melibatkan beberapa tabel (seperti migrasi kategori) wajib menggunakan transaksi database atomik agar tidak pernah ada data setengah tersimpan.
- **Zero Storage Leak:** Tidak ada berkas media yang tertinggal di Cloud Storage jika entitas pemiliknya telah dihapus.
- **Keamanan Kredensial:** Kata sandi wajib dihash dengan salt yang kuat; `AUTH_SECRET` dan API Keys tidak boleh bocor ke client bundle.
- **Type-Safety Penuh:** Seluruh Server Actions dan query Prisma memiliki deklarasi tipe TypeScript yang jelas tanpa menggunakan tipe `any`.

---

**Akhir dokumen `BACKEND_JOBDESK.md`**
