import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AdminReady } from "@/components/admin/admin-shell"
import { AdminOrderDetail } from "@/components/admin/admin-order-detail"

async function Loader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <AdminReady>
      <AdminOrderDetail id={id} />
    </AdminReady>
  )
}

export default function AdminOrderPage(props: PageProps<"/admin/orders/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-[600px]" />}>
      <Loader params={props.params} />
    </Suspense>
  )
}
