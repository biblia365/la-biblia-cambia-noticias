import { createClient } from '@/lib/supabase/server'
import NoticiaForm from '../noticia-form'
import { notFound } from 'next/navigation'

export default async function EditarNoticiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: noticia }, { data: categorias }] = await Promise.all([
    supabase.from('noticias').select('*').eq('id', id).single(),
    supabase.from('categorias').select('id, nombre').order('nombre'),
  ])

  if (!noticia) notFound()

  return (
    <div>
      <h1>Editar noticia</h1>
      <NoticiaForm categorias={categorias || []} noticia={noticia} />
    </div>
  )
}
