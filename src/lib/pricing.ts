import type { Product, SellingUnit, UnitCode } from "@/types/catalog"
import type { CartLine, Customer, PriceTier } from "@/types/commerce"
import { tenantConfig } from "@/tenants"

/** Illustrative price-tier discounts. A real tenant would load price lists per customer. */
export const PRICE_TIERS: Record<PriceTier, { label: string; discount: number; description: string }> = {
  standard: { label: "Standard", discount: 0, description: "List prices" },
  preferred: { label: "Preferred", discount: 0.03, description: "3% off list" },
  contract: { label: "Contract", discount: 0.06, description: "6% off list (annual agreement)" },
}

export const round2 = (n: number) => Math.round(n * 100) / 100

export const UNIT_NAMES: Record<UnitCode, { singular: string; plural: string }> = {
  kg: { singular: "kg", plural: "kg" },
  case: { singular: "case", plural: "cases" },
  box: { singular: "box", plural: "boxes" },
  package: { singular: "pack", plural: "packs" },
  piece: { singular: "piece", plural: "pieces" },
  bottle: { singular: "bottle", plural: "bottles" },
}

export function unitName(unit: SellingUnit, qty = 1): string {
  if (unit.code === "kg") return "kg"
  const label = unit.label.toLowerCase()
  if (qty === 1) return label
  const plural = UNIT_NAMES[unit.code].plural
  return label === UNIT_NAMES[unit.code].singular ? plural : label.endsWith("s") ? label : `${label}s`
}

/** List price of one selling unit (estimated for catch-weight units). */
export function listUnitPrice(unit: SellingUnit): number {
  if (unit.pricing === "catch-weight") {
    return round2((unit.pricePerKg ?? 0) * (unit.nominalWeightKg ?? 0))
  }
  return unit.price ?? 0
}

export function tierDiscount(tier: PriceTier | undefined): number {
  return tier ? PRICE_TIERS[tier].discount : 0
}

/** Customer price of one selling unit after tier discount. */
export function customerUnitPrice(unit: SellingUnit, tier?: PriceTier): number {
  return round2(listUnitPrice(unit) * (1 - tierDiscount(tier)))
}

export function customerPricePerKg(unit: SellingUnit, tier?: PriceTier): number | undefined {
  if (unit.pricePerKg === undefined) return undefined
  return round2(unit.pricePerKg * (1 - tierDiscount(tier)))
}

export function findUnit(product: Product, code: UnitCode): SellingUnit {
  return product.units.find((u) => u.code === code) ?? product.units[0]
}

/** Clamp a quantity to the unit's minimum and step. */
export function normalizeQty(unit: SellingUnit, qty: number): number {
  if (!Number.isFinite(qty) || qty <= 0) return 0
  const steps = Math.max(0, Math.round((qty - unit.minQty) / unit.step))
  return round2(unit.minQty + steps * unit.step)
}

export interface PricedLine {
  line: CartLine
  product: Product
  unit: SellingUnit
  unitPrice: number
  listPrice: number
  lineTotal: number
  listTotal: number
  estimatedWeightKg?: number
}

export function priceCartLines(lines: CartLine[], products: Product[], tier?: PriceTier): PricedLine[] {
  const result: PricedLine[] = []
  for (const line of lines) {
    const product = products.find((p) => p.id === line.productId)
    if (!product) continue
    const unit = findUnit(product, line.unitCode)
    const unitPrice = customerUnitPrice(unit, tier)
    const listPrice = listUnitPrice(unit)
    result.push({
      line,
      product,
      unit,
      unitPrice,
      listPrice,
      lineTotal: round2(unitPrice * line.quantity),
      listTotal: round2(listPrice * line.quantity),
      estimatedWeightKg:
        unit.pricing === "catch-weight" ? round2((unit.nominalWeightKg ?? 0) * line.quantity) : undefined,
    })
  }
  return result
}

export interface CartTotals {
  itemCount: number
  subtotal: number
  listSubtotal: number
  savings: number
  deliveryFee: number
  total: number
  hasCatchWeight: boolean
  meetsMinimum: boolean
  amountToMinimum: number
  amountToFreeDelivery: number
}

export function cartTotals(priced: PricedLine[]): CartTotals {
  const { minimumOrderValue, deliveryFee, freeDeliveryThreshold } = tenantConfig.commerce
  const subtotal = round2(priced.reduce((sum, l) => sum + l.lineTotal, 0))
  const listSubtotal = round2(priced.reduce((sum, l) => sum + l.listTotal, 0))
  const fee = subtotal === 0 || subtotal >= freeDeliveryThreshold ? 0 : deliveryFee
  return {
    itemCount: priced.length,
    subtotal,
    listSubtotal,
    savings: round2(listSubtotal - subtotal),
    deliveryFee: fee,
    total: round2(subtotal + fee),
    hasCatchWeight: priced.some((l) => l.unit.pricing === "catch-weight"),
    meetsMinimum: subtotal >= minimumOrderValue,
    amountToMinimum: Math.max(0, round2(minimumOrderValue - subtotal)),
    amountToFreeDelivery: Math.max(0, round2(freeDeliveryThreshold - subtotal)),
  }
}

export type StockLevel = "in-stock" | "low" | "out"

export function stockLevel(product: Product): StockLevel {
  if (product.stock <= 0) return "out"
  if (product.stock <= product.reorderPoint) return "low"
  return "in-stock"
}

export function productListPriceFrom(product: Product): number {
  return Math.min(...product.units.map(listUnitPrice))
}

export function customerForTier(customer?: Customer | null): PriceTier | undefined {
  return customer?.priceTier
}
