# Creatify Digital Portfolio

Website resmi tim kreatif pendukung *branding* dan komunikasi Fakultas Ilmu Komputer. Dibangun menggunakan **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, dan **Prisma ORM (PostgreSQL)**.

---

## 📚 Dokumentasi Proyek

Seluruh dokumentasi teknis, arsitektur, dan spesifikasi tersedia lengkap di folder [`docs/`](./docs/README.md):

* [00_PROJECT_BRIEF.md](./docs/00_PROJECT_BRIEF.md) — Visi dan ruang lingkup proyek
* [01_PRD.md](./docs/01_PRD.md) — Kebutuhan produk dan prioritas fitur
* [02_SRS.md](./docs/02_SRS.md) — Spesifikasi kebutuhan perangkat lunak (FR/NFR/AC)
* [03_INFORMATION_ARCHITECTURE.md](./docs/03_INFORMATION_ARCHITECTURE.md) — Struktur navigasi publik & CMS
* [04_SYSTEM_DESIGN.md](./docs/04_SYSTEM_DESIGN.md) — Arsitektur teknis dan pipeline sistem
* [05_DATABASE_DESIGN.md](./docs/05_DATABASE_DESIGN.md) — Skema database dan ERD
* [06_CMS_SPECIFICATION.md](./docs/06_CMS_SPECIFICATION.md) — Panduan spesifikasi antarmuka CMS
* [07_DECISION_LOG.md](./docs/07_DECISION_LOG.md) — Rekaman keputusan arsitektur (ADR)
* [08_DEPLOYMENT_AND_MAINTENANCE.md](./docs/08_DEPLOYMENT_AND_MAINTENANCE.md) — Panduan deployment & pemeliharaan
* [09_API_CONTRACT.md](./docs/09_API_CONTRACT.md) — Spesifikasi endpoint & skema komunikasi data

---

## 🚀 Memulai Pengembangan (*Getting Started*)

### 1. Salin Konfigurasi Environment
```bash
cp .env.example .env.local
```

### 2. Jalankan Server Pengembangan
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat aplikasi.

---

## 🛠️ Pembagian Kerja Tim

* **Front-end:** Bertanggung jawab atas antarmuka publik (`src/components/public`, `src/app/(public)`), komponen UI (`src/components/ui`), dan tampilan antarmuka CMS (`src/components/admin`, `src/app/admin`).
* **Back-end:** Bertanggung jawab atas integrasi database PostgreSQL (`prisma/schema.prisma`), Server Actions (`src/actions`), autentikasi sesi, dan integrasi Cloud Storage (`src/lib`).
