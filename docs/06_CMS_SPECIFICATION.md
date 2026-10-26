# CMS SPECIFICATION DOCUMENT
## Creatify Digital Portfolio

**Versi:** 1.0  
**Status:** Disetujui   
**Dokumen Acuan:** `00_PROJECT_BRIEF.md`, `01_PRD.md`, `02_SRS.md`, `03_INFORMATION_ARCHITECTURE.md`, `04_SYSTEM_DESIGN.md`, `05_DATABASE_DESIGN.md`, `07_DECISION_LOG.md`

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen
Dokumen *CMS Specification* ini memberikan panduan interaksi antarmuka (*UI/UX specification*), tata letak formulir, validasi masukan, mekanisme umpan balik, dan manajemen status (*state management*) untuk Content Management System (CMS) **Creatify Digital Portfolio**. Dokumen ini menjadi acuan utama bagi pengembang frontend dalam membangun dashboard administrator yang fungsional, bersih, aman, dan mudah digunakan.

### 1.2 Karakteristik CMS
- **Target Pengguna:** 1 akun Administrator utama (*Single Admin*).
- **Pendekatan Desain:** *Productivity-focused*, minimalis, modern, responsif untuk perangkat desktop maupun seluler.
- **Prinsip Operasional:** *Direct publishing* (setiap data yang disimpan langsung terbit ke website publik), *resilient input retention* (mempertahankan input saat terjadi galat formulir), dan *strict destructive confirmations* (konfirmasi eksplisit sebelum penghapusan data).

---

## 2. Struktur Tata Letak Antarmuka (*Layout Structure*)

Antarmuka CMS menggunakan pola dashboard modern berbasis dua komponen kerangka utama:

```
+-----------------------------------------------------------------------------------+
|  [Logo Creatify CMS]                     [Lihat Web Publik ↗]  [Admin Profile ▾]  | (Topbar)
+-------------------+---------------------------------------------------------------+
|                   | Breadcrumb: Dashboard > Portofolio > Tambah Karya             |
| [Sidebar Menu]    |                                                               |
| - Ringkasan       | Page Header: Tambah Karya Baru                                |
| - Portofolio      | Subtext: Unggah karya desain, media sosial, atau video.       |
| - Kategori        +---------------------------------------------------------------+
| - Konten Home     |                                                               |
| - Konten About    |  [Form Canvas / Interactive Workspace Area]                   |
| - Kepengurusan    |                                                               |
| - Rekrutmen       |                                                               |
| - Kontak & Sosmed |                                                               |
| - Akun Admin      |                                                               |
|                   |                                                               |
| [Keluar / Logout] |                                                               |
+-------------------+---------------------------------------------------------------+
```

### 2.1 Sidebar Navigasi Kiri
- **Desktop:** Menetap (*fixed*) di sisi kiri layar dengan lebar 260px.
- **Mobile/Tablet:** Dapat disembunyikan (*collapsible drawer*) dengan tombol toggle hamburger pada topbar.
- **Item Navigasi:**
  1. `Ringkasan` (`/admin`) — Ikon: LayoutDashboard
  2. `Portofolio` (`/admin/portfolio`) — Ikon: FolderKanban
  3. `Kategori Portofolio` (`/admin/portfolio/categories`) — Ikon: Tags
  4. `Konten Home` (`/admin/content/home`) — Ikon: Home
  5. `Konten About` (`/admin/content/about`) — Ikon: Info
  6. `Kepengurusan & Tim` (`/admin/content/team`) — Ikon: Users
  7. `Info Rekrutmen` (`/admin/content/recruitment`) — Ikon: UserPlus
  8. `Kontak & Medsos` (`/admin/settings/contact`) — Ikon: Share2
  9. `Pengaturan Akun` (`/admin/settings/account`) — Ikon: KeyRound

### 2.2 Topbar
- Menampilkan *Breadcrumb* dinamis sesuai halaman aktif.
- Tombol pintas `Lihat Website ↗` (membuka tab baru ke halaman publik `/`).
- Indikator status login dan tombol cepat `Keluar` (*Logout*).

---

## 3. Spesifikasi Fungsional Per Modul CMS

### 3.1 Modul 1: Dashboard Overview (`/admin`)

Halaman awal setelah administrator berhasil login, berfungsi menyajikan visibilitas status operasional sistem secara instan.

