"use client"

import * as React from "react"
import { toast } from "sonner"
import type { Product, SellingUnit } from "@/types/catalog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductImage } from "@/components/shared/product-image"
import { useDemoStore } from "@/lib/demo-store"
import { tenantConfig } from "@/tenants"

export function ProductEditDialog({ product, onOpenChange }: { product: Product | null; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={product !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        {product && <EditForm key={product.id} product={product} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function EditForm({ product, onDone }: { product: Product; onDone: () => void }) {
  const store = useDemoStore()
  const [name, setName] = React.useState(product.name)
  const [description, setDescription] = React.useState(product.description)
  const [units, setUnits] = React.useState<SellingUnit[]>(product.units)
  const [stock, setStock] = React.useState(String(product.stock))
  const [reorderPoint, setReorderPoint] = React.useState(String(product.reorderPoint))
  const [active, setActive] = React.useState(product.active)
  const [featured, setFeatured] = React.useState(Boolean(product.featured))
  const symbol = tenantConfig.commerce.currencySymbol

  const setUnitPrice = (i: number, value: string) => {
    const n = Number(value)
    setUnits((cur) =>
      cur.map((u, idx) =>
        idx !== i ? u : u.pricing === "catch-weight" ? { ...u, pricePerKg: n } : { ...u, price: n }
      )
    )
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (units.some((u) => !Number.isFinite(u.pricing === "catch-weight" ? u.pricePerKg : u.price))) {
      toast.error("Please enter valid prices")
      return
    }
    store.updateProduct(product.id, {
      name: name.trim() || product.name,
      description,
      units,
      stock: Math.max(0, Number(stock) || 0),
      reorderPoint: Math.max(0, Number(reorderPoint) || 0),
      active,
      featured,
    })
    toast.success(`${name} updated`, { description: "Changes are live in the customer portal (this browser)." })
    onDone()
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <DialogHeader>
        <DialogTitle>Edit product</DialogTitle>
        <DialogDescription>
          <span className="font-mono">{product.sku}</span> · In production this would sync with the connected ERP.
        </DialogDescription>
      </DialogHeader>
      <div className="flex gap-4">
        <ProductImage src={product.image} alt="" className="size-20 shrink-0 rounded-lg" sizes="80px" />
        <div className="grid flex-1 gap-2">
          <Label htmlFor="p-name">Product name</Label>
          <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="p-desc">Description</Label>
        <Textarea id="p-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Packaging &amp; list prices</p>
        <div className="divide-y rounded-lg border">
          {units.map((u, i) => (
            <div key={u.code} className="grid items-center gap-3 p-3 sm:grid-cols-[1fr_180px]">
              <div>
                <p className="text-sm font-medium">{u.label}</p>
                <p className="text-xs text-muted-foreground">
                  {u.contents}
                  {u.pricing === "catch-weight" && " · catch weight"}
                </p>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs text-muted-foreground">{symbol}</span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  aria-label={`Price for ${u.label}`}
                  className="tabular pr-12 pl-10 text-right"
                  value={u.pricing === "catch-weight" ? (u.pricePerKg ?? 0) : (u.price ?? 0)}
                  onChange={(e) => setUnitPrice(i, e.target.value)}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                  {u.pricing === "catch-weight" ? "/kg" : `/${u.code}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="p-stock">Stock on hand ({product.units[0].label.toLowerCase()})</Label>
          <Input id="p-stock" type="number" min="0" step="any" value={stock} onChange={(e) => setStock(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="p-reorder">Reorder point</Label>
          <Input id="p-reorder" type="number" min="0" step="any" value={reorderPoint} onChange={(e) => setReorderPoint(e.target.value)} />
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2.5 text-sm">
          <Switch checked={active} onCheckedChange={setActive} /> Visible to customers
        </label>
        <label className="flex items-center gap-2.5 text-sm">
          <Switch checked={featured} onCheckedChange={setFeatured} /> Featured
        </label>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  )
}
