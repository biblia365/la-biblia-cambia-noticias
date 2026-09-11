'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { crearNoticia, actualizarNoticia } from '../actions'

type Categoria = { id: string; nombre: string }
type Sitio = { id: string; nombre: string }
type Noticia = {
  id: string
  titulo: string
  descripcion: string | null
  contenido: string | null
  categoria_id: string | null
  sitio_id: string | null
  destacada: boolean
  publicado: boolean
  imagen: string | null
  fuente_url: string | null
}

export default function NoticiaForm({
  categorias,
  sitios,
  noticia,
}: {
  categorias: Categoria[]
  sitios: Sitio[]
  noticia?: Noticia
}) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(noticia?.imagen ?? null)
  const [eliminarImagen, setEliminarImagen] = useState(false)
  const [arrastrando, setArrastrando] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function setArchivo(files: FileList | null | undefined) {
    if (!files || !files[0]) return
    const file = files[0]
    if (fileInputRef.current) {
      const dt = new DataTransfer()
      dt.items.add(file)
      fileInputRef.current.files = dt.files
    }
    setPreview(URL.createObjectURL(file))
    setEliminarImagen(false)
  }

  function quitarImagen() {
    setPreview(null)
    setEliminarImagen(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

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
        <label>Sitio</label>
        <select name="sitio_id" defaultValue={noticia?.sitio_id ?? ''} required style={{ width: '100%', padding: 8 }}>
          <option value="">- Selecciona un sitio -</option>
          {sitios.map((s) => (
            <option key={s.id} value={s.id}>{s.nombre}</option>
          ))}
        </select>
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
        <label>Link de fuente (Facebook, X, sitio web, etc.)</label>
        <input
          name="fuente_url"
          type="url"
          placeholder="https://facebook.com/..."
          defaultValue={noticia?.fuente_url ?? ''}
          style={{ width: '100%', padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Imagen</label>

        <div
          tabIndex={0}
          onDragOver={(e) => {
            e.preventDefault()
            setArrastrando(true)
          }}
          onDragLeave={() => setArrastrando(false)}
          onDrop={(e) => {
            e.preventDefault()
            setArrastrando(false)
            setArchivo(e.dataTransfer.files)
          }}
          onPaste={(e) => {
            const files = e.clipboardData?.files
            if (files && files.length > 0) {
              e.preventDefault()
              setArchivo(files)
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: arrastrando ? '2px dashed #063B73' : '2px dashed #ccc',
            borderRadius: 8,
            padding: 16,
            textAlign: 'center',
            cursor: 'pointer',
            background: arrastrando ? '#f0f6ff' : '#fafafa',
            outline: 'none',
          }}
        >
          {preview ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img src={preview} alt="" style={{ maxWidth: 240, maxHeight: 180, borderRadius: 6 }} />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  quitarImagen()
                }}
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  background: '#c62828',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: 26,
                  height: 26,
                  cursor: 'pointer',
                }}
                aria-label="Quitar imagen"
              >
                x
              </button>
              <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>
                Click, arrastra o pega (Ctrl+V) para reemplazar
              </div>
            </div>
          ) : (
            <div style={{ color: '#666', fontSize: 14 }}>
              Arrastra una imagen aqui, pegala (Ctrl+V), o haz click para seleccionar
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          name="imagen"
          accept="image/*"
          onChange={(e) => setArchivo(e.target.files)}
          style={{ display: 'none' }}
        />
        <input type="hidden" name="eliminar_imagen" value={eliminarImagen ? 'true' : 'false'} readOnly />
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
