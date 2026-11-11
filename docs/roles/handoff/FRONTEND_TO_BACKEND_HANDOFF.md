# Serah Terima Front-end ke Back-end (`Creatify CMS & Website`)

Dokumen ini disusun sebagai panduan teknis komprehensif bagi **Back-end Developer** yang akan melanjutkan implementasi server, database, autentikasi, media storage, dan integrasi penuh pada proyek **Creatify**. Seluruh informasi di bawah ini mencerminkan **kondisi aktual kode Front-end** yang telah diselesaikan (termasuk pembaruan *mobile responsiveness*, sistem animasi *scroll-reveal*, aset logo vektor & *favicon*, serta audit kode & kompresi aset) dan siap/di-merge ke branch `main`.

> [!IMPORTANT]
> **Status Saat Ini:** Seluruh UI website publik (`/`, `/team`) — termasuk layout responsif mobile (`320px+`), dropdown navigasi mobile solid, modal video landscape hero, animasi *hero entrance* & `ScrollReveal`, *favicon* [`src/app/icon.svg`](file:///c:/Documents/Projects/Creatify/src/app/icon.svg), aset logo vektor `public/images/*-logo-creatify.svg`, halaman login (`/admin/login`), serta dashboard Admin CMS (`/admin`, `/admin/landing`, `/admin/team`, `/admin/settings`) — sudah selesai di sisi Front-end dengan state persisten sementara berbasis `localStorage` (`creatify-admin-cms-v1`) dan data fallback `DEFAULT_*`. Belum ada koneksi database Prisma, middleware autentikasi, route API (`/api/*`), maupun unggah media ke Cloudinary.

---

## 1. Ringkasan Stack & Ekosistem Proyek

Berdasarkan [`package.json`](file:///c:/Documents/Projects/Creatify/package.json), [`layout.tsx`](file:///c:/Documents/Projects/Creatify/src/app/layout.tsx), dan [`.env.example`](file:///c:/Documents/Projects/Creatify/.env.example):

- **Framework & Runtime:** Next.js `16.4.3` (App Router), React `19.3.0`
- **Styling & Ikon:** Tailwind CSS v4 (`@tailwindcss/turbopack`), `clsx`, `tailwind-merge`, `lucide-react` `^1.61.0`
- **Tipografi Lokal:** `Bricolage Grotesque` (`./fonts/bricolage-grotesque-latin.woff2`)
- **Validasi & ORM yang Tersedia:** `zod` `^4.6.7`, `@prisma/client` `^7.10.1`
- **Script Verifikasi (`package.json`):** `dev`, `build`, `start`, `lint`, `lint:fix`, `type-check`
- **Status Build & Verifikasi Terakhir:** `npm run type-check` lolos (`exit 0`), `npm run build` menghasilkan `10/10` static routes (termasuk `/icon.svg`), `npm run lint` bersih tanpa error (`0 errors`, `9` peringatan pre-existing `@next/next/no-img-element`), serta verifikasi browser mobile & desktop (`320x700`, `360x800`, `390x844`, `1440x900`) bebas *horizontal overflow* di mobile (`19/19` `ScrollReveal` tampil penuh, seluruh logo termuat).
- **Aset Brand & Favicon Vektor:**
  - [`public/images/blue-logo-creatify.svg`](file:///c:/Documents/Projects/Creatify/public/images/blue-logo-creatify.svg) (`1.671 bytes`) dan [`public/images/white-logo-creatify.svg`](file:///c:/Documents/Projects/Creatify/public/images/white-logo-creatify.svg) (`1.671 bytes`) — pure vector `<path>` SVG hasil kompresi/vektorisasi (`~98,3%` lebih kecil dibanding raster PNG-in-SVG sebelumnya).
  - [`src/app/icon.svg`](file:///c:/Documents/Projects/Creatify/src/app/icon.svg) (`1.825 bytes`) — favicon lingkaran biru `#2364E2` berisi logo putih Creatify menggantikan `src/app/favicon.ico` lama.
  - Aset starter bawaan Next.js di `public/` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) yang tidak terpakai telah dihapus.
- **Placeholder Kode Back-end yang Sudah Ada:**
  - [`prisma/schema.prisma`](file:///c:/Documents/Projects/Creatify/prisma/schema.prisma) (skema awal)
  - [`src/lib/cms.ts`](file:///c:/Documents/Projects/Creatify/src/lib/cms.ts) (stub Server Data Reader)
  - `src/actions/.gitkeep` (folder kosong siap pakai untuk Server Actions)
  - `middleware.ts` & `/api/*` **belum dibuat**.

---

## 2. Peta Rute & Konsolidasi Arsitektur vs Dokumen Lama

Pada dokumen perencanaan awal ([`FRONTEND_JOBDESK.md`](file:///c:/Documents/Projects/Creatify/docs/roles/FRONTEND_JOBDESK.md) & [`09_API_CONTRACT.md`](file:///c:/Documents/Projects/Creatify/docs/09_API_CONTRACT.md)), halaman publik dan CMS sempat direncanakan terpisah menjadi beberapa halaman (`/about`, `/portfolio`, `/join`, `/contact`, `/admin/portfolio`). Pada implementasi **Front-end final**, arsitektur dikonsolidasikan menjadi struktur yang jauh lebih ringkas dan fokus:

| Rute / Anchor Aktif | Jenis | File Utama | Status Implementasi FE |
| :--- | :--- | :--- | :--- |
| `/` (`#tentang`, `#divisi`, `#karya`, `#faq`, `#rekrutmen`, `#footer`) | Publik (Server Component) | [`src/app/page.tsx`](file:///c:/Documents/Projects/Creatify/src/app/page.tsx) | Selesai (membaca `getLandingContent()`) |
| `/team` | Publik (Server + Client) | [`src/app/team/page.tsx`](file:///c:/Documents/Projects/Creatify/src/app/team/page.tsx) | Selesai (membaca `getTeamPageContent()`) |
| `/icon.svg` | Metadata App Icon | [`src/app/icon.svg`](file:///c:/Documents/Projects/Creatify/src/app/icon.svg) | Selesai (otomatis terpasang sebagai `<link rel="icon">`) |
| `/admin/login` | Auth UI | [`src/app/admin/login/page.tsx`](file:///c:/Documents/Projects/Creatify/src/app/admin/login/page.tsx) | Selesai (masih mock check klien) |
| `/admin` | Dashboard Overview | [`src/app/admin/(dashboard)/page.tsx`](file:///c:/Documents/Projects/Creatify/src/app/admin/%28dashboard%29/page.tsx) | Selesai (quick switch & metrik CMS) |
| `/admin/landing?tab=...` | CMS Landing (`01–06`) | [`src/app/admin/(dashboard)/landing/page.tsx`](file:///c:/Documents/Projects/Creatify/src/app/admin/%28dashboard%29/landing/page.tsx) | Selesai (`localStorage` + Zod) |
| `/admin/team` | CMS Tim & Pengurus | [`src/app/admin/(dashboard)/team/page.tsx`](file:///c:/Documents/Projects/Creatify/src/app/admin/%28dashboard%29/team/page.tsx) | Selesai (CRUD di `localStorage`) |
| `/admin/settings` (`#akun`) | CMS Situs & Akun Admin | [`src/app/admin/(dashboard)/settings/page.tsx`](file:///c:/Documents/Projects/Creatify/src/app/admin/%28dashboard%29/settings/page.tsx) | Selesai (`localStorage` + validasi UI) |

> [!NOTE]
> Rute `/about`, `/portfolio`, `/join`, `/contact`, dan `/admin/portfolio` **tidak ada** dalam codebase aktual. Sementara itu, rute halaman tujuan tautan reset password (misalnya `/admin/reset-password`) **belum dibuat** dan perlu disepakati bersama saat implementasi token reset email.

---

## 3. Penjelasan Lengkap Implementasi Front-end

### A. Website Publik (`/` dan `/team`)

1. **Root Layout, Smooth Scroll, & Sistem Animasi ([`layout.tsx`](file:///c:/Documents/Projects/Creatify/src/app/layout.tsx), [`globals.css`](file:///c:/Documents/Projects/Creatify/src/app/globals.css), [`SmoothScroll.tsx`](file:///c:/Documents/Projects/Creatify/src/components/providers/SmoothScroll.tsx), [`ScrollReveal.tsx`](file:///c:/Documents/Projects/Creatify/src/components/ui/ScrollReveal.tsx))**
   - `generateMetadata()` pada `layout.tsx` mengambil metadata dasar situs secara dinamis melalui `getSiteSettings()` di `src/lib/cms.ts`, sementara `icon.svg` otomatis disajikan Next.js App Router sebagai *browser favicon*.
   - Seluruh halaman dibungkus `<SmoothScroll>` yang menerapkan wheel smooth scrolling berbasis LERP (`0.09`) khusus desktop. Fitur ini otomatis dinonaktifkan pada perangkat sentuh / `prefers-reduced-motion`, mengizinkan scroll native pada ancestor `HTMLElement` yang scrollable serta di dalam `[aria-modal="true"]`, dan mengunci background scroll saat modal terbuka.
   - [`globals.css`](file:///c:/Documents/Projects/Creatify/src/app/globals.css) mengatur transisi warna kanvas global berdurasi `500ms` melalui `#landing-canvas[data-stage="blue"]` dan `[data-stage-ready="true"] .stage-sync`, animasi masuk hero (`.hero-enter` tanpa blur untuk navbar & badge, serta `.hero-enter-blur` berurutan dengan `heroBlurClear` jernih di `58%`), animasi scroll-reveal (`.scroll-reveal`), keyframe (`slideUpFade`, `slideRightFade`, `fadeInSimple`), dukungan `prefers-reduced-motion`, serta kelas helper `.no-scrollbar` dan `.modal-scrollbar`.
   - [`ScrollReveal.tsx`](file:///c:/Documents/Projects/Creatify/src/components/ui/ScrollReveal.tsx) menyediakan wrapper *scroll-reveal* berbasis singleton `IntersectionObserver` yang mengubah `data-visible="true"` langsung pada DOM (tanpa React re-render saat scroll), dengan ritme durasi makin cepat ke bawah (`980ms` hingga `400ms`).

2. **Navbar Publik, Komponen UI & Hook Bersama ([`PublicNavbar.tsx`](file:///c:/Documents/Projects/Creatify/src/components/public/PublicNavbar.tsx), [`useDismissableLayer.ts`](file:///c:/Documents/Projects/Creatify/src/hooks/useDismissableLayer.ts), `src/components/ui/*`)**
   - Floating navigation pill responsif berbasis konfigurasi deklaratif `NAV_ITEMS` dengan animasi masuk turun (`-72px`) saat `animateOnMount` aktif. Di mobile, tombol menu polos (`Menu`/`X` tanpa latar lingkaran) membuka card dropdown putih solid (`bg-white`) sejajar di bawah logo ikon Creatify dan CTA **Jelajahi Portofolio** yang rapat di bawah **Kontak Resmi**. Mendukung scroll ke anchor section saat berada di `/`, sekaligus navigasi langsung ke `/team` dan kembali ke section landing dari halaman lain.
   - Menggunakan hook [`useDismissableLayers`](file:///c:/Documents/Projects/Creatify/src/hooks/useDismissableLayer.ts) (dipakai bersama oleh `PublicNavbar`, `HeroSection`, `ServicesSection`, dan `ContactSection`) yang hanya memasang listener `mousedown`, `touchstart`, dan `Escape` ketika layer aktif.
   - Menggunakan komponen reusable [`BrandLogo.tsx`](file:///c:/Documents/Projects/Creatify/src/components/ui/BrandLogo.tsx) (mendukung `variant="blue" | "white"` dan `shape="bare" | "circle"` dengan logo SVG vektor Creatify), [`AnimatedArrowBadge.tsx`](file:///c:/Documents/Projects/Creatify/src/components/ui/AnimatedArrowBadge.tsx), dan [`InstagramIcon.tsx`](file:///c:/Documents/Projects/Creatify/src/components/ui/InstagramIcon.tsx).

3. **Tujuh Section Landing Page ([`src/app/page.tsx`](file:///c:/Documents/Projects/Creatify/src/app/page.tsx))**
   - [`HeroSection.tsx`](file:///c:/Documents/Projects/Creatify/src/components/public/HeroSection.tsx): menampilkan ambient cobalt glow, badge, headline & 2 CTA dengan `.hero-enter` / `.hero-enter-blur` bertahap (*staggered*), video potret (`9/14`–`3/4`) di mobile dengan tombol overlay **"Lihat Penuh"** yang membuka modal penuh layar **landscape `16:9`** (menjeda video showcase sementara hingga ditutup via `closeFullLandscapeModal`), efek parallax video desktop (`scale 0.7..1.0`), tombol play/pause desktop, scroll-spy untuk highlight navbar, serta pengendali threshold transisi `#landing-canvas` antara `data-stage="blue"` dan `"light"` (memperbarui `document.body.style.backgroundColor`).
   - [`LogoMarquee.tsx`](file:///c:/Documents/Projects/Creatify/src/components/public/LogoMarquee.tsx): dual-track infinite marquee logo partner (`PARTNER_LOGOS`: `Forma`, `Vertex`, `Kinetix`, `Nexus`, `Aura`, `Onyx`, `Monolith`, `Astral`) dengan `.scroll-reveal` yang warnanya beradaptasi lewat `.stage-sync`.
   - [`AboutSection.tsx`](file:///c:/Documents/Projects/Creatify/src/components/public/AboutSection.tsx) (`#tentang`): headline 4 baris responsif (inline flow pada layar sempit, 4 baris rapi di `sm+`) dengan 2 gambar pil dekoratif borderless (`aria-hidden="true"`), paragraf narasi singkat, dan CTA menuju `/team`.
   - [`PortfolioSection.tsx`](file:///c:/Documents/Projects/Creatify/src/components/public/PortfolioSection.tsx) (`#divisi`): 3 kartu showcase divisi interaktif yang melebar saat aktif di desktop (`flex-[3.2]` aktif vs `flex-1` kolaps) atau bar ringkas ikon `+` saat kolaps di mobile, dengan pemetaan ikon preset `DIVISION_ICONS` (`"smile" | "video" | "share"`).
   - [`ServicesSection.tsx`](file:///c:/Documents/Projects/Creatify/src/components/public/ServicesSection.tsx) (`#karya`): showcase karya/portofolio bernuansa cobalt dengan 1–5 tab interaktif — dropdown pemilih kategori di mobile (`< md`) serta tombol `role="tablist"` / `tabpanel` di desktop — dan tombol CTA desktop menuju `#rekrutmen`.
   - [`FaqSection.tsx`](file:///c:/Documents/Projects/Creatify/src/components/public/FaqSection.tsx) (`#faq`): kolom kiri sticky (desktop smooth RAF follow), 1–6 item akordeon FAQ dinamis dengan `.scroll-reveal`, dan CTA `mailto:`.
   - [`ContactSection.tsx`](file:///c:/Documents/Projects/Creatify/src/components/public/ContactSection.tsx) (`#rekrutmen`, `#footer`): form pendaftaran rekrutmen terbuka dan footer 3 kolom menggunakan `<BrandLogo variant="white" />`.
     - **Mode Terbuka:** saat ini submit formulir menyusun tautan `mailto:` (`[Open Recruitment - Division] Name`) dan **tidak** mengirim request `POST` ke API/database.
     - **Mode Terkunci (`contact.isRecruitmentOpen === false`):** `<fieldset disabled>` mengunci seluruh input formulir. Ketika pengguna melakukan hover, fokus, atau tap pada kartu formulir, muncul overlay frosted satu kartu penuh berisi ikon gembok two-tone SVG, pesan penutupan `closedNotice` yang diperbesar, serta tombol kontak email langsung (bisa ditutup klik luar / `Escape` lewat `useDismissableLayers`).

4. **Halaman Tim & Pengurus ([`TeamPageClient.tsx`](file:///c:/Documents/Projects/Creatify/src/components/public/TeamPageClient.tsx), [`team.ts`](file:///c:/Documents/Projects/Creatify/src/data/team.ts))**
   - Filter divisi dibangun dari `DIVISION_OPTIONS` — berbentuk **dropdown option** (`useDismissableLayers`) di mobile (`< md`) dan **badge tab horizontal** di desktop (`md+`) — dengan urutan: `Ketua & Wakil` (`ketua-wakil`), `Executive Committee` (`executive-committee`), `Visual & Creative` (`visual-creative`), `Talent & Content` (`talent-content`), dan `Research Development` (`research-development`).
   - Tab **`executive-committee`** bersifat lintas divisi: memfilter semua anggota dengan `m.isLeader === true` (bawaan awal terdiri dari 5 leader di `TEAM_MEMBERS_DATA`). Tab lainnya memfilter berdasarkan `m.divisionId`.
   - Divisi `ketua-wakil` dirender dalam grid 1/2/4 kolom dengan kartu portrait `aspect-[3/4]` (tinggi fleksibel di mobile) + kartu quote (`quoteText` & opsional `avatar`), sedangkan divisi lain memakai grid 1/2/3 kolom hover-zoom. Tautan Instagram memakai fallback `member.instagramUrl || siteSettings.instagramUrl`.

---

### B. Dashboard Admin CMS & Autentikasi UI (`/admin/*`)

1. **Shell & State Management Sementara ([`AdminCmsProvider.tsx`](file:///c:/Documents/Projects/Creatify/src/components/admin/AdminCmsProvider.tsx), [`AdminShell.tsx`](file:///c:/Documents/Projects/Creatify/src/components/admin/AdminShell.tsx))**
   - Layout [`src/app/admin/(dashboard)/layout.tsx`](file:///c:/Documents/Projects/Creatify/src/app/admin/%28dashboard%29/layout.tsx) membungkus seluruh halaman dashboard (kecuali `/admin/login`) dengan `AdminCmsProvider` dan `AdminShell`.
   - `AdminCmsProvider` mengelola draft CMS menggunakan `window.localStorage` (key: `creatify-admin-cms-v1`), `useSyncExternalStore`, event kustom `creatify-cms-change`, sistem toast notifikasi, serta penyimpanan email admin aktif (`adminEmail`, default `DEFAULT_ADMIN_EMAIL = "admin@creatify.fasilkom.ac.id"` via `setStoredAdminEmail` dan `updateAdminEmail`).
   - Method mutasi yang tersedia pada provider: update per section landing, `upsertTeamMember`, `deleteTeamMember`, dan `resetAllToDefault`.
   - `AdminShell` menyediakan sidebar (`268px` desktop + drawer mobile) dengan submenu `01–06` `Konten Landing` yang dapat dilipat, CTA `Lihat Website`, dan tombol akun di bagian bawah yang menampilkan avatar inisial email, nama email satu baris terpotong (`ellipsis`), serta ikon `LogOut` ke `/admin/login`.

2. **Ringkasan Dashboard (`/admin`)**
   - Banner cobalt utama dengan `AdminSwitch` untuk mengganti status `isRecruitmentOpen` secara cepat tanpa harus masuk ke tab rekrutmen, 4 kartu metrik ringkasan, 6 pintasan ke editor landing (`?tab=...`), serta 5 tautan cepat (termasuk anchor `#akun`).

3. **Editor Konten Landing (`/admin/landing`)**
   - Konfigurasi navigasi berada di [`src/config/admin-landing-sections.ts`](file:///c:/Documents/Projects/Creatify/src/config/admin-landing-sections.ts) (`LandingTabKey`, `LANDING_FORM_IDS`, `LANDING_SECTION_NAV` `01`..`06`: `hero`, `tentang`, `divisi`, `karya`, `faq`, `rekrutmen`, serta `resolveLandingTabKey()`).
   - Terbagi ke dalam 3 modul editor di `src/components/admin/editors/`:
     - [`HeroAboutEditors.tsx`](file:///c:/Documents/Projects/Creatify/src/components/admin/editors/HeroAboutEditors.tsx) (`01 Hero`, `02 Tentang`)
     - [`ShowcaseEditors.tsx`](file:///c:/Documents/Projects/Creatify/src/components/admin/editors/ShowcaseEditors.tsx) (`03 Divisi`, `04 Karya`)
     - [`FaqContactEditors.tsx`](file:///c:/Documents/Projects/Creatify/src/components/admin/editors/FaqContactEditors.tsx) (`05 FAQ`, `06 Rekrutmen`)
     - [`validation.ts`](file:///c:/Documents/Projects/Creatify/src/components/admin/editors/validation.ts)
   - Tombol `Simpan Perubahan` berada di header kanan atas [`landing/page.tsx`](file:///c:/Documents/Projects/Creatify/src/app/admin/%28dashboard%29/landing/page.tsx) dan men-submit form aktif via atribut `form={activeSection.formId}` (didukung langsung oleh `AdminTextField` dan `AdminTextareaField` di [`AdminField.tsx`](file:///c:/Documents/Projects/Creatify/src/components/admin/AdminField.tsx)).
   - Seluruh input tervalidasi real-time & on-submit memakai skema Zod `landingContentSchema.shape.*`, batas karakter/item `LANDING_CONTENT_LIMITS`, serta penghitung kalimat `countSentences()` yang mengabaikan singkatan umum (`"Univ."`, `"Jl."`, `"No."`, `"Dr."`, `"Prof."`, `"Ir."`, `"St."`).

4. **Komponen Upload Gambar ([`AdminImageUpload.tsx`](file:///c:/Documents/Projects/Creatify/src/components/admin/AdminImageUpload.tsx))**
   - Memvalidasi format file (`JPG/PNG/WEBP`) dan batas ukuran (`maxSizeMb`).
   - **Cara kerja saat ini:** File gambar dikompresi langsung di browser menggunakan HTML5 `<canvas>` (`maxDimension = 1280`, kualitas `0.84`) lalu diubah menjadi string base64 `data:image/...`. Belum mengirim file ke endpoint upload cloud storage.

5. **Manajemen Tim & Pengurus (`/admin/team`)**
   - Mencakup `TeamHeaderForm` yang dapat dilipat untuk mengedit heading halaman tim (`titleLine1`, `titleLine2`, `subtitle`), fitur pencarian dan filter per divisi, modal tambah/edit scrollable (`.modal-scrollbar`, `compactActions` untuk upload portrait 3:4, switch `isLeader`, input `quoteText`), serta modal konfirmasi hapus (`AdminConfirmModal`).

6. **Pengaturan Situs & Akun (`/admin/settings`)**
   - Tata letak grid 2×2 berisi 4 form terpisah:
     1. `Identitas Brand & Metadata SEO`
     2. `Kanal Kontak & Media Sosial`
     3. `Informasi Sekretariat`
     4. `Akun Administrator` (`#akun` — `AdminAccountForm`)
   - Bagian bawah memiliki panel `Pulihkan Konten Bawaan` untuk menjalankan `resetAllToDefault()`.
   - Saat ini `AdminAccountForm` hanya memvalidasi di UI bahwa password lama tidak kosong, password baru minimal 8 karakter dan cocok konfirmasinya, lalu mengubah `adminEmail` di `localStorage` tanpa verifikasi hash password ke database.

7. **Halaman Login (`/admin/login`)**
   - Card autentikasi dua lapis bernuansa cobalt/putih dengan logo vektor [`/images/blue-logo-creatify.svg`](file:///c:/Documents/Projects/Creatify/public/images/blue-logo-creatify.svg) dan tombol kembali melingkar `<` di pojok kiri atas.
   - Berisi form email & password (saat ini mock check klien `password.length >= 6` lalu redirect ke `/admin`), tombol SSO `"Masuk dengan Google"` (`handleGoogleLogin`, masih mock/UI-only), serta mode inline `"Lupa Password"` (`viewMode === "forgot"`) yang saat ini baru menampilkan pesan konfirmasi statis di UI.

---

## 4. Kontrak Data & Pintu Integrasi Front-end

Back-end harus mematuhi struktur tipe data dan validasi yang sudah didefinisikan pada 4 file utama berikut:

1. [`src/types/cms.ts`](file:///c:/Documents/Projects/Creatify/src/types/cms.ts)
   - Tipe konfigurasi global: `SiteSettingsContent`, `TextFieldLimit`
   - Tipe landing page: `LandingPageContent` yang membawahi `HeroContent`, `MarqueeContent`, `AboutContent`, `DivisionCardIconKey` (`"smile" | "video" | "share"`), `DivisionCardContent`, `WorkTabContent`, `ServicesSectionContent`, `FaqItemContent`, `FaqSectionContent`, `RecruitmentDivisionOption`, `ContactSectionContent`
   - Tipe halaman tim: `TeamPageContent`
2. [`src/config/landing-cms.ts`](file:///c:/Documents/Projects/Creatify/src/config/landing-cms.ts)
   - Batas & helper: `LANDING_CONTENT_LIMITS`, `countSentences()`
   - Skema Zod: `siteSettingsSchema`, `landingContentSchema`, `teamPageContentSchema`, `mediaUrlSchema` (saat ini mengizinkan `/...`, `https://`, `http://`, maupun `data:image/`)
   - Data fallback: `DEFAULT_SITE_SETTINGS`, `DEFAULT_LANDING_CONTENT`, `DEFAULT_TEAM_PAGE_CONTENT`
3. [`src/data/team.ts`](file:///c:/Documents/Projects/Creatify/src/data/team.ts)
   - `DivisionId`: `"ketua-wakil" | "visual-creative" | "executive-committee" | "talent-content" | "research-development"`
   - `TeamMember`: `id`, `name`, `role`, `divisionId`, `photo`, `avatar?`, `quoteText?`, `instagramUrl?`, `isLeader?`
   - `DIVISION_OPTIONS` & `TEAM_MEMBERS_DATA`
4. [`src/config/site.ts`](file:///c:/Documents/Projects/Creatify/src/config/site.ts)
   - Konstanta default situs `SITE_CONFIG` (`Creatify`, `creatify@cs.university.ac.id`, `@creatify.fasilkom`, alamat sekretariat).
5. **Pintu Integrasi Read-Path: [`src/lib/cms.ts`](file:///c:/Documents/Projects/Creatify/src/lib/cms.ts)**
   - Saat ini mengekspor `getLandingContent()`, `getSiteSettings()`, dan `getTeamPageContent()` dengan fallback statis `DEFAULT_*`.
   - Mengganti isi ketiga fungsi ini agar melakukan query ke Prisma (+ `unstable_cache` / `revalidatePath`) akan **otomatis** memperbarui halaman publik `/`, `/team`, serta `generateMetadata()` di `layout.tsx` tanpa mengubah komponen UI publik.

---

## 5. Gap Analisis Kritis: Kode FE Aktual vs Rancangan BE Sebelumnya

Bagian ini sangat penting agar Back-end tidak salah membuat migrasi database atau API berdasarkan dokumen lama. Berikut perbedaan nyata antara [`prisma/schema.prisma`](file:///c:/Documents/Projects/Creatify/prisma/schema.prisma) / [`09_API_CONTRACT.md`](file:///c:/Documents/Projects/Creatify/docs/09_API_CONTRACT.md) dengan kode Front-end aktual:

### 1. Skema Database `TeamMember` (`prisma/schema.prisma`) Kurang Field
Model `TeamMember` (`team_members`) di `prisma/schema.prisma` saat ini baru memiliki `id`, `name`, `roleTitle`, `photoUrl`, `photoPublicId`, `sortOrder`, dan timestamps. Sementara FE [`TeamMember`](file:///c:/Documents/Projects/Creatify/src/data/team.ts) dan `/admin/team` membutuhkan:
- `divisionId` (`String`) untuk pengelompokan ke 5 divisi pada `DIVISION_OPTIONS`.
- `isLeader` (`Boolean @default(false)`) untuk mengisi tab lintas divisi **`Executive Committee`**.
- `quoteText` (`String?`) untuk kutipan pada kartu `ketua-wakil`.
- `avatar` / `avatarUrl` & `avatarPublicId` (`String?`, opsional) untuk avatar kotak tambahan pada kartu quote `ketua-wakil`.
- `instagramUrl` (`String?`) untuk tautan Instagram masing-masing pengurus.
- **Catatan penamaan & ID:** FE memakai nama properti `role` dan `photo`, sedangkan Prisma menamainya `roleTitle` dan `photoUrl` — perlu layer mapper atau penyeragaman nama kolom. Selain itu, ID mock di FE bertipe `${slug}-${Date.now()}`, bukan UUID.

### 2. Model `PortfolioItem` & `Category` vs Arsitektur `SiteSetting` / `LandingPageContent`
- Di `prisma/schema.prisma` dan [`09_API_CONTRACT.md`](file:///c:/Documents/Projects/Creatify/docs/09_API_CONTRACT.md) terdapat model `Category` (`categories`) dan `PortfolioItem` (`portfolio_items` dengan enum `MediaType { IMAGE, VIDEO }`, `videoEmbedUrl`, `releaseDate`, `isFeatured`, dst.).
- Pada implementasi **FE final**, seluruh showcase karya dikelola sebagai array `WorkTabContent[]` (`services.tabs`, maksimal 5 tab) di dalam `LandingPageContent`, tanpa fitur kategori terpisah ataupun CRUD item portofolio terpisah.
- Sebaliknya, model `SiteSetting` (`site_settings` dengan `key` `VarChar(50)` `@id` dan `payload` `Json`) **sangat cocok** dengan struktur terkelompok FE (`site_settings`, `hero`, `marquee`, `about`, `divisions`, `services`, `faq`, `contact`, serta heading `team_header` dari `TeamPageContent`).
- **Keputusan BE yang Diperlukan:** Sepakati apakah `services.tabs` disimpan sebagai payload JSON dalam `site_settings` (paling selaras dengan FE saat ini) atau dipetakan ke tabel relasional, serta rapikan `Category`/`PortfolioItem` jika memang tidak lagi dipakai.

### 3. Keterputusan Read & Write Path (`localStorage` vs Database)
- Saat ini, perubahan di `/admin/landing`, `/admin/team`, dan `/admin/settings` disimpan oleh [`AdminCmsProvider.tsx`](file:///c:/Documents/Projects/Creatify/src/components/admin/AdminCmsProvider.tsx) hanya ke `localStorage` browser (`creatify-admin-cms-v1`). Halaman publik `/` dan `/team` adalah Server Components yang membaca `src/lib/cms.ts` (`DEFAULT_*`), sehingga **edit di Admin tidak pernah muncul di halaman publik** sampai `src/lib/cms.ts` membaca database dan `AdminCmsProvider` / editor memanggil Server Actions / API plus `revalidatePath`.
- Untuk `/admin/team`, jika menggunakan Server Actions, pastikan ID anggota tim dibuat di server (misalnya UUID / CUID dari Prisma) dan urutan pengembalian array disinkronkan dengan `sortOrder`.

### 4. Pipeline Media Upload (`data:image/*` Base64 vs Cloudinary)
- [`AdminImageUpload.tsx`](file:///c:/Documents/Projects/Creatify/src/components/admin/AdminImageUpload.tsx) saat ini menghasilkan string base64 `data:image/...` dari `<canvas>`. Menyimpan base64 ke PostgreSQL akan memicu pembengkakan ukuran payload secara drastis.
- `.env.example` sudah menyiapkan `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, dan `CLOUDINARY_API_SECRET`, serta [`09_API_CONTRACT.md`](file:///c:/Documents/Projects/Creatify/docs/09_API_CONTRACT.md) merencanakan `POST /api/media/upload`.
- **Tindak lanjut:** Sediakan endpoint / Server Action upload media ke Cloudinary yang mengembalikan `url` HTTPS + `publicId`, modifikasi `AdminImageUpload.tsx` agar memanggil upload tersebut (dengan state loading/error), bersihkan aset Cloudinary lama saat gambar diganti/dihapus, dan pertimbangkan membatasi `mediaUrlSchema` agar tidak menerima `data:image/` setelah migrasi selesai (serta atur `images` pada `next.config.ts` bila nantinya memakai `next/image`).

### 5. Autentikasi, Google SSO, Middleware, & Reset Password
- **Proteksi Rute:** `middleware.ts` belum ada — saat ini siapa pun dapat membuka `/admin`, `/admin/landing`, `/admin/team`, dan `/admin/settings` secara langsung.
- **Kredensial & Session:** Login di [`/admin/login`](file:///c:/Documents/Projects/Creatify/src/app/admin/login/page.tsx) dan form ubah password di [`/admin/settings#akun`](file:///c:/Documents/Projects/Creatify/src/app/admin/%28dashboard%29/settings/page.tsx) baru melakukan simulasi di sisi klien. Perlu autentikasi terhadap tabel `users` (hashing Argon2id/Bcrypt + signed HTTP-only cookie memakai `AUTH_SECRET`).
- **Tombol `"Masuk dengan Google"`:** UI login baru menyertakan tombol Google SSO (`handleGoogleLogin`), yang belum ada pada `prisma/schema.prisma` maupun `docs/09_API_CONTRACT.md`. BE harus menentukan apakah akan mengintegrasikan Google OAuth (dengan whitelist email admin dari tabel `users`) atau menonaktifkan tombol tersebut hingga kredensial OAuth tersedia.
- **Alur Lupa Password:** Model `User` sudah memiliki `resetToken` & `resetTokenExpiresAt`, dan `.env.example` sudah memiliki `SMTP_*`. Namun halaman frontend `/admin/reset-password` (untuk menangkap `?token=...` dari email dan menyetel password baru) **belum dibuat**.

### 6. Formulir Rekrutmen Publik (`ContactSection.tsx`)
- Di [`ContactSection.tsx`](file:///c:/Documents/Projects/Creatify/src/components/public/ContactSection.tsx), submit form rekrutmen saat ini langsung membuka client email user lewat `mailto:`. Belum ada tabel database pendaftar maupun endpoint `POST` formulir. Jika pendaftar ingin dicatat di database atau dikirim via `SMTP_*` di server, perlu penambahan model database dan endpoint khusus.

---

## 6. Checklist Implementasi Terurut untuk Back-end Partner

Daftar tugas berikut melanjutkan rencana pada [`BACKEND_JOBDESK.md`](file:///c:/Documents/Projects/Creatify/docs/roles/BACKEND_JOBDESK.md) dengan menyesuaikan kondisi codebase FE aktual:

1. **Sinkronisasi Database & Migrasi (`prisma/schema.prisma`, `src/lib/db.ts`, `prisma/seed.ts`)**
   - [ ] Tambahkan `divisionId`, `isLeader`, `quoteText`, `avatarUrl`/`avatarPublicId`, dan `instagramUrl` pada model `TeamMember`.
   - [ ] Evaluasi penggunaan `Category` dan `PortfolioItem` vs penyimpanan section `LandingPageContent` + `team_header` pada `SiteSetting`.
   - [ ] Jalankan migrasi Prisma & buat `src/lib/db.ts` (singleton `PrismaClient`).
   - [ ] Buat `prisma/seed.ts` yang mengisi tabel `users` (akun admin awal), `site_settings` (dari `DEFAULT_SITE_SETTINGS`, `DEFAULT_LANDING_CONTENT`, `DEFAULT_TEAM_PAGE_CONTENT`), dan `team_members` (dari `TEAM_MEMBERS_DATA`).
2. **Keamanan & Autentikasi (`middleware.ts`, Auth Actions/API, `scripts/reset-admin.ts`)**
   - [ ] Implementasikan `middleware.ts` untuk memproteksi seluruh rute `/admin/*` (kecuali `/admin/login` dan rute reset password) serta memeriksa session cookie berbasis `AUTH_SECRET`.
   - [ ] Hubungkan `/admin/login` ke verifikasi `User.passwordHash`, tambahkan flow Google OAuth atau kesepakatan status tombol SSO, dan implementasikan logika kirim token email `SMTP_*` pada `Lupa Password`.
   - [ ] Siapkan endpoint/Server Action reset password + buatkan/hubungkan halaman `/admin/reset-password`.
   - [ ] Hubungkan `AdminAccountForm` di `/admin/settings#akun` ke verifikasi password lama + update `email` & `passwordHash` di DB serta sinkronisasi `adminEmail` pada header/sidebar session (menggantikan `localStorage`).
3. **Media Upload & Validasi Server (`src/lib/media.ts`, `src/lib/validations.ts`, `POST /api/media/upload`)**
   - [ ] Implementasikan integrasi Cloudinary (`CLOUDINARY_*`) dan endpoint/action upload gambar untuk menggantikan output base64 pada [`AdminImageUpload.tsx`](file:///c:/Documents/Projects/Creatify/src/components/admin/AdminImageUpload.tsx).
   - [ ] Tambahkan validasi Zod di server menggunakan skema pada [`landing-cms.ts`](file:///c:/Documents/Projects/Creatify/src/config/landing-cms.ts) dan bersihkan aset Cloudinary lama saat item diperbarui/dihapus.
4. **Koneksi Read & Write CMS (`src/lib/cms.ts`, `src/actions/*`)**
   - [ ] Ubah `getLandingContent()`, `getSiteSettings()`, dan `getTeamPageContent()` di [`src/lib/cms.ts`](file:///c:/Documents/Projects/Creatify/src/lib/cms.ts) agar membaca dari PostgreSQL via Prisma (pertimbangkan ISR / tag caching + `revalidatePath`).
   - [ ] Buat Server Actions (atau route handler API sesuai [`09_API_CONTRACT.md`](file:///c:/Documents/Projects/Creatify/docs/09_API_CONTRACT.md)) untuk: update per section landing, `upsertTeamMember` & `deleteTeamMember`, update `TeamHeader`, update pengaturan situs, serta `resetAllToDefault`.
   - [ ] Hubungkan [`AdminCmsProvider.tsx`](file:///c:/Documents/Projects/Creatify/src/components/admin/AdminCmsProvider.tsx) (atau refactoring editor agar memanggil Server Actions) sehingga perubahan di Admin langsung tersimpan di DB dan terefleksi pada `/` dan `/team`.
5. **Observability & Verifikasi Akhir**
   - [ ] Tambahkan `src/app/api/health/route.ts` untuk healthcheck database & service.
   - [ ] Jalankan verifikasi penuh setelah integrasi:
     ```bash
     npm run type-check
     npm run lint
     npm run build
     ```

