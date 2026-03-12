import Link from "next/link";
import { Plus } from "lucide-react";
import { bannerCategories } from "@/lib/data";

export function CategoryBanners() {
  return (
    <section className="px-3 md:px-5 pb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {bannerCategories.map((cat, i) => (
          <Link
            key={cat.id}
            href={cat.href}
            className={`
              relative rounded-xl overflow-hidden h-32 md:h-36 cursor-pointer group
              bg-gradient-to-br ${cat.bgColor}
              transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl
              animate-fade-up
            `}
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center gap-2">
              <div className="w-5 h-5 bg-[#F05A00] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Plus size={12} className="text-white" />
              </div>
              <span
                className="text-white text-xs md:text-sm font-bold uppercase tracking-wide leading-tight"
                style={{ fontFamily: "var(--font-barlow-condensed)" }}
              >
                {cat.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
