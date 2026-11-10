import type { Metadata } from "next"
import Image from "next/image"
import { PageHero } from "@/components/site/page-hero"
import { SectionHeading } from "@/components/site/section-heading"
import { ContactCta } from "@/components/site/contact-cta"
import { tenantConfig } from "@/tenants"

export const metadata: Metadata = { title: "About us" }

export default function AboutPage() {
  const { copy, markets } = tenantConfig
  const [intro, ...pillars] = copy.aboutBody
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={copy.aboutTitle}
        description={intro.text}
        image="/brand/facade.jpg"
        breadcrumbs={[{ href: "/about", label: "About us" }]}
      />

      <section className="border-b bg-white">
        <div className="container-page grid grid-cols-2 lg:grid-cols-4">
          {copy.stats.map((s, i) => (
            <div key={s.label} className={`py-10 ${i > 0 ? "lg:border-l lg:pl-8" : ""} ${i % 2 === 1 ? "border-l pl-6" : ""}`}>
              <p className="font-display text-3xl text-brand">{s.value}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Our story" title="From seafood specialists to a complete food solutions provider" />
            <p className="mt-6 text-lg leading-relaxed font-light text-muted-foreground">{copy.introBody[0]}</p>
          </div>
          <div className="grid gap-6 lg:col-span-7">
            {pillars.map((p, i) => (
              <article key={p.heading} className="flex gap-6 rounded-lg border bg-white p-7">
                <span className="font-display text-3xl text-brand-accent">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-lg font-medium text-ink">{p.heading}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{p.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20 lg:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Our facility" title="Bushiri #33, Oranjestad" description="Warehousing with cooled and frozen storage, production facilities for portion control, and our own delivery fleet." />
          <div className="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg md:col-span-2 md:row-span-2 md:aspect-auto">
              <Image src="/brand/facility-aerial-wide.jpg" alt="Aerial view of the BerSah facility" fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image src="/brand/cold-storage.jpg" alt="Cold storage racking" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image src="/brand/team.jpg" alt="The BerSah team" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Markets" title="Who we supply" description="We supply a large range of food & beverage products to various markets in Aruba." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {markets.map((m) => (
              <div key={m.id} className="rounded-lg border p-6">
                <h3 className="font-display text-xl text-ink">{m.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ContactCta />
    </>
  )
}
