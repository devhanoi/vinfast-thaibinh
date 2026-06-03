import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { CARS, SERVICE_CARS, BIKES } from "../src/content/cars";
import { FAQS } from "../src/content/faq";
import { CHARGING_STATIONS } from "../src/content/charging-stations";
import { SITE } from "../src/lib/site";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("[seed] DATABASE_URL chưa set. Cập nhật .env.local với connection string Neon thật.");
  process.exit(1);
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

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
  const { PRODUCT_DESCRIPTIONS } = await import("./seed-descriptions");
  for (const [index, car] of CARS.entries()) {
    const description = PRODUCT_DESCRIPTIONS[car.slug] ?? null;
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
        description,
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
        description,
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
    const description = PRODUCT_DESCRIPTIONS[item.id] ?? null;
    await prisma.product.upsert({
      where: { slug: item.id },
      update: {
        name: item.name,
        category: "service_car",
        tagline: item.tagline,
        priceFrom: item.priceFrom,
        description,
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
        description,
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
  console.log("[seed] bắt đầu seed Neon DB…");
  await prisma.storeSetting.upsert({
    where: { key: "site" },
    update: { valueJson: SITE },
    create: { key: "site", valueJson: SITE },
  });
  console.log("[seed] StoreSetting ✓");

  await prisma.seoSetting.upsert({
    where: { pageKey: "home" },
    update: {},
    create: {
      pageKey: "home",
      title: `${SITE.name} | Đại lý ủy quyền chính hãng - ${SITE.hotline}`,
      description: `Đại lý ủy quyền VinFast Thái Bình tại Đại Lộ Kỳ Đồng - báo giá VF3, VF5, VF6, VF7, VF8, VF9, trả góp 80%, lái thử miễn phí.`,
      ogImageUrl: "/images/og-cover.jpg",
      canonicalPath: "/",
    },
  });

  const HERO_SLIDES = [
    { file: "teasing-desktop_new.png", title: "VinFast – Tương lai đã có mặt", subtitle: "Xe điện thế hệ mới đã có tại Thái Bình", alt: "VinFast ra mắt dòng xe điện thế hệ mới" },
    { file: "vinfast-vf3-sanh-dieu-sang-tao-desktop.png", title: "VinFast VF3 – Sành điệu, sáng tạo", subtitle: "Mini SUV đô thị cho giới trẻ", alt: "VinFast VF3 sành điệu, sáng tạo cho giới trẻ" },
    { file: "vf_8_the_he_moi_deskotp_new.jpg", title: "VinFast VF8 thế hệ mới", subtitle: "SUV điện cao cấp – sẵn sàng giao xe", alt: "VinFast VF8 thế hệ mới – SUV điện cao cấp" },
    { file: "vinfast-vf-mpv7-ban-dong-hanh-dai-gia-dinh-desktop.jpg", title: "VinFast MPV7", subtitle: "Đồng hành cùng đại gia đình", alt: "VinFast MPV7 đồng hành cùng đại gia đình" },
    { file: "vinfast-giai-phap-di-chuyen-xanh-ben-vung-desktop.jpg", title: "Di chuyển xanh bền vững", subtitle: "Giải pháp đi lại không khí thải", alt: "VinFast – giải pháp di chuyển xanh bền vững" },
    { file: "vinfast-len-doi-xe-xanh-toi-uu-chi-phi-desktop.jpg", title: "Lên đời xe xanh", subtitle: "Tối ưu chi phí vận hành, trade-in tới 30 triệu", alt: "Lên đời xe xanh VinFast – tối ưu chi phí vận hành" },
    { file: "vinfast-dau-tu-0-dong-sinh-loi-tren-tung-km-desktop.jpg", title: "Đầu tư 0 đồng", subtitle: "Sinh lời trên từng kilomet cùng VinFast", alt: "Đầu tư 0 đồng, sinh lời trên từng km cùng VinFast" },
  ];

  for (const [index, slide] of HERO_SLIDES.entries()) {
    const id = `hero-${index + 1}`;
    await prisma.heroSlide.upsert({
      where: { id },
      update: {
        title: slide.title,
        subtitle: slide.subtitle,
        imageUrl: `/images/slide/${slide.file}`,
        imageAlt: slide.alt,
        sortOrder: index + 1,
      },
      create: {
        id,
        title: slide.title,
        subtitle: slide.subtitle,
        imageUrl: `/images/slide/${slide.file}`,
        imageAlt: slide.alt,
        ctaLabel: "Nhận báo giá ngay",
        ctaHref: "#bao-gia",
        sortOrder: index + 1,
      },
    });
  }

  console.log("[seed] SEO ✓ · Hero slides ✓");

  await seedProducts();
  console.log("[seed] Products + Images ✓");

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

  console.log("[seed] FAQs + Testimonials + Charging stations ✓");

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    await prisma.adminUser.upsert({
      where: { email: process.env.ADMIN_EMAIL },
      update: { isActive: true },
      create: {
        email: process.env.ADMIN_EMAIL,
        passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
      },
    });
    console.log(`[seed] AdminUser ${process.env.ADMIN_EMAIL} ✓`);
  } else {
    console.warn("[seed] ⚠ ADMIN_EMAIL + ADMIN_PASSWORD chưa set → không tạo admin user");
  }

  console.log("[seed] ✅ DONE");
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
