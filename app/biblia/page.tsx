"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteFooter from "@/components/site-footer";

const LIBROS = [
  { nombre: "Genesis", num: 1, capitulos: 50 }, { nombre: "Exodo", num: 2, capitulos: 40 },
  { nombre: "Levitico", num: 3, capitulos: 27 }, { nombre: "Numeros", num: 4, capitulos: 36 },
  { nombre: "Deuteronomio", num: 5, capitulos: 34 }, { nombre: "Josue", num: 6, capitulos: 24 },
  { nombre: "Jueces", num: 7, capitulos: 21 }, { nombre: "Rut", num: 8, capitulos: 4 },
  { nombre: "1 Samuel", num: 9, capitulos: 31 }, { nombre: "2 Samuel", num: 10, capitulos: 24 },
  { nombre: "1 Reyes", num: 11, capitulos: 22 }, { nombre: "2 Reyes", num: 12, capitulos: 25 },
  { nombre: "1 Cronicas", num: 13, capitulos: 29 }, { nombre: "2 Cronicas", num: 14, capitulos: 36 },
  { nombre: "Esdras", num: 15, capitulos: 10 }, { nombre: "Nehemias", num: 16, capitulos: 13 },
  { nombre: "Ester", num: 17, capitulos: 10 }, { nombre: "Job", num: 18, capitulos: 42 },
  { nombre: "Salmos", num: 19, capitulos: 150 }, { nombre: "Proverbios", num: 20, capitulos: 31 },
  { nombre: "Eclesiastes", num: 21, capitulos: 12 }, { nombre: "Cantares", num: 22, capitulos: 8 },
  { nombre: "Isaias", num: 23, capitulos: 66 }, { nombre: "Jeremias", num: 24, capitulos: 52 },
  { nombre: "Lamentaciones", num: 25, capitulos: 5 }, { nombre: "Ezequiel", num: 26, capitulos: 48 },
  { nombre: "Daniel", num: 27, capitulos: 12 }, { nombre: "Oseas", num: 28, capitulos: 14 },
  { nombre: "Joel", num: 29, capitulos: 3 }, { nombre: "Amos", num: 30, capitulos: 9 },
  { nombre: "Abdias", num: 31, capitulos: 1 }, { nombre: "Jonas", num: 32, capitulos: 4 },
  { nombre: "Miqueas", num: 33, capitulos: 7 }, { nombre: "Nahum", num: 34, capitulos: 3 },
  { nombre: "Habacuc", num: 35, capitulos: 3 }, { nombre: "Sofonias", num: 36, capitulos: 3 },
  { nombre: "Hageo", num: 37, capitulos: 2 }, { nombre: "Zacarias", num: 38, capitulos: 14 },
  { nombre: "Malaquias", num: 39, capitulos: 4 },
  { nombre: "Mateo", num: 40, capitulos: 28 }, { nombre: "Marcos", num: 41, capitulos: 16 },
  { nombre: "Lucas", num: 42, capitulos: 24 }, { nombre: "Juan", num: 43, capitulos: 21 },
  { nombre: "Hechos", num: 44, capitulos: 28 }, { nombre: "Romanos", num: 45, capitulos: 16 },
  { nombre: "1 Corintios", num: 46, capitulos: 16 }, { nombre: "2 Corintios", num: 47, capitulos: 13 },
  { nombre: "Galatas", num: 48, capitulos: 6 }, { nombre: "Efesios", num: 49, capitulos: 6 },
  { nombre: "Filipenses", num: 50, capitulos: 4 }, { nombre: "Colosenses", num: 51, capitulos: 4 },
  { nombre: "1 Tesalonicenses", num: 52, capitulos: 5 }, { nombre: "2 Tesalonicenses", num: 53, capitulos: 3 },
  { nombre: "1 Timoteo", num: 54, capitulos: 6 }, { nombre: "2 Timoteo", num: 55, capitulos: 4 },
  { nombre: "Tito", num: 56, capitulos: 3 }, { nombre: "Filemon", num: 57, capitulos: 1 },
  { nombre: "Hebreos", num: 58, capitulos: 13 }, { nombre: "Santiago", num: 59, capitulos: 5 },
  { nombre: "1 Pedro", num: 60, capitulos: 5 }, { nombre: "2 Pedro", num: 61, capitulos: 3 },
  { nombre: "1 Juan", num: 62, capitulos: 5 }, { nombre: "2 Juan", num: 63, capitulos: 1 },
  { nombre: "3 Juan", num: 64, capitulos: 1 }, { nombre: "Judas", num: 65, capitulos: 1 },
  { nombre: "Apocalipsis", num: 66, capitulos: 22 },
];

