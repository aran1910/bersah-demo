"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Phone, UserRound, ArrowRight } from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { tenantConfig } from "@/tenants"
import { SITE_NAV } from "./site-nav-links"

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const phone = tenantConfig.contact.phones[0]

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))

  return (
    <header
      className={cn(
        "no-print sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition-shadow duration-300 supports-[backdrop-filter]:bg-white/85",
        scrolled ? "border-border shadow-[0_6px_24px_-12px_rgba(12,51,84,0.25)]" : "border-transparent"
      )}
    >
      <div className="container-page flex h-[72px] items-center gap-6">
        <Logo eager className="h-12 lg:h-[52px]" />

        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 lg:flex">
          {SITE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative px-3 py-2 text-[15px] text-ink/75 transition-colors hover:text-brand",
                isActive(item.href) && "text-brand",
                "after:absolute after:inset-x-3 after:-bottom-[1px] after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-brand-accent after:transition-transform hover:after:scale-x-100",
                isActive(item.href) && "after:scale-x-100"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={phone.href}
            className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm text-ink/70 transition-colors hover:text-brand xl:flex"
          >
            <Phone className="size-4 text-brand" aria-hidden="true" />
            <span className="tabular">{phone.value}</span>
          </a>
          <Button asChild size="lg" className="hidden h-10 px-4 sm:inline-flex">
            <Link href="/login">
              <UserRound data-icon="inline-start" />
              Customer login
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm p-0">
              <SheetHeader className="border-b p-5">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Logo className="h-11" />
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col p-3">
                {SITE_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-md px-3 py-3 text-base text-ink/80 hover:bg-muted",
                      isActive(item.href) && "bg-brand-tint font-medium text-brand"
                    )}
                  >
                    {item.label}
                    <ArrowRight className="size-4 opacity-40" />
                  </Link>
                ))}
              </nav>
              <div className="mt-auto space-y-3 border-t p-5">
                <Button asChild className="h-11 w-full">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <UserRound data-icon="inline-start" /> Customer login
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11 w-full">
                  <a href={phone.href}>
                    <Phone data-icon="inline-start" /> {phone.value}
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
