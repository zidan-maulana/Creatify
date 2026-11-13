"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifySessionCookie } from "@/lib/auth";
import {
  DEFAULT_LANDING_CONTENT,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_TEAM_PAGE_CONTENT,
  landingContentSchema,
  siteSettingsSchema,
} from "@/config/landing-cms";
import { TEAM_MEMBERS_DATA } from "@/data/team";
import {
  ApiResponse,
  errorResponse,
  successResponse,
} from "@/types/api";
import type {
  LandingPageContent,
  SiteSettingsContent,
} from "@/types/cms";
import { getLandingContent, getSiteSettings } from "@/lib/cms";

const SECTION_KEY_MAP: Record<keyof LandingPageContent, string> = {
  siteSettings: "site_settings",
  hero: "home_hero",
  marquee: "home_marquee",
  about: "about_content",
  divisions: "divisions",
  services: "services",
  faq: "faq",
  contact: "contact",
};

/**
 * Server Action untuk mengambil konten landing page saat ini
 */
export async function getLandingContentAction(): Promise<
  ApiResponse<LandingPageContent>
> {
  try {
    const data = await getLandingContent();
    return successResponse(data);
  } catch (error) {
    console.error("Gagal mengambil konten landing:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Gagal memuat konten landing dari database."
    );
  }
}

/**
 * Server Action untuk menyimpan satu section landing page
 */
export async function updateLandingSectionAction<
  K extends keyof LandingPageContent
>(
  section: K,
  payload: LandingPageContent[K]
): Promise<ApiResponse<LandingPageContent[K]>> {
  try {
    const session = await verifySessionCookie();
    if (!session) {
      return errorResponse(
        "UNAUTHORIZED",
        "Sesi administrator tidak valid atau telah berakhir."
      );
    }

    const dbKey = SECTION_KEY_MAP[section];
    if (!dbKey) {
      return errorResponse("VALIDATION_ERROR", `Section ${String(section)} tidak dikenali.`);
    }

    // Validasi Zod per section
    if (section === "siteSettings") {
      const parsed = siteSettingsSchema.safeParse(payload);
      if (!parsed.success) {
        return errorResponse(
          "VALIDATION_ERROR",
          "Format pengaturan situs tidak valid.",
          parsed.error.flatten().fieldErrors
        );
      }
    } else {
      const validator = landingContentSchema.shape[section];
      if (validator) {
        const parsed = (validator as { safeParse: (data: unknown) => { success: boolean; error?: { flatten: () => { fieldErrors: Record<string, string[]> } } } }).safeParse(payload);
        if (!parsed.success && parsed.error) {
          return errorResponse(
            "VALIDATION_ERROR",
            `Format data untuk seksi ${String(section)} tidak valid.`,
            parsed.error.flatten().fieldErrors
          );
        }
      }
    }

    // Simpan ke PostgreSQL via Prisma
    await db.siteSetting.upsert({
      where: { key: dbKey },
      update: { payload: payload as object },
      create: { key: dbKey, payload: payload as object },
    });

    // Revalidasi ISR rute publik & admin
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/landing");
    if (section === "siteSettings") {
      revalidatePath("/team");
      revalidatePath("/admin/settings");
    }

    return successResponse(payload, `Seksi ${String(section)} berhasil disimpan.`);
  } catch (error) {
    console.error(`Gagal menyimpan seksi ${String(section)}:`, error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Terjadi galat basis data saat menyimpan perubahan seksi."
    );
  }
}

/**
 * Server Action khusus untuk memperbarui konfigurasi situs & kontak
 */
export async function updateSiteSettingsAction(
  settings: SiteSettingsContent
): Promise<ApiResponse<SiteSettingsContent>> {
  try {
    const session = await verifySessionCookie();
    if (!session) {
      return errorResponse(
        "UNAUTHORIZED",
        "Sesi administrator tidak valid atau telah berakhir."
      );
    }

    const parsed = siteSettingsSchema.safeParse(settings);
    if (!parsed.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Format data pengaturan situs tidak valid.",
        parsed.error.flatten().fieldErrors
      );
    }

    await db.siteSetting.upsert({
      where: { key: "site_settings" },
      update: { payload: parsed.data as object },
      create: { key: "site_settings", payload: parsed.data as object },
    });

    revalidatePath("/");
    revalidatePath("/team");
    revalidatePath("/admin/settings");
    revalidatePath("/admin");

    return successResponse(
      parsed.data,
      "Pengaturan situs & kontak resmi berhasil diperbarui."
    );
  } catch (error) {
    console.error("Gagal memperbarui pengaturan situs:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Terjadi galat basis data saat menyimpan pengaturan situs."
    );
  }
}

/**
 * Server Action untuk me-reset semua konten CMS dan tim ke kondisi default
 */
export async function resetAllToDefaultAction(): Promise<ApiResponse<null>> {
  try {
    const session = await verifySessionCookie();
    if (!session) {
      return errorResponse(
        "UNAUTHORIZED",
        "Sesi administrator tidak valid atau telah berakhir."
      );
    }

    // 1. Reset seluruh seksi site_settings
    const defaultEntries: Record<string, unknown> = {
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

    for (const [key, payload] of Object.entries(defaultEntries)) {
      await db.siteSetting.upsert({
        where: { key },
        update: { payload: payload as object },
        create: { key, payload: payload as object },
      });
    }

    // 2. Reset tim ke daftar bawaan
    await db.teamMember.deleteMany({});
    for (let i = 0; i < TEAM_MEMBERS_DATA.length; i++) {
      const member = TEAM_MEMBERS_DATA[i];
      await db.teamMember.create({
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

    // 3. Revalidasi seluruh rute
    revalidatePath("/");
    revalidatePath("/team");
    revalidatePath("/admin");
    revalidatePath("/admin/landing");
    revalidatePath("/admin/team");
    revalidatePath("/admin/settings");

    return successResponse(null, "Seluruh konten default berhasil dipulihkan.");
  } catch (error) {
    console.error("Gagal melakukan reset seluruh konten CMS:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Terjadi galat basis data saat memulihkan konten default."
    );
  }
}
