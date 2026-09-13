import { createClient } from '@/lib/supabase/server'
import RedSocialForm from './red-social-form'

const PLATAFORMAS = ['Facebook', 'YouTube', 'Instagram', 'TikTok']

export default async function AdminRedesPage({
  searchParams,
}: {
  searchParams: Promise<{ sitio?: string }>
}) {
  const { sitio: sitioIdParam } = await searchParams
  const supabase = await createClient()

  const { data: sitios } = await supabase.from('sitios').select('id, nombre').order('nombre')
  const listaSitios = sitios ?? []
  const sitioActivoId = sitioIdParam || listaSitios[0]?.id

  const { data: redes } = await supabase
    .from('redes_sociales')
    .select('*')
    .eq('sitio_id', sitioActivoId)

  const redesMap = new Map((redes ?? []).map((r: any) => [r.plataforma, r]))

  const listaCompleta = PLATAFORMAS.map((p) => {
    const existente = redesMap.get(p)
    return {
      plataforma: p,
      url: existente?.url || '',
      activo: existente?.activo ?? true,
    }
  })

  return (
    <div>
      <h1 style={{ fontFamily: 'Georgia, "Iowan Old Style", serif', fontSize: 26, color: '#1A1D29', marginBottom: 8 }}>
        Redes Sociales
      </h1>
      <p style={{ fontSize: 13.5, color: '#6B6F76', marginBottom: 16 }}>
        Estos enlaces se muestran en el encabezado y pie de pagina del sitio. Desmarca "Activo" para ocultar un icono sin borrar el enlace.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {listaSitios.map((s: any) => (
          <a
            key={s.id}
            href={'/admin/redes?sitio=' + s.id}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid #ccc',
              background: s.id === sitioActivoId ? '#1A1D29' : '#fff',
              color: s.id === sitioActivoId ? '#fff' : '#1A1D29',
            }}
          >
            {s.nombre}
          </a>
        ))}
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E4E2DC', borderRadius: 6, padding: '0 20px' }}>
        {listaCompleta.map((red) => (
          <RedSocialForm key={red.plataforma} red={red} sitioId={sitioActivoId} />
        ))}
      </div>
    </div>
  )
}
