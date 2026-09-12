'use client'

import { useEffect, useState } from 'react'

type Partido = {
  id: number
  liga: string
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
  if (p.estado === 'IN_PLAY' || p.estado === 'LIVE') return p.minuto ? `EN VIVO ${p.minuto}'` : 'EN VIVO'
  if (p.estado === 'PAUSED') return 'MEDIO TIEMPO'
  if (p.estado === 'FINISHED') return 'FINALIZADO'
  if (p.estado === 'SCHEDULED' || p.estado === 'TIMED') {
    return new Date(p.hora).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
  }
  return p.estado
}

export default function PartidosCarousel({ colorPrimario }: { colorPrimario: string }) {
  const [partidos, setPartidos] = useState<Partido[]>([])
  const [cargando, setCargando] = useState(true)

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

  if (cargando || partidos.length === 0) return null

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          {partidos.map((p) => (
            <div key={p.id} className="flex-shrink-0 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 min-w-[220px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 truncate">{p.liga}</div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {p.escudoLocal && <img src={p.escudoLocal} alt={p.local} className="w-5 h-5 object-contain flex-shrink-0" />}
                  <span className="text-xs font-semibold truncate">{p.local}</span>
                </div>
                <span className="text-sm font-extrabold" style={{ color: colorPrimario }}>{p.golesLocal ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-1">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {p.escudoVisitante && <img src={p.escudoVisitante} alt={p.visitante} className="w-5 h-5 object-contain flex-shrink-0" />}
                  <span className="text-xs font-semibold truncate">{p.visitante}</span>
                </div>
                <span className="text-sm font-extrabold" style={{ color: colorPrimario }}>{p.golesVisitante ?? '-'}</span>
              </div>
              <div
                className="text-[10px] font-bold uppercase mt-2 text-center rounded py-0.5"
                style={{
                  background: p.estado === 'IN_PLAY' || p.estado === 'LIVE' ? '#dc2626' : '#e2e8f0',
                  color: p.estado === 'IN_PLAY' || p.estado === 'LIVE' ? 'white' : '#475569',
                }}
              >
                {estadoTexto(p)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}