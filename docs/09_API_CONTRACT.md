# API CONTRACT DOCUMENT
## Creatify Digital Portfolio

**Versi:** 1.0  
**Status:** Disetujui  
**Bahasa:** Indonesia  
**Dokumen Acuan:** `00_PROJECT_BRIEF.md`, `01_PRD.md`, `02_SRS.md`, `03_INFORMATION_ARCHITECTURE.md`, `04_SYSTEM_DESIGN.md`, `05_DATABASE_DESIGN.md`, `06_CMS_SPECIFICATION.md`, `07_DECISION_LOG.md`

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen
Dokumen *API Contract* ini mendefinisikan spesifikasi antarmuka komunikasi data secara formal antara lapisan presentasi (*client/frontend*) dan lapisan pemrosesan bisnis (*server/backend*), baik yang diimplementasikan melalui **REST API Route Handlers** (`/api/*`) maupun **Next.js Server Actions**.

Dokumen ini menjamin:
1. **Kepastian Kontrak:** Struktur parameter masukan (*request payload/query*) dan luaran (*response payload*) terdefinisi secara presisi.
2. **Kekebalan Tipe Data (*Type-Safety*):** Seluruh kontrak dipetakan ke skema validasi pustaka **Zod** dan tipe data **TypeScript**.
3. **Standarisasi Respon:** Format respon sukses dan respon galat memiliki pola seragam di seluruh modul (*Universal Response Envelope*).
4. **Kesiapan Masa Depan (*Decoupled Readiness*):** Jika di masa mendatang fakultas membutuhkan aplikasi seluler native atau integrasi sistem informasi kampus, kontrak API ini sudah siap dikonsumsi.

---

## 2. Standar Protokol & Format Respon (*Universal Response Envelope*)

### 2.1 Konvensi HTTP
- **Format Pertukaran Data:** `application/json` (kecuali unggah berkas menggunakan `multipart/form-data`).
- **Autentikasi CMS:** Berbasis Cookie Sesi HTTP-Only terenkripsi (`creatify_admin_session`).
- **Header Keamanan:** Server menyertakan header keamanan ketat (CORS untuk domain resmi, CSRF protection, dan Content-Type nosniff).

### 2.2 Format Respon Sukses (*Success Envelope*)
Seluruh respon sukses mengembalikan objek dengan struktur standar:

```typescript
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    timestamp: string;
    total?: number;
    page?: number;
  };
}
```

Contoh respon sukses (HTTP 200/201):
```json
{
  "success": true,
  "data": {
    "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "title": "Rebranding Dies Natalis 32",
    "slug": "rebranding-dies-natalis-32"
  },
  "message": "Karya berhasil disimpan"
}
```

### 2.3 Format Respon Galat (*Error Envelope*)
Seluruh kegagalan (validasi, autentikasi, server) mengembalikan objek galat terstruktur:

```typescript
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;        // Kode galat terstandarisasi (misal: "VALIDATION_ERROR")
    message: string;     // Pesan ramah pengguna
    details?: Record<string, string[]>; // Rincian galat per-field jika ada
  };
  meta: {
    timestamp: string;
    path?: string;
  };
}
```

Contoh respon galat validasi formulir (HTTP 422 Unprocessable Entity):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data yang dimasukkan tidak valid",
    "details": {
      "title": ["Judul karya wajib diisi minimal 3 karakter"],
      "categoryId": ["Kategori yang dipilih tidak valid"]
    }
  },
  "meta": {
    "timestamp": "2026-10-26T20:00:00.000Z"
  }
}
```

### 2.4 Daftar Kode Galat Terstandarisasi

| Kode Galat | HTTP Status | Penjelasan |
|---|---|---|
| `UNAUTHORIZED` | 401 | Sesi admin tidak valid, telah kedaluwarsa, atau belum login. |
| `FORBIDDEN` | 403 | Permintaan tidak diizinkan untuk kredensial saat ini. |
| `NOT_FOUND` | 404 | Entitas data yang diminta tidak ditemukan. |
| `VALIDATION_ERROR` | 422 | Data input melanggar batasan skema Zod. |
| `CONFLICT` | 409 | Terjadi konflik unik (misal: slug atau email sudah terpakai). |
| `CATEGORY_RESTRICTED` | 400 | Kategori tidak dapat dihapus (tersisa 1 kategori atau karya belum dimigrasi). |
| `INTERNAL_ERROR` | 500 | Terjadi kegagalan pada basis data atau layanan pihak ketiga. |

---

## 3. Modul Autentikasi Administrator

### 3.1 Login Administrator
Membuka sesi administratif baru.

* **Metode / Rute:** `POST /api/auth/login` (atau Server Action `loginAction`)
* **Hak Akses:** Publik
* **Request Body:**
  ```json
  {
    "email": "admin@creatify.fasilkom.ac.id",
    "password": "PasswordSuperAman123!"
  }
  ```
* **Respon Sukses (200 OK):**
  - Mengeset Cookie: `creatify_admin_session=<encrypted_payload>; HttpOnly; Secure; SameSite=Lax; Path=/`
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "e4f80164-8977-4a4b-8e3d-71b55979f4cb",
        "email": "admin@creatify.fasilkom.ac.id"
      }
    },
    "message": "Login berhasil"
  }
  ```
