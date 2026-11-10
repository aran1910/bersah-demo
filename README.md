# BerSah Wholesale Ordering Platform (demo concept)

An interactive prototype of a B2B ordering platform built for **BerSah Aruba N.V.**, a wholesale food supplier in Aruba.

> **Independent demonstration concept.** This is not an official BerSah website. Company information comes from
> [bersaharuba.com](https://www.bersaharuba.com) (see [`docs/bersah-research.md`](docs/bersah-research.md)).
> Products, prices, stock levels, customer accounts and orders are illustrative.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Production build: `npm run build && npm start`.

## Demo walkthrough

1. **Public website** (`/`): homepage, products, category and product pages, services, about, news, contact.
   Prices are hidden until sign-in, as on most B2B sites.
2. **Customer portal**: click **Customer login** and pick a demo account. Each account has its own price list
   (Standard, Preferred −3%, Contract −6%).
   - Dashboard with order cut-off countdown, upcoming deliveries, quick reorder and "your regulars"
   - Catalog with search, category, storage and stock filters, a grid view and a quick-order list view
   - Order by case, box, bag, bottle, piece or kilo; variable-weight (catch-weight) items show an estimate
   - Cart drawer and cart page, minimum order value, free-delivery progress
   - Checkout with delivery date and window, PO number and notes → generated order number → confirmation
   - Order history, order tracking, reorder, profile and notification preferences
3. **Employee admin** (`/login?role=staff`): overview KPIs and chart, order desk with inline status changes,
   bulk confirm and CSV export, order detail with status flow, cancel and internal notes, product editing,
   CSV import preview, inventory with stock adjustments, customer management (approve, hold, price list),
   and planned integrations.

A visitor can be signed in as a customer **and** an employee at once. Place an order in the portal, then open the
admin to see it arrive and move it through the workflow; the customer sees the new status. State is saved in
`localStorage` and syncs between tabs. **Reset demo data** is in the admin user menu and on the portal account page.

Everything that would normally talk to the outside world is simulated and labelled: authentication, order
submission, emails/WhatsApp, payments and ERP sync.

## Stack

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · Lucide icons.

## Project structure

```
src/
  app/
    (site)/            Public website (server-rendered, statically generated)
    login/             Demo sign-in
    portal/            Customer portal (client-rendered from demo state)
    admin/             Employee admin
  components/
    brand/ site/ portal/ admin/ shared/ ui/   (ui = shadcn/ui)
  tenants/
    index.ts           Tenant registry and resolution
    bersah/            BerSah config (branding, copy, contact, categories, rules) + sample data
  types/               Tenant, catalog, commerce and integration types
  integrations/        Planned connector definitions (Odoo, SAP B1, QuickBooks, Sage, CSV/Excel)
  lib/                 Pricing (tiers, catch weight), orders, formatting, demo store, seed data
docs/bersah-research.md   What was verified on bersaharuba.com vs. what is assumed
```

## Multi-tenant design

Company-specific details live in `src/tenants/<tenant>/`, not in components:

- **`config.ts`**: name, domains, colours, logo, copy, contact details, markets, categories, services,
  certifications, partner brands, news, currency, delivery days, cut-off, minimum order, planned integrations.
- **`products.ts` / `customers.ts`**: catalog and accounts (to be replaced by API or ERP data).

Brand colours are injected as CSS variables on `<html>` and drive both the custom tokens and shadcn's `--primary`,
so a second tenant re-skins the whole app. The active tenant comes from `NEXT_PUBLIC_TENANT`;
`resolveTenantByHost()` is ready for per-domain routing in `proxy.ts`.

`src/types/integrations.ts` defines `CatalogSource`, `CustomerSource` and `OrderSink` contracts. Each ERP will get
a connector module implementing them. None are implemented in this prototype.

## Next steps for production

- Real authentication and per-tenant user and role management
- Database, plus API routes or server actions instead of `localStorage`
- ERP / accounting connector for BerSah's actual system
- Customer-specific price lists, taxes and credit checks from the ERP
- Email and WhatsApp notifications
- Catch-weight invoicing from warehouse scale data

## Image credits

Company photography and logos are from bersaharuba.com and belong to Bersah Aruba N.V. and the respective brand
owners. They are used here only to pitch this concept to BerSah. Additional food photography is from
[Unsplash](https://unsplash.com) (Unsplash License).
