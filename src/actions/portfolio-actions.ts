"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifySessionCookie } from "@/lib/auth";
import { deleteMediaAsset } from "@/lib/media";
import {
  categorySchema,
  portfolioItemSchema,
  updatePortfolioItemSchema,
  slugify,
  CreatePortfolioInput,
  UpdatePortfolioInput,
} from "@/lib/validations/portfolio";
import {
  ApiResponse,
  errorResponse,
  successResponse,
} from "@/types/api";

function isValidUuid(id?: string | null): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}

// ==========================================
// KATEGORI PORTOFOLIO (SRS FR-028/029, ADR-008)
// ==========================================

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  createdAt: Date;
}

/**
 * Mengambil daftar semua kategori beserta jumlah karya terhubung
 */
export async function getCategoriesAction(): Promise<
  ApiResponse<CategoryWithCount[]>
> {
  try {
    const categories = await db.category.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: { portfolioItems: true },
        },
      },
    });

    const data: CategoryWithCount[] = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      itemCount: c._count.portfolioItems,
      createdAt: c.createdAt,
    }));

    return successResponse(data);
  } catch (error) {
    console.error("Gagal mengambil kategori:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Gagal mengambil daftar kategori dari basis data."
    );
  }
}

/**
 * Menambahkan kategori baru dengan slug otomatis
 */
export async function createCategoryAction(
  name: string
): Promise<ApiResponse<{ id: string; name: string; slug: string }>> {
  try {
    const session = await verifySessionCookie();
    if (!session) {
      return errorResponse(
        "UNAUTHORIZED",
        "Sesi administrator tidak valid atau telah berakhir."
      );
    }

    const parsed = categorySchema.safeParse({ name });
    if (!parsed.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Nama kategori tidak valid.",
        parsed.error.flatten().fieldErrors
      );
    }

    const baseSlug = slugify(parsed.data.name);
    let finalSlug = baseSlug;
    let counter = 1;

    while (await db.category.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const created = await db.category.create({
      data: {
        name: parsed.data.name,
        slug: finalSlug,
      },
    });

    revalidatePath("/admin/portfolio");

    return successResponse(
      { id: created.id, name: created.name, slug: created.slug },
      "Kategori baru berhasil dibuat."
    );
  } catch (error) {
    console.error("Gagal membuat kategori:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Terjadi galat basis data saat menambahkan kategori."
    );
  }
}

/**
 * Menghapus kategori dengan proteksi integritas ADR-008 & migrasi karya
 */
export async function deleteCategoryAction(
  id: string,
  replacementCategoryId?: string
): Promise<ApiResponse<null>> {
  try {
    const session = await verifySessionCookie();
    if (!session) {
      return errorResponse(
        "UNAUTHORIZED",
        "Sesi administrator tidak valid atau telah berakhir."
      );
    }

    if (!isValidUuid(id)) {
      return errorResponse("VALIDATION_ERROR", "ID kategori tidak valid.");
    }

    // Aturan 1 ADR-008: Total kategori aktif <= 1 tidak boleh dihapus
    const totalCategories = await db.category.count();
    if (totalCategories <= 1) {
      return errorResponse(
        "CATEGORY_RESTRICTED",
        "Kategori tidak dapat dihapus karena hanya tersisa satu kategori aktif."
      );
    }

    const targetCategory = await db.category.findUnique({
      where: { id },
      include: { _count: { select: { portfolioItems: true } } },
    });

    if (!targetCategory) {
      return errorResponse("NOT_FOUND", "Kategori yang akan dihapus tidak ditemukan.");
    }

    const itemCount = targetCategory._count.portfolioItems;

    // Aturan 2 ADR-008: Jika ada karya terhubung, wajib pilih kategori pengganti
    if (itemCount > 0) {
      if (!replacementCategoryId || !isValidUuid(replacementCategoryId)) {
        return errorResponse(
          "VALIDATION_ERROR",
          "Kategori pengganti wajib dipilih karena masih ada karya terhubung."
        );
      }

      if (replacementCategoryId === id) {
        return errorResponse(
          "VALIDATION_ERROR",
          "Kategori pengganti tidak boleh sama dengan kategori yang dihapus."
        );
      }

      const replacement = await db.category.findUnique({
        where: { id: replacementCategoryId },
      });
      if (!replacement) {
        return errorResponse(
          "NOT_FOUND",
          "Kategori pengganti yang dipilih tidak ditemukan."
        );
      }

      // Migrasi atomik dalam satu transaksi
      await db.$transaction([
        db.portfolioItem.updateMany({
          where: { categoryId: id },
          data: { categoryId: replacementCategoryId },
        }),
        db.category.delete({
          where: { id },
        }),
      ]);

      revalidatePath("/admin/portfolio");
      return successResponse(
        null,
        "Seluruh karya berhasil dipindahkan dan kategori lama telah dihapus."
      );
    }

    // Jika tidak ada karya terhubung, langsung hapus
    await db.category.delete({ where: { id } });
    revalidatePath("/admin/portfolio");

    return successResponse(null, "Kategori berhasil dihapus.");
  } catch (error) {
    console.error("Gagal menghapus kategori:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Terjadi galat basis data saat menghapus kategori."
    );
  }
}

