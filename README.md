# Creatify Digital Portfolio

Website resmi tim kreatif pendukung *branding* dan komunikasi Fakultas Ilmu Komputer. Dibangun menggunakan Next.js (App Router), TypeScript, Tailwind CSS, dan Prisma ORM (PostgreSQL).

---

## Dokumentasi Proyek

Seluruh dokumentasi teknis, arsitektur, dan spesifikasi tersedia lengkap di folder [`docs/`](./docs/README.md):

* [00_PROJECT_BRIEF.md](./docs/00_PROJECT_BRIEF.md) — Visi dan ruang lingkup proyek
* [01_PRD.md](./docs/01_PRD.md) — Kebutuhan produk dan prioritas fitur
* [02_SRS.md](./docs/02_SRS.md) — Spesifikasi kebutuhan perangkat lunak (FR/NFR/AC)
* [03_INFORMATION_ARCHITECTURE.md](./docs/03_INFORMATION_ARCHITECTURE.md) — Struktur navigasi publik dan CMS
* [04_SYSTEM_DESIGN.md](./docs/04_SYSTEM_DESIGN.md) — Arsitektur teknis dan pipeline sistem
* [05_DATABASE_DESIGN.md](./docs/05_DATABASE_DESIGN.md) — Skema database dan ERD
* [06_CMS_SPECIFICATION.md](./docs/06_CMS_SPECIFICATION.md) — Panduan spesifikasi antarmuka CMS
* [07_DECISION_LOG.md](./docs/07_DECISION_LOG.md) — Rekaman keputusan arsitektur (ADR)
* [08_DEPLOYMENT_AND_MAINTENANCE.md](./docs/08_DEPLOYMENT_AND_MAINTENANCE.md) — Panduan deployment dan pemeliharaan
* [09_API_CONTRACT.md](./docs/09_API_CONTRACT.md) — Spesifikasi endpoint dan skema komunikasi data
* [docs/roles/FRONTEND_JOBDESK.md](./docs/roles/FRONTEND_JOBDESK.md) — Panduan dan batasan kerja Front-end Developer
* [docs/roles/BACKEND_JOBDESK.md](./docs/roles/BACKEND_JOBDESK.md) — Panduan dan batasan kerja Back-end Developer

---

## Panduan Memulai Pengembangan

### 1. Konfigurasi Lingkungan
Salin berkas template environment ke berkas lokal:
```bash
cp .env.example .env.local
```

### 2. Menjalankan Server Pengembangan
```bash
npm run dev
```

Aplikasi dapat diakses melalui peramban pada alamat [http://localhost:3000](http://localhost:3000).

---

## Struktur dan Pembagian Peran Tim

* **Front-end Developer:** Bertanggung jawab atas implementasi antarmuka publik (`src/components/public`, `src/app/(public)`), komponen UI atomik (`src/components/ui`), dan antarmuka dashboard CMS (`src/components/admin`, `src/app/admin`).
* **Back-end Developer:** Bertanggung jawab atas pengelolaan skema basis data PostgreSQL (`prisma/schema.prisma`), Server Actions (`src/actions`), autentikasi sesi, serta integrasi Cloud Storage (`src/lib`).
