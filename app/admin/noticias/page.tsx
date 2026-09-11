import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BorrarNoticiaBoton from '../borrar-noticia-boton'

export default async function AdminNoticiasPage() {
  const supabase = await createClient()
  const { data: noticias } = await supabase
    .from('noticias')
    .select('id, titulo, publicado, destacada, created_at, categorias(nombre), sitios(nombre)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, "Iowan Old Style", serif', fontSize: 26, color: '#1A1D29', margin: 0 }}>
            Noticias
          </h1>
        </div>
        <Link
          href="/admin/noticias/nueva"
          style={{
            padding: '9px 18px',
            background: '#1A1D29',
            color: '#fff',
            borderRadius: 4,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          + Nueva noticia
        </Link>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E4E2DC', borderRadius: 6, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: '#FAFAF8', borderBottom: '1px solid #E4E2DC' }}>
              <th style={{ padding: '10px 16px', fontSize: 12.5, color: '#6B6F76', fontWeight: 500 }}>TÃ­tulo</th>
              <th style={{ padding: '10px 16px', fontSize: 12.5, color: '#6B6F76', fontWeight: 500 }}>CategorÃ­a</th>
              <th style={{ padding: '10px 16px', fontSize: 12.5, color: '#6B6F76', fontWeight: 500 }}>Publicado</th>
              <th style={{ padding: '10px 16px', fontSize: 12.5, color: '#6B6F76', fontWeight: 500 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {noticias?.map((n: any) => (
              <tr key={n.id} style={{ borderBottom: '1px solid #EFEDE7' }}>
                <td style={{ padding: '12px 16px', fontSize: 14 }}>{n.titulo}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#6B6F76' }}>
                  {n.sitios?.nombre || '-'}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 14, color: '#6B6F76' }}>
                  {n.categorias?.nombre || '-'}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 14 }}>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: 999,
                      fontSize: 12,
                      background: n.publicado ? '#E7F3EC' : '#F1EFE9',
                      color: n.publicado ? '#2F6B4F' : '#8B8776',
                    }}
                  >
                    {n.publicado ? 'SÃ­' : 'No'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', display: 'flex', gap: 14 }}>
                  <Link href={`/admin/noticias/${n.id}`} style={{ fontSize: 13.5, color: '#1A1D29' }}>
                    Editar
                  </Link>
                  <BorrarNoticiaBoton id={n.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
