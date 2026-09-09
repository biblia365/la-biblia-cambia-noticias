import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

function formatFecha(iso: string) {
  return new Date(iso)
    .toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase()
    .replace(/\./g, "");
}

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const supabase = await createClient();

  const { data: resultadosRaw } = query
    ? await supabase
        .from("noticias")
        .select("id, slug, titulo, descripcion, imagen, created_at, categorias(nombre)")
        .eq("publicado", true)
        .or(`titulo.ilike.%${query}%,descripcion.ilike.%${query}%,contenido.ilike.%${query}%`)
        .order("created_at", { ascending: false })
        .limit(30)
    : { data: [] };

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

  const resultados = resultadosRaw ?? [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader redes={redes} />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-extrabold text-[#063B73] mb-2">
          Resultados de busqueda
        </h1>
        <p className="text-slate-500 mb-8">
          {query ? (
            <>
              {resultados.length} resultado{resultados.length !== 1 ? "s" : ""} para{" "}
              <span className="font-bold text-[#063B73]">&quot;{query}&quot;</span>
            </>
          ) : (
            "Escribe algo en el buscador para empezar."
          )}
        </p>

        {query && resultados.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-400">
            No se encontraron noticias que coincidan con tu busqueda.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {resultados.map((n: any) => (
            <Link
              key={n.id}
              href={`/noticias/${n.slug}`}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-lg transition block"
            >
              {n.imagen && (
                <div className="h-40">
                  <img src={n.imagen} alt={n.titulo} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5">
                <span className="text-[#C9972B] font-extrabold text-xs">
                  {(n.categorias?.nombre || "NOTICIAS").toUpperCase()}
                </span>
                <h3 className="mt-2 text-lg font-bold text-[#063B73] leading-snug">
                  {n.titulo}
                </h3>
                {n.descripcion && (
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{n.descripcion}</p>
                )}
                <span className="block mt-3 text-xs text-slate-400">
                  {formatFecha(n.created_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <SiteFooter redes={redes} />
    </main>
  );
}
