"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Boxes,
  ClipboardList,
  ExternalLink,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PlugZap,
  RotateCcw,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react"
import { toast } from "sonner"
import { BrandMark, Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DemoTag } from "@/components/shared/badges"
import { useDemoStore } from "@/lib/demo-store"
import { stockLevel } from "@/lib/pricing"
import { initials } from "@/lib/format"
import { cn } from "@/lib/utils"
import { tenant, tenantConfig } from "@/tenants"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const store = useDemoStore()
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = React.useState(false)

  if (store.ready && !store.session?.staffName) return <AdminSignIn />

  const pending = store.orders.filter((o) => o.status === "pending").length
  const lowStock = store.products.filter((p) => p.active && stockLevel(p) !== "in-stock").length
  const pendingCustomers = store.customers.filter((c) => c.status === "pending-approval").length

  const nav = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/orders", label: "Orders", icon: ClipboardList, badge: pending },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/inventory", label: "Inventory", icon: Boxes, badge: lowStock, tone: "amber" as const },
    { href: "/admin/customers", label: "Customers", icon: Users, badge: pendingCustomers },
    { href: "/admin/integrations", label: "Integrations", icon: PlugZap },
  ]
  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href))

  const navList = (onNavigate?: () => void) => (
    <nav aria-label="Admin" className="flex flex-col gap-0.5">
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            isActive(item.href, item.exact)
              ? "bg-sidebar-accent font-medium text-white"
              : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-white"
          )}
        >
          <item.icon className="size-4" />
          <span className="flex-1">{item.label}</span>
          {store.ready && item.badge ? (
            <span
              className={cn(
                "tabular min-w-5 rounded-full px-1.5 text-center text-[11px] font-semibold",
                item.tone === "amber" ? "bg-amber-400 text-amber-950" : "bg-brand-accent text-brand-dark"
              )}
            >
              {item.badge}
            </span>
          ) : null}
        </Link>
      ))}
    </nav>
  )

  const sidebarFooter = (
    <div className="space-y-2 border-t border-sidebar-border pt-4 text-sm">
      <Link href="/portal" className="flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-white">
        <Store className="size-4" /> Customer portal
      </Link>
      <Link href="/" className="flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-white">
        <Globe className="size-4" /> Public website
      </Link>
    </div>
  )

  return (
    <div className="min-h-dvh bg-surface lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="no-print sticky top-0 hidden h-dvh flex-col bg-sidebar p-4 text-sidebar-foreground lg:flex">
        <Link href="/admin" className="flex items-center gap-3 px-2 py-2">
          <BrandMark />
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-white">{tenantConfig.shortName} Admin</span>
            <span className="block text-[11px] text-sidebar-foreground/60">Order desk &amp; back office</span>
          </span>
        </Link>
        <div className="mt-6 flex-1">{navList()}</div>
        {sidebarFooter}
        <p className="mt-4 rounded-md bg-white/5 p-3 text-[11px] leading-snug text-sidebar-foreground/60">
          Demo environment · fictional data · changes are saved in this browser only.
        </p>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="no-print sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-white px-4 sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open admin menu">
            <Menu className="size-5" />
          </Button>
          <div className="lg:hidden">
            <BrandMark className="size-8" />
          </div>
          <DemoTag className="hidden sm:inline-flex">Demo admin</DemoTag>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="hidden h-9 sm:inline-flex">
              <Link href="/portal">
                <ExternalLink data-icon="inline-start" /> Customer view
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md p-1 pr-2 hover:bg-muted" aria-label="Employee menu">
                  <span className="grid size-8 place-items-center rounded-full bg-brand-dark text-xs font-medium text-white">
                    {initials(store.session?.staffName ?? "Staff")}
                  </span>
                  <span className="hidden text-sm sm:block">{store.session?.staffName}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="font-normal">
                  <p className="font-medium">{store.session?.staffName}</p>
                  <p className="text-xs text-muted-foreground">{tenantConfig.name}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/login?role=staff"><ShieldCheck /> Switch employee</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    store.resetDemo()
                    toast.success("Demo data reset")
                  }}
                >
                  <RotateCcw /> Reset demo data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    store.signOut()
                    router.push("/")
                  }}
                >
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-72 border-0 bg-sidebar p-4 text-sidebar-foreground">
          <SheetHeader className="p-0">
            <SheetTitle className="flex items-center gap-3 text-white">
              <BrandMark /> {tenantConfig.shortName} Admin
            </SheetTitle>
            <SheetDescription className="sr-only">Admin navigation</SheetDescription>
          </SheetHeader>
          <div className="mt-4 flex-1">{navList(() => setMenuOpen(false))}</div>
          {sidebarFooter}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export function AdminReady({ children }: { children: React.ReactNode }) {
  const store = useDemoStore()
  if (!store.ready || !store.session?.staffName) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading">
        <Skeleton className="h-9 w-64" />
        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }
  return <>{children}</>
}

function AdminSignIn() {
  const store = useDemoStore()
  const staff = tenant.staff[0]
  return (
    <div className="grid min-h-dvh place-items-center bg-brand-deep p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-2xl">
        <Logo className="mx-auto h-14" />
        <h1 className="font-display mt-6 text-2xl">Employee admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in with a demo employee account to manage orders, products, inventory and customers.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button size="lg" className="h-11" onClick={() => store.signIn({ staffName: staff.name })}>
            <ShieldCheck data-icon="inline-start" /> Continue as {staff.name}
          </Button>
          <Button asChild size="lg" variant="outline" className="h-11">
            <Link href="/login?role=staff">Choose another employee</Link>
          </Button>
        </div>
        <DemoTag className="mt-6">No real authentication</DemoTag>
      </div>
    </div>
  )
}
