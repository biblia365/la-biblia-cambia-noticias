'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { crearVideo } from '../actions'

export default function VideoForm() {
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setError('')
    const resultado = await crearVideo(formData)
    if (resultado?.error) {
      setError(resultado.error)
      return
    }
    router.refresh()
  }

  return (
    <form action={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <input name="titulo" placeholder="Titulo del video" required style={{ padding: 8, flex: 1 }} />
      <input name="url" placeholder="URL del video (YouTube, etc.)" required style={{ padding: 8, flex: 2 }} />
      <button type="submit" style={{ padding: '8px 16px' }}>Agregar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
