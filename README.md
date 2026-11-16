# Creatify — Digital Portfolio & Creative CMS

Official digital portfolio and Content Management System (CMS) for the creative team under the Faculty of Computer Science, Universitas Mercu Buana. Built with Next.js (App Router), TypeScript, Tailwind CSS, and Prisma ORM.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.10-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## Overview

Creatify is a production-ready web platform developed for the creative and multimedia division of the Faculty of Computer Science. The application serves two main objectives:

1. **Public Showcase:** An interactive, responsive digital portfolio that highlights student creative work, division structures, and organization profiles.
2. **Administrative CMS:** A secure, internal dashboard for non-technical administrators to manage landing page content, team member profiles, and creative portfolio entries.

---

## System Architecture

The project follows a monolithic full-stack architecture powered by the Next.js App Router:

| Layer | Technology | Role |
|---|---|---|
| Full-Stack Framework | Next.js 16 (App Router) | Server Components (RSC), Server Actions, and REST Route Handlers |
| Programming Language | TypeScript 5.x | End-to-end static typing across database schemas, API contracts, and UI components |
| Styling & Typography | Tailwind CSS v4 & Bricolage Grotesque | Utility-first CSS engine with fluid typography and dark/light stage transitions |
| Database & ORM | PostgreSQL 16 & Prisma ORM 7 | Relational database modeling with pg connection pool adapter and versioned migrations |
| Authentication | Bcrypt.js & Jose | Salted password hashing (12 rounds) and stateless encrypted JWT session cookies (HttpOnly, SameSite=Lax) |
| Schema Validation | Zod | Runtime validation for form payloads, server actions, and API request bodies |
| Media Storage Pipeline | Cloudinary & Local Fallback | Automated WebP conversion, global CDN delivery, and zero-leak asset cleanup |
| Hosting & Cloud | Vercel & Supabase | Serverless edge deployment with hosted cloud PostgreSQL database |

---

## Core Capabilities

### Public Interface
- **Responsive Layout:** Fluid layout transitions supporting viewport sizes from 320px mobile screens to 1440px+ ultra-wide desktop displays without horizontal overflow.
- **Cinematic Hero:** Hybrid video showcase supporting both YouTube embeds and uploaded MP4/WebM files, paired with scroll-driven parallax effects.
- **Team Directory:** Public team overview (`/team`) featuring mobile division dropdown filtering, desktop badge navigation, quote cards, and optimized profile photography.
- **Performant Motion:** Entrance animations calibrated with cubic-bezier curves, singleton `IntersectionObserver` scroll reveals, and full support for `prefers-reduced-motion`.

### Administrative CMS (`/admin`)
- **Session Security:** Route protection enforced via Next.js Middleware and server-side layout guards.
- **Dynamic Content Management:** Live content updates for hero headlines, about text, services, recruitment status, FAQ items, and official contact channels.
- **Portfolio Engine:** Categorized portfolio management with automated slug generation, external video sanitization (YouTube/Vimeo XSS protection), and atomic transactions on category deletion.
- **Interactive Image Cropper:** Integrated client-side modal for cropping, panning, and zooming profile pictures to enforce aspect ratio consistency.
- **Unsaved Changes Guard:** Real-time dirty state tracking to alert administrators before accidental navigation away from unsaved form modifications.
- **Storage Lifecycle Management:** Automatic deletion of obsolete media assets upon profile or portfolio updates to prevent storage quota accumulation.

---

## Directory Structure

```text
├── prisma/                    # Relational database schema, migrations, and seeder
│   ├── migrations/            # Version-controlled SQL migration files
│   ├── schema.prisma          # Prisma schema definition
│   └── seed.ts                # Initial seeder for admin, categories, and team members
├── public/                    # Static assets (vector SVG logos, web fonts, uploaded media)
├── scripts/                   # Emergency administrative CLI tools (password recovery)
├── src/
│   ├── actions/               # Server Actions (Auth, Content, Media, Portfolio, Team)
│   ├── app/                   # App Router pages, admin dashboard, and REST API routes
│   │   ├── admin/             # Internal CMS dashboard routes
│   │   ├── api/               # Public and authenticated REST endpoints
│   │   ├── team/              # Public team directory route
│   │   ├── layout.tsx         # Root application layout
│   │   └── page.tsx           # Public landing page
│   ├── components/            # Reusable UI component modules
│   │   ├── admin/             # CMS form editors, modals, and dashboard shell
│   │   ├── public/            # Public page sections (Hero, About, Services, Team, FAQ)
│   │   └── ui/                # Atomic UI elements (ScrollReveal, AnimatedArrowBadge)
│   ├── config/                # Default content schemas and validation constraints
│   ├── data/                  # Static team member data and division taxonomies
│   ├── lib/                   # Core utilities (database singleton, auth, media, video sanitizer)
│   ├── middleware.ts          # Route protection and session authentication middleware
│   └── types/                 # TypeScript type definitions and standard API response envelopes
├── docker-compose.yml         # Local PostgreSQL container configuration
└── package.json               # Project manifest, dependency definitions, and build scripts
```

---

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher
- PostgreSQL database instance (local via Docker or cloud via Supabase)

### Installation
```bash
git clone https://github.com/zidan-maulana/Creatify.git
cd Creatify
npm install
```

### Environment Configuration
Copy the template environment file:
```bash
cp .env.example .env
```

Ensure the following variables are defined in `.env`:
```env
DATABASE_URL="postgresql://user:password@host:port/dbname?schema=public"
DIRECT_URL="postgresql://user:password@host:port/dbname?schema=public"
AUTH_SECRET="your-cryptographic-random-secret-key-min-32-chars"
NODE_ENV="development"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Database Migration and Seeding
Apply database migrations and populate default data:
```bash
npx prisma migrate deploy
npx prisma db seed
```

Default administrative credentials created by the seed script:
- **Email:** `admin@creatify.fasilkom.ac.id`
- **Password:** `PasswordSuperAman123!`

### Running the Development Server
```bash
npm run dev
```

The application will be accessible at:
- Public Site: `http://localhost:3000`
- CMS Login: `http://localhost:3000/admin/login`

---

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Compile optimized production build and generate static routes |
| `npm run start` | Run Next.js production server |
| `npm run type-check` | Execute TypeScript type checking without emitting files |
| `npm run lint` | Run ESLint static code analysis |
| `npm run db:seed` | Execute Prisma database seeder script |
| `npm run admin:reset` | Run emergency command-line interface to reset admin credentials |

---

## License

Developed for internal and public media operations by the Creatify team, Faculty of Computer Science, Universitas Mercu Buana. All rights reserved.
