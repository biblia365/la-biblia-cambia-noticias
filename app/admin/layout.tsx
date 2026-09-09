import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './logout-button'

const NAV = [
  { href: '/admin/noticias', label: 'Noticias' },
  { href: '/admin/categorias', label: 'Categorias' },
  { href: '/admin/versiculo', label: 'Versiculo del dia' },
  { href: '/admin/videos', label: 'Videos' },
  { href: '/admin/musica', label: 'Musica' },
  { href: '/admin/anuncios', label: 'Anuncios' },
  { href: '/admin/aviso', label: 'Aviso Urgente' },
  { href: '/admin/redes', label: 'Redes Sociales' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <>{children}</>
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFAF8' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          background: '#1A1D29',
          color: '#E7E5DE',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 0',
        }}
      >
        <div style={{ padding: '0 24px 28px', borderBottom: '1px solid #2C3040' }}>
          <div style={{ fontFamily: 'Georgia, "Iowan Old Style", serif', fontSize: 19, lineHeight: 1.25 }}>
            La Biblia Cambia
          </div>
          <div style={{ fontSize: 12, color: '#8B8FA3', marginTop: 2, letterSpacing: '.02em' }}>
            Panel de administracion
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', marginTop: 12, gap: 2 }}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '10px 24px',
                color: '#D5D3C9',
                textDecoration: 'none',
                fontSize: 14.5,
                borderLeft: '3px solid transparent',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '16px 24px 0', borderTop: '1px solid #2C3040' }}>
          
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 12.5, color: '#8B8FA3', textDecoration: 'none' }}
          >
            Ver sitio publico
          </a>
        </div>
      </aside>

      {/* Contenido */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 16,
            padding: '14px 32px',
            borderBottom: '1px solid #E4E2DC',
            background: '#FFFFFF',
          }}
        >
          <span style={{ fontSize: 13.5, color: '#5A5D66' }}>{user.email}</span>
          <LogoutButton />
        </header>

        <main style={{ padding: '32px', maxWidth: 1100, width: '100%' }}>{children}</main>
      </div>
    </div>
  )
}
