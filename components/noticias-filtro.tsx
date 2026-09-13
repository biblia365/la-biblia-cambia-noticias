'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

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
  const [categoriaActiva, setCategoriaActiva] = useState<string>('Todas')

  const categorias = useMemo(() => {
    const nombres = new Set<string>()
    noticias.forEach((n) => {
      if (n.categorias?.nombre) nombres.add(n.categorias.nombre)
    })
    return ['Todas', ...Array.from(nombres)]
  }, [noticias])

  const noticiasFiltradas = useMemo(() => {
    if (categoriaActiva === 'Todas') return noticias
    return noticias.filter((n) => n.categorias?.nombre === categoriaActiva)
  }, [noticias, categoriaActiva])

  function formatFecha(iso: string) {
    return new Date(iso)
      .toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
      .toUpperCase()
  }

  return (
    <div>
      {categorias.length > 1 && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              style={{
                background: categoriaActiva === cat ? colorPrimario : '#fff',
                color: categoriaActiva === cat ? '#fff' : colorPrimario,
                borderColor: colorPrimario,
              }}
              className="text-xs font-extrabold uppercase px-4 py-2 rounded-full border transition"
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {noticiasFiltradas.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
          No hay noticias en esta categoria todavia.
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {noticiasFiltradas.map((n) => (
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
      )}
    </div>
  )
}
