"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { borrarAnuncio } from "../actions";

export default function BorrarAnuncioBoton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("¿Borrar este anuncio? Esta accion no se puede deshacer.")) return;
    startTransition(async () => {
      await borrarAnuncio(id);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      style={{
        color: "#B42318",
        background: "none",
        border: "none",
        fontSize: 13,
        fontWeight: 600,
        cursor: isPending ? "not-allowed" : "pointer",
        opacity: isPending ? 0.5 : 1,
      }}
    >
      {isPending ? "Borrando..." : "Borrar"}
    </button>
  );
}
