import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { CARS, SERVICE_CARS, BIKES } from "../src/content/cars";
import { FAQS } from "../src/content/faq";
import { CHARGING_STATIONS } from "../src/content/charging-stations";
import { SITE } from "../src/lib/site";

const prisma = new PrismaClient();

const TESTIMONIALS = [
  {
    name: "Anh Phạm Tuấn",
    location: "TP. Thái Bình",
    vehicle: "VinFast VF 5 Plus",
    content:
      "Mr. Khánh tư vấn rất kỹ về tổng chi phí lăn bánh và hỗ trợ trả góp qua VPBank chỉ trong 2 ngày là nhận xe. Showroom rộng rãi, đội kỹ thuật nhiệt tình.",
  },
  {
    name: "Chị Trần Hồng",
    location: "Huyện Đông Hưng",
    vehicle: "VinFast VF 6",
    content:
      "Đặt lái thử tận nhà ở Đông Hưng, đội bán hàng đến đúng hẹn. Sau khi mua VF 6 mình thấy chi phí đi lại giảm hẳn so với xe xăng cũ.",
  },
  {
    name: "Anh Nguyễn Hùng",
    location: "Huyện Vũ Thư",
    vehicle: "VinFast VF 8 Eco",
    content:
      "Đại lý 3S đầy đủ dịch vụ, mình bảo dưỡng định kỳ luôn tại đây. Phụ tùng có sẵn, kỹ thuật viên giải thích rõ ràng từng hạng mục.",
  },
];

function productFolder(slug: string) {
  return slug.replace("-", "");
}

function titleFromFile(file: string) {
  return file
    .replace(/\.(jpg|jpeg|png|webp)$/i, "")
    .replace(/-/g, " ")
    .replace(/\bvf(\d)\b/i, "VF $1");
}

async function seedProducts() {
  for (const [index, car] of CARS.entries()) {
    const product = await prisma.product.upsert({
      where: { slug: car.slug },
      update: {
        name: car.name,
        category: "car",
        segment: car.segment,
        priceFrom: car.priceFrom,
        battery: car.battery,
        rangeKm: car.rangeKm,
        highlightsJson: car.highlights,
        status: "active",
        sortOrder: index + 1,
      },
      create: {
        slug: car.slug,
        name: car.name,
        category: "car",
        segment: car.segment,
        priceFrom: car.priceFrom,
        battery: car.battery,
        rangeKm: car.rangeKm,
        highlightsJson: car.highlights,
        status: "active",
        sortOrder: index + 1,
      },
    });

    const dir = join(process.cwd(), "public/images/cars", productFolder(car.slug));
    const files = readdirSync(dir).filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file)).sort();
    for (const [imageIndex, file] of files.entries()) {
      const url = `/images/cars/${productFolder(car.slug)}/${file}`;
      await prisma.productImage.upsert({
        where: { id: `${product.id}-${imageIndex}` },
        update: {},
        create: {
          id: `${product.id}-${imageIndex}`,
          productId: product.id,
          url,
          key: url,
          alt: `${car.name} ${titleFromFile(file)} tại VinFast Thái Bình`,
          color: file.split("-")[1] ?? null,
          angle: file.includes("goc-truoc") ? "Góc trước" : file.includes("goc-ngang") ? "Góc ngang" : "Góc nghiêng",
          isPrimary: url === car.image || imageIndex === 0,
          sortOrder: imageIndex + 1,
        },
      });
    }
  }

  for (const [index, item] of SERVICE_CARS.entries()) {
    await prisma.product.upsert({
      where: { slug: item.id },
      update: {
        name: item.name,
        category: "service_car",
        tagline: item.tagline,
        priceFrom: item.priceFrom,
        status: "active",
        sortOrder: index + 1,
      },
      create: {
        slug: item.id,
        name: item.name,
        category: "service_car",
        tagline: item.tagline,
        priceFrom: item.priceFrom,
        highlightsJson: [],
        status: "active",
        sortOrder: index + 1,
        images: {
          create: {
            url: item.image,
            key: item.image,
            alt: `${item.name} tại VinFast Thái Bình`,
            isPrimary: true,
          },
        },
      },
    });
  }

  for (const [index, bike] of BIKES.entries()) {
    await prisma.product.upsert({
      where: { slug: bike.id },
      update: {
        name: bike.name,
        category: "bike",
        rangeText: bike.range,
        priceFrom: bike.priceFrom,
        status: "active",
        sortOrder: index + 1,
      },
      create: {
        slug: bike.id,
        name: bike.name,
        category: "bike",
        rangeText: bike.range,
        priceFrom: bike.priceFrom,
        highlightsJson: [],
        status: "active",
        sortOrder: index + 1,
      },
    });
  }
}

async function main() {
  await prisma.storeSetting.upsert({
    where: { key: "site" },
    update: { valueJson: SITE },
    create: { key: "site", valueJson: SITE },
  });

  await prisma.seoSetting.upsert({
    where: { pageKey: "home" },
    update: {},
    create: {
      pageKey: "home",
      title: `${SITE.name} | Đại lý 3S chính hãng - ${SITE.hotline}`,
      description: `Đại lý VinFast Thái Bình 3S chính hãng tại Đại Lộ Kỳ Đồng - báo giá VF3, VF5, VF6, VF7, VF8, VF9, trả góp 80%, lái thử miễn phí.`,
      ogImageUrl: "/images/og-cover.jpg",
      canonicalPath: "/",
    },
  });

  await prisma.heroSlide.upsert({
    where: { id: "home-hero-main" },
    update: {},
    create: {
      id: "home-hero-main",
      title: "Đại lý VinFast Thái Bình",
      subtitle: "Showroom 3S chính hãng, báo giá xe điện VinFast mới nhất, hỗ trợ trả góp và lái thử tận nhà.",
      imageUrl: "/images/cars/vf3/vf3-xanh-duong-goc-truoc.jpg",
      imageAlt: "VinFast VF 3 tại VinFast Thái Bình",
      ctaLabel: "Nhận báo giá ngay",
      ctaHref: "#bao-gia",
      sortOrder: 1,
    },
  });

  await seedProducts();

  for (const [index, faq] of FAQS.entries()) {
    await prisma.faq.upsert({
      where: { id: `faq-${index + 1}` },
      update: { question: faq.q, answer: faq.a, sortOrder: index + 1 },
      create: { id: `faq-${index + 1}`, question: faq.q, answer: faq.a, sortOrder: index + 1 },
    });
  }

  for (const [index, item] of TESTIMONIALS.entries()) {
    await prisma.testimonial.upsert({
      where: { id: `review-${index + 1}` },
      update: item,
      create: { id: `review-${index + 1}`, ...item, sortOrder: index + 1 },
    });
  }

  let stationIndex = 1;
  for (const district of CHARGING_STATIONS) {
    for (const station of district.stations) {
      await prisma.chargingStation.upsert({
        where: { id: `station-${stationIndex}` },
        update: { ...station, district: district.district, sortOrder: stationIndex },
        create: { id: `station-${stationIndex}`, ...station, district: district.district, sortOrder: stationIndex },
      });
      stationIndex += 1;
    }
  }

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    await prisma.adminUser.upsert({
      where: { email: process.env.ADMIN_EMAIL },
      update: { isActive: true },
      create: {
        email: process.env.ADMIN_EMAIL,
        passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
