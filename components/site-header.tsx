"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/#inicio", label: "INICIO" },
  { href: "/#nacionales", label: "NACIONALES" },
  { href: "/#internacionales", label: "INTERNACIONALES" },
  { href: "/#israel", label: "ISRAEL" },
  { href: "/#fe", label: "FE Y COMUNIDAD" },
  { href: "/biblia", label: "BIBLIA" },
  { href: "/#reflexion", label: "REFLEXION" },
];

type Redes = { facebook: string; youtube: string; instagram: string; tiktok: string };

export default function SiteHeader({ redes }: { redes: Redes }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [fecha, setFecha] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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

  return (
    <>
      <div className="bg-[#04223f] text-slate-200 text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <span>{fecha}</span>
          <div className="flex items-center gap-4">
            <a href={redes.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-[#C9972B] transition">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6v1.9h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>
            </a>
            <a href={redes.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-[#C9972B] transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.6-.5-5.3c-.3-1-1-1.8-2-2C18.9 4.2 12 4.2 12 4.2s-6.9 0-8.5.5c-1 .2-1.8 1-2 2C1 8.4 1 12 1 12s0 3.6.5 5.3c.2 1 1 1.8 2 2 1.6.5 8.5.5 8.5.5s6.9 0 8.5-.5c1-.2 1.7-1 2-2 .5-1.7.5-5.3.5-5.3ZM9.8 15.5v-7l6 3.5-6 3.5Z"/></svg>
            </a>
            <a href={redes.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-[#C9972B] transition">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-2.7 0-3.06.01-4.12.06-1.06.05-1.79.22-2.43.47-.66.26-1.22.6-1.77 1.16-.56.55-.9 1.11-1.16 1.77-.25.64-.42 1.37-.47 2.43C2 8.94 2 9.3 2 12s.01 3.06.06 4.12c.05 1.06.22 1.79.47 2.43.26.66.6 1.22 1.16 1.77.55.56 1.11.9 1.77 1.16.64.25 1.37.42 2.43.47C8.94 22 9.3 22 12 22s3.06-.01 4.12-.06c1.06-.05 1.79-.22 2.43-.47.66-.26 1.22-.6 1.77-1.16.56-.55.9-1.11 1.16-1.77.25-.64.42-1.37.47-2.43.05-1.06.06-1.42.06-4.12s-.01-3.06-.06-4.12c-.05-1.06-.22-1.79-.47-2.43a4.9 4.9 0 0 0-1.16-1.77 4.9 4.9 0 0 0-1.77-1.16c-.64-.25-1.37-.42-2.43-.47C15.06 2.01 14.7 2 12 2Zm0 1.8c2.65 0 2.97.01 4 .06.97.04 1.5.2 1.85.34.46.18.8.4 1.15.75.35.35.57.69.75 1.15.14.35.3.88.34 1.85.05 1.03.06 1.35.06 4s-.01 2.97-.06 4c-.04.97-.2 1.5-.34 1.85-.18.46-.4.8-.75 1.15-.35.35-.69.57-1.15.75-.35.14-.88.3-1.85.34-1.03.05-1.35.06-4 .06s-2.97-.01-4-.06c-.97-.04-1.5-.2-1.85-.34a3.1 3.1 0 0 1-1.15-.75 3.1 3.1 0 0 1-.75-1.15c-.14-.35-.3-.88-.34-1.85-.05-1.03-.06-1.35-.06-4s.01-2.97.06-4c.04-.97.2-1.5.34-1.85.18-.46.4-.8.75-1.15.35-.35.69-.57 1.15-.75.35-.14.88-.3 1.85-.34 1.03-.05 1.35-.06 4-.06Zm0 3.5a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.75a3.05 3.05 0 1 1 0-6.1 3.05 3.05 0 0 1 0 6.1Zm5.98-7.94a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image src="/logo.png" alt="La Biblia Cambia Noticias" width={56} height={56} className="w-12 h-12 md:w-14 md:h-14 object-contain" priority />
            <div className="leading-tight whitespace-nowrap">
              <span className="block text-base md:text-xl font-extrabold text-[#063B73] tracking-tight whitespace-nowrap">
                LA BIBLIA CAMBIA
              </span>
              <span className="block text-[9px] md:text-xs tracking-[0.15em] text-[#C9972B] font-bold mt-1 whitespace-nowrap">
                ACTUALIDAD - FE - VERDAD
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 font-extrabold text-[13px] flex-shrink-0">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="px-2 py-2 whitespace-nowrap rounded text-slate-800 hover:text-[#C9972B] border-b-2 border-transparent hover:border-[#C9972B] transition">
                {link.label}
              </a>
            ))}
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

          <button className="md:hidden w-10 h-10 flex items-center justify-center rounded border border-slate-200 flex-shrink-0" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">
            <svg width="22" height="22" viewBox="0 0 30 30">
              <path d="M4 7H26M4 15H26M4 23H26" stroke="#063B73" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

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
          </nav>
        )}
      </header>
    </>
  );
}
