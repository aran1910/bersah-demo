import type { Metadata } from "next"
import { ArrowUpRight } from "lucide-react"
import { PageHero } from "@/components/site/page-hero"
import { tenantConfig } from "@/tenants"
import { formatDateLong } from "@/lib/format"

export const metadata: Metadata = { title: "News" }

export default function NewsPage() {
  const [lead, ...rest] = tenantConfig.news
  return (
    <>
      <PageHero
        eyebrow="News"
        title="News from BerSah"
        description="Recent announcements published on bersaharuba.com. Articles open on the official website."
        image="/brand/team.jpg"
        breadcrumbs={[{ href: "/news", label: "News" }]}
      />
      <section className="py-16 lg:py-20">
        <div className="container-page grid gap-6 lg:grid-cols-3">
          <a
            href={lead.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col justify-between rounded-xl bg-brand p-8 text-white lg:col-span-2 lg:row-span-2 lg:p-10"
          >
            <div>
              <time className="text-sm text-white/60" dateTime={lead.date}>{formatDateLong(lead.date)}</time>
              <h2 className="font-display mt-4 text-3xl leading-tight sm:text-4xl">{lead.title}</h2>
              <p className="mt-5 max-w-2xl text-lg font-light text-white/80">{lead.summary}</p>
            </div>
            <span className="mt-10 inline-flex items-center gap-2 font-medium text-brand-accent">
              Read on bersaharuba.com <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>
          {rest.map((n) => (
            <a key={n.slug} href={n.sourceUrl} target="_blank" rel="noreferrer" className="group rounded-xl border bg-white p-7 transition-colors hover:border-brand/30 hover:bg-brand-tint/30">
              <time className="text-sm text-muted-foreground" dateTime={n.date}>{formatDateLong(n.date)}</time>
              <h2 className="mt-3 text-lg font-medium text-ink group-hover:text-brand">{n.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{n.summary}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand">
                Read article <ArrowUpRight className="size-3.5" />
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
