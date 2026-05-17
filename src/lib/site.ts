export const SITE = {
  name: "VinFast Thái Bình",
  legalName: "Đại lý ủy quyền VinFast 3S — DragonGroup",
  url: "https://vinfast-thaibinh.com",
  hotline: "0962.181.262",
  hotlineE164: "+84962181262",
  email: "khanhvinfast17@gmail.com",
  address: {
    street: "Đại Lộ Kỳ Đồng, KĐT Thái Bình Dragon City",
    ward: "Phường Phú Xuân",
    city: "Thành phố Thái Bình",
    region: "Thái Bình",
    postalCode: "410000",
    country: "VN",
  },
  geo: { latitude: 20.4503, longitude: 106.3402 },
  hours: [
    { days: ["Mo", "Tu", "We", "Th", "Fr", "Sa"], open: "07:30", close: "18:30" },
    { days: ["Su"], open: "08:00", close: "17:00" },
  ],
  social: {
    facebook: "https://www.facebook.com/vinfastthaibinh",
    zalo: "https://zalo.me/0962181262",
    youtube: "https://www.youtube.com/@vinfastthaibinh",
  },
  areaServed: ["Thái Bình", "Nam Định", "Hưng Yên", "Hải Phòng", "Hải Dương"],
  salesRep: {
    name: "Mr. Khánh",
    role: "Trưởng phòng kinh doanh",
    experience: "8+ năm tư vấn xe điện",
  },
} as const;

export const PRIMARY_KEYWORD = "vinfast thái bình";
