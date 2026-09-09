import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const esperado = `Bearer ${process.env.CRON_SECRET}`;
  return NextResponse.json({
    recibido: authHeader,
    coincide: authHeader === esperado,
    longitudRecibido: authHeader?.length ?? 0,
    longitudEsperado: esperado.length,
  });
}
