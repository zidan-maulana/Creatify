# DEPLOYMENT AND MAINTENANCE GUIDE
## Creatify Digital Portfolio

**Versi:** 1.0  
**Status:** Disetujui  
**Dokumen Acuan:** `00_PROJECT_BRIEF.md`, `01_PRD.md`, `02_SRS.md`, `04_SYSTEM_DESIGN.md`, `05_DATABASE_DESIGN.md`, `07_DECISION_LOG.md`

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen
Dokumen ini merupakan panduan operasional teknis untuk *deployment* (penerapan ke lingkungan produksi), konfigurasi infrastruktur, strategi pencadangan (*backup*), pemulihan bencana (*disaster recovery*), serta pemeliharaan berkala untuk sistem **Creatify Digital Portfolio**.

Panduan ini disusun dengan mempertimbangkan karakteristik organisasi mahasiswa di lingkungan Fakultas Ilmu Komputer yang mengutamakan keandalan, keamanan, kemudahan pemeliharaan, serta efisiensi biaya infrastruktur.

---

## 2. Pilihan Arsitektur Hosting & Infrastruktur

Sistem dirancang fleksibel untuk mendukung dua skenario penerapan:

### 2.1 Skenario A: Modern Serverless / PaaS (Direkomendasikan)
Skenario terbaik untuk kemudahan pemeliharaan tanpa beban administrasi server fisik:

| Komponen | Penyedia Layanan | Keuntungan |
|---|---|---|
| **Aplikasi Full-Stack** | **Vercel** / **Railway** | Pemuatan instan melalui Global Edge Network, integrasi Git otomatis, SSL otomatis, zero-maintenance. |
| **Basis Data Relasional** | **Supabase Database** / **Neon Serverless PostgreSQL** | Database PostgreSQL terkelola, otomatisasi backup point-in-time, aman diakses melalui *connection pool*. |
| **Penyimpanan Media** | **Cloudinary** / **Supabase Storage** | Transformasi gambar otomatis ke format WebP, penyimpanan CDN global yang cepat. |
| **Mail Gateway (Reset Pwd)** | **Resend** / **SendGrid** / SMTP Resmi Kampus | Pengiriman email transaksi token reset password yang andal. |

### 2.2 Skenario B: Server Mandiri Kampus / VPS (Docker Compose)
Jika fakultas menyediakan *Virtual Private Server* (VPS) atau server lokal laboratorium:
- Seluruh aplikasi dikemas dalam berkas `docker-compose.yml` yang menjalankan:
  1. Kontainer Aplikasi Next.js (Node.js Standalone mode).
  2. Kontainer PostgreSQL 16.
  3. Reverse Proxy Nginx dengan sertifikat SSL Let's Encrypt (Certbot).

---

## 3. Konfigurasi Variabel Lingkungan (*Environment Variables*)

Aplikasi membaca konfigurasi dari berkas `.env.production` di server. Berkas ini bersifat **sangat rahasia** dan tidak boleh dikomit ke repositori publik Git.

```bash
# ==========================================
# 1. DATABASE CONNECTION
# ==========================================
# Format URL PostgreSQL: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
DATABASE_URL="postgresql://creatify_user:secretpass@db.example.com:5432/creatify_db?sslmode=require"

# ==========================================
# 2. AUTENTIKASI & KEAMANAN SESI
# ==========================================
# String acak minimal 32 karakter untuk enkripsi cookie sesi (buat via: openssl rand -base64 32)
AUTH_SECRET="k9X!bL3#mQ8$zP1@vW7&yT5*uR2^eN4("
NODE_ENV="production"

# ==========================================
# 3. PENYIMPANAN CLOUD STORAGE (MEDIA ASSETS)
# ==========================================
# Opsi Cloudinary:
CLOUDINARY_CLOUD_NAME="creatify-fasilkom"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz12345"

# ==========================================
# 4. SMTP MAIL SERVICE (RESET PASSWORD)
# ==========================================
SMTP_HOST="smtp.resend.com"
SMTP_PORT=465
SMTP_USER="resend"
SMTP_PASS="re_123456789abcdef"
SMTP_FROM="Creatify Admin <noreply@creatify.fasilkom.ac.id>"

# ==========================================
# 5. DOMAIN & URL PUBLIK
# ==========================================
NEXT_PUBLIC_SITE_URL="https://creatify.fasilkom.ac.id"
```

---

## 4. Prosedur *Deployment* Awal (*First-Time Deployment*)

Ikuti langkah-langkah berikut saat pertama kali men-deploy aplikasi ke server produksi:

### Langkah 1: Kloning Repositori & Instalasi Dependensi
```bash
git clone https://github.com/creatify/creatify-portfolio.git
cd creatify-portfolio
npm ci
```

### Langkah 2: Konfigurasi Environment
Salin berkas template dan sesuaikan dengan kredensial produksi:
```bash
cp .env.example .env.production
nano .env.production
```

