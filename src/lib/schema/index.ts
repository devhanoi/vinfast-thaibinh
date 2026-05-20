import { SITE } from "@/lib/site";
import { CARS } from "@/content/cars";
import { FAQS } from "@/content/faq";

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: SITE.address.street,
  addressLocality: SITE.address.city,
  addressRegion: SITE.address.region,
  postalCode: SITE.address.postalCode,
  addressCountry: SITE.address.country,
};

const HOURS_SPEC = SITE.hours.map((h) => ({
  "@type": "OpeningHoursSpecification",
  dayOfWeek: h.days,
  opens: h.open,
  closes: h.close,
}));

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: `${SITE.url}/images/logo-vinfast.svg`,
    sameAs: [SITE.social.facebook, SITE.social.youtube],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE.hotlineE164,
        contactType: "sales",
        areaServed: "VN",
        availableLanguage: ["vi"],
      },
    ],
  };
}

export function buildAutoDealerSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["AutoDealer", "LocalBusiness"],
    "@id": `${SITE.url}/#dealer`,
    name: SITE.name,
    description:
      "Đại lý ủy quyền chính hãng VinFast tại Thái Bình. Bán xe điện VF 3, VF 5, VF 6, VF 7, VF 8, VF 9, dịch vụ trả góp 80%, lái thử miễn phí, bảo hành chính hãng.",
    url: SITE.url,
    image: `${SITE.url}/images/og-cover.jpg`,
    logo: `${SITE.url}/images/logo-vinfast.svg`,
    telephone: SITE.hotlineE164,
    email: SITE.email,
    address: ADDRESS,
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.latitude, longitude: SITE.geo.longitude },
    openingHoursSpecification: HOURS_SPEC,
    areaServed: SITE.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
    priceRange: "299.000.000₫ - 1.499.000.000₫",
    makesOffer: CARS.map((car) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Car", name: car.name, model: car.name, fuelType: "Electric" },
      priceCurrency: "VND",
      price: car.priceFrom,
      availability: "https://schema.org/InStock",
    })),
    sameAs: [SITE.social.facebook, SITE.social.youtube, SITE.social.zalo],
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    inLanguage: "vi-VN",
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

export function buildBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Đại lý VinFast", item: `${SITE.url}/` },
      { "@type": "ListItem", position: 3, name: "Thái Bình", item: SITE.url },
    ],
  };
}

export function buildFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function buildProductSchemas() {
  return CARS.map((car) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE.url}/#${car.id}`,
    name: car.name,
    description: `${car.segment} – Pin ${car.battery}, quãng đường ${car.rangeKm}km. Bán tại VinFast Thái Bình.`,
    image: car.image,
    brand: { "@type": "Brand", name: "VinFast" },
    offers: {
      "@type": "Offer",
      url: SITE.url,
      priceCurrency: "VND",
      price: car.priceFrom,
      availability: "https://schema.org/InStock",
      seller: { "@id": `${SITE.url}/#dealer` },
    },
  }));
}

export function buildAllSchemas() {
  return [
    buildOrganizationSchema(),
    buildAutoDealerSchema(),
    buildWebSiteSchema(),
    buildBreadcrumbSchema(),
    buildFaqSchema(),
    ...buildProductSchemas(),
  ];
}
