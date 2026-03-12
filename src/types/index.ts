// src/types/index.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  badge?: string;
  category: string;
  image: string; // SVG string or URL
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface BannerCategory {
  id: string;
  label: string;
  href: string;
  bgColor: string;
  svgContent: string;
}

export interface NavCategory {
  label: string;
  href: string;
  active?: boolean;
}
