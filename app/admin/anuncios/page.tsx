import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BorrarAnuncioBoton from "./borrar-anuncio-boton";

export default async function AnunciosPage() {
  const supabase = await createClient();
  const { data: anuncios } = await supabase
    .from("anuncios")
    .select("id, titulo, ubicacion, activo, imagen")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1A1D29" }}>Anuncios</h1>
        <Link
          href="/admin/anuncios/nueva"
          style={{
            background: "#063B73",
            color: "white",
            fontWeight: 700,
            fontSize: 13.5,
            padding: "10px 20px",
            borderRadius: 6,
            textDecoration: "none",
          }}
        >
          + Nuevo anuncio
        </Link>
      </div>

      {!anuncios?.length && <p style={{ color: "#8B8FA3" }}>Aun no hay anuncios creados.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {anuncios?.map((a) => (
          <div
            key={a.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "white",
              border: "1px solid #E4E2DC",
              borderRadius: 8,
              padding: "12px 16px",
            }}
          >
            <img src={a.imagen} alt={a.titulo} style={{ width: 64, height: 48, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: "#1A1D29" }}>{a.titulo}</div>
              <div style={{ fontSize: 12.5, color: "#8B8FA3", marginTop: 2 }}>
                {a.ubicacion} · {a.activo ? "Activo" : "Inactivo"}
              </div>
            </div>
            <Link href={`/admin/anuncios/${a.id}`} style={{ fontSize: 13, fontWeight: 600, color: "#063B73", textDecoration: "none" }}>
              Editar
            </Link>
            <BorrarAnuncioBoton id={a.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
