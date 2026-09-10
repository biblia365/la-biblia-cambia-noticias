import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Contacto",
  description: "Ponte en contacto con La Biblia Cambia Noticias.",
};

export default async function ContactoPage() {
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
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#063B73] mb-6">Contacto</h1>
        <p className="text-slate-700 text-lg mb-8">
          Escribenos, nos encantaria saber de ti.
        </p>
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex items-start gap-4">
            <span className="text-[#C9972B] font-bold text-sm w-24 flex-shrink-0">Correo</span>
            <a href="mailto:labiblicambia@gmail.com" className="text-[#063B73] font-semibold hover:text-[#C9972B] transition">
              labiblicambia@gmail.com
            </a>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-[#C9972B] font-bold text-sm w-24 flex-shrink-0">Celular</span>
            <a href="tel:+573155654948" className="text-[#063B73] font-semibold hover:text-[#C9972B] transition">
              315 565 4948
            </a>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-[#C9972B] font-bold text-sm w-24 flex-shrink-0">Direccion</span>
            <span className="text-slate-700">
              Carrera 9 # 30, La Victoria Centro, Pereira, Risaralda
            </span>
          </div>
        </div>
      </div>
      <SiteFooter redes={redes} />
    </main>
  );
}