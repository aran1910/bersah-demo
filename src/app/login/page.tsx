import type { Metadata } from "next"
import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { LoginPanel } from "@/components/portal/login-panel"
import { tenantConfig } from "@/tenants"

export const metadata: Metadata = { title: "Sign in" }

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-brand-deep lg:block">
        <Image src="/photos/hero-steak.jpg" alt="" fill loading="eager" fetchPriority="high" sizes="50vw" className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/50 to-brand-deep/10" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 p-12 xl:p-16">
          <p className="eyebrow text-brand-accent">{tenantConfig.shortName} customer portal</p>
          <p className="font-display mt-4 max-w-lg text-4xl leading-tight text-white">
            Order premium seafood and meats for tomorrow&apos;s service — any time of day.
          </p>
          <p className="mt-4 max-w-md text-white/70">{tenantConfig.tagline}.</p>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-6">
          <Logo className="h-12" />
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand">
            <ArrowLeft className="size-4" /> Back to website
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <Suspense fallback={<div className="h-[520px] animate-pulse rounded-xl bg-muted" />}>
              <LoginPanel />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
