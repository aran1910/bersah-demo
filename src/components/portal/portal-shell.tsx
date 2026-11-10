"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ArrowRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Store,
  UserRound,
} from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { DemoTag } from "@/components/shared/badges"
import { useDemoStore } from "@/lib/demo-store"
import { cartTotals, priceCartLines } from "@/lib/pricing"
import { formatMoney, initials } from "@/lib/format"
import { cn } from "@/lib/utils"
import { tenantConfig } from "@/tenants"
import { CartLineItem, CartSummaryRows, FreeDeliveryProgress } from "./cart-parts"

const NAV = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/portal/catalog", label: "Order products", icon: Store },
  { href: "/portal/orders", label: "Order history", icon: ClipboardList },
  { href: "/portal/profile", label: "Account", icon: UserRound },
]

const CartSheetContext = React.createContext<(open: boolean) => void>(() => {})
export const useCartSheet = () => React.useContext(CartSheetContext)

export function PortalShell({ children }: { children: React.ReactNode }) {
  const store = useDemoStore()
  const pathname = usePathname()
  const router = useRouter()
  const [cartOpen, setCartOpen] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const customer = store.currentCustomer
  const priced = priceCartLines(store.cart, store.products, customer?.priceTier)
  const totals = cartTotals(priced)
  const cartCount = store.cart.length

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href))

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/portal/catalog${search.trim() ? `?q=${encodeURIComponent(search.trim())}` : ""}`)
    setMenuOpen(false)
  }

  if (!store.ready) {
    // Render the page segment anyway; pages show their own skeleton via <PortalReady>.
    return (
      <div className="min-h-dvh bg-surface">
        <div className="h-8 bg-brand-deep" />
        <div className="h-16 border-b bg-white" />
        <main className="container-page py-8 lg:py-10">{children}</main>
      </div>
    )
  }

  if (!customer) return <SignInRequired staff={Boolean(store.session?.staffName)} />

  return (
    <CartSheetContext.Provider value={setCartOpen}>
      <div className="min-h-dvh bg-surface">
        <div className="no-print bg-brand-deep text-[12px] text-white/75">
          <div className="container-page flex h-8 items-center justify-between gap-4">
            <span className="truncate">
              <span className="font-medium text-white">Demo portal</span>
              <span className="hidden sm:inline"> · simulated ordering — no real orders, payments or messages</span>
            </span>
            <span className="hidden shrink-0 items-center gap-4 sm:flex">
              <Link href="/" className="hover:text-white">Public website</Link>
              <Link href="/login?role=staff" className="hover:text-white">Employee admin</Link>
            </span>
          </div>
        </div>

        <header className="no-print sticky top-0 z-40 border-b bg-white">
          <div className="container-page flex h-16 items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
            <Logo href="/portal" className="h-10" />
            <nav aria-label="Portal" className="ml-4 hidden items-center gap-1 lg:flex">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive(item.href, item.exact) ? "bg-brand-tint font-medium text-brand" : "text-ink/70 hover:bg-muted hover:text-ink"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <form onSubmit={onSearch} className="relative ml-auto hidden w-full max-w-xs md:block">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search catalog…"
                className="h-10 bg-muted/60 pl-9"
                aria-label="Search catalog"
              />
            </form>

            <Button
              variant="outline"
              className="relative ml-auto h-10 gap-2 px-3 md:ml-0"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${cartCount} items`}
            >
              <ShoppingCart className="size-4" />
              <span className="tabular hidden text-sm sm:inline">{formatMoney(totals.subtotal)}</span>
              {cartCount > 0 && (
                <span className="animate-scale-in absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-brand-accent text-[10px] font-bold text-brand-dark">
                  {cartCount}
                </span>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md p-1 hover:bg-muted" aria-label="Account menu">
                  <span className="grid size-8 place-items-center rounded-full bg-brand text-xs font-medium text-white">
                    {initials(customer.businessName)}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <p className="font-medium text-ink">{customer.businessName}</p>
                  <p className="text-xs text-muted-foreground">
                    {customer.contactName} · {customer.accountNumber}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/portal/profile"><UserRound /> Account &amp; profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/portal/orders"><ClipboardList /> Order history</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login"><RotateCcw /> Switch demo account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login?role=staff"><ShieldCheck /> Open employee admin</Link>
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

        <main className="container-page py-8 lg:py-10">{children}</main>

        <footer className="no-print border-t bg-white">
          <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
            <p>
              {tenantConfig.name} · {tenantConfig.contact.addressLines[0]}, {tenantConfig.contact.city} · {tenantConfig.contact.phones[0].value}
            </p>
            <p>{tenantConfig.demo.disclaimer}</p>
          </div>
        </footer>

        {/* Mobile nav */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetContent side="left" className="w-[84vw] max-w-xs p-0">
            <SheetHeader className="border-b p-5">
              <SheetTitle className="sr-only">Portal menu</SheetTitle>
              <SheetDescription className="sr-only">Navigate the customer portal</SheetDescription>
              <Logo href="/portal" className="h-10" />
            </SheetHeader>
            <form onSubmit={onSearch} className="relative px-4 pt-4">
              <Search className="pointer-events-none absolute top-1/2 left-7 mt-2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search catalog…" className="h-10 pl-9" />
            </form>
            <nav className="flex flex-col p-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-3 text-sm",
                    isActive(item.href, item.exact) ? "bg-brand-tint font-medium text-brand" : "text-ink/80 hover:bg-muted"
                  )}
                >
                  <item.icon className="size-4" /> {item.label}
                </Link>
              ))}
              <Link href="/" className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-ink/80 hover:bg-muted">
                <ArrowRight className="size-4" /> Public website
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Cart drawer */}
        <Sheet open={cartOpen} onOpenChange={setCartOpen}>
          <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
            <SheetHeader className="border-b px-5 py-4">
              <SheetTitle className="flex items-center gap-2">
                <ShoppingBag className="size-5 text-brand" /> Your order
              </SheetTitle>
              <SheetDescription>
                {cartCount === 0 ? "Your cart is empty." : `${cartCount} ${cartCount === 1 ? "line" : "lines"} · ${customer.businessName}`}
              </SheetDescription>
            </SheetHeader>
            {cartCount === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-brand-tint text-brand">
                  <ShoppingCart className="size-7" />
                </span>
                <p className="text-sm text-muted-foreground">Add products from the catalog or reorder a previous delivery.</p>
                <div className="flex gap-2">
                  <Button asChild onClick={() => setCartOpen(false)}>
                    <Link href="/portal/catalog">Browse catalog</Link>
                  </Button>
                  <Button asChild variant="outline" onClick={() => setCartOpen(false)}>
                    <Link href="/portal/orders">Reorder</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 divide-y overflow-y-auto px-5">
                  {priced.map((item) => (
                    <CartLineItem key={`${item.product.id}-${item.unit.code}`} item={item} compact />
                  ))}
                </div>
                <SheetFooter className="gap-4 border-t bg-surface p-5">
                  <FreeDeliveryProgress totals={totals} />
                  <CartSummaryRows totals={totals} />
                  <div className="grid grid-cols-2 gap-2">
                    <Button asChild variant="outline" className="h-11" onClick={() => setCartOpen(false)}>
                      <Link href="/portal/cart">View cart</Link>
                    </Button>
                    <Button asChild className="h-11" onClick={() => setCartOpen(false)}>
                      <Link href="/portal/checkout">
                        Checkout <ArrowRight data-icon="inline-end" />
                      </Link>
                    </Button>
                  </div>
                </SheetFooter>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </CartSheetContext.Provider>
  )
}

export function PortalPageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-10 w-72" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-80" />
    </div>
  )
}

/** Renders children once demo state has loaded and a customer is signed in. */
export function PortalReady({ children }: { children: React.ReactNode }) {
  const store = useDemoStore()
  if (!store.ready || !store.currentCustomer) return <PortalPageSkeleton />
  return <>{children}</>
}

function SignInRequired({ staff }: { staff: boolean }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-surface p-6">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
        <Logo className="mx-auto h-14" />
        <h1 className="font-display mt-6 text-2xl">Customer portal</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {staff
            ? "You're signed in as an employee. Choose a customer demo account to see the ordering experience."
            : "Sign in with a demo customer account to browse prices and place orders."}
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button asChild size="lg" className="h-11">
            <Link href="/login">Go to demo login</Link>
          </Button>
          {staff && (
            <Button asChild size="lg" variant="outline" className="h-11">
              <Link href="/admin">Back to admin</Link>
            </Button>
          )}
        </div>
        <DemoTag className="mt-6">No real authentication</DemoTag>
      </div>
    </div>
  )
}
