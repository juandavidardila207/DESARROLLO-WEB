"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: "left" | "right";
}

export function Sheet({ open, onClose, children, side = "right" }: SheetProps) {
  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
          side === "right" ? "right-0" : "left-0",
          side === "right"
            ? open ? "translate-x-0" : "translate-x-full"
            : open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {children}
      </div>
    </>
  );
}

interface SheetHeaderProps {
  title: string;
  onClose: () => void;
}
export function SheetHeader({ title, onClose }: SheetHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
      <h2
        className="font-barlow-condensed text-xl font-bold uppercase tracking-widest text-gray-900"
        style={{ fontFamily: "var(--font-barlow-condensed)" }}
      >
        {title}
      </h2>
      <button
        onClick={onClose}
        className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        aria-label="Cerrar"
      >
        <X size={20} />
      </button>
    </div>
  );
}
