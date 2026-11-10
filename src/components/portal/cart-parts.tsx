"use client"

import Link from "next/link"
import { Info, Scale, Trash2, Truck } from "lucide-react"
import type { PricedLine, CartTotals } from "@/lib/pricing"
import { ProductImage } from "@/components/shared/product-image"
import { QuantityStepper } from "@/components/shared/quantity-stepper"
import { Progress } from "@/components/ui/progress"
import { useDemoStore } from "@/lib/demo-store"
import { formatKg, formatMoney } from "@/lib/format"
import { tenantConfig } from "@/tenants"
import { cn } from "@/lib/utils"

export function CartLineItem({ item, compact }: { item: PricedLine; compact?: boolean }) {
  const store = useDemoStore()
  const { product, unit, line } = item
  const isCw = unit.pricing === "catch-weight"
  return (
    <div className={cn("flex gap-3", compact ? "py-3" : "py-5")}>
      <Link href={`/portal/catalog/${product.slug}`} className="shrink-0">
        <ProductImage src={product.image} alt={product.name} className={cn("rounded-md", compact ? "size-14" : "size-20")} sizes="80px" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/portal/catalog/${product.slug}`} className="line-clamp-2 text-sm font-medium text-ink hover:text-brand">
              {product.name}
            </Link>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {unit.label} · {unit.contents}
            </p>
          </div>
          <p className="tabular shrink-0 text-sm font-medium">
            {isCw && <span className="text-muted-foreground">≈ </span>}
            {formatMoney(item.lineTotal)}
          </p>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
          <QuantityStepper
            value={line.quantity}
            onChange={(q) => store.setCartQuantity(product.id, unit.code, q)}
            min={unit.minQty}
            step={unit.step}
            allowZero
            size="sm"
            suffix={unit.code === "kg" ? "kg" : undefined}
          />
          <div className="flex items-center gap-3">
            <span className="tabular text-xs text-muted-foreground">
              {isCw ? (
                <span className="inline-flex items-center gap-1">
                  <Scale className="size-3" /> est. {formatKg(item.estimatedWeightKg ?? 0)} @ {formatMoney(item.unitPrice / (unit.nominalWeightKg || 1))}/kg
                </span>
              ) : (
                `${formatMoney(item.unitPrice)} each`
              )}
            </span>
            <button
              type="button"
              onClick={() => store.removeFromCart(product.id, unit.code)}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label={`Remove ${product.name}`}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FreeDeliveryProgress({ totals }: { totals: CartTotals }) {
  const { freeDeliveryThreshold } = tenantConfig.commerce
  const pct = Math.min(100, (totals.subtotal / freeDeliveryThreshold) * 100)
  return (
    <div className="rounded-lg bg-brand-tint/60 p-3">
      <p className="flex items-center gap-2 text-xs text-brand-dark">
        <Truck className="size-3.5" />
        {totals.amountToFreeDelivery > 0 ? (
          <span>
            Add <span className="tabular font-medium">{formatMoney(totals.amountToFreeDelivery)}</span> for free delivery
          </span>
        ) : (
          <span className="font-medium">Free delivery unlocked</span>
        )}
      </p>
      <Progress value={pct} className="mt-2 h-1.5 bg-white" />
    </div>
  )
}

export function CartSummaryRows({ totals }: { totals: CartTotals }) {
  return (
    <dl className="space-y-2.5 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted-foreground">List value</dt>
        <dd className="tabular">{formatMoney(totals.listSubtotal)}</dd>
      </div>
      {totals.savings > 0 && (
        <div className="flex justify-between text-emerald-700">
          <dt>Your account pricing</dt>
          <dd className="tabular">{formatMoney(-totals.savings)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd className="tabular">{formatMoney(totals.subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Delivery</dt>
        <dd className="tabular">{totals.deliveryFee === 0 ? "Free" : formatMoney(totals.deliveryFee)}</dd>
      </div>
      <div className="flex items-baseline justify-between border-t pt-3">
        <dt className="font-medium">{totals.hasCatchWeight ? "Estimated total" : "Total"}</dt>
        <dd className="tabular text-xl font-semibold text-ink">{formatMoney(totals.total)}</dd>
      </div>
      <p className="flex gap-1.5 text-[11px] leading-snug text-muted-foreground">
        <Info className="mt-px size-3 shrink-0" />
        <span>
          {totals.hasCatchWeight && "Weighed items are invoiced on actual weight. "}
          Applicable taxes are calculated on the invoice. {tenantConfig.commerce.priceDisclaimer}
        </span>
      </p>
    </dl>
  )
}
