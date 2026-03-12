import React from "react";

interface ProductSvgProps {
  type?: string;
  size?: number;
  className?: string;
}

/**
 * Placeholder de imagen para productos.
 * Muestra un recuadro neutro con ícono genérico,
 * listo para reemplazar con <Image> de next/image
 * cuando se tengan las fotos reales de los productos.
 */
export function ProductSvg({ size = 80, className = "" }: ProductSvgProps) {
  return (
    <div
      className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size * 0.45}
        height={size * 0.45}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#d1d5db"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  );
}
