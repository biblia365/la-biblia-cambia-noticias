'use client'

type Suscriptor = { id: string; email: string; created_at: string }

export default function ExportarCsvBoton({ suscriptores }: { suscriptores: Suscriptor[] }) {
  function exportar() {
    const filas = [
      ['Correo', 'Fecha de suscripcion'],
      ...suscriptores.map((s) => [s.email, new Date(s.created_at).toLocaleDateString('es-CO')]),
    ]
    const csv = filas.map((f) => f.map((c) => `"${c}"`).join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `suscriptores-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={exportar}
      style={{ padding: '9px 18px', background: '#1A1D29', color: '#fff', borderRadius: 4, fontSize: 14, border: 'none', cursor: 'pointer' }}
    >
      Descargar CSV
    </button>
  )
}