export function PromoBar() {
  return (
    <div className="bg-[#F05A00] text-white text-center py-2 px-4">
      <p
        className="text-xs md:text-sm font-bold tracking-widest uppercase"
        style={{ fontFamily: "var(--font-barlow-condensed)" }}
      >
        Envío GRATIS en pedidos superiores a $150.000 — ¡Solo por hoy!
      </p>
    </div>
  );
}
