"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { NoticiaCard, VideoItem, CancionItem, AvisoUrgente , AnuncioItem } from "@/lib/home-data";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getYoutubeThumbnail, getYoutubeEmbedUrl } from "@/lib/youtube";
import AnuncioBanner from "@/components/anuncio-banner";

const navLinks = [
  { href: "#inicio", label: "INICIO" },
  { href: "#nacionales", label: "NACIONALES" },
  { href: "#internacionales", label: "INTERNACIONALES" },
  { href: "#fe", label: "FE Y COMUNIDAD" },
  { href: "#videos", label: "VIDEOS" },
  { href: "/biblia", label: "BIBLIA" },
  { href: "#reflexion", label: "REFLEXION" },
];

type Props = {
  principal?: NoticiaCard;
  heroSide: NoticiaCard[];
  nacionales: NoticiaCard[];
  internacionales: NoticiaCard[];
  israel: NoticiaCard[];
  fe: NoticiaCard[];
  analisis?: NoticiaCard;
  ultimasNoticias: string[];
  versiculo: { texto: string; referencia: string; imagen: string | null; momento: "dia" | "noche" };
  videos: VideoItem[];
  canciones: CancionItem[];
  aviso: AvisoUrgente;
  anuncioLanding: AnuncioItem | null;
  redes: { facebook: string; youtube: string; instagram: string; tiktok: string };
};

