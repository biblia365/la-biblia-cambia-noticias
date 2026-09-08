'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { crearNoticia, actualizarNoticia } from '../actions'

type Categoria = { id: string; nombre: string }
type Noticia = {
  id: string
  titulo: string
  descripcion: string | null
  contenido: string | null
  categoria_id: string | null
  destacada: boolean
  publicado: boolean
  imagen: string | null
}

export default function NoticiaForm({
  categorias,
  noticia,
}: {
  categorias: Categoria[]
  noticia?: Noticia
}) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')

    const resultado = noticia
      ? await actualizarNoticia(noticia.id, formData)
      : await crearNoticia(formData)

    setLoading(false)

    if (resultado?.error) {
      setError(resultado.error)
      return
    }

    router.push('/admin')
  }

  return (
    <form action={handleSubmit} style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 12 }}>
        <label>Titulo</label>
        <input name="titulo" defaultValue={noticia?.titulo} required style={{ width: '100%', padding: 8 }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Descripcion corta</label>
        <textarea name="descripcion" defaultValue={noticia?.descripcion ?? ''} rows={2} style={{ width: '100%', padding: 8 }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Contenido</label>
        <textarea name="contenido" defaultValue={noticia?.contenido ?? ''} rows={8} style={{ width: '100%', padding: 8 }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Categoria</label>
        <select name="categoria_id" defaultValue={noticia?.categoria_id ?? ''} style={{ width: '100%', padding: 8 }}>
          <option value="">- Sin categoria -</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Imagen {noticia?.imagen && '(dejar vacio para conservar la actual)'}</label>
        <input type="file" name="imagen" accept="image/*" style={{ width: '100%' }} />
        {noticia?.imagen && (
          <img src={noticia.imagen} alt="" style={{ maxWidth: 200, marginTop: 8 }} />
        )}
      </div>

      <div style={{ marginBottom: 12, display: 'flex', gap: 16 }}>
        <label>
          <input type="checkbox" name="destacada" defaultChecked={noticia?.destacada} /> Destacada
        </label>
        <label>
          <input type="checkbox" name="publicado" defaultChecked={noticia?.publicado ?? true} /> Publicado
        </label>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}
