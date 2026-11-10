import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { tenantConfig } from "@/tenants"

interface LogoProps {
  href?: string
  className?: string
  /** Render on a white tile so the logo reads on dark backgrounds. */
  onDark?: boolean
  eager?: boolean
}

export function Logo({ href = "/", className, onDark, eager }: LogoProps) {
  const { logo } = tenantConfig.branding
  const img = (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      loading={eager ? "eager" : undefined}
      className="h-full w-auto"
    />
  )
  return (
    <Link
      href={href}
      aria-label={`${tenantConfig.name} home`}
      className={cn(
        "inline-flex h-12 shrink-0 items-center",
        onDark && "rounded-md bg-white p-1.5 shadow-sm",
        className
      )}
    >
      {img}
    </Link>
  )
}

/** Compact square brand mark for app shells. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex size-9 overflow-hidden rounded-md bg-white ring-1 ring-black/5", className)}>
      <Image src={tenantConfig.branding.icon} alt="" fill sizes="40px" className="object-contain p-0.5" />
    </span>
  )
}
