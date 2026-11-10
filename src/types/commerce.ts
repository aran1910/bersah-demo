import type { PricingMode, UnitCode } from "./catalog"

export type CustomerSegment = "restaurant" | "hotel" | "resort" | "food-truck" | "catering"

export type PriceTier = "standard" | "preferred" | "contract"

export type AccountStatus = "active" | "on-hold" | "pending-approval"

export interface Customer {
  id: string
  accountNumber: string
  businessName: string
  segment: CustomerSegment
  contactName: string
  contactRole: string
  email: string
  phone: string
  address: string
  district: string
  priceTier: PriceTier
  paymentTerms: string
  creditLimit: number
  status: AccountStatus
  customerSince: string
  deliveryNotes?: string
}

export interface CartLine {
  productId: string
  unitCode: UnitCode
  quantity: number
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "out-for-delivery"
  | "delivered"
  | "cancelled"

export type OrderChannel = "portal" | "phone" | "whatsapp" | "email"

export interface OrderLine {
  productId: string
  sku: string
  name: string
  image: string
  unitCode: UnitCode
  unitLabel: string
  unitContents: string
  pricing: PricingMode
  quantity: number
  /** Price per unit at time of ordering (estimated for catch-weight). */
  unitPrice: number
  pricePerKg?: number
  estimatedWeightKg?: number
  lineTotal: number
}

export interface OrderEvent {
  status: OrderStatus
  at: string
  by: string
  note?: string
}

export interface Order {
  id: string
  number: string
  customerId: string
  createdAt: string
  requestedDeliveryDate: string
  deliveryWindow: string
  status: OrderStatus
  channel: OrderChannel
  poNumber?: string
  notes?: string
  lines: OrderLine[]
  subtotal: number
  discount: number
  deliveryFee: number
  total: number
  hasCatchWeight: boolean
  history: OrderEvent[]
}

/** Demo session. A visitor can hold a customer and an employee identity at once. */
export interface DemoSession {
  customerId?: string
  staffName?: string
  signedInAt: string
}
