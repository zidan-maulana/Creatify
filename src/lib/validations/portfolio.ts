import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama kategori minimal 2 karakter.")
    .max(100, "Nama kategori maksimal 100 karakter."),
});

export const deleteCategorySchema = z.object({
  replacementCategoryId: z
    .string()
    .uuid("ID kategori pengganti harus berupa UUID yang valid.")
    .optional(),
});

export const portfolioItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Judul karya minimal 3 karakter.")
    .max(255, "Judul karya maksimal 255 karakter."),
  slug: z
    .string()
    .trim()
    .max(255)
    .optional(),
  categoryId: z
    .string()
    .uuid("Kategori yang dipilih harus valid."),
  mediaType: z.enum(["IMAGE", "VIDEO"]).default("IMAGE"),
  mediaUrl: z
    .string()
    .trim()
    .min(1, "URL media gambar/video wajib diisi."),
  mediaPublicId: z.string().trim().optional().nullable(),
  videoUrl: z.string().trim().optional().nullable(),
  videoEmbedUrl: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(),
  releaseDate: z.string().trim().max(50).optional().nullable(),
  externalLink: z.string().trim().optional().nullable(),
  isFeatured: z.boolean().optional().default(false),
});

export const updatePortfolioItemSchema = portfolioItemSchema.partial();

export type CategoryInput = z.infer<typeof categorySchema>;
export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;
export type CreatePortfolioInput = z.infer<typeof portfolioItemSchema>;
export type UpdatePortfolioInput = z.infer<typeof updatePortfolioItemSchema>;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

