"use client"

import * as React from "react"
import type { Product, UnitCode } from "@/types/catalog"
import type { CartLine, Customer, DemoSession, Order, OrderStatus } from "@/types/commerce"
import { tenant } from "@/tenants"
import { generateSeedOrders } from "./seed"
import { createOrder, type NewOrderInput } from "./orders"
import { findUnit, normalizeQty, round2 } from "./pricing"

/**
 * Demo state for the prototype.
 *
 * Holds catalog, customers, orders, cart and the demo session in React state
 * and mirrors it to localStorage so the walkthrough survives page reloads.
 * In production these become API calls against the tenant's backend.
 */

const STORAGE_KEY = `wholesale-demo:${tenant.config.id}:v1`

interface DemoState {
  products: Product[]
  customers: Customer[]
  orders: Order[]
  cart: CartLine[]
  session: DemoSession | null
  favorites: string[]
  notifications: { email: boolean; whatsapp: boolean; deliveryReminders: boolean }
}

type PlaceOrderInput = Pick<NewOrderInput, "requestedDeliveryDate" | "deliveryWindow" | "poNumber" | "notes">

interface DemoStore extends DemoState {
  ready: boolean
  currentCustomer: Customer | null
  addToCart: (productId: string, unitCode: UnitCode, quantity: number) => void
  setCartQuantity: (productId: string, unitCode: UnitCode, quantity: number) => void
  removeFromCart: (productId: string, unitCode: UnitCode) => void
  clearCart: () => void
  placeOrder: (input: PlaceOrderInput) => Order | null
  reorder: (orderId: string) => number
  updateOrderStatus: (orderId: string, status: OrderStatus, by: string, note?: string) => void
  addOrderNote: (orderId: string, by: string, note: string) => void
  signIn: (identity: { customerId?: string; staffName?: string }) => void
  signOut: () => void
  updateProduct: (productId: string, patch: Partial<Product>) => void
  adjustStock: (productId: string, delta: number) => void
  updateCustomer: (customerId: string, patch: Partial<Customer>) => void
  toggleFavorite: (productId: string) => void
  setNotifications: (patch: Partial<DemoState["notifications"]>) => void
  resetDemo: () => void
}

const DemoStoreContext = React.createContext<DemoStore | null>(null)

function freshState(): DemoState {
  const products = structuredClone(tenant.products)
  const customers = structuredClone(tenant.customers)
  return {
    products,
    customers,
    orders: generateSeedOrders(products, customers),
    cart: [],
    session: null,
    favorites: ["p-tenderloin", "p-salmon-fillet", "p-shrimp-pd"],
    notifications: { email: true, whatsapp: true, deliveryReminders: false },
  }
}

function loadState(): DemoState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState
      if (Array.isArray(parsed.products) && Array.isArray(parsed.orders)) return { ...freshState(), ...parsed }
    }
  } catch {
    // Storage unavailable or corrupt — fall back to a fresh demo.
  }
  return freshState()
}

