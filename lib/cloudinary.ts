import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true
})

export interface UploadResult {
  url: string
  publicId: string
  width: number
  height: number
}

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  mimeType: string,
  folder: string = 'aaru/products'
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const base64 = `data:${mimeType};base64,${fileBuffer.toString('base64')}`
    cloudinary.uploader.upload(
      base64,
      {
        folder,
        quality: 'auto:good',
        fetch_format: 'auto',
        width: 1200,
        crop: 'limit',
        resource_type: 'image'
      },
      (error, result) => {
        if (error || !result) {
          console.error('Cloudinary upload error:', error)
          reject(new Error(error?.message || 'Upload failed'))
          return
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height
        })
      }
    )
  })
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
    console.log('Deleted from Cloudinary:', publicId)
  } catch (error) {
    console.error('Cloudinary delete error:', error)
  }
}

export { cloudinary }
