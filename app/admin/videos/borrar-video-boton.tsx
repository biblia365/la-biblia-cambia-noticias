'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { borrarVideo } from '../actions'

export default function BorrarVideoBoton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleClick() {
    if (!confirm('¿Borrar este video?')) return
    setLoading(true)
    await borrarVideo(id)
    router.refresh()
  }

  return (
    <button onClick={handleClick} disabled={loading} style={{ padding: '4px 10px', color: 'red' }}>
      {loading ? 'Borrando...' : 'Borrar'}
    </button>
  )
}
