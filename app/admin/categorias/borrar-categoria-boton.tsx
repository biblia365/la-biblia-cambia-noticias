'use client'

import { borrarCategoria } from '../actions'
import { useRouter } from 'next/navigation'

export default function BorrarCategoriaBoton({ id }: { id: string }) {
  const router = useRouter()

  async function handleClick() {
    if (!confirm('Borrar esta categoria?')) return
    await borrarCategoria(id)
    router.refresh()
  }

  return (
    <button onClick={handleClick} style={{ color: 'red' }}>
      Borrar
    </button>
  )
}
