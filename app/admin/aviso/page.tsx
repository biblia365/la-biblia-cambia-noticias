import { createClient } from '@/lib/supabase/server'
import AvisoForm from './aviso-form'

export default async function AvisoPage() {
  const supabase = await createClient()
  const { data: aviso } = await supabase
    .from('aviso_urgente')
    .select('texto, activo')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  return (
    <div>
      <h1>Aviso "Ultima Hora"</h1>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Controla el texto y la visibilidad de la barra roja que aparece en la pagina principal.
      </p>
      <AvisoForm actual={aviso ?? undefined} />
    </div>
  )
}
