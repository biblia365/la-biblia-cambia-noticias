'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { crearSitio, actualizarSitio } from '../actions'

type Sitio = {
  id: string
  nombre: string
  dominio: string | null
  logo_url: string | null
  color_primario: string
  color_acento: string
  activo: boolean
}

export default function SitioForm({ sitio }: { sitio?: Sitio }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    const resultado = sitio
      ? await actualizarSitio(sitio.id, formData)
      : await crearSitio(formData)
    setLoading(false)
    if (resultado?.error) {
      setError(resultado.error)
      return
    }
    router.push('/admin/sitios')
  }

  return (
    <form action={handleSubmit} style={{ maxWidth: 500 }}>
      <div style={{ marginBottom: 12 }}>
        <label>Nombre del sitio</label>
        <input name="nombre" defaultValue={sitio?.nombre} required placeholder="Ej: Deportes Cambia" style={{ width: '100%', padding: 8 }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Dominio (opcional, se agrega cuando este publicado)</label>
        <input name="dominio" defaultValue={sitio?.dominio ?? ''} placeholder="ej: deportes-cambia.vercel.app" style={{ width: '100%', padding: 8 }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>URL del logo (ej: /LOGO-GOLES.png)</label>
        <input name="logo_url" defaultValue={sitio?.logo_url ?? ''} placeholder="/LOGO-GOLES.png" style={{ width: '100%', padding: 8 }} />
        {sitio?.logo_url && (
          <img src={sitio.logo_url} alt="Logo actual" style={{ height: 50, marginTop: 8, display: 'block' }} />
        )}
      </div>

      <div style={{ marginBottom: 12, display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <label>Color primario</label>
          <input name="color_primario" type="color" defaultValue={sitio?.color_primario ?? '#063B73'} style={{ width: '100%', height: 40 }} />
        </div>
        <div style={{ flex: 1 }}>
          <label>Color de acento</label>
          <input name="color_acento" type="color" defaultValue={sitio?.color_acento ?? '#C9972B'} style={{ width: '100%', height: 40 }} />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>
          <input type="checkbox" name="activo" defaultChecked={sitio?.activo ?? true} /> Activo
        </label>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}