import type { Product } from "@/types/catalog"
import type { CartLine, Customer, Order, OrderChannel, OrderLine, OrderStatus } from "@/types/commerce"
import { tenantConfig } from "@/tenants"
import { cartTotals, priceCartLines, round2 } from "./pricing"
import { toDateOnly } from "./format"

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "out-for-delivery",
  "delivered",
  "cancelled",
]

export const STATUS_META: Record<
  OrderStatus,
  { label: string; description: string; tone: "amber" | "blue" | "indigo" | "violet" | "green" | "slate" }
> = {
  pending: { label: "Pending", description: "Received, awaiting confirmation", tone: "amber" },
  confirmed: { label: "Confirmed", description: "Accepted by the order desk", tone: "blue" },
  processing: { label: "Processing", description: "Being picked and weighed", tone: "indigo" },
  "out-for-delivery": { label: "Out for delivery", description: "On the truck", tone: "violet" },
  delivered: { label: "Delivered", description: "Signed for by customer", tone: "green" },
  cancelled: { label: "Cancelled", description: "Order cancelled", tone: "slate" },
}

/** The status that normally follows, for one-click progression in the admin. */
export function nextStatus(status: OrderStatus): OrderStatus | null {
  const flow: OrderStatus[] = ["pending", "confirmed", "processing", "out-for-delivery", "delivered"]
  const i = flow.indexOf(status)
  return i >= 0 && i < flow.length - 1 ? flow[i + 1] : null
}

export const OPEN_STATUSES: OrderStatus[] = ["pending", "confirmed", "processing", "out-for-delivery"]

export const CHANNEL_LABELS: Record<OrderChannel, string> = {
  portal: "Online portal",
  phone: "Phone",
  whatsapp: "WhatsApp",
  email: "Email",
}

function isoWeekday(date: Date): number {
  const d = date.getDay()
  return d === 0 ? 7 : d
}

/** Next delivery dates, respecting delivery days and the order cut-off. */
export function availableDeliveryDates(now: Date = new Date(), count = 6): string[] {
  const { deliveryDays, orderCutoff } = tenantConfig.commerce
  const [h, m] = orderCutoff.split(":").map(Number)
  const afterCutoff = now.getHours() > h || (now.getHours() === h && now.getMinutes() >= m)
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  start.setDate(start.getDate() + (afterCutoff ? 2 : 1))
  const dates: string[] = []
  const cursor = new Date(start)
  while (dates.length < count) {
    if (deliveryDays.includes(isoWeekday(cursor))) dates.push(toDateOnly(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}

export function minutesUntilCutoff(now: Date = new Date()): number {
  const [h, m] = tenantConfig.commerce.orderCutoff.split(":").map(Number)
  const cutoff = new Date(now)
  cutoff.setHours(h, m, 0, 0)
  return Math.round((cutoff.getTime() - now.getTime()) / 60000)
}

export function nextOrderNumber(orders: Order[], now: Date = new Date()): string {
  const year = String(now.getFullYear()).slice(-2)
  const max = orders.reduce((acc, o) => {
    const n = Number(o.number.split("-").pop())
    return Number.isFinite(n) ? Math.max(acc, n) : acc
  }, 10400)
  return `BS-${year}-${max + 1}`
}

export function buildOrderLines(lines: CartLine[], products: Product[], customer?: Customer | null): OrderLine[] {
  return priceCartLines(lines, products, customer?.priceTier).map((p) => ({
    productId: p.product.id,
    sku: p.product.sku,
    name: p.product.name,
    image: p.product.image,
    unitCode: p.unit.code,
    unitLabel: p.unit.label,
    unitContents: p.unit.contents,
    pricing: p.unit.pricing,
    quantity: p.line.quantity,
    unitPrice: p.unitPrice,
    pricePerKg:
      p.unit.pricePerKg !== undefined ? round2(p.unit.pricePerKg * (p.listPrice ? p.unitPrice / p.listPrice : 1)) : undefined,
    estimatedWeightKg: p.estimatedWeightKg,
    lineTotal: p.lineTotal,
  }))
}

export interface NewOrderInput {
  lines: CartLine[]
  products: Product[]
  customer: Customer
  existingOrders: Order[]
  requestedDeliveryDate: string
  deliveryWindow: string
  poNumber?: string
  notes?: string
  channel?: OrderChannel
  now?: Date
}

export function createOrder(input: NewOrderInput): Order {
  const now = input.now ?? new Date()
  const priced = priceCartLines(input.lines, input.products, input.customer.priceTier)
  const totals = cartTotals(priced)
  const createdAt = now.toISOString()
  return {
    id: `o-${now.getTime().toString(36)}`,
    number: nextOrderNumber(input.existingOrders, now),
    customerId: input.customer.id,
    createdAt,
    requestedDeliveryDate: input.requestedDeliveryDate,
    deliveryWindow: input.deliveryWindow,
    status: "pending",
    channel: input.channel ?? "portal",
    poNumber: input.poNumber || undefined,
    notes: input.notes || undefined,
    lines: buildOrderLines(input.lines, input.products, input.customer),
    subtotal: totals.subtotal,
    discount: totals.savings,
    deliveryFee: totals.deliveryFee,
    total: totals.total,
    hasCatchWeight: totals.hasCatchWeight,
    history: [{ status: "pending", at: createdAt, by: input.customer.contactName, note: "Placed via online portal" }],
  }
}

export function orderItemCount(order: Order): number {
  return order.lines.length
}
