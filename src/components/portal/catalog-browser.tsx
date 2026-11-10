"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Heart, LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react"
import type { StorageType } from "@/types/catalog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useDemoStore } from "@/lib/demo-store"
import { productListPriceFrom } from "@/lib/pricing"
import { tenantConfig } from "@/tenants"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/shared/page-header"
import { ProductOrderCard, ProductOrderRow } from "./product-order-card"

type Sort = "featured" | "name" | "price-asc" | "price-desc"

const STORAGE: { id: StorageType; label: string }[] = [
  { id: "frozen", label: "Frozen" },
  { id: "chilled", label: "Chilled" },
  { id: "ambient", label: "Ambient" },
]

export function CatalogBrowser() {
  const store = useDemoStore()
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const category = params.get("category") ?? "all"
  const [query, setQuery] = React.useState(params.get("q") ?? "")
  const [subcategory, setSubcategory] = React.useState<string>("all")
  const [storage, setStorage] = React.useState<StorageType[]>([])
  const [inStockOnly, setInStockOnly] = React.useState(false)
  const [favoritesOnly, setFavoritesOnly] = React.useState(false)
  const [sort, setSort] = React.useState<Sort>("featured")
  const [view, setView] = React.useState<"grid" | "list">("grid")

  // Keep the search box in sync when the header search navigates here.
  const urlQuery = params.get("q") ?? ""
  const [prevUrlQuery, setPrevUrlQuery] = React.useState(urlQuery)
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery)
    setQuery(urlQuery)
  }

  const setCategory = (id: string) => {
    setSubcategory("all")
    const next = new URLSearchParams(params.toString())
    if (id === "all") next.delete("category")
    else next.set("category", id)
    router.replace(`${pathname}${next.toString() ? `?${next}` : ""}`, { scroll: false })
  }

  const activeCategory = tenantConfig.categories.find((c) => c.id === category)
  const products = store.products.filter((p) => p.active)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = products.filter((p) => {
      if (category !== "all" && p.categoryId !== category) return false
      if (subcategory !== "all" && p.subcategoryId !== subcategory) return false
      if (storage.length && !storage.includes(p.storage)) return false
      if (inStockOnly && p.stock <= 0) return false
      if (favoritesOnly && !store.favorites.includes(p.id)) return false
      if (!q) return true
      return [p.name, p.sku, p.shortDescription, p.brand ?? "", ...p.tags].join(" ").toLowerCase().includes(q)
    })
    const sorted = [...list]
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === "price-asc") sorted.sort((a, b) => productListPriceFrom(a) - productListPriceFrom(b))
    if (sort === "price-desc") sorted.sort((a, b) => productListPriceFrom(b) - productListPriceFrom(a))
    if (sort === "featured") sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    return sorted
  }, [products, query, category, subcategory, storage, inStockOnly, favoritesOnly, sort, store.favorites])

  const activeFilterCount = storage.length + Number(inStockOnly) + Number(favoritesOnly) + Number(subcategory !== "all")
  const clearAll = () => {
    setQuery("")
    setSubcategory("all")
    setStorage([])
    setInStockOnly(false)
    setFavoritesOnly(false)
    setCategory("all")
  }

  const filters = (
    <div className="space-y-7">
      <div>
        <h3 className="eyebrow mb-3 text-muted-foreground">Category</h3>
        <ul className="space-y-0.5">
          {[{ id: "all", name: "All products" }, ...tenantConfig.categories].map((c) => {
            const count = c.id === "all" ? products.length : products.filter((p) => p.categoryId === c.id).length
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors",
                    category === c.id ? "bg-brand-tint font-medium text-brand" : "text-ink/75 hover:bg-muted"
                  )}
                >
                  {c.name}
                  <span className="tabular text-xs text-muted-foreground">{count}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      {activeCategory && activeCategory.subcategories.length > 1 && (
        <div>
          <h3 className="eyebrow mb-3 text-muted-foreground">{activeCategory.name}</h3>
          <div className="flex flex-wrap gap-1.5">
            {[{ id: "all", name: "All" }, ...activeCategory.subcategories].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSubcategory(s.id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  subcategory === s.id ? "border-brand bg-brand text-white" : "bg-white hover:border-brand/40"
                )}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <h3 className="eyebrow mb-3 text-muted-foreground">Storage</h3>
        <div className="space-y-2.5">
          {STORAGE.map((s) => (
            <label key={s.id} className="flex items-center gap-2.5 text-sm">
              <Checkbox
                checked={storage.includes(s.id)}
                onCheckedChange={(v) => setStorage((cur) => (v ? [...cur, s.id] : cur.filter((x) => x !== s.id)))}
              />
              {s.label}
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="instock" className="font-normal">In stock only</Label>
          <Switch id="instock" checked={inStockOnly} onCheckedChange={setInStockOnly} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="favs" className="flex items-center gap-1.5 font-normal">
            <Heart className="size-3.5 text-rose-600" /> Favourites
          </Label>
          <Switch id="favs" checked={favoritesOnly} onCheckedChange={setFavoritesOnly} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title={activeCategory ? activeCategory.name : "Order products"}
        description={activeCategory ? activeCategory.description : "Your account prices are shown. Weighed items show an estimate per piece."}
      />

      <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">{filters}</div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-white p-2">
            <div className="relative min-w-0 flex-1 basis-60">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, item code or keyword"
                className="h-10 border-0 pl-9 shadow-none focus-visible:ring-0"
                aria-label="Search products"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted" aria-label="Clear search">
                  <X className="size-4" />
                </button>
              )}
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-10 lg:hidden">
                  <SlidersHorizontal data-icon="inline-start" /> Filters
                  {activeFilterCount > 0 && <span className="ml-1 rounded-full bg-brand px-1.5 text-[10px] text-white">{activeFilterCount}</span>}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Narrow down the catalog.</SheetDescription>
                </SheetHeader>
                <div className="px-4 pb-8">{filters}</div>
              </SheetContent>
            </Sheet>
            <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
              <SelectTrigger className="h-10 w-[170px]" aria-label="Sort products">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured first</SelectItem>
                <SelectItem value="name">Name A–Z</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex rounded-md border p-0.5" role="group" aria-label="View">
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-pressed={view === "grid"}
                className={cn("grid size-8 place-items-center rounded", view === "grid" ? "bg-brand text-white" : "text-muted-foreground hover:bg-muted")}
                aria-label="Grid view"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                aria-pressed={view === "list"}
                className={cn("grid size-8 place-items-center rounded", view === "list" ? "bg-brand text-white" : "text-muted-foreground hover:bg-muted")}
                aria-label="Quick-order list view"
              >
                <List className="size-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground" aria-live="polite">
            <span>
              <span className="font-medium text-ink">{filtered.length}</span> products
              {query && (
                <>
                  {" "}matching &ldquo;<span className="text-ink">{query}</span>&rdquo;
                </>
              )}
            </span>
            {(activeFilterCount > 0 || query || category !== "all") && (
              <button type="button" onClick={clearAll} className="text-brand hover:underline">
                Clear all
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed bg-white p-14 text-center">
              <p className="font-medium">No products found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a different search term or clear your filters.</p>
              <Button variant="outline" className="mt-5" onClick={clearAll}>Clear filters</Button>
            </div>
          ) : view === "grid" ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p, i) => (
                <ProductOrderCard key={p.id} product={p} eager={i < 3} />
              ))}
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-xl border bg-white">
              {filtered.map((p) => (
                <ProductOrderRow key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
