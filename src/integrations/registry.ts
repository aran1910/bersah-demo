import type { Connector, IntegrationDefinition, IntegrationProvider } from "@/types/integrations"

/**
 * Catalogue of planned back-office connectors.
 *
 * Definitions only — no connector is implemented in the prototype. Each
 * provider will get its own module (e.g. `integrations/odoo.ts`) that
 * implements the `Connector` interface for the capabilities listed here.
 */
export const INTEGRATIONS: Record<IntegrationProvider, IntegrationDefinition> = {
  odoo: {
    provider: "odoo",
    name: "Odoo",
    category: "ERP",
    description: "Sync products, price lists, stock and customers; push portal orders as sales orders.",
    capabilities: [
      { capability: "products", direction: "import" },
      { capability: "pricing", direction: "import" },
      { capability: "inventory", direction: "import" },
      { capability: "customers", direction: "two-way" },
      { capability: "orders", direction: "export" },
    ],
  },
  "sap-business-one": {
    provider: "sap-business-one",
    name: "SAP Business One",
    category: "ERP",
    description: "Item master data, warehouse stock and business partners via the Service Layer API.",
    capabilities: [
      { capability: "products", direction: "import" },
      { capability: "inventory", direction: "import" },
      { capability: "customers", direction: "import" },
      { capability: "orders", direction: "export" },
    ],
  },
  quickbooks: {
    provider: "quickbooks",
    name: "QuickBooks Online",
    category: "Accounting",
    description: "Customers and items from QuickBooks; confirmed orders become invoices.",
    capabilities: [
      { capability: "customers", direction: "import" },
      { capability: "products", direction: "import" },
      { capability: "invoices", direction: "export" },
    ],
  },
  sage: {
    provider: "sage",
    name: "Sage",
    category: "Accounting",
    description: "Customer accounts, credit limits and invoice export for Sage accounting.",
    capabilities: [
      { capability: "customers", direction: "import" },
      { capability: "invoices", direction: "export" },
    ],
  },
  "csv-excel": {
    provider: "csv-excel",
    name: "CSV / Excel import",
    category: "File import",
    description: "Upload product lists, price lists and stock levels from spreadsheets; export orders to CSV.",
    capabilities: [
      { capability: "products", direction: "import" },
      { capability: "pricing", direction: "import" },
      { capability: "inventory", direction: "import" },
      { capability: "orders", direction: "export" },
    ],
  },
}

/** Connector instances will be registered here once implemented. */
export const connectors: Partial<Record<IntegrationProvider, Connector>> = {}
