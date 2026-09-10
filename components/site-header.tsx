"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const visibleLinks = [
  { href: "/#inicio", label: "INICIO" },
  { href: "/#nacionales", label: "NACIONALES" },
  { href: "/#internacionales", label: "INTERNACIONALES" },
  { href: "/#israel", label: "ISRAEL" },
];

const moreLinks = [
  { href: "/#fe", label: "FE Y COMUNIDAD" },
  { href: "/biblia", label: "BIBLIA" },
  { href: "/#reflexion", label: "REFLEXION" },
];

const navLinks = [...visibleLinks, ...moreLinks];

type Redes = { facebook: string; youtube: string; instagram: string; tiktok: string };

export default function SiteHeader({ redes }: { redes: Redes }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [fecha, setFecha] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [tendencias, setTendencias] = useState<{ titulo: string; slug: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const hoy = new Date();
    const texto = hoy.toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setFecha(texto.charAt(0).toUpperCase() + texto.slice(1));
  }, []);

  useEffect(() => {
    fetch("/api/tendencias")
      .then((r) => r.json())
      .then((data) => setTendencias(data))
      .catch(() => setTendencias([]));
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("theme-dark", isDark);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("theme-dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
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

  return (
    <>
      <div className="bg-[#04223f] text-slate-200 text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4 overflow-hidden">
          {tendencias.length > 0 && (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="font-bold text-white flex-shrink-0 hidden sm:inline">Tendencias:</span>
              <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {tendencias.map((t) => (
                  <Link key={t.slug} href={`/noticias/${t.slug}`} className="hover:text-[#C9972B] transition flex-shrink-0">
                    {t.titulo}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            <a href={redes.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-6 h-6 rounded-full bg-[#1877F2] hover:opacity-80 transition flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6v1.9h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>
            </a>
            <a href={redes.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" className="w-6 h-6 rounded-full bg-black hover:opacity-80 transition flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M16.6 5.82c-.9-.88-1.44-2.05-1.5-3.32h-3.18v13.4a3.3 3.3 0 1 1-2.34-3.15V9.5a6.5 6.5 0 1 0 5.52 6.43V9.4a8.16 8.16 0 0 0 4.86 1.58V7.8a4.85 4.85 0 0 1-3.36-1.98Z"/></svg>
            </a>
            <a href={redes.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-6 h-6 rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-80 transition flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2c-2.7 0-3.06.01-4.12.06-1.06.05-1.79.22-2.43.47-.66.26-1.22.6-1.77 1.16-.56.55-.9 1.11-1.16 1.77-.25.64-.42 1.37-.47 2.43C2 8.94 2 9.3 2 12s.01 3.06.06 4.12c.05 1.06.22 1.79.47 2.43.26.66.6 1.22 1.16 1.77.55.56 1.11.9 1.77 1.16.64.25 1.37.42 2.43.47C8.94 22 9.3 22 12 22s3.06-.01 4.12-.06c1.06-.05 1.79-.22 2.43-.47.66-.26 1.22-.6 1.77-1.16.56-.55.9-1.11 1.16-1.77.25-.64.42-1.37.47-2.43.05-1.06.06-1.42.06-4.12s-.01-3.06-.06-4.12c-.05-1.06-.22-1.79-.47-2.43a4.9 4.9 0 0 0-1.16-1.77 4.9 4.9 0 0 0-1.77-1.16c-.64-.25-1.37-.42-2.43-.47C15.06 2.01 14.7 2 12 2Zm0 1.8c2.65 0 2.97.01 4 .06.97.04 1.5.2 1.85.34.46.18.8.4 1.15.75.35.35.57.69.75 1.15.14.35.3.88.34 1.85.05 1.03.06 1.35.06 4s-.01 2.97-.06 4c-.04.97-.2 1.5-.34 1.85-.18.46-.4.8-.75 1.15-.35.35-.69.57-1.15.75-.35.14-.88.3-1.85.34-1.03.05-1.35.06-4 .06s-2.97-.01-4-.06c-.97-.04-1.5-.2-1.85-.34a3.1 3.1 0 0 1-1.15-.75 3.1 3.1 0 0 1-.75-1.15c-.14-.35-.3-.88-.34-1.85-.05-1.03-.06-1.35-.06-4s.01-2.97.06-4c.04-.97.2-1.5.34-1.85.18-.46.4-.8.75-1.15.35-.35.69-.57 1.15-.75.35-.14.88-.3 1.85-.34 1.03-.05 1.35-.06 4-.06Zm0 3.5a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.75a3.05 3.05 0 1 1 0-6.1 3.05 3.05 0 0 1 0 6.1Zm5.98-7.94a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z"/></svg>
            </a>
            <a href={redes.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="w-6 h-6 rounded-full bg-[#FF0000] hover:opacity-80 transition flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M23 12s0-3.6-.5-5.3c-.3-1-1-1.8-2-2C18.9 4.2 12 4.2 12 4.2s-6.9 0-8.5.5c-1 .2-1.8 1-2 2C1 8.4 1 12 1 12s0 3.6.5 5.3c.2 1 1 1.8 2 2 1.6.5 8.5.5 8.5.5s6.9 0 8.5-.5c1-.2 1.7-1 2-2 .5-1.7.5-5.3.5-5.3ZM9.8 15.5v-7l6 3.5-6 3.5Z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-3 items-center md:flex md:justify-between gap-3">
          <button
            type="button"
            onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}
            aria-label="Buscar"
            className="md:hidden w-10 h-10 flex items-center justify-center justify-self-start rounded border border-slate-200 flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#063B73" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <Link href="/" className="flex items-center gap-3 flex-shrink-0 justify-self-center md:justify-self-auto">
            <Image src="/LOGO-ISRAEL.png" alt="La Biblia Cambia Noticias" width={400} height={130} className="h-14 md:h-16 max-w-none w-auto object-contain" priority />
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 font-extrabold text-[13px] flex-shrink-0">
            {visibleLinks.map((link) => (
              <a key={link.href} href={link.href} className="px-2 py-2 whitespace-nowrap rounded text-slate-800 hover:text-[#C9972B] border-b-2 border-transparent hover:border-[#C9972B] transition">
                {link.label}
              </a>
            ))}

            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen(!moreOpen)}
                onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
                className="px-2 py-2 whitespace-nowrap rounded text-slate-800 hover:text-[#C9972B] border-b-2 border-transparent hover:border-[#C9972B] transition"
              >
                MAS &#9662;
              </button>
              {moreOpen && (
                <div className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[180px] z-50">
                  {moreLinks.map((link) => (
                    <a key={link.href} href={link.href} className="block px-4 py-2 text-slate-800 hover:text-[#C9972B] hover:bg-slate-50 transition whitespace-nowrap">
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Cambiar color de la pagina"
              className="ml-1 w-9 h-9 flex items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:text-[#C9972B] hover:border-[#C9972B] transition"
            >
              <ThemeIcon />
            </button>
          </nav>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
            className="hidden md:flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 gap-2 flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#063B73" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar..." className="bg-white outline-none text-sm w-24 lg:w-36" />
          </form>

          <button className="md:hidden w-10 h-10 flex items-center justify-center justify-self-end rounded border border-slate-200 flex-shrink-0" onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }} aria-label="Abrir menu">
            <svg width="22" height="22" viewBox="0 0 30 30">
              <path d="M4 7H26M4 15H26M4 23H26" stroke="#063B73" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {searchOpen && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                setSearchOpen(false);
                router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
            className="md:hidden border-t border-slate-200 px-4 py-3 flex items-center bg-white"
          >
            <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 gap-2 flex-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#063B73" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar noticias..."
                className="bg-white outline-none text-sm flex-1"
              />
            </div>
          </form>
        )}

        {menuOpen && (
          <nav className="md:hidden border-t border-slate-200 px-4 py-3 flex flex-col gap-1">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  setMenuOpen(false);
                  router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 gap-2 mb-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#063B73" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar noticias..." className="bg-white outline-none text-sm flex-1" />
            </form>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="px-2 py-3 font-extrabold text-sm text-slate-800 hover:text-[#C9972B] border-b border-slate-100 transition">
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 px-2 py-3 font-extrabold text-sm text-slate-800 hover:text-[#C9972B] transition"
            >
              <ThemeIcon />
              {dark ? "MODO CLARO" : "MODO OSCURO"}
            </button>
          </nav>
        )}
      </header>
    </>
  );
}
