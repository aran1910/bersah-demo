"use client"

import Link from "next/link"
import { ChevronLeft, Info, PackageX, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductImage } from "@/components/shared/product-image"
import { DemoTag, StockBadge, StorageBadge } from "@/components/shared/badges"
import { useDemoStore } from "@/lib/demo-store"
import { getRelatedProducts, getSubcategoryName, getCategory } from "@/lib/catalog"
import { customerPricePerKg, customerUnitPrice, listUnitPrice, round2, unitName } from "@/lib/pricing"
import { formatKg, formatMoney, formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"
import { AddButton, QtyFor, useAddToCart } from "./add-to-cart"
import { FavoriteButton, ProductOrderCard } from "./product-order-card"

export function PortalProductDetail({ slug }: { slug: string }) {
  const store = useDemoStore()
  const product = store.products.find((p) => p.slug === slug)
  if (!product) {
    return (
      <div className="rounded-xl border bg-white p-14 text-center">
        <PackageX className="mx-auto size-10 text-muted-foreground" />
        <p className="mt-4 font-medium">Product not found</p>
        <Button asChild className="mt-5"><Link href="/portal/catalog">Back to catalog</Link></Button>
      </div>
    )
  }
  return <Detail key={product.id} productId={product.id} />
}

function Detail({ productId }: { productId: string }) {
  const store = useDemoStore()
  const product = store.products.find((p) => p.id === productId)!
  const tier = store.currentCustomer?.priceTier
  const ctl = useAddToCart(product)
  const category = getCategory(product.categoryId)
  const related = getRelatedProducts(product, 3, store.products.filter((p) => p.active))
  const unitPrice = customerUnitPrice(ctl.unit, tier)
  const lineTotal = round2(unitPrice * ctl.qty)
  const isCw = ctl.unit.pricing === "catch-weight"

  return (
    <div className="space-y-12">
      <Link href={`/portal/catalog?category=${product.categoryId}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand">
        <ChevronLeft className="size-4" /> {category?.name}
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative">
          <ProductImage src={product.image} alt={product.name} className="aspect-[4/3] rounded-xl" sizes="(min-width:1024px) 50vw, 100vw" eager />
          <FavoriteButton productId={product.id} className="absolute top-4 right-4 size-10" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StorageBadge storage={product.storage} />
            <StockBadge product={product} />
            {product.brand && <span className="rounded-full bg-brand-tint px-2 py-0.5 text-[11px] font-medium text-brand">{product.brand}</span>}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {category?.name} · {getSubcategoryName(product.categoryId, product.subcategoryId)} · <span className="font-mono">{product.sku}</span>
          </p>
          <h1 className="font-display mt-1.5 text-3xl leading-tight text-ink sm:text-4xl">{product.name}</h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">{product.description}</p>

          <fieldset className="mt-7">
            <legend className="mb-3 text-sm font-medium">Choose how to order</legend>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {product.units.map((u) => {
                const selected = ctl.unitCode === u.code
                const perKg = customerPricePerKg(u, tier)
                return (
                  <button
                    key={u.code}
                    type="button"
                    onClick={() => ctl.setUnitCode(u.code)}
                    aria-pressed={selected}
                    className={cn(
                      "rounded-lg border p-4 text-left transition-all",
                      selected ? "border-brand bg-brand-tint/50 ring-1 ring-brand" : "bg-white hover:border-brand/40"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{u.label}</span>
                      <span className="tabular text-sm font-semibold text-ink">
                        {u.pricing === "catch-weight" ? `${formatMoney(perKg ?? 0)}/kg` : formatMoney(customerUnitPrice(u, tier))}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{u.contents}</p>
                    {u.pricing === "catch-weight" && (
                      <p className="mt-1 text-xs text-muted-foreground">≈ {formatMoney(customerUnitPrice(u, tier))} each</p>
                    )}
                    {tier && customerUnitPrice(u, tier) < listUnitPrice(u) && (
                      <p className="mt-1.5 text-[11px] text-emerald-700 line-through decoration-emerald-700/40">
                        List {formatMoney(listUnitPrice(u))}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-6 rounded-xl border bg-white p-5">
            <div className="flex flex-wrap items-center gap-3">
              <QtyFor unit={ctl.unit} qty={ctl.qty} setQty={ctl.setQty} />
              <span className="text-sm text-muted-foreground">{unitName(ctl.unit, ctl.qty)}</span>
              <div className="ml-auto text-right">
                <p className="tabular text-2xl font-semibold text-ink">
                  {isCw && <span className="text-base font-normal text-muted-foreground">≈ </span>}
                  {formatMoney(lineTotal)}
                </p>
                {isCw && (
                  <p className="text-xs text-muted-foreground">est. {formatKg((ctl.unit.nominalWeightKg ?? 0) * ctl.qty)}</p>
                )}
              </div>
            </div>
            <AddButton onClick={ctl.add} justAdded={ctl.justAdded} disabled={ctl.disabled} size="lg" className="mt-4 w-full" label="Add to order" />
            {product.stock <= 0 && (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-amber-700">
                <Info className="size-3.5" /> Currently out of stock — your order will be placed on backorder.
              </p>
            )}
            {ctl.inCart > 0 && <p className="mt-3 text-xs font-medium text-brand">Already in your cart: {ctl.inCart}</p>}
          </div>

          {isCw && (
            <p className="mt-4 flex gap-3 rounded-lg bg-brand-tint/60 p-4 text-sm text-brand-dark">
              <Scale className="mt-0.5 size-4 shrink-0" />
              Variable-weight item. Your invoice uses the actual weight picked at the warehouse; the price shown is an estimate.
            </p>
          )}

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t pt-6 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Availability</dt>
              <dd className="mt-0.5 font-medium">
                {formatNumber(product.stock, 1)} {unitName(product.units[0], product.stock)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Storage</dt>
              <dd className="mt-0.5 font-medium capitalize">{product.storage}</dd>
            </div>
            {product.origin && (
              <div>
                <dt className="text-muted-foreground">Sourced from</dt>
                <dd className="mt-0.5 font-medium">{product.origin}</dd>
              </div>
            )}
          </dl>
          <DemoTag className="mt-6">Illustrative price &amp; stock</DemoTag>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="font-display text-2xl">Customers also order</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductOrderCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
