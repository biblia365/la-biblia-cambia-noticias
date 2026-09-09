'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { guardarAviso } from '../actions'

export default function AvisoForm({
  actual,
}: {
  actual?: { texto: string; activo: boolean }
}) {
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setError('')
    const resultado = await guardarAviso(formData)
    if (resultado?.error) {
      setError(resultado.error)
      return
    }
    router.refresh()
  }

  return (
    <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 500 }}>
      <label>
        Texto del aviso (barra roja "ULTIMA HORA"):
        <textarea
          name="texto"
          required
          defaultValue={actual?.texto}
          rows={3}
          style={{ width: '100%', padding: 8, marginTop: 4 }}
        />
      </label>
      <label>
        <input type="checkbox" name="activo" defaultChecked={actual?.activo} /> Mostrar la barra en la pagina principal
      </label>
      <button type="submit" style={{ padding: '8px 16px' }}>Guardar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
