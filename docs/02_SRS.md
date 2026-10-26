# Software Requirements Specification (SRS)
## Creatify Digital Portfolio

**Versi:** 1.0  
**Status:** Disetujui  
**Jenis Sistem:** Website publik dan Content Management System (CMS)  
**Dokumen Acuan:** `00_PROJECT_BRIEF.md`, `01_PRD.md`

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen

Dokumen Software Requirements Specification (SRS) ini mendefinisikan kebutuhan dan perilaku sistem Creatify Digital Portfolio sebagai acuan untuk desain sistem, implementasi, dan pengujian.

SRS menjelaskan apa yang harus dilakukan sistem, kondisi yang harus dipenuhi, aturan validasi, dan hasil yang diharapkan. Dokumen ini tidak menetapkan implementasi teknis secara terperinci apabila keputusan tersebut belum disepakati.

### 1.2 Ruang Lingkup Sistem

Creatify Digital Portfolio merupakan website yang digunakan untuk memperkenalkan Creatify, menampilkan hasil karya, memberikan informasi tentang tim dan kepengurusan, serta menyampaikan informasi rekrutmen dan kanal kontak.

Sistem terdiri atas:

1. **Website publik**, yang dapat diakses pengunjung tanpa autentikasi.
2. **CMS**, yang digunakan administrator untuk mengelola konten website.

CMS harus memungkinkan administrator mengelola konten melalui antarmuka tanpa perlu mengubah kode program secara langsung.

### 1.3 Istilah dan Definisi

| Istilah | Definisi |
|---|---|
| Pengunjung | Pengguna yang mengakses website publik. |
| Administrator | Pengguna yang memiliki akses untuk mengelola konten melalui CMS. |
| CMS | Antarmuka pengelolaan konten website. |
| Portofolio | Kumpulan karya yang ditampilkan oleh Creatify. |
| Karya unggulan | Karya yang dipilih administrator untuk ditampilkan secara khusus pada Home. |
| Kategori | Pengelompokan karya, misalnya Graphic Design, Social Media Content, dan Video. |
| Embed | Penyematan media dari layanan eksternal agar dapat ditampilkan atau diputar di halaman website. |
| Validasi | Pemeriksaan data atau berkas sebelum sistem menerima dan menyimpannya. |

### 1.4 Referensi

- `00_PROJECT_BRIEF.md`
- `01_PRD.md`
- `AGENTS.md` sebagai panduan kerja pengembangan proyek, jika telah tersedia.

---

## 2. Gambaran Umum Sistem

### 2.1 Karakteristik Produk

Sistem memiliki karakteristik berikut:

- Website publik bersifat informatif dan berorientasi pada portofolio.
- CMS menggunakan satu akun administrator utama pada MVP.
- Konten yang berhasil disimpan langsung ditampilkan pada website publik.
- Kategori portofolio dapat dikelola secara dinamis.
- Gambar diunggah melalui CMS, sedangkan video dapat menggunakan sumber eksternal.
- Website dapat digunakan melalui desktop, tablet, dan perangkat seluler.

### 2.2 Jenis Pengguna

#### 2.2.1 Pengunjung

Pengunjung dapat:

- Membuka halaman Home, About, Portfolio, Join Creatify, dan Contact.
- Melihat karya beserta kategorinya.
- Membuka detail singkat karya.
- Memutar video melalui embed yang didukung.
- Melihat profil dan struktur kepengurusan.
- Melihat status rekrutmen dan tautan formulir jika rekrutmen dibuka.
- Mengakses kanal Instagram, Email, dan TikTok.

Pengunjung tidak dapat mengubah konten website.

#### 2.2.2 Administrator

Administrator dapat:

- Masuk ke CMS menggunakan email dan kata sandi.
- Mengelola data portofolio.
- Mengelola kategori portofolio.
- Memilih karya unggulan.
- Mengelola konten Home dan About.
- Mengelola struktur kepengurusan.
- Mengelola informasi dan status rekrutmen.
- Mengelola kanal kontak dan media sosial.
- Mengunggah gambar dan menentukan sumber video eksternal.
- Memulihkan akses melalui email atau bantuan teknis sesuai prosedur yang berlaku.

