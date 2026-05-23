export type Car = {
  id: string;
  slug: string;
  name: string;
  segment: string;
  priceFrom: number;
  battery: string;
  rangeKm: number;
  highlights: string[];
  image: string;
};

// Ảnh xe lấy từ trang đại lý VinFast Thái Bình. Trước khi launch production nên thay bằng
// ảnh do hãng cấp (press kit) hoặc tự chụp tại showroom để đảm bảo bản quyền.
// Script tải: `node tooling/scripts/fetch-car-images.mjs`
export const CARS: Car[] = [
  {
    id: "vf3",
    slug: "vf-3",
    name: "VinFast VF 3",
    segment: "Mini SUV đô thị",
    priceFrom: 299_000_000,
    battery: "18.64 kWh",
    rangeKm: 210,
    highlights: ["4 chỗ ngồi rộng rãi", "Sạc nhanh 36 phút", "Bảo hành 7 năm"],
    image: "/images/cars/vf3/vf3-xanh-duong-goc-truoc.jpg",
  },
  {
    id: "vf5",
    slug: "vf-5",
    name: "VinFast VF 5 Plus",
    segment: "A-SUV gia đình",
    priceFrom: 529_000_000,
    battery: "37.23 kWh",
    rangeKm: 326,
    highlights: ["5 chỗ rộng nhất phân khúc", "ADAS cơ bản", "Phanh đĩa 4 bánh"],
    image: "/images/cars/vf5/vf5-trang-goc-nghieng.jpg",
  },
  {
    id: "vf6",
    slug: "vf-6",
    name: "VinFast VF 6",
    segment: "B-SUV năng động",
    priceFrom: 675_000_000,
    battery: "59.6 kWh",
    rangeKm: 460,
    highlights: ["Mô-men xoắn 250 Nm", "Màn hình 12.9 inch", "ADAS Level 2"],
    image: "/images/cars/vf6/vf6-xanh-reu-goc-truoc.jpg",
  },
  {
    id: "vf7",
    slug: "vf-7",
    name: "VinFast VF 7",
    segment: "C-SUV cao cấp",
    priceFrom: 850_000_000,
    battery: "75.3 kWh",
    rangeKm: 510,
    highlights: ["Thiết kế GT thể thao", "AWD tùy chọn", "Cabin yên tĩnh"],
    image: "/images/cars/vf7/vf7-xanh-reu-goc-ngang.jpg",
  },
  {
    id: "vf8",
    slug: "vf-8",
    name: "VinFast VF 8 Eco",
    segment: "D-SUV 5 chỗ",
    priceFrom: 1_057_000_000,
    battery: "82 kWh",
    rangeKm: 471,
    highlights: ["AWD 300 kW", "Ghế da Nappa", "Smart Services"],
    image: "/images/cars/vf8/vf8-do-goc-ngang.jpg",
  },
  {
    id: "vf9",
    slug: "vf-9",
    name: "VinFast VF 9 Eco",
    segment: "E-SUV 7 chỗ",
    priceFrom: 1_443_000_000,
    battery: "92 kWh",
    rangeKm: 438,
    highlights: ["7 chỗ 3 hàng ghế", "Khoang cabin sang trọng", "AWD 300 kW"],
    image: "/images/cars/vf9/vf9-trang-goc-nghieng.jpg",
  },
];

export type ServiceCar = { id: string; name: string; priceFrom: number; tagline: string; image: string };

// Service Green chưa tải được ảnh riêng — tạm tái sử dụng ảnh dòng xe cùng phân khúc.
// TODO: bổ sung ảnh Minio Green, Herio Green, Limo Green vào /images/service/.
export const SERVICE_CARS: ServiceCar[] = [
  {
    id: "minio-green",
    name: "Minio Green",
    priceFrom: 269_000_000,
    tagline: "Xe điện 4 chỗ phục vụ taxi đô thị",
    image: "/images/cars/vf3/vf3-xanh-duong-goc-truoc.jpg",
  },
  {
    id: "herio-green",
    name: "Herio Green",
    priceFrom: 499_000_000,
    tagline: "Xe điện 5 chỗ tối ưu chi phí vận hành",
    image: "/images/cars/vf5/vf5-trang-goc-nghieng.jpg",
  },
  {
    id: "limo-green",
    name: "Limo Green",
    priceFrom: 749_000_000,
    tagline: "MPV 7 chỗ chuyên dịch vụ Xanh SM",
    image: "/images/cars/vf9/vf9-trang-goc-nghieng.jpg",
  },
];

export type Bike = { id: string; name: string; priceFrom: number; range: string };

export const BIKES: Bike[] = [
  { id: "evo200-lite", name: "Evo200 Lite", priceFrom: 15_000_000, range: "Quãng đường 120km" },
  { id: "vento-s", name: "Vento S", priceFrom: 50_000_000, range: "Quãng đường 120km" },
  { id: "theon-s", name: "Theon S", priceFrom: 63_000_000, range: "Quãng đường 150km" },
  { id: "klara-s2", name: "Klara S2", priceFrom: 31_000_000, range: "Quãng đường 120km" },
];
