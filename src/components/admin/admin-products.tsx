"use client"

import * as React from "react"
import { Download, Pencil, Search, Star } from "lucide-react"
import type { Product } from "@/types/catalog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/shared/page-header"
import { ProductImage } from "@/components/shared/product-image"
import { StockBadge, StorageBadge } from "@/components/shared/badges"
import { useDemoStore } from "@/lib/demo-store"
import { listUnitPrice } from "@/lib/pricing"
import { formatMoney, formatNumber, toDateOnly } from "@/lib/format"
import { downloadCsv } from "@/lib/csv"
import { getSubcategoryName } from "@/lib/catalog"
import { tenantConfig } from "@/tenants"
import { toast } from "sonner"
import { ProductEditDialog } from "./product-edit-dialog"
import { ImportDialog } from "./import-dialog"

export function AdminProducts() {
  const store = useDemoStore()
  const [q, setQ] = React.useState("")
  const [category, setCategory] = React.useState("all")
  const [visibility, setVisibility] = React.useState("all")
  const [editing, setEditing] = React.useState<Product | null>(null)

  const filtered = store.products.filter((p) => {
    if (category !== "all" && p.categoryId !== category) return false
    if (visibility === "active" && !p.active) return false
    if (visibility === "hidden" && p.active) return false
    if (q && !`${p.name} ${p.sku}`.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })
  const catName = (id: string) => tenantConfig.categories.find((c) => c.id === id)?.name ?? id

  const exportCsv = () => {
    downloadCsv(`products-${toDateOnly(new Date())}.csv`, [
      ["sku", "name", "category", "subcategory", "unit", "contents", "pricing", "price", "price_per_kg", "stock", "reorder_point", "storage", "active"],
      ...store.products.flatMap((p) =>
        p.units.map((u) => [
          p.sku,
          p.name,
          catName(p.categoryId),
          getSubcategoryName(p.categoryId, p.subcategoryId),
          u.label,
          u.contents,
          u.pricing,
          u.price?.toFixed(2),
          u.pricePerKg?.toFixed(2),
          p.stock,
          p.reorderPoint,
          p.storage,
          p.active ? "yes" : "no",
        ])
      ),
    ])
    toast.success("Catalog exported to CSV")
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Products"
        description={`${store.products.length} products across ${tenantConfig.categories.length} categories · prices are illustrative list prices`}
        actions={
          <>
            <ImportDialog />
            <Button variant="outline" className="bg-white" onClick={exportCsv}>
              <Download data-icon="inline-start" /> Export
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or SKU" className="h-9 bg-white pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-9 w-[170px] bg-white" aria-label="Category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {tenantConfig.categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={visibility} onValueChange={setVisibility}>
          <SelectTrigger className="h-9 w-[150px] bg-white" aria-label="Visibility">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All products</SelectItem>
            <SelectItem value="active">Visible</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[1040px] text-sm">
          <thead>
            <tr className="border-b bg-surface text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-3 py-3 font-medium">Category</th>
              <th className="px-3 py-3 font-medium">Packaging</th>
              <th className="px-3 py-3 text-right font-medium">List price</th>
              <th className="px-3 py-3 font-medium">Stock</th>
              <th className="px-3 py-3 font-medium">Visible</th>
              <th className="w-12 px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((p) => (
              <tr key={p.id} className={p.active ? "hover:bg-surface/60" : "bg-muted/30 text-muted-foreground"}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ProductImage src={p.image} alt="" className="size-12 shrink-0 rounded-md" sizes="48px" />
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 font-medium text-ink">
                        {p.name}
                        {p.featured && <Star className="size-3.5 fill-amber-400 text-amber-400" aria-label="Featured" />}
                      </p>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono">{p.sku}</span>
                        <StorageBadge storage={p.storage} />
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <p>{catName(p.categoryId)}</p>
                  <p className="text-xs text-muted-foreground">{getSubcategoryName(p.categoryId, p.subcategoryId)}</p>
                </td>
                <td className="px-3 py-3">
                  {p.units.map((u) => (
                    <p key={u.code} className="text-xs">
                      <span className="font-medium">{u.label}</span> <span className="text-muted-foreground">· {u.contents}</span>
                    </p>
                  ))}
                </td>
                <td className="tabular px-3 py-3 text-right">
                  {p.units.map((u) => (
                    <p key={u.code} className="text-xs">
                      {u.pricing === "catch-weight" ? `${formatMoney(u.pricePerKg ?? 0)}/kg` : formatMoney(listUnitPrice(u))}
                    </p>
                  ))}
                </td>
                <td className="px-3 py-3">
                  <StockBadge product={p} />
                  <p className="tabular mt-1 text-xs text-muted-foreground">
                    {formatNumber(p.stock, 1)} {p.units[0].label.toLowerCase()}
                  </p>
                </td>
                <td className="px-3 py-3">
                  <Switch
                    checked={p.active}
                    onCheckedChange={(v) => {
                      store.updateProduct(p.id, { active: v })
                      toast.success(`${p.name} ${v ? "visible" : "hidden"} in the portal`)
                    }}
                    aria-label={`${p.name} visible to customers`}
                  />
                </td>
                <td className="px-3 py-3">
                  <Button variant="ghost" size="icon-sm" onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`}>
                    <Pencil />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-12 text-center text-sm text-muted-foreground">No products match.</p>}
      </div>

      <ProductEditDialog product={editing} onOpenChange={(o) => !o && setEditing(null)} />
    </div>
  )
}
