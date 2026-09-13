import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SitioHeader from "@/components/sitio-header";
import SitioFooter from "@/components/sitio-footer";
import AnuncioBanner from "@/components/anuncio-banner";
import FormularioSuscripcionSitio from "@/components/formulario-suscripcion-sitio";
import PartidosCarousel from "@/components/partidos-carousel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: sitio } = await supabase
    .from("sitios")
    .select("nombre, logo_url")
    .eq("slug", slug)
    .single()

  return {
    title: { absolute: sitio?.nombre || "Sitio no encontrado" },
    icons: sitio?.logo_url ? { icon: sitio.logo_url } : undefined,
  }
}

export default async function SitioHomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: sitio } = await supabase
    .from("sitios")
    .select("*")
    .eq("slug", slug)
    .eq("activo", true)
    .single();

  if (!sitio) notFound();

  const [{ data: noticias }, { data: redesRaw }, { data: anuncioRaw }] = await Promise.all([
    supabase
      .from("noticias")
      .select("id, slug, titulo, descripcion, imagen, created_at, categorias(nombre)")
      .eq("sitio_id", sitio.id)
      .eq("publicado", true)
      .order("created_at", { ascending: false })
      .limit(30),
    supabase.from("redes_sociales").select("plataforma, url").eq("sitio_id", sitio.id).eq("activo", true),
    supabase
      .from("anuncios")
      .select("id, titulo, descripcion, imagen, link, texto_boton")
      .eq("sitio_id", sitio.id)
      .eq("activo", true)
      .in("ubicacion", ["landing", "ambos"])
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  const redesMap = new Map<string, string>();
  (redesRaw ?? []).forEach((r: any) => redesMap.set(r.plataforma.toLowerCase(), r.url));
  const redes = {
    facebook: redesMap.get("facebook"),
    youtube: redesMap.get("youtube"),
    instagram: redesMap.get("instagram"),
    tiktok: redesMap.get("tiktok"),
  };

  const anuncio = anuncioRaw?.[0] || null;
  const lista = noticias ?? [];
  const principal = lista[0];
  const heroSide = lista.slice(1, 3);
  const resto = lista.slice(3);
  const ultimasNoticias = lista.slice(0, 5);

  function formatFecha(iso: string) {
    return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
  }

  const cp = sitio.color_primario;
  const ca = sitio.color_acento;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {ultimasNoticias.length > 0 && (
        <div style={{ background: cp }} className="text-white">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4 overflow-hidden">
            <span style={{ background: ca, color: "#111" }} className="text-xs font-extrabold tracking-wide px-3 py-1 rounded uppercase flex-shrink-0">
              Ultima hora
            </span>
            <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
              {ultimasNoticias.map((n: any, i: number) => (
                <span key={n.id} className="flex items-center gap-4 flex-shrink-0">
                  {i > 0 && <span className="text-white/30">|</span>}
                  <Link href={`/sitios/${slug}/noticias/${n.slug}`} className="text-sm hover:opacity-80 transition">
                    {n.titulo}
                  </Link>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 pl-3">
              {redes.facebook && (
                <a href={redes.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-6 h-6 rounded-full bg-[#1877F2] flex items-center justify-center hover:opacity-80 transition">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6v1.9h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>
                </a>
              )}
              {redes.tiktok && (
                <a href={redes.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" className="w-6 h-6 rounded-full bg-black flex items-center justify-center hover:opacity-80 transition">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M16.6 5.82c-.9-.88-1.44-2.05-1.5-3.32h-3.18v13.4a3.3 3.3 0 1 1-2.34-3.15V9.5a6.5 6.5 0 1 0 5.52 6.43V9.4a8.16 8.16 0 0 0 4.86 1.58V7.8a4.85 4.85 0 0 1-3.36-1.98Z"/></svg>
                </a>
              )}
              {redes.instagram && (
                <a href={redes.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-6 h-6 rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center hover:opacity-80 transition">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2c-2.7 0-3.06.01-4.12.06-1.06.05-1.79.22-2.43.47-.66.26-1.22.6-1.77 1.16-.56.55-.9 1.11-1.16 1.77-.25.64-.42 1.37-.47 2.43C2 8.94 2 9.3 2 12s.01 3.06.06 4.12c.05 1.06.22 1.79.47 2.43.26.66.6 1.22 1.16 1.77.55.56 1.11.9 1.77 1.16.64.25 1.37.42 2.43.47C8.94 22 9.3 22 12 22s3.06-.01 4.12-.06c1.06-.05 1.79-.22 2.43-.47.66-.26 1.22-.6 1.77-1.16.56-.55.9-1.11 1.16-1.77.25-.64.42-1.37.47-2.43.05-1.06.06-1.42.06-4.12s-.01-3.06-.06-4.12c-.05-1.06-.22-1.79-.47-2.43a4.9 4.9 0 0 0-1.16-1.77 4.9 4.9 0 0 0-1.77-1.16c-.64-.25-1.37-.42-2.43-.47C15.06 2.01 14.7 2 12 2Zm0 1.8c2.65 0 2.97.01 4 .06.97.04 1.5.2 1.85.34.46.18.8.4 1.15.75.35.35.57.69.75 1.15.14.35.3.88.34 1.85.05 1.03.06 1.35.06 4s-.01 2.97-.06 4c-.04.97-.2 1.5-.34 1.85-.18.46-.4.8-.75 1.15-.35.35-.69.57-1.15.75-.35.14-.88.3-1.85.34-1.03.05-1.35.06-4 .06s-2.97-.01-4-.06c-.97-.04-1.5-.2-1.85-.34a3.1 3.1 0 0 1-1.15-.75 3.1 3.1 0 0 1-.75-1.15c-.14-.35-.3-.88-.34-1.85-.05-1.03-.06-1.35-.06-4s.01-2.97.06-4c.04-.97.2-1.5.34-1.85.18-.46.4-.8.75-1.15.35-.35.69-.57 1.15-.75.35-.14.88-.3 1.85-.34 1.03-.05 1.35-.06 4-.06Zm0 3.5a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.75a3.05 3.05 0 1 1 0-6.1 3.05 3.05 0 0 1 0 6.1Zm5.98-7.94a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z"/></svg>
                </a>
              )}
              {redes.youtube && (
                <a href={redes.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="w-6 h-6 rounded-full bg-[#FF0000] flex items-center justify-center hover:opacity-80 transition">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M23 12s0-3.6-.5-5.3c-.3-1-1-1.8-2-2C18.9 4.2 12 4.2 12 4.2s-6.9 0-8.5.5c-1 .2-1.8 1-2 2C1 8.4 1 12 1 12s0 3.6.5 5.3c.2 1 1 1.8 2 2 1.6.5 8.5.5 8.5.5s6.9 0 8.5-.5c1-.2 1.7-1 2-2 .5-1.7.5-5.3.5-5.3ZM9.8 15.5v-7l6 3.5-6 3.5Z"/></svg>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <SitioHeader sitio={sitio} redes={redes} />

      {slug.includes("goles") && <PartidosCarousel colorPrimario={cp} />}

      <div className="max-w-7xl mx-auto px-4">
        {!lista.length && (
          <div className="bg-white border border-slate-200 rounded-xl p-12 my-8 text-center text-slate-400">
            Aun no hay noticias publicadas en este sitio.
          </div>
        )}

        {principal && (
          <section id="inicio" className="grid lg:grid-cols-3 gap-5 py-8">
            <Link
              href={`/sitios/${slug}/noticias/${principal.slug}`}
              className="lg:col-span-2 relative rounded-xl overflow-hidden min-h-[300px] md:min-h-[420px] block"
              style={{ background: cp }}
            >
              {principal.imagen && (
                <img src={principal.imagen} alt={principal.titulo} className="absolute inset-0 w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <span style={{ background: ca, color: "#111" }} className="inline-block text-xs font-extrabold px-3 py-1 rounded uppercase">
                  {(principal as any).categorias?.nombre || "Ultima hora"}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold mt-3 max-w-xl leading-tight">{principal.titulo}</h2>
                <p className="text-slate-200 mt-2 max-w-lg text-sm md:text-base">{principal.descripcion}</p>
              </div>
            </Link>

            <div className="grid grid-rows-2 gap-5">
              {heroSide.map((n: any) => (
                <Link
                  key={n.id}
                  href={`/sitios/${slug}/noticias/${n.slug}`}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden grid grid-cols-[42%_58%] hover:-translate-y-1 hover:shadow-lg transition"
                >
                  {n.imagen && <img src={n.imagen} alt={n.titulo} className="w-full h-full object-cover" />}
                  <div className="p-4">
                    <span style={{ background: ca, color: "#111" }} className="inline-block text-[9px] font-extrabold px-2 py-1 rounded uppercase">
                      {n.categorias?.nombre || "Noticias"}
                    </span>
                    <h3 style={{ color: cp }} className="mt-2 font-bold text-sm leading-snug">{n.titulo}</h3>
                    <span className="text-xs text-slate-400 mt-2 block">{formatFecha(n.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {anuncio && (
          <section className="py-6">
            <AnuncioBanner anuncio={anuncio} />
          </section>
        )}

        {resto.length > 0 && (
          <section id="ultimas" className="py-8">
            <div style={{ borderColor: cp }} className="flex items-center justify-between border-b-2 pb-3 mb-6">
              <h2 style={{ color: cp }} className="text-2xl font-extrabold">Ultimas noticias</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {resto.map((n: any) => (
                <Link
                  key={n.id}
                  href={`/sitios/${slug}/noticias/${n.slug}`}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-lg transition flex flex-col h-full"
                >
                  <div className="h-48 flex-shrink-0">
                    {n.imagen && <img src={n.imagen} alt={n.titulo} className="w-full h-full object-cover" />}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span style={{ color: ca }} className="font-extrabold text-xs uppercase">{n.categorias?.nombre || "Noticias"}</span>
                    <h3 style={{ color: cp }} className="mt-2 text-lg font-bold leading-snug">{n.titulo}</h3>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-3">{n.descripcion}</p>
                    <span className="block mt-auto pt-3 text-xs text-slate-400">{formatFecha(n.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="py-8">
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 style={{ color: cp }} className="text-2xl font-extrabold">Recibe las noticias directamente</h2>
              <p className="text-slate-500 text-sm mt-2">Suscribete y recibe lo mas importante en tu correo.</p>
            </div>
            <FormularioSuscripcionSitio sitioId={sitio.id} colorPrimario={cp} />
          </div>
        </section>
      </div>

      <SitioFooter sitio={sitio} redes={redes} />
    </main>
  );
}