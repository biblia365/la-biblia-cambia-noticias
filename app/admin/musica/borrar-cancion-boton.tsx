'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { borrarCancion } from '../actions'

export default function BorrarCancionBoton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleClick() {
    if (!confirm('Borrar esta cancion?')) return
    setLoading(true)
    await borrarCancion(id)
    router.refresh()
  }

  return (
    <button onClick={handleClick} disabled={loading} style={{ padding: '4px 10px', color: 'red' }}>
      {loading ? 'Borrando...' : 'Borrar'}
    </button>
  )
}
