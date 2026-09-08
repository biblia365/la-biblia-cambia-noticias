import { createClient } from '@/lib/supabase/server'

export type NoticiaCard = {
  id: string
  slug: string
  categoria: string
  titulo: string
  descripcion: string | null
  imagen: string
  fecha: string
  fechaHora: string
}

export type VideoItem = {
  id: string
  titulo: string
  url: string
}

export type CancionItem = {
  id: string
  titulo: string
  artista: string | null
  url: string
  portada: string | null
}

const IMG_FALLBACK =
  'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80'

function formatFecha(iso: string) {
  const texto = new Date(iso)
    .toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase()
    .replace(/\./g, '')
  return texto
}

function formatFechaHora(iso: string) {
  const d = new Date(iso)
  const hora = d
    .toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })
    .toUpperCase()
  return `${formatFecha(iso)} - ${hora}`
}

function mapNoticia(n: any): NoticiaCard {
  return {
    id: n.id,
    slug: n.slug,
    categoria: (n.categorias?.nombre || 'NOTICIAS').toUpperCase(),
    titulo: n.titulo,
    descripcion: n.descripcion,
    imagen: n.imagen || IMG_FALLBACK,
    fecha: formatFecha(n.created_at),
    fechaHora: formatFechaHora(n.created_at),
  }
}

// Toma `count` noticias del pool cuya categoria contenga `match`
// (case-insensitive). Si no alcanza, rellena con lo que quede del pool
// para que la seccion nunca se vea vacia. Marca los ids usados.
function tomarPorCategoria(
  pool: NoticiaCard[],
  usados: Set<string>,
  match: string,
  count: number
) {
  const disponibles = pool.filter((n) => !usados.has(n.id))
  const propias = disponibles.filter((n) => n.categoria.toLowerCase().includes(match))
  const resto = disponibles.filter((n) => !propias.includes(n))
  const elegidas = [...propias, ...resto].slice(0, count)
  elegidas.forEach((n) => usados.add(n.id))
  return elegidas
}

export async function getHomeData() {
  const supabase = await createClient()

  const [{ data: noticiasRaw }, { data: versiculoRaw }, { data: videosRaw }, { data: redesRaw }, { data: cancionesRaw }] =
    await Promise.all([
      supabase
        .from('noticias')
        .select('id, slug, titulo, descripcion, imagen, destacada, created_at, categorias(nombre)')
        .eq('publicado', true)
        .order('created_at', { ascending: false })
        .limit(30),
      supabase
        .from('versiculo_dia')
        .select('texto, referencia')
        .eq('activo', true)
        .order('updated_at', { ascending: false })
        .limit(1),
      supabase
        .from('videos')
        .select('id, titulo, url')
        .order('created_at', { ascending: false })
        .limit(4),
      supabase.from('redes_sociales').select('plataforma, url').eq('activo', true),
      supabase
        .from('canciones')
        .select('id, titulo, artista, url, portada')
        .order('created_at', { ascending: false })
        .limit(20),
    ])

  const pool = (noticiasRaw ?? []).map(mapNoticia)
  const usados = new Set<string>()

  const destacadaId = (noticiasRaw ?? []).find((n: any) => n.destacada)?.id
  const principal = pool.find((p) => p.id === destacadaId) ?? pool[0]

  if (principal) usados.add(principal.id)

  const heroSide = pool.filter((n) => !usados.has(n.id)).slice(0, 2)
  heroSide.forEach((n) => usados.add(n.id))

  const nacionales = tomarPorCategoria(pool, usados, 'nacional', 3)
  const internacionales = tomarPorCategoria(pool, usados, 'internacional', 3)
  const analisisLista = tomarPorCategoria(pool, usados, 'analisis', 1)
  const analisis = analisisLista[0]

  const ultimasNoticias = pool.slice(0, 5).map((n) => n.titulo)

  const versiculo = versiculoRaw?.[0]
    ? { texto: versiculoRaw[0].texto, referencia: versiculoRaw[0].referencia }
    : { texto: 'El Senor es mi pastor; nada me faltara.', referencia: 'Salmos 23:1' }

  const videos: VideoItem[] = (videosRaw ?? []).map((v: any) => ({
    id: v.id,
    titulo: v.titulo,
    url: v.url,
  }))

  const canciones: CancionItem[] = (cancionesRaw ?? []).map((c: any) => ({
    id: c.id,
    titulo: c.titulo,
    artista: c.artista,
    url: c.url,
    portada: c.portada,
  }))

  const redesMap = new Map<string, string>()
  ;(redesRaw ?? []).forEach((r: any) => redesMap.set(r.plataforma.toLowerCase(), r.url))

  return {
    principal,
    heroSide,
    nacionales,
    internacionales,
    analisis,
    ultimasNoticias: ultimasNoticias.length ? ultimasNoticias : ['Aun no hay noticias publicadas.'],
    versiculo,
    videos,
    canciones,
    redes: {
      facebook: redesMap.get('facebook') || '#',
      youtube: redesMap.get('youtube') || '#',
      instagram: redesMap.get('instagram') || '#',
      tiktok: redesMap.get('tiktok') || '#',
    },
  }
}
