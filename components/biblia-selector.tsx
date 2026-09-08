"use client";

import { useRouter } from "next/navigation";
import { LIBROS } from "@/lib/libros";

export default function BibliaSelector({
  libroNum,
  capitulo,
}: {
  libroNum: number;
  capitulo: number;
}) {
  const router = useRouter();
  const libroActual = LIBROS.find((l) => l.num === libroNum) ?? LIBROS[42];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 mb-6 flex flex-col md:flex-row gap-4">
      <select
        value={libroNum}
        onChange={(e) => router.push(`/biblia?libro=${e.target.value}&capitulo=1`)}
        className="flex-1 border border-slate-300 rounded-lg px-4 py-3 font-bold text-[#063B73] outline-none"
      >
        {LIBROS.map((l) => (
          <option key={l.num} value={l.num}>{l.nombre}</option>
        ))}
      </select>

      <select
        value={capitulo}
        onChange={(e) => router.push(`/biblia?libro=${libroNum}&capitulo=${e.target.value}`)}
        className="md:w-40 border border-slate-300 rounded-lg px-4 py-3 font-bold text-[#063B73] outline-none"
      >
        {Array.from({ length: libroActual.capitulos }, (_, i) => i + 1).map((c) => (
          <option key={c} value={c}>Capitulo {c}</option>
        ))}
      </select>
    </div>
  );
}
