# Product Requirements Document (PRD)
## Creatify Digital Portfolio

**Status:** Disetujui  
**Versi:** 1.0  
**Jenis Produk:** Website portofolio publik dengan Content Management System (CMS) khusus

---

## 1. Ringkasan Produk

Creatify Digital Portfolio adalah website resmi tim kreatif Creatify yang mendukung branding dan komunikasi Fakultas Ilmu Komputer. Website ini berfungsi sebagai media untuk memperkenalkan identitas Creatify, menampilkan hasil karya, memberikan informasi mengenai tim dan kepengurusan, serta menyampaikan informasi rekrutmen.

Website dilengkapi CMS khusus agar administrator dapat memperbarui konten tanpa harus mengubah kode program secara langsung.

Produk terdiri atas dua bagian utama:

1. **Website publik**, yang dapat diakses pengunjung untuk mengenal Creatify dan melihat portofolionya.
2. **CMS**, yang digunakan administrator untuk mengelola portofolio, konten halaman, kepengurusan, status rekrutmen, serta informasi kontak dan media sosial.

Pengembangan MVP memprioritaskan keseimbangan antara pengalaman pengunjung dan kelengkapan fungsi pengelolaan konten.

## 2. Latar Belakang dan Permasalahan

Creatify membutuhkan media digital yang dapat merepresentasikan identitas tim secara konsisten dan profesional. Hasil karya yang telah dikumpulkan juga perlu ditampilkan dalam satu tempat agar mudah diakses dan dijelajahi.

Tanpa website terpusat, penyajian portofolio, informasi tim, dan informasi rekrutmen berpotensi tersebar di berbagai kanal. Perubahan informasi juga dapat menjadi kurang praktis apabila harus dilakukan melalui perubahan kode.

Website ini dikembangkan untuk menjawab kebutuhan tersebut melalui galeri portofolio yang terstruktur dan CMS yang memungkinkan pembaruan konten secara mandiri.

## 3. Tujuan Produk

### 3.1 Tujuan utama

- Meningkatkan kredibilitas dan citra profesional Creatify.
- Menampilkan hasil karya Creatify dalam galeri yang terstruktur.
- Memperkuat identitas Creatify sebagai tim kreatif yang mendukung branding dan komunikasi fakultas.
- Mempermudah pengunjung memperoleh informasi tentang Creatify dan kepengurusannya.
- Menyediakan informasi rekrutmen yang dapat diperbarui sesuai kondisi.
- Memungkinkan administrator mengelola konten website melalui CMS.

### 3.2 Indikator keberhasilan

Produk dinilai berhasil apabila:

- Pengunjung dapat mengakses seluruh halaman publik utama.
- Portofolio dapat ditelusuri berdasarkan kategori dan dibuka ke halaman detail karya.
- Karya unggulan yang dipilih administrator tampil di halaman Home.
- Informasi profil dan kepengurusan dapat diperbarui melalui CMS.
- Status rekrutmen dan tautan formulir dapat dikelola tanpa perubahan kode.
- Tautan Instagram, Email, dan TikTok dapat diperbarui melalui CMS.
- Perubahan konten yang disimpan administrator tercermin pada website publik.
- Website dapat digunakan dengan nyaman pada perangkat desktop dan perangkat seluler.

Target angka untuk metrik pengunjung, performa, dan ketersediaan layanan akan ditetapkan pada spesifikasi atau tahap pengujian yang relevan.

## 4. Target Pengguna

### 4.1 Pengunjung umum

Orang yang ingin mengenal Creatify, melihat karya, dan memahami kontribusinya.

Kebutuhan:
- Mengetahui identitas dan tujuan Creatify.
- Menjelajahi portofolio berdasarkan kategori.
- Melihat detail singkat suatu karya.
- Mengetahui susunan kepengurusan.
- Mengetahui status rekrutmen.
- Mengakses kanal kontak dan media sosial.

### 4.2 Mahasiswa dan civitas akademika

Pengguna yang ingin mengetahui aktivitas Creatify atau mencari informasi untuk bergabung.