type VersiculoAPI = { pk: number; verse: number; text: string };

function limpiarTexto(texto: string) {
  return texto.replace(/<[^>]+>/g, "");
}

export default function BibliaPage() {
  const [libroNum, setLibroNum] = useState(43); // Juan por defecto
  const [capitulo, setCapitulo] = useState(3);
  const [versiculos, setVersiculos] = useState<VersiculoAPI[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const libroActual = LIBROS.find((l) => l.num === libroNum)!;

  useEffect(() => {
    setCargando(true);
    setError("");
    fetch(`https://bolls.life/get-text/RVR1960/${libroNum}/${capitulo}/`)
      .then((r) => {
        if (!r.ok) throw new Error("No se pudo cargar el capitulo");
        return r.json();
      })
      .then((data: VersiculoAPI[]) => {
        setVersiculos(data);
        setCargando(false);
      })
      .catch(() => {
        setError("No se pudo cargar este capitulo. Intenta de nuevo.");
        setCargando(false);
      });
  }, [libroNum, capitulo]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="La Biblia Cambia Noticias" width={48} height={48} className="w-10 h-10 object-contain" />
            <span className="font-extrabold text-[#063B73] text-lg">LA BIBLIA CAMBIA</span>
          </Link>
          <Link href="/" className="text-sm font-bold text-[#063B73] hover:text-[#C9972B] transition">
            Volver al inicio
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <span className="inline-block bg-[#C9972B] text-[#04223f] text-xs font-extrabold px-3 py-1 rounded uppercase mb-3">
            Reina Valera 1960
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#063B73]">
            Santa Biblia
          </h1>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 mb-6 flex flex-col md:flex-row gap-4">
          <select
            value={libroNum}
            onChange={(e) => {
              setLibroNum(Number(e.target.value));
              setCapitulo(1);
            }}
            className="flex-1 border border-slate-300 rounded-lg px-4 py-3 font-bold text-[#063B73] outline-none"
          >
            {LIBROS.map((l) => (
              <option key={l.num} value={l.num}>{l.nombre}</option>
            ))}
          </select>

          <select
            value={capitulo}
            onChange={(e) => setCapitulo(Number(e.target.value))}
            className="md:w-40 border border-slate-300 rounded-lg px-4 py-3 font-bold text-[#063B73] outline-none"
          >
            {Array.from({ length: libroActual.capitulos }, (_, i) => i + 1).map((c) => (
              <option key={c} value={c}>Capitulo {c}</option>
            ))}
          </select>
        </div>

        <article className="bg-white border border-slate-200 rounded-xl p-6 md:p-10">
          <h2 className="text-2xl font-extrabold text-[#063B73] mb-6 font-serif">
            {libroActual.nombre} {capitulo}
          </h2>

          {cargando && <p className="text-slate-400">Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!cargando && !error && (
            <div className="space-y-3 font-serif text-lg leading-relaxed text-slate-800">
              {versiculos.map((v) => (
                <p key={v.pk}>
                  <sup className="text-[#C9972B] font-bold mr-1">{v.verse}</sup>
                  {limpiarTexto(v.text)}
                </p>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-10 pt-6 border-t border-slate-200">
            <button
              onClick={() => capitulo > 1 && setCapitulo(capitulo - 1)}
              disabled={capitulo <= 1}
              className="px-5 py-2 rounded-lg bg-slate-100 font-bold text-[#063B73] disabled:opacity-30"
            >
              Anterior
            </button>
            <button
              onClick={() => capitulo < libroActual.capitulos && setCapitulo(capitulo + 1)}
              disabled={capitulo >= libroActual.capitulos}
              className="px-5 py-2 rounded-lg bg-[#063B73] font-bold text-white disabled:opacity-30"
            >
              Siguiente
            </button>
          </div>
        </article>

        <p className="text-center text-xs text-slate-400 mt-6">
          Texto: Reina Valera 1960 - Sociedades Biblicas Unidas. Servido via bolls.life
        </p>
      </div>

      <SiteFooter />
    </main>
  );
}
