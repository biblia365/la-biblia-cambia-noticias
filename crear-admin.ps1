# ============================================================
# Script: crear-admin.ps1
# Crea el panel de administrador completo (login, CRUD de
# noticias con imagenes, gestion de categorias) en tu proyecto
# Next.js + Supabase.
#
# IMPORTANTE: ejecuta este script parado en la carpeta RAIZ
# de tu proyecto (donde esta package.json), por ejemplo:
#   cd C:\Users\nanda\la-biblia-cambia-noticias
#   .\crear-admin.ps1
# ============================================================

$ErrorActionPreference = "Stop"

if (-not (Test-Path ".\package.json")) {
    Write-Host "ERROR: no encuentro package.json en esta carpeta." -ForegroundColor Red
    Write-Host "Ejecuta este script parado en la raiz de tu proyecto Next.js." -ForegroundColor Red
    exit 1
}

Write-Host "Creando carpetas..." -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path ".\lib\supabase" | Out-Null
New-Item -ItemType Directory -Force -Path ".\app\admin\login" | Out-Null
New-Item -ItemType Directory -Force -Path ".\app\admin\noticias\nueva" | Out-Null
New-Item -ItemType Directory -Force -Path ".\app\admin\categorias" | Out-Null
New-Item -ItemType Directory -Force -Path ".\app\admin\noticias\[id]" | Out-Null

Write-Host "Creando lib/supabase/client.ts..." -ForegroundColor Cyan
Set-Content -Encoding utf8 -Path ".\lib\supabase\client.ts" -Value @'
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
'@

Write-Host "Creando lib/supabase/server.ts..." -ForegroundColor Cyan
Set-Content -Encoding utf8 -Path ".\lib\supabase\server.ts" -Value @'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Se puede ignorar si el middleware ya refresca la sesion
          }
        },
      },
    }
  )
}
'@

Write-Host "Creando middleware.ts..." -ForegroundColor Cyan
Set-Content -Encoding utf8 -Path ".\middleware.ts" -Value @'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname === '/admin/login'

  if (isAdminRoute && !isLoginRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  if (isLoginRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
'@

Write-Host "Creando app/admin/login/page.tsx..." -ForegroundColor Cyan
Set-Content -Encoding utf8 -Path ".\app\admin\login\page.tsx" -Value @'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Correo o contrasena incorrectos')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <h1>Panel de administracion</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Correo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Contrasena</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
'@

Write-Host "Creando app/admin/logout-button.tsx..." -ForegroundColor Cyan
Set-Content -Encoding utf8 -Path ".\app\admin\logout-button.tsx" -Value @'
'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return <button onClick={handleLogout}>Cerrar sesion</button>
}
'@

Write-Host "Creando app/admin/layout.tsx..." -ForegroundColor Cyan
Set-Content -Encoding utf8 -Path ".\app\admin\layout.tsx" -Value @'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './logout-button'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <>{children}</>
  }

  return (
    <div>
      <nav style={{ display: 'flex', gap: 16, padding: 16, borderBottom: '1px solid #ddd', alignItems: 'center' }}>
        <Link href="/admin">Noticias</Link>
        <Link href="/admin/categorias">Categorias</Link>
        <span style={{ marginLeft: 'auto' }}>{user.email}</span>
        <LogoutButton />
      </nav>
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  )
}
'@

Write-Host "Creando app/admin/actions.ts..." -ForegroundColor Cyan
Set-Content -Encoding utf8 -Path ".\app\admin\actions.ts" -Value @'
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function slugUnico(titulo: string) {
  const sufijo = Math.random().toString(36).slice(2, 8)
  return `${slugify(titulo)}-${sufijo}`
}

