"use client";

import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Sheet, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

function ImagePlaceholder({ size = 44 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0"
      style={{ width: size, height: size }}
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

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  const total = getTotalPrice();
  const count = getTotalItems();

  return (
    <Sheet open={isOpen} onClose={closeCart}>
      <SheetHeader title={`Carrito (${count})`} onClose={closeCart} />

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-4">
            <ShoppingBag size={48} className="text-gray-200" />
            <p className="text-gray-400 font-semibold">Tu carrito está vacío</p>
            <Button variant="outline" onClick={closeCart} size="sm">
              Seguir comprando
            </Button>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 pb-4 border-b border-gray-100 last:border-0 animate-fade-up"
            >
              {/* Image placeholder */}
              <ImagePlaceholder size={52} />

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight">
                  {item.name}
                </p>
                <p
                  className="text-sm font-bold text-[#F05A00] mt-0.5"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  {formatPrice(item.price)}
                </p>
                {/* Quantity controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 transition-colors"
                  >
                    <Minus size={10} />
                  </button>
                  <span className="text-sm font-bold w-5 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 transition-colors"
                  >
                    <Plus size={10} />
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="p-1.5 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                aria-label="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="border-t border-gray-100 px-6 py-5 space-y-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">Subtotal</span>
            <span
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              {formatPrice(total)}
            </span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Envío calculado en el checkout
          </p>
          <Button variant="cart" size="lg" className="w-full">
            Finalizar compra
          </Button>
          <Button variant="outline" size="sm" className="w-full" onClick={closeCart}>
            Seguir comprando
          </Button>
        </div>
      )}
    </Sheet>
  );
}
