import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SesliShop – Sesle Alışveriş",
  description: "Türkçe sesli filtre ile ürün arama",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
