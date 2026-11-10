import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { PortalReady } from "@/components/portal/portal-shell"
import { OrderConfirmation } from "@/components/portal/order-confirmation"

async function Loader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <PortalReady>
      <OrderConfirmation id={id} />
    </PortalReady>
  )
}

export default function OrderConfirmedPage(props: PageProps<"/portal/orders/[id]/confirmed">) {
  return (
    <Suspense fallback={<Skeleton className="h-[480px] w-full" />}>
      <Loader params={props.params} />
    </Suspense>
  )
}
