import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { PortalProductDetail } from "@/components/portal/portal-product-detail"
import { PortalReady } from "@/components/portal/portal-shell"
import { tenant } from "@/tenants"

export function generateStaticParams() {
  return tenant.products.map((p) => ({ product: p.slug }))
}

async function Loader({ params }: { params: PageProps<"/portal/catalog/[product]">["params"] }) {
  const { product } = await params
  return (
    <PortalReady>
      <PortalProductDetail slug={product} />
    </PortalReady>
  )
}

export default function PortalProductPage(props: PageProps<"/portal/catalog/[product]">) {
  return (
    <Suspense fallback={<Skeleton className="h-[560px] w-full" />}>
      <Loader params={props.params} />
    </Suspense>
  )
}
