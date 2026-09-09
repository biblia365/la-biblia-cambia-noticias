'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { borrarSuscriptor } from '../actions'

export default function BorrarSuscriptorBoton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleClick() {
    if (!confirm('¿Borrar este suscriptor?')) return
    setLoading(true)
    await borrarSuscriptor(id)
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{ fontSize: 13.5, color: '#c62828', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      {loading ? 'Borrando...' : 'Borrar'}
    </button>
  )
}