* **Respon Galat (401 Unauthorized):**
  ```json
  {
    "success": false,
    "error": {
      "code": "INVALID_CREDENTIALS",
      "message": "Email atau kata sandi yang Anda masukkan salah."
    }
  }
  ```

---

### 3.2 Logout Administrator
Mengakhiri sesi aktif.

* **Metode / Rute:** `POST /api/auth/logout` (atau Server Action `logoutAction`)
* **Hak Akses:** Administrator
* **Respon Sukses (200 OK):**
  - Menghapus Cookie: `creatify_admin_session=; Max-Age=0; Path=/`
  ```json
  {
    "success": true,
    "message": "Sesi berhasil diakhiri"
  }
  ```

---

### 3.3 Permintaan Reset Kata Sandi (*Forgot Password*)
Membuat token pemulihan dan mengirimkan email.

* **Metode / Rute:** `POST /api/auth/forgot-password`
* **Hak Akses:** Publik
* **Request Body:**
  ```json
  {
    "email": "admin@creatify.fasilkom.ac.id"
  }
  ```
* **Respon Sukses (200 OK):**
  *(Pesan selalu netral untuk mencegah user enumeration)*
  ```json
  {
    "success": true,
    "message": "Jika email terdaftar, instruksi pemulihan kata sandi telah dikirimkan."
  }
  ```

---

### 3.4 Eksekusi Reset Kata Sandi (*Confirm Reset*)
Menetapkan kata sandi baru menggunakan token yang valid.

* **Metode / Rute:** `POST /api/auth/reset-password`
* **Request Body:**
  ```json
  {
    "token": "a1b2c3d4e5f6...",
    "newPassword": "PasswordBaruKuat2026!"
  }
  ```
* **Respon Sukses (200 OK):**
  ```json
  {
    "success": true,
    "message": "Kata sandi berhasil diperbarui. Silakan masuk kembali."
  }
  ```

---

## 4. Modul Portofolio & Karya

### 4.1 Mengambil Daftar Karya (Publik & CMS)

* **Metode / Rute:** `GET /api/portfolio`
* **Hak Akses:** Publik
* **Query Parameters:**
  - `category` *(opsional, string)*: Filter berdasarkan slug kategori (misal: `?category=graphic-design`).
  - `featured` *(opsional, boolean)*: Filter karya unggulan Home (`?featured=true`).
