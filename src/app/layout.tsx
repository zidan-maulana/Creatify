import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creatify — Digital Portfolio & Creative Team",
  description:
    "Tim kreatif resmi pendukung branding dan komunikasi visual Fakultas Ilmu Komputer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#1652d8] text-white">
        {children}
      </body>
    </html>
  );
}
