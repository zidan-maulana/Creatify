# Architecture Decision Log (ADR)
## Creatify Digital Portfolio

**Versi:** 1.0  
**Status:** Disetujui  
**Dokumen Acuan:** `00_PROJECT_BRIEF.md`, `01_PRD.md`, `02_SRS.md`, `03_INFORMATION_ARCHITECTURE.md`

---

## 1. Pengantar

Dokumen *Decision Log* ini mencatat seluruh keputusan arsitektural dan teknis penting yang telah disepakati untuk proyek **Creatify Digital Portfolio**. Format pencatatan mengikuti standar *Architecture Decision Record* (ADR) yang mencakup konteks, keputusan yang diambil, status, serta konsekuensi teknisnya.

Setiap keputusan di sini menjadi acuan dasar bagi dokumen:
- `04_SYSTEM_DESIGN.md` (Desain Arsitektur Sistem)
- `05_DATABASE_DESIGN.md` (Desain Basis Data)
- `06_CMS_SPECIFICATION.md` (Spesifikasi CMS)
- `08_DEPLOYMENT_AND_MAINTENANCE.md` (Panduan Deployment & Pemeliharaan)

---

## 2. Indeks Keputusan (ADR Index)

| ID | Judul Keputusan | Status | Tanggal |
|---|---|---|---|
| **ADR-001** | Pemilihan Full-Stack Framework: Next.js (App Router) & TypeScript | Disetujui | 2026-10-26 |
| **ADR-002** | Pemilihan Basis Data & ORM: PostgreSQL & Prisma ORM | Disetujui | 2026-10-26 |
| **ADR-003** | Mekanisme Autentikasi Administrator & Session Management | Disetujui | 2026-10-26 |
| **ADR-004** | Strategi Pengelolaan & Penyimpanan Aset Media (Cloud Storage + CDN) | Disetujui | 2026-10-26 |
| **ADR-005** | Penanganan Pemutar Video Eksternal & Pencegahan XSS | Disetujui | 2026-10-26 |
| **ADR-006** | Skema Routing Portofolio & Kebijakan URL Slug | Disetujui | 2026-10-26 |
| **ADR-007** | Batasan Kuota Karya Unggulan di Halaman Home | Disetujui | 2026-10-26 |
| **ADR-008** | Aturan Integritas Data & Proteksi Kategori Tunggal | Disetujui | 2026-10-26 |
| **ADR-009** | Mekanisme Pemulihan Akses Darurat Akun Administrator | Disetujui | 2026-10-26 |

---

## 3. Rincian Architecture Decision Records

### ADR-001: Pemilihan Full-Stack Framework (Next.js App Router & TypeScript)

* **Status:** Disetujui
* **Konteks:**
  - Proyek membutuhkan website publik yang sangat cepat, memiliki SEO prima untuk civitas akademika, dan tampilan visual interaktif.
  - Proyek juga membutuhkan antarmuka CMS yang terlindungi autentikasi untuk memanipulasi data tanpa perlu memelihara dua repositori dan server terpisah (frontend dan backend API terpisah akan membebani operasional tim mahasiswa).
* **Keputusan:**
  - Menggunakan **Next.js (App Router)** dengan bahasa **TypeScript**.
  - Halaman publik memanfaatkan *Server-Side Rendering (SSR)* atau *Incremental Static Regeneration (ISR)* untuk kecepatan pemuatan instan dan skor Core Web Vitals optimal.
  - CMS memanfaatkan *Server Actions* / Route Handlers bawaan Next.js untuk mutasi data yang aman dengan proteksi sesi di *Middleware*.
* **Konsekuensi:**
  - **Positif:** Satu repositori terpadu (*monolith modern*), tipe data end-to-end (type-safety), kemudahan deployment di Vercel atau server mandiri dengan Docker, performa gambar otomatis dengan `next/image`.
  - **Tantangan:** Memerlukan pemahaman paradigma React Server Components (RSC) vs Client Components.

---

### ADR-002: Pemilihan Basis Data & ORM (PostgreSQL & Prisma)

* **Status:** Disetujui
* **Konteks:**
  - Data yang dikelola bersifat relasional kuat: Karya terikat pada Kategori, anggota memiliki urutan, konten halaman terstruktur, dan integritas data mutlak diutamakan (terutama aturan migrasi karya saat kategori dihapus).
