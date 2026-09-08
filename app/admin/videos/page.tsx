import { createClient } from '@/lib/supabase/server'
import VideoForm from './video-form'
import BorrarVideoBoton from './borrar-video-boton'

export default async function VideosPage() {
  const supabase = await createClient()
  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1>Videos</h1>
      <VideoForm />
      <ul style={{ marginTop: 24 }}>
        {videos?.map((v: { id: string; titulo: string; url: string }) => (
          <li key={v.id} style={{ display: 'flex', gap: 12, padding: 8, borderBottom: '1px solid #eee', alignItems: 'center' }}>
            <span style={{ flex: 1 }}>{v.titulo}</span>
            <a href={v.url} target="_blank" rel="noreferrer" style={{ color: '#063B73' }}>{v.url}</a>
            <BorrarVideoBoton id={v.id} />
          </li>
        ))}
      </ul>
    </div>
  )
}
