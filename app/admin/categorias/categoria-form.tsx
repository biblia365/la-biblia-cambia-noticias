'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { crearCategoria } from '../actions'

export default function CategoriaForm() {
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setError('')
    const resultado = await crearCategoria(formData)
    if (resultado?.error) {
      setError(resultado.error)
      return
    }
    router.refresh()
  }

  return (
    <form action={handleSubmit} style={{ display: 'flex', gap: 8 }}>
      <input name="nombre" placeholder="Nombre de la categoria" required style={{ padding: 8 }} />
      <button type="submit" style={{ padding: '8px 16px' }}>Agregar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
