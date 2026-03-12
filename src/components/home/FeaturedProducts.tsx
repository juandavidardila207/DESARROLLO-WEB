import { ProductCard } from "@/components/products/ProductCard";
import { products } from "@/lib/data";

export function FeaturedProducts() {
  return (
    <section className="px-3 md:px-5 pb-4">
      {/* Section title */}
      <div className="text-center mb-5">
        <h2
          className="text-xl md:text-2xl font-bold uppercase tracking-[3px] text-gray-900"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          Ofertas Destacadas
        </h2>
        <div className="w-12 h-0.5 bg-[#F05A00] rounded mx-auto mt-2" />
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
