type Anuncio = {
  id: string
  titulo: string
  descripcion: string | null
  imagen: string
  link: string
  texto_boton: string
}

export default function AnuncioBanner({ anuncio }: { anuncio: Anuncio }) {
  return (
    <div className="relative bg-white border border-slate-200 rounded-xl overflow-hidden max-w-4xl mx-auto">
      <span className="absolute top-3 left-3 z-10 bg-black/60 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded">
        Publicidad
      </span>
      
      <a
        href={anuncio.link}
        target="_blank"
        rel="noreferrer sponsored"
        className="flex flex-col sm:flex-row items-stretch hover:opacity-95 transition"
      >
        <div className="sm:w-64 h-40 sm:h-auto flex-shrink-0">
          <img
            src={anuncio.imagen}
            alt={anuncio.titulo}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-5 flex flex-col justify-center flex-1">
          <h3 className="font-extrabold text-[#063B73] text-lg leading-snug">
            {anuncio.titulo}
          </h3>
          {anuncio.descripcion && (
            <p className="text-sm text-slate-500 mt-1">{anuncio.descripcion}</p>
          )}
          <span className="inline-block mt-3 w-max bg-[#C9972B] hover:bg-[#b78620] text-[#04223f] font-extrabold text-xs px-5 py-2.5 rounded transition">
            {anuncio.texto_boton}
          </span>
        </div>
      </a>
    </div>
  )
}
