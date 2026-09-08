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
