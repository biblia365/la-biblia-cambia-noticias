import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://la-biblia-cambia-noticias.vercel.app'
  const supabase = await createClient()

  const { data: noticias } = await supabase
    .from('noticias')
    .select('slug, created_at')
    .eq('publicado', true)
    .order('created_at', { ascending: false })
    .limit(1000)

  const noticiasUrls = (noticias ?? []).map((n: any) => ({
    url: `${baseUrl}/noticias/${n.slug}`,
    lastModified: new Date(n.created_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/biblia`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    ...noticiasUrls,
  ]
}