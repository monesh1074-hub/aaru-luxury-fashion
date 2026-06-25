import { useState, useEffect } from "react"
import axios from "axios"

interface Category {
  id: string
  name: string
  slug: string
}

let memoryCategories: Category[] | null = null
let memoryExpiresAt = 0
const TTL = 30 * 60 * 1000

function readCachedCategories(): Category[] | null {
  if (memoryCategories && memoryExpiresAt > Date.now()) {
    return memoryCategories
  }
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem("aaru_categories")
    if (!raw) return null
    const entry = JSON.parse(raw) as { data: Category[]; expiresAt: number }
    if (entry.expiresAt > Date.now()) {
      memoryCategories = entry.data
      memoryExpiresAt = entry.expiresAt
      return entry.data
    }
  } catch {
    // ignore
  }
  return null
}

function isCategoriesCacheFresh(): boolean {
  return Boolean(memoryCategories && memoryExpiresAt > Date.now())
}

function writeCachedCategories(data: Category[]) {
  memoryCategories = data
  memoryExpiresAt = Date.now() + TTL
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(
      "aaru_categories",
      JSON.stringify({ data, expiresAt: memoryExpiresAt })
    )
  } catch {
    // ignore
  }
}

export function useCategories() {
  const cached = readCachedCategories()
  const [categories, setCategories] = useState<Category[]>(cached || [])
  const [loading, setLoading] = useState(!cached)

  useEffect(() => {
    const hit = readCachedCategories()
    if (hit) {
      setCategories(hit)
      setLoading(false)
    }

    if (isCategoriesCacheFresh()) return

    axios
      .get("/api/categories")
      .then((res) => {
        const list = res.data.categories || []
        setCategories(list)
        writeCachedCategories(list)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { categories, loading }
}
