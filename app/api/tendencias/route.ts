import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('noticias')
    .select('titulo, slug')
    .eq('publicado', true)
    .order('created_at', { ascending: false })
    .limit(4)

  return NextResponse.json(data || [])
}