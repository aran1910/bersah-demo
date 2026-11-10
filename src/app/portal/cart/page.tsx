"use client"

import Link from "next/link"
import { ArrowRight, ShoppingCart, Trash2, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { CartLineItem, CartSummaryRows, FreeDeliveryProgress } from "@/components/portal/cart-parts"
import { useDemoStore } from "@/lib/demo-store"
import { cartTotals, priceCartLines } from "@/lib/pricing"
import { formatMoney } from "@/lib/format"
import { tenantConfig } from "@/tenants"
import { PortalReady } from "@/components/portal/portal-shell"

function CartPage() {
  const store = useDemoStore()
  const customer = store.currentCustomer!
  const priced = priceCartLines(store.cart, store.products, customer.priceTier)
  const totals = cartTotals(priced)

  if (priced.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border bg-white p-12 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-brand-tint text-brand">
          <ShoppingCart className="size-7" />
        </span>
        <h1 className="font-display mt-5 text-2xl">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Browse the catalog or reorder a previous delivery in one click.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild><Link href="/portal/catalog">Browse catalog</Link></Button>
          <Button asChild variant="outline"><Link href="/portal/orders">Order history</Link></Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your cart"
        description={`${priced.length} ${priced.length === 1 ? "line" : "lines"} for ${customer.businessName}`}
        actions={
          <Button variant="ghost" className="text-muted-foreground hover:text-red-600" onClick={store.clearCart}>
            <Trash2 data-icon="inline-start" /> Empty cart
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="divide-y rounded-xl border bg-white px-5">
          {priced.map((item) => (
            <CartLineItem key={`${item.product.id}-${item.unit.code}`} item={item} />
          ))}
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5 rounded-xl border bg-white p-5">
            <h2 className="font-medium">Order summary</h2>
            <FreeDeliveryProgress totals={totals} />
            <CartSummaryRows totals={totals} />
            {!totals.meetsMinimum && (
              <p className="flex gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
                <TriangleAlert className="size-4 shrink-0" />
                Minimum order value is {formatMoney(tenantConfig.commerce.minimumOrderValue)}. Add {formatMoney(totals.amountToMinimum)} more to check out.
              </p>
            )}
            <Button asChild={totals.meetsMinimum} size="lg" className="h-11 w-full" disabled={!totals.meetsMinimum}>
              {totals.meetsMinimum ? (
                <Link href="/portal/checkout">
                  Continue to checkout <ArrowRight data-icon="inline-end" />
                </Link>
              ) : (
                <span>Continue to checkout</span>
              )}
            </Button>
            <Button asChild variant="outline" className="h-10 w-full">
              <Link href="/portal/catalog">Continue shopping</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <PortalReady>
      <CartPage />
    </PortalReady>
  )
}
