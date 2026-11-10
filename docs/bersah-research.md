# BerSah Aruba N.V. — Research Notes

Research for an independent B2B ordering-platform concept. This is **not** an official BerSah project.

- **Source:** https://www.bersaharuba.com/ (fetched directly on 2026-11-10: page HTML, stylesheet and images)
- **Pages reviewed:** Home, Products, Services, About us, Contact, News (all 6 articles), Privacy Policy
- **Supporting search:** a web search found one third-party directory listing (bestfoodimporters.com). It is noted below but was **not** used as a source of facts for the prototype.

---

## 1. Verified information (from bersaharuba.com)

### Identity
| Item | Value | Where |
|---|---|---|
| Legal / trading name | Bersah Aruba N.V. (styled "BerSah Aruba N.V." in copy and logo; "BerSah N.V." in Services copy) | Home, About, Services |
| Page title / positioning | "Your Trusted Wholesale Food Supplier in Aruba" | `<title>` |
| Hero headline | "Your Trusted Wholesaler in Aruba of Quality Seafood and Meats" | Home |
| Meta description | "From premium seafood to gourmet meats and vegan options, we're your partner for quality and variety." | Home |
| Logo | Black fish outline over a green gradient circle, wordmark "BerSah Aruba N.V." in blue italic serif, small "whole saler" tagline | `/themes/main/assets/images/logo.png` |

### History and positioning
- Home page: "With **over 30 years** of dedicated service in Aruba's food industry… From our beginnings as **seafood specialists** to our current status as a **comprehensive food solutions provider**."
- Services page: "With over 30 years of experience, BerSah N.V. has established a prestigious position with a wide network across the globe. We are Aruba's premier import partner, especially for quality meat and fresh seafood and fish."
- About page: "With **over 25 years** of dedicated service…" — **inconsistency**: the About page says 25+ years, Home and Services say 30+. The prototype uses "30+ years" (the more recent-looking and more frequent claim). Worth confirming with BerSah.
- About page themes: *Our Commitment* (quality; strong relationships with suppliers worldwide; "sourcing the juiciest cuts of meat from North America"; "partnering with top sushi purveyors"), *Innovation and Variety*, *Service Excellence*.
- Founding year: **not stated** anywhere on the site.

### Markets served (Home → "Markets")
"We supply a large range of Food & Beverage products to various markets in Aruba."
- Restaurants
- Resorts
- Hotels
- Food Trucks

Home headline: "Supplying Aruba's Finest to Restaurants, Hotels, and Resorts!"

### Product categories (Products page, exact)
| Category | Sub-categories listed |
|---|---|
| Meats | Meats with bone · Boneless · Sausages |
| Fish | Filet · Fresh · Portion Controlled |
| Seafood | Lobster · Crustaceans · Octopus |
| Poultry | Whole chicken · Chicken wings |
| Beverages | Wine · Cocktail mix · Liqueur |
| Dry Goods | Seasonings · Other |
| Vegan | Beyond Meat supplier · Vegan alternatives |
| Equipment | (no sub-categories listed) |

Products page intro: "Discover Aruba's Finest: Premium, High-Quality, and Fresh Products."
Home also mentions "a tantalizing selection of **sushi** and vegan options" and "premium seafood sourced globally to top-grade meats".

No individual products, SKUs, prices, pack sizes or stock levels are published.

### Brands shown on the site (home-page logo carousel)
Beyond Meat · Tropics Mixology · Peter's Farm · Bush Brothers (Provision Company) · Sysco · Agristo

A delivery photo shows a truck with "Peter's Farm — The Premium Veal" branding.

### Services (Services page)
Intro: "In addition to the food and beverages we import, we offer a full service, from ordering assistance to storage in our state-of-the-art facilities. Whether you want to import branded or white-label products for your restaurant or hotel… In our production facilities we can **portion control** to your required specifications."

1. **Ordering process** — import partner with a wide global network; "seamless ordering process".
2. **Private-label distribution** — private-labelling for hotels and restaurants (wine and food); handles ordering, importing and storage in "advanced cooled and frozen storage facilities".
3. **Full Service Storage Rental** — "one of the few distributors offering top-tier storage facilities for restaurants and hotels in Aruba", (cooled) storage whether importing through BerSah or ordering independently.
4. **Certified Sustainable Products** — "access to a wide scope of Certified Sustainable Products" with certifications such as **ASC** (Aquaculture Stewardship Council), **BAP** (Best Aquaculture Practices) and **MSC** (Marine Stewardship Council). The site does **not** say which specific products carry which certification.

