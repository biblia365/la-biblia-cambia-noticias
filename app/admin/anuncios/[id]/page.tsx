import { createClient } from '@/lib/supabase/server'
import AnuncioForm from '../anuncio-form'
import { notFound } from 'next/navigation'

export default async function EditarAnuncioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: anuncio } = await supabase.from('anuncios').select('*').eq('id', id).single()

  if (!anuncio) notFound()

  return (
    <div>
      <h1>Editar anuncio</h1>
      <AnuncioForm anuncio={anuncio} />
    </div>
  )
}