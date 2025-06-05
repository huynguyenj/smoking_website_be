import { createClient } from '@supabase/supabase-js'
import { env } from '@/config/environment'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient(env.SUPABASE_PROJECT_URL, env.SUPABASE_ANON_API_KEY)

const uploadFile = async (files, folderName, user_id) => {
  let listURL = []
  for (const file of files) {
    const fileExt = path.extname(file.originalname)
    const fileName = `${folderName}/${user_id}/${Date.now()}-${uuidv4()}${fileExt}`
    const { error } = await supabase.storage.from(env.SUPABASE_BUCKET_NAME).upload(fileName, file.buffer, {
      contentType: file.mimetype
    })
    if (error) {
      throw new Error('Image upload failed: ' + error.message)
    }

    const image = supabase.storage.from(env.SUPABASE_BUCKET_NAME).getPublicUrl(fileName)
    listURL.push(image.data.publicUrl)
  }
  return listURL
}

const deleteFile = async (removeFile) => {
  await supabase.storage.from(env.SUPABASE_BUCKET_NAME).remove(removeFile)
}

export const supabaseMethod = {
  uploadFile,
  deleteFile
}

// 1748778142343-c9d07491-0526-4ae8-a3c0-b47d3a517fcd.png
// 1748778142343-c9d07491-0526-4ae8-a3c0-b47d3a517fcd.png
