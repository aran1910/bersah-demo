import Link from "next/link"
import { ArrowUpRight, Scale } from "lucide-react"
import type { Product } from "@/types/catalog"
import { ProductImage } from "@/components/shared/product-image"
import { StorageBadge } from "@/components/shared/badges"
import { getCategory, getSubcategoryName, productHref } from "@/lib/catalog"

export function PublicProductCard({ product }: { product: Product }) {
  const category = getCategory(product.categoryId)
  const hasCatchWeight = product.units.some((u) => u.pricing === "catch-weight")
  return (
    <Link
      href={productHref(product)}
      className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-[0_18px_40px_-24px_rgba(12,51,84,0.45)]"
    >
      <div className="relative">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="aspect-[4/3]"
          imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <StorageBadge storage={product.storage} className="bg-white/95" />
          {product.brand && (
            <span className="rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-medium text-brand-dark">{product.brand}</span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-muted-foreground">
          {category?.name} · {getSubcategoryName(product.categoryId, product.subcategoryId)}
        </p>
        <h3 className="mt-1.5 text-[17px] leading-snug font-medium text-ink group-hover:text-brand">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed font-light text-muted-foreground">{product.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            {hasCatchWeight && <Scale className="size-3.5" aria-hidden="true" />}
            {product.units.map((u) => u.label).join(" · ")}
          </span>
          <span className="flex items-center gap-1 font-medium text-brand">
            Details
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