Kebutuhan:
- Memahami peran Creatify di lingkungan fakultas.
- Melihat contoh karya dan bidang kreatif yang dikerjakan.
- Mengetahui apakah rekrutmen sedang dibuka.
- Mengakses formulir pendaftaran apabila tersedia dan rekrutmen sedang dibuka.

### 4.3 Administrator

Pengguna yang bertanggung jawab memelihara konten website.

Kebutuhan:
- Mengelola portofolio dan kategori.
- Menentukan karya unggulan.
- Memperbarui konten halaman publik.
- Mengelola informasi kepengurusan.
- Mengubah status rekrutmen dan tautan formulir.
- Mengubah informasi kontak dan tautan media sosial.

## 5. Ruang Lingkup Produk

### 5.1 Halaman website publik

Website publik terdiri atas lima halaman utama.

#### 5.1.1 Home

Tujuan: memperkenalkan Creatify secara ringkas dan mengarahkan pengunjung ke konten utama.

Kebutuhan:
- Menampilkan identitas dan pengenalan singkat Creatify.
- Menampilkan karya unggulan yang dipilih administrator.
- Menyediakan navigasi menuju halaman utama lainnya.
- Menampilkan ajakan untuk mengenal Creatify lebih lanjut atau melihat portofolio.
- Menampilkan akses ke kanal kontak dan media sosial yang ditetapkan.

Karya unggulan dipilih secara manual oleh administrator, bukan ditentukan otomatis berdasarkan tanggal publikasi.

Konten Home yang termasuk dalam lingkup CMS harus dapat diperbarui tanpa mengubah kode program.

#### 5.1.2 About

Tujuan: menjelaskan identitas, tujuan, kontribusi, dan struktur kepengurusan Creatify.

Kebutuhan:
- Menampilkan profil Creatify.
- Menjelaskan tujuan dan peran Creatify dalam mendukung branding serta komunikasi fakultas.
- Menampilkan struktur kepengurusan dan anggota.
- Menampilkan nama, foto, serta jabatan atau peran setiap orang.

Konten profil dan data kepengurusan dapat dikelola melalui CMS.

#### 5.1.3 Portfolio

Tujuan: menampilkan hasil karya Creatify secara terstruktur.

Kebutuhan:
- Menampilkan koleksi karya dalam bentuk galeri.
- Mengelompokkan karya berdasarkan kategori.
- Menyediakan halaman detail singkat untuk setiap karya.
- Mendukung gambar sebagai media portofolio.
- Mendukung video yang dapat diputar langsung melalui embed eksternal.
- Menyediakan tautan menuju konten asli apabila tersedia.

Kategori awal:
- Graphic Design
- Social Media Content
- Video

Administrator dapat menambah, mengubah nama, dan menghapus kategori melalui CMS.

Setiap karya setidaknya memiliki judul, kategori, dan media utama. Deskripsi singkat, tanggal atau tahun publikasi, serta tautan konten asli digunakan sesuai ketersediaan dan kebutuhan karya.

Pencarian berdasarkan judul, filter tahun, dan fitur penyaringan lanjutan lainnya tidak termasuk kebutuhan MVP yang telah disepakati.

#### 5.1.4 Join Creatify

Tujuan: memberikan informasi mengenai peluang bergabung dengan Creatify.

Kebutuhan:
- Menampilkan informasi dan penjelasan mengenai rekrutmen.
- Menampilkan status rekrutmen, yaitu dibuka atau ditutup.
- Menyediakan tautan formulir pendaftaran ketika rekrutmen dibuka.
- Memungkinkan administrator mengubah status rekrutmen dan tautan formulir melalui CMS.

Perilaku halaman:
- **Rekrutmen dibuka:** informasi rekrutmen dan tautan formulir ditampilkan.
- **Rekrutmen ditutup:** informasi rekrutmen tetap ditampilkan, status penutupan terlihat jelas, dan tautan formulir disembunyikan.

