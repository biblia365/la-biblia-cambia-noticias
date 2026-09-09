import Image from "next/image";

type Redes = {
  facebook?: string;
  youtube?: string;
  instagram?: string;
  tiktok?: string;
};

export default function SiteFooter({ redes }: { redes?: Redes }) {
  const r = {
    facebook: redes?.facebook || "#",
    youtube: redes?.youtube || "#",
    instagram: redes?.instagram || "#",
    tiktok: redes?.tiktok || "#",
  };

  return (
    <footer className="bg-[#04223f] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <Image
              src="/LOGO-ISRAEL.png"
              alt="La Biblia Cambia Noticias"
              width={260}
              height={90}
              className="h-16 w-auto object-contain"
            />
            <p className="text-sm mt-3 max-w-xs leading-relaxed">
              Un medio de comunicacion dedicado a informar con responsabilidad sobre la actualidad cristiana, la comunidad y las historias de esperanza.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-4">SECCIONES</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/#nacionales" className="hover:text-[#C9972B] transition">Nacionales</a></li>
              <li><a href="/#internacionales" className="hover:text-[#C9972B] transition">Internacionales</a></li>
              <li><a href="/#fe" className="hover:text-[#C9972B] transition">Fe y Comunidad</a></li>
              <li><a href="/#videos" className="hover:text-[#C9972B] transition">Videos</a></li>
              <li><a href="/biblia" className="hover:text-[#C9972B] transition">Biblia</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-4">INFORMACION</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#C9972B] transition">Quienes somos</a></li>
              <li><a href="#" className="hover:text-[#C9972B] transition">Contacto</a></li>
              <li><a href="#" className="hover:text-[#C9972B] transition">Politica de privacidad</a></li>
              <li><a href="#" className="hover:text-[#C9972B] transition">Terminos de uso</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm mb-4">SIGUENOS</h3>
            <ul className="space-y-2 text-sm">
              <li><a href={r.facebook} target="_blank" rel="noreferrer" className="hover:text-[#C9972B] transition">Facebook</a></li>
              <li><a href={r.youtube} target="_blank" rel="noreferrer" className="hover:text-[#C9972B] transition">YouTube</a></li>
              <li><a href={r.instagram} target="_blank" rel="noreferrer" className="hover:text-[#C9972B] transition">Instagram</a></li>
              <li><a href={r.tiktok} target="_blank" rel="noreferrer" className="hover:text-[#C9972B] transition">TikTok</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-slate-500">
          (c) 2026 La Biblia Cambia Noticias. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