* **Respon Sukses (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "d16c5b02-5c91-4475-8022-799ff0d1a4e1",
        "title": "Dies Natalis Fasilkom 32 Branding",
        "slug": "dies-natalis-fasilkom-32-branding",
        "mediaType": "IMAGE",
        "mediaUrl": "https://res.cloudinary.com/.../dies-natalis.webp",
        "videoUrl": null,
        "videoEmbedUrl": null,
        "description": "Perancangan identitas visual lengkap perayaan dies natalis.",
        "releaseDate": "2026",
        "externalLink": "https://instagram.com/p/sample",
        "isFeatured": true,
        "category": {
          "id": "c001-uuid",
          "name": "Graphic Design",
          "slug": "graphic-design"
        },
        "createdAt": "2026-10-26T12:00:00.000Z"
      }
    ]
  }
  ```

---

### 4.2 Mengambil Detail Satu Karya

* **Metode / Rute:** `GET /api/portfolio/[slug]`
* **Hak Akses:** Publik
* **Respon Sukses (200 OK):** Mengembalikan objek tunggal karya lengkap.
* **Respon Galat (404 Not Found):**
  ```json
  {
    "success": false,
    "error": {
      "code": "PORTFOLIO_NOT_FOUND",
      "message": "Karya yang Anda cari tidak ditemukan atau telah dihapus."
    }
  }
  ```

---

### 4.3 Menambah Karya Baru (*Create*)

* **Metode / Rute:** `POST /api/portfolio` (atau Server Action `createPortfolioItem`)
* **Hak Akses:** Administrator
* **Request Body (JSON / Multipart):**
  ```json
  {
    "title": "Video Profil Mahasiswa Baru 2026",
    "slug": "video-profil-mahasiswa-baru-2026",
    "categoryId": "c002-uuid-social-media",
    "mediaType": "VIDEO",
    "mediaUrl": "https://res.cloudinary.com/.../thumbnail.webp",
    "mediaPublicId": "creatify/portfolio/thumb_123",
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "description": "Video dokumentasi rangkaian ospek fakultas.",
    "releaseDate": "Oktober 2026",
    "externalLink": "https://youtube.com/watch?v=dQw4w9WgXcQ",
    "isFeatured": true
  }
  ```
* **Respon Sukses (201 Created):**
  ```json
  {
    "success": true,
    "data": { "id": "uuid-karya-baru", "slug": "video-profil-mahasiswa-baru-2026" },
    "message": "Karya portofolio berhasil diterbitkan."
  }
  ```

---

### 4.4 Memperbarui Karya (*Update*)

* **Metode / Rute:** `PUT /api/portfolio/[id]` (atau Server Action `updatePortfolioItem`)
* **Hak Akses:** Administrator
* **Request Body:** Bidang data yang ingin diperbarui (parsial atau penuh).
* **Respon Sukses (200 OK):** Mengembalikan data karya yang telah dimutakhirkan.

---

### 4.5 Menghapus Karya (*Hard Delete*)

* **Metode / Rute:** `DELETE /api/portfolio/[id]` (atau Server Action `deletePortfolioItem`)
* **Hak Akses:** Administrator
* **Perilaku:** Menghapus data dari database dan memicu pembersihan berkas di Cloud Storage menggunakan `mediaPublicId`.
* **Respon Sukses (200 OK):**
  ```json
  {
    "success": true,
    "message": "Karya berhasil dihapus permanen beserta aset medianya."
  }
  ```

---

## 5. Modul Kategori Portofolio

### 5.1 Mengambil Semua Kategori
* **Metode / Rute:** `GET /api/categories`
* **Hak Akses:** Publik
* **Respon Sukses (200 OK):** Daftar kategori beserta `itemCount` (jumlah karya terhubung).

---

### 5.2 Menambah Kategori
* **Metode / Rute:** `POST /api/categories`
* **Hak Akses:** Administrator
* **Request Body:** `{ "name": "Motion Graphics" }`
* **Respon Sukses (201 Created):** Mengembalikan data kategori baru dengan slug otomatis `motion-graphics`.

---

### 5.3 Menghapus Kategori Terproteksi (*Delete with Migration*)
Sesuai **ADR-008** dan **SRS FR-028/029**.

* **Metode / Rute:** `DELETE /api/categories/[id]`
* **Hak Akses:** Administrator
* **Request Body:**
  ```json
  {
    "replacementCategoryId": "uuid-kategori-pengganti"
  }
  ```
  *(Kolom `replacementCategoryId` bersifat wajib jika kategori target masih memiliki karya terhubung).*
* **Aturan Khusus & Respon:**
  - Jika kategori aktif di sistem ≤ 1:
    ```json
    {
      "success": false,
      "error": {
        "code": "CATEGORY_RESTRICTED",
        "message": "Kategori tidak dapat dihapus karena hanya tersisa satu kategori aktif."
      }
    }
    ```
  - Jika berhasil dimigrasikan dan dihapus (200 OK):
    ```json
    {
      "success": true,
      "message": "Seluruh karya berhasil dipindahkan dan kategori lama telah dihapus."
    }
    ```

---

## 6. Modul Konten Halaman & Pengaturan

### 6.1 Konten Home (`/api/content/home`)
* **`GET /api/content/home`:** Mengambil headline, subheadline, tombol CTA, dan ID karya unggulan.
* **`PUT /api/content/home`:** Memperbarui teks hero dan array ID karya unggulan (maksimal 4 karya).
  ```json
  {
    "headline": "Creative Engine for Faculty Branding",
    "subheadline": "Mendukung komunikasi visual, desain grafis, dan publikasi media.",
    "ctaPrimaryText": "Lihat Portofolio",
    "ctaSecondaryText": "Tentang Kami",
    "featuredPortfolioIds": ["uuid-1", "uuid-2"]
  }
  ```

---

### 6.2 Konten About (`/api/content/about`)
* **`GET /api/content/about`** & **`PUT /api/content/about`**
* **Payload:**
  ```json
  {
    "tagline": "Crafting Impact Through Visual Stories",
    "profileText": "Creatify adalah tim kreatif resmi...",
    "visionGoals": [
      "Meningkatkan engagement publikasi fakultas",
      "Wadah pengembangan talenta kreatif mahasiswa"
    ],
    "facultyContribution": "Sebagai garda terdepan komunikasi visual..."
  }
  ```

---

### 6.3 Kepengurusan & Anggota (`/api/content/team`)
* **`GET /api/content/team`:** Mengambil daftar pengurus diurutkan berdasarkan `sortOrder ASC`.
* **`POST /api/content/team`:** Menambah anggota (Nama, Jabatan, `photoUrl`, `photoPublicId`, `sortOrder`).
* **`PUT /api/content/team/[id]`:** Memperbarui data anggota.
* **`DELETE /api/content/team/[id]`:** Menghapus anggota dan membersihkan foto profil dari Cloud Storage.
* **`PUT /api/content/team/reorder`:**
  Memperbarui urutan banyak anggota sekaligus:
  ```json
  {
    "orders": [
      { "id": "uuid-member-1", "sortOrder": 1 },
      { "id": "uuid-member-2", "sortOrder": 2 }
    ]
  }
  ```

---

### 6.4 Status & Informasi Rekrutmen (`/api/content/recruitment`)
* **`GET /api/content/recruitment`** & **`PUT /api/content/recruitment`**
* **Payload:**
  ```json
  {
    "isOpen": true,
    "title": "Open Recruitment Creatify 2026",
    "description": "Pendaftaran dibuka untuk posisi Graphic Designer dan Video Editor.",
    "formUrl": "https://forms.gle/sampleLink"
  }
  ```

---

### 6.5 Kanal Kontak & Media Sosial (`/api/settings/contact`)
* **`GET /api/settings/contact`** & **`PUT /api/settings/contact`**
* **Payload:**
  ```json
  {
    "instagramHandle": "@creatify.fasilkom",
    "instagramUrl": "https://instagram.com/creatify.fasilkom",
    "email": "creatify@cs.university.ac.id",
    "tiktokHandle": "@creatify.fasilkom",
    "tiktokUrl": "https://tiktok.com/@creatify.fasilkom"
  }
  ```

---

## 7. Modul Pengunggahan Media (*Direct Media Upload*)

* **Metode / Rute:** `POST /api/media/upload` (atau Server Action `uploadMediaAction`)
* **Content-Type:** `multipart/form-data`
* **Form-Data:**
  - `file`: Berkas gambar (JPG, PNG, WEBP, maks 5 MB).
  - `folder`: Subdirektori penyimpanan (`"portfolio"` atau `"team"`).
* **Respon Sukses (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "url": "https://res.cloudinary.com/creatify/image/upload/v1234/portfolio/karya1.webp",
      "publicId": "portfolio/karya1",
      "format": "webp",
      "width": 1920,
      "height": 1080
    }
  }
  ```

---

## 8. Modul Kesehatan Sistem (*Healthcheck*)

* **Metode / Rute:** `GET /api/health`
* **Hak Akses:** Publik (Digunakan oleh Uptime Monitor)
* **Respon Sukses (200 OK):**
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-10-26T20:00:00.000Z",
    "database": "connected",
    "uptime": 14256
  }
  ```

---

**Akhir dokumen `09_API_CONTRACT.md`**
