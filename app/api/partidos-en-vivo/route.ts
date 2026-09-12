import { NextResponse } from 'next/server'

export const revalidate = 900

export async function GET() {
  const key = process.env.FOOTBALL_DATA_KEY

  if (!key) {
    return NextResponse.json({ error: 'Falta configurar FOOTBALL_DATA_KEY' }, { status: 500 })
  }

  const hoy = new Date().toISOString().slice(0, 10)

  try {
    const res = await fetch(`https://api.football-data.org/v4/matches?dateFrom=${hoy}&dateTo=${hoy}`, {
      headers: { 'X-Auth-Token': key },
      next: { revalidate: 900 },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'No se pudo obtener partidos', status: res.status }, { status: 502 })
    }

    const data = await res.json()

    const partidos = (data.matches || []).map((m: any) => ({
      id: m.id,
      liga: m.competition?.name || '',
      local: m.homeTeam?.shortName || m.homeTeam?.name || 'Local',
      visitante: m.awayTeam?.shortName || m.awayTeam?.name || 'Visitante',
      escudoLocal: m.homeTeam?.crest || null,
      escudoVisitante: m.awayTeam?.crest || null,
      golesLocal: m.score?.fullTime?.home,
      golesVisitante: m.score?.fullTime?.away,
      estado: m.status,
      minuto: m.minute || null,
      hora: m.utcDate,
    }))

    return NextResponse.json({ partidos })
  } catch (e: any) {
    return NextResponse.json({ error: 'Error al consultar la API: ' + e.message }, { status: 500 })
  }
}