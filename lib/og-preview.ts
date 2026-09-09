export type FuentePreview = {
  title: string | null
  description: string | null
  image: string | null
  siteName: string | null
}

function getMeta(html: string, prop: string): string | null {
  const regex1 = new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i")
  const regex2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, "i")
  const match = html.match(regex1) || html.match(regex2)
  return match ? match[1] : null
}

export async function obtenerVistaPreviaFuente(url: string): Promise<FuentePreview | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "facebookexternalhit/1.1",
      },
      next: { revalidate: 3600 },
    })

    clearTimeout(timeoutId)

    if (!res.ok) return null

    const html = await res.text()

    const title = getMeta(html, "og:title")
    const description = getMeta(html, "og:description")
    const image = getMeta(html, "og:image")
    const siteName = getMeta(html, "og:site_name")

    if (!title && !image) return null

    return { title, description, image, siteName }
  } catch {
    return null
  }
}