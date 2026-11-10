export interface Subcategory {
  id: string
  name: string
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  image: string
  subcategories: Subcategory[]
}

/** Units a product can be ordered in. */
export type UnitCode = "kg" | "case" | "box" | "package" | "piece" | "bottle"

/**
 * - `fixed`: price per selling unit is known up front.
 * - `catch-weight`: ordered per piece/case, invoiced on actual weight.
 *   The cart shows an estimate from `nominalWeightKg × pricePerKg`.
 */
export type PricingMode = "fixed" | "catch-weight"

export interface SellingUnit {
  code: UnitCode
  /** Short label, e.g. "Case" */
  label: string
  /** What the unit contains, e.g. "6 × 1 kg vacuum packs" */
  contents: string
  pricing: PricingMode
  /** Price per unit for `fixed` pricing. */
  price?: number
  /** Price per kg for `catch-weight` pricing. */
  pricePerKg?: number
  /** Expected weight of one unit for `catch-weight` pricing. */
  nominalWeightKg?: number
  minQty: number
  step: number
  /** How many stock units (the product's first unit) one of these contains. */
  stockUnits?: number
}

export type StorageType = "frozen" | "chilled" | "ambient"

export interface Product {
  id: string
  sku: string
  slug: string
  name: string
  categoryId: string
  subcategoryId: string
  brand?: string
  shortDescription: string
  description: string
  image: string
  storage: StorageType
  origin?: string
  units: SellingUnit[]
  /** Stock on hand, expressed in the product's first selling unit. */
  stock: number
  reorderPoint: number
  tags: string[]
  featured?: boolean
  active: boolean
}
