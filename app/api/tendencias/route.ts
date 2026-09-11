import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()

  const { data: sitioBiblia } = await supabase.from('sitios').select('id').eq('slug', 'biblia').single()

  const { data } = await supabase
    .from('noticias')
    .select('titulo, slug')
    .eq('publicado', true)
    .eq('sitio_id', sitioBiblia?.id)
    .order('created_at', { ascending: false })
    .limit(4)

  return NextResponse.json(data || [])
}