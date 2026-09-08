import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './logout-button'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <>{children}</>
  }

  return (
    <div>
      <nav style={{ display: 'flex', gap: 16, padding: 16, borderBottom: '1px solid #ddd', alignItems: 'center' }}>
        <Link href="/admin">Noticias</Link>
        <Link href="/admin/categorias">Categorias</Link>
        <span style={{ marginLeft: 'auto' }}>{user.email}</span>
        <LogoutButton />
      </nav>
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  )
}
