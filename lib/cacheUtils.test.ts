import { describe, it, expect } from "vitest"
import { buildProductsCacheKey, parseSearchParamsToFilters } from "./cacheUtils"

describe("buildProductsCacheKey", () => {
  it("normalizes and sorts keys", () => {
    const keyA = buildProductsCacheKey({ sort: "new", category: "sarees" })
    const keyB = buildProductsCacheKey({ category: "sarees", sort: "new" })
    expect(keyA).toBe(keyB)
  })

  it("omits empty values", () => {
    const key = buildProductsCacheKey({ category: "", search: undefined, sort: "price" })
    expect(key).toBe('{"sort":"price"}')
  })
})

describe("parseSearchParamsToFilters", () => {
  it("parses boolean filters", () => {
    const params = new URLSearchParams("category=sarees&readyToShip=true&sale=true")
    expect(parseSearchParamsToFilters(params)).toEqual({
      category: "sarees",
      readyToShip: true,
      sale: true,
    })
  })
})
