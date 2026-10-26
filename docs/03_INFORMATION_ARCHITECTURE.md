# INFORMATION ARCHITECTURE
## Creatify Digital Portfolio

**Versi:** 1.1  
**Status:** Disetujui (Hasil Audit & Penyempurnaan)  
**Dokumen Acuan:** `00_PROJECT_BRIEF.md`, `01_PRD.md`, `02_SRS.md`

---

## 1. Tujuan Dokumen

Dokumen ini mendefinisikan arsitektur informasi Creatify Digital Portfolio, meliputi struktur halaman publik, hierarki konten, navigasi pengunjung, struktur navigasi CMS, dan alur utama pengguna.

Dokumen ini menjadi acuan untuk memastikan informasi mudah ditemukan, struktur halaman konsisten, dan pengelolaan konten oleh administrator dapat dilakukan secara jelas dan intuitif.

Dokumen ini melengkapi PRD dan SRS. Detail implementasi teknologi, skema database, dan spesifikasi antarmuka CMS dijabarkan dalam dokumen teknis terkait.

## 2. Gambaran Umum Sistem

Creatify Digital Portfolio terdiri atas dua area utama:

1. **Website Publik:** menyediakan informasi resmi mengenai Creatify, menampilkan portofolio karya, menjelaskan informasi rekrutmen, serta menyediakan kanal kontak dan media sosial.
2. **Content Management System (CMS):** digunakan oleh administrator untuk mengelola karya, kategori, konten halaman, struktur kepengurusan dan anggota, informasi rekrutmen, serta kanal komunikasi.

Website publik dapat diakses pengunjung tanpa autentikasi. Area CMS hanya dapat diakses oleh administrator yang telah terautentikasi melalui kredensial yang sah.

---

## 3. Arsitektur Website Publik

### 3.1 Struktur Halaman

Website publik memiliki lima halaman utama dan satu template halaman detail karya.

| Halaman | Jalur URL (*Route*) | Fungsi Utama |
|---|---|---|
| **Home** | `/` | Memperkenalkan Creatify, menampilkan karya unggulan pilihan, dan akses cepat ke kategori portofolio. |
| **About** | `/about` | Menjelaskan profil, visi/tujuan, kontribusi terhadap fakultas, serta susunan kepengurusan dan anggota. |
| **Portfolio** | `/portfolio` | Galeri karya interaktif dengan filter kategori dinamis. |
| **Detail Karya** | `/portfolio/[slug]` | Halaman detail karya lengkap (media gambar/video embed, deskripsi, tanggal/tahun, tautan konten asli). |
| **Join Creatify** | `/join` | Informasi penerimaan anggota baru dan status rekrutmen (dibuka/ditutup). |
| **Contact** | `/contact` | Informasi kanal komunikasi resmi (Instagram, Email, TikTok). |

Detail Karya merupakan halaman turunan dari Portfolio, bukan menu navigasi utama yang berdiri sendiri.

---

### 3.2 Struktur Halaman Home (`/`)

Urutan seksi halaman Home disusun secara berorientasi pada daya tarik visual (*first-impression*):

1. **Hero / Pengenalan Tim:**
   - Judul utama (*headline*) dan penjelasan singkat identitas/peran Creatify dalam *branding* dan komunikasi fakultas.
   - Tombol Ajakan Bertindak (*Call to Action* / CTA utama), misalnya "Jelajahi Karya" (mengarahkan ke `/portfolio`) dan "Tentang Kami" (mengarahkan ke `/about`).
2. **Karya Unggulan (*Featured Works*):**
   - Menampilkan koleksi karya terpilih yang ditetapkan secara manual oleh administrator (maksimal 4 karya unggulan).
   - Setiap kartu karya unggulan menampilkan thumbnail representatif, judul, kategori, dan dapat diklik untuk membuka halaman Detail Karya.
   - Jika belum ada karya unggulan yang dipilih, seksi ini disembunyikan secara anggun (*graceful fallback*) tanpa merusak tata letak halaman.
3. **Kategori Karya (*Creative Disciplines*):**
   - Menampilkan kartu/tombol navigasi kategori karya yang tersedia (misal: Graphic Design, Social Media Content, Video).
   - Klik pada salah satu kategori akan mengarahkan pengunjung ke `/portfolio?category=[slug-kategori]` dengan filter kategori tersebut langsung aktif.