### 2.3 Batasan Sistem

MVP tidak mencakup:

- Formulir pendaftaran rekrutmen internal.
- Sistem seleksi kandidat.
- Portal berita atau artikel berkala.
- Komentar, forum, dan interaksi sosial internal.
- Multi-admin dengan pembagian hak akses berdasarkan peran.
- Page builder visual drag-and-drop.
- Aplikasi seluler native.
- Analitik pengunjung tingkat lanjut.
- Pencarian portofolio berdasarkan judul dan filter tahun.

---

## 3. Persyaratan Fungsional

Persyaratan berikut menggunakan ID unik agar dapat dirujuk dalam desain sistem dan pengujian.

### 3.1 Website Publik

**FR-001 — Akses halaman publik**

Sistem harus menyediakan halaman Home, About, Portfolio, Join Creatify, dan Contact yang dapat diakses tanpa login.

**FR-002 — Navigasi**

Sistem harus menyediakan navigasi yang memungkinkan pengunjung berpindah antarhalaman utama.

**FR-003 — Konten Home**

Sistem harus menampilkan identitas Creatify, pengenalan singkat, navigasi ke konten utama, serta karya unggulan yang dipilih administrator.

**FR-004 — Konten About**

Sistem harus menampilkan profil, tujuan, kontribusi Creatify terhadap branding dan komunikasi fakultas, serta informasi struktur kepengurusan.

**FR-005 — Galeri portofolio**

Sistem harus menampilkan daftar karya yang tersedia untuk publik beserta informasi kategori masing-masing.

**FR-006 — Navigasi kategori**

Sistem harus memungkinkan pengunjung menelusuri karya berdasarkan kategori.

**FR-007 — Detail karya**

Sistem harus menyediakan halaman detail singkat untuk setiap karya. Halaman dapat menampilkan:

- Judul karya.
- Kategori.
- Gambar atau media utama.
- Deskripsi singkat jika tersedia.
- Tanggal atau tahun publikasi jika tersedia.
- Tautan menuju konten asli jika tersedia.

**FR-008 — Pemutaran video**

Sistem harus mendukung pemutaran video melalui embed eksternal dari sumber yang diizinkan dan didukung.

**FR-009 — Informasi rekrutmen**

Sistem harus menampilkan informasi rekrutmen dan statusnya, yaitu dibuka atau ditutup.

**FR-010 — Tampilan tautan formulir**

Jika rekrutmen berstatus dibuka dan tautan formulir tersedia, sistem harus menampilkan tautan tersebut.

Jika rekrutmen berstatus ditutup, sistem harus menyembunyikan tautan formulir dari pengunjung.

**FR-011 — Kanal kontak**

Sistem harus menampilkan informasi atau tautan Instagram, Email, dan TikTok yang telah dikonfigurasi.

Kanal yang belum memiliki informasi valid tidak boleh menghasilkan tautan kosong atau rusak.

### 3.2 Autentikasi dan Akses CMS

**FR-012 — Login administrator**

Sistem harus menyediakan halaman login CMS menggunakan email dan kata sandi.

**FR-013 — Validasi autentikasi**

Sistem harus menolak autentikasi jika kredensial tidak valid dan menampilkan pesan kesalahan yang tidak membocorkan informasi sensitif.

**FR-014 — Pembatasan akses**

Sistem harus melindungi halaman dan tindakan pengelolaan konten dari pengguna yang belum terautentikasi.

**FR-015 — Logout**

Sistem harus menyediakan fungsi logout yang mengakhiri sesi administrator secara aman.

**FR-016 — Pemulihan kata sandi**

Sistem harus menyediakan mekanisme pemulihan kata sandi melalui email. Jika pemulihan email tidak dapat digunakan, tersedia prosedur bantuan teknis yang aman.

