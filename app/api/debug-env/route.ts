import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const secreto = process.env.CRON_SECRET || "";
  return NextResponse.json({
    existe: !!process.env.CRON_SECRET,
    longitud: secreto.length,
    primeros2: secreto.slice(0, 2),
    ultimos2: secreto.slice(-2),
    groqExiste: !!process.env.GROQ_API_KEY,
    pexelsExiste: !!process.env.PEXELS_API_KEY,
    supabaseServiceExiste: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
}
