import Link from "next/link"
import { Info } from "lucide-react"
import { tenantConfig } from "@/tenants"

/** Thin strip that makes the demo status explicit and links the three areas of the prototype. */
export function DemoBar() {
  if (!tenantConfig.demo.enabled) return null
  return (
    <div className="no-print bg-brand-deep text-[12px] text-white/80">
      <div className="container-page flex min-h-9 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-1.5">
        <p className="flex items-center gap-2">
          <Info className="size-3.5 shrink-0 text-brand-accent" aria-hidden="true" />
          <span>
            <span className="font-medium text-white">Independent demo concept</span>
            <span className="hidden sm:inline"> — not an official {tenantConfig.shortName} website. Prices and stock are illustrative.</span>
          </span>
        </p>
        <nav aria-label="Prototype areas" className="flex items-center gap-4">
          <Link href="/" className="transition-colors hover:text-white">Website</Link>
          <span className="text-white/25" aria-hidden="true">/</span>
          <Link href="/login" className="transition-colors hover:text-white">Customer portal</Link>
          <span className="text-white/25" aria-hidden="true">/</span>
          <Link href="/login?role=staff" className="transition-colors hover:text-white">Admin</Link>
        </nav>
      </div>
    </div>
  )
}