Website tidak menyediakan formulir pendaftaran internal maupun alur seleksi kandidat pada MVP. Pendaftaran dilakukan melalui formulir eksternal.

#### 5.1.5 Contact

Tujuan: mempermudah pengunjung menghubungi atau mengikuti kanal resmi Creatify.

Kebutuhan:
- Menampilkan tautan Instagram.
- Menampilkan informasi Email.
- Menampilkan tautan TikTok.
- Memungkinkan administrator memperbarui informasi tersebut melalui CMS.

Pengiriman pesan melalui formulir kontak internal tidak termasuk kebutuhan MVP.

### 5.2 CMS

CMS merupakan area pengelolaan konten yang diakses melalui autentikasi administrator.

MVP menggunakan satu akun administrator utama. Pengaturan multi-admin dan pembagian hak akses berdasarkan peran tidak termasuk lingkup awal.

Modul CMS yang diperlukan:

| Modul | Kebutuhan |
|---|---|
| Portofolio | Membuat, melihat, mengubah, dan menghapus data karya. |
| Kategori portofolio | Menambah, mengubah nama, dan menghapus kategori. |
| Karya unggulan | Memilih karya yang ditampilkan pada Home. |
| Konten Home | Mengubah konten yang ditetapkan dapat diedit pada halaman Home. |
| Konten About | Mengubah profil dan informasi mengenai Creatify. |
| Struktur kepengurusan | Mengelola data nama, foto, jabatan, dan peran. |
| Konten Join Creatify | Mengubah informasi rekrutmen, status, dan tautan formulir. |
| Kontak dan media sosial | Mengelola informasi Instagram, Email, dan TikTok. |

Pengelolaan konten dilakukan melalui formulir dan antarmuka CMS yang terstruktur. Page builder visual drag-and-drop tidak termasuk lingkup MVP.

### 5.3 Pengelolaan media

Kebutuhan:
- Gambar portofolio dan foto kepengurusan dapat diunggah melalui CMS.
- Video dapat menggunakan tautan atau embed dari layanan eksternal.
- Administrator dapat memperbarui media yang terkait dengan konten.
- Website harus menampilkan media dengan tata letak yang sesuai pada desktop maupun perangkat seluler.

Pemilihan layanan penyimpanan, batas ukuran berkas, format yang diizinkan, serta kebijakan optimasi media akan ditetapkan pada dokumen desain sistem dan deployment.

## 6. Kebutuhan Fungsional

| ID | Kebutuhan |
|---|---|
| FR-01 | Pengunjung dapat membuka halaman Home, About, Portfolio, Join Creatify, dan Contact. |
| FR-02 | Pengunjung dapat melihat daftar karya yang tersedia. |
| FR-03 | Pengunjung dapat menelusuri karya berdasarkan kategori. |
| FR-04 | Pengunjung dapat membuka halaman detail singkat karya. |
| FR-05 | Pengunjung dapat memutar video melalui embed eksternal jika media tersebut disediakan dalam format yang didukung. |
| FR-06 | Home menampilkan karya unggulan yang dipilih administrator. |
| FR-07 | Pengunjung dapat melihat profil dan struktur kepengurusan Creatify. |
| FR-08 | Pengunjung dapat mengetahui status rekrutmen. |
| FR-09 | Tautan formulir hanya ditampilkan ketika rekrutmen dibuka. |
| FR-10 | Pengunjung dapat mengakses kanal Instagram, Email, dan TikTok. |
| FR-11 | Administrator dapat mengakses CMS melalui autentikasi. |
| FR-12 | Administrator dapat mengelola data portofolio. |
| FR-13 | Administrator dapat mengelola kategori portofolio. |
| FR-14 | Administrator dapat memilih karya unggulan. |
| FR-15 | Administrator dapat mengelola konten Home dan About. |
| FR-16 | Administrator dapat mengelola data kepengurusan. |
| FR-17 | Administrator dapat mengelola konten dan status rekrutmen. |
| FR-18 | Administrator dapat mengelola informasi kontak dan media sosial. |
| FR-19 | Administrator dapat mengunggah gambar untuk digunakan pada konten yang didukung. |
| FR-20 | Administrator dapat menentukan tautan atau sumber embed video eksternal untuk karya yang relevan. |
| FR-21 | Perubahan konten yang berhasil disimpan dapat ditampilkan pada website publik. |

