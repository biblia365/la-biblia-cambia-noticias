import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BorrarNoticiaBoton from './borrar-noticia-boton'

export default async function AdminNoticiasPage() {
  const supabase = await createClient()
  const { data: noticias } = await supabase
    .from('noticias')
    .select('id, titulo, publicado, destacada, created_at, categorias(nombre)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Noticias</h1>
        <Link href="/admin/noticias/nueva" style={{ padding: '8px 16px', background: '#111', color: '#fff' }}>
          + Nueva noticia
        </Link>
      </div>

      <table style={{ width: '100%', marginTop: 24, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: 8 }}>Titulo</th>
            <th style={{ padding: 8 }}>Categoria</th>
            <th style={{ padding: 8 }}>Publicado</th>
            <th style={{ padding: 8 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {noticias?.map((n: any) => (
            <tr key={n.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8 }}>{n.titulo}</td>
              <td style={{ padding: 8 }}>{n.categorias?.nombre || '-'}</td>
              <td style={{ padding: 8 }}>{n.publicado ? 'Si' : 'No'}</td>
              <td style={{ padding: 8, display: 'flex', gap: 8 }}>
                <Link href={`/admin/noticias/${n.id}`}>Editar</Link>
                <BorrarNoticiaBoton id={n.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
