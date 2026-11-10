import type { Metadata } from "next"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AdminReady } from "@/components/admin/admin-shell"
import { AdminCustomers } from "@/components/admin/admin-customers"

export const metadata: Metadata = { title: "Customers" }

export default function CustomersPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px]" />}>
      <AdminReady>
        <AdminCustomers />
      </AdminReady>
    </Suspense>
  )
}
