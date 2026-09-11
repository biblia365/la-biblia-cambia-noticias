"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Sitio = {
  slug: string;
  nombre: string;
  logo_url: string | null;
  color_primario: string;
  color_acento: string;
};

type Redes = { facebook?: string; youtube?: string; instagram?: string; tiktok?: string };

export default function SitioHeader({ sitio, redes }: { sitio: Sitio; redes: Redes }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dark, setDark] = useState(false);
  const [fecha, setFecha] = useState("");
  const router = useRouter();
  const cp = sitio.color_primario;
  const ca = sitio.color_acento;

  useEffect(() => {
    const hoy = new Date();
    const texto = hoy.toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    setFecha(texto.charAt(0).toUpperCase() + texto.slice(1));
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(`theme-${sitio.slug}`);
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("theme-dark", isDark);
  }, [sitio.slug]);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("theme-dark", next);
    localStorage.setItem(`theme-${sitio.slug}`, next ? "dark" : "light");
  }

  const ThemeIcon = () =>
    dark ? (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
      </svg>
    ) : (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );

  const navLinks = [
    { href: `/sitios/${sitio.slug}#inicio`, label: "INICIO" },
    { href: `/sitios/${sitio.slug}#ultimas`, label: "ULTIMAS" },
  ];

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-3 items-center md:flex md:justify-between gap-3">
          <button
            type="button"
            onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}
            aria-label="Buscar"
            className="md:hidden w-10 h-10 flex items-center justify-center justify-self-start rounded border border-slate-200 flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={cp} strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <Link href={`/sitios/${sitio.slug}`} className="flex items-center gap-3 flex-shrink-0 justify-self-center md:justify-self-auto">
            {sitio.logo_url ? (
              <img src={sitio.logo_url} alt={sitio.nombre} className="h-14 md:h-16 w-auto object-contain" />
            ) : (
              <span style={{ color: cp }} className="text-xl md:text-2xl font-extrabold tracking-tight">{sitio.nombre}</span>
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-1 font-extrabold text-[13px] flex-shrink-0">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} style={{ color: cp }} className="px-2 py-2 whitespace-nowrap rounded hover:opacity-70 transition">
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Cambiar tema"
              className="ml-1 w-9 h-9 flex items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:opacity-70 transition"
            >
              <ThemeIcon />
            </button>
          </nav>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) router.push(`/sitios/${sitio.slug}/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
            }}
            className="hidden md:flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 gap-2 flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cp} strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar..." className="bg-white outline-none text-sm w-24 lg:w-36" />
          </form>

          <button
            className="md:hidden w-10 h-10 flex items-center justify-center justify-self-end rounded border border-slate-200 flex-shrink-0"
            onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}
            aria-label="Abrir menu"
          >
            <svg width="22" height="22" viewBox="0 0 30 30">
              <path d="M4 7H26M4 15H26M4 23H26" stroke={cp} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {searchOpen && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) { setSearchOpen(false); router.push(`/sitios/${sitio.slug}/buscar?q=${encodeURIComponent(searchQuery.trim())}`); }
            }}
            className="md:hidden border-t border-slate-200 px-4 py-3 flex items-center bg-white"
          >
            <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 gap-2 flex-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cp} strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar..." className="bg-white outline-none text-sm flex-1" />
            </div>
          </form>
        )}

        {menuOpen && (
          <nav className="md:hidden border-t border-slate-200 px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="px-2 py-3 font-extrabold text-sm text-slate-800 border-b border-slate-100 transition">
                {link.label}
              </a>
            ))}
            <button type="button" onClick={toggleTheme} className="flex items-center gap-2 px-2 py-3 font-extrabold text-sm text-slate-800 transition">
              <ThemeIcon />
              {dark ? "MODO CLARO" : "MODO OSCURO"}
            </button>
          </nav>
        )}
      </header>
    </>
  );
}