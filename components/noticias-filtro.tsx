import Link from "next/link"

type Noticia = {
  id: string
  slug: string
  titulo: string
  descripcion: string
  imagen: string | null
  created_at: string
  categorias?: { nombre: string } | null
}

export default function NoticiasFiltro({
  noticias,
  slug,
  colorPrimario,
  colorAcento,
}: {
  noticias: Noticia[]
  slug: string
  colorPrimario: string
  colorAcento: string
}) {
  function formatFecha(iso: string) {
    return new Date(iso)
      .toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
      .toUpperCase()
  }

  const grupos: { nombre: string; items: Noticia[] }[] = []
  noticias.forEach((n) => {
    const nombreCategoria = n.categorias?.nombre || 'Noticias'
    let grupo = grupos.find((g) => g.nombre === nombreCategoria)
    if (!grupo) {
      grupo = { nombre: nombreCategoria, items: [] }
      grupos.push(grupo)
    }
    grupo.items.push(n)
  })

  if (noticias.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
        No hay noticias todavia.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      {grupos.map((grupo) => (
        <div key={grupo.nombre}>
          <div style={{ borderColor: colorPrimario }} className="flex items-center justify-between border-b-2 pb-3 mb-6">
            <h3 style={{ color: colorPrimario }} className="text-xl font-extrabold uppercase">
              {grupo.nombre}
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {grupo.items.map((n) => (
              <Link
                key={n.id}
                href={`/sitios/${slug}/noticias/${n.slug}`}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:-translate-y-1 hover:shadow-lg transition flex flex-col h-full"
              >
                <div className="h-48 flex-shrink-0">
                  {n.imagen && <img src={n.imagen} alt={n.titulo} className="w-full h-full object-cover" />}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span style={{ color: colorAcento }} className="font-extrabold text-xs uppercase">
                    {n.categorias?.nombre || 'Noticias'}
                  </span>
                  <h3 style={{ color: colorPrimario }} className="mt-2 text-lg font-bold leading-snug">
                    {n.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-3">{n.descripcion}</p>
                  <span className="block mt-auto pt-3 text-xs text-slate-400">{formatFecha(n.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
