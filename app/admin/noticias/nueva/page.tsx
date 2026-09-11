import { createClient } from '@/lib/supabase/server'
import NoticiaForm from '../noticia-form'

export default async function NuevaNoticiaPage() {
  const supabase = await createClient()
  const [{ data: categorias }, { data: sitios }] = await Promise.all([
    supabase.from('categorias').select('id, nombre').order('nombre'),
    supabase.from('sitios').select('id, nombre').eq('activo', true).order('nombre'),
  ])

  return (
    <div>
      <h1>Nueva noticia</h1>
      <NoticiaForm categorias={categorias || []} sitios={sitios || []} />
    </div>
  )
}