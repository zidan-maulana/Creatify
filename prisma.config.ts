import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://creatify_user:secretpass@localhost:5432/creatify_db?schema=public",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
