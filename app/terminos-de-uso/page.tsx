import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Terminos de uso",
  description: "Terminos y condiciones de uso de La Biblia Cambia Noticias.",
};

export default async function TerminosPage() {
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
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#063B73] mb-6">Terminos de uso</h1>
        <div className="space-y-4 text-slate-700 leading-relaxed">
          <p>
            Al acceder y utilizar este sitio web, aceptas los siguientes terminos de uso.
          </p>
          <h2 className="text-xl font-bold text-[#063B73] mt-6">Uso del contenido</h2>
          <p>
            El contenido publicado en La Biblia Cambia Noticias es para fines informativos. Queda prohibida
            su reproduccion total o parcial sin autorizacion, salvo para uso personal o comparticion a traves
            de los botones habilitados en el sitio.
          </p>
          <h2 className="text-xl font-bold text-[#063B73] mt-6">Comentarios</h2>
          <p>
            Los comentarios publicados por los usuarios reflejan la opinion de quien los escribe. Nos reservamos
            el derecho de eliminar comentarios que contengan lenguaje ofensivo, spam o contenido inapropiado.
          </p>
          <h2 className="text-xl font-bold text-[#063B73] mt-6">Cambios</h2>
          <p>
            Estos terminos pueden actualizarse periodicamente. El uso continuado del sitio implica la aceptacion
            de los terminos vigentes al momento de tu visita.
          </p>
          <h2 className="text-xl font-bold text-[#063B73] mt-6">Contacto</h2>
          <p>
            Para consultas sobre estos terminos, escribenos a{" "}
            <a href="mailto:labiblicambia@gmail.com" className="text-[#063B73] font-semibold underline">
              labiblicambia@gmail.com
            </a>.
          </p>
        </div>
      </div>
      <SiteFooter redes={redes} />
    </main>
  );
}