'use client'
import { useState, useCallback, useRef } from 'react'

export interface UploadedImage {
  url: string
  publicId: string
  uploading?: boolean
  error?: boolean
  localPreview?: string
}

interface ImageUploaderProps {
  images: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  maxImages?: number
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 10
}: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadSingleFile = async (file: File): Promise<UploadedImage> => {
    // Validate
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(`${file.name}: File too large (max 5MB)`)
    }
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      throw new Error(`${file.name}: Invalid file type (JPG/PNG/WEBP only)`)
    }

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Upload failed')
    }

    const data = await res.json()
    if (!data.success) throw new Error(data.message || 'Upload failed')

    return { url: data.url, publicId: data.publicId }
  }

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const remaining = maxImages - images.filter(i => !i.uploading).length

    if (remaining <= 0) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    const toProcess = fileArray.slice(0, remaining)

    // Create local previews immediately
    const withPreviews: UploadedImage[] = toProcess.map(f => ({
      url: URL.createObjectURL(f),
      publicId: '',
      uploading: true,
      localPreview: URL.createObjectURL(f)
    }))

    const currentImages = images.filter(i => !i.uploading)
    onChange([...currentImages, ...withPreviews])

    // Upload each file
    const results: UploadedImage[] = []
    for (let i = 0; i < toProcess.length; i++) {
      try {
        const uploaded = await uploadSingleFile(toProcess[i])
        results.push({ ...uploaded, uploading: false })
        console.log(`✅ Uploaded: ${uploaded.url}`)
      } catch (err) {
        console.error(`❌ Upload failed for ${toProcess[i].name}:`, err)
        alert(err instanceof Error ? err.message : 'Upload failed')
        results.push({ url: '', publicId: '', uploading: false, error: true })
      }
    }

    // Replace placeholders with real uploaded images
    const successfulUploads = results.filter(r => r.url && !r.error)
    onChange([...currentImages, ...successfulUploads])

  }, [images, maxImages, onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }, [processFiles])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
    // Reset input so same file can be re-uploaded
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    onChange(updated)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updated = [...images]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    onChange(updated)
  }

  const validImages = images.filter(img => img.url && !img.error)

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
          transition-all duration-200 select-none
          ${dragging
            ? 'border-yellow-500 bg-yellow-50 scale-[1.02]'
            : 'border-gray-300 hover:border-yellow-400 hover:bg-yellow-50/50'
          }
        `}
      >
        <div className="text-5xl mb-4">📸</div>
        <p className="text-gray-800 font-semibold text-lg">
          Drag & drop product photos here
        </p>
        <p className="text-gray-500 text-sm mt-2">
          or <span className="text-yellow-600 font-medium underline">click to browse files</span>
        </p>
        <div className="mt-4 flex justify-center gap-4 text-xs text-gray-400">
          <span>✅ JPG, PNG, WEBP</span>
          <span>✅ Max 5MB each</span>
          <span>✅ Up to {maxImages} photos</span>
        </div>
        {validImages.length === 0 && (
          <p className="mt-3 text-xs text-yellow-600 font-medium">
            ⭐ First photo uploaded becomes the main product photo
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {/* Image Previews */}
      {validImages.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-2 font-medium">
            {validImages.length} photo{validImages.length > 1 ? 's' : ''} uploaded
            <span className="text-gray-400 ml-2 font-normal">
              (first photo = main product image)
            </span>
          </p>
          <div className="grid grid-cols-5 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative group aspect-square">
                {img.uploading ? (
                  <div className="w-full h-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-3 border-yellow-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-xs text-gray-500">Uploading...</span>
                  </div>
                ) : img.error ? (
                  <div className="w-full h-full bg-red-50 rounded-lg border border-red-200 flex items-center justify-center">
                    <span className="text-xs text-red-500">Failed</span>
                  </div>
                ) : (
                  <>
                    <img
                      src={img.url}
                      alt={`Product photo ${idx + 1}`}
                      className="w-full h-full object-cover rounded-lg border-2 border-gray-200 group-hover:border-yellow-400 transition-all"
                    />
                    {/* Main photo badge */}
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        Main
                      </span>
                    )}
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(idx) }}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 text-xs hidden group-hover:flex items-center justify-center transition-colors shadow"
                    >
                      ✕
                    </button>
                    {/* Move left */}
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); moveImage(idx, idx - 1) }}
                        className="absolute bottom-1 left-1 bg-black/60 text-white rounded w-5 h-5 text-xs hidden group-hover:flex items-center justify-center"
                        title="Move left"
                      >
                        ←
                      </button>
                    )}
                    {/* Move right */}
                    {idx < images.length - 1 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); moveImage(idx, idx + 1) }}
                        className="absolute bottom-1 right-1 bg-black/60 text-white rounded w-5 h-5 text-xs hidden group-hover:flex items-center justify-center"
                        title="Move right"
                      >
                        →
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}

            {/* Add more button */}
            {validImages.length < maxImages && (
              <div
                onClick={() => inputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-yellow-400 hover:bg-yellow-50 transition-all"
              >
                <span className="text-2xl text-gray-400">+</span>
                <span className="text-xs text-gray-400 mt-1">Add more</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
