import { CARS, SERVICE_CARS, BIKES } from "@/content/cars";
import { FAQS } from "@/content/faq";
import { CHARGING_STATIONS, TOTAL_STATIONS } from "@/content/charging-stations";
import { SITE } from "@/lib/site";
import type { CmsProduct, HomePageData } from "./types";

function fallbackProduct(
  item: {
    id: string;
    slug?: string;
    name: string;
    segment?: string;
    tagline?: string;
    priceFrom: number;
    battery?: string;
    rangeKm?: number;
    range?: string;
    highlights?: string[];
    image?: string;
  },
  category: CmsProduct["category"],
  sortOrder: number,
): CmsProduct {
  const image = item.image ?? "/images/cars/vf3/vf3-xanh-duong-goc-truoc.jpg";
  return {
    id: item.id,
    slug: item.slug ?? item.id,
    name: item.name,
    category,
    segment: item.segment ?? null,
    tagline: item.tagline ?? null,
    description: null,
    priceFrom: item.priceFrom,
    battery: item.battery ?? null,
    rangeKm: item.rangeKm ?? null,
    rangeText: item.range ?? null,
    specs: {},
    highlights: item.highlights ?? [],
    status: "active",
    sortOrder,
    image,
    imageAlt: `${item.name} tại VinFast Thái Bình`,
    images: [
      {
        id: `${item.id}-primary`,
        url: image,
        key: image,
        alt: `${item.name} tại VinFast Thái Bình`,
        color: null,
        angle: null,
        isPrimary: true,
        sortOrder: 1,
      },
    ],
  };
}

export function getFallbackHomePageData(): HomePageData {
  const cars = CARS.map((car, index) => fallbackProduct(car, "car", index + 1));
  const serviceCars = SERVICE_CARS.map((car, index) => fallbackProduct(car, "service_car", index + 1));
  const bikes = BIKES.map((bike, index) => fallbackProduct(bike, "bike", index + 1));

  return {
    site: SITE,
    seo: {
      pageKey: "home",
      title: `${SITE.name} | Đại lý ủy quyền chính hãng - ${SITE.hotline}`,
      description: `Đại lý ủy quyền VinFast Thái Bình chính hãng tại Đại Lộ Kỳ Đồng - báo giá VF3, VF5, VF6, VF7, VF8, VF9, trả góp 80%, lái thử miễn phí.`,
      ogImageUrl: "/images/og-cover.jpg",
      canonicalPath: "/",
    },
    heroSlides: [
      {
        id: "fallback-hero",
        title: "Đại lý VinFast Thái Bình",
        subtitle: "Showroom chính hãng, báo giá xe điện VinFast mới nhất, hỗ trợ trả góp và lái thử tận nhà.",
        imageUrl: "/images/slide/teasing-desktop_new.png",
        imageAlt: "VinFast Thái Bình – các dòng xe điện",
        ctaLabel: "Nhận báo giá ngay",
        ctaHref: "#bao-gia",
        isActive: true,
        sortOrder: 1,
      },
    ],
    products: [...cars, ...serviceCars, ...bikes],
    cars,
    serviceCars,
    bikes,
    faqs: FAQS.map((faq, index) => ({
      id: `fallback-faq-${index}`,
      question: faq.q,
      answer: faq.a,
      isActive: true,
      sortOrder: index + 1,
    })),
    testimonials: [
      {
        id: "fallback-review-1",
        name: "Anh Phạm Tuấn",
        location: "TP. Thái Bình",
        vehicle: "VinFast VF 5 Plus",
        rating: 5,
        content:
          "Mr. Khánh tư vấn rất kỹ về tổng chi phí lăn bánh và hỗ trợ trả góp qua VPBank chỉ trong 2 ngày là nhận xe. Showroom rộng rãi, đội kỹ thuật nhiệt tình.",
        isActive: true,
        sortOrder: 1,
      },
      {
        id: "fallback-review-2",
        name: "Chị Trần Hồng",
        location: "Huyện Đông Hưng",
        vehicle: "VinFast VF 6",
        rating: 5,
        content:
          "Đặt lái thử tận nhà ở Đông Hưng, đội bán hàng đến đúng hẹn. Sau khi mua VF 6 mình thấy chi phí đi lại giảm hẳn so với xe xăng cũ.",
        isActive: true,
        sortOrder: 2,
      },
      {
        id: "fallback-review-3",
        name: "Anh Nguyễn Hùng",
        location: "Huyện Vũ Thư",
        vehicle: "VinFast VF 8 Eco",
        rating: 5,
        content:
          "Đại lý đầy đủ dịch vụ, mình bảo dưỡng định kỳ luôn tại đây. Phụ tùng có sẵn, kỹ thuật viên giải thích rõ ràng từng hạng mục.",
        isActive: true,
        sortOrder: 3,
      },
    ],
    chargingStations: CHARGING_STATIONS.map((district, districtIndex) => ({
      district: district.district,
      stations: district.stations.map((station, stationIndex) => ({
        id: `fallback-station-${districtIndex}-${stationIndex}`,
        ...station,
        district: district.district,
        mapUrl: null,
        isActive: true,
        sortOrder: stationIndex + 1,
      })),
    })),
    totalStations: TOTAL_STATIONS,
  };
}
