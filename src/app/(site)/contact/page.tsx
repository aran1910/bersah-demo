import type { Metadata } from "next"
import { Suspense } from "react"
import Image from "next/image"
import { Clock, MapPin, Phone } from "lucide-react"
import { PageHero } from "@/components/site/page-hero"
import { ContactForm } from "@/components/site/contact-form"
import { SocialIcon, WhatsAppIcon } from "@/components/shared/social-icon"
import { tenantConfig } from "@/tenants"

export const metadata: Metadata = { title: "Contact" }

export default function ContactPage() {
  const { contact } = tenantConfig
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Connect with us"
        description={tenantConfig.copy.ctaBody}
        image="/brand/delivery.jpg"
        breadcrumbs={[{ href: "/contact", label: "Contact" }]}
      />
      <section className="py-16 lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-xl border bg-white p-6 sm:p-8">
              <h2 className="font-display text-2xl text-ink">Send us a message</h2>
              <Suspense fallback={<div className="mt-6 h-96 animate-pulse rounded-lg bg-muted" />}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
          <aside className="space-y-6 lg:col-span-5">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
              <Image src="/brand/facility-aerial.jpg" alt="BerSah facility on Bushiri, Oranjestad" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
            <div className="divide-y rounded-xl border bg-white">
              <div className="flex gap-4 p-6">
                <MapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="mt-1 text-muted-foreground">
                    {contact.addressLines.join(", ")}
                    <br />
                    {contact.city}, {contact.country}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6">
                <Phone className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    {contact.phones.map((p) => (
                      <li key={p.value}>
                        <a href={p.href} className="tabular hover:text-brand">{p.value}</a>
                        <span className="ml-2 text-xs">{p.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex gap-4 p-6">
                <Clock className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                <div className="w-full">
                  <h3 className="font-medium">Opening hours</h3>
                  <dl className="mt-1 space-y-1 text-muted-foreground">
                    {contact.openingHours.map((h) => (
                      <div key={h.days} className="flex justify-between gap-4">
                        <dt>{h.days}</dt>
                        <dd className="text-ink">{h.hours}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 p-6">
                {contact.whatsapp && (
                  <a href={contact.whatsapp.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                    <WhatsAppIcon className="size-4" /> WhatsApp us
                  </a>
                )}
                {contact.social.map((s) => (
                  <a key={s.network} href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:border-brand/40 hover:text-brand">
                    <SocialIcon network={s.network} className="size-4" /> {s.handle}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