#### Komponen UI:
1. **Kartu Statistik (*Metric Cards*):**
   - **Total Karya:** Menampilkan angka karya aktif (klik mengarah ke `/admin/portfolio`).
   - **Total Kategori:** Menampilkan jumlah kategori (klik mengarah ke `/admin/portfolio/categories`).
   - **Total Anggota:** Menampilkan jumlah pengurus yang terdata (klik mengarah ke `/admin/content/team`).
2. **Widget Status Operasional:**
   - **Status Rekrutmen:** Badge visual besar `DIBUKA` (hijau) atau `DITUTUP` (abu-abu netral) dengan tombol pintas ubah status.
   - **Karya Unggulan Aktif:** Daftar thumbnail dan judul karya yang saat ini terpilih tampil di Home (maksimal 4 karya).
3. **Aksi Cepat (*Quick Actions*):**
   - Tombol `+ Tambah Karya Baru`
   - Tombol `Edit Teks Home`
   - Tombol `Pengaturan Rekrutmen`

---

### 3.2 Modul 2: Manajemen Portofolio (`/admin/portfolio`)

#### 3.2.1 Halaman Daftar Karya (`/admin/portfolio`)
- **Fitur Tabel Data:**
  - Pencarian instan (*client-side filter*) berdasarkan judul karya.
  - Dropdown filter berdasarkan kategori.
  - Kolom Tabel:
    1. *Thumbnail* (gambar mini rasio 16:9).
    2. *Judul Karya* & *Slug*.
    3. *Kategori* (Badge).
    4. *Tipe Media* (Badge Gambar atau Video).
    5. *Status Unggulan* (Icon Bintang / Badge "Featured").
    6. *Aksi:* Tombol Edit (ikon pensil) dan Tombol Hapus (ikon tempat sampah warna merah).
- **Keadaan Kosong (*Empty State*):** Ilustrasi menarik dengan pesan "Belum ada karya portofolio" dan tombol CTA "+ Tambah Karya Pertama".

#### 3.2.2 Formulir Tambah & Edit Karya (`/admin/portfolio/create` & `/edit/[id]`)

| Kolom Input | Tipe Kontrol UI | Validasi | Perilaku & Catatan |
|---|---|---|---|
| **Judul Karya** | Text Input | Wajib, 3–200 karakter | Saat menambah, otomatis mengisi slug. |
| **Slug URL** | Text Input | Wajib, Unik, pola: `^[a-z0-9]+(?:-[a-z0-9]+)*$` | Dibuat otomatis dari judul, dapat disesuaikan manual. |
| **Kategori** | Dropdown Select | Wajib, merujuk ID kategori aktif | Memuat daftar kategori dari tabel `categories`. |
| **Tipe Media** | Radio Buttons / Tabs | Wajib, opsi: `Gambar` atau `Video` | Mengubah visibilitas kolom input video. |
| **Gambar Sampul / Media Utama** | File Dropzone | Wajib untuk Gambar baru | Mendukung drag-and-drop, validasi tipe JPG/PNG/WEBP maks 5MB. Menampilkan pratinjau gambar seketika. |
| **URL Sumber Video** | Text Input | Wajib jika tipe `Video` | Hanya menerima format URL YouTube atau Vimeo. Sistem langsung mengekstrak ID dan menampilkan pratinjau iframe player. |
| **Deskripsi Karya** | Textarea | Opsional, maks 1000 karakter | Penjelasan konteks karya. |
| **Tahun / Waktu Pembuatan** | Text Input | Opsional, contoh: "2026" | Informasi waktu rilis karya. |
| **Tautan Konten Asli** | Text Input (URL) | Opsional, format URL valid | Tautan eksternal (misal post IG asli atau web klien). |
| **Karya Unggulan** | Switch Toggle / Checkbox | Opsional (Boolean) | Menandai karya untuk tampil di Home. Sistem memperingatkan jika kuota 4 karya sudah penuh. |

#### 3.2.3 Modal Konfirmasi Penghapusan Karya
- Saat admin menekan tombol "Hapus", tampil modal konfirmasi destruktif:
  - *Judul:* "Hapus Karya Ini Secara Permanen?"
  - *Pesan:* "Karya '{title}' akan dihapus dari galeri publik dan berkas media akan dibersihkan dari server. Tindakan ini tidak dapat dibatalkan."
  - *Tombol:* "Batal" (Abu-abu) dan "Ya, Hapus Karya" (Merah Solid).

