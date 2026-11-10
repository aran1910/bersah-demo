import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  ClipboardList,
  History,
  Leaf,
  MapPin,
  Repeat2,
  Scale,
  ScissorsLineDashed,
  Search,
  Tag,
  Warehouse,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHeading } from "@/components/site/section-heading"
import { PublicProductCard } from "@/components/site/public-product-card"
import { ContactCta } from "@/components/site/contact-cta"
import { DemoTag } from "@/components/shared/badges"
import { tenantConfig } from "@/tenants"
import { categories, categoryHref, getFeaturedProducts, getProducts } from "@/lib/catalog"
import { cartTotals, priceCartLines } from "@/lib/pricing"
import { formatMoney } from "@/lib/format"

const SERVICE_ICONS = {
  clipboard: ClipboardList,
  tag: Tag,
  warehouse: Warehouse,
  leaf: Leaf,
  scissors: ScissorsLineDashed,
}

export default function HomePage() {
  const { copy, markets, services, partnerBrands, certifications } = tenantConfig
  const featured = getFeaturedProducts().slice(0, 8)
  const preview = priceCartLines(
    [
      { productId: "p-tenderloin", unitCode: "piece", quantity: 2 },
      { productId: "p-shrimp-pd", unitCode: "case", quantity: 1 },
      { productId: "p-salmon-fillet", unitCode: "piece", quantity: 3 },
    ],
    getProducts(),
    "contract"
  )
  const previewTotals = cartTotals(preview)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-brand-deep">
        <div
          className="absolute inset-y-0 right-0 hidden w-[58%] lg:block"
          style={{ clipPath: "polygon(14% 0, 100% 0, 100% 100%, 0 100%)" }}
        >
          <Image
            src="/photos/hero-seafood.jpg"
            alt="Fresh fish, shellfish and lobster on crushed ice"
            fill
            loading="eager" fetchPriority="high"
            sizes="60vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-deep/40 to-transparent" aria-hidden="true" />
        </div>
        <div
          className="absolute inset-y-0 right-[54%] hidden w-24 bg-brand/40 lg:block"
          style={{ clipPath: "polygon(70% 0, 100% 0, 30% 100%, 0 100%)" }}
          aria-hidden="true"
        />

        <div className="container-page relative grid min-h-[calc(100svh-108px)] items-center py-16 lg:min-h-[640px] lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-6 xl:col-span-5">
            <p className="eyebrow animate-fade-up flex items-center gap-3 text-brand-accent">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              {copy.heroEyebrow}
            </p>
            <h1 className="font-display animate-fade-up mt-6 text-[2.6rem] leading-[1.08] text-white text-balance [animation-delay:80ms] sm:text-6xl lg:text-[3.6rem]">
              {copy.heroTitle}
            </h1>
            <p className="animate-fade-up mt-7 max-w-xl text-lg leading-relaxed font-light text-white/75 [animation-delay:160ms]">
              {copy.heroSubtitle}
            </p>
            <div className="animate-fade-up mt-10 flex flex-wrap gap-3 [animation-delay:240ms]">
              <Button asChild size="lg" className="h-12 bg-brand-accent px-6 text-[15px] text-brand-accent-foreground hover:bg-brand-accent/90">
                <Link href="/products">
                  Explore our products <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/30 bg-white/5 px-6 text-[15px] text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/login">Order online</Link>
              </Button>
            </div>
          </div>

          {/* Mobile image (CSS background so it never renders hidden on desktop) */}
          <div
            className="mt-12 aspect-[4/3] rounded-lg bg-cover bg-center lg:hidden"
            style={{ backgroundImage: "url(/photos/hero-seafood.jpg)" }}
            aria-hidden="true"
          />

          <div className="animate-fade-up absolute bottom-10 right-8 hidden w-[340px] items-center gap-4 rounded-lg bg-white/95 p-3 pr-5 shadow-2xl backdrop-blur [animation-delay:400ms] lg:flex">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-md">
              <Image src="/brand/facility-aerial.jpg" alt="BerSah facility on Bushiri" fill sizes="64px" className="object-cover" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-ink">Cooled &amp; frozen storage</p>
              <p className="mt-0.5 flex items-center gap-1 text-muted-foreground">
                <MapPin className="size-3.5" aria-hidden="true" /> Bushiri #33, Oranjestad
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="border-b bg-white">
        <div className="container-page grid grid-cols-2 lg:grid-cols-4">
          {copy.stats.map((s, i) => (
            <div
              key={s.label}
              className={`py-8 pr-4 sm:py-10 ${i % 2 === 1 ? "border-l pl-5 sm:pl-8" : ""} ${i >= 2 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l lg:pl-8" : ""}`}
            >
              <p className="font-display text-2xl text-brand sm:text-3xl">{s.value}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Intro ────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src="/brand/facility-aerial-wide.jpg"
                alt="Aerial view of the BerSah Aruba facility"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -right-4 -bottom-10 hidden w-56 overflow-hidden rounded-lg border-4 border-white shadow-xl sm:block lg:-right-10">
              <div className="relative aspect-[4/3]">
                <Image src="/brand/delivery.jpg" alt="BerSah delivery" fill sizes="224px" className="object-cover" />
              </div>
            </div>
            <div className="absolute -top-5 -left-3 rounded-md bg-brand-accent px-4 py-3 text-brand-accent-foreground shadow-lg sm:-left-6">
              <p className="font-display text-2xl leading-none">30+</p>
              <p className="mt-1 text-xs font-medium">years serving Aruba</p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading eyebrow="Who we are" title={copy.introTitle} />
            <div className="mt-6 space-y-4 text-base leading-relaxed font-light text-muted-foreground sm:text-lg">
              {copy.introBody.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Link href="/about" className="group mt-8 inline-flex items-center gap-2 font-medium text-brand">
              Get to know us
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section className="bg-surface py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our products"
            title="Delivering a world of quality products"
            description={copy.productsIntro}
            action={
              <Button asChild variant="outline" size="lg" className="h-11 shrink-0 bg-white px-5">
                <Link href="/products">
                  View full catalog <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            }
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, i) => (
              <Link
                key={c.id}
                href={categoryHref(c)}
                className={`group relative isolate flex min-h-[260px] flex-col justify-end overflow-hidden rounded-lg p-6 ${i === 0 || i === 5 ? "lg:col-span-2" : ""}`}
              >
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                  className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-deep/95 via-brand-deep/45 to-transparent" aria-hidden="true" />
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl text-white">{c.name}</h3>
                    <p className="mt-2 text-sm text-white/75">{c.subcategories.map((s) => s.name).join(" · ")}</p>
                  </div>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors group-hover:bg-brand-accent group-hover:text-brand-dark">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Markets ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-deep py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading
            tone="dark"
            eyebrow="Markets"
            title="Supplying Aruba's finest to restaurants, hotels, and resorts"
            description="We supply a large range of food & beverage products to various markets in Aruba."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {markets.map((m) => (
              <article key={m.id} className="group overflow-hidden rounded-lg bg-white/[0.04] ring-1 ring-white/10">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={m.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-white">{m.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{m.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured products ────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Featured"
            title="From the cold store to your kitchen"
            description="A selection from the sample catalog. Registered customers see their own pricing and order directly from the portal."
            action={
              <Button asChild size="lg" className="h-11 shrink-0 px-5">
                <Link href="/login">
                  Sign in for wholesale prices <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            }
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <PublicProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Highlight (Beyond Meat) ──────────────────────────────────────── */}
      {copy.highlight && (
        <section className="bg-surface">
          <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg shadow-xl">
              <Image src={copy.highlight.image} alt="Beyond Burger packaging and burgers" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div>
              <p className="eyebrow flex items-center gap-3 text-brand">
                <span className="h-px w-8 bg-current opacity-60" aria-hidden="true" />
                {copy.highlight.eyebrow}
              </p>
              <h2 className="font-display mt-4 text-3xl leading-tight text-ink sm:text-4xl">{copy.highlight.title}</h2>
              <p className="mt-5 text-lg leading-relaxed font-light text-muted-foreground">{copy.highlight.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-11 px-5">
                  <Link href="/products/vegan">
                    Browse vegan range <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="h-11 px-4 text-brand">
                  <a href={copy.highlight.sourceUrl} target="_blank" rel="noreferrer">
                    Read the announcement <ArrowUpRight data-icon="inline-end" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Services" title="More than a supplier" description={tenantConfig.copy.servicesIntro} />
            <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-lg">
              <Image src="/brand/cold-storage.jpg" alt="Racking inside the BerSah cold store" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
          <div className="grid content-start gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2 lg:col-span-7">
            {services.map((s) => {
              const Icon = SERVICE_ICONS[s.icon]
              return (
                <Link key={s.id} href={`/services#${s.id}`} className="group bg-white p-7 transition-colors hover:bg-brand-tint/60">
                  <span className="grid size-11 place-items-center rounded-md bg-brand-tint text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-medium text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
                </Link>
              )
            })}
            <div className="flex flex-col justify-between bg-brand p-7 text-white">
              <p className="eyebrow text-brand-accent">Certified sourcing</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {certifications.map((c) => (
                  <span key={c.code} className="rounded-sm border border-white/25 px-2.5 py-1 text-sm font-medium tracking-wide">
                    {c.code}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-sm text-white/75">Access to a wide scope of certified sustainable seafood.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ordering platform concept ────────────────────────────────────── */}
      <section className="overflow-hidden bg-gradient-to-b from-brand-tint/70 to-white py-20 lg:py-28">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-3">
              <p className="eyebrow text-brand">Online ordering</p>
              <DemoTag>Concept</DemoTag>
            </div>
            <h2 className="font-display mt-4 text-3xl leading-tight text-ink sm:text-[2.6rem]">
              Your wholesale account, open around the clock
            </h2>
            <p className="mt-5 text-lg leading-relaxed font-light text-muted-foreground">
              A private portal for {tenantConfig.shortName} customers: browse the live catalog, see your own prices, order by
              case, box or kilo, and track every delivery — while orders land directly on the order desk.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Search, title: "Search the full catalog", body: "Filter by category, storage and stock." },
                { icon: Scale, title: "Catch-weight aware", body: "Estimated totals for weighed products." },
                { icon: Repeat2, title: "One-click reorder", body: "Repeat last week's order in seconds." },
                { icon: History, title: "Order history & status", body: "From pending to delivered." },
              ].map((f) => (
                <li key={f.title} className="flex gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-white text-brand shadow-sm ring-1 ring-border">
                    <f.icon className="size-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-ink">{f.title}</span>
                    <span className="block text-sm text-muted-foreground">{f.body}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-11 px-5">
                <Link href="/login">
                  Try the customer portal <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 bg-white px-5">
                <Link href="/login?role=staff">View the admin dashboard</Link>
              </Button>
            </div>
          </div>

          {/* Mini UI preview built from real components styling */}
          <div className="relative" aria-hidden="true">
            <div className="absolute -inset-6 -z-10 rounded-[28px] bg-brand/5" />
            <div className="overflow-hidden rounded-xl border bg-white shadow-[0_40px_80px_-40px_rgba(12,51,84,0.45)]">
              <div className="flex items-center gap-2 border-b bg-surface px-4 py-3">
                <span className="size-2.5 rounded-full bg-red-300" />
                <span className="size-2.5 rounded-full bg-amber-300" />
                <span className="size-2.5 rounded-full bg-emerald-300" />
                <span className="ml-3 rounded bg-white px-3 py-1 text-[11px] text-muted-foreground ring-1 ring-border">
                  order.bersaharuba.com/portal
                </span>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-5">
                <div className="space-y-3 sm:col-span-3">
                  {preview.map((r) => (
                    <div key={r.product.id} className="flex items-center gap-3 rounded-lg border p-2.5">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-md">
                        <Image src={r.product.image} alt="" fill sizes="48px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium">{r.product.name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {r.unit.label} · {r.unit.contents}
                        </p>
                      </div>
                      <p className="tabular text-[12px] font-medium">
                        {r.unit.pricing === "catch-weight" ? "≈ " : ""}
                        {formatMoney(r.lineTotal)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-brand-deep p-4 text-white sm:col-span-2">
                  <p className="text-[11px] tracking-wider text-white/60 uppercase">Order summary</p>
                  <p className="font-display mt-3 text-2xl">{formatMoney(previewTotals.total)}</p>
                  <p className="text-[11px] text-white/60">Estimated · {preview.length} lines · contract pricing</p>
                  <div className="mt-4 flex items-center gap-2 rounded-md bg-white/10 p-2 text-[11px]">
                    <CalendarClock className="size-3.5 text-brand-accent" /> Delivery tomorrow, 06:00–09:00
                  </div>
                  <div className="mt-3 rounded-md bg-brand-accent py-2 text-center text-[12px] font-medium text-brand-dark">
                    Place order
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Partner brands ───────────────────────────────────────────────── */}
      <section className="border-y bg-white py-12">
        <div className="container-page">
          <p className="text-center text-sm text-muted-foreground">Brands featured on bersaharuba.com</p>
          <ul className="mt-8 grid grid-cols-3 items-center gap-x-8 gap-y-8 sm:grid-cols-6">
            {partnerBrands.map((b) => (
              <li key={b.name} className="flex justify-center">
                <Image
                  src={b.logo}
                  alt={b.name}
                  width={160}
                  height={72}
                  className="h-12 w-auto object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:h-14"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactCta />
    </>
  )
}
