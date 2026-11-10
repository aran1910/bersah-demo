"use client"

import * as React from "react"
import { toast } from "sonner"
import { Minus, PackagePlus, Plus, Search } from "lucide-react"
import type { StorageType } from "@/types/catalog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/shared/page-header"
import { ProductImage } from "@/components/shared/product-image"
import { DemoTag, StockBadge, StorageBadge } from "@/components/shared/badges"
import { useDemoStore } from "@/lib/demo-store"
import { findUnit, listUnitPrice, stockLevel, unitName } from "@/lib/pricing"
import { OPEN_STATUSES } from "@/lib/orders"
import { formatMoney, formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

const ZONES: { id: StorageType | "all"; label: string }[] = [
  { id: "all", label: "All zones" },
  { id: "frozen", label: "Freezer" },
  { id: "chilled", label: "Cooler" },
  { id: "ambient", label: "Dry store" },
]

export function AdminInventory() {
  const store = useDemoStore()
  const [zone, setZone] = React.useState<StorageType | "all">("all")
  const [lowOnly, setLowOnly] = React.useState(false)
  const [q, setQ] = React.useState("")
  const staff = store.session?.staffName ?? "Staff"

  const active = store.products.filter((p) => p.active)
  const low = active.filter((p) => stockLevel(p) === "low")
  const out = active.filter((p) => stockLevel(p) === "out")
  const value = active.reduce((s, p) => s + p.stock * listUnitPrice(p.units[0]), 0)

  // Demand from open orders, in each product's stock unit.
  const demand = new Map<string, number>()
  store.orders
    .filter((o) => OPEN_STATUSES.includes(o.status))
    .forEach((o) =>
      o.lines.forEach((l) => {
        const p = store.products.find((x) => x.id === l.productId)
        if (!p) return
        demand.set(p.id, (demand.get(p.id) ?? 0) + l.quantity * (findUnit(p, l.unitCode).stockUnits ?? 1))
      })
    )

  const rows = active
    .filter((p) => zone === "all" || p.storage === zone)
    .filter((p) => !lowOnly || stockLevel(p) !== "in-stock")
    .filter((p) => !q || `${p.name} ${p.sku}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.stock / Math.max(1, a.reorderPoint) - b.stock / Math.max(1, b.reorderPoint))

  const receive = (id: string, name: string, qty: number) => {
    store.adjustStock(id, qty)
    toast.success(`Received ${qty} into stock`, { description: `${name} · by ${staff}` })
  }

  const cards = [
    { label: "Active SKUs", value: formatNumber(active.length) },
    { label: "Low stock", value: formatNumber(low.length), tone: "text-amber-600" },
    { label: "Out of stock", value: formatNumber(out.length), tone: "text-red-600" },
    { label: "Stock value (list)", value: formatMoney(value) },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="Inventory"
        description="Stock on hand by storage zone. Placing an order reserves stock automatically."
        actions={<DemoTag>Illustrative stock levels</DemoTag>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border bg-white p-4">
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <p className={cn("tabular mt-1.5 text-2xl font-semibold", c.tone)}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-lg border bg-white p-1">
          {ZONES.map((z) => (
            <button
              key={z.id}
              type="button"
              onClick={() => setZone(z.id)}
              className={cn("shrink-0 rounded-md px-3 py-1.5 text-sm", zone === z.id ? "bg-brand text-white" : "text-ink/70 hover:bg-muted")}
            >
              {z.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="h-9 bg-white pl-9" />
          </div>
          <Label className="flex items-center gap-2 font-normal">
            <Switch checked={lowOnly} onCheckedChange={setLowOnly} /> Needs attention only
          </Label>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[960px] text-sm">
          <thead>
            <tr className="border-b bg-surface text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-3 py-3 font-medium">Zone</th>
              <th className="px-3 py-3 font-medium">Availability</th>
              <th className="px-3 py-3 text-right font-medium">On hand</th>
              <th className="px-3 py-3 text-right font-medium">Reorder at</th>
              <th className="px-3 py-3 text-right font-medium">Open demand</th>
              <th className="px-3 py-3 font-medium">Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((p) => {
              const level = stockLevel(p)
              const pct = Math.min(100, (p.stock / Math.max(1, p.reorderPoint * 3)) * 100)
              const unit = p.units[0]
              const step = unit.code === "kg" ? 10 : 1
              return (
                <tr key={p.id} className="hover:bg-surface/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ProductImage src={p.image} alt="" className="size-10 shrink-0 rounded-md" sizes="40px" />
                      <div className="min-w-0">
                        <p className="font-medium">{p.name}</p>
                        <p className="font-mono text-xs text-muted-foreground">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3"><StorageBadge storage={p.storage} /></td>
                  <td className="w-48 px-3 py-3">
                    <StockBadge product={p} />
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full transition-all", level === "out" ? "bg-red-500" : level === "low" ? "bg-amber-500" : "bg-emerald-500")}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </td>
                  <td className="tabular px-3 py-3 text-right font-medium">
                    {formatNumber(p.stock, 1)} <span className="font-normal text-muted-foreground">{unitName(unit, p.stock)}</span>
                  </td>
                  <td className="tabular px-3 py-3 text-right text-muted-foreground">{formatNumber(p.reorderPoint)}</td>
                  <td className="tabular px-3 py-3 text-right">{demand.get(p.id) ? formatNumber(demand.get(p.id)!, 1) : "—"}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon-sm" onClick={() => store.adjustStock(p.id, -step)} aria-label={`Remove ${step} from ${p.name}`}>
                        <Minus />
                      </Button>
                      <Button variant="outline" size="icon-sm" onClick={() => store.adjustStock(p.id, step)} aria-label={`Add ${step} to ${p.name}`}>
                        <Plus />
                      </Button>
                      {level !== "in-stock" && (
                        <Button size="sm" variant="secondary" className="ml-1" onClick={() => receive(p.id, p.name, p.reorderPoint * 2)}>
                          <PackagePlus data-icon="inline-start" /> Receive {p.reorderPoint * 2}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-12 text-center text-sm text-muted-foreground">Nothing to show — all stock levels are healthy.</p>}
      </div>
    </div>
  )
}
