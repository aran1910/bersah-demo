import type { Category, Product } from "@/types/catalog"
import { tenant } from "@/tenants"

/**
 * Read-only catalog access for server-rendered public pages.
 * Swap this module for API / ERP-backed queries in production.
 */
export const categories: Category[] = tenant.config.categories

export function getCategory(slugOrId: string): Category | undefined {
  return categories.find((c) => c.slug === slugOrId || c.id === slugOrId)
}

export function getSubcategoryName(categoryId: string, subcategoryId: string): string {
  return getCategory(categoryId)?.subcategories.find((s) => s.id === subcategoryId)?.name ?? ""
}

export function getProducts(): Product[] {
  return tenant.products.filter((p) => p.active)
}

export function getProductsByCategory(categoryId: string): Product[] {
  return getProducts().filter((p) => p.categoryId === categoryId)
}

export function getProductBySlug(slug: string): Product | undefined {
  return tenant.products.find((p) => p.slug === slug)
}

export function getFeaturedProducts(): Product[] {
  return getProducts().filter((p) => p.featured)
}

export function getRelatedProducts(product: Product, limit = 4, pool: Product[] = getProducts()): Product[] {
  const same = pool.filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
  const sameSub = same.filter((p) => p.subcategoryId === product.subcategoryId)
  const rest = same.filter((p) => p.subcategoryId !== product.subcategoryId)
  return [...sameSub, ...rest].slice(0, limit)
}

export function categoryHref(category: Category) {
  return `/products/${category.slug}`
}

export function productHref(product: Product) {
  const category = getCategory(product.categoryId)
  return `/products/${category?.slug ?? product.categoryId}/${product.slug}`
}