### 3.3 Pengelolaan Portofolio

**FR-017 — Menambah karya**

Administrator harus dapat membuat data karya baru melalui CMS.

**FR-018 — Mengedit karya**

Administrator harus dapat mengubah data karya yang sudah tersimpan tanpa perlu menghapus dan membuat ulang karya tersebut.

**FR-019 — Menghapus karya**

Administrator harus dapat menghapus karya secara permanen. Sistem harus meminta konfirmasi sebelum menjalankan penghapusan.

**FR-020 — Publikasi langsung**

Karya yang berhasil disimpan harus langsung tersedia pada website publik tanpa memerlukan proses publikasi terpisah.

**FR-021 — Field wajib karya**

Sistem harus mewajibkan informasi berikut saat menyimpan karya:

- Judul karya.
- Kategori yang valid.
- Media utama yang valid.

Deskripsi dan tanggal atau tahun publikasi bersifat opsional.

**FR-022 — Pemilihan karya unggulan**

Administrator harus dapat memilih karya unggulan dari data portofolio yang tersedia.

**FR-023 — Penghapusan karya unggulan**

Jika karya unggulan dihapus, sistem harus mengosongkan pilihan karya unggulan tersebut. Sistem tidak boleh memilih karya pengganti secara otomatis.

**FR-024 — Konsistensi data karya**

Sistem tidak boleh menampilkan karya yang telah dihapus atau media yang tidak valid sebagai karya publik.

### 3.4 Pengelolaan Kategori

**FR-025 — Menampilkan kategori**

CMS harus menampilkan daftar kategori portofolio yang tersedia.

**FR-026 — Menambah kategori**

Administrator harus dapat menambah kategori baru.

**FR-027 — Mengubah kategori**

Administrator harus dapat mengubah nama kategori yang sudah ada.

**FR-028 — Menghapus kategori**

Administrator harus dapat menghapus kategori yang tidak lagi diperlukan setelah seluruh karya yang terkait dipindahkan ke kategori pengganti yang valid.

**FR-029 — Validasi kategori pengganti**

Jika kategori masih digunakan oleh karya, sistem harus meminta administrator memilih kategori pengganti sebelum penghapusan. Penghapusan tidak boleh dilanjutkan jika kategori pengganti belum valid.

**FR-030 — Konsistensi kategori**

Sistem harus memastikan setiap karya yang masih tersedia memiliki referensi kategori yang valid.

Kategori awal yang harus tersedia adalah Graphic Design, Social Media Content, dan Video.

### 3.5 Pengelolaan Konten Home dan About

**FR-031 — Pengelolaan Home**

Administrator harus dapat mengubah konten Home yang telah ditetapkan sebagai konten yang dapat diedit melalui CMS.

**FR-032 — Pengelolaan About**

Administrator harus dapat mengubah konten profil, tujuan, dan informasi terkait Creatify pada halaman About.

**FR-033 — Penerapan perubahan**

Perubahan konten Home dan About yang berhasil disimpan harus langsung tercermin pada website publik.

### 3.6 Pengelolaan Kepengurusan

**FR-034 — Mengelola data kepengurusan**

Administrator harus dapat menambah, mengubah, dan menghapus data kepengurusan melalui CMS.

**FR-035 — Informasi kepengurusan**

Setiap data orang yang ditampilkan harus mendukung informasi nama, foto, serta jabatan atau peran.

**FR-036 — Penerapan perubahan kepengurusan**

Perubahan data kepengurusan yang berhasil disimpan harus tercermin pada halaman About.

### 3.7 Pengelolaan Rekrutmen

**FR-037 — Mengubah status rekrutmen**

Administrator harus dapat mengatur status rekrutmen menjadi dibuka atau ditutup.

**FR-038 — Mengubah informasi rekrutmen**

Administrator harus dapat memperbarui informasi rekrutmen dan tautan formulir eksternal.

