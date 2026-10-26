# Dokumentasi Resmi Proyek Creatify Digital Portfolio

Selamat datang di repositori dokumentasi resmi **Creatify Digital Portfolio**. Direktori ini memuat seluruh dokumen spesifikasi produk, kebutuhan perangkat lunak, arsitektur informasi, desain sistem, desain basis data, spesifikasi CMS, catatan keputusan arsitektur, dan panduan pemeliharaan operasional.

---

## 1. Peta Indeks Dokumentasi

Setiap dokumen memiliki tanggung jawab spesifik (*single responsibility*) untuk memastikan tidak terjadi tumpang tindih maupun inkonsistensi informasi:

| Berkas | Nama Dokumen | Tanggung Jawab & Cakupan | Status |
|---|---|---|---|
| [00_PROJECT_BRIEF.md](file:///c:/Documents/Projects/Creatify/docs/00_PROJECT_BRIEF.md) | **Project Brief** | Visi proyek, latar belakang, tujuan utama, identitas visual tim, ruang lingkup umum, dan batasan non-tujuan (*non-goals*). | Disetujui |
| [01_PRD.md](file:///c:/Documents/Projects/Creatify/docs/01_PRD.md) | **Product Requirements Document (PRD)** | Kebutuhan produk, persona audiens, rincian fitur MVP vs non-MVP, aturan bisnis, dan kriteria penerimaan produk. | Disetujui |
| [02_SRS.md](file:///c:/Documents/Projects/Creatify/docs/02_SRS.md) | **Software Requirements Specification (SRS)** | Spesifikasi kebutuhan perangkat lunak formal (`FR-001` s/d `FR-051`), kebutuhan non-fungsional (`NFR`), aturan bisnis sistem, dan skenario pengujian (`AC`). | Disetujui |
| [03_INFORMATION_ARCHITECTURE.md](file:///c:/Documents/Projects/Creatify/docs/03_INFORMATION_ARCHITECTURE.md) | **Information Architecture (IA)** | Hierarki halaman publik, seksi konten, alur navigasi pengunjung, skema URL/slug, serta struktur navigasi CMS. | Disetujui (v1.1) |
| [04_SYSTEM_DESIGN.md](file:///c:/Documents/Projects/Creatify/docs/04_SYSTEM_DESIGN.md) | **System Design Document** | Arsitektur teknis full-stack (Next.js App Router), pipeline media, sanitasi video embed, autentikasi sesi, dan desain keamanan OWASP. | Disetujui |
| [05_DATABASE_DESIGN.md](file:///c:/Documents/Projects/Creatify/docs/05_DATABASE_DESIGN.md) | **Database Design Document** | Entity-Relationship Diagram (ERD), skema tabel PostgreSQL, kode skema Prisma lengkap, transaksi migrasi kategori, dan seeder data awal. | Disetujui |
| [06_CMS_SPECIFICATION.md](file:///c:/Documents/Projects/Creatify/docs/06_CMS_SPECIFICATION.md) | **CMS Specification** | Tata letak dashboard, spesifikasi formulir per modul, validasi input, status interaksi, konfirmasi aksi destruktif, dan panduan UX admin. | Disetujui |
| [07_DECISION_LOG.md](file:///c:/Documents/Projects/Creatify/docs/07_DECISION_LOG.md) | **Architecture Decision Log (ADR)** | Catatan rekaman keputusan arsitektur (ADR-001 s/d ADR-009) beserta konteks, keputusan, dan konsekuensinya. | Disetujui |
| [08_DEPLOYMENT_AND_MAINTENANCE.md](file:///c:/Documents/Projects/Creatify/docs/08_DEPLOYMENT_AND_MAINTENANCE.md) | **Deployment & Maintenance Guide** | Panduan hosting produksi (Vercel / Docker), variabel lingkungan, otomatisasi CI/CD, backup/restore database, dan emergency CLI runbook. | Disetujui |
| [09_API_CONTRACT.md](file:///c:/Documents/Projects/Creatify/docs/09_API_CONTRACT.md) | **API Contract Document** | Format respon standar (Universal Response Envelope), spesifikasi endpoint publik & CMS, skema payload Zod, dan healthcheck. | Disetujui |

---

## 2. Panduan Alur Membaca Berdasarkan Peran

Untuk memahami proyek secara efektif sesuai tanggung jawab Anda:

```mermaid
flowchart TD
    Role{"Siapa Anda?"}
    
    Role -->|Pengurus / Product Owner| PO["Baca Berurutan:<br/>1. 00_PROJECT_BRIEF.md<br/>2. 01_PRD.md<br/>3. 03_INFORMATION_ARCHITECTURE.md"]
    Role -->|Desainer UI/UX| UI["Baca Berurutan:<br/>1. 01_PRD.md<br/>2. 03_INFORMATION_ARCHITECTURE.md<br/>3. 06_CMS_SPECIFICATION.md"]
    Role -->|Pengembang Web (Full-Stack)| DEV["Baca Berurutan:<br/>1. 02_SRS.md<br/>2. 07_DECISION_LOG.md<br/>3. 04_SYSTEM_DESIGN.md<br/>4. 05_DATABASE_DESIGN.md<br/>5. 06_CMS_SPECIFICATION.md<br/>6. 09_API_CONTRACT.md"]
    Role -->|DevOps / Tim Server| OPS["Baca Berurutan:<br/>1. 07_DECISION_LOG.md<br/>2. 04_SYSTEM_DESIGN.md<br/>3. 08_DEPLOYMENT_AND_MAINTENANCE.md"]
```

---

## 3. Ringkasan Eksekutif Arsitektur & Teknologi

- **Aplikasi Full-Stack:** Next.js (App Router) + TypeScript
- **Basis Data & ORM:** PostgreSQL 14+ dengan Prisma ORM
- **Autentikasi CMS:** Stateless Encrypted Session Cookie (HttpOnly) + Argon2id / Bcrypt
- **Penyimpanan Media:** Cloudinary / Supabase Storage dengan otomatisasi WebP & CDN
- **Penyedia Video yang Didukung:** YouTube & Vimeo (Regex-sanitized responsive embed)
- **Strategi Publikasi:** *Direct Publishing* (Simpan = Terbit seketika via `revalidatePath`)

---

## 4. Ketentuan Pemeliharaan & Perubahan Dokumentasi

1. **Konsistensi Data adalah Prioritas Utama:** Jika ada perubahan fitur bisnis, mutakhirkan terlebih dahulu [01_PRD.md](file:///c:/Documents/Projects/Creatify/docs/01_PRD.md) dan catat perubahannya di [07_DECISION_LOG.md](file:///c:/Documents/Projects/Creatify/docs/07_DECISION_LOG.md).
2. **Hindari Hardcoding:** Tidak ada data dinamis (nama kategori, kuota karya, tautan kontak) yang boleh di-*hardcode* di antarmuka tanpa merujuk ke basis data.
3. **Pencatatan ADR:** Setiap perubahan teknologi atau pola arsitektur penting di masa depan wajib dicatat sebagai entri ADR baru di [07_DECISION_LOG.md](file:///c:/Documents/Projects/Creatify/docs/07_DECISION_LOG.md).

---

*Creatify — Fakultas Ilmu Komputer*
