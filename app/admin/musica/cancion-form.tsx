'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { crearCancion } from '../actions'

export default function CancionForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setError('')
    setLoading(true)
    const resultado = await crearCancion(formData)
    setLoading(false)
    if (resultado?.error) {
      setError(resultado.error)
      return
    }
    router.refresh()
  }

  return (
    <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 500 }}>
      <input name="titulo" placeholder="Titulo de la cancion" required style={{ padding: 8 }} />
      <input name="artista" placeholder="Artista (opcional)" style={{ padding: 8 }} />
      <label style={{ fontSize: 13 }}>
        Archivo de audio (mp3, wav):
        <input type="file" name="audio" accept="audio/*" required style={{ display: 'block', marginTop: 4 }} />
      </label>
      <label style={{ fontSize: 13 }}>
        Portada (opcional):
        <input type="file" name="portada" accept="image/*" style={{ display: 'block', marginTop: 4 }} />
      </label>
      <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
        {loading ? 'Subiendo...' : 'Agregar cancion'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