export async function crearNoticia(formData: FormData) {
  const supabase = await createClient()

  const titulo = formData.get('titulo') as string
  const descripcion = formData.get('descripcion') as string
  const contenido = formData.get('contenido') as string
  const categoria_id = formData.get('categoria_id') as string
  const destacada = formData.get('destacada') === 'on'
  const publicado = formData.get('publicado') === 'on'
  const imagenFile = formData.get('imagen') as File

  let imagenUrl = ''

  if (imagenFile && imagenFile.size > 0) {
    const nombreArchivo = `${Date.now()}-${imagenFile.name}`
    const { error: uploadError } = await supabase.storage
      .from('noticias-imagenes')
      .upload(nombreArchivo, imagenFile)

    if (uploadError) {
      return { error: 'Error al subir la imagen: ' + uploadError.message }
    }

    const { data: publicUrlData } = supabase.storage
      .from('noticias-imagenes')
      .getPublicUrl(nombreArchivo)

    imagenUrl = publicUrlData.publicUrl
  }

  const { error } = await supabase.from('noticias').insert({
    titulo,
    slug: slugUnico(titulo),
    descripcion,
    contenido,
    categoria_id: categoria_id || null,
    destacada,
    publicado,
    imagen: imagenUrl,
  })

  if (error) {
    return { error: 'Error al crear la noticia: ' + error.message }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function actualizarNoticia(id: string, formData: FormData) {
  const supabase = await createClient()

  const titulo = formData.get('titulo') as string
  const descripcion = formData.get('descripcion') as string
  const contenido = formData.get('contenido') as string
  const categoria_id = formData.get('categoria_id') as string
  const destacada = formData.get('destacada') === 'on'
  const publicado = formData.get('publicado') === 'on'
  const imagenFile = formData.get('imagen') as File

  const datosActualizar: Record<string, unknown> = {
    titulo,
    slug: slugUnico(titulo),
    descripcion,
    contenido,
    categoria_id: categoria_id || null,
    destacada,
    publicado,
  }

  if (imagenFile && imagenFile.size > 0) {
    const nombreArchivo = `${Date.now()}-${imagenFile.name}`
    const { error: uploadError } = await supabase.storage
      .from('noticias-imagenes')
      .upload(nombreArchivo, imagenFile)

    if (uploadError) {
      return { error: 'Error al subir la imagen: ' + uploadError.message }
    }

    const { data: publicUrlData } = supabase.storage
      .from('noticias-imagenes')
      .getPublicUrl(nombreArchivo)

    datosActualizar.imagen = publicUrlData.publicUrl
  }

  const { error } = await supabase.from('noticias').update(datosActualizar).eq('id', id)

  if (error) {
    return { error: 'Error al actualizar la noticia: ' + error.message }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function borrarNoticia(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('noticias').delete().eq('id', id)

  if (error) {
    return { error: 'Error al borrar la noticia: ' + error.message }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function crearCategoria(formData: FormData) {
  const supabase = await createClient()
  const nombre = formData.get('nombre') as string

  const { error } = await supabase.from('categorias').insert({
    nombre,
    slug: slugify(nombre),
  })

  if (error) {
    return { error: 'Error al crear la categoria: ' + error.message }
  }

  revalidatePath('/admin/categorias')
  return { success: true }
}

export async function borrarCategoria(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('categorias').delete().eq('id', id)

  if (error) {
    return { error: 'Error al borrar la categoria: ' + error.message }
  }

  revalidatePath('/admin/categorias')
  return { success: true }
}
'@

Write-Host "Creando app/admin/borrar-noticia-boton.tsx..." -ForegroundColor Cyan
Set-Content -Encoding utf8 -Path ".\app\admin\borrar-noticia-boton.tsx" -Value @'
'use client'

import { borrarNoticia } from './actions'
import { useRouter } from 'next/navigation'

export default function BorrarNoticiaBoton({ id }: { id: string }) {
  const router = useRouter()

  async function handleClick() {
    if (!confirm('Borrar esta noticia?')) return
    await borrarNoticia(id)
    router.refresh()
  }

  return (
    <button onClick={handleClick} style={{ color: 'red' }}>
      Borrar
    </button>
  )
}
'@

Write-Host "Creando app/admin/page.tsx..." -ForegroundColor Cyan
Set-Content -Encoding utf8 -Path ".\app\admin\page.tsx" -Value @'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BorrarNoticiaBoton from './borrar-noticia-boton'

export default async function AdminNoticiasPage() {
  const supabase = await createClient()
  const { data: noticias } = await supabase
    .from('noticias')
    .select('id, titulo, publicado, destacada, created_at, categorias(nombre)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Noticias</h1>
        <Link href="/admin/noticias/nueva" style={{ padding: '8px 16px', background: '#111', color: '#fff' }}>
          + Nueva noticia
        </Link>
      </div>

      <table style={{ width: '100%', marginTop: 24, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: 8 }}>Titulo</th>
            <th style={{ padding: 8 }}>Categoria</th>
            <th style={{ padding: 8 }}>Publicado</th>
            <th style={{ padding: 8 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {noticias?.map((n: any) => (
            <tr key={n.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8 }}>{n.titulo}</td>
              <td style={{ padding: 8 }}>{n.categorias?.nombre || '-'}</td>
              <td style={{ padding: 8 }}>{n.publicado ? 'Si' : 'No'}</td>
              <td style={{ padding: 8, display: 'flex', gap: 8 }}>
                <Link href={`/admin/noticias/${n.id}`}>Editar</Link>
                <BorrarNoticiaBoton id={n.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
'@

Write-Host "Creando app/admin/noticias/noticia-form.tsx..." -ForegroundColor Cyan
Set-Content -Encoding utf8 -Path ".\app\admin\noticias\noticia-form.tsx" -Value @'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { crearNoticia, actualizarNoticia } from '../actions'

type Categoria = { id: string; nombre: string }
type Noticia = {
  id: string
  titulo: string
  descripcion: string | null
  contenido: string | null
  categoria_id: string | null
  destacada: boolean
  publicado: boolean
  imagen: string | null
}

export default function NoticiaForm({
  categorias,
  noticia,
}: {
  categorias: Categoria[]
  noticia?: Noticia
}) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')

    const resultado = noticia
      ? await actualizarNoticia(noticia.id, formData)
      : await crearNoticia(formData)

    setLoading(false)

    if (resultado?.error) {
      setError(resultado.error)
      return
    }

    router.push('/admin')
  }

  return (
    <form action={handleSubmit} style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 12 }}>
        <label>Titulo</label>
        <input name="titulo" defaultValue={noticia?.titulo} required style={{ width: '100%', padding: 8 }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Descripcion corta</label>
        <textarea name="descripcion" defaultValue={noticia?.descripcion ?? ''} rows={2} style={{ width: '100%', padding: 8 }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Contenido</label>
        <textarea name="contenido" defaultValue={noticia?.contenido ?? ''} rows={8} style={{ width: '100%', padding: 8 }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Categoria</label>
        <select name="categoria_id" defaultValue={noticia?.categoria_id ?? ''} style={{ width: '100%', padding: 8 }}>
          <option value="">- Sin categoria -</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Imagen {noticia?.imagen && '(dejar vacio para conservar la actual)'}</label>
        <input type="file" name="imagen" accept="image/*" style={{ width: '100%' }} />
        {noticia?.imagen && (
          <img src={noticia.imagen} alt="" style={{ maxWidth: 200, marginTop: 8 }} />
        )}
      </div>

      <div style={{ marginBottom: 12, display: 'flex', gap: 16 }}>
        <label>
          <input type="checkbox" name="destacada" defaultChecked={noticia?.destacada} /> Destacada
        </label>
        <label>
          <input type="checkbox" name="publicado" defaultChecked={noticia?.publicado ?? true} /> Publicado
        </label>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}
'@

Write-Host "Creando app/admin/noticias/nueva/page.tsx..." -ForegroundColor Cyan
Set-Content -Encoding utf8 -Path ".\app\admin\noticias\nueva\page.tsx" -Value @'
import { createClient } from '@/lib/supabase/server'
import NoticiaForm from '../noticia-form'

export default async function NuevaNoticiaPage() {
  const supabase = await createClient()
  const { data: categorias } = await supabase.from('categorias').select('id, nombre').order('nombre')

  return (
    <div>
      <h1>Nueva noticia</h1>
      <NoticiaForm categorias={categorias || []} />
    </div>
  )
}
'@

Write-Host "Creando app/admin/noticias/[id]/page.tsx..." -ForegroundColor Cyan
Set-Content -Encoding utf8 -LiteralPath ".\app\admin\noticias\[id]\page.tsx" -Value @'
import { createClient } from '@/lib/supabase/server'
import NoticiaForm from '../noticia-form'
import { notFound } from 'next/navigation'

export default async function EditarNoticiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: noticia }, { data: categorias }] = await Promise.all([
    supabase.from('noticias').select('*').eq('id', id).single(),
    supabase.from('categorias').select('id, nombre').order('nombre'),
  ])

  if (!noticia) notFound()

  return (
    <div>
      <h1>Editar noticia</h1>
      <NoticiaForm categorias={categorias || []} noticia={noticia} />
    </div>
  )
}
'@

Write-Host "Creando app/admin/categorias/categoria-form.tsx..." -ForegroundColor Cyan
Set-Content -Encoding utf8 -Path ".\app\admin\categorias\categoria-form.tsx" -Value @'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { crearCategoria } from '../actions'

export default function CategoriaForm() {
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setError('')
    const resultado = await crearCategoria(formData)
    if (resultado?.error) {
      setError(resultado.error)
      return
    }
    router.refresh()
  }

  return (
    <form action={handleSubmit} style={{ display: 'flex', gap: 8 }}>
      <input name="nombre" placeholder="Nombre de la categoria" required style={{ padding: 8 }} />
      <button type="submit" style={{ padding: '8px 16px' }}>Agregar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
'@

Write-Host "Creando app/admin/categorias/borrar-categoria-boton.tsx..." -ForegroundColor Cyan
Set-Content -Encoding utf8 -Path ".\app\admin\categorias\borrar-categoria-boton.tsx" -Value @'
'use client'

import { borrarCategoria } from '../actions'
import { useRouter } from 'next/navigation'

export default function BorrarCategoriaBoton({ id }: { id: string }) {
  const router = useRouter()

  async function handleClick() {
    if (!confirm('Borrar esta categoria?')) return
    await borrarCategoria(id)
    router.refresh()
  }

  return (
    <button onClick={handleClick} style={{ color: 'red' }}>
      Borrar
    </button>
  )
}
'@

Write-Host "Creando app/admin/categorias/page.tsx..." -ForegroundColor Cyan
Set-Content -Encoding utf8 -Path ".\app\admin\categorias\page.tsx" -Value @'
import { createClient } from '@/lib/supabase/server'
import CategoriaForm from './categoria-form'
import BorrarCategoriaBoton from './borrar-categoria-boton'

export default async function CategoriasPage() {
  const supabase = await createClient()
  const { data: categorias } = await supabase.from('categorias').select('*').order('nombre')

  return (
    <div>
      <h1>Categorias</h1>
      <CategoriaForm />
      <ul style={{ marginTop: 24 }}>
        {categorias?.map((c: { id: string; nombre: string }) => (
          <li key={c.id} style={{ display: 'flex', gap: 12, padding: 8, borderBottom: '1px solid #eee', alignItems: 'center' }}>
            <span>{c.nombre}</span>
            <BorrarCategoriaBoton id={c.id} />
          </li>
        ))}
      </ul>
    </div>
  )
}
'@

Write-Host ""
Write-Host "Listo. Se crearon todos los archivos del panel de administrador." -ForegroundColor Green
Write-Host ""
Write-Host "Verificando que las variables de entorno existan en .env.local..." -ForegroundColor Cyan

if (Test-Path ".\.env.local") {
    $envContent = Get-Content ".\.env.local" -Raw
    if ($envContent -notmatch "NEXT_PUBLIC_SUPABASE_URL") {
        Write-Host "AVISO: no encontre NEXT_PUBLIC_SUPABASE_URL en .env.local. Revisa que exista." -ForegroundColor Yellow
    }
    if ($envContent -notmatch "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
        Write-Host "AVISO: no encontre NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local. Revisa que exista." -ForegroundColor Yellow
    }
} else {
    Write-Host "AVISO: no existe .env.local en esta carpeta. El login no va a funcionar sin las variables de Supabase." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Siguiente paso:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "  Abre http://localhost:3000/admin/login" -ForegroundColor White
Write-Host ""
