import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PC Componentes — Tecnología con los mejores precios",
  description:
    "Laptops, smartphones, componentes PC, periféricos y más. Ofertas top de la semana con hasta un 40% de descuento.",
  keywords: ["pc", "componentes", "laptops", "smartphones", "gamer", "Colombia"],
  openGraph: {
    title: "PC Componentes",
    description: "Tecnología con los mejores precios",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${barlow.variable} ${barlowCondensed.variable} font-barlow bg-white text-gray-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
