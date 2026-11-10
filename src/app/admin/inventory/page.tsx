import type { Metadata } from "next"
import { AdminReady } from "@/components/admin/admin-shell"
import { AdminInventory } from "@/components/admin/admin-inventory"

export const metadata: Metadata = { title: "Inventory" }

export default function InventoryPage() {
  return (
    <AdminReady>
      <AdminInventory />
    </AdminReady>
  )
}
