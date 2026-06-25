/** Build a stable cache key from filter/query params (server + client). */
export function buildProductsCacheKey(params: Record<string, unknown>): string {
  const normalized: Record<string, unknown> = {}
  Object.keys(params)
    .sort()
    .forEach((key) => {
      const val = params[key]
      if (val === undefined || val === null || val === "") return
      if (Array.isArray(val)) {
        normalized[key] = [...val].sort()
      } else {
        normalized[key] = val
      }
    })
  return JSON.stringify(normalized)
}

export function parseSearchParamsToFilters(searchParams: URLSearchParams): Record<string, string | boolean> {
  const filters: Record<string, string | boolean> = {}
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const sort = searchParams.get("sort")
  if (category) filters.category = category
  if (search) filters.search = search
  if (sort) filters.sort = sort
  if (searchParams.get("readyToShip") === "true") filters.readyToShip = true
  if (searchParams.get("sale") === "true") filters.sale = true
  return filters
}
