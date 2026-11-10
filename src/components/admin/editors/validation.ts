import type { z } from "zod";

// Ubah daftar issue Zod menjadi kamus pesan galat per path field (contoh: "items.0.question")
export function mapZodIssues(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

