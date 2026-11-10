"use client"

import Link from "next/link"
import { toast } from "sonner"
import { CalendarDays, ChevronLeft, FileText, MapPin, Printer, Repeat2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "@/components/shared/badges"
import { OrderHistoryList, OrderLinesTable, OrderProgress, OrderTotals } from "@/components/shared/order-parts"
import { useDemoStore } from "@/lib/demo-store"
import { CHANNEL_LABELS } from "@/lib/orders"
import { formatDateLong, formatDateTime } from "@/lib/format"
import { useCartSheet } from "./portal-shell"

export function PortalOrderDetail({ id }: { id: string }) {
  const store = useDemoStore()
  const openCart = useCartSheet()
  const order = store.orders.find((o) => o.id === id && o.customerId === store.currentCustomer?.id)

  if (!order) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        <p className="font-medium">Order not found</p>
        <p className="mt-1 text-sm text-muted-foreground">It may belong to another account, or the demo was reset.</p>
        <Button asChild className="mt-5"><Link href="/portal/orders">Back to orders</Link></Button>
      </div>
    )
  }

  const reorder = () => {
    const n = store.reorder(order.id)
    toast.success(`${n} lines added to your cart`, { action: { label: "Open cart", onClick: () => openCart(true) } })
  }

  return (
    <div className="space-y-6">
      <Link href="/portal/orders" className="no-print inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand">
        <ChevronLeft className="size-4" /> All orders
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl">Order {order.number}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Placed {formatDateTime(order.createdAt)} via {CHANNEL_LABELS[order.channel].toLowerCase()}
            {order.poNumber && ` · ${order.poNumber}`}
          </p>
        </div>
        <div className="no-print flex gap-2">
          <Button variant="outline" className="bg-white" onClick={() => window.print()}>
            <Printer data-icon="inline-start" /> Print
          </Button>
          <Button onClick={reorder}>
            <Repeat2 data-icon="inline-start" /> Reorder
          </Button>
        </div>
      </div>

      <section className="rounded-xl border bg-white p-5 sm:p-6">
        <OrderProgress order={order} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="overflow-hidden rounded-xl border bg-white">
          <h2 className="border-b px-5 py-4 font-medium">Items</h2>
          <OrderLinesTable order={order} />
          <div className="border-t bg-surface/60 px-5 py-4">
            <div className="ml-auto max-w-xs">
              <OrderTotals order={order} />
            </div>
          </div>
        </section>
        <aside className="space-y-6">
          <section className="space-y-4 rounded-xl border bg-white p-5 text-sm">
            <div className="flex gap-3">
              <CalendarDays className="mt-0.5 size-4 shrink-0 text-brand" />
              <div>
                <p className="text-muted-foreground">Requested delivery</p>
                <p className="font-medium">{formatDateLong(order.requestedDeliveryDate)}</p>
                <p>{order.deliveryWindow}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
              <div>
                <p className="text-muted-foreground">Deliver to</p>
                <p className="font-medium">{store.currentCustomer?.businessName}</p>
                <p>{store.currentCustomer?.address}, {store.currentCustomer?.district}</p>
              </div>
            </div>
            {order.notes && (
              <div className="flex gap-3">
                <FileText className="mt-0.5 size-4 shrink-0 text-brand" />
                <div>
                  <p className="text-muted-foreground">Notes</p>
                  <p>{order.notes}</p>
                </div>
              </div>
            )}
          </section>
          <section className="rounded-xl border bg-white p-5">
            <h2 className="mb-4 font-medium">Activity</h2>
            <OrderHistoryList order={order} />
          </section>
        </aside>
      </div>
    </div>
  )
}