**FR-039 — Konsistensi tampilan rekrutmen**

Website harus menerapkan aturan tampilan tautan formulir sesuai status rekrutmen sebagaimana dijelaskan pada FR-010.

### 3.8 Pengelolaan Kontak dan Media Sosial

**FR-040 — Mengubah informasi kontak**

Administrator harus dapat memperbarui informasi Instagram, Email, dan TikTok melalui CMS.

**FR-041 — Validasi informasi kontak**

Sistem harus memvalidasi format data yang relevan, misalnya format alamat email dan URL kanal media sosial.

### 3.9 Pengelolaan Media

**FR-042 — Unggah gambar**

Administrator harus dapat mengunggah gambar melalui CMS untuk digunakan pada karya atau konten yang mendukung media.

**FR-043 — Validasi gambar**

Sistem harus memvalidasi format dan ukuran gambar sebelum menerima unggahan.

Daftar format yang didukung dan batas ukuran maksimum akan ditentukan setelah lingkungan hosting dipilih.

**FR-044 — Penanganan unggahan gagal**

Jika unggahan gagal atau berkas tidak valid, sistem harus menampilkan pesan yang jelas dan tidak memperbarui media karya dengan berkas yang gagal diunggah.

**FR-045 — Sumber video eksternal**

Administrator harus dapat memasukkan atau memperbarui sumber video eksternal yang didukung untuk karya terkait.

**FR-046 — Validasi embed**

Sistem harus memvalidasi sumber embed berdasarkan daftar sumber atau format yang diizinkan. Sistem tidak boleh menjalankan kode embed sembarang tanpa pemeriksaan.

### 3.10 Validasi dan Penanganan Kesalahan

**FR-047 — Validasi formulir**

Sistem harus memvalidasi input wajib dan format data sebelum menyimpan perubahan.

**FR-048 — Pesan kesalahan**

Sistem harus memberikan pesan kesalahan yang jelas dan spesifik terhadap masalah yang terjadi.

**FR-049 — Mempertahankan input**

Jika validasi atau penyimpanan gagal, sistem harus mempertahankan input yang telah diisi sejauh aman dan memungkinkan, agar administrator tidak perlu mengisi ulang seluruh formulir.

**FR-050 — Konfirmasi tindakan destruktif**

Sistem harus meminta konfirmasi sebelum menjalankan penghapusan permanen data.

**FR-051 — Integritas data**

Sistem tidak boleh meninggalkan relasi data yang tidak valid akibat operasi pengubahan atau penghapusan.

---

## 4. Persyaratan Nonfungsional

### 4.1 NFR-001 — Kemudahan Penggunaan

Antarmuka harus memiliki navigasi yang jelas, label formulir yang mudah dipahami, dan umpan balik yang informatif terhadap tindakan pengguna.

### 4.2 NFR-002 — Responsivitas

Website publik dan CMS harus dapat digunakan pada desktop, tablet, dan perangkat seluler tanpa kehilangan fungsi utama.

### 4.3 NFR-003 — Keamanan Autentikasi

- Kata sandi harus disimpan menggunakan mekanisme hashing yang aman.
- Sesi administrator harus dikelola dengan aman.
- Halaman CMS harus terlindungi dari akses tanpa autentikasi.
- Proses pemulihan kata sandi harus menggunakan token atau mekanisme aman yang terbatas masa berlakunya.
- Pesan login dan pemulihan kata sandi tidak boleh membocorkan informasi yang tidak perlu.

### 4.4 NFR-004 — Keamanan Input dan Media

- Input harus divalidasi di sisi server, bukan hanya mengandalkan validasi antarmuka.
- Sistem harus mencegah input berbahaya dieksekusi sebagai kode.
- Unggahan harus dibatasi pada format dan ukuran yang diizinkan.
- Sumber embed video harus diperiksa sebelum digunakan.

### 4.5 NFR-005 — Kinerja

