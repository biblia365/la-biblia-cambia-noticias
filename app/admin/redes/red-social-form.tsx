'use client'

import { useState } from 'react'
import { guardarRedSocial } from '../actions'

type RedSocial = { plataforma: string; url: string; activo: boolean }

export default function RedSocialForm({ red }: { red: RedSocial }) {
  const [loading, setLoading] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    setGuardado(false)
    const resultado = await guardarRedSocial(formData)
    setLoading(false)
    if (resultado?.error) {
      setError(resultado.error)
      return
    }
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2000)
  }

  return (
    <form action={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0', borderBottom: '1px solid #EFEDE7' }}>
      <input type="hidden" name="plataforma" value={red.plataforma} />
      <span style={{ width: 100, fontWeight: 600, fontSize: 14, color: '#1A1D29', flexShrink: 0 }}>{red.plataforma}</span>
      <input
        name="url"
        type="url"
        defaultValue={red.url}
        placeholder="https://..."
        required
        style={{ flex: 1, padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
      />
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6B6F76', flexShrink: 0 }}>
        <input type="checkbox" name="activo" defaultChecked={red.activo} /> Activo
      </label>
      <button type="submit" disabled={loading} style={{ padding: '8px 16px', flexShrink: 0 }}>
        {loading ? '...' : 'Guardar'}
      </button>
      {guardado && <span style={{ color: '#2F6B4F', fontSize: 13, flexShrink: 0 }}>Guardado</span>}
      {error && <span style={{ color: 'red', fontSize: 13, flexShrink: 0 }}>{error}</span>}
    </form>
  )
}