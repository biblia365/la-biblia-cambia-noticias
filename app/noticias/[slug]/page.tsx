import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SiteFooter from "@/components/site-footer";

function formatFechaHora(iso: string) {
  const d = new Date(iso);
  const fecha = d
    .toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })
    .toUpperCase();
  const hora = d
    .toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: true })
    .toUpperCase();
  return `${fecha} - ${hora}`;
}

export default async function NoticiaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: redesRaw } = await supabase
    .from("redes_sociales")
    .select("plataforma, url")
    .eq("activo", true);

  const redesMap = new Map<string, string>();
  (redesRaw ?? []).forEach((r: any) => redesMap.set(r.plataforma.toLowerCase(), r.url));
  const redes = {
    facebook: redesMap.get("facebook") || "#",
    youtube: redesMap.get("youtube") || "#",
    instagram: redesMap.get("instagram") || "#",
    tiktok: redesMap.get("tiktok") || "#",
  };

  const { data: noticia } = await supabase
    .from("noticias")
    .select("id, titulo, descripcion, contenido, imagen, created_at, categorias(nombre)")
    .eq("slug", slug)
    .eq("publicado", true)
    .single();

  if (!noticia) {
    notFound();
  }

  const categoria = ((noticia as any).categorias?.nombre || "NOTICIAS").toUpperCase();
  const parrafos = (noticia.contenido || noticia.descripcion || "")
    .split("\n")
    .map((p: string) => p.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="La Biblia Cambia Noticias"
              width={56}
              height={56}
              className="w-12 h-12 md:w-14 md:h-14 object-contain"
              priority
            />
            <div className="leading-tight">
              <span className="block text-lg md:text-xl font-extrabold text-[#063B73] tracking-tight">
                LA BIBLIA CAMBIA
              </span>
              <span className="block text-[10px] md:text-xs tracking-[0.2em] text-[#C9972B] font-bold mt-1">
                ACTUALIDAD - FE - VERDAD
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="text-sm font-bold text-[#063B73] hover:text-[#C9972B] transition"
          >
            ← VOLVER AL INICIO
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-10">
        <span className="inline-block bg-[#C9972B] text-[#04223f] text-xs font-extrabold px-3 py-1 rounded uppercase">
          {categoria}
        </span>

        <h1 className="text-3xl md:text-4xl font-extrabold text-[#063B73] mt-4 leading-tight">
          {noticia.titulo}
        </h1>

        <span className="block mt-3 text-xs text-slate-400">
          {formatFechaHora(noticia.created_at)}
        </span>

        {noticia.imagen && (
          <div className="mt-6 rounded-xl overflow-hidden">
            <img
              src={noticia.imagen}
              alt={noticia.titulo}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <div className="mt-8 space-y-4 text-slate-700 text-base leading-relaxed">
          {parrafos.length ? (
            parrafos.map((p: string, i: number) => <p key={i}>{p}</p>)
          ) : (
            <p className="text-slate-400 italic">Esta noticia aun no tiene contenido.</p>
          )}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200">
          <Link
            href="/"
            className="text-sm font-bold text-[#063B73] hover:text-[#C9972B] transition"
          >
            ← Volver a todas las noticias
          </Link>
        </div>
      </article>

      <SiteFooter redes={redes} />
    </main>
  );
}
