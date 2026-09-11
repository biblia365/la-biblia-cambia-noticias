import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SitioHeader from "@/components/sitio-header";
import SitioFooter from "@/components/sitio-footer";
import ComentariosSeccion from "@/components/comentarios-seccion";
import AnuncioBanner from "@/components/anuncio-banner";
import { obtenerVistaPreviaFuente } from "@/lib/og-preview";

function formatFechaHora(iso: string) {
  const d = new Date(iso);
  const fecha = d.toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase();
  const hora = d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();
  return `${fecha} - ${hora}`;
}

export default async function NoticiaSitioPage({
  params,
}: {
  params: Promise<{ slug: string; newsSlug: string }>;
}) {
  const { slug, newsSlug } = await params;
  const supabase = await createClient();

  const { data: sitio } = await supabase
    .from("sitios")
    .select("*")
    .eq("slug", slug)
    .eq("activo", true)
    .single();

  if (!sitio) notFound();

  const { data: redesRaw } = await supabase
    .from("redes_sociales")
    .select("plataforma, url")
    .eq("sitio_id", sitio.id)
    .eq("activo", true);
  const redesMap = new Map<string, string>();
  (redesRaw ?? []).forEach((r: any) => redesMap.set(r.plataforma.toLowerCase(), r.url));
  const redes = {
    facebook: redesMap.get("facebook"),
    youtube: redesMap.get("youtube"),
    instagram: redesMap.get("instagram"),
    tiktok: redesMap.get("tiktok"),
  };

  const { data: noticia } = await supabase
    .from("noticias")
    .select("id, titulo, descripcion, contenido, imagen, created_at, categoria_id, fuente_url, categorias(nombre)")
    .eq("slug", newsSlug)
    .eq("sitio_id", sitio.id)
    .eq("publicado", true)
    .single();

  if (!noticia) notFound();

  const [{ data: relacionadasRaw }, { data: comentariosIniciales }, { data: anuncioRaw }] = await Promise.all([
    supabase
      .from("noticias")
      .select("id, titulo, slug, imagen, created_at, categorias(nombre)")
      .eq("sitio_id", sitio.id)
      .eq("categoria_id", (noticia as any).categoria_id)
      .eq("publicado", true)
      .neq("id", noticia.id)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("comentarios")
      .select("id, nombre, texto, created_at")
      .eq("noticia_id", noticia.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("anuncios")
      .select("id, titulo, descripcion, imagen, link, texto_boton")
      .eq("sitio_id", sitio.id)
      .eq("activo", true)
      .in("ubicacion", ["noticia", "ambos"])
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  const categoria = ((noticia as any).categorias?.nombre || "NOTICIAS").toUpperCase();
  const fuentePreview = noticia.fuente_url ? await obtenerVistaPreviaFuente(noticia.fuente_url) : null;
  const anuncioNoticia = anuncioRaw?.[0] || null;
  const parrafos = (noticia.contenido || noticia.descripcion || "").split("\n").map((p: string) => p.trim()).filter(Boolean);
  const cp = sitio.color_primario;
  const ca = sitio.color_acento;
  const urlBase = `https://la-biblia-cambia-noticias.vercel.app/sitios/${slug}/noticias/${newsSlug}`;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SitioHeader sitio={sitio} redes={redes} />

      <article className="max-w-3xl mx-auto px-4 py-10">
        <span style={{ background: ca, color: "#111" }} className="inline-block text-xs font-extrabold px-3 py-1 rounded uppercase">
          {categoria}
        </span>

        <h1 style={{ color: cp }} className="text-3xl md:text-4xl font-extrabold mt-4 leading-tight">
          {noticia.titulo}
        </h1>

        <span className="block mt-3 text-xs text-slate-400">{formatFechaHora(noticia.created_at)}</span>

        <div className="flex items-center gap-3 mt-4">
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${urlBase}`} target="_blank" rel="noreferrer" aria-label="Compartir en Facebook" className="w-9 h-9 rounded-full bg-[#1877F2] hover:opacity-90 flex items-center justify-center transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6v1.9h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>
          </a>
          <a href={`https://twitter.com/intent/tweet?url=${urlBase}&text=${encodeURIComponent(noticia.titulo)}`} target="_blank" rel="noreferrer" aria-label="Compartir en X" className="w-9 h-9 rounded-full bg-black hover:opacity-90 flex items-center justify-center transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.9L4.4 22H1.3l8.1-9.3L1 2h7l4.9 6.3L18.9 2Zm-1.2 18h1.9L7.4 4H5.4l12.3 16Z"/></svg>
          </a>
          <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(noticia.titulo + " - " + urlBase)}`} target="_blank" rel="noreferrer" aria-label="Compartir en WhatsApp" className="w-9 h-9 rounded-full bg-[#25D366] hover:opacity-90 flex items-center justify-center transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20Zm4.4-5.9c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-2-1.2-.7-.7-1.2-1.5-1.4-1.7-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.2.2-.4.1-.2 0-.3 0-.4 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.7 4.4 3.8.6.3 1.1.4 1.4.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.5-.3Z"/></svg>
          </a>
          <a href={`mailto:?subject=${encodeURIComponent(noticia.titulo)}&body=${encodeURIComponent(urlBase)}`} aria-label="Compartir por correo" className="w-9 h-9 rounded-full bg-slate-800 hover:opacity-90 flex items-center justify-center transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2 4h20v16H2V4Zm2 2v.5l8 5.5 8-5.5V6H4Zm16 2.4-7.4 5.1a1 1 0 0 1-1.2 0L4 8.4V18h16V8.4Z"/></svg>
          </a>
          <a href={`https://t.me/share/url?url=${urlBase}&text=${encodeURIComponent(noticia.titulo)}`} target="_blank" rel="noreferrer" aria-label="Compartir en Telegram" className="w-9 h-9 rounded-full bg-[#26A5E4] hover:opacity-90 flex items-center justify-center transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M22 3 2.5 10.6c-1 .4-1 1.6 0 2l4.9 1.6 1.9 6c.2.7 1.1.9 1.6.3l2.6-3 5.1 3.8c.7.5 1.7.1 1.9-.7l3.3-15.4c.2-1-.8-1.8-1.8-1.2ZM8.4 13.6l9.5-6-7.8 7.4-.3 3-1.4-4.4Z"/></svg>
          </a>
        </div>

        {noticia.imagen && (
          <div className="mt-6 rounded-xl overflow-hidden">
            <img src={noticia.imagen} alt={noticia.titulo} className="w-full h-auto object-cover" />
          </div>
        )}

        <div className="mt-8 space-y-4 text-slate-700 text-lg leading-relaxed text-justify">
          {parrafos.length ? (
            parrafos.map((p: string, i: number) => <p key={i}>{p}</p>)
          ) : (
            <p className="text-slate-400 italic">Esta noticia aun no tiene contenido.</p>
          )}
        </div>

        {noticia.fuente_url && (
          <div className="mt-6">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Fuente</span>
            <a
              href={noticia.fuente_url}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col sm:flex-row bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition max-w-xl"
            >
              {fuentePreview?.image && (
                <img src={fuentePreview.image} alt={fuentePreview.title || "Fuente"} className="w-full sm:w-48 h-40 sm:h-auto object-cover flex-shrink-0" />
              )}
              <div className="p-4">
                {fuentePreview?.siteName && (
                  <span style={{ color: ca }} className="text-[10px] font-bold uppercase tracking-wide">{fuentePreview.siteName}</span>
                )}
                <p style={{ color: cp }} className="font-bold text-sm mt-1 leading-snug">{fuentePreview?.title || noticia.fuente_url}</p>
                {fuentePreview?.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{fuentePreview.description}</p>}
                <span style={{ color: cp }} className="inline-block mt-2 text-xs font-bold underline">Ver publicacion original</span>
              </div>
            </a>
          </div>
        )}

        {relacionadasRaw && relacionadasRaw.length > 0 && (
          <section className="mt-12 pt-8 border-t border-slate-200">
            <h2 style={{ color: cp }} className="text-xl font-extrabold mb-5">Articulos relacionados</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {relacionadasRaw.map((r: any) => (
                <Link
                  key={r.id}
                  href={`/sitios/${slug}/noticias/${r.slug}`}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-lg transition flex gap-3"
                >
                  {r.imagen && <img src={r.imagen} alt={r.titulo} className="w-28 h-24 object-cover flex-shrink-0" />}
                  <div className="py-3 pr-3">
                    <span style={{ color: ca }} className="font-extrabold text-[10px] uppercase">{r.categorias?.nombre || categoria}</span>
                    <h3 style={{ color: cp }} className="mt-1 text-sm font-bold leading-snug">{r.titulo}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {anuncioNoticia && (
          <div className="mt-10">
            <AnuncioBanner anuncio={anuncioNoticia} />
          </div>
        )}

        <ComentariosSeccion noticiaId={noticia.id} comentariosIniciales={comentariosIniciales || []} />

        <div className="mt-10 pt-6 border-t border-slate-200">
          <Link href={`/sitios/${slug}`} style={{ color: cp }} className="text-sm font-bold hover:underline">
            Volver a todas las noticias
          </Link>
        </div>
      </article>

      <SitioFooter sitio={sitio} redes={redes} />
    </main>
  );
}