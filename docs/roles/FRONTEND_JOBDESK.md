# PANDUAN KERJA & BATASAN TUGAS: FRONT-END DEVELOPER
## Creatify Digital Portfolio

**Peran:** Front-end Engineer / UI-UX Implementation  
**Status:** Disetujui  
**Dokumen Acuan Utama:** `01_PRD.md`, `03_INFORMATION_ARCHITECTURE.md`, `06_CMS_SPECIFICATION.md`, `09_API_CONTRACT.md`

---

## 1. Ringkasan Peran & Tujuan Utama

Sebagai **Front-end Developer**, tanggung jawab utama Anda adalah menerjemahkan spesifikasi produk dan kebutuhan pengguna menjadi antarmuka web yang **estetis, cepat, interaktif, responsif sempurna di perangkat mobile dan desktop, serta ramah SEO**. 

Anda bertugas membangun dua sisi antarmuka:
1. **Website Publik:** Etalase portofolio yang memikat civitas akademika dan memproyeksikan citra profesional Creatify sebagai tim kreatif fakultas.
2. **Dashboard CMS:** Ruang kerja administrator yang bersih, intuitif, minim distraksi, dan memberikan umpan balik interaksi yang jelas saat mengelola konten.

---

## 2. Ruang Lingkup Pekerjaan (*In-Scope Responsibilities*)

### 2.1 Pustaka Komponen UI Atomik (`src/components/ui/`)
Membangun pondasi komponen antarmuka yang dapat digunakan kembali (*reusable atomic components*) menggunakan Tailwind CSS dan ikon Lucide:
- **Button:** Varian Primary, Secondary, Outline, Ghost, Danger, serta status *loading spinner*.
- **Input & Textarea:** Mendukung status fokus, teks bantuan (*helper text*), dan pesan galat (*field-level validation error*).
- **Badge / Tag:** Penanda status rekrutmen (Dibuka/Ditutup), kategori karya, dan tipe media (Gambar/Video).
- **Modal / Dialog:** Komponen *dialog overlay* untuk formulir *pop-up* dan konfirmasi aksi destruktif.
- **Card:** Kontainer kartu untuk karya galeri, profil anggota, dan kartu metrik statistik dashboard.
- **Toast / Alert Notification:** Notifikasi mengambang untuk umpan balik aksi simpan/hapus.
- **Skeleton Loader:** Komponen penampung sementara saat data sedang dimuat dari server.

---

### 2.2 Website Publik (`src/app/(public)/` & `src/components/public/`)
Mengembangkan seluruh halaman publik sesuai [03_INFORMATION_ARCHITECTURE.md](../03_INFORMATION_ARCHITECTURE.md):
1. **Layout Publik (`layout.tsx`):**
   - Header & Navigasi Utama: Logo resmi, menu navigasi aktif, dan menu drawer responsif pada perangkat seluler.
   - Footer: Informasi identitas, hak cipta, dan kanal media sosial resmi.
2. **Halaman Home (`page.tsx`):**
   - Seksi Hero: Headline, pengantar tim, dan tombol CTA utama.
   - Seksi Karya Unggulan: Grid responsif menampilkan maksimal 4 karya unggulan yang dipilih admin.
   - Seksi Kategori Portofolio: Kartu navigasi cepat menuju galeri dengan filter kategori terkait.
   - Seksi CTA Rekrutmen: Ajakan bergabung ke Creatify.
3. **Halaman About (`about/page.tsx`):**
   - Seksi Profil & Visi Tim: Narasi peran Creatify dalam komunikasi visual fakultas.
   - Seksi Kepengurusan & Anggota: Grid kartu anggota memuat foto rasio 1:1, nama lengkap, jabatan, yang tersusun rapi sesuai urutan nomor urut manual.
4. **Halaman Galeri Portofolio (`portfolio/page.tsx`):**
   - Bilah Filter Kategori (*Category Filter Bar*): Tombol "Semua" dan kategori dinamis dari database. Menerima query URL `?category=[slug]` dari halaman Home.
   - Grid Galeri: Kartu karya interaktif dengan gambar thumbnail dan judul.
   - Keadaan Kosong (*Empty State*): Pesan informatif jika belum ada karya pada kategori terpilih.
5. **Halaman Detail Karya (`portfolio/[slug]/page.tsx`):**
   - Tampilan media utama: Gambar resolusi tinggi proporsional atau pemutar video responsif (YouTube / Vimeo embed).
   - Judul, label kategori, deskripsi singkat, tahun publikasi, dan tautan ke konten asli.
   - Tombol kembali ke galeri (`← Kembali ke Portofolio`).
   - Tampilan halaman 404 ramah pengguna jika karya tidak ditemukan.
6. **Halaman Join Creatify (`join/page.tsx`):**
   - Informasi rekrutmen terbuka/tertutup.
   - Indikator status: Jika dibuka, tampilkan tombol pendaftaran eksternal (Google Form); jika ditutup, sembunyikan tombol pendaftaran.
