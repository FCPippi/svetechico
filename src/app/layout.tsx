import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Natasha ❤️ — Nosso Cantinho",
  description: "Um cantinho especial pra nós dois",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>❤️</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-cream min-h-screen antialiased">{children}</body>
    </html>
  );
}
