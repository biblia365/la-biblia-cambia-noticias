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

function extraerPathStorage(url: string | null | undefined, bucket: string): string | null {
  if (!url) return null
  const marker = `/storage/v1/object/public/${bucket}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.substring(idx + marker.length)
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
  const sitio_id = formData.get('sitio_id') as string
  const fuente_url = formData.get('fuente_url') as string
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
    sitio_id: sitio_id || null,
    fuente_url: fuente_url || null,
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
  const sitio_id = formData.get('sitio_id') as string
  const fuente_url = formData.get('fuente_url') as string
  const destacada = formData.get('destacada') === 'on'
  const publicado = formData.get('publicado') === 'on'
  const imagenFile = formData.get('imagen') as File
  const eliminarImagen = formData.get('eliminar_imagen') === 'true'

  const { data: actual } = await supabase.from('noticias').select('imagen').eq('id', id).single()
  const imagenAnterior = actual?.imagen as string | null | undefined

  const datosActualizar: Record<string, unknown> = {
    titulo,
    slug: slugUnico(titulo),
    descripcion,
    contenido,
    categoria_id: categoria_id || null,
    sitio_id: sitio_id || null,
    fuente_url: fuente_url || null,
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

    const pathAnterior = extraerPathStorage(imagenAnterior, 'noticias-imagenes')
    if (pathAnterior) {
      await supabase.storage.from('noticias-imagenes').remove([pathAnterior])
    }
  } else if (eliminarImagen) {
    const pathAnterior = extraerPathStorage(imagenAnterior, 'noticias-imagenes')
    if (pathAnterior) {
      await supabase.storage.from('noticias-imagenes').remove([pathAnterior])
    }
    datosActualizar.imagen = null
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

  const { data: actual } = await supabase.from('noticias').select('imagen').eq('id', id).single()
  const pathImagen = extraerPathStorage(actual?.imagen as string | null | undefined, 'noticias-imagenes')

  const { error } = await supabase.from('noticias').delete().eq('id', id)
  if (error) {
    return { error: 'Error al borrar la noticia: ' + error.message }
  }

  if (pathImagen) {
    await supabase.storage.from('noticias-imagenes').remove([pathImagen])
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

export async function crearVideo(formData: FormData) {
  const supabase = await createClient()
  const titulo = formData.get('titulo') as string
  const url = formData.get('url') as string
  const { error } = await supabase.from('videos').insert({
    titulo,
    url,
  })
  if (error) {
    return { error: 'Error al crear el video: ' + error.message }
  }
  revalidatePath('/admin/videos')
  revalidatePath('/')
  return { success: true }
}

export async function borrarVideo(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('videos').delete().eq('id', id)
  if (error) {
    return { error: 'Error al borrar el video: ' + error.message }
  }
  revalidatePath('/admin/videos')
  revalidatePath('/')
  return { success: true }
}

export async function guardarVersiculo(formData: FormData) {
  const supabase = await createClient()
  const texto = formData.get('texto') as string
  const referencia = formData.get('referencia') as string

  await supabase.from('versiculo_dia').update({ activo: false }).eq('activo', true)

  const { error } = await supabase.from('versiculo_dia').insert({
    texto,
    referencia,
    activo: true,
  })
  if (error) {
    return { error: 'Error al guardar el versiculo: ' + error.message }
  }
  revalidatePath('/admin/versiculo')
  revalidatePath('/')
  return { success: true }
}

export async function crearCancion(formData: FormData) {
  const supabase = await createClient()
  const titulo = formData.get('titulo') as string
  const artista = formData.get('artista') as string
  const audioFile = formData.get('audio') as File
  const portadaFile = formData.get('portada') as File

  if (!audioFile || audioFile.size === 0) {
    return { error: 'Debes seleccionar un archivo de audio' }
  }

  const nombreAudio = `audio/${Date.now()}-${audioFile.name}`
  const { error: audioError } = await supabase.storage
    .from('canciones')
    .upload(nombreAudio, audioFile)
  if (audioError) {
    return { error: 'Error al subir el audio: ' + audioError.message }
  }
  const { data: audioUrlData } = supabase.storage.from('canciones').getPublicUrl(nombreAudio)

  let portadaUrl = ''
  if (portadaFile && portadaFile.size > 0) {
    const nombrePortada = `portadas/${Date.now()}-${portadaFile.name}`
    const { error: portadaError } = await supabase.storage
      .from('canciones')
      .upload(nombrePortada, portadaFile)
    if (portadaError) {
      return { error: 'Error al subir la portada: ' + portadaError.message }
    }
    const { data: portadaUrlData } = supabase.storage.from('canciones').getPublicUrl(nombrePortada)
    portadaUrl = portadaUrlData.publicUrl
  }

  const { error } = await supabase.from('canciones').insert({
    titulo,
    artista: artista || null,
    url: audioUrlData.publicUrl,
    portada: portadaUrl || null,
  })
  if (error) {
    return { error: 'Error al crear la cancion: ' + error.message }
  }
  revalidatePath('/admin/musica')
  revalidatePath('/')
  return { success: true }
}

export async function borrarCancion(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('canciones').delete().eq('id', id)
  if (error) {
    return { error: 'Error al borrar la cancion: ' + error.message }
  }
  revalidatePath('/admin/musica')
  revalidatePath('/')
  return { success: true }
}

export async function guardarAviso(formData: FormData) {
  const supabase = await createClient()
  const texto = formData.get('texto') as string
  const activo = formData.get('activo') === 'on'

  const { error } = await supabase.from('aviso_urgente').insert({
    texto,
    activo,
  })
  if (error) {
    return { error: 'Error al guardar el aviso: ' + error.message }
  }
  revalidatePath('/admin/aviso')
  revalidatePath('/')
  return { success: true }
}

export async function crearAnuncio(formData: FormData) {
  const supabase = await createClient()
  const titulo = formData.get('titulo') as string
  const descripcion = formData.get('descripcion') as string
  const link = formData.get('link') as string
  const texto_boton = (formData.get('texto_boton') as string) || 'Ver mas'
  const ubicacion = formData.get('ubicacion') as string
  const activo = formData.get('activo') === 'on'
  const imagenFile = formData.get('imagen') as File

  if (!imagenFile || imagenFile.size === 0) {
    return { error: 'Debes seleccionar una imagen' }
  }

  const nombreArchivo = `${Date.now()}-${imagenFile.name}`
  const { error: uploadError } = await supabase.storage
    .from('anuncios')
    .upload(nombreArchivo, imagenFile)
  if (uploadError) {
    return { error: 'Error al subir la imagen: ' + uploadError.message }
  }
  const { data: publicUrlData } = supabase.storage.from('anuncios').getPublicUrl(nombreArchivo)

  const { error } = await supabase.from('anuncios').insert({
    titulo,
    descripcion: descripcion || null,
    imagen: publicUrlData.publicUrl,
    link,
    texto_boton,
    ubicacion,
    activo,
  })
  if (error) {
    return { error: 'Error al crear el anuncio: ' + error.message }
  }
  revalidatePath('/admin/anuncios')
  revalidatePath('/')
  return { success: true }
}

export async function actualizarAnuncio(id: string, formData: FormData) {
  const supabase = await createClient()
  const titulo = formData.get('titulo') as string
  const descripcion = formData.get('descripcion') as string
  const link = formData.get('link') as string
  const texto_boton = (formData.get('texto_boton') as string) || 'Ver mas'
  const ubicacion = formData.get('ubicacion') as string
  const activo = formData.get('activo') === 'on'
  const imagenFile = formData.get('imagen') as File

  const datosActualizar: Record<string, unknown> = {
    titulo,
    descripcion: descripcion || null,
    link,
    texto_boton,
    ubicacion,
    activo,
  }

  if (imagenFile && imagenFile.size > 0) {
    const { data: actual } = await supabase.from('anuncios').select('imagen').eq('id', id).single()
    const nombreArchivo = `${Date.now()}-${imagenFile.name}`
    const { error: uploadError } = await supabase.storage
      .from('anuncios')
      .upload(nombreArchivo, imagenFile)
    if (uploadError) {
      return { error: 'Error al subir la imagen: ' + uploadError.message }
    }
    const { data: publicUrlData } = supabase.storage.from('anuncios').getPublicUrl(nombreArchivo)
    datosActualizar.imagen = publicUrlData.publicUrl

    const pathAnterior = extraerPathStorage(actual?.imagen as string | null | undefined, 'anuncios')
    if (pathAnterior) {
      await supabase.storage.from('anuncios').remove([pathAnterior])
    }
  }

  const { error } = await supabase.from('anuncios').update(datosActualizar).eq('id', id)
  if (error) {
    return { error: 'Error al actualizar el anuncio: ' + error.message }
  }
  revalidatePath('/admin/anuncios')
  revalidatePath('/')
  return { success: true }
}

export async function borrarAnuncio(id: string) {
  const supabase = await createClient()
  const { data: actual } = await supabase.from('anuncios').select('imagen').eq('id', id).single()
  const pathImagen = extraerPathStorage(actual?.imagen as string | null | undefined, 'anuncios')

  const { error } = await supabase.from('anuncios').delete().eq('id', id)
  if (error) {
    return { error: 'Error al borrar el anuncio: ' + error.message }
  }
  if (pathImagen) {
    await supabase.storage.from('anuncios').remove([pathImagen])
  }
  revalidatePath('/admin/anuncios')
  revalidatePath('/')
  return { success: true }
}
export async function suscribirseNewsletter(formData: FormData) {
  const supabase = await createClient()
  const email = (formData.get('email') as string || '').trim().toLowerCase()

  if (!email || !email.includes('@')) {
    return { error: 'Ingresa un correo valido' }
  }

  const { error } = await supabase.from('suscriptores').insert({ email })

  if (error) {
    if (error.code === '23505') {
      return { error: 'Este correo ya esta suscrito' }
    }
    return { error: 'No se pudo suscribir. Intenta de nuevo.' }
  }

  return { success: true }
}

export async function borrarSuscriptor(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('suscriptores').delete().eq('id', id)
  if (error) {
    return { error: 'Error al borrar: ' + error.message }
  }
  revalidatePath('/admin/suscriptores')
  return { success: true }
}
export async function guardarRedSocial(formData: FormData) {
  const supabase = await createClient()
  const plataforma = formData.get('plataforma') as string
  const url = formData.get('url') as string
  const activo = formData.get('activo') === 'on'

  const { error } = await supabase
    .from('redes_sociales')
    .upsert({ plataforma, url, activo }, { onConflict: 'plataforma' })

  if (error) {
    return { error: 'Error al guardar: ' + error.message }
  }
  revalidatePath('/admin/redes')
  revalidatePath('/')
  return { success: true }
}
export async function crearSitio(formData: FormData) {
  const supabase = await createClient()
  const nombre = formData.get('nombre') as string
  const dominio = formData.get('dominio') as string
  const logo_url = formData.get('logo_url') as string
  const color_primario = (formData.get('color_primario') as string) || '#063B73'
  const color_acento = (formData.get('color_acento') as string) || '#C9972B'
  const activo = formData.get('activo') === 'on'

  const { error } = await supabase.from('sitios').insert({
    nombre,
    slug: slugify(nombre),
    dominio: dominio || null,
    logo_url: logo_url || null,
    color_primario,
    color_acento,
    activo,
  })
  if (error) {
    return { error: 'Error al crear el sitio: ' + error.message }
  }
  revalidatePath('/admin/sitios')
  return { success: true }
}

export async function actualizarSitio(id: string, formData: FormData) {
  const supabase = await createClient()
  const nombre = formData.get('nombre') as string
  const dominio = formData.get('dominio') as string
  const logo_url = formData.get('logo_url') as string
  const color_primario = (formData.get('color_primario') as string) || '#063B73'
  const color_acento = (formData.get('color_acento') as string) || '#C9972B'
  const activo = formData.get('activo') === 'on'

  const { error } = await supabase.from('sitios').update({
    nombre,
    dominio: dominio || null,
    logo_url: logo_url || null,
    color_primario,
    color_acento,
    activo,
  }).eq('id', id)
  if (error) {
    return { error: 'Error al actualizar el sitio: ' + error.message }
  }
  revalidatePath('/admin/sitios')
  return { success: true }
}
export async function suscribirseNewsletterSitio(formData: FormData) {
  const supabase = await createClient()
  const email = (formData.get('email') as string || '').trim().toLowerCase()
  const sitio_id = formData.get('sitio_id') as string

  if (!email || !email.includes('@')) {
    return { error: 'Ingresa un correo valido' }
  }

  const { error } = await supabase.from('suscriptores').insert({ email, sitio_id: sitio_id || null })

  if (error) {
    if (error.code === '23505') {
      return { error: 'Este correo ya esta suscrito' }
    }
    return { error: 'No se pudo suscribir. Intenta de nuevo.' }
  }

  return { success: true }
}