export function DemoStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<DemoState | null>(null)

  React.useEffect(() => {
    // Hydrate from localStorage after mount so server and client markup match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadState())
  }, [])

  React.useEffect(() => {
    if (!state) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore quota / private-mode errors; the demo keeps working in memory.
    }
  }, [state])

  // Keep tabs in sync (e.g. customer portal in one tab, admin in another).
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setState(JSON.parse(e.newValue) as DemoState)
        } catch {
          /* ignore */
        }
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const update = React.useCallback((fn: (s: DemoState) => DemoState) => {
    setState((s) => (s ? fn(s) : s))
  }, [])

  const store = React.useMemo<DemoStore>(() => {
    const s = state ?? {
      products: tenant.products,
      customers: tenant.customers,
      orders: [],
      cart: [],
      session: null,
      favorites: [],
      notifications: { email: true, whatsapp: true, deliveryReminders: false },
    }
    const currentCustomer = s.session?.customerId
      ? (s.customers.find((c) => c.id === s.session?.customerId) ?? null)
      : null

    return {
      ...s,
      ready: state !== null,
      currentCustomer,

      addToCart(productId, unitCode, quantity) {
        update((st) => {
          const product = st.products.find((p) => p.id === productId)
          if (!product) return st
          const unit = findUnit(product, unitCode)
          const existing = st.cart.find((l) => l.productId === productId && l.unitCode === unitCode)
          const cart = existing
            ? st.cart.map((l) =>
                l === existing ? { ...l, quantity: normalizeQty(unit, round2(l.quantity + quantity)) } : l
              )
            : [...st.cart, { productId, unitCode, quantity: normalizeQty(unit, quantity) }]
          return { ...st, cart }
        })
      },

      setCartQuantity(productId, unitCode, quantity) {
        update((st) => {
          const product = st.products.find((p) => p.id === productId)
          if (!product) return st
          const unit = findUnit(product, unitCode)
          if (quantity <= 0) {
            return { ...st, cart: st.cart.filter((l) => !(l.productId === productId && l.unitCode === unitCode)) }
          }
          return {
            ...st,
            cart: st.cart.map((l) =>
              l.productId === productId && l.unitCode === unitCode ? { ...l, quantity: normalizeQty(unit, quantity) } : l
            ),
          }
        })
      },

      removeFromCart(productId, unitCode) {
        update((st) => ({
          ...st,
          cart: st.cart.filter((l) => !(l.productId === productId && l.unitCode === unitCode)),
        }))
      },

      clearCart() {
        update((st) => ({ ...st, cart: [] }))
      },

      placeOrder(input) {
        if (!state || !currentCustomer || state.cart.length === 0) return null
        const order = createOrder({
          ...input,
          lines: state.cart,
          products: state.products,
          customer: currentCustomer,
          existingOrders: state.orders,
        })
        update((st) => {
          // Reserve stock for the order (stock is tracked in each product's first unit).
          const products = st.products.map((p) => {
            const lines = st.cart.filter((l) => l.productId === p.id)
            if (lines.length === 0) return p
            const used = lines.reduce((sum, l) => sum + l.quantity * (findUnit(p, l.unitCode).stockUnits ?? 1), 0)
            return { ...p, stock: Math.max(0, round2(p.stock - used)) }
          })
          return { ...st, products, orders: [order, ...st.orders], cart: [] }
        })
        return order
      },

      reorder(orderId) {
        const order = state?.orders.find((o) => o.id === orderId)
        if (!order) return 0
        update((st) => {
          let cart = [...st.cart]
          for (const line of order.lines) {
            const product = st.products.find((p) => p.id === line.productId && p.active)
            if (!product) continue
            const existing = cart.find((l) => l.productId === line.productId && l.unitCode === line.unitCode)
            cart = existing
              ? cart.map((l) => (l === existing ? { ...l, quantity: round2(l.quantity + line.quantity) } : l))
              : [...cart, { productId: line.productId, unitCode: line.unitCode, quantity: line.quantity }]
          }
          return { ...st, cart }
        })
        return order.lines.length
      },

      updateOrderStatus(orderId, status, by, note) {
        update((st) => ({
          ...st,
          orders: st.orders.map((o) =>
            o.id === orderId && o.status !== status
              ? { ...o, status, history: [...o.history, { status, at: new Date().toISOString(), by, note }] }
              : o
          ),
        }))
      },

      addOrderNote(orderId, by, note) {
        update((st) => ({
          ...st,
          orders: st.orders.map((o) =>
            o.id === orderId
              ? { ...o, history: [...o.history, { status: o.status, at: new Date().toISOString(), by, note }] }
              : o
          ),
        }))
      },

      signIn(identity) {
        update((st) => ({
          ...st,
          session: { ...st.session, ...identity, signedInAt: new Date().toISOString() },
          cart: identity.customerId && identity.customerId !== st.session?.customerId ? [] : st.cart,
        }))
      },

      signOut() {
        update((st) => ({ ...st, session: null, cart: [] }))
      },

      updateProduct(productId, patch) {
        update((st) => ({ ...st, products: st.products.map((p) => (p.id === productId ? { ...p, ...patch } : p)) }))
      },

      adjustStock(productId, delta) {
        update((st) => ({
          ...st,
          products: st.products.map((p) =>
            p.id === productId ? { ...p, stock: Math.max(0, round2(p.stock + delta)) } : p
          ),
        }))
      },

      updateCustomer(customerId, patch) {
        update((st) => ({
          ...st,
          customers: st.customers.map((c) => (c.id === customerId ? { ...c, ...patch } : c)),
        }))
      },

      toggleFavorite(productId) {
        update((st) => ({
          ...st,
          favorites: st.favorites.includes(productId)
            ? st.favorites.filter((id) => id !== productId)
            : [...st.favorites, productId],
        }))
      },

      setNotifications(patch) {
        update((st) => ({ ...st, notifications: { ...st.notifications, ...patch } }))
      },

      resetDemo() {
        const session = state?.session ?? null
        setState({ ...freshState(), session })
      },
    }
  }, [state, update])

  return <DemoStoreContext.Provider value={store}>{children}</DemoStoreContext.Provider>
}

export function useDemoStore(): DemoStore {
  const ctx = React.useContext(DemoStoreContext)
  if (!ctx) throw new Error("useDemoStore must be used inside <DemoStoreProvider>")
  return ctx
}
