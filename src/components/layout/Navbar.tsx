"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { navCategories } from "@/lib/data";

export function Navbar() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-gray-100 shadow-sm">
      {/* Main nav */}
      <nav className="flex items-center justify-between gap-3 px-4 md:px-6 py-2.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 bg-[#F05A00] rounded-lg flex items-center justify-center">
            <span
              className="text-white text-[10px] font-black leading-tight text-center"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              PC<br/>COMP
            </span>
          </div>
          <span
            className="hidden sm:block text-[15px] font-bold text-gray-900 tracking-tight"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            PC Componentes
          </span>
        </Link>

        {/* Search bar */}
        <div className="flex-1 max-w-md mx-2 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="BUSCAR productos, marcas…"
            className="w-full pl-4 pr-10 py-2.5 border-2 border-gray-200 rounded-lg
                       bg-gray-50 text-sm font-medium placeholder:text-gray-400
                       focus:outline-none focus:border-[#F05A00] focus:bg-white transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F05A00] transition-colors">
            <Search size={16} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex gap-1.5 uppercase text-xs tracking-wide"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={14} />
            Categorías
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={toggleCart}
            className="flex items-center gap-1.5 uppercase text-xs tracking-wide"
          >
            <ShoppingCart size={14} />
            <span className="hidden sm:inline">Carrito</span>
            {totalItems > 0 && (
              <span className="bg-white text-[#F05A00] rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-black -mr-1">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Button>
        </div>
      </nav>

      {/* Category nav bar */}
      <div className="overflow-x-auto hide-scrollbar border-t border-gray-100">
        <div className="flex items-center px-4 md:px-6">
          {navCategories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`whitespace-nowrap px-3 md:px-4 py-2.5 text-xs md:text-[13px] font-semibold tracking-tight
                         border-b-[3px] -mb-px transition-all duration-200 text-gray-500
                         hover:text-[#F05A00] hover:border-[#F05A00]
                         ${cat.active ? "text-[#F05A00] border-[#F05A00]" : "border-transparent"}`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
