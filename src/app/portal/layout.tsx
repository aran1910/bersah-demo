import type { Metadata } from "next"
import { PortalShell } from "@/components/portal/portal-shell"

/**
 * The portal renders from demo state kept in the browser (localStorage), so it
 * cannot produce an instant prerendered UI. Opt out of instant-navigation
 * validation until a real backend supplies this data on the server.
 */
export const instant = false

export const metadata: Metadata = { title: { default: "Customer portal", template: "%s · Customer portal (demo)" } }

export default function PortalLayout({ children }: LayoutProps<"/portal">) {
  return <PortalShell>{children}</PortalShell>
}
