type Sitio = { slug: string; nombre: string; logo_url: string | null };
type Redes = { facebook?: string; youtube?: string; instagram?: string; tiktok?: string };

export default function SitioFooter({ sitio, redes }: { sitio: Sitio; redes: Redes }) {
  return (
    <footer style={{ background: "#04223f" }} className="text-slate-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            {sitio.logo_url ? (
              <img src={sitio.logo_url} alt={sitio.nombre} className="h-16 w-auto object-contain" />
            ) : (
              <h2 className="text-white text-xl font-extrabold">{sitio.nombre}</h2>
            )}
            <p className="text-sm mt-3 max-w-xs leading-relaxed">
              Toda la actualidad, resultados y analisis en un solo lugar.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-4">SECCIONES</h3>
            <ul className="space-y-2 text-sm">
              <li><a href={`/sitios/${sitio.slug}#inicio`} className="hover:text-white transition">Inicio</a></li>
              <li><a href={`/sitios/${sitio.slug}#ultimas`} className="hover:text-white transition">Ultimas noticias</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-4">SIGUENOS EN</h3>
            <div className="flex items-center gap-3">
              {redes.facebook && (
                <a href={redes.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-11 h-11 rounded-full bg-[#1877F2] hover:opacity-80 transition flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6v1.9h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>
                </a>
              )}
              {redes.tiktok && (
                <a href={redes.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" className="w-11 h-11 rounded-full bg-black hover:opacity-80 transition flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M16.6 5.82c-.9-.88-1.44-2.05-1.5-3.32h-3.18v13.4a3.3 3.3 0 1 1-2.34-3.15V9.5a6.5 6.5 0 1 0 5.52 6.43V9.4a8.16 8.16 0 0 0 4.86 1.58V7.8a4.85 4.85 0 0 1-3.36-1.98Z"/></svg>
                </a>
              )}
              {redes.instagram && (
                <a href={redes.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-11 h-11 rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-80 transition flex items-center justify-center">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="white"><path d="M12 2c-2.7 0-3.06.01-4.12.06-1.06.05-1.79.22-2.43.47-.66.26-1.22.6-1.77 1.16-.56.55-.9 1.11-1.16 1.77-.25.64-.42 1.37-.47 2.43C2 8.94 2 9.3 2 12s.01 3.06.06 4.12c.05 1.06.22 1.79.47 2.43.26.66.6 1.22 1.16 1.77.55.56 1.11.9 1.77 1.16.64.25 1.37.42 2.43.47C8.94 22 9.3 22 12 22s3.06-.01 4.12-.06c1.06-.05 1.79-.22 2.43-.47.66-.26 1.22-.6 1.77-1.16.56-.55.9-1.11 1.16-1.77.25-.64.42-1.37.47-2.43.05-1.06.06-1.42.06-4.12s-.01-3.06-.06-4.12c-.05-1.06-.22-1.79-.47-2.43a4.9 4.9 0 0 0-1.16-1.77 4.9 4.9 0 0 0-1.77-1.16c-.64-.25-1.37-.42-2.43-.47C15.06 2.01 14.7 2 12 2Zm0 1.8c2.65 0 2.97.01 4 .06.97.04 1.5.2 1.85.34.46.18.8.4 1.15.75.35.35.57.69.75 1.15.14.35.3.88.34 1.85.05 1.03.06 1.35.06 4s-.01 2.97-.06 4c-.04.97-.2 1.5-.34 1.85-.18.46-.4.8-.75 1.15-.35.35-.69.57-1.15.75-.35.14-.88.3-1.85.34-1.03.05-1.35.06-4 .06s-2.97-.01-4-.06c-.97-.04-1.5-.2-1.85-.34a3.1 3.1 0 0 1-1.15-.75 3.1 3.1 0 0 1-.75-1.15c-.14-.35-.3-.88-.34-1.85-.05-1.03-.06-1.35-.06-4s.01-2.97.06-4c.04-.97.2-1.5.34-1.85.18-.46.4-.8.75-1.15.35-.35.69-.57 1.15-.75.35-.14.88-.3 1.85-.34 1.03-.05 1.35-.06 4-.06Zm0 3.5a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.75a3.05 3.05 0 1 1 0-6.1 3.05 3.05 0 0 1 0 6.1Zm5.98-7.94a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z"/></svg>
                </a>
              )}
              {redes.youtube && (
                <a href={redes.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="w-11 h-11 rounded-full bg-[#FF0000] hover:opacity-80 transition flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M23 12s0-3.6-.5-5.3c-.3-1-1-1.8-2-2C18.9 4.2 12 4.2 12 4.2s-6.9 0-8.5.5c-1 .2-1.8 1-2 2C1 8.4 1 12 1 12s0 3.6.5 5.3c.2 1 1 1.8 2 2 1.6.5 8.5.5 8.5.5s6.9 0 8.5-.5c1-.2 1.7-1 2-2 .5-1.7.5-5.3.5-5.3ZM9.8 15.5v-7l6 3.5-6 3.5Z"/></svg>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-slate-500">
          (c) {new Date().getFullYear()} {sitio.nombre}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}