// ==========================================
// PORTOFOLIO ITEMS (SRS FR-019 s/d FR-027)
// ==========================================

export interface PortfolioItemWithCategory {
  id: string;
  title: string;
  slug: string;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  mediaPublicId: string | null;
  videoUrl: string | null;
  videoEmbedUrl: string | null;
  description: string | null;
  releaseDate: string | null;
  externalLink: string | null;
  isFeatured: boolean;
  createdAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

/**
 * Mengambil daftar karya portofolio dengan filter opsional
 */
export async function getPortfolioItemsAction(options?: {
  categorySlug?: string;
  featured?: boolean;
}): Promise<ApiResponse<PortfolioItemWithCategory[]>> {
  try {
    let categoryId: string | undefined = undefined;

    if (options?.categorySlug) {
      const cat = await db.category.findUnique({
        where: { slug: options.categorySlug },
      });
      if (cat) categoryId = cat.id;
    }

    const items = await db.portfolioItem.findMany({
      where: {
        ...(categoryId ? { categoryId } : {}),
        ...(options?.featured !== undefined
          ? { isFeatured: options.featured }
          : {}),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped: PortfolioItemWithCategory[] = items.map((i) => ({
      id: i.id,
      title: i.title,
      slug: i.slug,
      mediaType: i.mediaType as "IMAGE" | "VIDEO",
      mediaUrl: i.mediaUrl,
      mediaPublicId: i.mediaPublicId,
      videoUrl: i.videoUrl,
      videoEmbedUrl: i.videoEmbedUrl,
      description: i.description,
      releaseDate: i.releaseDate,
      externalLink: i.externalLink,
      isFeatured: i.isFeatured,
      createdAt: i.createdAt,
      category: i.category,
    }));

    return successResponse(mapped);
  } catch (error) {
    console.error("Gagal mengambil daftar portofolio:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Gagal mengambil daftar portofolio dari basis data."
    );
  }
}

/**
 * Mengambil detail satu karya berdasarkan slug
 */
export async function getPortfolioItemBySlugAction(
  slug: string
): Promise<ApiResponse<PortfolioItemWithCategory>> {
  try {
    const item = await db.portfolioItem.findUnique({
      where: { slug },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!item) {
      return errorResponse(
        "PORTFOLIO_NOT_FOUND",
        "Karya yang Anda cari tidak ditemukan atau telah dihapus."
      );
    }

    const mapped: PortfolioItemWithCategory = {
      id: item.id,
      title: item.title,
      slug: item.slug,
      mediaType: item.mediaType as "IMAGE" | "VIDEO",
      mediaUrl: item.mediaUrl,
      mediaPublicId: item.mediaPublicId,
      videoUrl: item.videoUrl,
      videoEmbedUrl: item.videoEmbedUrl,
      description: item.description,
      releaseDate: item.releaseDate,
      externalLink: item.externalLink,
      isFeatured: item.isFeatured,
      createdAt: item.createdAt,
      category: item.category,
    };

    return successResponse(mapped);
  } catch (error) {
    console.error("Gagal mengambil detail portofolio:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Gagal mengambil detail karya portofolio."
    );
  }
}

/**
 * Menambahkan karya portofolio baru
 */
export async function createPortfolioItemAction(
  input: CreatePortfolioInput
): Promise<ApiResponse<{ id: string; slug: string }>> {
  try {
    const session = await verifySessionCookie();
    if (!session) {
      return errorResponse(
        "UNAUTHORIZED",
        "Sesi administrator tidak valid atau telah berakhir."
      );
    }

    const parsed = portfolioItemSchema.safeParse(input);
    if (!parsed.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Data karya yang dimasukkan tidak valid.",
        parsed.error.flatten().fieldErrors
      );
    }

    const data = parsed.data;

    // Pastikan kategori ada
    const categoryExists = await db.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!categoryExists) {
      return errorResponse("VALIDATION_ERROR", "Kategori yang dipilih tidak valid.");
    }

    // Kelola keunikan slug
    const baseSlug = slugify(data.slug || data.title);
    let finalSlug = baseSlug;
    let counter = 1;

    while (await db.portfolioItem.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const created = await db.portfolioItem.create({
      data: {
        title: data.title,
        slug: finalSlug,
        categoryId: data.categoryId,
        mediaType: data.mediaType,
        mediaUrl: data.mediaUrl,
        mediaPublicId: data.mediaPublicId ?? null,
        videoUrl: data.videoUrl ?? null,
        videoEmbedUrl: data.videoEmbedUrl ?? null,
        description: data.description ?? null,
        releaseDate: data.releaseDate ?? null,
        externalLink: data.externalLink ?? null,
        isFeatured: data.isFeatured ?? false,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/portfolio");

    return successResponse(
      { id: created.id, slug: created.slug },
      "Karya portofolio berhasil diterbitkan."
    );
  } catch (error) {
    console.error("Gagal menerbitkan karya portofolio:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Terjadi galat basis data saat menyimpan karya."
    );
  }
}

/**
 * Memperbarui data karya portofolio
 */
export async function updatePortfolioItemAction(
  id: string,
  input: UpdatePortfolioInput
): Promise<ApiResponse<{ id: string; slug: string }>> {
  try {
    const session = await verifySessionCookie();
    if (!session) {
      return errorResponse(
        "UNAUTHORIZED",
        "Sesi administrator tidak valid atau telah berakhir."
      );
    }

    if (!isValidUuid(id)) {
      return errorResponse("VALIDATION_ERROR", "ID karya tidak valid.");
    }

    const existing = await db.portfolioItem.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("NOT_FOUND", "Karya portofolio tidak ditemukan.");
    }

    const parsed = updatePortfolioItemSchema.safeParse(input);
    if (!parsed.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Data pembaruan karya tidak valid.",
        parsed.error.flatten().fieldErrors
      );
    }

    const data = parsed.data;

    // Pembersihan media lama jika gambar diganti
    if (
      existing.mediaPublicId &&
      data.mediaPublicId &&
      existing.mediaPublicId !== data.mediaPublicId
    ) {
      await deleteMediaAsset(existing.mediaPublicId);
    }

    // Tangani slug jika diubah
    let finalSlug = existing.slug;
    if (data.slug && data.slug !== existing.slug) {
      const baseSlug = slugify(data.slug);
      finalSlug = baseSlug;
      let counter = 1;
      while (
        await db.portfolioItem.findFirst({
          where: { slug: finalSlug, NOT: { id } },
        })
      ) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const updated = await db.portfolioItem.update({
      where: { id },
      data: {
        ...(data.title ? { title: data.title } : {}),
        slug: finalSlug,
        ...(data.categoryId ? { categoryId: data.categoryId } : {}),
        ...(data.mediaType ? { mediaType: data.mediaType } : {}),
        ...(data.mediaUrl ? { mediaUrl: data.mediaUrl } : {}),
        ...(data.mediaPublicId !== undefined
          ? { mediaPublicId: data.mediaPublicId }
          : {}),
        ...(data.videoUrl !== undefined ? { videoUrl: data.videoUrl } : {}),
        ...(data.videoEmbedUrl !== undefined
          ? { videoEmbedUrl: data.videoEmbedUrl }
          : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.releaseDate !== undefined
          ? { releaseDate: data.releaseDate }
          : {}),
        ...(data.externalLink !== undefined
          ? { externalLink: data.externalLink }
          : {}),
        ...(data.isFeatured !== undefined
          ? { isFeatured: data.isFeatured }
          : {}),
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/portfolio");

    return successResponse(
      { id: updated.id, slug: updated.slug },
      "Karya portofolio berhasil diperbarui."
    );
  } catch (error) {
    console.error("Gagal memperbarui karya portofolio:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Terjadi galat basis data saat memperbarui karya."
    );
  }
}

/**
 * Menghapus karya portofolio permanen beserta aset medianya
 */
export async function deletePortfolioItemAction(
  id: string
): Promise<ApiResponse<{ id: string }>> {
  try {
    const session = await verifySessionCookie();
    if (!session) {
      return errorResponse(
        "UNAUTHORIZED",
        "Sesi administrator tidak valid atau telah berakhir."
      );
    }

    if (!isValidUuid(id)) {
      return errorResponse("VALIDATION_ERROR", "ID karya tidak valid.");
    }

    const existing = await db.portfolioItem.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("NOT_FOUND", "Karya portofolio tidak ditemukan.");
    }

    if (existing.mediaPublicId) {
      await deleteMediaAsset(existing.mediaPublicId);
    }

    await db.portfolioItem.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/admin/portfolio");

    return successResponse(
      { id },
      "Karya berhasil dihapus permanen beserta aset medianya."
    );
  } catch (error) {
    console.error("Gagal menghapus karya portofolio:", error);
    return errorResponse(
      "INTERNAL_ERROR",
      "Terjadi galat basis data saat menghapus karya."
    );
  }
}

