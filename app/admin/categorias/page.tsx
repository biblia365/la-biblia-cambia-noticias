import { createClient } from '@/lib/supabase/server'
import CategoriaForm from './categoria-form'
import BorrarCategoriaBoton from './borrar-categoria-boton'

export default async function CategoriasPage() {
  const supabase = await createClient()
  const { data: categorias } = await supabase.from('categorias').select('*').order('nombre')

  return (
    <div>
      <h1>Categorias</h1>
      <CategoriaForm />
      <ul style={{ marginTop: 24 }}>
        {categorias?.map((c: { id: string; nombre: string }) => (
          <li key={c.id} style={{ display: 'flex', gap: 12, padding: 8, borderBottom: '1px solid #eee', alignItems: 'center' }}>
            <span>{c.nombre}</span>
            <BorrarCategoriaBoton id={c.id} />
          </li>
        ))}
      </ul>
    </div>
  )
}
