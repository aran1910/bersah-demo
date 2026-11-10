import type { Metadata } from "next"
import Image from "next/image"
import { BadgeCheck } from "lucide-react"
import { PageHero } from "@/components/site/page-hero"
import { SectionHeading } from "@/components/site/section-heading"
import { ContactCta } from "@/components/site/contact-cta"
import { tenantConfig } from "@/tenants"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Services" }

export default function ServicesPage() {
  const { services, certifications, copy } = tenantConfig
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Full service, from ordering to cold storage"
        description={copy.servicesIntro}
        image="/brand/cold-storage.jpg"
        breadcrumbs={[{ href: "/services", label: "Services" }]}
      />

      <div className="py-20 lg:py-24">
        <div className="container-page space-y-20 lg:space-y-28">
          {services.map((s, i) => (
            <section key={s.id} id={s.id} className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <div className={cn("relative aspect-[4/3] overflow-hidden rounded-lg", i % 2 === 1 && "lg:order-2")}>
                <Image src={s.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <div>
                <p className="font-display text-5xl text-brand/15">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="font-display mt-2 text-3xl text-ink sm:text-4xl">{s.title}</h2>
                <p className="mt-3 text-lg font-medium text-brand">{s.summary}</p>
                <p className="mt-5 text-lg leading-relaxed font-light text-muted-foreground">{s.body}</p>
              </div>
            </section>
          ))}
        </div>
      </div>

      <section className="bg-brand-deep py-20 lg:py-24">
        <div className="container-page">
          <SectionHeading
            tone="dark"
            eyebrow="Certified sustainable products"
            title="Access to ASC, BAP and MSC certified seafood"
            description="BerSah gives customers access to a wide scope of certified sustainable products. Ask our team which items in the range carry each certification."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {certifications.map((c) => (
              <article key={c.code} className="rounded-lg bg-white/[0.05] p-7 ring-1 ring-white/10">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="size-6 text-brand-accent" aria-hidden="true" />
                  <span className="font-display text-3xl text-white">{c.code}</span>
                </div>
                <h3 className="mt-4 font-medium text-white">{c.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{c.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ContactCta />
    </>
  )
}