---

### 3.3 Modul 3: Manajemen Kategori Portofolio (`/admin/portfolio/categories`)

Mengelola taksonomi karya secara dinamis sesuai kebutuhan tim.

#### 3.3.1 Tabel Kategori
- Kolom:
  1. *Nama Kategori* (misal: Graphic Design).
  2. *Slug* (`graphic-design`).
  3. *Jumlah Karya Terhubung* (menampilkan angka karya yang bernaung di kategori ini).
  4. *Aksi:* Edit Nama dan Hapus Kategori.

#### 3.3.2 Modal Tambah & Edit Kategori
- Input: Nama Kategori (Wajib, unik).
- Tombol: "Simpan Kategori".

#### 3.3.3 Modal Hapus Kategori dengan Proteksi Migrasi (SRS FR-028/029, ADR-008)
Perilaku modal bergantung pada kondisi relasi data:
- **Kondisi 1: Hanya tersisa 1 kategori di database**
  - Tombol hapus dinonaktifkan (*disabled*) dengan keterangan: *"Kategori tidak dapat dihapus karena sistem wajib memiliki minimal satu kategori aktif."*
- **Kondisi 2: Kategori tidak memiliki karya (Jumlah Karya = 0)**
  - Tampil modal konfirmasi biasa: *"Apakah Anda yakin ingin menghapus kategori '{name}'?"*
- **Kondisi 3: Kategori memiliki karya (Jumlah Karya > 0)**
  - Tampil modal khusus: *"Kategori '{name}' menaungi {count} karya aktif."*
  - Admin **diwajibkan memilih kategori pengganti** melalui dropdown sebelum tombol hapus aktif:
    `Pindahkan seluruh karya ke kategori: [Pilih Kategori Pengganti ▾]`
  - Tombol: "Migrasi Karya & Hapus Kategori Lama" (Merah).

---

### 3.4 Modul 4: Manajemen Konten Halaman Publik

#### 3.4.1 Seksi Home (`/admin/content/home`)
Mengelola teks hero dan kurasi karya unggulan:
- **Hero Section Form:**
  - `Headline Utama` (Text Input, contoh: "Creative Engine for Faculty Branding")
  - `Sub-headline / Deskripsi` (Textarea ringkas)
  - `Teks Tombol CTA Utama` (Text Input, contoh: "Lihat Portofolio")
  - `Teks Tombol CTA Sekunder` (Text Input, contoh: "Tentang Kami")
- **Selector Karya Unggulan (*Featured Works Curator*):**
  - Menampilkan daftar karya yang sedang dipilih (maksimal 4).
  - Admin dapat mencabut (*unfeature*) atau memilih karya dari daftar portofolio yang ada.

#### 3.4.2 Seksi About (`/admin/content/about`)
Mengelola profil dan narasi kontribusi:
- `Tagline / Motto Profil` (Text Input)
- `Narasi Profil Creatify` (Textarea deskripsi)
- `Poin Visi & Tujuan` (Daftar dinamis: admin dapat menambah/menghapus butir poin)
- `Kontribusi terhadap Fakultas` (Textarea penjelasan peran nyata)

#### 3.4.3 Seksi Kepengurusan & Tim (`/admin/content/team`)
Mengelola daftar anggota pengurus:
- **Tabel Anggota:**
  - Menampilkan foto mini, nama, jabatan, serta kolom **Nomor Urutan Tampilan (*Sort Order*)**.
  - Aksi: Edit Anggota dan Hapus Anggota.
- **Modal Tambah / Edit Anggota:**
  - `Nama Lengkap` (Wajib)
  - `Jabatan / Peran` (Wajib, contoh: "Koordinator Tim Video")
  - `Unggah Foto Profil` (Wajib untuk anggota baru, rasio 1:1, maks 3MB)
  - `Nomor Urutan Tampilan` (Input Angka: urutan 1, 2, 3 dst. Nilai lebih kecil tampil paling depan)

