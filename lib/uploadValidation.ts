export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"] as const
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

export function validateImageUpload(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return "Only JPG, PNG, and WEBP images are allowed"
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return "File too large. Maximum 5MB allowed."
  }
  return null
}
