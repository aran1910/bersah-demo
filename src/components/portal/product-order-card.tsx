"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import type { Product } from "@/types/catalog"
import { ProductImage } from "@/components/shared/product-image"
import { StockBadge, StorageBadge } from "@/components/shared/badges"
import { useDemoStore } from "@/lib/demo-store"
import { cn } from "@/lib/utils"
import { AddButton, QtyFor, UnitPriceDisplay, UnitSelector, useAddToCart } from "./add-to-cart"

export function FavoriteButton({ productId, className }: { productId: string; className?: string }) {
  const { favorites, toggleFavorite } = useDemoStore()
  const active = favorites.includes(productId)
  return (
    <button
      type="button"
      onClick={() => toggleFavorite(productId)}
      aria-pressed={active}
      aria-label={active ? "Remove from favourites" : "Add to favourites"}
      className={cn(
        "grid size-8 place-items-center rounded-full bg-white/95 shadow-sm transition-colors hover:text-rose-600",
        active ? "text-rose-600" : "text-muted-foreground",
        className
      )}
    >
      <Heart className={cn("size-4", active && "fill-current")} />
    </button>
  )
}

export function ProductOrderCard({ product, eager }: { product: Product; eager?: boolean }) {
  const ctl = useAddToCart(product)
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-[0_16px_36px_-24px_rgba(12,51,84,0.5)]">
      <div className="relative">
        <Link href={`/portal/catalog/${product.slug}`} aria-label={product.name}>
          <ProductImage
            src={product.image}
            alt={product.name}
            eager={eager}
            className="aspect-[16/10]"
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </Link>
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <StorageBadge storage={product.storage} className="bg-white/95" />
        </div>
        <FavoriteButton productId={product.id} className="absolute top-2.5 right-2.5" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <span className="font-mono">{product.sku}</span>
          <StockBadge product={product} />
        </div>
        <Link href={`/portal/catalog/${product.slug}`} className="mt-2 leading-snug font-medium text-ink hover:text-brand">
          {product.name}
        </Link>
        <div className="mt-3">
          <UnitSelector product={product} value={ctl.unitCode} onChange={ctl.setUnitCode} size="sm" />
        </div>
        <UnitPriceDisplay product={product} unitCode={ctl.unitCode} size="md" className="mt-3" />
        <div className="mt-auto flex items-center gap-2 pt-4">
          <QtyFor unit={ctl.unit} qty={ctl.qty} setQty={ctl.setQty} size="sm" />
          <AddButton onClick={ctl.add} justAdded={ctl.justAdded} disabled={ctl.disabled} size="sm" className="flex-1" />
        </div>
        {ctl.inCart > 0 && <p className="mt-2 text-[11px] font-medium text-brand">In cart: {ctl.inCart}</p>}
      </div>
    </article>
  )
}

export function ProductOrderRow({ product }: { product: Product }) {
  const ctl = useAddToCart(product)
  return (
    <div className="grid grid-cols-[56px_1fr] items-center gap-x-4 gap-y-3 border-b px-4 py-3 last:border-b-0 md:grid-cols-[56px_minmax(0,2fr)_auto_minmax(150px,1fr)_auto]">
      <Link href={`/portal/catalog/${product.slug}`} className="row-span-2 md:row-span-1">
        <ProductImage src={product.image} alt={product.name} className="size-14 rounded-md" sizes="56px" />
      </Link>
      <div className="min-w-0">
        <Link href={`/portal/catalog/${product.slug}`} className="block truncate font-medium text-ink hover:text-brand">
          {product.name}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-mono">{product.sku}</span>
          <StorageBadge storage={product.storage} />
          <StockBadge product={product} />
        </div>
      </div>
      <div className="col-start-2 flex flex-wrap items-center gap-3 md:col-start-auto">
        <UnitSelector product={product} value={ctl.unitCode} onChange={ctl.setUnitCode} size="sm" />
      </div>
      <UnitPriceDisplay product={product} unitCode={ctl.unitCode} size="sm" className="col-start-2 md:col-start-auto" />
      <div className="col-start-2 flex items-center gap-2 md:col-start-auto">
        <QtyFor unit={ctl.unit} qty={ctl.qty} setQty={ctl.setQty} size="sm" />
        <AddButton onClick={ctl.add} justAdded={ctl.justAdded} disabled={ctl.disabled} size="sm" />
      </div>
    </div>
  )
}
