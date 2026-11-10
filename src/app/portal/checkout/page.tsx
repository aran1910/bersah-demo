"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarDays, ChevronLeft, Loader2, Lock, MapPin, Scale, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PageHeader } from "@/components/shared/page-header"
import { CartSummaryRows } from "@/components/portal/cart-parts"
import { ProductImage } from "@/components/shared/product-image"
import { DemoTag } from "@/components/shared/badges"
import { useDemoStore } from "@/lib/demo-store"
import { availableDeliveryDates } from "@/lib/orders"
import { cartTotals, priceCartLines } from "@/lib/pricing"
import { formatDate, formatMoney, parseDateOnly } from "@/lib/format"
import { tenantConfig } from "@/tenants"
import { cn } from "@/lib/utils"
import { PortalReady } from "@/components/portal/portal-shell"

function CheckoutPage() {
  const store = useDemoStore()
  const router = useRouter()
  const customer = store.currentCustomer!
  const [dates] = React.useState(() => availableDeliveryDates(new Date(), 6))
  const [date, setDate] = React.useState(dates[0])
  const [windowId, setWindowId] = React.useState(tenantConfig.commerce.deliveryWindows[0].id)
  const [po, setPo] = React.useState("")
  const [notes, setNotes] = React.useState(customer.deliveryNotes ?? "")
  const [placing, setPlacing] = React.useState(false)

  const priced = priceCartLines(store.cart, store.products, customer.priceTier)
  const totals = cartTotals(priced)

  if (placing) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="text-center">
          <Loader2 className="mx-auto size-10 animate-spin text-brand" />
          <p className="mt-4 font-medium">Submitting your order…</p>
          <p className="mt-1 text-sm text-muted-foreground">Simulated — nothing is sent to BerSah.</p>
        </div>
      </div>
    )
  }

  if (priced.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border bg-white p-12 text-center">
        <h1 className="font-display text-2xl">Nothing to check out</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your cart is empty.</p>
        <Button asChild className="mt-6"><Link href="/portal/catalog">Browse catalog</Link></Button>
      </div>
    )
  }

  const deliveryWindow = tenantConfig.commerce.deliveryWindows.find((w) => w.id === windowId)!

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!totals.meetsMinimum) return
    setPlacing(true)
    window.setTimeout(() => {
      const order = store.placeOrder({
        requestedDeliveryDate: date,
        deliveryWindow: deliveryWindow.label,
        poNumber: po.trim(),
        notes: notes.trim(),
      })
      if (order) router.push(`/portal/orders/${order.id}/confirmed`)
      else setPlacing(false)
    }, 900)
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Link href="/portal/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand">
        <ChevronLeft className="size-4" /> Back to cart
      </Link>
      <PageHeader title="Checkout" description="Choose a delivery slot and review your order." />

      {customer.status === "on-hold" && (
        <p className="flex gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          Your account is on hold. You can still submit this order; the order desk will review it before confirming.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-xl border bg-white p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-medium">
              <CalendarDays className="size-4 text-brand" /> Delivery date
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Orders before {tenantConfig.commerce.orderCutoff} can be delivered the next delivery day. No deliveries on Sundays.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {dates.map((d) => {
                const dt = parseDateOnly(d)
                const selected = d === date
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDate(d)}
                    aria-pressed={selected}
                    className={cn(
                      "rounded-lg border px-2 py-3 text-center transition-all",
                      selected ? "border-brand bg-brand text-white shadow-md" : "bg-white hover:border-brand/40"
                    )}
                  >
                    <span className={cn("block text-[11px] uppercase", selected ? "text-white/75" : "text-muted-foreground")}>
                      {dt.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    <span className="block text-xl leading-tight font-semibold">{dt.getDate()}</span>
                    <span className={cn("block text-[11px]", selected ? "text-white/75" : "text-muted-foreground")}>
                      {dt.toLocaleDateString("en-US", { month: "short" })}
                    </span>
                  </button>
                )
              })}
            </div>

            <h3 className="mt-6 text-sm font-medium">Delivery window</h3>
            <RadioGroup value={windowId} onValueChange={setWindowId} className="mt-3 grid gap-2 sm:grid-cols-3">
              {tenantConfig.commerce.deliveryWindows.map((w) => (
                <Label
                  key={w.id}
                  htmlFor={`w-${w.id}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border p-3 font-normal",
                    windowId === w.id && "border-brand bg-brand-tint/50"
                  )}
                >
                  <RadioGroupItem id={`w-${w.id}`} value={w.id} />
                  <span className="tabular">{w.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </section>

          <section className="grid gap-5 rounded-xl border bg-white p-5 sm:grid-cols-2 sm:p-6">
            <div className="sm:col-span-2">
              <h2 className="flex items-center gap-2 font-medium">
                <MapPin className="size-4 text-brand" /> Deliver to
              </h2>
              <p className="mt-2 text-sm">
                <span className="font-medium">{customer.businessName}</span>
                <br />
                <span className="text-muted-foreground">
                  {customer.address}, {customer.district}, Aruba · Attn. {customer.contactName}
                </span>
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="po">Purchase order number (optional)</Label>
              <Input id="po" value={po} onChange={(e) => setPo(e.target.value)} placeholder="e.g. PO-4821" className="h-10" />
            </div>
            <div className="grid gap-2">
              <Label>Payment terms</Label>
              <p className="flex h-10 items-center rounded-md border bg-muted/50 px-3 text-sm">
                <Lock className="mr-2 size-3.5 text-muted-foreground" /> {customer.paymentTerms} · on account
              </p>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="notes">Delivery notes for the driver</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Gate code, receiving hours, special handling…" />
            </div>
          </section>

          <section className="rounded-xl border bg-white">
            <h2 className="border-b px-5 py-4 font-medium">Items ({priced.length})</h2>
            <ul className="divide-y">
              {priced.map((item) => (
                <li key={`${item.product.id}-${item.unit.code}`} className="flex items-center gap-3 px-5 py-3">
                  <ProductImage src={item.product.image} alt="" className="size-12 rounded-md" sizes="48px" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.line.quantity} × {item.unit.label} · {item.unit.contents}
                    </p>
                  </div>
                  <p className="tabular text-sm font-medium">
                    {item.unit.pricing === "catch-weight" && <Scale className="mr-1 inline size-3 text-muted-foreground" />}
                    {formatMoney(item.lineTotal)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5 rounded-xl border bg-white p-5">
            <h2 className="font-medium">Summary</h2>
            <div className="rounded-lg bg-surface p-3 text-sm">
              <p className="text-muted-foreground">Delivery</p>
              <p className="font-medium">
                {formatDate(date, { weekday: "long", year: undefined })} · {deliveryWindow.label}
              </p>
            </div>
            <CartSummaryRows totals={totals} />
            {!totals.meetsMinimum && (
              <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
                Minimum order is {formatMoney(tenantConfig.commerce.minimumOrderValue)}.
              </p>
            )}
            <Button type="submit" size="lg" className="h-12 w-full text-[15px]" disabled={!totals.meetsMinimum}>
              Place order · {formatMoney(totals.total)}
            </Button>
            <div className="flex justify-center">
              <DemoTag>Simulated order — no payment or email</DemoTag>
            </div>
          </div>
        </aside>
      </div>
    </form>
  )
}

export default function Page() {
  return (
    <PortalReady>
      <CheckoutPage />
    </PortalReady>
  )
}
