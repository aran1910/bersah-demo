"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Building2, KeyRound, ShieldCheck, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDemoStore } from "@/lib/demo-store"
import { tenant } from "@/tenants"
import { PRICE_TIERS } from "@/lib/pricing"

export function LoginPanel() {
  const router = useRouter()
  const params = useSearchParams()
  const store = useDemoStore()
  const [tab, setTab] = React.useState(params.get("role") === "staff" ? "staff" : "customer")
  const [customerId, setCustomerId] = React.useState("c-palm-grove")
  const [staffId, setStaffId] = React.useState(tenant.staff[0].id)
  const [loading, setLoading] = React.useState(false)

  const customer = store.customers.find((c) => c.id === customerId) ?? store.customers[0]
  const next = params.get("next")

  const enterPortal = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    store.signIn({ customerId })
    router.push(next?.startsWith("/portal") ? next : "/portal")
  }

  const enterAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const staff = tenant.staff.find((s) => s.id === staffId)!
    store.signIn({ staffName: staff.name })
    router.push("/admin")
  }

  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-3xl text-ink">Sign in</h1>
      <p className="mt-2 text-muted-foreground">Choose a demo account to explore the platform.</p>

      <div className="mt-6 flex gap-3 rounded-lg border border-amber-300/70 bg-amber-50 p-4 text-sm text-amber-900">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>
          <span className="font-medium">Demonstration login.</span> There is no real authentication — any password is accepted
          and all accounts are fictional.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList className="grid h-11 w-full grid-cols-2">
          <TabsTrigger value="customer" className="h-9">
            <Building2 className="size-4" /> Customer
          </TabsTrigger>
          <TabsTrigger value="staff" className="h-9">
            <ShieldCheck className="size-4" /> Employee
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customer" className="mt-6">
          <form onSubmit={enterPortal} className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="account">Demo business account</Label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger id="account" className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {store.customers
                    .filter((c) => c.status !== "pending-approval")
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.businessName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {customer && (
                <p className="text-xs text-muted-foreground">
                  {customer.accountNumber} · {PRICE_TIERS[customer.priceTier].label} pricing ({PRICE_TIERS[customer.priceTier].description})
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" className="h-11" value={customer?.email ?? ""} readOnly />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" className="h-11 pl-9" defaultValue="demo-password" />
              </div>
            </div>
            <Button type="submit" size="lg" className="h-11 w-full" disabled={loading || !store.ready}>
              Enter customer portal <ArrowRight data-icon="inline-end" />
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="staff" className="mt-6">
          <form onSubmit={enterAdmin} className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="staff">Demo employee</Label>
              <Select value={staffId} onValueChange={setStaffId}>
                <SelectTrigger id="staff" className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tenant.staff.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} — {s.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="staff-password">Password</Label>
              <Input id="staff-password" type="password" className="h-11" defaultValue="demo-password" />
            </div>
            <Button type="submit" size="lg" className="h-11 w-full" disabled={loading || !store.ready}>
              Open admin dashboard <ArrowRight data-icon="inline-end" />
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
