'use client'

import { useEffect, useRef, useState } from 'react'

type Partido = {
  id: number
  liga: string
  jornada: number | null
  local: string
  visitante: string
  escudoLocal: string | null
  escudoVisitante: string | null
  golesLocal: number | null
  golesVisitante: number | null
  estado: string
  minuto: number | null
  hora: string
}

function estadoTexto(p: Partido) {
  if (p.estado === 'IN_PLAY' || p.estado === 'LIVE') return p.minuto ? `${p.minuto}'` : 'EN VIVO'
  if (p.estado === 'PAUSED') return 'ENTRETIEMPO'
  if (p.estado === 'FINISHED') return 'FINALIZADO'
  if (p.estado === 'SCHEDULED' || p.estado === 'TIMED') {
    const fecha = new Date(p.hora)
    const dia = fecha.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const hora = fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false })
    return `${dia} ${hora} HS`
  }
  return p.estado
}

function enVivo(p: Partido) {
  return p.estado === 'IN_PLAY' || p.estado === 'LIVE' || p.estado === 'PAUSED'
}

export default function PartidosCarousel({ colorPrimario }: { colorPrimario: string }) {
  const [partidos, setPartidos] = useState<Partido[]>([])
  const [cargando, setCargando] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  async function cargar() {
    try {
      const res = await fetch('/api/partidos-en-vivo')
      const data = await res.json()
      setPartidos(data.partidos || [])
    } catch {
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
    const interval = setInterval(cargar, 60000)
    return () => clearInterval(interval)
  }, [])

  function avanzar() {
    scrollRef.current?.scrollBy({ left: 280, behavior: 'smooth' })
  }

  if (cargando || partidos.length === 0) return null

  return (
    <div className="bg-slate-100 border-b border-slate-200 py-4 relative">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-2">
        <div ref={scrollRef} className="flex items-stretch gap-3 overflow-x-auto scrollbar-hide scroll-smooth flex-1">
          {partidos.map((p) => (
            <div key={p.id} className="flex-shrink-0 w-[260px] bg-white rounded-md overflow-hidden shadow-sm border border-slate-200">
              <div className="bg-[#0d1b3d] text-white text-[10px] font-semibold px-3 py-2 flex items-center justify-between">
                <span className="truncate">{p.liga}{p.jornada ? ` Fecha ${p.jornada}` : ''}</span>
              </div>

              <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100">
                <span
                  className="text-[10px] font-extrabold uppercase"
                  style={{ color: enVivo(p) ? '#dc2626' : '#334155' }}
                >
                  {estadoTexto(p)}
                </span>
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[11px] flex items-center justify-center font-bold leading-none">+</span>
              </div>

              <div className="px-3 py-3">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center gap-1 w-16">
                    {p.escudoLocal ? (
                      <img src={p.escudoLocal} alt={p.local} className="w-8 h-8 object-contain" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {p.golesLocal !== null && p.golesLocal !== undefined ? (
                      <>
                        <span className="w-7 h-7 rounded-full bg-[#0d1b3d] text-white text-sm font-extrabold flex items-center justify-center">{p.golesLocal}</span>
                        <span className="w-7 h-7 rounded-full bg-[#0d1b3d] text-white text-sm font-extrabold flex items-center justify-center">{p.golesVisitante}</span>
                      </>
                    ) : (
                      <span style={{ color: colorPrimario }} className="text-xs font-extrabold">VS</span>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-1 w-16">
                    {p.escudoVisitante ? (
                      <img src={p.escudoVisitante} alt={p.visitante} className="w-8 h-8 object-contain" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 px-1">
                  <span className="text-[10px] font-bold text-slate-700 uppercase w-16 text-center truncate">{p.local}</span>
                  <span className="w-14" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase w-16 text-center truncate">{p.visitante}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {partidos.length > 3 && (
          <button
            onClick={avanzar}
            aria-label="Ver mas partidos"
            className="flex-shrink-0 w-9 h-9 rounded-full bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}