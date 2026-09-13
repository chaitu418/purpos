import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Purpos — Every connection has a purpose",
  description: "Purpose-first local connections for Bengaluru.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