Halaman publik harus memuat dengan wajar pada koneksi internet umum. Gambar harus disajikan secara proporsional dan penggunaan media eksternal tidak boleh menyebabkan tata letak rusak.

Target numerik waktu muat dan ukuran media ditetapkan setelah desain teknis dan hosting dipilih.

### 4.6 NFR-006 — Konsistensi Data

Perubahan data harus disimpan secara konsisten. Operasi yang gagal tidak boleh meninggalkan keadaan parsial yang merusak relasi antara karya, kategori, media, atau konten terkait.

### 4.7 NFR-007 — Kemudahan Pemeliharaan

Konten rutin harus dapat dikelola melalui CMS. Struktur sistem harus memungkinkan penambahan karya dan kategori tanpa perubahan kode untuk setiap entri baru.

### 4.8 NFR-008 — Kompatibilitas Peramban

Website harus mendukung peramban modern yang umum digunakan. Daftar peramban dan versi minimum dapat ditentukan pada tahap pengujian.

### 4.9 NFR-009 — Aksesibilitas Dasar

Konten harus memiliki struktur heading yang masuk akal, kontras teks yang memadai, label formulir, serta teks alternatif untuk gambar yang informatif.

---

## 5. Aturan Bisnis

### BR-001 — Publikasi Langsung

Perubahan yang berhasil disimpan oleh administrator langsung berlaku pada website publik. MVP tidak menggunakan alur draft dan persetujuan publikasi terpisah.

### BR-002 — Karya Portofolio

Setiap karya yang tersedia untuk publik wajib memiliki judul, kategori valid, dan media utama yang valid.

### BR-003 — Penghapusan Permanen

Penghapusan karya bersifat permanen pada tingkat aplikasi. Sistem harus meminta konfirmasi terlebih dahulu.

### BR-004 — Karya Unggulan

Karya unggulan ditentukan manual oleh administrator. Jika karya tersebut dihapus, pilihan unggulan menjadi kosong hingga administrator memilih karya lain.

### BR-005 — Penghapusan Kategori

Kategori yang masih digunakan tidak dapat dihapus sebelum karya terkait dipindahkan ke kategori pengganti yang valid.

### BR-006 — Status Rekrutmen

Status rekrutmen hanya terdiri atas Dibuka dan Ditutup. Tautan formulir hanya boleh ditampilkan ketika status Dibuka dan tautan valid tersedia.

### BR-007 — Data Kepengurusan

Data kepengurusan dapat diperbarui melalui CMS dan perubahan yang berhasil disimpan langsung tercermin pada halaman publik terkait.

### BR-008 — Kontak

Kanal yang termasuk dalam MVP adalah Instagram, Email, dan TikTok. Informasi yang belum dikonfigurasi dengan benar tidak boleh ditampilkan sebagai tautan yang rusak.

### BR-009 — Sumber Media Eksternal

Video eksternal hanya boleh disematkan melalui sumber atau format yang telah diizinkan sistem.

---

## 6. Alur Sistem Utama

### 6.1 Alur Pengelolaan Karya

1. Administrator masuk ke CMS.
2. Administrator membuka modul portofolio.
3. Administrator memilih tindakan tambah atau edit karya.
4. Administrator mengisi judul, memilih kategori, dan menentukan media utama.
5. Administrator dapat melengkapi deskripsi, tanggal atau tahun publikasi, dan tautan konten asli.
6. Sistem memvalidasi input dan media.
7. Jika valid, sistem menyimpan perubahan.
8. Karya langsung ditampilkan atau diperbarui pada website publik.
9. Jika tidak valid, sistem menampilkan kesalahan dan mempertahankan input yang memungkinkan untuk dipulihkan.

### 6.2 Alur Penghapusan Karya

1. Administrator memilih karya yang akan dihapus.
2. Sistem menampilkan konfirmasi penghapusan permanen.
3. Administrator membatalkan atau mengonfirmasi tindakan.
4. Jika dikonfirmasi, sistem menghapus karya.
5. Jika karya tersebut merupakan karya unggulan, pilihan unggulan dikosongkan.
6. Karya yang dihapus tidak lagi ditampilkan pada website publik.