#### 3.4.4 Seksi Info Rekrutmen (`/admin/content/recruitment`)
Mengelola status siklus penerimaan anggota:
- `Status Rekrutmen Aktif` (Toggle Switch: Hijau "Dibuka" / Abu-abu "Ditutup")
- `Judul Rekrutmen` (Text Input, contoh: "Open Recruitment Anggota Baru 2026")
- `Deskripsi & Persyaratan` (Textarea penjelasan singkat)
- `URL Formulir Pendaftaran Eksternal` (Text Input URL, contoh link Google Form. *Hanya muncul di halaman publik saat status Dibuka*).

---

### 3.5 Modul 5: Pengaturan Kontak & Media Sosial (`/admin/settings/contact`)

Formulir terpadu untuk mengelola seluruh kanal resmi yang tampil pada halaman `/contact` dan footer:
- **Instagram:**
  - `Username / Handle` (contoh: `@creatify.fasilkom`)
  - `URL Profil Lengkap` (contoh: `https://instagram.com/creatify.fasilkom`)
- **Email Resmi:**
  - `Alamat Email` (contoh: `creatify@cs.university.ac.id`, validasi format email)
- **TikTok:**
  - `Username / Handle` (contoh: `@creatify.fasilkom`)
  - `URL Profil Lengkap` (contoh: `https://tiktok.com/@creatify.fasilkom`)
- *Tombol:* "Simpan Informasi Kontak".

---

### 3.6 Modul 6: Pengaturan Akun Administrator (`/admin/settings/account`)

Memungkinkan pembaruan kredensial keamanan:
- **Bagian Ubah Email:**
  - Email administrator saat ini.
  - Masukkan email baru.
- **Bagian Ubah Kata Sandi:**
  - Kata Sandi Lama (untuk verifikasi otorisasi).
  - Kata Sandi Baru (minimal 8 karakter, kombinasi huruf dan angka).
  - Konfirmasi Kata Sandi Baru.
- *Tombol:* "Perbarui Kredensial".

---

## 4. Pola Interaksi, Umpan Balik & Status Sistem (*UX & State Management*)

### 4.1 Status Pemuatan (*Loading States*)
- **Tombol Form Saat Submit:** Tombol dinonaktifkan sementara dan menampilkan spinner animasi beserta teks progres (contoh: *"Menyimpan data..."* atau *"Mengunggah media..."*).
- **Tabel Data:** Menampilkan *Skeleton Placeholder* saat data sedang dimuat dari server, bukan layar putih kosong.

### 4.2 Umpan Balik Validasi & Notifikasi (*Feedback & Notifications*)
- **Notifikasi Mengambang (*Toast Alert*):**
  - *Sukses:* Toast hijau di pojok kanan atas berdurasi 4 detik (misal: *"Karya berhasil dipublikasikan"*).
  - *Galat Sistem:* Toast merah menetap hingga ditutup oleh pengguna jika terjadi kegagalan jaringan atau server.
- **Validasi Formulir (*Field-level Errors*):**
  - Pesan kesalahan ditampilkan langsung tepat di bawah input yang bermasalah dengan teks merah dan outline kolom merah.
  - Nilai kolom yang sudah diisi oleh administrator **wajib dipertahankan** di antarmuka jika terjadi galat validasi, agar administrator tidak perlu mengetik ulang seluruh formulir (SRS FR-049).

---

## 5. Alur Layar Autentikasi CMS

### 5.1 Halaman Login (`/admin/login`)
- Layout bersih terpusat (*centered card*) dengan logo resmi Creatify.
- Input Email & Kata Sandi dengan tombol intip kata sandi (*toggle show/hide password*).
- Tombol "Masuk ke Dashboard".
- Tautan "Lupa Kata Sandi?".
- Pesan galat aman jika login gagal: *"Email atau kata sandi yang Anda masukkan salah."* (tanpa membocorkan apakah email terdaftar atau tidak, sesuai SRS NFR-003).

### 5.2 Halaman Lupa & Reset Kata Sandi (`/admin/forgot-password` & `/admin/reset-password`)
- Formulir permintaan tautan reset dengan input email admin.
- Halaman input kata sandi baru jika membuka tautan ber-token valid.
- Pesan informatif jika token kedaluwarsa atau tidak valid, mengarahkan admin menghubungi bantuan teknis / menjalankan CLI recovery.

---

**Akhir dokumen `06_CMS_SPECIFICATION.md`**
