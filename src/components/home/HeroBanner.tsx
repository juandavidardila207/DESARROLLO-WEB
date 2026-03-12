import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="mx-3 md:mx-5 mt-4 mb-2 rounded-2xl bg-gradient-to-br from-gray-50 via-gray-100 to-orange-50 relative overflow-hidden min-h-[220px] md:min-h-[260px] flex items-center">
      {/* Background shapes */}
      <div className="absolute right-0 bottom-0 w-64 md:w-80 h-64 md:h-80 bg-[#F05A00] opacity-10 clip-hero-shape" />
      <div className="absolute right-16 bottom-0 w-36 md:w-48 h-44 md:h-52 bg-[#F05A00] opacity-15 clip-triangle" />

      {/* Content */}
      <div className="relative z-10 pl-6 md:pl-10 py-8 flex-1 max-w-sm">
        <h1
          className="text-4xl md:text-5xl font-black uppercase leading-none tracking-tight text-gray-900"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          Ofertas <span className="text-[#F05A00]">TOP</span>
          <br />
          de la semana
        </h1>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-[260px]">
          Grandes descuentos en tecnología. ¡Aprovecha ahora!
        </p>
        <Link href="/ofertas">
          <Button variant="cart" size="lg" className="mt-5 text-sm">
            + Ver todas las ofertas
          </Button>
        </Link>
      </div>

      {/* Discount badge */}
      <div
        className="absolute top-5 right-5 w-20 h-20 md:w-24 md:h-24 bg-[#7B3FBF] rounded-full
                   flex flex-col items-center justify-center text-white text-center z-10
                   shadow-xl shadow-purple-500/30 animate-pulse-slow"
      >
        <span className="text-[9px] font-semibold opacity-85 leading-none">Hasta un</span>
        <span
          className="text-2xl md:text-3xl font-black leading-tight"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          -40%
        </span>
        <span className="text-[8px] opacity-80 leading-none">de descuento</span>
      </div>

      {/* Arrows deco */}
      <div className="absolute right-8 bottom-6 text-[#F05A00] opacity-25 text-3xl font-black select-none"
           style={{ fontFamily: "var(--font-barlow-condensed)" }}>
        ❯❯
      </div>
    </section>
  );
}