### 6.3 Alur Penghapusan Kategori

1. Administrator memilih kategori yang akan dihapus.
2. Sistem memeriksa apakah kategori masih digunakan.
3. Jika tidak digunakan, sistem dapat melanjutkan penghapusan setelah konfirmasi.
4. Jika masih digunakan, sistem meminta kategori pengganti.
5. Administrator memilih kategori pengganti yang valid.
6. Sistem memindahkan karya terkait ke kategori pengganti.
7. Sistem menghapus kategori lama setelah relasi karya diperbarui secara konsisten.

Jika pemindahan gagal, kategori tidak boleh dihapus dan relasi data harus tetap valid.

### 6.4 Alur Perubahan Status Rekrutmen

1. Administrator membuka modul Join Creatify.
2. Administrator memperbarui informasi, status, atau tautan formulir.
3. Sistem memvalidasi data.
4. Jika berhasil disimpan, perubahan langsung berlaku pada website publik.
5. Jika status Dibuka dan tautan tersedia, tautan formulir ditampilkan.
6. Jika status Ditutup, tautan formulir disembunyikan.

### 6.5 Alur Pemulihan Kata Sandi

1. Administrator meminta pemulihan melalui mekanisme email.
2. Sistem memproses permintaan dengan respons yang tidak membocorkan informasi sensitif.
3. Jika permintaan memenuhi syarat, sistem mengirim instruksi atau tautan pemulihan.
4. Tautan pemulihan memiliki masa berlaku terbatas dan hanya dapat digunakan sesuai aturan keamanan.
5. Administrator menetapkan kata sandi baru.
6. Jika metode email tidak dapat digunakan, pemulihan dapat dilakukan melalui bantuan teknis dengan prosedur aman yang ditetapkan.

---

## 7. Kriteria Penerimaan

Sistem memenuhi kebutuhan minimum apabila skenario berikut dapat diuji dan berhasil.

| ID | Skenario | Hasil yang diharapkan |
|---|---|---|
| AC-001 | Pengunjung membuka website | Lima halaman publik dapat diakses tanpa login. |
| AC-002 | Pengunjung membuka galeri | Karya tersedia ditampilkan dengan kategori yang benar. |
| AC-003 | Pengunjung membuka detail karya | Informasi karya ditampilkan sesuai data yang tersedia. |
| AC-004 | Administrator menambah karya valid | Karya tersimpan dan langsung tersedia di publik. |
| AC-005 | Administrator menyimpan karya tanpa judul | Sistem menolak penyimpanan dan menampilkan kesalahan. |
| AC-006 | Administrator memilih karya unggulan | Karya yang dipilih tampil pada Home. |
| AC-007 | Administrator menghapus karya unggulan | Pilihan unggulan dikosongkan dan tidak diganti otomatis. |
| AC-008 | Administrator menghapus kategori yang masih digunakan | Sistem meminta kategori pengganti sebelum menghapus kategori. |
| AC-009 | Administrator memindahkan karya ke kategori pengganti | Karya tetap tersedia dengan kategori valid dan kategori lama dapat dihapus. |
| AC-010 | Administrator mengubah konten Home atau About | Perubahan terlihat di website publik setelah penyimpanan berhasil. |
| AC-011 | Administrator mengubah data kepengurusan | Perubahan tercermin pada halaman About. |
| AC-012 | Rekrutmen dibuka dengan tautan valid | Informasi rekrutmen dan tautan formulir tampil. |
| AC-013 | Rekrutmen ditutup | Status penutupan tampil dan tautan formulir disembunyikan. |
| AC-014 | Administrator mengubah kanal kontak | Informasi Instagram, Email, dan TikTok mengikuti nilai yang tersimpan. |
| AC-015 | Administrator mengunggah gambar dengan format atau ukuran tidak valid | Unggahan ditolak dengan pesan yang jelas. |
| AC-016 | Administrator memasukkan sumber embed yang tidak diizinkan | Sistem menolak sumber tersebut. |
| AC-017 | Pengunjung mencoba mengakses fungsi CMS tanpa autentikasi | Akses pengelolaan ditolak. |
| AC-018 | Administrator memasukkan kredensial tidak valid | Login ditolak dengan pesan yang aman. |
| AC-019 | Penyimpanan formulir gagal | Sistem menampilkan kesalahan dan mempertahankan input yang memungkinkan. |
| AC-020 | Administrator membatalkan konfirmasi penghapusan | Data tidak dihapus. |

