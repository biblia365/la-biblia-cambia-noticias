import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Politica de privacidad",
  description: "Politica de privacidad de La Biblia Cambia Noticias.",
};

export default async function PrivacidadPage() {
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
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#063B73] mb-6">Politica de privacidad</h1>
        <div className="space-y-4 text-slate-700 leading-relaxed">
          <p>
            En La Biblia Cambia Noticias respetamos tu privacidad. Esta pagina explica de forma sencilla
            como manejamos la informacion que nos compartes.
          </p>
          <h2 className="text-xl font-bold text-[#063B73] mt-6">Informacion que recopilamos</h2>
          <p>
            Cuando te suscribes a nuestro boletin recopilamos tu correo electronico. Cuando dejas un comentario
            en una noticia, guardamos el nombre y el texto que escribes.
          </p>
          <h2 className="text-xl font-bold text-[#063B73] mt-6">Uso de la informacion</h2>
          <p>
            Usamos tu correo unicamente para enviarte noticias y contenido relacionado con nuestro medio.
            No vendemos ni compartimos tu informacion con terceros para fines publicitarios ajenos a este sitio.
          </p>
          <h2 className="text-xl font-bold text-[#063B73] mt-6">Contacto</h2>
          <p>
            Si tienes preguntas sobre esta politica, escribenos a{" "}
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