import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function fechaColombiaHoy(): string {
  const ahora = new Date();
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(ahora); // YYYY-MM-DD
}

async function pedirVersiculoAGroq(momento: "dia" | "noche") {
  const prompt =
    momento === "dia"
      ? "Dame un versiculo biblico (Reina Valera 1960) apropiado para leer en la manana, de animo, esperanza o proposito para el dia. Responde SOLO con un JSON valido, sin markdown, con este formato exacto: {\"texto\": \"...\", \"referencia\": \"Libro 0:0\"}"
      : "Dame un versiculo biblico (Reina Valera 1960) apropiado para leer en la noche, de paz, descanso o proteccion divina. Responde SOLO con un JSON valido, sin markdown, con este formato exacto: {\"texto\": \"...\", \"referencia\": \"Libro 0:0\"}";

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.9,
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const contenido = data.choices?.[0]?.message?.content;
  if (!contenido) throw new Error("Groq no devolvio contenido");

  const parsed = JSON.parse(contenido);
  if (!parsed.texto || !parsed.referencia) {
    throw new Error("Respuesta de Groq incompleta");
  }
  return { texto: parsed.texto as string, referencia: parsed.referencia as string };
}


export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const momentoParam = req.nextUrl.searchParams.get("momento");
  const momento: "dia" | "noche" = momentoParam === "noche" ? "noche" : "dia";

  try {
    const { texto, referencia } = await pedirVersiculoAGroq(momento);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const fecha = fechaColombiaHoy();

    const { data: registroExistente } = await supabase
      .from("versiculo_dia")
      .select("imagen")
      .eq("momento", momento)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    const imagen = registroExistente?.imagen || null;

    const { error } = await supabase.from("versiculo_dia").upsert(
      {
        texto,
        referencia,
        imagen,
        momento,
        fecha,
        activo: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "fecha,momento" }
    );

    if (error) throw error;

    return NextResponse.json({ success: true, momento, fecha, texto, referencia, imagen });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Error desconocido" }, { status: 500 });
  }
}
