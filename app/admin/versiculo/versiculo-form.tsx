'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { guardarVersiculo } from '../actions'

export default function VersiculoForm({
  actual,
}: {
  actual?: { texto: string; referencia: string }
}) {
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setError('')
    const resultado = await guardarVersiculo(formData)
    if (resultado?.error) {
      setError(resultado.error)
      return
    }
    router.refresh()
  }

  return (
    <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 500 }}>
      <textarea
        name="texto"
        placeholder="Texto del versiculo"
        required
        defaultValue={actual?.texto}
        rows={3}
        style={{ padding: 8 }}
      />
      <input
        name="referencia"
        placeholder="Referencia (ej: Salmos 23:1)"
        required
        defaultValue={actual?.referencia}
        style={{ padding: 8 }}
      />
      <button type="submit" style={{ padding: '8px 16px' }}>Guardar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
