'use client'

import { useState } from 'react'
import { suscribirseNewsletter } from '@/app/admin/actions'

export default function FormularioSuscripcion() {
  const [email, setEmail] = useState('')
  const [estado, setEstado] = useState<'idle' | 'cargando' | 'exito' | 'error'>('idle')
  const [mensaje, setMensaje] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setEstado('cargando')
    const formData = new FormData()
    formData.set('email', email)
    const resultado = await suscribirseNewsletter(formData)

    if (resultado?.error) {
      setEstado('error')
      setMensaje(resultado.error)
      return
    }

    setEstado('exito')
    setMensaje('Te suscribiste correctamente.')
    setEmail('')
  }

  if (estado === 'exito') {
    return (
      <div className="flex w-full md:w-auto md:min-w-[420px] items-center justify-center bg-[#E7F3EC] text-[#2F6B4F] font-bold text-sm px-4 py-3 rounded-lg">
        {mensaje}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full md:w-auto md:min-w-[420px]">
      <div className="flex w-full">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Tu correo electronico"
          required
          className="flex-1 px-4 py-3 border border-slate-300 border-r-0 outline-none rounded-l-lg"
        />
        <button
          type="submit"
          disabled={estado === 'cargando'}
          className="bg-[#063B73] hover:bg-[#052a52] text-white font-extrabold text-xs px-6 rounded-r-lg transition disabled:opacity-60"
        >
          {estado === 'cargando' ? 'ENVIANDO...' : 'SUSCRIBIRME'}
        </button>
      </div>
      {estado === 'error' && (
        <span className="text-red-500 text-xs mt-2">{mensaje}</span>
      )}
    </form>
  )
}