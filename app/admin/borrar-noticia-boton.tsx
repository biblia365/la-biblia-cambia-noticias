'use client'

import { borrarNoticia } from './actions'
import { useRouter } from 'next/navigation'

export default function BorrarNoticiaBoton({ id }: { id: string }) {
  const router = useRouter()

  async function handleClick() {
    if (!confirm('Borrar esta noticia?')) return
    await borrarNoticia(id)
    router.refresh()
  }

  return (
    <button onClick={handleClick} style={{ color: 'red' }}>
      Borrar
    </button>
  )
}
