"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ChevronRight, Repeat2, Search } from "lucide-react"
import type { OrderStatus } from "@/types/commerce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/shared/page-header"
import { OrderStatusBadge } from "@/components/shared/badges"
import { useCartSheet } from "@/components/portal/portal-shell"
import { useDemoStore } from "@/lib/demo-store"
import { CHANNEL_LABELS, OPEN_STATUSES } from "@/lib/orders"
import { formatDate, formatMoney } from "@/lib/format"
import { cn } from "@/lib/utils"
import { PortalReady } from "@/components/portal/portal-shell"

const TABS: { id: "all" | "open" | OrderStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
]

function OrdersPage() {
  const store = useDemoStore()
  const openCart = useCartSheet()
  const customer = store.currentCustomer!
  const [tab, setTab] = React.useState<(typeof TABS)[number]["id"]>("all")
  const [q, setQ] = React.useState("")

  const mine = store.orders.filter((o) => o.customerId === customer.id)
  const filtered = mine.filter((o) => {
    if (tab === "open" && !OPEN_STATUSES.includes(o.status)) return false
    if (tab !== "all" && tab !== "open" && o.status !== tab) return false
    if (q && !`${o.number} ${o.poNumber ?? ""} ${o.lines.map((l) => l.name).join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  const count = (id: (typeof TABS)[number]["id"]) =>
    id === "all" ? mine.length : id === "open" ? mine.filter((o) => OPEN_STATUSES.includes(o.status)).length : mine.filter((o) => o.status === id).length

  const reorder = (id: string, number: string) => {
    const n = store.reorder(id)
    toast.success(`${n} lines from ${number} added to your cart`, { action: { label: "Open cart", onClick: () => openCart(true) } })
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Order history" description="Track deliveries, view details and reorder in one click." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-lg border bg-white p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                tab === t.id ? "bg-brand text-white" : "text-ink/70 hover:bg-muted"
              )}
            >
              {t.label}
              <span className={cn("tabular rounded-full px-1.5 text-[11px]", tab === t.id ? "bg-white/20" : "bg-muted")}>{count(t.id)}</span>
            </button>
          ))}
        </div>
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Order #, PO or product" className="h-10 bg-white pl-9" />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="hidden grid-cols-[1.3fr_1fr_1fr_0.7fr_1fr_1fr_auto] gap-4 border-b bg-surface px-5 py-3 text-xs font-medium text-muted-foreground lg:grid">
          <span>Order</span>
          <span>Placed</span>
          <span>Delivery</span>
          <span className="text-right">Lines</span>
          <span className="text-right">Total</span>
          <span>Status</span>
          <span className="w-[150px]" />
        </div>
        {filtered.length === 0 ? (
          <p className="p-12 text-center text-sm text-muted-foreground">No orders match.</p>
        ) : (
          <ul className="divide-y">
            {filtered.map((o) => (
              <li key={o.id} className="grid grid-cols-2 items-center gap-x-4 gap-y-2 px-5 py-4 lg:grid-cols-[1.3fr_1fr_1fr_0.7fr_1fr_1fr_auto]">
                <Link href={`/portal/orders/${o.id}`} className="col-span-2 lg:col-span-1">
                  <span className="font-mono text-sm font-medium text-ink hover:text-brand">{o.number}</span>
                  <span className="block text-xs text-muted-foreground">
                    {o.poNumber ? `${o.poNumber} · ` : ""}
                    {CHANNEL_LABELS[o.channel]}
                  </span>
                </Link>
                <span className="text-sm text-muted-foreground lg:text-ink">{formatDate(o.createdAt)}</span>
                <span className="text-right text-sm lg:text-left">{formatDate(o.requestedDeliveryDate, { weekday: "short", year: undefined })}</span>
                <span className="tabular hidden text-right text-sm lg:block">{o.lines.length}</span>
                <span className="tabular text-sm font-medium lg:text-right">{formatMoney(o.total)}</span>
                <span className="text-right lg:text-left">
                  <OrderStatusBadge status={o.status} />
                </span>
                <span className="col-span-2 flex justify-end gap-1 lg:col-span-1 lg:w-[150px]">
                  <Button variant="ghost" size="sm" className="text-brand" onClick={() => reorder(o.id, o.number)}>
                    <Repeat2 data-icon="inline-start" /> Reorder
                  </Button>
                  <Button asChild variant="ghost" size="icon-sm" aria-label={`View ${o.number}`}>
                    <Link href={`/portal/orders/${o.id}`}>
                      <ChevronRight />
                    </Link>
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <PortalReady>
      <OrdersPage />
    </PortalReady>
  )
}
