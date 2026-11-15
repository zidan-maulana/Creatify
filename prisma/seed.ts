import "dotenv/config";
import bcrypt from "bcryptjs";
import { db as prisma } from "../src/lib/db";
import {
  DEFAULT_LANDING_CONTENT,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_TEAM_PAGE_CONTENT,
} from "../src/config/landing-cms";
import { TEAM_MEMBERS_DATA } from "../src/data/team";

async function main() {
  console.log("🌱 Memulai inisialisasi database (seeding)...");

  // 1. Akun Administrator Default
  const adminEmail =
    process.env.ADMIN_SEED_EMAIL || "admin@creatify.fasilkom.ac.id";
  const defaultPassword =
    process.env.ADMIN_SEED_PASSWORD || "PasswordSuperAman123!";
  const passwordHash = await bcrypt.hash(defaultPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
    },
  });
  console.log(`✅ Administrator default siap: ${adminUser.email}`);

  // 2. Kategori Portofolio Awal (SRS FR-030)
  const defaultCategories = [
    { name: "Graphic Design", slug: "graphic-design" },
    { name: "Social Media Content", slug: "social-media-content" },
    { name: "Video", slug: "video" },
  ];

  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    });
  }
  console.log(`✅ ${defaultCategories.length} kategori bawaan siap.`);

  // 3. Konfigurasi Seksi Konten (site_settings)
  const settingsEntries: Record<string, unknown> = {
    site_settings: DEFAULT_SITE_SETTINGS,
    home_hero: DEFAULT_LANDING_CONTENT.hero,
    home_marquee: DEFAULT_LANDING_CONTENT.marquee,
    about_content: DEFAULT_LANDING_CONTENT.about,
    divisions: DEFAULT_LANDING_CONTENT.divisions,
    services: DEFAULT_LANDING_CONTENT.services,
    faq: DEFAULT_LANDING_CONTENT.faq,
    contact: DEFAULT_LANDING_CONTENT.contact,
    team_header: {
      titleLine1: DEFAULT_TEAM_PAGE_CONTENT.titleLine1,
      titleLine2: DEFAULT_TEAM_PAGE_CONTENT.titleLine2,
      subtitle: DEFAULT_TEAM_PAGE_CONTENT.subtitle,
    },
  };

  for (const [key, payload] of Object.entries(settingsEntries)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { payload: payload as object },
      create: { key, payload: payload as object },
    });
  }
  console.log(`✅ ${Object.keys(settingsEntries).length} seksi site_settings siap.`);

  // 4. Struktur Kepengurusan Awal (team_members)
  await prisma.teamMember.deleteMany({});
  for (let i = 0; i < TEAM_MEMBERS_DATA.length; i++) {
    const member = TEAM_MEMBERS_DATA[i];
    await prisma.teamMember.create({
      data: {
        name: member.name,
        roleTitle: member.role,
        divisionId: member.divisionId,
        photoUrl: member.photo,
        avatarUrl: member.avatar ?? null,
        quoteText: member.quoteText ?? null,
        instagramUrl: member.instagramUrl ?? null,
        isLeader: member.isLeader ?? false,
        sortOrder: i,
      },
    });
  }
  console.log(`✅ ${TEAM_MEMBERS_DATA.length} anggota tim kepengurusan tersimpan.`);

  console.log("🎉 Seeding database selesai dengan sukses!");
}

main()
  .catch((e) => {
    console.error("❌ Terjadi galat saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
