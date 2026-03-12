import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";

const footerLinks = [
  "Ofertas del Día",
  "Nuevos Productos",
  "Arma tu PC (Configurador)",
  "Rastrea tu Pedido",
  "Métodos de Pago",
  "Envíos y Tiempos de Entrega",
  "Cambios y Devoluciones",
  "Garantías",
  "Términos y Condiciones",
  "Política de Privacidad",
  "Zona Gamer",
  "Accesorios y Periféricos",
];

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-400 mt-2">
      <div className="px-5 md:px-8 pt-8 pb-6 grid grid-cols-2 md:grid-cols-3 gap-8">
        {/* Contact */}
        <div>
          <h3
            className="text-white text-sm font-bold uppercase tracking-[2px] mb-4"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            Contáctanos
          </h3>
          <div className="space-y-1.5 text-xs text-gray-400">
            <p>Charalá</p>
            <p>Teléfono: 3156419521</p>
            <p>3157116184 · 3046194791</p>
            <p>Charalá, Santander</p>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3
            className="text-white text-sm font-bold uppercase tracking-[2px] mb-4"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            Enlaces de Interés
          </h3>
          <ul className="space-y-1">
            {footerLinks.map((link) => (
              <li key={link}>
                <Link
                  href="#"
                  className="text-xs text-gray-400 hover:text-[#F05A00] transition-colors duration-200"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div className="col-span-2 md:col-span-1">
          <h3
            className="text-white text-sm font-bold uppercase tracking-[2px] mb-4"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            Síguenos
          </h3>
          <div className="flex gap-3">
            <Link
              href="#"
              className="w-10 h-10 rounded-full flex items-center justify-center
                         bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600
                         text-white hover:scale-110 transition-transform duration-200"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </Link>
            <Link
              href="#"
              className="w-10 h-10 rounded-full bg-[#1877f2] flex items-center justify-center
                         text-white hover:scale-110 transition-transform duration-200"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </Link>
            <Link
              href="#"
              className="w-10 h-10 rounded-full bg-black flex items-center justify-center
                         text-white hover:scale-110 transition-transform duration-200 font-black text-sm"
              aria-label="X / Twitter"
            >
              𝕏
            </Link>
          </div>

          {/* Logo in footer */}
          <div className="mt-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F05A00] rounded-md flex items-center justify-center">
              <span className="text-white text-[8px] font-black leading-tight text-center"
                    style={{ fontFamily: "var(--font-barlow-condensed)" }}>
                PC<br/>C
              </span>
            </div>
            <span className="text-gray-500 text-xs font-semibold"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}>
              PC Componentes
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-5 py-3 text-center">
        <p className="text-[11px] text-gray-600">
          © {new Date().getFullYear()} PC Componentes · Todos los derechos reservados · Charalá, Santander
        </p>
      </div>
    </footer>
  );
}