4. **Ajakan Bertindak Penutup (*Recruitment CTA*):**
   - Mengajak mahasiswa bergabung atau mengenal Creatify lebih lanjut, dengan tautan langsung menuju halaman `/join`.

**Aturan Kategori pada Home:**
- Kategori yang ditampilkan harus selalu bersumber dari data kategori aktif di database.
- Jika pengunjung mengakses tautan kategori yang telah dihapus/tidak valid, halaman `/portfolio` tetap terbuka normal dengan menampilkan seluruh karya tanpa memicu galat (*error-tolerant*).

---

### 3.3 Struktur Halaman About (`/about`)

Urutan seksi halaman About disusun secara hierarkis:

1. **Profil & Identitas:**
   - Pengenalan sejarah, tujuan, dan nilai-nilai inti Creatify.
   - Penjelasan peran nyata dan kontribusi Creatify dalam ekosistem komunikasi serta *branding* Fakultas Ilmu Komputer.
2. **Struktur Kepengurusan & Anggota:**
   - Daftar anggota tim kreatif yang ditampilkan dalam susunan kartu profil rapi.
   - Informasi kartu anggota meliputi: Foto profil, Nama lengkap, serta Jabatan/Peran spesifik.
   - Susunan urutan anggota mengikuti pengaturan nomor urut manual (*sort order*) yang ditetapkan oleh administrator di CMS.
   - Lingkup MVP tidak memerlukan bagan hierarki bercabang, diagram pohon organisasi, atau relasi atasan-bawahan yang rumit.

---

### 3.4 Struktur Halaman Portfolio (`/portfolio`)

Halaman galeri karya dirancang fleksibel dan responsif:

1. **Header Galeri:** Judul halaman dan penjelasan singkat mengenai koleksi karya Creatify.
2. **Bar Bilah Filter Kategori (*Category Filter Bar*):**
   - Pilihan filter "Semua" (*All*) dan daftar kategori dinamis yang diambil dari database.
   - Kategori tidak ditulis secara *hardcoded* pada kode frontend.
   - Menerima parameter URL query `?category=[slug]` sehingga filter dapat langsung aktif saat diarahkan dari halaman Home.
3. **Grid Galeri Karya:**
   - Kartu karya menampilkan gambar thumbnail, judul karya, dan label kategori.
   - Seluruh kartu bersifat interaktif (*clickable*) dan mengarahkan ke halaman Detail Karya terkait.
4. **Keadaan Kosong (*Empty State*):**
   - Jika pada suatu kategori belum terdapat karya, sistem menampilkan pesan informatif yang ramah (misal: *"Belum ada karya pada kategori ini"*).

---

### 3.5 Struktur Halaman Detail Karya (`/portfolio/[slug]`)

Halaman individual untuk mengapresiasi karya secara spesifik:

- **Format URL:** Menggunakan *slug* unik berbasis judul yang ramah SEO dan manusia (misal: `/portfolio/rebranding-dies-natalis-32`).
- **Komponen Informasi:**
  1. Judul karya.
  2. Label kategori yang dapat diklik untuk melihat karya sejenis.
  3. Media utama:
     - Jika bertipe **Gambar**: Tampilan gambar beresolusi tinggi dengan rasio proporsional dan teks alternatif (*alt text*).
     - Jika bertipe **Video**: Pemutar video tersemat (*embedded responsive player*) dari penyedia yang didukung (YouTube / Vimeo).
  4. Deskripsi singkat karya (opsional, disembunyikan jika kosong).
  5. Tahun / tanggal publikasi (opsional).
  6. Tautan konten asli / sumber eksternal (opsional, misal: tautan postingan Instagram asli).
  7. Navigasi kembali ke galeri (`← Kembali ke Portofolio`).
- **Penanganan Galat 404:** Jika karya tidak ditemukan atau dinonaktifkan, sistem menampilkan halaman 404 informatif dengan tombol kembali ke `/portfolio`.

---

### 3.6 Struktur Halaman Join Creatify (`/join`)

Halaman informasi penerimaan anggota baru yang responsif terhadap siklus rekrutmen:

1. **Informasi Rekrutmen:** Penjelasan mengenai divisi, kriteria calon anggota, dan pengalaman yang didapatkan dengan bergabung di Creatify.
2. **Indikator Status Rekrutmen:**
   - **Status "Dibuka" (*Open*):** Menampilkan badge status hijau menyala (*Open Recruitment Active*), panduan pendaftaran, serta tombol CTA menonjol yang mengarah ke URL formulir pendaftaran eksternal (misal Google Forms).
   - **Status "Ditutup" (*Closed*):** Menampilkan badge status netral (*Recruitment Closed*), pesan bahwa pendaftaran sedang tidak dibuka, serta ajakan untuk mengikuti media sosial resmi agar mendapatkan pembaruan info rekrutmen berikutnya. Tombol formulir disembunyikan sepenuhnya.
3. Seluruh proses pendaftaran dan seleksi dilakukan melalui formulir eksternal; sistem tidak memproses pendaftaran formulir di dalam website (*no internal applicant tracking system*).

---

### 3.7 Struktur Halaman Contact (`/contact`)

Halaman komunikasi resmi yang bersih dan fungsional:

1. **Header Kontak:** Pengantar bagi pihak fakultas, organisasi mahasiswa, atau pihak eksternal yang ingin berkolaborasi.
2. **Daftar Kanal Resmi:**
   - **Instagram:** Menampilkan *handle* akun dan tautan langsung ke profil Instagram Creatify.
   - **Email:** Menampilkan alamat email resmi dan tautan `mailto:`.
   - **TikTok:** Menampilkan *handle* akun dan tautan langsung ke profil TikTok Creatify.
3. Kanal yang belum diisi oleh administrator tidak ditampilkan sebagai tautan rusak (*broken link prevention*).

---

### 3.8 Navigasi Utama & Footer

- **Header / Navigasi Utama:**
  - Logo resmi Creatify (tautan ke `/`).
  - Menu: `Home`, `About`, `Portfolio`, `Join Creatify`, `Contact`.
  - Responsif: Berubah menjadi *mobile drawer / hamburger menu* pada perangkat seluler.
- **Footer:**
  - Identitas tim dan ringkasan hak cipta (*copyright*).
  - Tautan cepat media sosial (Instagram, TikTok, Email).
  - Tautan tersembunyi/khusus menuju akses login CMS (`/admin/login`) untuk kemudahan pengurus.

---

## 4. Arsitektur Content Management System (CMS)

### 4.1 Struktur Menu Navigasi CMS

CMS menggunakan tata letak *admin dashboard* standar dengan sidebar navigasi tetap di sebelah kiri:

```
[CMS Creatify Dashboard]
├── 1. Ringkasan (Dashboard Overview)
├── 2. Portofolio
│   ├── Daftar Karya (/admin/portfolio)
│   ├── Tambah Karya (/admin/portfolio/create)
│   └── Kelola Kategori (/admin/portfolio/categories)
├── 3. Konten Halaman
│   ├── Konten Home (/admin/content/home)
│   ├── Konten About (/admin/content/about)
│   ├── Kepengurusan & Anggota (/admin/content/team)
│   └── Info Rekrutmen (/admin/content/recruitment)
├── 4. Kontak & Media Sosial (/admin/settings/contact)
└── 5. Pengaturan Akun Admin (/admin/settings/account)
```

---

### 4.2 Spesifikasi Modul-Modul CMS

#### A. Dashboard Overview (`/admin`)
- **Statistik Cepat:** Jumlah total karya aktif, jumlah kategori, jumlah anggota tim yang terdaftar.
- **Status Operasional:** Status rekrutmen saat ini (Aktif / Non-aktif) dan daftar karya unggulan yang sedang aktif di Home.
- **Aksi Cepat (*Quick Actions*):** Tombol pintas untuk "Tambah Karya Baru", "Ubah Status Rekrutmen", dan "Buka Website Publik".

#### B. Modul Portofolio & Kategori
1. **Daftar Karya (`/admin/portfolio`):**
   - Menampilkan tabel karya dengan kolom: Thumbnail, Judul, Kategori, Tipe Media (Gambar/Video), Status Karya Unggulan, serta Aksi (Edit / Hapus).
   - Dilengkapi konfirmasi modal sebelum penghapusan data.
