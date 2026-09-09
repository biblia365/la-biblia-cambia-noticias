'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Comentario = {
  id: string
  nombre: string
  texto: string
  created_at: string
}

export default function ComentariosSeccion({
  noticiaId,
  comentariosIniciales,
}: {
  noticiaId: string
  comentariosIniciales: Comentario[]
}) {
  const [comentarios, setComentarios] = useState<Comentario[]>(comentariosIniciales)
  const [nombre, setNombre] = useState('')
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  async function enviarComentario(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !texto.trim()) return

    setEnviando(true)
    setError('')

    const supabase = createClient()
    const { data, error: insertError } = await supabase
      .from('comentarios')
      .insert({ noticia_id: noticiaId, nombre: nombre.trim(), texto: texto.trim() })
      .select()
      .single()

    setEnviando(false)

    if (insertError) {
      setError('No se pudo enviar el comentario. Intenta de nuevo.')
      return
    }

    setComentarios([data as Comentario, ...comentarios])
    setNombre('')
    setTexto('')
  }

  function formatFecha(iso: string) {
    return new Date(iso).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <section className="mt-12 pt-8 border-t border-slate-200">
      <h2 className="text-xl font-extrabold text-[#063B73] mb-5">
        Comentarios{comentarios.length > 0 ? ` (${comentarios.length})` : ''}
      </h2>

      <form onSubmit={enviarComentario} className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 mb-3 outline-none text-sm"
        />
        <textarea
          placeholder="Escribe tu comentario..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          required
          rows={3}
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 mb-3 outline-none text-sm resize-none"
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          disabled={enviando}
          className="bg-[#063B73] hover:bg-[#052a52] text-white font-bold text-sm px-5 py-2.5 rounded-lg transition disabled:opacity-50"
        >
          {enviando ? 'Enviando...' : 'Publicar comentario'}
        </button>
      </form>

      <div className="space-y-4">
        {comentarios.length === 0 && (
          <p className="text-sm text-slate-400">Se el primero en comentar esta noticia.</p>
        )}
        {comentarios.map((c) => (
          <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-[#063B73] text-sm">{c.nombre}</span>
              <span className="text-xs text-slate-400">{formatFecha(c.created_at)}</span>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">{c.texto}</p>
          </div>
        ))}
      </div>
    </section>
  )
}