### Langkah 3: Eksekusi Migrasi Database & Seeding
Jalankan migrasi skema tabel ke database PostgreSQL produksi dan isi data kategori awal serta akun admin default:
```bash
# 1. Terapkan seluruh migrasi skema database
npx prisma migrate deploy

# 2. Jalankan seeder data awal (Kategori & Akun Admin Awal)
npx prisma db seed
```

### Langkah 4: Kompilasi & Menjalankan Aplikasi
```bash
# Build produksi
npm run build

# Menjalankan server Next.js produksi
npm run start
```

---

## 5. Alur Pembaruan Aplikasi Berkelanjutan (*CI/CD Workflow*)

Penerapan otomatisasi menggunakan **GitHub Actions** untuk memastikan setiap kode yang digabungkan ke cabang `main` telah melewati pemeriksaan kualitas (*code quality gate*):

```mermaid
flowchart LR
    A["Push ke cabang 'main'"] --> B["Linting & Type Check<br/>(npm run lint & tsc)"]
    B --> C["Generate Prisma Client"]
    C --> D["Production Build Test<br/>(npm run build)"]
    D -->|Lolos Uji| E["Deploy Otomatis ke Vercel / Server"]
    E --> F["Jalankan Migrasi DB:<br/>prisma migrate deploy"]
    F --> G["Aplikasi Aktif & Siap Digunakan"]
```

---

## 6. Prosedur Pencadangan & Pemulihan Basis Data (*Backup & Recovery Runbook*)

### 6.1 Strategi Pencadangan Terjadwal (Automated Daily Backup)
Jika menggunakan server mandiri atau cron job terjadwal, jalankan skrip berikut setiap hari pada pukul 02:00 dini hari:

```bash
#!/bin/bash
# Simpan sebagai: /scripts/db-backup.sh
BACKUP_DIR="/var/backups/creatify"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="creatify_backup_${TIMESTAMP}.sql.gz"

mkdir -p $BACKUP_DIR
pg_dump $DATABASE_URL | gzip > "${BACKUP_DIR}/${FILENAME}"

# Hapus cadangan yang lebih tua dari 30 hari
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +30 -delete
echo "Backup berhasil disimpan: ${FILENAME}"
```

### 6.2 Prosedur Pemulihan Data (*Database Disaster Recovery*)
Jika terjadi kegagalan sistem dan data perlu dipulihkan dari berkas cadangan:
```bash
# 1. Hentikan aplikasi sementara untuk mencegah penulisan data baru
# 2. Eksekusi pemulihan data dari berkas cadangan terbaru:
gunzip -c /var/backups/creatify/creatify_backup_20261026_020000.sql.gz | psql $DATABASE_URL

# 3. Validasi status data melalui Prisma Studio:
npx prisma studio
```

---

## 7. Prosedur Pemulihan Akses Darurat Administrator (*Emergency Runbook*)

Sesuai **ADR-009**, jika administrator lupa kata sandi dan layanan email SMTP mengalami kendala, gunakan skrip darurat langsung di terminal server:

```bash
# Menjalankan skrip reset kata sandi darurat
npm run admin:reset -- --email="admin@creatify.fasilkom.ac.id" --password="PasswordBaruSuperAman2026!"
```

**Mekanisme Kerja Skrip:**
1. Membaca koneksi `DATABASE_URL` dari `.env.production`.
2. Melakukan *hashing* kata sandi baru menggunakan Argon2id / Bcrypt.
3. Memperbarui kolom `password_hash` pada tabel `users`.
4. Mengosongkan token reset lama (`reset_token = NULL`).
5. Mencatat log keberhasilan pembaruan kredensial.

---

## 8. Pemantauan Kesehatan Sistem (*Healthcheck & Monitoring*)

1. **Endpoint Healthcheck (`/api/health`):**
   - Rute API publik ringan yang menguji konektivitas ke database PostgreSQL:
     ```json
     {
       "status": "healthy",
       "timestamp": "2026-10-26T19:40:00.000Z",
       "database": "connected",
       "uptime": 14256
     }
     ```
2. **Pemantau Uptime Eksternal (*External Uptime Monitor*):**
   - Menggunakan layanan gratis seperti **Better Stack (Uptime)** atau **UptimeRobot** untuk melakukan *ping* ke rute `/api/health` setiap 5 menit.
   - Mengirimkan peringatan langsung ke Telegram / Email pengurus jika website mengalami *downtime*.
3. **Pembersihan Berkas Media Sampah (*Orphan Storage Audit*):**
   - Jalankan skrip audit berkala (`npm run media:audit`) sekali setiap semester untuk mencocokkan aset di Cloud Storage dengan data di tabel `portfolio_items` dan `team_members`. Berkas yang tidak lagi memiliki referensi di database dapat dihapus guna menghemat kapasitas penyimpanan.

---

**Akhir dokumen `08_DEPLOYMENT_AND_MAINTENANCE.md`**
