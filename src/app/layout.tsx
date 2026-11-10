import type { Metadata, Viewport } from "next"
import type { CSSProperties } from "react"
import { Merriweather, Roboto } from "next/font/google"
import { tenantConfig } from "@/tenants"
import { DemoStoreProvider } from "@/lib/demo-store"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const body = Roboto({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
})

const serif = Merriweather({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["italic", "normal"],
})

export const metadata: Metadata = {
  title: {
    default: `${tenantConfig.shortName} Wholesale Ordering — Demo concept`,
    template: `%s · ${tenantConfig.shortName} (demo concept)`,
  },
  description: `${tenantConfig.description} Independent demonstration of a B2B ordering platform.`,
  icons: { icon: tenantConfig.branding.icon, apple: tenantConfig.branding.icon },
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: tenantConfig.branding.primary,
}

const tenantTheme = {
  "--tenant-primary": tenantConfig.branding.primary,
  "--tenant-primary-dark": tenantConfig.branding.primaryDark,
  "--tenant-accent": tenantConfig.branding.accent,
  "--tenant-accent-foreground": tenantConfig.branding.accentForeground,
} as CSSProperties

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${body.variable} ${serif.variable}`} style={tenantTheme}>
      <body className="min-h-dvh">
        <DemoStoreProvider>
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          <Toaster theme="light" position="bottom-right" richColors closeButton />
        </DemoStoreProvider>
      </body>
    </html>
  )
}
