"use client"

import { Check, Scale, X } from "lucide-react"
import type { Order, OrderStatus } from "@/types/commerce"
import { ProductImage } from "./product-image"
import { STATUS_META } from "@/lib/orders"
import { formatDateTime, formatKg, formatMoney } from "@/lib/format"
import { cn } from "@/lib/utils"

const FLOW: OrderStatus[] = ["pending", "confirmed", "processing", "out-for-delivery", "delivered"]

/** Horizontal progress for the happy path. */
export function OrderProgress({ order }: { order: Order }) {
  if (order.status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-slate-100 p-4 text-sm text-slate-700">
        <X className="size-4" /> This order was cancelled.
      </div>
    )
  }
  const current = FLOW.indexOf(order.status)
  return (
    <ol className="grid grid-cols-5 gap-1">
      {FLOW.map((s, i) => {
        const done = i <= current
        const event = order.history.find((h) => h.status === s)
        return (
          <li key={s} className="relative">
            <div className={cn("h-1.5 rounded-full transition-colors duration-500", done ? "bg-brand" : "bg-muted")} />
            <div className="mt-3 flex items-start gap-2">
              <span
                className={cn(
                  "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full",
                  done ? "bg-brand text-white" : "border border-border bg-white"
                )}
              >
                {done && <Check className="size-2.5" strokeWidth={3} />}
              </span>
              <div className="min-w-0">
                <p className={cn("text-xs font-medium sm:text-sm", done ? "text-ink" : "text-muted-foreground")}>{STATUS_META[s].label}</p>
                {event && <p className="hidden text-[11px] text-muted-foreground sm:block">{formatDateTime(event.at)}</p>}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function OrderHistoryList({ order }: { order: Order }) {
  return (
    <ol className="relative space-y-5 border-l pl-6">
      {[...order.history].reverse().map((h, i) => (
        <li key={`${h.at}-${i}`} className="relative">
          <span className={cn("absolute top-1 -left-[29px] size-2.5 rounded-full ring-4 ring-white", i === 0 ? "bg-brand" : "bg-border")} />
          <p className="text-sm font-medium">{h.note && h.status === order.status && i > 0 ? "Note" : STATUS_META[h.status].label}</p>
          <p className="text-xs text-muted-foreground">
            {formatDateTime(h.at)} · {h.by}
          </p>
          {h.note && <p className="mt-1 text-sm text-ink/80">{h.note}</p>}
        </li>
      ))}
    </ol>
  )
}

export function OrderLinesTable({ order }: { order: Order }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-muted-foreground">
            <th className="px-5 py-3 font-medium">Product</th>
            <th className="px-3 py-3 text-right font-medium">Qty</th>
            <th className="px-3 py-3 text-right font-medium">Unit price</th>
            <th className="px-5 py-3 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {order.lines.map((l) => (
            <tr key={`${l.productId}-${l.unitCode}`}>
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <ProductImage src={l.image} alt="" className="size-11 shrink-0 rounded-md" sizes="44px" />
                  <div className="min-w-0">
                    <p className="font-medium">{l.name}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-mono">{l.sku}</span> · {l.unitLabel} · {l.unitContents}
                    </p>
                    {l.pricing === "catch-weight" && (
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-brand">
                        <Scale className="size-3" /> Catch weight · est. {formatKg(l.estimatedWeightKg ?? 0)}
                        {l.pricePerKg !== undefined && ` @ ${formatMoney(l.pricePerKg)}/kg`}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="tabular px-3 py-3 text-right">{l.quantity}</td>
              <td className="tabular px-3 py-3 text-right">{formatMoney(l.unitPrice)}</td>
              <td className="tabular px-5 py-3 text-right font-medium">
                {l.pricing === "catch-weight" && <span className="text-muted-foreground">≈ </span>}
                {formatMoney(l.lineTotal)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function OrderTotals({ order }: { order: Order }) {
  return (
    <dl className="space-y-2 text-sm">
      {order.discount > 0 && (
        <div className="flex justify-between text-emerald-700">
          <dt>Account pricing applied</dt>
          <dd className="tabular">{formatMoney(-order.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd className="tabular">{formatMoney(order.subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Delivery</dt>
        <dd className="tabular">{order.deliveryFee === 0 ? "Free" : formatMoney(order.deliveryFee)}</dd>
      </div>
      <div className="flex justify-between border-t pt-2.5">
        <dt className="font-medium">{order.hasCatchWeight ? "Estimated total" : "Total"}</dt>
        <dd className="tabular text-lg font-semibold">{formatMoney(order.total)}</dd>
      </div>
    </dl>
  )
}