## 7. Kebutuhan Nonfungsional

### 7.1 Kemudahan penggunaan

- Navigasi publik harus jelas dan konsisten.
- Pengunjung dapat memahami struktur website tanpa panduan khusus.
- Formulir CMS menggunakan label dan validasi yang mudah dipahami.
- Pengelolaan konten umum tidak mengharuskan administrator mengubah kode program.

### 7.2 Responsivitas

- Website harus mendukung desktop, tablet, dan perangkat seluler.
- Galeri, detail karya, navigasi, dan formulir CMS harus tetap dapat digunakan pada layar yang lebih kecil.
- Gambar dan embed video tidak boleh merusak tata letak halaman.

### 7.3 Keamanan

- CMS harus dilindungi autentikasi.
- Hanya administrator yang terautentikasi dan berwenang yang dapat mengubah konten.
- Input dari formulir harus divalidasi dan ditangani secara aman.
- Pengelolaan unggahan harus membatasi tipe berkas yang diizinkan dan menghindari unggahan berbahaya.
- Pengelolaan tautan embed eksternal harus membatasi sumber atau format yang diizinkan untuk mengurangi risiko keamanan.

### 7.4 Kinerja

- Halaman publik harus dimuat secara wajar pada koneksi internet umum.
- Gambar perlu disajikan dengan ukuran yang sesuai dan tidak membebani halaman secara berlebihan.
- Penggunaan embed video eksternal harus mempertimbangkan dampaknya terhadap waktu muat halaman.

Target numerik kinerja akan ditentukan ketika rancangan teknis dan lingkungan deployment telah dipilih.

### 7.5 Kemudahan pemeliharaan

- Konten harus dapat diperbarui melalui CMS.
- Struktur data dan implementasi harus mendukung penambahan kategori serta karya baru.
- Konfigurasi sensitif tidak boleh ditanamkan langsung ke kode yang dipublikasikan.

## 8. Aturan Bisnis

### 8.1 Portofolio

- Setiap karya harus memiliki identitas yang unik.
- Setiap karya harus terhubung dengan kategori yang valid.
- Karya unggulan harus berasal dari data portofolio yang tersedia.
- Karya yang ditampilkan pada website publik harus memiliki data dan media yang layak ditampilkan.
- Kategori dapat dikelola secara dinamis melalui CMS.
- Penghapusan kategori harus menangani karya yang terkait secara aman dan konsisten. Perilaku pastinya akan ditetapkan pada Database Design dan CMS Specification.

### 8.2 Rekrutmen

- Status rekrutmen hanya memiliki dua keadaan: dibuka dan ditutup.
- Ketika status dibuka, tautan formulir dapat ditampilkan jika telah dikonfigurasi.
- Ketika status ditutup, tautan formulir tidak ditampilkan kepada pengunjung.
- Administrator bertanggung jawab memastikan informasi rekrutmen dan tautan formulir tetap relevan.

### 8.3 Kepengurusan

- Data kepengurusan dikelola melalui CMS.
- Setiap data anggota memuat nama, foto, serta jabatan atau peran sesuai kebutuhan tampilan.
- Administrator dapat memperbarui data ketika terjadi perubahan kepengurusan.

### 8.4 Kontak

- Kanal kontak yang termasuk lingkup MVP adalah Instagram, Email, dan TikTok.
- Nilai tautan atau informasi kontak dikelola melalui CMS.
- Kanal yang belum memiliki informasi valid tidak boleh menghasilkan tautan yang rusak.

## 9. Prioritas MVP

### 9.1 Prioritas utama

Fitur berikut wajib tersedia untuk MVP:

