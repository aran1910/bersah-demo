/**
 * Integration contracts for future back-office connections.
 *
 * Nothing here talks to an external system yet. The interfaces describe what
 * a connector must provide so each tenant can plug in its own ERP, accounting
 * package or file import without changing the UI.
 */
import type { Product } from "./catalog"
import type { Customer, Order, OrderStatus } from "./commerce"

export type IntegrationProvider =
  | "odoo"
  | "sap-business-one"
  | "quickbooks"
  | "sage"
  | "csv-excel"

export type IntegrationCapability =
  | "products"
  | "pricing"
  | "inventory"
  | "customers"
  | "orders"
  | "invoices"

export type SyncDirection = "import" | "export" | "two-way"

export interface IntegrationDefinition {
  provider: IntegrationProvider
  name: string
  category: "ERP" | "Accounting" | "File import"
  description: string
  capabilities: { capability: IntegrationCapability; direction: SyncDirection }[]
}

export interface IntegrationSettings {
  /** Providers the tenant intends to connect, in order of priority. */
  planned: IntegrationProvider[]
  /** Provider that is live for this tenant (none during the prototype). */
  active: IntegrationProvider | null
}

/** Shape a connector returns when importing data from a source system. */
export interface ExternalRecord<T> {
  externalId: string
  data: T
  updatedAt: string
}

export interface CatalogSource {
  pullProducts(): Promise<ExternalRecord<Partial<Product>>[]>
  pullStockLevels(): Promise<{ sku: string; quantity: number }[]>
}

export interface CustomerSource {
  pullCustomers(): Promise<ExternalRecord<Partial<Customer>>[]>
}

export interface OrderSink {
  /** Send a confirmed order to the back-office system. */
  pushOrder(order: Order): Promise<{ externalId: string }>
  pullOrderStatus(externalId: string): Promise<OrderStatus>
}

export interface Connector {
  definition: IntegrationDefinition
  catalog?: CatalogSource
  customers?: CustomerSource
  orders?: OrderSink
}
