import { createClient } from '@/lib/supabase/server'
import RedSocialForm from './red-social-form'

const PLATAFORMAS = ['Facebook', 'YouTube', 'Instagram', 'TikTok']

export default async function AdminRedesPage() {
  const supabase = await createClient()
  const { data: redes } = await supabase.from('redes_sociales').select('*')

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
      <p style={{ fontSize: 13.5, color: '#6B6F76', marginBottom: 24 }}>
        Estos enlaces se muestran en el encabezado y pie de pagina del sitio. Desmarca "Activo" para ocultar un icono sin borrar el enlace.
      </p>

      <div style={{ background: '#FFFFFF', border: '1px solid #E4E2DC', borderRadius: 6, padding: '0 20px' }}>
        {listaCompleta.map((red) => (
          <RedSocialForm key={red.plataforma} red={red} />
        ))}
      </div>
    </div>
  )
}