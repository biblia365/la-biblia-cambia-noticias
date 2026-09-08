import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

// AJUSTA AQUÍ los nombres de tabla si en tu script de la Parte 1
// usaste nombres distintos a estos.
const CARDS = [
  { table: 'noticias', label: 'Noticias', href: '/admin/noticias' },
  { table: 'categorias', label: 'Categorías', href: '/admin/categorias' },
  { table: 'versiculo_dia', label: 'Versículos', href: '/admin/versiculo' },
  { table: 'videos', label: 'Videos', href: '/admin/videos' },
  { table: 'redes_sociales', label: 'Redes Sociales', href: '/admin/redes' },
]

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const counts = await Promise.all(
    CARDS.map(async (card) => {
      const { count, error } = await supabase
        .from(card.table)
        .select('*', { count: 'exact', head: true })
      return { ...card, count: error ? null : count ?? 0 }
    })
  )

  return (
    <div>
      <h1 style={{ fontFamily: 'Georgia, "Iowan Old Style", serif', fontSize: 26, color: '#1A1D29', marginBottom: 4 }}>
        Panel general
      </h1>
      <p style={{ fontSize: 14, color: '#6B6F76', marginBottom: 28 }}>
        Resumen del contenido del sitio.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
        }}
      >
        {counts.map((c) => (
          <Link
            key={c.table}
            href={c.href}
            style={{
              display: 'block',
              padding: '20px 20px',
              background: '#FFFFFF',
              border: '1px solid #E4E2DC',
              borderRadius: 6,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div style={{ fontSize: 13, color: '#6B6F76', marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 32, fontFamily: 'Georgia, serif', color: '#1A1D29' }}>
              {c.count === null ? '—' : c.count}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
