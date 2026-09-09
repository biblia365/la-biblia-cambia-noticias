import Link from "next/link";
import Image from "next/image";
import SiteFooter from "@/components/site-footer";
import BibliaSelector from "@/components/biblia-selector";
import { LIBROS } from "@/lib/libros";
import { createClient } from "@/lib/supabase/server";
import SiteHeader from "@/components/site-header";

function limpiarTexto(texto: string) {
  return texto.replace(/<[^>]+>/g, "");
}

export default async function BibliaPage({
  searchParams,
}: {
  searchParams: Promise<{ libro?: string; capitulo?: string }>;
}) {
  const params = await searchParams;
  const libroNum = Number(params.libro) || 43;
  const capitulo = Number(params.capitulo) || 3;
  const libroActual = LIBROS.find((l) => l.num === libroNum) ?? LIBROS[42];

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

  let versiculos: { id: number; number: number; text: string }[] = [];
  let error = "";

  const { data: book } = await supabase
    .from("books")
    .select("id")
    .eq("book_order", libroNum)
    .single();

  if (book) {
    const { data: chapter } = await supabase
      .from("chapters")
      .select("id")
      .eq("book_id", book.id)
      .eq("number", capitulo)
      .single();

    if (chapter) {
      const { data: verses } = await supabase
        .from("verses")
        .select("id, number, text")
        .eq("chapter_id", chapter.id)
        .order("number");
      versiculos = verses ?? [];
    }
  }

  if (versiculos.length === 0) {
    error = "No se pudo cargar este capitulo. Intenta de nuevo.";
  }

  const hayAnterior = capitulo > 1;
  const haySiguiente = capitulo < libroActual.capitulos;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader redes={redes} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <span className="inline-block bg-[#C9972B] text-[#04223f] text-xs font-extrabold px-3 py-1 rounded uppercase mb-3">
            Reina Valera 1960
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#063B73]">
            Santa Biblia
          </h1>
        </div>

        <BibliaSelector libroNum={libroNum} capitulo={capitulo} />

        <article className="bg-white border border-slate-200 rounded-xl p-6 md:p-10">
          <h2 className="text-2xl font-extrabold text-[#063B73] mb-6 font-serif">
            {libroActual.nombre} {capitulo}
          </h2>

          {error && <p className="text-red-500">{error}</p>}

          {!error && (
            <div className="space-y-3 font-serif text-lg leading-relaxed text-slate-800">
              {versiculos.map((v) => (
                <p key={v.id}>
                  <sup className="text-[#C9972B] font-bold mr-1">{v.number}</sup>
                  {limpiarTexto(v.text)}
                </p>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-10 pt-6 border-t border-slate-200">
            {hayAnterior ? (
              <Link
                href={`/biblia?libro=${libroNum}&capitulo=${capitulo - 1}`}
                className="px-5 py-2 rounded-lg bg-slate-100 font-bold text-[#063B73]"
              >
                Anterior
              </Link>
            ) : (
              <span className="px-5 py-2 rounded-lg bg-slate-100 font-bold text-[#063B73] opacity-30">
                Anterior
              </span>
            )}
            {haySiguiente ? (
              <Link
                href={`/biblia?libro=${libroNum}&capitulo=${capitulo + 1}`}
                className="px-5 py-2 rounded-lg bg-[#063B73] font-bold text-white"
              >
                Siguiente
              </Link>
            ) : (
              <span className="px-5 py-2 rounded-lg bg-[#063B73] font-bold text-white opacity-30">
                Siguiente
              </span>
            )}
          </div>
        </article>

        <p className="text-center text-xs text-slate-400 mt-6">
          Texto: Reina Valera 1960 - Sociedades Biblicas Unidas.
        </p>
      </div>

      <SiteFooter />
    </main>
  );
}
