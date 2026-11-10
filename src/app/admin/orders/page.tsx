import type { Metadata } from "next"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AdminReady } from "@/components/admin/admin-shell"
import { AdminOrders } from "@/components/admin/admin-orders"

export const metadata: Metadata = { title: "Orders" }

export default function OrdersPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px]" />}>
      <AdminReady>
        <AdminOrders />
      </AdminReady>
    </Suspense>
  )
}