export default function HomeClient({
  principal,
  heroSide,
  nacionales,
  internacionales,
  israel,
  fe,
  analisis,
  ultimasNoticias,
  versiculo,
  videos,
  canciones,
  aviso,
  anuncioLanding,
  redes,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [breakingIndex, setBreakingIndex] = useState(0);
  const [fecha, setFecha] = useState("");
  const [videoActivoId, setVideoActivoId] = useState<string | undefined>(undefined);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [cancionActivaId, setCancionActivaId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [mostrarUltimaHora, setMostrarUltimaHora] = useState(true);
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

    const intervalo = setInterval(() => {
      setBreakingIndex((i) => (i + 1) % ultimasNoticias.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, [ultimasNoticias.length]);

  const videoDestacado = videos[0];
  const videosLista = videos.slice(1);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader redes={redes} />

      {aviso.activo && aviso.texto && (
        <div className="bg-[#c62828] text-white">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4">
            <span className="text-xs font-extrabold tracking-wide border-r border-white/40 pr-4 whitespace-nowrap">
              ULTIMA HORA
            </span>
            <span className="text-sm">
              {aviso.texto}
            </span>
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-4 pt-6">
        <div className="relative rounded-xl overflow-hidden min-h-[220px] md:min-h-[260px] bg-[#0a1628] flex items-center" style={{ backgroundImage: "url('/BIBLIA.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
          {versiculo.imagen && (
            <img
              src={versiculo.imagen}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0a1628]/85 to-[#0a1628]/40" />
          <div className="relative px-6 py-8 md:px-10 md:py-10 max-w-2xl text-white">
            <div className="flex items-center gap-2 mb-4 text-sm font-bold">
              <span className="text-[#C9972B] text-lg">
                {versiculo.momento === "noche" ? "\u{1F319}" : "\u2600\uFE0F"}
              </span>
              <span className="uppercase tracking-wide">
                {versiculo.momento === "noche" ? "Versiculo de la noche" : "Versiculo del dia"}
              </span>
              <span className="text-slate-400">|</span>
              <span className="italic text-[#C9972B]">{versiculo.referencia}</span>
            </div>
            <blockquote className="font-serif text-xl md:text-2xl leading-relaxed">
              &laquo;&nbsp;{versiculo.texto}&nbsp;&raquo;
            </blockquote>
            <span className="block mt-6 text-xs text-slate-300 font-semibold">
              {fecha}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">

        <section id="inicio" className="grid lg:grid-cols-3 gap-5 py-8">

          {principal && (
            <Link
              href={`/noticias/${principal.slug}`}
              className="lg:col-span-2 relative rounded-xl overflow-hidden min-h-[300px] md:min-h-[420px] bg-[#063B73] block"
            >
              <img
                src={principal.imagen}
                alt={principal.titulo}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <span className="inline-block bg-[#C9972B] text-[#04223f] text-xs font-extrabold px-3 py-1 rounded uppercase animate-fade-in-up" style={{ animationDelay: "0ms" }}>
                  {principal.categoria}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold mt-3 max-w-xl leading-tight animate-fade-in-up" style={{ animationDelay: "120ms" }}>
                  {principal.titulo}
                </h2>
                <p className="text-slate-200 mt-2 max-w-lg text-sm md:text-base animate-fade-in-up" style={{ animationDelay: "240ms" }}>
                  {principal.descripcion}
                </p>
              </div>
            </Link>
          )}

          <div className="grid grid-rows-2 gap-5">
            {heroSide.map((n) => (
              <Link
                key={n.id}
                href={`/noticias/${n.slug}`}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden grid grid-cols-[42%_58%] hover:-translate-y-1 hover:shadow-lg transition"
              >
                <img
                  src={n.imagen}
                  alt={n.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="p-4">
                  <span className="inline-block bg-[#C9972B] text-[#04223f] text-[9px] font-extrabold px-2 py-1 rounded uppercase">
                    {n.categoria}
                  </span>
                  <h3 className="mt-2 font-bold text-[#063B73] text-sm leading-snug">
                    {n.titulo}
                  </h3>
                  <span className="text-xs text-slate-400 mt-2 block">
                    {n.fecha}
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </section>

        <section id="nacionales" className="py-8">
          <div className="flex items-center justify-between border-b-2 border-[#063B73] pb-3 mb-6">
            <h2 className="text-2xl font-extrabold text-[#063B73]">
              Noticias Nacionales
            </h2>
            <a href="#" className="text-sm font-bold text-[#C9972B] hover:text-[#b78620]">
              VER TODAS
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {nacionales.map((n) => (
              <Link
                key={n.id}
                href={`/noticias/${n.slug}`}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-lg transition block"
              >
                <div className="h-48">
                  <img
                    src={n.imagen}
                    alt={n.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[#C9972B] font-extrabold text-xs">
                    {n.categoria}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-[#063B73] leading-snug">
                    {n.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {n.descripcion}
                  </p>
                  <span className="block mt-3 text-xs text-slate-400">
                    {n.fechaHora}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {anuncioLanding && (
          <section className="py-6">
            <AnuncioBanner anuncio={anuncioLanding} />
          </section>
        )}

        <section id="internacionales" className="py-8">
          <div className="flex items-center justify-between border-b-2 border-[#063B73] pb-3 mb-6">
            <h2 className="text-2xl font-extrabold text-[#063B73]">
              Noticias Internacionales
            </h2>
            <a href="#" className="text-sm font-bold text-[#C9972B] hover:text-[#b78620]">
              VER TODAS
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {internacionales.map((n) => (
              <Link
                key={n.id}
                href={`/noticias/${n.slug}`}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-lg transition block"
              >
                <div className="h-48">
                  <img
                    src={n.imagen}
                    alt={n.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[#C9972B] font-extrabold text-xs">
                    {n.categoria}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-[#063B73] leading-snug">
                    {n.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {n.descripcion}
                  </p>
                  <span className="block mt-3 text-xs text-slate-400">
                    {n.fecha}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="israel" className="py-8">
          <div className="flex items-center justify-between border-b-2 border-[#063B73] pb-3 mb-6">
            <h2 className="text-2xl font-extrabold text-[#063B73]">
              Noticias de Israel
            </h2>
            <a href="#" className="text-sm font-bold text-[#C9972B] hover:text-[#b78620]">
              VER TODAS
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {israel.map((n) => (
              <Link
                key={n.id}
                href={`/noticias/${n.slug}`}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-lg transition block"
              >
                <div className="h-48">
                  <img
                    src={n.imagen}
                    alt={n.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[#C9972B] font-extrabold text-xs">
                    {n.categoria}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-[#063B73] leading-snug">
                    {n.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {n.descripcion}
                  </p>
                  <span className="block mt-3 text-xs text-slate-400">
                    {n.fecha}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="fe" className="py-8">
          <div className="flex items-center justify-between border-b-2 border-[#063B73] pb-3 mb-6">
            <h2 className="text-2xl font-extrabold text-[#063B73]">
              Noticias de Fe
            </h2>
            <a href="#" className="text-sm font-bold text-[#C9972B] hover:text-[#b78620]">
              VER TODAS
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {fe.map((n) => (
              <Link
                key={n.id}
                href={`/noticias/${n.slug}`}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-lg transition block"
              >
                <div className="h-48">
                  <img
                    src={n.imagen}
                    alt={n.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[#C9972B] font-extrabold text-xs">
                    {n.categoria}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-[#063B73] leading-snug">
                    {n.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {n.descripcion}
                  </p>
                  <span className="block mt-3 text-xs text-slate-400">
                    {n.fecha}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        {analisis && (
          <section id="destacado" className="py-8">
            <div className="grid md:grid-cols-[1.4fr_1fr] rounded-xl overflow-hidden bg-[#063B73]">
              <div className="min-h-[260px] md:min-h-[340px]">
                <img
                  src={analisis.imagen}
                  alt={analisis.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center text-white">
                <span className="inline-block w-max bg-[#C9972B] text-[#04223f] text-xs font-extrabold px-3 py-1 rounded uppercase mb-4">
                  {analisis.categoria}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
                  {analisis.titulo}
                </h2>
                <p className="mt-4 text-slate-200 text-sm">
                  {analisis.descripcion}
                </p>
                <Link
                  href={`/noticias/${analisis.slug}`}
                  className="mt-6 w-max bg-[#C9972B] hover:bg-[#b78620] text-[#04223f] font-extrabold text-xs px-5 py-3 rounded transition"
                >
                  LEER ARTICULO
                </Link>
              </div>
            </div>
          </section>
        )}

        <section id="videos" className="py-8">
          <div className="flex items-center justify-between border-b-2 border-[#063B73] pb-3 mb-6">
            <h2 className="text-2xl font-extrabold text-[#063B73]">
              Videos y Entrevistas
            </h2>
          </div>
          <div className="grid md:grid-cols-[2fr_1fr] gap-5">
            {(() => {
              const principal =
                videos.find((v) => v.id === videoActivoId) || videoDestacado;
              const miniaturaPrincipal = principal ? getYoutubeThumbnail(principal.url) : null;
              const embedPrincipal = principal ? getYoutubeEmbedUrl(principal.url) : null;

              return (
                <div className="relative bg-[#04223f] rounded-xl min-h-[280px] md:min-h-[320px] overflow-hidden">
                  {reproduciendo && embedPrincipal ? (
                    <iframe
                      key={embedPrincipal}
                      src={embedPrincipal}
                      title={principal?.titulo || "Video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setReproduciendo(true)}
                      className="absolute inset-0 w-full h-full flex items-center justify-center"
                      aria-label="Reproducir video"
                    >
                      {miniaturaPrincipal ? (
                        <img
                          src={miniaturaPrincipal}
                          alt={principal?.titulo || "Video"}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-black/40" />
                      <span className="relative w-16 h-16 rounded-full border-2 border-white/80 flex items-center justify-center hover:scale-110 hover:bg-white/10 transition">
                        <svg width="24" viewBox="0 0 30 30">
                          <path d="M7 4L25 15L7 26Z" fill="white" />
                        </svg>
                      </span>
                      <span className="absolute bottom-5 left-5 right-5 text-white font-bold text-lg text-left">
                        {principal?.titulo || "Entrevista especial: historias que transforman vidas"}
                      </span>
                    </button>
                  )}
                </div>
              );
            })()}

            <div className="flex flex-col gap-3">
              {videosLista.map((v) => {
                const miniatura = getYoutubeThumbnail(v.url);
                const activo = v.id === videoActivoId || (!videoActivoId && v.id === videoDestacado?.id);
                return (
                  <button
                    type="button"
                    key={v.id}
                    onClick={() => {
                      setVideoActivoId(v.id);
                      setReproduciendo(true);
                    }}
                    className={`bg-white border rounded-lg p-3 flex items-center gap-3 text-left transition ${
                      activo ? "border-[#C9972B]" : "border-slate-200"
                    }`}
                  >
                    <div className="w-20 h-16 bg-[#536d7e] flex items-center justify-center rounded flex-shrink-0 overflow-hidden relative">
                      {miniatura ? (
                        <img src={miniatura} alt={v.titulo} className="absolute inset-0 w-full h-full object-cover" />
                      ) : null}
                      <svg width="20" viewBox="0 0 30 30" className="relative z-10">
                        <path d="M7 4L25 15L7 26Z" fill="white" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-[#063B73] leading-snug">
                      {v.titulo}
                    </h3>
                  </button>
                );
              })}
              {!videosLista.length && (
                <p className="text-sm text-slate-400">Aun no hay mas videos.</p>
              )}
            </div>
          </div>
        </section>

        <section id="musica" className="py-8">
          <div className="flex items-center justify-between border-b-2 border-[#063B73] pb-3 mb-6">
            <h2 className="text-2xl font-extrabold text-[#063B73]">
              Musica
            </h2>
          </div>
          {canciones.length ? (
            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
              {canciones.map((c) => {
                const activa = cancionActivaId === c.id;
                return (
                  <div key={c.id} className="flex items-center gap-4 p-4">
                    <button
                      type="button"
                      onClick={() => setCancionActivaId(activa ? undefined : c.id)}
                      className="w-12 h-12 rounded-full bg-[#063B73] flex items-center justify-center flex-shrink-0 overflow-hidden relative"
                      aria-label={activa ? "Pausar" : "Reproducir"}
                    >
                      {c.portada ? (
                        <img src={c.portada} alt={c.titulo} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                      ) : null}
                      <svg width="16" viewBox="0 0 30 30" className="relative z-10">
                        {activa ? (
                          <g fill="white">
                            <rect x="8" y="6" width="5" height="18" />
                            <rect x="17" y="6" width="5" height="18" />
                          </g>
                        ) : (
                          <path d="M7 4L25 15L7 26Z" fill="white" />
                        )}
                      </svg>
                    </button>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#063B73] text-sm">{c.titulo}</h3>
                      {c.artista && <p className="text-xs text-slate-400">{c.artista}</p>}
                    </div>
                    {activa && (
                      <audio
                        src={c.url}
                        autoPlay
                        controls
                        onEnded={() => setCancionActivaId(undefined)}
                        className="max-w-[220px]"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400">Aun no hay canciones publicadas.</p>
          )}
        </section>

        <section className="py-8">
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-extrabold text-[#063B73]">
                Recibe las noticias directamente
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                Suscribete y recibe las principales noticias cristianas en tu correo electronico.
              </p>
            </div>
            <div className="flex w-full md:w-auto md:min-w-[420px]">
              <input
                type="email"
                placeholder="Tu correo electronico"
                className="flex-1 px-4 py-3 border border-slate-300 border-r-0 outline-none rounded-l-lg"
              />
              <button className="bg-[#063B73] hover:bg-[#052a52] text-white font-extrabold text-xs px-6 rounded-r-lg transition">
                SUSCRIBIRME
              </button>
            </div>
          </div>
        </section>

      </div>

      <SiteFooter redes={redes} />

    </main>
  );
}
