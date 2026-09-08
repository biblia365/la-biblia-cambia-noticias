import { createClient } from '@/lib/supabase/server'
import VersiculoForm from './versiculo-form'

export default async function VersiculoPage() {
  const supabase = await createClient()
  const { data: versiculo } = await supabase
    .from('versiculo_dia')
    .select('texto, referencia')
    .eq('activo', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return (
    <div>
      <h1>Versiculo del dia</h1>
      <VersiculoForm actual={versiculo ?? undefined} />
    </div>
  )
}
