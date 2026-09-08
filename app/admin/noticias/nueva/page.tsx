import { createClient } from '@/lib/supabase/server'
import NoticiaForm from '../noticia-form'

export default async function NuevaNoticiaPage() {
  const supabase = await createClient()
  const { data: categorias } = await supabase.from('categorias').select('id, nombre').order('nombre')

  return (
    <div>
      <h1>Nueva noticia</h1>
      <NoticiaForm categorias={categorias || []} />
    </div>
  )
}
