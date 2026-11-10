"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Check, Plus, ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import type { Product, UnitCode } from "@/types/catalog"
import { Button } from "@/components/ui/button"
import { QuantityStepper } from "@/components/shared/quantity-stepper"
import { useDemoStore } from "@/lib/demo-store"
import { customerPricePerKg, customerUnitPrice, findUnit, round2, unitName } from "@/lib/pricing"
import { formatKg, formatMoney } from "@/lib/format"
import { cn } from "@/lib/utils"

export function useTier() {
  const { currentCustomer } = useDemoStore()
  return currentCustomer?.priceTier
}

/** Price for one selling unit, with per-kg detail for catch-weight items. */
export function UnitPriceDisplay({
  product,
  unitCode,
  size = "md",
  className,
}: {
  product: Product
  unitCode: UnitCode
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const tier = useTier()
  const unit = findUnit(product, unitCode)
  const price = customerUnitPrice(unit, tier)
  const perKg = customerPricePerKg(unit, tier)
  const big = size === "lg" ? "text-3xl" : size === "md" ? "text-xl" : "text-base"
  if (unit.pricing === "catch-weight" && perKg !== undefined) {
    return (
      <div className={className}>
        <p className={cn("tabular font-medium text-ink", big)}>
          {formatMoney(perKg)}
          <span className="ml-1 text-sm font-normal text-muted-foreground">/ kg</span>
        </p>
        <p className="tabular text-xs text-muted-foreground">
          ≈ {formatMoney(price)} per {unit.label.toLowerCase()} · est. {formatKg(unit.nominalWeightKg ?? 0)}
        </p>
      </div>
    )
  }
  return (
    <div className={className}>
      <p className={cn("tabular font-medium text-ink", big)}>
        {formatMoney(price)}
        <span className="ml-1 text-sm font-normal text-muted-foreground">/ {unit.code === "kg" ? "kg" : unit.label.toLowerCase()}</span>
      </p>
      <p className="text-xs text-muted-foreground">{unit.contents}</p>
    </div>
  )
}

export function UnitSelector({
  product,
  value,
  onChange,
  size = "md",
}: {
  product: Product
  value: UnitCode
  onChange: (code: UnitCode) => void
  size?: "sm" | "md"
}) {
  if (product.units.length === 1) {
    return (
      <span className={cn("inline-flex items-center rounded-md bg-muted px-2.5 font-medium text-muted-foreground", size === "sm" ? "h-8 text-xs" : "h-9 text-sm")}>
        {product.units[0].label}
      </span>
    )
  }
  return (
    <div role="radiogroup" aria-label="Order unit" className="inline-flex rounded-md bg-muted p-0.5">
      {product.units.map((u) => (
        <button
          key={u.code}
          type="button"
          role="radio"
          aria-checked={value === u.code}
          onClick={() => onChange(u.code)}
          className={cn(
            "rounded-[5px] px-2.5 font-medium transition-all",
            size === "sm" ? "h-7 text-xs" : "h-8 text-sm",
            value === u.code ? "bg-white text-brand shadow-sm" : "text-muted-foreground hover:text-ink"
          )}
        >
          {u.label}
        </button>
      ))}
    </div>
  )
}

/** Unit + quantity + add button, shared by product cards, rows and detail pages. */
export function useAddToCart(product: Product) {
  const store = useDemoStore()
  const router = useRouter()
  const [unitCode, setUnitCodeState] = React.useState<UnitCode>(product.units[0].code)
  const unit = findUnit(product, unitCode)
  const [qty, setQty] = React.useState(unit.minQty)
  const [justAdded, setJustAdded] = React.useState(false)

  const setUnitCode = (code: UnitCode) => {
    setUnitCodeState(code)
    setQty(findUnit(product, code).minQty)
  }

  const inCart = store.cart
    .filter((l) => l.productId === product.id)
    .reduce((sum, l) => sum + l.quantity, 0)

  const add = () => {
    store.addToCart(product.id, unitCode, qty)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1400)
    toast.success(`${product.name} added`, {
      description: `${qty} ${unitName(unit, qty)} · ${unit.pricing === "catch-weight" ? "≈ " : ""}${formatMoney(round2(customerUnitPrice(unit, store.currentCustomer?.priceTier) * qty))}`,
      action: { label: "View cart", onClick: () => router.push("/portal/cart") },
    })
  }

  return { unitCode, setUnitCode, unit, qty, setQty, add, justAdded, inCart, disabled: !product.active }
}

export function AddButton({
  onClick,
  justAdded,
  disabled,
  size = "md",
  className,
  label = "Add",
}: {
  onClick: () => void
  justAdded: boolean
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
  label?: string
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "transition-colors",
        size === "sm" ? "h-8 px-3" : size === "lg" ? "h-11 px-5 text-[15px]" : "h-10 px-4",
        justAdded && "bg-emerald-600 hover:bg-emerald-600",
        className
      )}
    >
      {justAdded ? <Check data-icon="inline-start" /> : size === "lg" ? <ShoppingCart data-icon="inline-start" /> : <Plus data-icon="inline-start" />}
      {justAdded ? "Added" : label}
    </Button>
  )
}

export function QtyFor({
  unit,
  qty,
  setQty,
  size = "md",
}: {
  unit: ReturnType<typeof findUnit>
  qty: number
  setQty: (n: number) => void
  size?: "sm" | "md"
}) {
  return (
    <QuantityStepper
      value={qty}
      onChange={setQty}
      min={unit.minQty}
      step={unit.step}
      size={size}
      suffix={unit.code === "kg" ? "kg" : undefined}
    />
  )
}
