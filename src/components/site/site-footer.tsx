import Link from "next/link"
import { Clock, MapPin, Phone } from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { SocialIcon, WhatsAppIcon } from "@/components/shared/social-icon"
import { tenantConfig } from "@/tenants"
import { categories, categoryHref } from "@/lib/catalog"

export function SiteFooter() {
  const { contact, demo } = tenantConfig
  return (
    <footer className="no-print bg-brand-deep text-white/75">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo onDark className="h-16" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed">{tenantConfig.description}</p>
          <div className="mt-6 flex items-center gap-2">
            {contact.social.map((s) => (
              <a
                key={s.network}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${tenantConfig.shortName} on ${s.network}`}
                className="grid size-10 place-items-center rounded-full bg-white/8 text-white transition-colors hover:bg-brand-accent hover:text-brand-dark"
              >
                <SocialIcon network={s.network} className="size-[18px]" />
              </a>
            ))}
            {contact.whatsapp && (
              <a
                href={contact.whatsapp.href}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="grid size-10 place-items-center rounded-full bg-white/8 text-white transition-colors hover:bg-brand-accent hover:text-brand-dark"
              >
                <WhatsAppIcon className="size-[18px]" />
              </a>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-sm font-medium text-white">Products</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={categoryHref(c)} className="transition-colors hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-sm font-medium text-white">Company</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["/about", "About us"],
              ["/services", "Services"],
              ["/news", "News"],
              ["/contact", "Contact"],
              ["/login", "Customer portal"],
              ["/login?role=staff", "Employee admin"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5 text-sm lg:col-span-4">
          <h2 className="text-sm font-medium text-white">Contact</h2>
          <p className="flex gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-brand-accent" aria-hidden="true" />
            <span>
              {contact.addressLines.join(", ")}, {contact.city}, {contact.country}
            </span>
          </p>
          <div className="flex gap-3">
            <Phone className="mt-0.5 size-4 shrink-0 text-brand-accent" aria-hidden="true" />
            <ul className="space-y-1">
              {contact.phones.map((p) => (
                <li key={p.value}>
                  <a href={p.href} className="tabular transition-colors hover:text-white">
                    {p.value}
                  </a>
                  <span className="ml-2 text-white/40">{p.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-3">
            <Clock className="mt-0.5 size-4 shrink-0 text-brand-accent" aria-hidden="true" />
            <ul className="space-y-1">
              {contact.openingHours.map((h) => (
                <li key={h.days}>
                  <span className="text-white/90">{h.days}</span> · {h.hours}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>{demo.disclaimer}</p>
          <p>{demo.imageCredit}</p>
        </div>
      </div>
    </footer>
  )
}