7. **Halaman Contact (`contact/page.tsx`):**
   - Kartu kontak resmi: Instagram, Email resmi fakultas, dan TikTok.

---

### 2.3 Antarmuka CMS Administrator (`src/app/admin/` & `src/components/admin/`)
Mengembangkan antarmuka dashboard sesuai spesifikasi [06_CMS_SPECIFICATION.md](../06_CMS_SPECIFICATION.md):
1. **Autentikasi UI:**
   - Halaman Login (`/admin/login`): Form email, password, toggle intip password, pesan galat aman.
   - Halaman Lupa & Reset Password (`/admin/forgot-password`, `/admin/reset-password`).
2. **Layout Dashboard (`/admin/(dashboard)/layout.tsx`):**
   - Sidebar navigasi tetap di desktop dan laci geser (*mobile drawer*) di perangkat seluler.
   - Topbar: Breadcrumbs dinamis, tombol pintas "Lihat Website", dan tombol Logout.
3. **Modul Dashboard Overview (`/admin`):**
   - Kartu statistik total karya, kategori, dan anggota.
   - Widget status rekrutmen dan karya unggulan aktif.
4. **Modul Portofolio (`/admin/portfolio`):**
   - Tabel data karya dengan pencarian instan dan filter kategori.
   - Formulir Tambah/Edit: Input judul (auto-slug), pilih kategori, switch gambar/video, dropzone upload gambar dengan pratinjau instan, input URL video dengan pratinjau live embed, checkbox karya unggulan.
   - Modal konfirmasi hapus permanen.
5. **Modul Kategori (`/admin/portfolio/categories`):**
   - Tabel kategori dan modal tambah/edit kategori.
   - Modal hapus kategori terproteksi: Mewajibkan pemilihan kategori pengganti jika kategori masih menaungi karya. Menonaktifkan tombol jika kategori tersisa ≤ 1.
6. **Modul Konten & Kepengurusan:**
   - Editor Konten Home, About, dan Info Rekrutmen.
   - Editor Anggota Tim: Tabel anggota dengan kontrol pengurutan manual (*sort order*) dan modal tambah/edit foto.
   - Editor Kontak & Media Sosial.
   - Pengaturan Akun: Formulir ganti email dan ganti kata sandi.

---

## 3. Batasan Tugas & Hal di Luar Lingkup (*Out-of-Scope / Hands-Off*)

Untuk mencegah konflik kode dan menjaga integritas arsitektur, **Front-end DILARANG:**
1. **Menulis Query SQL / Prisma Langsung di Komponen Klien:** Seluruh interaksi basis data harus memanggil Server Actions atau API Route yang disediakan Back-end.
2. **Mengubah Struktur Skema Database (`prisma/schema.prisma`):** Jika membutuhkan field data baru, diskusikan terlebih dahulu dengan Back-end untuk pembaruan skema.
3. **Mengimplementasikan Logika Enkripsi Sesi / Password Hashing Manual:** Logika verifikasi password dan enkripsi cookie sesi ditangani sepenuhnya di sisi Server Actions oleh Back-end.
4. **Memanggil Cloud Storage SDK Langsung dari Komponen:** Unggahan berkas dikirimkan melalui Server Action atau endpoint upload yang memvalidasi berkas di server.

---

## 4. Titik Kolaborasi dengan Back-end (*Integration Points*)

| Komponen Front-end | Titik Kontak Back-end | Dokumen Acuan |
|---|---|---|
| Formulir & Mutasi Data | Memanggil fungsi dari `src/actions/*` | [09_API_CONTRACT.md](../09_API_CONTRACT.md) |
| Tipe Data Data-Binding | Mengimpor tipe TypeScript dari `src/types/*` | [05_DATABASE_DESIGN.md](../05_DATABASE_DESIGN.md) |
| Umpan Balik Validasi Form | Menggunakan field `error.details` dari respon Server Action | [09_API_CONTRACT.md](../09_API_CONTRACT.md) Bagian 2.3 |
| Media Upload | Mengirim `FormData` ke Server Action upload media | [09_API_CONTRACT.md](../09_API_CONTRACT.md) Bagian 7 |

---

## 5. Standar Kualitas & Kriteria Penerimaan Front-end

- **Responsivitas Layar:** Tampilan harus nyaman dan fungsional di layar seluler (360px+), tablet (768px+), dan desktop (1024px–1920px).
- **Aksesibilitas & Semantik:** Menggunakan elemen HTML5 semantik (`<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`), kontras warna yang nyaman, serta teks alternatif (`alt`) pada seluruh gambar.
- **Bebas Galat Kompilasi:** Lolos pemeriksaan `npm run lint` dan `npm run build` tanpa peringatan *type error*.
- **UX Form:** Masukan yang sudah diketik oleh admin tidak boleh hilang jika terjadi galat validasi (*resilient input retention*).

---

**Akhir dokumen `FRONTEND_JOBDESK.md`**
