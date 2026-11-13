import { z } from "zod";

export const divisionIdEnum = z.enum([
  "ketua-wakil",
  "visual-creative",
  "executive-committee",
  "talent-content",
  "research-development",
]);

export const teamMemberSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .trim()
    .min(1, "Nama anggota wajib diisi.")
    .max(150, "Nama anggota maksimal 150 karakter."),
  role: z
    .string()
    .trim()
    .min(1, "Peran / jabatan anggota wajib diisi.")
    .max(150, "Peran maksimal 150 karakter."),
  divisionId: divisionIdEnum,
  photo: z
    .string()
    .trim()
    .min(1, "Foto anggota wajib diisi."),
  photoPublicId: z.string().optional().nullable(),
  avatar: z.string().trim().optional().nullable(),
  avatarPublicId: z.string().optional().nullable(),
  quoteText: z.string().trim().optional().nullable(),
  instagramUrl: z.string().trim().optional().nullable(),
  isLeader: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const teamMemberOrderSchema = z.object({
  orders: z.array(
    z.object({
      id: z.string().min(1, "ID anggota wajib diisi."),
      sortOrder: z.number().int(),
    })
  ),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
export type TeamMemberOrderInput = z.infer<typeof teamMemberOrderSchema>;
