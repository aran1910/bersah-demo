import type { TenantConfig } from "@/types/tenant"

/**
 * BerSah Aruba N.V. tenant.
 *
 * Company copy, categories, services, contact details and colours come from
 * https://www.bersaharuba.com (see docs/bersah-research.md). Commercial rules
 * (minimum order, delivery fee, cut-off) are prototype assumptions.
 */
export const bersahConfig: TenantConfig = {
  id: "bersah",
  domains: ["order.bersaharuba.com", "bersah.localhost"],
  name: "BerSah Aruba N.V.",
  shortName: "BerSah",
  legalName: "Bersah Aruba N.V.",
  tagline: "Your trusted wholesale food supplier in Aruba",
  description:
    "From premium seafood to gourmet meats and vegan options, BerSah Aruba N.V. supplies restaurants, hotels, resorts and food trucks across Aruba.",
  websiteUrl: "https://www.bersaharuba.com",

  branding: {
    primary: "#155381",
    primaryDark: "#0C3354",
    accent: "#90DC69",
    accentForeground: "#0C3354",
    logo: { src: "/brand/bersah-logo.png", width: 174, height: 140, alt: "BerSah Aruba N.V." },
    icon: "/brand/apple-touch-icon.png",
  },

  contact: {
    addressLines: ["Bushiri #33"],
    city: "Oranjestad",
    country: "Aruba",
    phones: [
      { label: "Office", value: "+297 583 46 22", href: "tel:+2975834622" },
      { label: "Office", value: "+297 583 46 07", href: "tel:+2975834607" },
      { label: "Mobile", value: "+297 593 02 52", href: "tel:+2975930252" },
    ],
    whatsapp: { label: "+297 593 02 52", href: "https://wa.me/+2975930252" },
    openingHours: [
      { days: "Monday – Friday", hours: "8:00 am – 5:00 pm" },
      { days: "Saturday", hours: "8:00 am – 12:00 pm" },
      { days: "Sunday", hours: "Closed" },
    ],
    social: [
      { network: "facebook", href: "https://www.facebook.com/bersaharuba/", handle: "bersaharuba" },
      { network: "instagram", href: "https://www.instagram.com/bersah_aruba/", handle: "@bersah_aruba" },
    ],
    mapQuery: "Bushiri 33, Oranjestad, Aruba",
  },

  copy: {
    heroEyebrow: "Wholesale food supplier · Aruba",
    heroTitle: "Your trusted wholesaler in Aruba of quality seafood and meats",
    heroSubtitle:
      "Premium seafood sourced globally, top-grade meats, sushi ingredients, vegan options, wines and more — supplied to restaurants, hotels, resorts and food trucks across the island.",
    introTitle: "Supplying Aruba's finest to restaurants, hotels, and resorts",
    introBody: [
      "With over 30 years of dedicated service in Aruba's food industry, Bersah Aruba N.V. has established itself as a trusted partner for wholesale food products.",
      "From our beginnings as seafood specialists to our current status as a comprehensive food solutions provider, we emphasize innovation and service excellence in every facet of our business.",
    ],
    productsIntro:
      "Discover Aruba's finest: premium, high-quality and fresh products. From premium seafood sourced globally to top-grade meats, including a selection of sushi and vegan options.",
    aboutTitle: "The heartbeat of Aruba's culinary landscape",
    aboutBody: [
      {
        text: "At Bersah Aruba N.V., we're not just a wholesaler of food products. We've evolved from humble beginnings as seafood specialists to becoming the go-to partner for a wide range of premium food solutions.",
      },
      {
        heading: "Our commitment",
        text: "Quality is at the heart of everything we do. We've cultivated strong relationships with suppliers worldwide to ensure that only the finest ingredients find their way onto our shelves — from the juiciest cuts of meat from North America to the freshest sushi ingredients from top sushi purveyors.",
      },
      {
        heading: "Innovation and variety",
        text: "In a dynamic culinary landscape, innovation is key. We are constantly expanding our product offering to cater to the ever-evolving tastes and preferences of our customers — from traditional favourites to unique and exotic finds.",
      },
      {
        heading: "Service excellence",
        text: "Customer satisfaction is our top priority. We pride ourselves on a service-minded approach, ensuring every interaction with us is seamless — whether you're a restaurateur looking to elevate your menu or a hotel planning its next season.",
      },
    ],
    servicesIntro:
      "In addition to the food and beverages we import, we offer a full service — from ordering assistance to storage in our state-of-the-art facilities. In our production facilities we can portion control to your required specifications.",
    ctaTitle: "Connect with us",
    ctaBody:
      "Need assistance, a quote, or ready to place an order? Whether you have questions or feedback, we've got you covered.",
    stats: [
      { value: "30+", label: "Years in Aruba's food industry" },
      { value: "8", label: "Product categories" },
      { value: "Cooled & frozen", label: "Storage facilities on Bushiri" },
      { value: "ASC · BAP · MSC", label: "Certified sustainable sourcing" },
    ],
    highlight: {
      eyebrow: "Exclusive distributor",
      title: "Beyond Meat®, officially distributed in Aruba by BerSah",
      body: "BerSah Aruba has been appointed the exclusive distributor of Beyond Meat products in Aruba — responsible for sales, trade and marketing, and for keeping the frozen delivery channel intact from our freezers to your kitchen.",
      image: "/brand/beyond-burger.jpg",
      sourceUrl:
        "https://www.bersaharuba.com/news/casa-tua-restaurant-aruba-exceptional-dining-bersah-quality-copy",
    },
  },

  markets: [
    {
      id: "restaurants",
      name: "Restaurants",
      description: "Consistent cuts, portion-controlled fish and dependable deliveries for busy kitchens.",
      image: "/photos/restaurant.jpg",
    },
    {
      id: "resorts",
      name: "Resorts",
      description: "Volume supply, private-label options and storage capacity for multi-outlet operations.",
      image: "/photos/resort.jpg",
    },
    {
      id: "hotels",
      name: "Hotels",
      description: "Banqueting, breakfast and à la carte — one supplier for proteins, wines and dry goods.",
      image: "/photos/hotel.jpg",
    },
    {
      id: "food-trucks",
      name: "Food Trucks",
      description: "Burgers, wings, sausages and plant-based options in pack sizes that fit a mobile kitchen.",
      image: "/photos/street-food.jpg",
    },
  ],

  categories: [
    {
      id: "meats",
      slug: "meats",
      name: "Meats",
      description: "Top-grade beef, pork and veal — on the bone, boneless and sausages.",
      image: "/brand/cat-meats.jpg",
      subcategories: [
        { id: "meats-bone-in", name: "Meats with bone" },
        { id: "meats-boneless", name: "Boneless" },
        { id: "meats-sausages", name: "Sausages" },
      ],
    },
    {
      id: "fish",
      slug: "fish",
      name: "Fish",
      description: "Fillets, fresh whole fish and portion-controlled cuts.",
      image: "/brand/cat-fish.jpg",
      subcategories: [
        { id: "fish-filet", name: "Filet" },
        { id: "fish-fresh", name: "Fresh" },
        { id: "fish-portion", name: "Portion Controlled" },
      ],
    },
    {
      id: "seafood",
      slug: "seafood",
      name: "Seafood",
      description: "Lobster, crustaceans and octopus — where BerSah started.",
      image: "/brand/cat-seafood.jpg",
      subcategories: [
        { id: "seafood-lobster", name: "Lobster" },
        { id: "seafood-crustaceans", name: "Crustaceans" },
        { id: "seafood-octopus", name: "Octopus" },
      ],
    },
    {
      id: "poultry",
      slug: "poultry",
      name: "Poultry",
      description: "Whole birds and chicken wings for kitchens of every size.",
      image: "/brand/cat-poultry.jpg",
      subcategories: [
        { id: "poultry-whole", name: "Whole chicken" },
        { id: "poultry-wings", name: "Chicken wings" },
      ],
    },
    {
      id: "beverages",
      slug: "beverages",
      name: "Beverages",
      description: "Wines, cocktail mixes and liqueurs for bars and dining rooms.",
      image: "/brand/cat-beverages.jpg",
      subcategories: [
        { id: "beverages-wine", name: "Wine" },
        { id: "beverages-cocktail", name: "Cocktail mix" },
        { id: "beverages-liqueur", name: "Liqueur" },
      ],
    },
    {
      id: "dry-goods",
      slug: "dry-goods",
      name: "Dry Goods",
      description: "Seasonings and pantry staples for professional kitchens.",
      image: "/brand/cat-dry-goods.jpg",
      subcategories: [
        { id: "dry-seasonings", name: "Seasonings" },
        { id: "dry-other", name: "Other" },
      ],
    },
    {
      id: "vegan",
      slug: "vegan",
      name: "Vegan",
      description: "Beyond Meat® and other plant-based alternatives.",
      image: "/brand/cat-vegan.jpg",
      subcategories: [
        { id: "vegan-beyond", name: "Beyond Meat" },
        { id: "vegan-alternatives", name: "Vegan alternatives" },
      ],
    },
    {
      id: "equipment",
      slug: "equipment",
      name: "Equipment",
      description: "Bar and kitchen equipment for food-service professionals.",
      image: "/brand/cat-equipment.jpg",
      subcategories: [{ id: "equipment-general", name: "Equipment" }],
    },
  ],

  services: [
    {
      id: "ordering",
      title: "Ordering process",
      summary: "Aruba's import partner for quality meat, fresh seafood and fish.",
      body: "With over 30 years of experience, BerSah has built a wide network across the globe. We are Aruba's premier import partner, especially for quality meat and fresh seafood and fish, with a diverse selection of vegan foods, wines and spirits — and a seamless ordering process.",
      image: "/brand/wine-service.jpg",
      icon: "clipboard",
    },
    {
      id: "private-label",
      title: "Private-label distribution",
      summary: "Put your hotel or restaurant's brand on wine and food.",
      body: "BerSah provides private-labelling services for hotels and restaurants. Put your brand on a wide range of products, including wine and food. We handle the entire process, from ordering and importing to storage in our cooled and frozen facilities.",
      image: "/brand/delivery.jpg",
      icon: "tag",
    },
    {
      id: "storage",
      title: "Full service storage rental",
      summary: "Cooled and frozen storage space for restaurants and hotels.",
      body: "BerSah is one of the few distributors in Aruba offering top-tier storage facilities for restaurants and hotels. Whether you import directly through us or place your own orders, we provide the (cooled) storage space you need.",
      image: "/brand/cold-storage.jpg",
      icon: "warehouse",
    },
    {
      id: "portioning",
      title: "Portion control",
      summary: "Cut to your specifications in our production facilities.",
      body: "In our production facilities we can portion control to your required specifications, so every plate leaves your kitchen consistent.",
      image: "/brand/cat-fish.jpg",
      icon: "scissors",
    },
    {
      id: "sustainable",
      title: "Certified sustainable products",
      summary: "Access to a wide scope of ASC, BAP and MSC certified products.",
      body: "BerSah is your premium sourcing partner, with access to a wide scope of certified sustainable products. Interested in ordering more sustainable products for your hotel or restaurant? Contact us to discuss the possibilities.",
      image: "/brand/seafood-spread.jpg",
      icon: "leaf",
    },
  ],

  certifications: [
    {
      code: "ASC",
      name: "Aquaculture Stewardship Council",
      description:
        "Global, independent non-profit running the world's leading certification and labelling programme for responsibly farmed seafood.",
    },
    {
      code: "BAP",
      name: "Best Aquaculture Practices",
      description:
        "Comprehensive third-party certification for aquaculture since 2002, covering environmental, social and economic performance.",
    },
    {
      code: "MSC",
      name: "Marine Stewardship Council",
      description:
        "Certifies wild-caught fish and seafood from sustainable fisheries, with a chain-of-custody standard from ocean to plate.",
    },
  ],

  partnerBrands: [
    { name: "Beyond Meat", logo: "/brand/partners/beyond-meat.png" },
    { name: "Tropics Mixology", logo: "/brand/partners/tropics-mixology.png" },
    { name: "Peter's Farm", logo: "/brand/partners/peters-farm.png" },
    { name: "Bush Brothers Provision Co.", logo: "/brand/partners/bush-brothers.png" },
    { name: "Sysco", logo: "/brand/partners/sysco.png" },
    { name: "Agristo", logo: "/brand/partners/agristo.png" },
  ],

  news: [
    {
      slug: "beyond-meat-distributor",
      date: "2024-07-12",
      title: "BerSah Aruba officially appointed as Beyond Meat distributor in Aruba",
      summary:
        "BerSah Aruba has been appointed the exclusive distributor of Beyond Meat products in Aruba, formalised through a Letter of Appointment.",
      sourceUrl:
        "https://www.bersaharuba.com/news/casa-tua-restaurant-aruba-exceptional-dining-bersah-quality-copy",
    },
    {
      slug: "casa-tua",
      date: "2024-07-03",
      title: "Casa Tua Restaurant Aruba: exceptional dining with BerSah quality",
      summary: "Casa Tua crafts its dishes with quality ingredients sourced from BerSah.",
      sourceUrl:
        "https://www.bersaharuba.com/news/casa-tua-restaurant-aruba-exceptional-dining-bersah-quality",
    },
    {
      slug: "new-freezer",
      date: "2022-05-03",
      title: "New freezer opens up possibilities",
      summary:
        "The new freezer combines service with state-of-the-art technology to take customer relationships to a new level.",
      sourceUrl: "https://www.bersaharuba.com/news/new-freezer-opens-possibilities",
    },
    {
      slug: "construction",
      date: "2021-12-15",
      title: "BerSah's construction is in full motion",
      summary:
        "A new, bigger, state-of-the-art freezer lets BerSah keep more products in stock and broaden its assortment.",
      sourceUrl: "https://www.bersaharuba.com/news/bersah-construction-full-motion",
    },
  ],

  commerce: {
    currency: "AWG",
    currencySymbol: "Afl.",
    locale: "en-US",
    minimumOrderValue: 250,
    deliveryFee: 35,
    freeDeliveryThreshold: 750,
    orderCutoff: "14:00",
    deliveryDays: [1, 2, 3, 4, 5, 6],
    deliveryWindows: [
      { id: "early", label: "06:00 – 09:00" },
      { id: "morning", label: "09:00 – 12:00" },
      { id: "afternoon", label: "12:00 – 16:00" },
    ],
    priceDisclaimer: "Illustrative demo prices — not actual BerSah pricing.",
  },

  integrations: {
    planned: ["odoo", "sap-business-one", "quickbooks", "sage", "csv-excel"],
    active: null,
  },

  demo: {
    enabled: true,
    disclaimer:
      "Independent demonstration concept. Not an official BerSah Aruba N.V. website. Products, prices, stock and accounts are illustrative.",
    imageCredit:
      "Company photography from bersaharuba.com. Additional food photography via Unsplash.",
  },
}
