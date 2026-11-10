import type { Product } from "@/types/catalog"
import type { CartLine, Customer, Order, OrderChannel, OrderEvent, OrderStatus } from "@/types/commerce"
import { tenantConfig } from "@/tenants"
import { buildOrderLines } from "./orders"
import { cartTotals, priceCartLines } from "./pricing"
import { toDateOnly } from "./format"

/** Small deterministic PRNG so every fresh demo starts with the same story. */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Customer → product preferences, so order history looks plausible. */
const BASKETS: Record<string, string[]> = {
  "c-palm-grove": ["p-tenderloin", "p-ribeye-steaks", "p-salmon-fillet", "p-shrimp-pd", "p-spiny-lobster", "p-malbec", "p-steak-seasoning", "p-pork-ribs"],
  "c-seaview": ["p-whole-chicken", "p-shrimp-pd", "p-salmon-portions", "p-bacon", "p-pina-colada-mix", "p-mojito-mix", "p-cabernet", "p-rice", "p-beyond-burger", "p-burger-patties", "p-private-label-red"],
  "c-harbour-hotel": ["p-bacon", "p-salmon-portions", "p-mahi-portions", "p-striploin", "p-olive-oil", "p-penne", "p-cabernet", "p-cornish-hens"],
  "c-cunucu": ["p-red-snapper", "p-whole-chicken", "p-pork-belly", "p-cajun", "p-rice", "p-octopus"],
  "c-island-bites": ["p-burger-patties", "p-wings-party", "p-bratwurst", "p-beyond-burger", "p-cajun"],
  "c-coral-reef": ["p-spiny-lobster", "p-lobster-tails", "p-tuna-loin", "p-octopus", "p-tiger-prawns", "p-seafood-mix", "p-red-snapper"],
  "c-sunset-pier": ["p-pina-colada-mix", "p-spiced-mix", "p-coffee-liqueur", "p-wings-whole", "p-sushi-salmon"],
}

const STAFF = ["Order desk", "Warehouse", "Dispatch"]

export function generateSeedOrders(products: Product[], customers: Customer[], now: Date = new Date()): Order[] {
  const rand = mulberry32(20261110)
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)]
  const weighted = [
    "c-palm-grove", "c-palm-grove", "c-palm-grove", "c-palm-grove",
    "c-seaview", "c-seaview", "c-seaview",
    "c-harbour-hotel", "c-harbour-hotel",
    "c-coral-reef", "c-coral-reef",
    "c-cunucu", "c-island-bites", "c-sunset-pier",
  ]
  const channels: OrderChannel[] = ["portal", "portal", "portal", "phone", "whatsapp", "email"]
  const { deliveryWindows, deliveryDays } = tenantConfig.commerce

  // Days ago for each seeded order; the first few land today / in the future.
  const offsets = [0, 0, 0, 0.3, 0.6, 1, 1, 1.4, 2, 2, 3, 4, 5, 6, 7, 8, 10, 12, 13, 15, 17, 19, 22, 24, 27, 30, 34, 38, 42, 47]
  const orders: Order[] = []
  let seq = 10400

  offsets.forEach((daysAgo, index) => {
    const customerId = index < 3 ? ["c-seaview", "c-coral-reef", "c-cunucu"][index] : pick(weighted)
    const customer = customers.find((c) => c.id === customerId)
    if (!customer) return
    const basket = BASKETS[customerId] ?? products.slice(0, 6).map((p) => p.id)

    const created = new Date(now.getTime() - daysAgo * 86400000)
    created.setHours(index < 3 ? Math.max(6, now.getHours() - index - 1) : 7 + Math.floor(rand() * 9), Math.floor(rand() * 60), 0, 0)
    if (created > now) created.setTime(now.getTime() - (index + 1) * 17 * 60000)

    const delivery = new Date(created.getFullYear(), created.getMonth(), created.getDate() + 1)
    while (!deliveryDays.includes(delivery.getDay() === 0 ? 7 : delivery.getDay())) delivery.setDate(delivery.getDate() + 1)

    const lineCount = 2 + Math.floor(rand() * 4)
    const chosen = new Set<string>()
    while (chosen.size < Math.min(lineCount, basket.length)) chosen.add(pick(basket))
    const cartLines: CartLine[] = [...chosen].map((productId) => {
      const product = products.find((p) => p.id === productId)!
      const unit = product.units[Math.floor(rand() * product.units.length)]
      const qty = unit.minQty + unit.step * Math.floor(rand() * (unit.code === "kg" ? 6 : 3))
      return { productId, unitCode: unit.code, quantity: qty }
    })

    const today = toDateOnly(now)
    const deliveryStr = toDateOnly(delivery)
    let status: OrderStatus
    if (deliveryStr < today) status = rand() < 0.06 ? "cancelled" : "delivered"
    else if (deliveryStr === today) status = rand() < 0.5 ? "out-for-delivery" : "processing"
    else if (index === 0 || index === 2) status = "pending"
    else status = index === 1 ? "pending" : rand() < 0.5 ? "confirmed" : "processing"
    if (customer.status === "on-hold" && status !== "delivered") status = "pending"

    const flow: OrderStatus[] = ["pending", "confirmed", "processing", "out-for-delivery", "delivered"]
    const reached = status === "cancelled" ? ["pending", "cancelled"] : flow.slice(0, flow.indexOf(status) + 1)
    const history: OrderEvent[] = reached.map((s, i) => {
      const at = new Date(created.getTime() + i * 3.5 * 3600000)
      return {
        status: s as OrderStatus,
        at: (at > now ? now : at).toISOString(),
        by: i === 0 ? customer.contactName : STAFF[Math.min(i - 1, STAFF.length - 1)],
        note: i === 0 ? undefined : s === "cancelled" ? "Cancelled at customer's request" : undefined,
      }
    })

    const priced = priceCartLines(cartLines, products, customer.priceTier)
    const totals = cartTotals(priced)
    seq += 1 + Math.floor(rand() * 3)
    orders.push({
      id: `o-seed-${index}`,
      number: `BS-${String(created.getFullYear()).slice(-2)}-${seq}`,
      customerId,
      createdAt: created.toISOString(),
      requestedDeliveryDate: deliveryStr,
      deliveryWindow: pick(deliveryWindows).label,
      status,
      channel: index < 3 ? "portal" : pick(channels),
      poNumber: rand() < 0.4 ? `PO-${4000 + Math.floor(rand() * 900)}` : undefined,
      lines: buildOrderLines(cartLines, products, customer),
      subtotal: totals.subtotal,
      discount: totals.savings,
      deliveryFee: totals.deliveryFee,
      total: totals.total,
      hasCatchWeight: totals.hasCatchWeight,
      history,
    })
  })

  // Seeded with descending recency → number ascending with age is reversed; renumber so newest is highest.
  const sorted = orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const numbers = sorted.map((o) => o.number).sort()
  return sorted.map((o, i) => ({ ...o, number: numbers[numbers.length - 1 - i] }))
}
