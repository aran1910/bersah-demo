"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Building2, ChevronRight, Mail, MapPin, Phone, Search } from "lucide-react"
import type { AccountStatus, Customer, PriceTier } from "@/types/commerce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { PageHeader } from "@/components/shared/page-header"
import { AccountStatusBadge, DemoTag, OrderStatusBadge } from "@/components/shared/badges"
import { useDemoStore } from "@/lib/demo-store"
import { PRICE_TIERS } from "@/lib/pricing"
import { formatDate, formatMoney, formatMoneyCompact } from "@/lib/format"

const SEGMENTS: Record<Customer["segment"], string> = {
  restaurant: "Restaurant",
  hotel: "Hotel",
  resort: "Resort",
  "food-truck": "Food truck",
  catering: "Catering",
}

export function AdminCustomers() {
  const store = useDemoStore()
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [q, setQ] = React.useState("")
  const [segment, setSegment] = React.useState("all")
  const openId = params.get("c")
  const open = store.customers.find((c) => c.id === openId) ?? null

  const setOpen = (id: string | null) => router.replace(id ? `${pathname}?c=${id}` : pathname, { scroll: false })

  const stats = (id: string) => {
    const orders = store.orders.filter((o) => o.customerId === id && o.status !== "cancelled")
    return {
      count: orders.length,
      value: orders.reduce((s, o) => s + o.total, 0),
      last: orders[0]?.createdAt,
    }
  }

  const rows = store.customers
    .filter((c) => segment === "all" || c.segment === segment)
    .filter((c) => !q || `${c.businessName} ${c.contactName} ${c.accountNumber} ${c.district}`.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="space-y-5">
      <PageHeader
        title="Customers"
        description={`${store.customers.length} business accounts · ${store.customers.filter((c) => c.status === "pending-approval").length} awaiting approval`}
        actions={<DemoTag>Fictional accounts</DemoTag>}
      />
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search business, contact, account" className="h-9 bg-white pl-9" />
        </div>
        <Select value={segment} onValueChange={setSegment}>
          <SelectTrigger className="h-9 w-[160px] bg-white" aria-label="Segment">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All segments</SelectItem>
            {Object.entries(SEGMENTS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b bg-surface text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-3 py-3 font-medium">Contact</th>
              <th className="px-3 py-3 font-medium">District</th>
              <th className="px-3 py-3 font-medium">Price list</th>
              <th className="px-3 py-3 text-right font-medium">Orders</th>
              <th className="px-3 py-3 text-right font-medium">Order value</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="w-10 px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((c) => {
              const s = stats(c.id)
              return (
                <tr key={c.id} className="cursor-pointer hover:bg-surface/60" onClick={() => setOpen(c.id)}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{c.businessName}</p>
                    <p className="text-xs text-muted-foreground">{c.accountNumber} · {SEGMENTS[c.segment]}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p>{c.contactName}</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </td>
                  <td className="px-3 py-3">{c.district}</td>
                  <td className="px-3 py-3">{PRICE_TIERS[c.priceTier].label}</td>
                  <td className="tabular px-3 py-3 text-right">{s.count}</td>
                  <td className="tabular px-3 py-3 text-right font-medium">{formatMoney(s.value)}</td>
                  <td className="px-3 py-3"><AccountStatusBadge status={c.status} /></td>
                  <td className="px-3 py-3">
                    <button className="rounded p-1 text-muted-foreground hover:bg-muted" aria-label={`Open ${c.businessName}`}>
                      <ChevronRight className="size-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Sheet open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {open && <CustomerDetail customer={open} stats={stats(open.id)} />}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function CustomerDetail({ customer, stats }: { customer: Customer; stats: { count: number; value: number; last?: string } }) {
  const store = useDemoStore()
  const orders = store.orders.filter((o) => o.customerId === customer.id).slice(0, 6)
  return (
    <>
      <SheetHeader className="border-b pb-5">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-lg bg-brand text-white">
            <Building2 className="size-5" />
          </span>
          <div className="text-left">
            <SheetTitle>{customer.businessName}</SheetTitle>
            <SheetDescription>
              {customer.accountNumber} · {SEGMENTS[customer.segment]} · since {formatDate(customer.customerSince, { day: undefined })}
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>
      <div className="space-y-6 px-4 pb-8">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg bg-surface p-3">
            <p className="tabular text-lg font-semibold">{stats.count}</p>
            <p className="text-xs text-muted-foreground">Orders</p>
          </div>
          <div className="rounded-lg bg-surface p-3">
            <p className="tabular text-lg font-semibold">{formatMoneyCompact(stats.value)}</p>
            <p className="text-xs text-muted-foreground">Order value</p>
          </div>
          <div className="rounded-lg bg-surface p-3">
            <p className="text-lg font-semibold">{stats.last ? formatDate(stats.last, { year: undefined }) : "—"}</p>
            <p className="text-xs text-muted-foreground">Last order</p>
          </div>
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex gap-3">
            <Phone className="mt-0.5 size-4 text-muted-foreground" />
            <div>
              <dd className="font-medium">{customer.contactName}</dd>
              <dd className="text-muted-foreground">{customer.contactRole} · {customer.phone}</dd>
            </div>
          </div>
          <div className="flex gap-3">
            <Mail className="mt-0.5 size-4 text-muted-foreground" />
            <dd>{customer.email}</dd>
          </div>
          <div className="flex gap-3">
            <MapPin className="mt-0.5 size-4 text-muted-foreground" />
            <dd>{customer.address}, {customer.district}</dd>
          </div>
        </dl>

        <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2 [&>*]:min-w-0">
          <div className="grid gap-2">
            <Label>Account status</Label>
            <Select
              value={customer.status}
              onValueChange={(v) => {
                store.updateCustomer(customer.id, { status: v as AccountStatus })
                toast.success(`${customer.businessName}: ${v === "active" ? "account active" : v === "on-hold" ? "placed on hold" : "pending approval"}`)
              }}
            >
              <SelectTrigger className="w-full min-w-0"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on-hold">On hold</SelectItem>
                <SelectItem value="pending-approval">Pending approval</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Price list</Label>
            <Select
              value={customer.priceTier}
              onValueChange={(v) => {
                store.updateCustomer(customer.id, { priceTier: v as PriceTier })
                toast.success(`Price list set to ${PRICE_TIERS[v as PriceTier].label}`)
              }}
            >
              <SelectTrigger className="w-full min-w-0"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(PRICE_TIERS).map(([k, t]) => (
                  <SelectItem key={k} value={k}>{t.label} ({t.description})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground">Payment terms</p>
            <p className="font-medium">{customer.paymentTerms}</p>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground">Credit limit</p>
            <p className="font-medium">{customer.creditLimit ? formatMoney(customer.creditLimit) : "None (COD)"}</p>
          </div>
        </div>
        {customer.status === "pending-approval" && (
          <Button
            className="w-full"
            onClick={() => {
              store.updateCustomer(customer.id, { status: "active" })
              toast.success(`${customer.businessName} approved`, { description: "Simulated — no welcome email sent." })
            }}
          >
            Approve account
          </Button>
        )}

        <div>
          <h3 className="mb-2 text-sm font-medium">Recent orders</h3>
          {orders.length === 0 ? (
            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <ul className="divide-y rounded-lg border">
              {orders.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/orders/${o.id}`} className="flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-surface">
                    <span className="font-mono">{o.number}</span>
                    <span className="flex-1 text-xs text-muted-foreground">{formatDate(o.createdAt, { year: undefined })}</span>
                    <OrderStatusBadge status={o.status} />
                    <span className="tabular w-24 text-right">{formatMoney(o.total)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
