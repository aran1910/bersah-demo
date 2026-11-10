import type { Metadata } from "next"
import { Suspense } from "react"
import { PublicPageSkeleton } from "@/components/site/public-page-skeleton"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, ChevronRight, Lock, MessageSquareText, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductImage } from "@/components/shared/product-image"
import { DemoTag, StorageBadge } from "@/components/shared/badges"
import { PublicProductCard } from "@/components/site/public-product-card"
import { categoryHref, getCategory, getProductBySlug, getProducts, getRelatedProducts, getSubcategoryName } from "@/lib/catalog"

export function generateStaticParams() {
  return getProducts().map((p) => ({ category: getCategory(p.categoryId)!.slug, product: p.slug }))
}

export async function generateMetadata(props: PageProps<"/products/[category]/[product]">): Promise<Metadata> {
  const { product } = await props.params
  return { title: getProductBySlug(product)?.name ?? "Product" }
}

export default function ProductPage(props: PageProps<"/products/[category]/[product]">) {
  return (
    <Suspense fallback={<PublicPageSkeleton />}>
      <ProductContent params={props.params} />
    </Suspense>
  )
}

async function ProductContent({ params }: { params: PageProps<"/products/[category]/[product]">["params"] }) {
  const { product: slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()
  const category = getCategory(product.categoryId)!
  const related = getRelatedProducts(product, 4)
  const hasCatchWeight = product.units.some((u) => u.pricing === "catch-weight")

  return (
    <>
      <div className="border-b bg-surface">
        <nav aria-label="Breadcrumb" className="container-page flex flex-wrap items-center gap-1.5 py-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-brand">Home</Link>
          <ChevronRight className="size-3.5" />
          <Link href="/products" className="hover:text-brand">Products</Link>
          <ChevronRight className="size-3.5" />
          <Link href={categoryHref(category)} className="hover:text-brand">{category.name}</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-ink">{product.name}</span>
        </nav>
      </div>

      <section className="py-12 lg:py-16">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductImage src={product.image} alt={product.name} className="aspect-[4/3] rounded-xl" eager sizes="(min-width: 1024px) 50vw, 100vw" />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StorageBadge storage={product.storage} />
              {product.brand && <span className="rounded-full bg-brand-tint px-2 py-0.5 text-[11px] font-medium text-brand">{product.brand}</span>}
              <DemoTag>Sample product</DemoTag>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              {category.name} · {getSubcategoryName(product.categoryId, product.subcategoryId)}
            </p>
            <h1 className="font-display mt-2 text-4xl leading-tight text-ink">{product.name}</h1>
            <p className="mt-5 text-lg leading-relaxed font-light text-muted-foreground">{product.description}</p>

            <div className="mt-8 overflow-hidden rounded-lg border">
              <div className="border-b bg-surface px-5 py-3 text-sm font-medium">Available pack sizes</div>
              <ul className="divide-y">
                {product.units.map((u) => (
                  <li key={u.code} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
                    <span className="font-medium text-ink">{u.label}</span>
                    <span className="text-right text-muted-foreground">{u.contents}</span>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted-foreground">Item code</dt>
                <dd className="mt-0.5 font-medium">{product.sku}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Storage</dt>
                <dd className="mt-0.5 font-medium capitalize">{product.storage}</dd>
              </div>
              {product.origin && (
                <div>
                  <dt className="text-muted-foreground">Sourced from</dt>
                  <dd className="mt-0.5 font-medium">{product.origin}</dd>
                </div>
              )}
            </dl>

            {hasCatchWeight && (
              <p className="mt-6 flex gap-3 rounded-lg bg-brand-tint/70 p-4 text-sm text-brand-dark">
                <Scale className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                Variable-weight product: ordered per piece or case and invoiced on the actual weight delivered.
              </p>
            )}

            <div className="mt-8 rounded-xl bg-brand-deep p-6 text-white">
              <p className="flex items-center gap-2 font-medium">
                <Lock className="size-4 text-brand-accent" aria-hidden="true" /> Wholesale pricing is available to registered customers
              </p>
              <p className="mt-2 text-sm text-white/70">Sign in to see your account prices, stock availability and order for next-day delivery.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-11 bg-brand-accent px-5 text-brand-accent-foreground hover:bg-brand-accent/90">
                  <Link href={`/login?next=/portal/catalog/${product.slug}`}>
                    Sign in to order <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-11 border-white/30 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white">
                  <Link href={`/contact?product=${encodeURIComponent(product.name)}`}>
                    <MessageSquareText data-icon="inline-start" /> Request a quote
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t bg-surface py-14">
          <div className="container-page">
            <h2 className="font-display text-3xl text-ink">More from {category.name}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <PublicProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
