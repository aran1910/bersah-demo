"use client"

import Link from "next/link"
import { toast } from "sonner"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock,
  Loader,
  Package,
  PackageCheck,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { OrderStatusBadge, Pill } from "@/components/shared/badges"
import { ProductImage } from "@/components/shared/product-image"
import { AdminReady } from "@/components/admin/admin-shell"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { useDemoStore } from "@/lib/demo-store"
import { useNow } from "@/lib/use-now"
import { CHANNEL_LABELS, ORDER_STATUSES, STATUS_META } from "@/lib/orders"
import { stockLevel, unitName } from "@/lib/pricing"
import { formatDate, formatMoney, formatNumber, formatRelative, toDateOnly } from "@/lib/format"

function AdminOverview() {
  const store = useDemoStore()
  const { orders, customers, products } = store
  const customerName = (id: string) => customers.find((c) => c.id === id)?.businessName ?? "Unknown"

  const pending = orders.filter((o) => o.status === "pending")
  const processing = orders.filter((o) => ["confirmed", "processing", "out-for-delivery"].includes(o.status))
  const completed = orders.filter((o) => o.status === "delivered")
  const lowStock = products.filter((p) => p.active && stockLevel(p) !== "in-stock").sort((a, b) => a.stock - b.stock)
  const now = useNow()
  const today = toDateOnly(now)
  const deliveriesToday = orders.filter((o) => o.requestedDeliveryDate === today && o.status !== "cancelled")
  const last14 = orders.filter((o) => now.getTime() - new Date(o.createdAt).getTime() < 14 * 86400000 && o.status !== "cancelled")

  const kpis = [
    { label: "Total orders", value: orders.length, sub: `${formatMoney(orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0))} gross`, icon: ClipboardList, href: "/admin/orders" },
    { label: "Pending", value: pending.length, sub: "Awaiting confirmation", icon: Clock, href: "/admin/orders?status=pending", accent: pending.length > 0 },
    { label: "Processing", value: processing.length, sub: "Confirmed → out for delivery", icon: Loader, href: "/admin/orders?status=in-progress" },
    { label: "Completed", value: completed.length, sub: "Delivered", icon: CheckCircle2, href: "/admin/orders?status=delivered" },
    { label: "Customers", value: customers.length, sub: `${customers.filter((c) => c.status === "active").length} active accounts`, icon: Users, href: "/admin/customers" },
    { label: "Products", value: products.filter((p) => p.active).length, sub: `${lowStock.length} need attention`, icon: Package, href: "/admin/products" },
  ]

  const confirm = (id: string, number: string) => {
    store.updateOrderStatus(id, "confirmed", store.session?.staffName ?? "Staff")
    toast.success(`${number} confirmed`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description={`${formatDate(today, { weekday: "long" })} · ${deliveriesToday.length} deliveries scheduled today`}
        actions={
          <Button asChild>
            <Link href="/admin/orders?status=pending">
              Review pending orders <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k) => (
          <Link
            key={k.label}
            href={k.href}
            className={`group rounded-xl border bg-white p-4 transition-colors hover:border-brand/30 ${k.accent ? "ring-1 ring-amber-300" : ""}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{k.label}</p>
              <k.icon className={`size-4 ${k.accent ? "text-amber-600" : "text-brand"}`} />
            </div>
            <p className="tabular mt-2 text-3xl font-semibold text-ink">{formatNumber(k.value)}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{k.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-xl border bg-white p-5 xl:col-span-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 className="font-medium">Order value per day</h2>
              <p className="text-sm text-muted-foreground">Last 14 days, by order date · excl. cancelled</p>
            </div>
            <p className="tabular text-right">
              <span className="text-2xl font-semibold">{formatMoney(last14.reduce((s, o) => s + o.total, 0))}</span>
              <span className="block text-xs text-muted-foreground">{last14.length} orders</span>
            </p>
          </div>
          <div className="mt-6">
            <RevenueChart orders={orders} />
          </div>
        </section>

        <section className="rounded-xl border bg-white p-5">
          <h2 className="font-medium">Orders by status</h2>
          <ul className="mt-4 space-y-3">
            {ORDER_STATUSES.map((s) => {
              const n = orders.filter((o) => o.status === s).length
              return (
                <li key={s}>
                  <Link href={`/admin/orders?status=${s}`} className="group block">
                    <div className="flex items-center justify-between text-sm">
                      <span className="group-hover:text-brand">{STATUS_META[s].label}</span>
                      <span className="tabular font-medium">{n}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-brand/80" style={{ width: `${orders.length ? (n / orders.length) * 100 : 0}%` }} />
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="overflow-hidden rounded-xl border bg-white xl:col-span-2">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="flex items-center gap-2 font-medium">
              Incoming orders
              {pending.length > 0 && <Pill tone="amber">{pending.length} pending</Pill>}
            </h2>
            <Link href="/admin/orders" className="text-sm text-brand hover:underline">All orders</Link>
          </div>
          <ul className="divide-y">
            {orders
              .filter((o) => ["pending", "confirmed"].includes(o.status))
              .slice(0, 6)
              .map((o) => (
                <li key={o.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
                  <Link href={`/admin/orders/${o.id}`} className="min-w-0 flex-1">
                    <p className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium hover:text-brand">{o.number}</span>
                      <span className="text-xs text-muted-foreground">{formatRelative(o.createdAt)}</span>
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {customerName(o.customerId)} · {CHANNEL_LABELS[o.channel]} · delivery {formatDate(o.requestedDeliveryDate, { year: undefined })}
                    </p>
                  </Link>
                  <span className="tabular text-sm font-medium">{formatMoney(o.total)}</span>
                  <OrderStatusBadge status={o.status} />
                  {o.status === "pending" ? (
                    <Button size="sm" onClick={() => confirm(o.id, o.number)}>
                      <PackageCheck data-icon="inline-start" /> Confirm
                    </Button>
                  ) : (
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/orders/${o.id}`}>Open</Link>
                    </Button>
                  )}
                </li>
              ))}
            {orders.filter((o) => ["pending", "confirmed"].includes(o.status)).length === 0 && (
              <li className="p-10 text-center text-sm text-muted-foreground">All caught up — no new orders.</li>
            )}
          </ul>
        </section>

        <section className="overflow-hidden rounded-xl border bg-white">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="flex items-center gap-2 font-medium">
              <AlertTriangle className="size-4 text-amber-600" /> Stock alerts
            </h2>
            <Link href="/admin/inventory" className="text-sm text-brand hover:underline">Inventory</Link>
          </div>
          <ul className="divide-y">
            {lowStock.slice(0, 6).map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                <ProductImage src={p.image} alt="" className="size-10 shrink-0 rounded-md" sizes="40px" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="tabular text-xs text-muted-foreground">
                    {formatNumber(p.stock, 1)} {unitName(p.units[0], p.stock)} · reorder at {p.reorderPoint}
                  </p>
                </div>
                {p.stock <= 0 ? <Pill tone="red">Out</Pill> : <Pill tone="amber">Low</Pill>}
              </li>
            ))}
            {lowStock.length === 0 && <li className="p-10 text-center text-sm text-muted-foreground">All products above reorder point.</li>}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <AdminReady>
      <AdminOverview />
    </AdminReady>
  )
}
