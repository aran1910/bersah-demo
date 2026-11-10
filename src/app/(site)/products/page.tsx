import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { PageHero } from "@/components/site/page-hero"
import { PublicCatalog } from "@/components/site/public-catalog"
import { ContactCta } from "@/components/site/contact-cta"
import { DemoTag } from "@/components/shared/badges"
import { categories, categoryHref, getProducts } from "@/lib/catalog"
import { tenantConfig } from "@/tenants"

export const metadata: Metadata = { title: "Products" }

export default function ProductsPage() {
  const products = getProducts()
  return (
    <>
      <PageHero
        eyebrow="Our products"
        title="Discover Aruba's finest: premium, high-quality and fresh products"
        description={tenantConfig.copy.productsIntro}
        image="/brand/banner-meats.jpg"
        breadcrumbs={[{ href: "/products", label: "Products" }]}
      />

      <section className="border-b bg-white">
        <div className="container-page grid grid-cols-2 gap-px py-10 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((c) => (
            <Link key={c.id} href={categoryHref(c)} className="group flex flex-col items-center gap-3 rounded-lg p-3 text-center transition-colors hover:bg-surface">
              <span className="relative size-20 overflow-hidden rounded-full ring-2 ring-transparent transition group-hover:ring-brand-accent">
                <Image src={c.image} alt="" fill sizes="80px" className="object-cover" />
              </span>
              <span className="text-sm font-medium text-ink group-hover:text-brand">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-surface py-14">
        <div className="container-page">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <h2 className="font-display text-3xl text-ink">Sample catalog</h2>
            <DemoTag>Illustrative products</DemoTag>
          </div>
          <PublicCatalog products={products} categories={categories} />
        </div>
      </section>
      <ContactCta />
    </>
  )
}
