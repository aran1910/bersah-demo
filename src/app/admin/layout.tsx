import type { Metadata } from "next"
import { AdminShell } from "@/components/admin/admin-shell"

/** Admin renders from browser-held demo state; see the note in app/portal/layout.tsx. */
export const instant = false

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin (demo)" } }

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>
}
