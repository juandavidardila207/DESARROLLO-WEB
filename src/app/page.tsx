// app/page.tsx — Server Component (SSG by default in Next.js App Router)
import { PromoBar } from "@/components/layout/PromoBar";
import { Navbar } from "@/components/layout/Navbar";
import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryBanners } from "@/components/home/CategoryBanners";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

// Static metadata — SEO optimized
export const metadata = {
  title: "PC Componentes — Ofertas TOP de la semana",
  description:
    "Hasta un 40% de descuento en laptops, smartphones, componentes PC, periféricos y más. Envío gratis en pedidos mayores a $150.000.",
};

export default function HomePage() {
  return (
    <>
      <PromoBar />
      <Navbar />
      <main className="min-h-screen">
        <HeroBanner />

        {/* Spacer */}
        <div className="h-6" />

        <FeaturedProducts />
        <CategoryBanners />
      </main>
      <Footer />

      {/* Cart drawer — client-side, rendered outside main flow */}
      <CartDrawer />
    </>
  );
}
