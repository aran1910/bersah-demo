import type { Metadata } from "next"
import { AdminReady } from "@/components/admin/admin-shell"
import { AdminProducts } from "@/components/admin/admin-products"

export const metadata: Metadata = { title: "Products" }

export default function ProductsPage() {
  return (
    <AdminReady>
      <AdminProducts />
    </AdminReady>
  )
}