### Contact details (footer + Contact page)
| Item | Value |
|---|---|
| Address | Bushiri #33, Oranjestad, Aruba |
| Phone | +297 583 46 22 · +297 583 46 07 |
| Mobile / WhatsApp | +297 593 02 52 (WhatsApp link `wa.me/+2975930252`) |
| Opening hours | Monday–Friday 8 am–5 pm · Saturday 8 am–12 pm |
| Facebook | https://www.facebook.com/bersaharuba/ |
| Instagram | https://www.instagram.com/bersah_aruba/ |
| Contact form fields | Your name*, Email*, Company, Any other comments*, newsletter opt-in |
| Email address | **Not published** on the site |

### News / blog (`/news`)
| Date | Title | Key facts |
|---|---|---|
| 2024-07-12 | BerSah Aruba Officially Appointed as Beyond Meat Distributor in Aruba | Exclusive/sole distributor via Letter of Appointment; responsible for sales, trade and marketing of Beyond Meat in Aruba; maintains the frozen delivery channel; aimed at restaurants, hotels, resorts and food trucks |
| 2024-07-03 | Casa Tua Restaurant Aruba: Exceptional Dining with BerSah Quality | Casa Tua sources ingredients from BerSah |
| 2022-05-03 | New freezer opens up possibilities | New freezer facility nearly complete |
| 2022-04-21 | Goodbye toast Rajesh | Staff farewell after 19 years |
| 2021-12-15 | BerSah's construction is in full motion | Building a "new, bigger, and state-of-the-art freezer" to stock more products |
| 2021-10-13 | BerSah celebrates 4 work anniversaries | Names staff roles incl. General Manager, Head Accounting & HR, Sales, Supervisor Accounts Receivable |

Staff names from news posts are **not** used in the prototype.

### Visual identity (from the site's compiled CSS and markup)
| Token | Value | Usage on site |
|---|---|---|
| Primary | `#155381` (rgb 21 83 129) — deep blue | Footer bar, buttons, links, hero panels |
| Secondary | `#90DC69` (rgb 144 220 105) — fresh green | Hover underline, accents (matches logo circle) |
| Neutral darker | `#2E2E2E` | Body text |
| Neutral | `#4F5050` | |
| Neutral lightest | `#F1F1F1` / gray-100 sections | Alternating section backgrounds |
| Display font | **Merriweather Italic** | All headings (`font-secondary`) |
| Body font | **Roboto** 300/400/700 | Body copy (often light 300) |

Layout traits: sticky white header with drop shadow; large split hero (blue angled panel + photo); alternating white / light-gray sections; outlined white buttons on blue; "Read more →" text links in primary blue.

### Imagery available on the site
Category photos (meats, fish/tuna loin, seafood platter, raw whole chicken, cocktail, spices, vegan bowl, equipment), a lobster-tail cut-out, the BerSah building/warehouse (aerial and facade), cold-store racking, a delivery truck, team photos, Beyond Burger packshots, and partner logos. Selected images are copied into `public/brand/` for this pitch prototype only. Unsplash photos live in `public/products/` and `public/photos/`.

---

## 2. Third-party information (not used as fact)
- bestfoodimporters.com directory: lists "Bersah Aruba Nv" as importer/wholesaler/supplier, 33 Bushiri, Oranjestad-West, 11–50 employees, "more than 25 years", serving retail and institutional clients with seafood, vegan products, meats and poultry. Consistent with the official site but unverified; not used.

---

## 3. Assumptions and illustrative content in the prototype
Everything below was **invented for demonstration** and is labelled as such in the UI:

- **Products and SKUs.** Sample items are built only within the eight official categories and their sub-categories. Product names are generic, except Beyond Meat items, which are backed by the official distributorship announcement. Other carried brands appear only as the logo strip shown on BerSah's own site.
- **Prices** are illustrative, in Aruban florin (AWG, "Afl."). They are not BerSah prices.
- **Stock levels, reorder points, pack sizes and case weights** are illustrative.
- **Sustainability certifications** (ASC/BAP/MSC) are mentioned only at programme level, as on the Services page. No sample product is tagged as certified.
- **Customer accounts** (restaurants, hotels, resorts, food trucks) are fictional businesses. No real BerSah customers are depicted, and Casa Tua is not used as a sample account.
- **Orders, order numbers, delivery dates and statuses** are generated demo data.
- **Order cut-off, delivery days and minimum order value** are plausible assumptions, not BerSah policy.
- **Staff / employee users** in the admin area are fictional.
- **Product photography**: product cards use free-licence Unsplash food photography (stored under `public/products/`) plus BerSah's own category photos where they fit.

## 4. Open questions for BerSah
1. 25 or 30+ years? Founding year?
2. Real product master data: SKU codes, pack sizes, catch weights, units of sale.
3. Pricing model: price lists per customer group, contract prices, tax (BBO/BAVP) handling.
4. Delivery schedule, cut-off times, minimum order values, delivery zones.
5. Current ERP / accounting system (Odoo, SAP, QuickBooks, Sage, Exact?) and export formats.
6. Which products carry ASC / BAP / MSC certification.
7. Order notifications: email, WhatsApp, or both.
8. Customer credit terms and account approval process.
