export const SEED_PRODUCTS = [
  {
    id: "p_cap_white",
    slug: "casquette-white-cloud",
    name: "Casquette White Cloud",
    category: "caps",
    price: 39,
    description: "Casquette blanche premium. Minimal, propre.",
    images: ["https://via.placeholder.com/1200x800?text=UP+White+Cap"],
    stockQty: 25,
    active: true,
    featured: true,
  },
  {
    id: "p_cap_storm",
    slug: "casquette-storm-grey",
    name: "Casquette Storm Grey",
    category: "caps",
    price: 39,
    description: "Variante grise. Même coupe, même qualité.",
    images: ["https://via.placeholder.com/1200x800?text=UP+Storm+Cap"],
    stockQty: 12,
    active: true,
    featured: false,
  },
  {
    id: "p_hoodie_cloud",
    slug: "hoodie-cloud",
    name: "Hoodie Cloud",
    category: "vetements",
    price: 79,
    description: "Hoodie nuage. Série limitée.",
    images: ["https://via.placeholder.com/1200x800?text=UP+Hoodie"],
    stockQty: 0,
    active: true,
    featured: false,
  },
];

export const SEED_PROMOS = [
  { id: "promo_UP10", code: "UP10", type: "PERCENT", value: 10, active: true },
  { id: "promo_WELCOME5", code: "WELCOME5", type: "AMOUNT", value: 5, active: true },
];
