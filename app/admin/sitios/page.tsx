import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminSitiosPage() {
  const supabase = await createClient()
  const { data: sitios } = await supabase.from('sitios').select('*').order('created_at')

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, "Iowan Old Style", serif', fontSize: 26, color: '#1A1D29', margin: 0 }}>
            Sitios
          </h1>
          <p style={{ fontSize: 13.5, color: '#6B6F76', marginTop: 4 }}>
            Crea aqui cada sitio web (ej. Biblia, Deportes). Luego, al crear una noticia, eliges a cual sitio pertenece.
          </p>
        </div>
        <Link
          href="/admin/sitios/nueva"
          style={{ padding: '9px 18px', background: '#1A1D29', color: '#fff', borderRadius: 4, fontSize: 14, textDecoration: 'none' }}
        >
          + Nuevo sitio
        </Link>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E4E2DC', borderRadius: 6, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: '#FAFAF8', borderBottom: '1px solid #E4E2DC' }}>
              <th style={{ padding: '10px 16px', fontSize: 12.5, color: '#6B6F76', fontWeight: 500 }}>Nombre</th>
              <th style={{ padding: '10px 16px', fontSize: 12.5, color: '#6B6F76', fontWeight: 500 }}>Dominio</th>
              <th style={{ padding: '10px 16px', fontSize: 12.5, color: '#6B6F76', fontWeight: 500 }}>Colores</th>
              <th style={{ padding: '10px 16px', fontSize: 12.5, color: '#6B6F76', fontWeight: 500 }}>Activo</th>
              <th style={{ padding: '10px 16px', fontSize: 12.5, color: '#6B6F76', fontWeight: 500 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sitios?.map((s: any) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #EFEDE7' }}>
                <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600 }}>{s.nombre}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#6B6F76' }}>{s.dominio || '-'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: '50%', background: s.color_primario, marginRight: 4, border: '1px solid #ddd' }} />
                  <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: '50%', background: s.color_acento, border: '1px solid #ddd' }} />
                </td>
                <td style={{ padding: '12px 16px', fontSize: 14 }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 999, fontSize: 12,
                    background: s.activo ? '#E7F3EC' : '#F1EFE9',
                    color: s.activo ? '#2F6B4F' : '#8B8776',
                  }}>
                    {s.activo ? 'Si' : 'No'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Link href={`/admin/sitios/${s.id}`} style={{ fontSize: 13.5, color: '#1A1D29' }}>Editar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}