2. **Formulir Karya (`/admin/portfolio/create` & `/admin/portfolio/[id]/edit`):**
   - Judul Karya (Wajib, auto-generate slug).
   - Kategori (Wajib, dropdown pilihan kategori aktif).
   - Tipe Media (Pilihan: Gambar / Video).
   - Unggah Gambar Sampul / Media Utama (Wajib).
   - URL Sumber Video Eksternal (Wajib jika tipe Video: validasi URL YouTube/Vimeo).
   - Deskripsi Singkat (Opsional, teks singkat).
   - Tanggal / Tahun Pembuatan (Opsional).
   - Tautan Konten Asli (Opsional, validasi format URL).
   - Centang "Jadikan Karya Unggulan" (Maksimal 4 karya terpilih).
3. **Kelola Kategori (`/admin/portfolio/categories`):**
   - Daftar kategori yang aktif.
   - Tambah kategori baru (Nama kategori).
   - Ubah nama kategori.
   - Hapus kategori dengan **Aturan Migrasi Terproteksi**:
     - Jika kategori masih menaungi karya, sistem **mewajibkan** administrator memilih kategori pengganti sebelum penghapusan dieksekusi.
     - **Aturan Pembatas:** Jika sistem hanya memiliki **1 kategori tersisa**, kategori tersebut **tidak boleh dihapus** untuk menjaga integritas data relasional.

#### C. Modul Konten Halaman
1. **Home Content (`/admin/content/home`):**
   - Mengelola teks Hero Headline, Subtitle/Deskripsi, Teks Tombol CTA, serta pemilihan karya unggulan.
2. **About Content (`/admin/content/about`):**
   - Mengelola teks pengenalan tim, visi/tujuan, dan narasi kontribusi terhadap fakultas.
3. **Kepengurusan & Anggota (`/admin/content/team`):**
   - Tabel daftar anggota dengan kolom: Foto, Nama, Jabatan, Nomor Urutan Tampilan (*Sort Order*), dan Aksi.
   - Modal tambah & edit anggota (Nama, Jabatan, Unggah Foto, Nomor Urutan).
4. **Info Rekrutmen (`/admin/content/recruitment`):**
   - Toggle Status Rekrutmen (Dibuka / Ditutup).
   - Input URL Formulir Pendaftaran Eksternal.
   - Teks Deskripsi / Informasi Tambahan Rekrutmen.

#### D. Modul Kontak & Media Sosial (`/admin/settings/contact`)
- Input URL Instagram Creatify.
- Input Alamat Email Resmi.
- Input URL TikTok Creatify.

#### E. Pengaturan Akun Administrator (`/admin/settings/account`)
- Mengubah email administrator.
- Mengubah kata sandi (wajib memasukkan kata sandi lama, kata sandi baru, dan konfirmasi).

---

## 5. Matriks Relasi Konten & Tampilan

| Data Konten | Modul Pengelola di CMS | Halaman Publik yang Menampilkan |
|---|---|---|
| **Karya Unggulan** | Home Content / Formulir Karya | `Home (Hero Spotlight Grid)` |
| **Daftar Portofolio** | Modul Portofolio | `Portfolio (Galeri)` & `Detail Karya` |
| **Kategori Portofolio** | Modul Kategori | `Home (Kategori Nav)`, `Portfolio (Filter)`, `Detail Karya` |
| **Profil & Visi Tim** | Modul About Content | `About (Seksi Profil)` |
| **Daftar Anggota** | Modul Kepengurusan | `About (Seksi Tim & Pengurus)` |
| **Status & Link Rekrutmen** | Modul Info Rekrutmen | `Join Creatify` & `Dashboard (Ringkasan)` |
| **Kontak & Media Sosial** | Modul Kontak & Media Sosial | `Contact` & `Footer (Semua Halaman)` |

---

## 6. Prinsip Arsitektur Informasi & Integritas Data

1. **Single Source of Truth:** Seluruh data yang tampil di publik dan ringkasan dashboard CMS selalu bersumber dari basis data yang sama.
2. **Direct Publishing:** Setiap aksi simpan yang berhasil langsung memperbarui tampilan publik tanpa perlu antrean persetujuan.
3. **Graceful Degradation:** Ketiadaan data opsional (misal: deskripsi karya kosong, tautan asli tidak ada, rekrutmen ditutup) tidak boleh merusak tata letak antarmuka.
4. **Relational Integrity:** Penghapusan kategori tidak pernah meninggalkan karya berstatus yatim (*orphan data*).
5. **Human-Friendly Routing:** URL publik menggunakan format slug yang mudah dibaca dan diingat.

---

**Akhir dokumen `03_INFORMATION_ARCHITECTURE.md` (Versi 1.1)**