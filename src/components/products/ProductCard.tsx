"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductSvg } from "./ProductSvg";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article
      className={`
        product-card-line relative bg-white border-[1.5px] border-gray-200 rounded-xl
        p-3 text-center cursor-pointer group overflow-hidden
        transition-all duration-300 hover:border-orange-400 hover:shadow-lg
        hover:shadow-orange-500/10 hover:-translate-y-1
        animate-fade-up
      `}
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "backwards" }}
    >
      {/* Discount badge */}
      {product.badge && (
        <Badge
          variant="discount"
          className="absolute top-2 left-2 z-10 text-[10px] px-1.5 py-0.5"
        >
          {product.badge}
        </Badge>
      )}

      {/* Product image */}
      <div className="flex items-center justify-center h-20 mb-3">
        <ProductSvg type={product.image} size={80} />
      </div>

      {/* Name */}
      <h3 className="text-xs font-semibold text-gray-800 leading-tight mb-2 min-h-[2.2rem] line-clamp-2">
        {product.name}
      </h3>

      {/* Price */}
      <div className="mb-3">
        <span
          className="font-bold text-lg text-[#F05A00]"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && (
          <span className="block text-[10px] text-gray-400 line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
      </div>

      {/* Add to cart button */}
      <Button
        variant="default"
        size="sm"
        onClick={handleAdd}
        className={`w-full text-xs gap-1 transition-all duration-300 ${
          added ? "bg-green-500 hover:bg-green-500" : ""
        }`}
      >
        {added ? (
          <>
            <Check size={12} />
            Añadido
          </>
        ) : (
          <>
            <ShoppingCart size={12} />
            Añadir
          </>
        )}
      </Button>
    </article>
  );
}