---

## 8. Persyaratan yang Belum Diputuskan

Beberapa detail memerlukan keputusan teknis atau operasional sebelum implementasi:

| Area | Hal yang belum ditetapkan | Dokumen tindak lanjut |
|---|---|---|
| Teknologi | Framework, bahasa pemrograman, dan arsitektur aplikasi | `04_SYSTEM_DESIGN.md` |
| Database | Skema tabel, relasi, indeks, dan aturan integritas | `05_DATABASE_DESIGN.md` |
| CMS | Struktur formulir, navigasi, detail perilaku modul, dan pengelolaan media | `06_CMS_SPECIFICATION.md` |
| Unggahan | Daftar format gambar dan batas ukuran maksimum | `04_SYSTEM_DESIGN.md`, `06_CMS_SPECIFICATION.md` |
| Video | Daftar sumber embed yang diizinkan | `04_SYSTEM_DESIGN.md`, `06_CMS_SPECIFICATION.md` |
| Autentikasi | Detail konfigurasi sesi, pembatasan percobaan login, dan masa berlaku pemulihan | `04_SYSTEM_DESIGN.md` |
| Email | Layanan pengiriman email pemulihan | `04_SYSTEM_DESIGN.md`, `08_DEPLOYMENT_AND_MAINTENANCE.md` |
| Hosting | Domain, penyimpanan media, konfigurasi server, dan backup | `08_DEPLOYMENT_AND_MAINTENANCE.md` |
| Kinerja | Target waktu muat dan pengujian performa | Dokumen desain dan pengujian yang relevan |
| Penghapusan media | Penanganan berkas media yang tidak lagi digunakan | `05_DATABASE_DESIGN.md`, `06_CMS_SPECIFICATION.md` |

Keputusan yang belum ditetapkan tidak boleh diasumsikan sebagai persyaratan final tanpa pembahasan dan pencatatan.

---

## 9. Ketentuan Konsistensi Dokumentasi

1. PRD menjadi acuan tujuan produk dan batas lingkup MVP.
2. SRS menjadi acuan perilaku sistem dan kriteria penerimaan.
3. Information Architecture menjelaskan struktur halaman dan navigasi.
4. System Design menjelaskan arsitektur dan keputusan teknis.
5. Database Design menjelaskan struktur dan relasi data.
6. CMS Specification menjelaskan detail interaksi administrator dan perilaku pengelolaan konten.
7. Decision Log mencatat keputusan penting, perubahan, alasan, dan dampaknya.
8. Deployment and Maintenance menjelaskan penerapan, konfigurasi operasional, backup, dan pemeliharaan.

Jika ada konflik antardokumen, konflik harus ditinjau dan diselesaikan sebelum implementasi yang terdampak dilanjutkan.

## 10. Penutup

SRS ini mendefinisikan kebutuhan minimum Creatify Digital Portfolio agar website publik dan CMS dapat dibangun secara konsisten dengan keputusan produk yang telah disepakati.

Dokumen ini menjadi dasar untuk menyusun Information Architecture, System Design, Database Design, CMS Specification, serta kriteria pengujian yang lebih rinci. Detail teknis yang belum diputuskan akan diselesaikan pada dokumen terkait, bukan diasumsikan dalam implementasi.