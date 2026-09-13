import { createClient } from '@/lib/supabase/server'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default async function icon({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: sitio } = await supabase.from('sitios').select('logo_url').eq('slug', slug).single()

  if (sitio?.logo_url) {
    try {
      const url = sitio.logo_url.startsWith('http')
        ? sitio.logo_url
        : `https://la-biblia-cambia-noticias.vercel.app${sitio.logo_url}`
      const res = await fetch(url)
      if (res.ok) {
        const buffer = await res.arrayBuffer()
        return new Response(buffer, { headers: { 'Content-Type': res.headers.get('content-type') || 'image/png' } })
      }
    } catch {}
  }

  const fallback = await readFile(path.join(process.cwd(), 'app', 'icon.png'))
  return new Response(new Uint8Array(fallback), { headers: { 'Content-Type': 'image/png' } })
}