* **Keputusan:**
  - Menggunakan **PostgreSQL** sebagai sistem basis data relasional utama (RDBMS).
  - Menggunakan **Prisma ORM** sebagai lapisan abstraksi data dan pengelola migrasi skema database.
* **Konsekuensi:**
  - **Positif:** Mendukung transaksi atomik (sangat penting untuk alur migrasi kategori di SRS FR-029), skema deklaratif yang mudah dipelihara di file `schema.prisma`, serta integrasi mudah ke penyedia DB cloud terkelola (Supabase, Neon, atau Railway).
  - **Tantangan:** Membutuhkan langkah build `prisma generate` dalam siklus CI/CD.

---

### ADR-003: Mekanisme Autentikasi Administrator & Session Management

* **Status:** Disetujui
* **Konteks:**
  - Sistem hanya memiliki **satu akun administrator utama (Single-admin)** pada MVP.
  - Tidak diperlukan registrasi publik maupun sistem otorisasi multi-role yang rumit.
  - Keamanan sesi harus tahan terhadap serangan XSS dan CSRF.
* **Keputusan:**
  - Menggunakan sesi berbasis cookie terenkripsi (*encrypted session cookie*) dengan atribut `httpOnly: true`, `secure: true` (saat production), dan `sameSite: "lax" / "strict"`.
  - Kata sandi di-*hash* menggunakan algoritma modern standar industri (**Argon2id** atau **Bcrypt** dengan salt rounds minimal 12).
  - Next.js Middleware memeriksa validitas sesi pada semua rute berawalan `/admin/*` (kecuali `/admin/login` dan `/admin/forgot-password`).
* **Konsekuensi:**
  - **Positif:** Ringan, tidak memerlukan tabel sesi terpisah yang membebani database, kebal dari pembajakan skrip klien (XSS).
  - **Tantangan:** Invalidasi sesi dilakukan dengan menghapus cookie atau memutar *secret key*.

---

### ADR-004: Strategi Pengelolaan & Penyimpanan Aset Media (Cloud Storage + CDN)

* **Status:** Disetujui
* **Konteks:**
  - Website portofolio kreatif memuat banyak gambar beresolusi tinggi (karya desain grafis, foto pengurus).
  - Lingkungan hosting serverless/PaaS (seperti Vercel) memiliki sistem berkas sementara (*ephemeral*), sehingga unggahan gambar tidak boleh disimpan langsung di disk lokal server.
* **Keputusan:**
  - Menggunakan **Cloud Storage dengan CDN** (opsi utama: **Cloudinary** atau **Supabase Storage / S3 Compatible**).
  - Unggahan divalidasi ketat di sisi server (MIME type: `image/jpeg`, `image/png`, `image/webp`; ukuran maksimal: 5 MB).
  - Gambar dioptimalkan dan disajikan dalam format modern WebP/AVIF.
  - Menerapkan **Automated Asset Cleanup**: Saat sebuah karya dihapus atau foto anggota diperbarui, sistem menghapus berkas aset lama di cloud storage untuk mencegah kebocoran kuota (*storage leak*).
* **Konsekuensi:**
  - **Positif:** Pemuatan gambar super cepat via CDN, server aplikasi tidak terbebani penyimpanan berkas biner statis.
  - **Tantangan:** Memerlukan konfigurasi *API Keys / Service Role Secret* pada *environment variables*.

---

### ADR-005: Penanganan Pemutar Video Eksternal & Pencegahan XSS

* **Status:** Disetujui
* **Konteks:**
  - Karya video disajikan melalui *embedded video player*.
  - Mengizinkan input sembarang tag `<iframe>` dari pengguna berisiko celah keamanan injeksi skrip jahat (*Cross-Site Scripting* / XSS).
* **Keputusan:**
  - Administrator **hanya diperbolehkan memasukkan URL video**, bukan kode HTML atau iframe.
  - Layanan yang didukung secara resmi pada MVP: **YouTube** dan **Vimeo**.
  - Server melakukan validasi URL menggunakan *Regular Expression* ketat, mengekstrak Video ID unik, dan kode frontend merender iframe dengan atribut keamanan sandbox:
    `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen`.
* **Konsekuensi:**
  - **Positif:** 100% aman dari injeksi script XSS, tampilan player seragam dan responsif di desktop maupun seluler.
  - **Tantangan:** Jika ada kebutuhan platform baru di masa depan, regex parser perlu ditambahkan.

