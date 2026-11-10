import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  breadcrumbs = [],
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  image: string
  breadcrumbs?: { href: string; label: string }[]
  children?: React.ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-dark">
      <Image src={image} alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-10 object-cover opacity-45" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-deep via-brand-dark/90 to-brand-dark/30" aria-hidden="true" />
      <div className="container-page py-16 sm:py-20 lg:py-24">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-white/60">
            <Link href="/" className="hover:text-white">Home</Link>
            {breadcrumbs.map((b) => (
              <span key={b.href} className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5" aria-hidden="true" />
                <Link href={b.href} className="hover:text-white">{b.label}</Link>
              </span>
            ))}
          </nav>
        )}
        <div className="max-w-3xl animate-fade-up">
          {eyebrow && <p className="eyebrow mb-4 text-brand-accent">{eyebrow}</p>}
          <h1 className="font-display text-4xl leading-[1.1] text-white text-balance sm:text-5xl">{title}</h1>
          {description && <p className="mt-5 max-w-2xl text-lg leading-relaxed font-light text-white/75">{description}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}
