import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Quienes somos",
  description: "Conoce mas sobre La Biblia Cambia Noticias, un medio dedicado a la actualidad cristiana.",
};

export default async function QuienesSomosPage() {
  const supabase = await createClient();
  const { data: redesRaw } = await supabase.from("redes_sociales").select("plataforma, url").eq("activo", true);
  const redesMap = new Map<string, string>();
  (redesRaw ?? []).forEach((r: any) => redesMap.set(r.plataforma.toLowerCase(), r.url));
  const redes = {
    facebook: redesMap.get("facebook") || "#",
    youtube: redesMap.get("youtube") || "#",
    instagram: redesMap.get("instagram") || "#",
    tiktok: redesMap.get("tiktok") || "#",
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader redes={redes} />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#063B73] mb-6">Quienes somos</h1>
        <div className="space-y-4 text-slate-700 text-lg leading-relaxed">
          <p>
            La Biblia Cambia Noticias es un medio de comunicacion digital dedicado a informar con responsabilidad
            sobre la actualidad nacional e internacional desde una perspectiva de fe, esperanza y valores cristianos.
          </p>
          <p>
            Nuestro proposito es acercar a la comunidad cristiana las noticias mas relevantes del dia, ademas de
            contenido espiritual como el versiculo diario, musica, videos y acceso directo a la Santa Biblia,
            todo en un mismo lugar.
          </p>
          <p>
            Creemos en el poder transformador de la Palabra de Dios y en la importancia de mantenernos informados
            para servir mejor a nuestras comunidades.
          </p>
        </div>
      </div>
      <SiteFooter redes={redes} />
    </main>
  );
}