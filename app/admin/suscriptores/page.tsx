import { createClient } from '@/lib/supabase/server'
import BorrarSuscriptorBoton from './borrar-suscriptor-boton'
import ExportarCsvBoton from './exportar-csv-boton'

export default async function AdminSuscriptoresPage() {
  const supabase = await createClient()
  const { data: suscriptores } = await supabase
    .from('suscriptores')
    .select('id, email, created_at')
    .order('created_at', { ascending: false })

  function formatFecha(iso: string) {
    return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, "Iowan Old Style", serif', fontSize: 26, color: '#1A1D29', margin: 0 }}>
            Suscriptores
          </h1>
          <p style={{ fontSize: 13.5, color: '#6B6F76', marginTop: 4 }}>
            {suscriptores?.length || 0} correos suscritos
          </p>
        </div>
        <ExportarCsvBoton suscriptores={suscriptores || []} />
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E4E2DC', borderRadius: 6, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: '#FAFAF8', borderBottom: '1px solid #E4E2DC' }}>
              <th style={{ padding: '10px 16px', fontSize: 12.5, color: '#6B6F76', fontWeight: 500 }}>Correo</th>
              <th style={{ padding: '10px 16px', fontSize: 12.5, color: '#6B6F76', fontWeight: 500 }}>Fecha</th>
              <th style={{ padding: '10px 16px', fontSize: 12.5, color: '#6B6F76', fontWeight: 500 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {suscriptores?.map((s: any) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #EFEDE7' }}>
                <td style={{ padding: '12px 16px', fontSize: 14 }}>{s.email}</td>
                <td style={{ padding: '12px 16px', fontSize: 14, color: '#6B6F76' }}>{formatFecha(s.created_at)}</td>
                <td style={{ padding: '12px 16px' }}>
                  <BorrarSuscriptorBoton id={s.id} />
                </td>
              </tr>
            ))}
            {(!suscriptores || suscriptores.length === 0) && (
              <tr>
                <td colSpan={3} style={{ padding: '24px 16px', textAlign: 'center', color: '#8B8776', fontSize: 14 }}>
                  Aun no hay suscriptores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}