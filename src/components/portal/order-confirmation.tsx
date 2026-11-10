"use client"

import Link from "next/link"
import { CheckCircle2, ClipboardCheck, PackageSearch, Scale, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DemoTag } from "@/components/shared/badges"
import { useDemoStore } from "@/lib/demo-store"
import { formatDateLong, formatMoney } from "@/lib/format"

export function OrderConfirmation({ id }: { id: string }) {
  const store = useDemoStore()
  const order = store.orders.find((o) => o.id === id)
  if (!order) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        <p className="font-medium">Order not found</p>
        <Button asChild className="mt-5"><Link href="/portal/orders">Order history</Link></Button>
      </div>
    )
  }

  const steps = [
    { icon: ClipboardCheck, title: "Order desk review", body: "BerSah confirms availability and your delivery slot." },
    { icon: Scale, title: "Picked & weighed", body: order.hasCatchWeight ? "Weighed items are invoiced on actual weight." : "Your order is picked from cooled and frozen storage." },
    { icon: Truck, title: "Out for delivery", body: `${formatDateLong(order.requestedDeliveryDate)}, ${order.deliveryWindow}.` },
  ]

  return (
    <div className="mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="bg-brand-deep px-6 py-12 text-center text-white sm:px-10">
          <CheckCircle2 className="animate-scale-in mx-auto size-16 text-brand-accent" strokeWidth={1.5} />
          <h1 className="font-display mt-5 text-3xl sm:text-4xl">Thank you — order received</h1>
          <p className="mt-3 text-white/70">
            Order <span className="font-mono font-medium text-white">{order.number}</span> has been submitted to the order desk.
          </p>
          <div className="mt-6 flex justify-center">
            <DemoTag className="border-amber-300 bg-amber-100">Simulated — no confirmation email or WhatsApp was sent</DemoTag>
          </div>
        </div>
        <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="p-6">
            <p className="text-sm text-muted-foreground">Delivery</p>
            <p className="mt-1 font-medium">{formatDateLong(order.requestedDeliveryDate)}</p>
            <p className="text-sm">{order.deliveryWindow}</p>
          </div>
          <div className="p-6">
            <p className="text-sm text-muted-foreground">Items</p>
            <p className="mt-1 font-medium">{order.lines.length} lines</p>
            {order.poNumber && <p className="text-sm">{order.poNumber}</p>}
          </div>
          <div className="p-6">
            <p className="text-sm text-muted-foreground">{order.hasCatchWeight ? "Estimated total" : "Total"}</p>
            <p className="tabular mt-1 text-xl font-semibold">{formatMoney(order.total)}</p>
          </div>
        </div>
        <div className="border-t p-6 sm:p-8">
          <h2 className="flex items-center gap-2 font-medium">
            <PackageSearch className="size-4 text-brand" /> What happens next
          </h2>
          <ol className="mt-5 grid gap-5 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="grid size-10 place-items-center rounded-full bg-brand-tint text-brand">
                  <s.icon className="size-5" />
                </span>
                <p className="mt-3 text-sm font-medium">
                  {i + 1}. {s.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col gap-2 border-t bg-surface p-6 sm:flex-row sm:justify-end">
          <Button asChild variant="outline" className="h-11 bg-white">
            <Link href="/portal/catalog">Continue ordering</Link>
          </Button>
          <Button asChild className="h-11">
            <Link href={`/portal/orders/${order.id}`}>Track this order</Link>
          </Button>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Tip: open the <Link href="/admin/orders" className="text-brand underline-offset-2 hover:underline">employee admin</Link> to see this order arrive on the order desk.
      </p>
    </div>
  )
}
