import type { Metadata } from "next"
import { Suspense } from "react"
import { CatalogBrowser } from "@/components/portal/catalog-browser"
import { Skeleton } from "@/components/ui/skeleton"
import { PortalReady } from "@/components/portal/portal-shell"

export const metadata: Metadata = { title: "Order products" }

export default function CatalogPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
      <PortalReady>
        <CatalogBrowser />
      </PortalReady>
    </Suspense>
  )
}
