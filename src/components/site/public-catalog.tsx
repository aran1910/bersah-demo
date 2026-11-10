"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import type { Category, Product, StorageType } from "@/types/catalog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PublicProductCard } from "./public-product-card"
import { cn } from "@/lib/utils"

const STORAGE_FILTERS: { id: StorageType | "all"; label: string }[] = [
  { id: "all", label: "All storage" },
  { id: "frozen", label: "Frozen" },
  { id: "chilled", label: "Chilled" },
  { id: "ambient", label: "Ambient" },
]

/** Search and filter the public catalog (no prices — those are shown after sign-in). */
export function PublicCatalog({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState<string>("all")
  const [storage, setStorage] = React.useState<StorageType | "all">("all")

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (category !== "all" && p.categoryId !== category) return false
      if (storage !== "all" && p.storage !== storage) return false
      if (!q) return true
      return [p.name, p.shortDescription, p.sku, p.brand ?? "", ...p.tags].join(" ").toLowerCase().includes(q)
    })
  }, [products, query, category, storage])

  const reset = () => {
    setQuery("")
    setCategory("all")
    setStorage("all")
  }

  return (
    <div>
      <div className="sticky top-[72px] z-20 -mx-4 border-b bg-white/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:px-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative lg:w-80">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, e.g. shrimp, ribeye…"
              className="h-10 pl-9"
              aria-label="Search products"
            />
          </div>
          <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:pb-0">
            {[{ id: "all", name: "All" }, ...categories].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={cn(
                  "h-9 shrink-0 rounded-full border px-3.5 text-sm transition-colors",
                  category === c.id
                    ? "border-brand bg-brand text-white"
                    : "border-border bg-white text-ink/75 hover:border-brand/40 hover:text-brand"
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
          <select
            value={storage}
            onChange={(e) => setStorage(e.target.value as StorageType | "all")}
            className="h-9 rounded-md border border-input bg-white px-3 text-sm lg:ml-auto"
            aria-label="Storage type"
          >
            {STORAGE_FILTERS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        Showing <span className="font-medium text-ink">{filtered.length}</span> of {products.length} sample products
      </p>

      {filtered.length > 0 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <PublicProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed p-12 text-center">
          <p className="font-medium">No products match your search.</p>
          <Button variant="outline" className="mt-4" onClick={reset}>
            <X data-icon="inline-start" /> Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