---

### ADR-006: Skema Routing Portofolio & Kebijakan URL Slug

* **Status:** Disetujui
* **Konteks:**
  - Dokumen IA dan SRS menetapkan setiap karya memiliki URL mandiri.
  - Penggunaan ID angka (`/portfolio/1`) kurang informatif dan tidak optimal untuk promosi karya kreatif.
* **Keputusan:**
  - Menggunakan format *slug* unik berbasis judul karya: `/portfolio/[slug]` (misal: `/portfolio/rebranding-dies-natalis-32`).
  - Slug dihasilkan otomatis menggunakan fungsi `slugify(title)` saat pertama kali karya dibuat.
  - **Kebijakan Imutabilitas:** Jika judul karya diedit kemudian hari, *slug* **tetap dipertahankan (tidak berubah secara otomatis)** untuk mencegah rusaknya tautan yang sudah pernah dibagikan (*broken link prevention*). Disediakan kolom edit slug opsional di CMS jika admin secara sadar ingin mengubahnya.
* **Konsekuensi:**
  - **Positif:** URL rapi, elegan, mudah dibagikan, ramah SEO.
  - **Tantangan:** Database wajib memberlakukan *constraint UNIQUE* pada kolom `slug`.

---

### ADR-007: Batasan Kuota Karya Unggulan di Halaman Home

* **Status:** Disetujui
* **Konteks:**
  - Terdapat ambiguitas antara penyebutan "karya unggulan" tunggal vs koleksi pilihan di dokumen awal.
* **Keputusan:**
  - Ditetapkan bahwa seksi Karya Unggulan di halaman Home menampilkan **maksimal 4 karya unggulan**.
  - Diatur melalui *toggle/checkbox* pada formulir karya di CMS atau seleksi di modul Home Content.
  - Sistem memvalidasi agar jumlah karya yang ditandai sebagai unggulan tidak melebihi 4 item.
  - Jika karya unggulan dihapus, slot tersebut menjadi kosong (tidak diisi karya acak secara otomatis sesuai aturan BR-004).
* **Konsekuensi:**
  - **Positif:** Tata letak grid di Home tetap seimbang, estetis, dan terkurasi dengan baik.

---

### ADR-008: Aturan Integritas Data & Proteksi Kategori Tunggal

* **Status:** Disetujui
* **Konteks:**
  - SRS FR-029 dan BR-005 mewajibkan migrasi karya ke kategori pengganti saat sebuah kategori dihapus.
  - Muncul celah: Jika hanya ada 1 kategori di database, admin tidak memiliki opsi kategori pengganti.
* **Keputusan:**
  - Sistem memberlakukan aturan validasi: **Penghapusan kategori DITOLAK jika total kategori aktif di sistem ≤ 1**.
  - Jika terdapat karya yang bernaung di bawah kategori yang akan dihapus, proses migrasi dijalankan dalam satu transaksi database atomik (*Database Transaction*):
    `UPDATE portfolio_items SET category_id = new_category_id WHERE category_id = target_category_id; DELETE FROM categories WHERE id = target_category_id;`
* **Konsekuensi:**
  - **Positif:** Menjamin tidak ada data yatim (*orphan*) dan sistem tidak pernah berada dalam kondisi tanpa kategori sama sekali.

---

### ADR-009: Mekanisme Pemulihan Akses Darurat Akun Administrator

* **Status:** Disetujui
* **Konteks:**
  - SRS FR-016 menyebut pemulihan kata sandi melalui email dan bantuan teknis.
  - Untuk organisasi mahasiswa, layanan pengiriman email SMTP eksternal terkadang mengalami masa tenggang kuota atau kendala konfigurasi domain.
* **Keputusan:**
  - Selain menyediakan alur reset via email (menggunakan token bertenggat waktu), sistem **wajib menyediakan skrip CLI lokal darurat**:
    `npm run admin:reset -- --password="KataSandiBaruBaru"`
  - Skrip ini langsung berinteraksi dengan database lokal/production untuk meng-hash kata sandi baru dan menyimpannya.
* **Konsekuensi:**
  - **Positif:** Administrator tidak akan pernah terkunci secara permanen dari sistem sekalipun layanan SMTP eksternal bermasalah.

---

**Akhir dokumen `07_DECISION_LOG.md`**
