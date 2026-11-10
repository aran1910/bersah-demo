"use client"

import { toast } from "sonner"
import type { Order, OrderStatus } from "@/types/commerce"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { OrderStatusBadge } from "@/components/shared/badges"
import { useDemoStore } from "@/lib/demo-store"
import { ORDER_STATUSES, STATUS_META } from "@/lib/orders"

/** Inline status changer that looks like the status badge. */
export function StatusSelect({ order, className }: { order: Order; className?: string }) {
  const store = useDemoStore()
  return (
    <Select
      value={order.status}
      onValueChange={(v) => {
        store.updateOrderStatus(order.id, v as OrderStatus, store.session?.staffName ?? "Staff")
        toast.success(`${order.number} → ${STATUS_META[v as OrderStatus].label}`)
      }}
    >
      <SelectTrigger size="sm" className={className ?? "h-8 w-[170px] border-transparent bg-transparent px-1.5 shadow-none hover:border-border"} aria-label={`Change status of ${order.number}`}>
        <OrderStatusBadge status={order.status} />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            <span className="flex flex-col">
              <span>{STATUS_META[s].label}</span>
              <span className="text-xs text-muted-foreground">{STATUS_META[s].description}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
