import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";

/**
 * Emergency Admin CLI Tool (ADR-009 & SRS FR-016)
 * Penggunaan:
 *   npm run admin:reset -- --password="PasswordBaruKuat123!"
 *   npm run admin:reset -- --email="custom@creatify.fasilkom.ac.id" --password="PasswordBaruKuat123!"
 */
async function main() {
  const args = process.argv.slice(2);
  let emailArg: string | undefined = undefined;
  let passwordArg: string | undefined = undefined;

  for (const arg of args) {
    if (arg.startsWith("--email=")) {
      emailArg = arg.replace("--email=", "").trim().replace(/^["']|["']$/g, "");
    } else if (arg.startsWith("--password=")) {
      passwordArg = arg.replace("--password=", "").trim().replace(/^["']|["']$/g, "");
    } else if (arg.startsWith("-p=")) {
      passwordArg = arg.replace("-p=", "").trim().replace(/^["']|["']$/g, "");
    } else if (arg.startsWith("-e=")) {
      emailArg = arg.replace("-e=", "").trim().replace(/^["']|["']$/g, "");
    }
  }

  console.log("==================================================");
  console.log("  CREATIFY CMS — EMERGENCY ADMIN RECOVERY CLI     ");
  console.log("  (Sesuai Dokumen ADR-009 & SRS FR-016)          ");
  console.log("==================================================");

  if (!passwordArg) {
    console.error("\n❌ Galat: Parameter kata sandi baru wajib disertakan!");
    console.log("\nContoh penggunaan:");
    console.log('  npm run admin:reset -- --password="PasswordSuperAman123!"');
    console.log('  npm run admin:reset -- --email="admin@creatify.fasilkom.ac.id" --password="PasswordSuperAman123!"\n');
    process.exit(1);
  }

  if (passwordArg.length < 8) {
    console.error("\n❌ Galat: Kata sandi baru harus minimal 8 karakter demi keamanan!\n");
    process.exit(1);
  }

  // Cari target akun admin
  let targetUser;
  if (emailArg) {
    targetUser = await db.user.findUnique({
      where: { email: emailArg },
    });
  } else {
    // Cari user pertama (default single admin)
    targetUser = await db.user.findFirst({
      orderBy: { createdAt: "asc" },
    });
  }

  if (!targetUser) {
    const targetEmail =
      emailArg ||
      process.env.ADMIN_SEED_EMAIL ||
      "admin@creatify.fasilkom.ac.id";
    console.log(`ℹ️ Akun tidak ditemukan, membuat akun administrator baru untuk: ${targetEmail}`);

    const hash = await bcrypt.hash(passwordArg, 12);
    targetUser = await db.user.create({
      data: {
        email: targetEmail,
        passwordHash: hash,
      },
    });

    console.log(`✅ Administrator baru berhasil dibuat!`);
  } else {
    console.log(`🔑 Mengatur ulang kata sandi untuk akun: ${targetUser.email}`);
    const newHash = await bcrypt.hash(passwordArg, 12);

    await db.user.update({
      where: { id: targetUser.id },
      data: {
        passwordHash: newHash,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    console.log(`✅ Kata sandi untuk ${targetUser.email} berhasil diperbarui!`);
  }

  console.log("\n--------------------------------------------------");
  console.log("Status: SELESAI");
  console.log(`Email Admin : ${targetUser.email}`);
  console.log("Sandi Baru  : [TER-UPDATE SECARA AMAN DENGAN BCRYPT]");
  console.log("Silakan login kembali melalui halaman /admin/login.");
  console.log("--------------------------------------------------\n");
}

main()
  .catch((e) => {
    console.error("❌ Terjadi kegagalan saat mengatur ulang kata sandi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
