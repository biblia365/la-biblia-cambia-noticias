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

export type AvisoUrgente = {
  texto: string
  activo: boolean
}

export type AnuncioItem = {
  id: string
  titulo: string
  descripcion: string | null
  imagen: string
  link: string
  texto_boton: string
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
  const propias = disponibles.filter((n) => n.categoria.toLowerCase() === match.toLowerCase())
  const resto = disponibles.filter((n) => !propias.includes(n))
  const elegidas = [...propias, ...resto].slice(0, count)
  elegidas.forEach((n) => usados.add(n.id))
  return elegidas
}

function momentoActualColombia(): "dia" | "noche" {
  const hora = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Bogota",
      hour: "numeric",
      hour12: false,
    }).format(new Date())
  )
  return hora >= 6 && hora < 18 ? "dia" : "noche"
}

function fechaColombiaHoy(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date())
}
export async function getHomeData() {
  const supabase = await createClient()

  const [{ data: noticiasRaw }, { data: versiculoRaw }, { data: videosRaw }, { data: redesRaw }, { data: cancionesRaw }, { data: avisoRaw }, { data: anuncioRaw }] =
    await Promise.all([
      supabase
        .from('noticias')
        .select('id, slug, titulo, descripcion, imagen, destacada, created_at, categorias(nombre)')
        .eq('publicado', true)
        .order('created_at', { ascending: false })
        .limit(30),
      supabase
        .from('versiculo_dia')
        .select('texto, referencia, imagen, momento, fecha')
        .eq('activo', true)
        .order('fecha', { ascending: false })
        .limit(10),
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
      supabase
        .from('aviso_urgente')
        .select('texto, activo')
        .order('updated_at', { ascending: false })
        .limit(1),
      supabase
        .from('anuncios')
        .select('id, titulo, descripcion, imagen, link, texto_boton, ubicacion')
        .eq('activo', true)
        .in('ubicacion', ['landing', 'ambos'])
        .order('created_at', { ascending: false })
        .limit(1),
    ])

  const pool = (noticiasRaw ?? []).map(mapNoticia)
  const usados = new Set<string>()

  const destacadaId = (noticiasRaw ?? []).find((n: any) => n.destacada)?.id
  const principal = pool.find((p) => p.id === destacadaId) ?? pool[0]

  if (principal) usados.add(principal.id)

  const heroSide = pool.filter((n) => !usados.has(n.id)).slice(0, 2)
  heroSide.forEach((n) => usados.add(n.id))

  const nacionales = tomarPorCategoria(pool, usados, 'nacionales', 3)
  const internacionales = tomarPorCategoria(pool, usados, 'internacionales', 3)
  const israel = tomarPorCategoria(pool, usados, 'israel', 3)
  const analisisLista = tomarPorCategoria(pool, usados, 'analisis', 1)
  const analisis = analisisLista[0]

  const ultimasNoticias = pool.slice(0, 5).map((n) => n.titulo)

  const momentoActual = momentoActualColombia()
  const fechaHoy = fechaColombiaHoy()
  const lista = versiculoRaw ?? []
  const versiculoElegido =
    lista.find((v: any) => v.fecha === fechaHoy && v.momento === momentoActual) ??
    lista.find((v: any) => v.momento === momentoActual) ??
    lista[0]

  const versiculo = versiculoElegido
    ? {
        texto: versiculoElegido.texto,
        referencia: versiculoElegido.referencia,
        imagen: versiculoElegido.imagen as string | null,
        momento: (versiculoElegido.momento as "dia" | "noche" | null) ?? momentoActual,
      }
    : {
        texto: 'El Senor es mi pastor; nada me faltara.',
        referencia: 'Salmos 23:1',
        imagen: null as string | null,
        momento: momentoActual,
      }

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

  const aviso: AvisoUrgente = avisoRaw?.[0]
    ? { texto: avisoRaw[0].texto, activo: avisoRaw[0].activo }
    : { texto: '', activo: false }

  const anuncioLanding: AnuncioItem | null = anuncioRaw?.[0]
    ? {
        id: anuncioRaw[0].id,
        titulo: anuncioRaw[0].titulo,
        descripcion: anuncioRaw[0].descripcion,
        imagen: anuncioRaw[0].imagen,
        link: anuncioRaw[0].link,
        texto_boton: anuncioRaw[0].texto_boton,
      }
    : null

  const redesMap = new Map<string, string>()
  ;(redesRaw ?? []).forEach((r: any) => redesMap.set(r.plataforma.toLowerCase(), r.url))

  return {
    principal,
    heroSide,
    nacionales,
    internacionales,
    israel,
    analisis,
    ultimasNoticias: ultimasNoticias.length ? ultimasNoticias : ['Aun no hay noticias publicadas.'],
    versiculo,
    videos,
    canciones,
    aviso,
    anuncioLanding,
    redes: {
      facebook: redesMap.get('facebook') || '#',
      youtube: redesMap.get('youtube') || '#',
      instagram: redesMap.get('instagram') || '#',
      tiktok: redesMap.get('tiktok') || '#',
    },
  }
}