- Lima halaman publik utama.
- Galeri portofolio dan halaman detail karya.
- Kategori portofolio yang dapat dikelola melalui CMS.
- Pemilihan karya unggulan secara manual.
- Pengelolaan konten Home dan About.
- Pengelolaan struktur kepengurusan.
- Pengelolaan status dan informasi rekrutmen.
- Pengelolaan kanal kontak dan media sosial.
- Pengunggahan gambar dan dukungan embed video eksternal.
- Autentikasi administrator.
- Tampilan responsif dan validasi input dasar.

### 9.2 Tidak termasuk MVP

- Formulir pendaftaran internal dan sistem seleksi rekrutmen.
- Sistem berita atau artikel berkala.
- Komentar, forum, atau fitur sosial internal.
- Multi-admin dengan hak akses berbeda.
- Page builder visual drag-and-drop.
- Aplikasi seluler native.
- Analitik pengunjung tingkat lanjut.
- Pencarian portofolio berdasarkan judul.
- Filter tahun dan filter lanjutan lainnya.
- Pengelolaan kanal komunikasi di luar Instagram, Email, dan TikTok, kecuali diputuskan kemudian.

Fitur yang tidak termasuk MVP dapat dievaluasi kembali apabila kebutuhan produk berubah.

## 10. Kriteria Penerimaan

MVP dianggap memenuhi kebutuhan apabila skenario berikut berhasil diuji:

1. Pengunjung dapat membuka kelima halaman publik tanpa harus masuk ke CMS.
2. Pengunjung dapat melihat portofolio berdasarkan kategori dan membuka detail karya.
3. Karya unggulan yang dipilih administrator muncul pada Home.
4. Administrator dapat menambah kategori baru dan menggunakannya untuk karya.
5. Administrator dapat mengubah konten Home dan About, kemudian melihat perubahan pada website publik.
6. Administrator dapat menambah dan memperbarui data kepengurusan.
7. Saat rekrutmen dibuka, tautan formulir tampil jika tersedia.
8. Saat rekrutmen ditutup, status penutupan tampil dan tautan formulir disembunyikan.
9. Administrator dapat memperbarui Instagram, Email, dan TikTok melalui CMS.
10. Gambar yang diunggah dapat digunakan pada karya atau konten yang mendukung.
11. Video yang menggunakan sumber embed yang didukung dapat diputar pada detail karya.
12. Pengguna tanpa otorisasi tidak dapat mengubah konten melalui CMS.
13. Website tetap dapat digunakan pada desktop dan perangkat seluler.

## 11. Asumsi dan Keputusan yang Belum Ditetapkan

PRD ini belum menetapkan keputusan teknis berikut:

- Framework dan bahasa pemrograman.
- Database.
- Mekanisme autentikasi dan pemulihan akses administrator.
- Penyedia hosting dan domain.
- Lokasi penyimpanan gambar serta batas ukuran unggahan.
- Layanan video eksternal dan daftar sumber embed yang diizinkan.
- Mekanisme backup dan pemulihan data.
- Target numerik performa dan ketersediaan.
- Detail implementasi penghapusan kategori yang masih memiliki karya terkait.
- Mekanisme publikasi konten, termasuk apakah perubahan langsung tampil atau memerlukan tindakan publikasi.

Keputusan tersebut dibahas dalam dokumen SRS, System Design, Database Design, CMS Specification, serta Deployment and Maintenance sesuai relevansinya.

## 12. Dokumen Terkait

PRD ini merupakan bagian dari dokumentasi proyek Creatify Digital Portfolio dan harus konsisten dengan:

- `00_PROJECT_BRIEF.md`
- `02_SRS.md`
- `03_INFORMATION_ARCHITECTURE.md`
- `04_SYSTEM_DESIGN.md`
- `05_DATABASE_DESIGN.md`
- `06_CMS_SPECIFICATION.md`
- `07_DECISION_LOG.md`
- `08_DEPLOYMENT_AND_MAINTENANCE.md`

Jika ditemukan ketidaksesuaian antardokumen, keputusan produk yang telah disepakati harus ditinjau dan dicatat sebelum spesifikasi implementasi diubah.