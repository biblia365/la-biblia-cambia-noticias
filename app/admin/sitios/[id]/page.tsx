import { createClient } from '@/lib/supabase/server'
import SitioForm from '../sitio-form'
import { notFound } from 'next/navigation'

export default async function EditarSitioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: sitio } = await supabase.from('sitios').select('*').eq('id', id).single()
  if (!sitio) notFound()

  return (
    <div>
      <h1>Editar sitio</h1>
      <SitioForm sitio={sitio} />
    </div>
  )
}