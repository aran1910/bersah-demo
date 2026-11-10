import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { PortalReady } from "@/components/portal/portal-shell"
import { PortalOrderDetail } from "@/components/portal/portal-order-detail"

async function OrderDetailLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <PortalReady>
      <PortalOrderDetail id={id} />
    </PortalReady>
  )
}

export default function PortalOrderPage(props: PageProps<"/portal/orders/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-[480px] w-full" />}>
      <OrderDetailLoader params={props.params} />
    </Suspense>
  )
}
