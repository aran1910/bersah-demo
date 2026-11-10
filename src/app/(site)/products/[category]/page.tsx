import type { Metadata } from "next"
import { Suspense } from "react"
import { PublicPageSkeleton } from "@/components/site/public-page-skeleton"
import { notFound } from "next/navigation"
import Link from "next/link"
import { PageHero } from "@/components/site/page-hero"
import { PublicProductCard } from "@/components/site/public-product-card"
import { ContactCta } from "@/components/site/contact-cta"
import { categories, categoryHref, getCategory, getProductsByCategory } from "@/lib/catalog"
import { cn } from "@/lib/utils"

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }))
}

export async function generateMetadata(props: PageProps<"/products/[category]">): Promise<Metadata> {
  const { category } = await props.params
  return { title: getCategory(category)?.name ?? "Products" }
}

export default function CategoryPage(props: PageProps<"/products/[category]">) {
  return (
    <Suspense fallback={<PublicPageSkeleton />}>
      <CategoryContent params={props.params} />
    </Suspense>
  )
}

async function CategoryContent({ params }: { params: PageProps<"/products/[category]">["params"] }) {
  const { category: slug } = await params
  const category = getCategory(slug)
  if (!category) notFound()
  const products = getProductsByCategory(category.id)

  return (
    <>
      <PageHero
        eyebrow="Product category"
        title={category.name}
        description={category.description}
        image={category.image}
        breadcrumbs={[
          { href: "/products", label: "Products" },
          { href: categoryHref(category), label: category.name },
        ]}
      />

      <nav aria-label="Categories" className="sticky top-[72px] z-20 border-b bg-white/95 backdrop-blur">
        <div className="container-page flex gap-1 overflow-x-auto py-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={categoryHref(c)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors",
                c.id === category.id ? "bg-brand text-white" : "text-ink/70 hover:bg-muted hover:text-brand"
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </nav>

      <div className="bg-surface py-14">
        <div className="container-page space-y-16">
          {category.subcategories.map((sub) => {
            const items = products.filter((p) => p.subcategoryId === sub.id)
            return (
              <section key={sub.id} aria-labelledby={sub.id}>
                <div className="flex items-baseline justify-between border-b pb-4">
                  <h2 id={sub.id} className="font-display text-2xl text-ink">{sub.name}</h2>
                  <span className="text-sm text-muted-foreground">{items.length} sample {items.length === 1 ? "product" : "products"}</span>
                </div>
                {items.length > 0 ? (
                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((p) => (
                      <PublicProductCard key={p.id} product={p} />
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 rounded-lg border border-dashed bg-white p-8 text-center text-sm text-muted-foreground">
                    Contact our team for the current range in this category.
                  </p>
                )}
              </section>
            )
          })}
        </div>
      </div>
      <ContactCta />
    </>
  )
}
