"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Building2, CalendarDays, ChevronLeft, CircleSlash, FileText, Mail, MapPin, MessageSquarePlus, Phone, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AccountStatusBadge, DemoTag, OrderStatusBadge } from "@/components/shared/badges"
import { OrderHistoryList, OrderLinesTable, OrderProgress, OrderTotals } from "@/components/shared/order-parts"
import { useDemoStore } from "@/lib/demo-store"
import { CHANNEL_LABELS, nextStatus, STATUS_META } from "@/lib/orders"
import { PRICE_TIERS } from "@/lib/pricing"
import { formatDateLong, formatDateTime } from "@/lib/format"
import { StatusSelect } from "./status-select"

export function AdminOrderDetail({ id }: { id: string }) {
  const store = useDemoStore()
  const order = store.orders.find((o) => o.id === id)
  const [note, setNote] = React.useState("")

  if (!order) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        <p className="font-medium">Order not found</p>
        <Button asChild className="mt-5"><Link href="/admin/orders">Back to orders</Link></Button>
      </div>
    )
  }

  const customer = store.customers.find((c) => c.id === order.customerId)
  const staff = store.session?.staffName ?? "Staff"
  const next = nextStatus(order.status)

  const advance = () => {
    if (!next) return
    store.updateOrderStatus(order.id, next, staff)
    toast.success(`${order.number} marked as ${STATUS_META[next].label.toLowerCase()}`, {
      description: "Simulated — the customer would be notified by email/WhatsApp in production.",
    })
  }

  const addNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!note.trim()) return
    store.addOrderNote(order.id, staff, note.trim())
    setNote("")
    toast.success("Note added")
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="no-print inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand">
        <ChevronLeft className="size-4" /> Orders
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl">{order.number}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {customer?.businessName} · placed {formatDateTime(order.createdAt)} via {CHANNEL_LABELS[order.channel].toLowerCase()}
            {order.poNumber && ` · ${order.poNumber}`}
          </p>
        </div>
        <div className="no-print flex flex-wrap items-center gap-2">
          <Button variant="outline" className="bg-white" onClick={() => window.print()}>
            <Printer data-icon="inline-start" /> Print pick list
          </Button>
          <StatusSelect order={order} className="h-9 w-[190px] bg-white" />
          {order.status !== "cancelled" && order.status !== "delivered" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-white text-red-600 hover:text-red-700">
                  <CircleSlash data-icon="inline-start" /> Cancel
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel order {order.number}?</DialogTitle>
                  <DialogDescription>The order will be marked as cancelled. This is a demo — nothing is sent to the customer.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Keep order</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        store.updateOrderStatus(order.id, "cancelled", staff, "Cancelled by order desk")
                        toast.success(`${order.number} cancelled`)
                      }}
                    >
                      Cancel order
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {next && (
            <Button onClick={advance}>Mark as {STATUS_META[next].label.toLowerCase()}</Button>
          )}
        </div>
      </div>

      <section className="rounded-xl border bg-white p-5 sm:p-6">
        <OrderProgress order={order} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-xl border bg-white">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-medium">Order lines</h2>
              {order.hasCatchWeight && <DemoTag>Catch-weight lines are re-priced after weighing</DemoTag>}
            </div>
            <OrderLinesTable order={order} />
            <div className="border-t bg-surface/60 px-5 py-4">
              <div className="ml-auto max-w-xs">
                <OrderTotals order={order} />
              </div>
            </div>
          </section>

          <section className="no-print rounded-xl border bg-white p-5">
            <h2 className="mb-4 font-medium">Activity &amp; internal notes</h2>
            <form onSubmit={addNote} className="mb-6 flex flex-col gap-2 sm:flex-row">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add an internal note (e.g. substitution, weight adjustment, driver instruction)…"
                rows={2}
                className="flex-1"
              />
              <Button type="submit" variant="outline" className="sm:self-end" disabled={!note.trim()}>
                <MessageSquarePlus data-icon="inline-start" /> Add note
              </Button>
            </form>
            <OrderHistoryList order={order} />
          </section>
        </div>

        <aside className="space-y-6">
          {customer && (
            <section className="rounded-xl border bg-white p-5 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-brand-tint text-brand">
                    <Building2 className="size-5" />
                  </span>
                  <div>
                    <p className="font-medium">{customer.businessName}</p>
                    <p className="text-xs text-muted-foreground">{customer.accountNumber}</p>
                  </div>
                </div>
                <AccountStatusBadge status={customer.status} />
              </div>
              <dl className="mt-5 space-y-3">
                <div className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="sr-only">Contact</dt>
                    <dd>{customer.contactName} · {customer.contactRole}</dd>
                    <dd className="text-muted-foreground">{customer.phone}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <dd className="break-all">{customer.email}</dd>
                </div>
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <dd>{customer.address}, {customer.district}</dd>
                </div>
              </dl>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Price list</p>
                  <p className="font-medium">{PRICE_TIERS[customer.priceTier].label}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Terms</p>
                  <p className="font-medium">{customer.paymentTerms}</p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                <Link href={`/admin/customers?c=${customer.id}`}>View customer</Link>
              </Button>
            </section>
          )}
          <section className="space-y-4 rounded-xl border bg-white p-5 text-sm">
            <div className="flex gap-3">
              <CalendarDays className="mt-0.5 size-4 shrink-0 text-brand" />
              <div>
                <p className="text-muted-foreground">Requested delivery</p>
                <p className="font-medium">{formatDateLong(order.requestedDeliveryDate)}</p>
                <p>{order.deliveryWindow}</p>
              </div>
            </div>
            {(order.notes || customer?.deliveryNotes) && (
              <div className="flex gap-3">
                <FileText className="mt-0.5 size-4 shrink-0 text-brand" />
                <div>
                  <p className="text-muted-foreground">Delivery notes</p>
                  <p>{order.notes ?? customer?.deliveryNotes}</p>
                </div>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}
