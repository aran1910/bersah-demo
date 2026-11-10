import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WhatsAppIcon } from "@/components/shared/social-icon"
import { tenantConfig } from "@/tenants"

export function ContactCta() {
  const { copy, contact } = tenantConfig
  return (
    <section className="relative isolate overflow-hidden bg-brand">
      <Image src="/brand/delivery.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-20 mix-blend-luminosity" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand via-brand/95 to-brand/70" aria-hidden="true" />
      <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-20">
        <div>
          <h2 className="font-display text-4xl text-white sm:text-5xl">{copy.ctaTitle}</h2>
          <p className="mt-5 max-w-lg text-lg font-light text-white/80">{copy.ctaBody}</p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Button asChild size="lg" className="h-12 bg-white px-5 text-brand-dark hover:bg-white/90">
            <a href={contact.phones[0].href}>
              <Phone data-icon="inline-start" /> Call {contact.phones[0].value}
            </a>
          </Button>
          {contact.whatsapp && (
            <Button asChild size="lg" variant="outline" className="h-12 border-white/40 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white">
              <a href={contact.whatsapp.href} target="_blank" rel="noreferrer">
                <WhatsAppIcon className="size-4" /> WhatsApp
              </a>
            </Button>
          )}
          <Button asChild size="lg" variant="outline" className="h-12 border-white/40 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white">
            <Link href="/contact">
              Contact form <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
