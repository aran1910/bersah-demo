"use client"

import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import {
  ArrowRight,
  CalendarClock,
  ClipboardList,
  Clock,
  CreditCard,
  Heart,
  PackageCheck,
  Repeat2,
  Store,
  Truck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { ProductOrderRow } from "@/components/portal/product-order-card"
import { OrderStatusBadge } from "@/components/shared/badges"
import { useCartSheet } from "@/components/portal/portal-shell"
import { useDemoStore } from "@/lib/demo-store"
import { availableDeliveryDates, minutesUntilCutoff, OPEN_STATUSES } from "@/lib/orders"
import { PRICE_TIERS } from "@/lib/pricing"
import { formatDate, formatDateLong, formatMoney } from "@/lib/format"
import { tenantConfig } from "@/tenants"
import { PortalReady } from "@/components/portal/portal-shell"

function PortalDashboard() {
  const store = useDemoStore()
  const openCart = useCartSheet()
  const customer = store.currentCustomer!
  const now = new Date()

  const myOrders = store.orders.filter((o) => o.customerId === customer.id)
  const openOrders = myOrders.filter((o) => OPEN_STATUSES.includes(o.status))
  const nextDelivery = [...openOrders].sort((a, b) => a.requestedDeliveryDate.localeCompare(b.requestedDeliveryDate))[0]
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthSpend = myOrders
    .filter((o) => o.createdAt >= monthStart && o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0)
  const openValue = openOrders.reduce((s, o) => s + o.total, 0)
  const lastOrder = myOrders.find((o) => o.status !== "cancelled")

  // Most-ordered products, by number of orders containing them.
  const counts = new Map<string, number>()
  myOrders.forEach((o) => o.lines.forEach((l) => counts.set(l.productId, (counts.get(l.productId) ?? 0) + 1)))
  const frequent = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => store.products.find((p) => p.id === id && p.active))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 5)
  const favorites = store.favorites
    .map((id) => store.products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  const mins = minutesUntilCutoff(now)
  const nextDate = availableDeliveryDates(now, 1)[0]
  const hour = now.getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  const reorder = (orderId: string, number: string) => {
    const n = store.reorder(orderId)
    toast.success(`${n} lines from ${number} added to your cart`, { action: { label: "Open cart", onClick: () => openCart(true) } })
  }

  const tier = PRICE_TIERS[customer.priceTier]

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={customer.businessName}
        title={`${greeting}, ${customer.contactName.split(" ")[0]}`}
        description="Here's what's happening with your account today."
        actions={
          <>
            {lastOrder && (
              <Button variant="outline" className="h-10 bg-white" onClick={() => reorder(lastOrder.id, lastOrder.number)}>
                <Repeat2 data-icon="inline-start" /> Reorder last order
              </Button>
            )}
            <Button asChild className="h-10">
              <Link href="/portal/catalog">
                <Store data-icon="inline-start" /> New order
              </Link>
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-3 rounded-xl bg-brand-deep p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-white/10">
            <Clock className="size-5 text-brand-accent" />
          </span>
          <span>
            {mins > 0 ? (
              <>
                Order within <span className="font-semibold text-brand-accent">{Math.floor(mins / 60)}h {mins % 60}m</span> for delivery on{" "}
                <span className="font-medium">{formatDateLong(nextDate)}</span>
              </>
            ) : (
              <>
                Today&apos;s {tenantConfig.commerce.orderCutoff} cut-off has passed — next delivery{" "}
                <span className="font-medium">{formatDateLong(nextDate)}</span>
              </>
            )}
          </span>
        </p>
        <span className="text-xs text-white/60">Cut-off and delivery days are demo assumptions</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={ClipboardList} label="Open orders" value={String(openOrders.length)} sub={`${formatMoney(openValue)} in progress`} href="/portal/orders" />
        <Kpi
          icon={Truck}
          label="Next delivery"
          value={nextDelivery ? formatDate(nextDelivery.requestedDeliveryDate, { weekday: "short", year: undefined }) : "—"}
          sub={nextDelivery ? `${nextDelivery.number} · ${nextDelivery.deliveryWindow}` : "No deliveries scheduled"}
          href={nextDelivery ? `/portal/orders/${nextDelivery.id}` : "/portal/catalog"}
        />
        <Kpi icon={PackageCheck} label="Ordered this month" value={formatMoney(monthSpend)} sub={`${myOrders.filter((o) => o.createdAt >= monthStart).length} orders`} />
        <Kpi
          icon={CreditCard}
          label={`${tier.label} pricing`}
          value={customer.creditLimit > 0 ? formatMoney(Math.max(0, customer.creditLimit - openValue)) : customer.paymentTerms}
          sub={customer.creditLimit > 0 ? `Available credit · ${customer.paymentTerms}` : tier.description}
          href="/portal/profile"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <section className="rounded-xl border bg-white xl:col-span-3">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="font-medium">Recent orders</h2>
            <Link href="/portal/orders" className="text-sm text-brand hover:underline">View all</Link>
          </div>
          {myOrders.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <ul className="divide-y">
              {myOrders.slice(0, 5).map((o) => (
                <li key={o.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
                  <Link href={`/portal/orders/${o.id}`} className="min-w-0 flex-1">
                    <p className="font-mono text-sm font-medium text-ink hover:text-brand">{o.number}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.lines.length} lines · delivery {formatDate(o.requestedDeliveryDate, { year: undefined })}
                    </p>
                  </Link>
                  <OrderStatusBadge status={o.status} />
                  <span className="tabular w-28 text-right text-sm font-medium">{formatMoney(o.total)}</span>
                  <Button variant="ghost" size="sm" className="text-brand" onClick={() => reorder(o.id, o.number)}>
                    <Repeat2 data-icon="inline-start" /> Reorder
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border bg-white xl:col-span-2">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="flex items-center gap-2 font-medium">
              <CalendarClock className="size-4 text-brand" /> Upcoming deliveries
            </h2>
          </div>
          {openOrders.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">Nothing scheduled. Place an order before the cut-off for next-day delivery.</p>
          ) : (
            <ol className="space-y-4 p-5">
              {[...openOrders]
                .sort((a, b) => a.requestedDeliveryDate.localeCompare(b.requestedDeliveryDate))
                .slice(0, 4)
                .map((o) => (
                  <li key={o.id}>
                    <Link href={`/portal/orders/${o.id}`} className="flex gap-4 rounded-lg p-2 -m-2 hover:bg-muted/60">
                      <div className="w-12 shrink-0 rounded-md bg-brand-tint py-1.5 text-center text-brand">
                        <p className="text-[10px] font-medium uppercase">{formatDate(o.requestedDeliveryDate, { month: "short", day: undefined, year: undefined })}</p>
                        <p className="text-lg leading-none font-semibold">{formatDate(o.requestedDeliveryDate, { day: "numeric", month: undefined, year: undefined })}</p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{o.number}</p>
                        <p className="text-xs text-muted-foreground">{o.deliveryWindow}</p>
                      </div>
                      <OrderStatusBadge status={o.status} className="self-start" />
                    </Link>
                  </li>
                ))}
            </ol>
          )}
        </section>
      </div>

      <section className="rounded-xl border bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-4">
          <div>
            <h2 className="font-medium">Your regulars</h2>
            <p className="text-sm text-muted-foreground">Quick-add the products you order most.</p>
          </div>
          <Link href="/portal/catalog" className="text-sm text-brand hover:underline">Full catalog</Link>
        </div>
        <div>
          {(frequent.length ? frequent : store.products.filter((p) => p.featured).slice(0, 5)).map((p) => (
            <ProductOrderRow key={p.id} product={p} />
          ))}
        </div>
      </section>

      {favorites.length > 0 && (
        <section className="rounded-xl border bg-white">
          <div className="border-b px-5 py-4">
            <h2 className="flex items-center gap-2 font-medium">
              <Heart className="size-4 text-rose-600" /> Favourites
            </h2>
          </div>
          {favorites.map((p) => (
            <ProductOrderRow key={p.id} product={p} />
          ))}
        </section>
      )}

      <section>
        <h2 className="font-medium">Browse by category</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {tenantConfig.categories.map((c) => (
            <Link key={c.id} href={`/portal/catalog?category=${c.id}`} className="group overflow-hidden rounded-lg border bg-white">
              <div className="relative aspect-[4/3]">
                <Image src={c.image} alt="" fill sizes="(min-width:1024px) 12vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <p className="flex items-center justify-between px-3 py-2 text-sm font-medium">
                {c.name} <ArrowRight className="size-3.5 opacity-40" />
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function Kpi({
  icon: Icon,
  label,
  value,
  sub,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  sub: string
  href?: string
}) {
  const body = (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="grid size-9 place-items-center rounded-md bg-brand-tint text-brand">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="tabular mt-3 text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-1 truncate text-xs text-muted-foreground">{sub}</p>
    </>
  )
  return href ? (
    <Link href={href} className="rounded-xl border bg-white p-5 transition-colors hover:border-brand/30">
      {body}
    </Link>
  ) : (
    <div className="rounded-xl border bg-white p-5">{body}</div>
  )
}

export default function Page() {
  return (
    <PortalReady>
      <PortalDashboard />
    </PortalReady>
  )
}
