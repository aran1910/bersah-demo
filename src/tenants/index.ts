import type { TenantConfig } from "@/types/tenant"
import type { Product } from "@/types/catalog"
import type { Customer } from "@/types/commerce"
import { bersahConfig } from "./bersah/config"
import { bersahProducts } from "./bersah/products"
import { bersahCustomers, bersahStaff } from "./bersah/customers"

/**
 * Tenant registry.
 *
 * Each wholesale business registers its configuration and seed data here.
 * Today the active tenant is chosen with NEXT_PUBLIC_TENANT (default "bersah").
 * In production, `resolveTenantByHost` would run in `proxy.ts` and the data
 * would come from a database or a connected ERP instead of local files.
 */
export interface TenantBundle {
  config: TenantConfig
  products: Product[]
  customers: Customer[]
  staff: { id: string; name: string; role: string }[]
}

const registry: Record<string, TenantBundle> = {
  bersah: {
    config: bersahConfig,
    products: bersahProducts,
    customers: bersahCustomers,
    staff: bersahStaff,
  },
}

const DEFAULT_TENANT = "bersah"

export function getTenantBundle(id: string = process.env.NEXT_PUBLIC_TENANT ?? DEFAULT_TENANT): TenantBundle {
  return registry[id] ?? registry[DEFAULT_TENANT]
}

export function resolveTenantByHost(host: string): TenantBundle {
  const hostname = host.split(":")[0].toLowerCase()
  const match = Object.values(registry).find((t) => t.config.domains.includes(hostname))
  return match ?? getTenantBundle()
}

export const tenant = getTenantBundle()
export const tenantConfig = tenant.config
