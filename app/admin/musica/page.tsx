import { createClient } from '@/lib/supabase/server'
import CancionForm from './cancion-form'
import BorrarCancionBoton from './borrar-cancion-boton'

export default async function MusicaPage() {
  const supabase = await createClient()
  const { data: canciones } = await supabase
    .from('canciones')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1>Musica</h1>
      <CancionForm />
      <ul style={{ marginTop: 24 }}>
        {canciones?.map((c: { id: string; titulo: string; artista: string | null; url: string }) => (
          <li key={c.id} style={{ display: 'flex', gap: 12, padding: 8, borderBottom: '1px solid #eee', alignItems: 'center' }}>
            <span style={{ flex: 1 }}>{c.titulo}{c.artista ? ` - ${c.artista}` : ''}</span>
            <audio controls src={c.url} style={{ height: 32 }} />
            <BorrarCancionBoton id={c.id} />
          </li>
        ))}
      </ul>
    </div>
  )
}
