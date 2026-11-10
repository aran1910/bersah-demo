"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { ArrowUpDown, ChevronRight, Download, PackageCheck, Search } from "lucide-react"
import type { OrderStatus } from "@/types/commerce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/shared/page-header"
import { useDemoStore } from "@/lib/demo-store"
import { useNow } from "@/lib/use-now"
import { CHANNEL_LABELS, ORDER_STATUSES, STATUS_META } from "@/lib/orders"
import { formatDate, formatDateTime, formatMoney, toDateOnly } from "@/lib/format"
import { downloadCsv } from "@/lib/csv"
import { cn } from "@/lib/utils"
import { StatusSelect } from "./status-select"

const TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "in-progress", label: "In progress" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
] as const
type TabId = (typeof TABS)[number]["id"]
const IN_PROGRESS: OrderStatus[] = ["confirmed", "processing", "out-for-delivery"]

export function AdminOrders() {
  const store = useDemoStore()
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const raw = params.get("status") ?? "all"
  const tab: TabId = (TABS.some((t) => t.id === raw) ? raw : ORDER_STATUSES.includes(raw as OrderStatus) && IN_PROGRESS.includes(raw as OrderStatus) ? "in-progress" : "all") as TabId

  const [q, setQ] = React.useState("")
  const [delivery, setDelivery] = React.useState("any")
  const [sortBy, setSortBy] = React.useState<"placed" | "delivery">("placed")
  const [selected, setSelected] = React.useState<string[]>([])

  const staff = store.session?.staffName ?? "Staff"
  const customerName = (id: string) => store.customers.find((c) => c.id === id)?.businessName ?? "Unknown"
  const now = useNow()
  const today = toDateOnly(now)
  const tomorrow = toDateOnly(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1))

  const inTab = (status: OrderStatus, t: TabId) =>
    t === "all" ? true : t === "in-progress" ? IN_PROGRESS.includes(status) : status === t

  const filtered = store.orders
    .filter((o) => inTab(o.status, tab))
    .filter((o) => {
      if (delivery === "today") return o.requestedDeliveryDate === today
      if (delivery === "tomorrow") return o.requestedDeliveryDate === tomorrow
      if (delivery === "upcoming") return o.requestedDeliveryDate > today
      return true
    })
    .filter((o) => {
      if (!q.trim()) return true
      return `${o.number} ${customerName(o.customerId)} ${o.poNumber ?? ""}`.toLowerCase().includes(q.trim().toLowerCase())
    })
    .sort((a, b) =>
      sortBy === "placed" ? b.createdAt.localeCompare(a.createdAt) : a.requestedDeliveryDate.localeCompare(b.requestedDeliveryDate)
    )

  const setTab = (id: TabId) => {
    setSelected([])
    router.replace(id === "all" ? pathname : `${pathname}?status=${id}`, { scroll: false })
  }

  const selectable = filtered.filter((o) => o.status === "pending").map((o) => o.id)
  const allSelected = selectable.length > 0 && selectable.every((id) => selected.includes(id))

  const bulkConfirm = () => {
    selected.forEach((id) => store.updateOrderStatus(id, "confirmed", staff, "Bulk confirmed"))
    toast.success(`${selected.length} orders confirmed`)
    setSelected([])
  }

  const exportCsv = () => {
    downloadCsv(`orders-${today}.csv`, [
      ["Order", "Customer", "Placed", "Delivery date", "Window", "Status", "Channel", "PO", "Lines", "Subtotal", "Delivery fee", "Total"],
      ...filtered.map((o) => [
        o.number,
        customerName(o.customerId),
        o.createdAt,
        o.requestedDeliveryDate,
        o.deliveryWindow,
        STATUS_META[o.status].label,
        CHANNEL_LABELS[o.channel],
        o.poNumber,
        o.lines.length,
        o.subtotal.toFixed(2),
        o.deliveryFee.toFixed(2),
        o.total.toFixed(2),
      ]),
    ])
    toast.success(`Exported ${filtered.length} orders to CSV`)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Orders"
        description="Incoming orders from the portal, phone, WhatsApp and email."
        actions={
          <Button variant="outline" className="bg-white" onClick={exportCsv}>
            <Download data-icon="inline-start" /> Export CSV
          </Button>
        }
      />

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-lg border bg-white p-1">
          {TABS.map((t) => {
            const n = store.orders.filter((o) => inTab(o.status, t.id)).length
            return (
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
                <span className={cn("tabular rounded-full px-1.5 text-[11px]", tab === t.id ? "bg-white/20" : "bg-muted")}>{n}</span>
              </button>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-0 basis-full sm:basis-auto sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Order #, customer, PO" className="h-9 bg-white pl-9" />
          </div>
          <Select value={delivery} onValueChange={setDelivery}>
            <SelectTrigger className="h-9 w-[150px] bg-white" aria-label="Delivery date filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any delivery date</SelectItem>
              <SelectItem value="today">Delivering today</SelectItem>
              <SelectItem value="tomorrow">Delivering tomorrow</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-9 bg-white" onClick={() => setSortBy(sortBy === "placed" ? "delivery" : "placed")}>
            <ArrowUpDown data-icon="inline-start" /> {sortBy === "placed" ? "Newest first" : "By delivery date"}
          </Button>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="animate-fade-up flex items-center justify-between rounded-lg bg-brand-deep px-4 py-2.5 text-sm text-white">
          <span>{selected.length} pending orders selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 hover:text-white" onClick={() => setSelected([])}>
              Clear
            </Button>
            <Button size="sm" className="bg-brand-accent text-brand-dark hover:bg-brand-accent/90" onClick={bulkConfirm}>
              <PackageCheck data-icon="inline-start" /> Confirm selected
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b bg-surface text-left text-xs text-muted-foreground">
              <th className="w-10 px-4 py-3">
                <Checkbox
                  checked={allSelected}
                  disabled={selectable.length === 0}
                  onCheckedChange={(v) => setSelected(v ? selectable : [])}
                  aria-label="Select all pending orders"
                />
              </th>
              <th className="px-3 py-3 font-medium">Order</th>
              <th className="px-3 py-3 font-medium">Customer</th>
              <th className="px-3 py-3 font-medium">Placed</th>
              <th className="px-3 py-3 font-medium">Requested delivery</th>
              <th className="px-3 py-3 text-right font-medium">Lines</th>
              <th className="px-3 py-3 text-right font-medium">Total</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="w-10 px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((o) => (
              <tr key={o.id} className={cn("transition-colors hover:bg-surface/70", selected.includes(o.id) && "bg-brand-tint/40")}>
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selected.includes(o.id)}
                    disabled={o.status !== "pending"}
                    onCheckedChange={(v) => setSelected((cur) => (v ? [...cur, o.id] : cur.filter((x) => x !== o.id)))}
                    aria-label={`Select ${o.number}`}
                  />
                </td>
                <td className="px-3 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-mono font-medium hover:text-brand">{o.number}</Link>
                  <p className="text-xs text-muted-foreground">{CHANNEL_LABELS[o.channel]}{o.poNumber ? ` · ${o.poNumber}` : ""}</p>
                </td>
                <td className="px-3 py-3">{customerName(o.customerId)}</td>
                <td className="px-3 py-3 text-muted-foreground">{formatDateTime(o.createdAt)}</td>
                <td className="px-3 py-3">
                  <span className={cn(o.requestedDeliveryDate === today && "font-medium text-brand")}>
                    {o.requestedDeliveryDate === today ? "Today" : formatDate(o.requestedDeliveryDate, { weekday: "short", year: undefined })}
                  </span>
                  <p className="text-xs text-muted-foreground">{o.deliveryWindow}</p>
                </td>
                <td className="tabular px-3 py-3 text-right">{o.lines.length}</td>
                <td className="tabular px-3 py-3 text-right font-medium">{formatMoney(o.total)}</td>
                <td className="px-3 py-3">
                  <StatusSelect order={o} />
                </td>
                <td className="px-3 py-3">
                  <Button asChild variant="ghost" size="icon-sm" aria-label={`Open ${o.number}`}>
                    <Link href={`/admin/orders/${o.id}`}>
                      <ChevronRight />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-12 text-center text-sm text-muted-foreground">No orders match these filters.</p>}
      </div>
    </div>
  )
}
