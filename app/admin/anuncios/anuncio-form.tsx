"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { crearAnuncio, actualizarAnuncio } from "../actions";

type Anuncio = {
  id: string;
  titulo: string;
  descripcion: string | null;
  imagen: string;
  link: string;
  texto_boton: string;
  ubicacion: string;
  activo: boolean;
};

export default function AnuncioForm({ anuncio }: { anuncio?: Anuncio }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = anuncio
        ? await actualizarAnuncio(anuncio.id, formData)
        : await crearAnuncio(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }
      router.push("/admin/anuncios");
      router.refresh();
    });
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #DCD9CF",
    borderRadius: 6,
    fontSize: 14,
    marginTop: 4,
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 13.5,
    fontWeight: 600,
    color: "#3A3D46",
    display: "block",
    marginTop: 16,
  };

  return (
    <form action={handleSubmit} style={{ maxWidth: 520 }}>
      {error && (
        <div style={{ background: "#FDEDED", color: "#B42318", padding: "10px 14px", borderRadius: 6, marginBottom: 16, fontSize: 13.5 }}>
          {error}
        </div>
      )}

      <label style={labelStyle}>
        Titulo
        <input style={inputStyle} type="text" name="titulo" defaultValue={anuncio?.titulo} required />
      </label>

      <label style={labelStyle}>
        Descripcion (opcional)
        <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 70 }} name="descripcion" defaultValue={anuncio?.descripcion ?? ""} />
      </label>

      <label style={labelStyle}>
        Enlace de destino
        <input style={inputStyle} type="url" name="link" defaultValue={anuncio?.link} placeholder="https://" required />
      </label>

      <label style={labelStyle}>
        Texto del boton
        <input style={inputStyle} type="text" name="texto_boton" defaultValue={anuncio?.texto_boton ?? "Ver mas"} />
      </label>

      <label style={labelStyle}>
        Ubicacion
        <select style={inputStyle} name="ubicacion" defaultValue={anuncio?.ubicacion ?? "landing"} required>
          <option value="landing">Solo landing</option>
          <option value="noticia">Solo dentro de noticias</option>
          <option value="ambos">Landing y noticias</option>
        </select>
      </label>

      <label style={labelStyle}>
        Imagen {anuncio ? "(dejar vacio para mantener la actual)" : ""}
        <input style={inputStyle} type="file" name="imagen" accept="image/*" required={!anuncio} />
      </label>

      {anuncio?.imagen && (
        <img src={anuncio.imagen} alt={anuncio.titulo} style={{ marginTop: 12, maxWidth: 220, borderRadius: 6 }} />
      )}

      <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 8 }}>
        <input type="checkbox" name="activo" defaultChecked={anuncio?.activo ?? true} />
        Anuncio activo
      </label>

      <button
        type="submit"
        disabled={isPending}
        style={{
          marginTop: 24,
          background: "#063B73",
          color: "white",
          fontWeight: 700,
          fontSize: 13.5,
          padding: "12px 24px",
          borderRadius: 6,
          border: "none",
          cursor: isPending ? "not-allowed" : "pointer",
          opacity: isPending ? 0.6 : 1,
        }}
      >
        {isPending ? "Guardando..." : anuncio ? "Guardar cambios" : "Crear anuncio"}
      </button>
    </form>
  );
}
