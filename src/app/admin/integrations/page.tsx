import type { Metadata } from "next"
import { ArrowDownToLine, ArrowLeftRight, ArrowUpFromLine, Building2, Database, Layers, Palette, PlugZap } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DemoTag, Pill } from "@/components/shared/badges"
import { INTEGRATIONS } from "@/integrations/registry"
import { tenantConfig } from "@/tenants"

export const metadata: Metadata = { title: "Integrations" }

const DIRECTION = {
  import: { icon: ArrowDownToLine, label: "Import" },
  export: { icon: ArrowUpFromLine, label: "Export" },
  "two-way": { icon: ArrowLeftRight, label: "Two-way" },
}

export default function IntegrationsPage() {
  const planned = tenantConfig.integrations.planned
  return (
    <div className="space-y-8">
      <PageHeader
        title="Integrations"
        description="Back-office connections planned for this platform. None are active in the prototype."
        actions={<DemoTag>Planned — not implemented</DemoTag>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {planned.map((id, i) => {
          const def = INTEGRATIONS[id]
          return (
            <article key={id} className="flex flex-col rounded-xl border bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-brand-tint text-brand">
                    <PlugZap className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-medium">{def.name}</h2>
                    <p className="text-xs text-muted-foreground">{def.category}</p>
                  </div>
                </div>
                <Pill tone={i === 0 ? "blue" : "slate"}>{i === 0 ? "Priority" : "Planned"}</Pill>
              </div>
              <p className="mt-4 flex-1 text-sm text-muted-foreground">{def.description}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {def.capabilities.map((c) => {
                  const d = DIRECTION[c.direction]
                  return (
                    <li key={c.capability} className="inline-flex items-center gap-1 rounded-md bg-surface px-2 py-1 text-xs capitalize">
                      <d.icon className="size-3 text-brand" aria-label={d.label} /> {c.capability}
                    </li>
                  )
                })}
              </ul>
            </article>
          )
        })}
      </div>

      <section className="rounded-xl border bg-white p-6">
        <h2 className="font-display text-2xl">Built for multiple wholesalers</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          The platform separates each company&apos;s configuration from the user interface, so the same codebase can run a
          customised ordering platform for other distributors.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: Palette, title: "Branding", body: "Colours, logo, copy and imagery come from the tenant config — the whole UI re-themes." },
            { icon: Building2, title: "Company data", body: "Categories, services, markets, contact details and commercial rules per tenant." },
            { icon: Layers, title: "Pricing & catalog", body: "Products, pack sizes, catch-weight units and customer price lists per tenant." },
            { icon: Database, title: "Connectors", body: "Typed interfaces for catalog, customer and order sync; one module per ERP." },
          ].map((f) => (
            <div key={f.title} className="rounded-lg bg-surface p-4">
              <f.icon className="size-5 text-brand" />
              <h3 className="mt-3 font-medium">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
        <dl className="mt-6 grid gap-x-8 gap-y-2 rounded-lg border p-4 text-sm sm:grid-cols-2">
          <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Tenant ID</dt><dd className="font-mono">{tenantConfig.id}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Domains</dt><dd className="font-mono text-right">{tenantConfig.domains.join(", ")}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Currency</dt><dd>{tenantConfig.commerce.currency} ({tenantConfig.commerce.currencySymbol})</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Order cut-off</dt><dd>{tenantConfig.commerce.orderCutoff}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Primary colour</dt><dd className="flex items-center gap-2 font-mono"><span className="size-3 rounded-sm" style={{ background: tenantConfig.branding.primary }} />{tenantConfig.branding.primary}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Accent colour</dt><dd className="flex items-center gap-2 font-mono"><span className="size-3 rounded-sm" style={{ background: tenantConfig.branding.accent }} />{tenantConfig.branding.accent}</dd></div>
        </dl>
      </section>
    </div>
  )
}
