"use client"

import * as React from "react"
import { toast } from "sonner"
import { Building2, CreditCard, Mail, MapPin, Phone, RotateCcw, Save, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/shared/page-header"
import { AccountStatusBadge, DemoTag } from "@/components/shared/badges"
import { useDemoStore } from "@/lib/demo-store"
import { OPEN_STATUSES } from "@/lib/orders"
import { PRICE_TIERS } from "@/lib/pricing"
import { formatDate, formatMoney } from "@/lib/format"
import { PortalReady } from "@/components/portal/portal-shell"

const SEGMENTS = { restaurant: "Restaurant", hotel: "Hotel", resort: "Resort", "food-truck": "Food truck", catering: "Catering" }

function ProfilePage() {
  const store = useDemoStore()
  const customer = store.currentCustomer!
  const [form, setForm] = React.useState({
    contactName: customer.contactName,
    contactRole: customer.contactRole,
    email: customer.email,
    phone: customer.phone,
    deliveryNotes: customer.deliveryNotes ?? "",
  })

  const openValue = store.orders
    .filter((o) => o.customerId === customer.id && OPEN_STATUSES.includes(o.status))
    .reduce((s, o) => s + o.total, 0)
  const usedPct = customer.creditLimit > 0 ? Math.min(100, (openValue / customer.creditLimit) * 100) : 0
  const tier = PRICE_TIERS[customer.priceTier]

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    store.updateCustomer(customer.id, form)
    toast.success("Profile updated", { description: "Saved in this browser (demo)." })
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Account & profile" description={`${customer.businessName} · ${customer.accountNumber}`} />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-5 rounded-xl border bg-white p-6 lg:col-span-2">
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-xl bg-brand text-white">
              <Building2 className="size-6" />
            </span>
            <div>
              <h2 className="text-lg font-medium">{customer.businessName}</h2>
              <p className="text-sm text-muted-foreground">
                {SEGMENTS[customer.segment]} · Customer since {formatDate(customer.customerSince, { day: undefined })}
              </p>
            </div>
            <div className="ml-auto">
              <AccountStatusBadge status={customer.status} />
            </div>
          </div>

          <form onSubmit={save} className="grid gap-4 border-t pt-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="contactName">Contact person</Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="contactName" className="h-10 pl-9" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactRole">Role</Label>
              <Input id="contactRole" className="h-10" value={form.contactRole} onChange={(e) => setForm({ ...form, contactRole: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" className="h-10 pl-9" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="phone" className="h-10 pl-9" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label>Delivery address</Label>
              <p className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2.5 text-sm">
                <MapPin className="size-4 text-muted-foreground" /> {customer.address}, {customer.district}, Aruba
              </p>
              <p className="text-xs text-muted-foreground">Contact BerSah to change your delivery address.</p>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="notes">Standard delivery notes</Label>
              <Textarea id="notes" rows={3} value={form.deliveryNotes} onChange={(e) => setForm({ ...form, deliveryNotes: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">
                <Save data-icon="inline-start" /> Save changes
              </Button>
            </div>
          </form>
        </section>

        <div className="space-y-6">
          <section className="rounded-xl border bg-white p-6">
            <h2 className="flex items-center gap-2 font-medium">
              <CreditCard className="size-4 text-brand" /> Commercial terms
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Price list</dt>
                <dd className="font-medium">{tier.label}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Pricing</dt>
                <dd>{tier.description}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Payment terms</dt>
                <dd>{customer.paymentTerms}</dd>
              </div>
              {customer.creditLimit > 0 && (
                <div className="pt-2">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Credit used by open orders</dt>
                    <dd className="tabular">{Math.round(usedPct)}%</dd>
                  </div>
                  <Progress value={usedPct} className="mt-2 h-2" />
                  <p className="tabular mt-2 text-xs text-muted-foreground">
                    {formatMoney(openValue)} of {formatMoney(customer.creditLimit)}
                  </p>
                </div>
              )}
            </dl>
            <DemoTag className="mt-4">Illustrative terms</DemoTag>
          </section>

          <section className="rounded-xl border bg-white p-6">
            <h2 className="font-medium">Notifications</h2>
            <p className="mt-1 text-xs text-muted-foreground">Preferences are stored, but no messages are sent in this demo.</p>
            <div className="mt-4 space-y-4">
              {(
                [
                  ["email", "Order confirmations by email"],
                  ["whatsapp", "Delivery updates on WhatsApp"],
                  ["deliveryReminders", "Cut-off reminder (13:00)"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <Label htmlFor={key} className="font-normal">{label}</Label>
                  <Switch
                    id={key}
                    checked={store.notifications[key]}
                    onCheckedChange={(v) => {
                      store.setNotifications({ [key]: v })
                      toast.success("Preference saved")
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-dashed bg-white p-6">
            <h2 className="font-medium">Demo controls</h2>
            <p className="mt-1 text-sm text-muted-foreground">Restore the original sample orders, stock and accounts.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                store.resetDemo()
                toast.success("Demo data reset")
              }}
            >
              <RotateCcw data-icon="inline-start" /> Reset demo data
            </Button>
          </section>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <PortalReady>
      <ProfilePage />
    </PortalReady>
  )
}
