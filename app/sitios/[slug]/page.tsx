import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SitioHeader from "@/components/sitio-header";
import SitioFooter from "@/components/sitio-footer";
import AnuncioBanner from "@/components/anuncio-banner";
import FormularioSuscripcionSitio from "@/components/formulario-suscripcion-sitio";

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
      <SitioHeader sitio={sitio} redes={redes} />

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
          </div>
        </div>
      )}

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