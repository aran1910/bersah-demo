/**
 * Tenant configuration.
 *
 * Everything that differs between wholesale businesses lives here: branding,
 * company copy, contact details, catalog structure, commercial rules and
 * integration settings. UI components read from the active tenant and never
 * hard-code company specifics.
 */
import type { Category } from "./catalog"
import type { IntegrationSettings } from "./integrations"

export interface TenantBranding {
  /** Main brand colour (hex). Drives `--brand` and shadcn `--primary`. */
  primary: string
  /** Darker shade used for dark sections, sidebars and hover states. */
  primaryDark: string
  /** Accent colour used sparingly for highlights. */
  accent: string
  /** Text colour that reads well on the accent colour. */
  accentForeground: string
  logo: { src: string; width: number; height: number; alt: string }
  /** Small square mark for app shells, favicons and avatars. */
  icon: string
}

export interface TenantContact {
  addressLines: string[]
  city: string
  country: string
  phones: { label: string; value: string; href: string }[]
  whatsapp?: { label: string; href: string }
  email?: string
  openingHours: { days: string; hours: string }[]
  social: { network: "facebook" | "instagram" | "linkedin"; href: string; handle: string }[]
  mapQuery?: string
}

export interface TenantService {
  id: string
  title: string
  summary: string
  body: string
  image: string
  icon: "clipboard" | "tag" | "warehouse" | "leaf" | "scissors"
}

export interface TenantCertification {
  code: string
  name: string
  description: string
}

export interface TenantMarket {
  id: string
  name: string
  description: string
  image: string
}

export interface TenantNewsItem {
  slug: string
  date: string
  title: string
  summary: string
  sourceUrl: string
}

export interface TenantPartnerBrand {
  name: string
  logo: string
}

export interface TenantCommerceSettings {
  currency: string
  /** Prefix shown before amounts, e.g. "Afl." */
  currencySymbol: string
  locale: string
  minimumOrderValue: number
  deliveryFee: number
  freeDeliveryThreshold: number
  /** Local time after which next-day delivery is no longer possible (HH:mm). */
  orderCutoff: string
  /** ISO weekday numbers (1 = Monday … 7 = Sunday) with deliveries. */
  deliveryDays: number[]
  deliveryWindows: { id: string; label: string }[]
  /** Short notice shown wherever prices appear. */
  priceDisclaimer: string
}

export interface TenantCopy {
  heroEyebrow: string
  heroTitle: string
  heroSubtitle: string
  introTitle: string
  introBody: string[]
  productsIntro: string
  aboutTitle: string
  aboutBody: { heading?: string; text: string }[]
  servicesIntro: string
  ctaTitle: string
  ctaBody: string
  stats: { value: string; label: string }[]
  highlight?: {
    eyebrow: string
    title: string
    body: string
    image: string
    sourceUrl: string
  }
}

export interface TenantConfig {
  id: string
  /** Domains that will resolve to this tenant once multi-domain routing is enabled. */
  domains: string[]
  name: string
  shortName: string
  legalName: string
  tagline: string
  description: string
  websiteUrl: string
  branding: TenantBranding
  contact: TenantContact
  copy: TenantCopy
  markets: TenantMarket[]
  categories: Category[]
  services: TenantService[]
  certifications: TenantCertification[]
  partnerBrands: TenantPartnerBrand[]
  news: TenantNewsItem[]
  commerce: TenantCommerceSettings
  integrations: IntegrationSettings
  /** Prototype-only labels. Remove for a production tenant. */
  demo: {
    enabled: boolean
    disclaimer: string
    imageCredit: string
  }
}
