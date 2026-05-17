export type ChargingStation = { name: string; address: string };
export type ChargingDistrict = { district: string; stations: ChargingStation[] };

export const CHARGING_STATIONS: ChargingDistrict[] = [
  {
    district: "TP. Thái Bình",
    stations: [
      { name: "Vincom Plaza Thái Bình", address: "Đường Lê Lợi, P. Đề Thám" },
      { name: "Trung tâm hành chính tỉnh", address: "Đại Lộ Lý Bôn" },
      { name: "Showroom VinFast Thái Bình", address: "Đại Lộ Kỳ Đồng, KĐT Dragon City" },
    ],
  },
  {
    district: "Huyện Đông Hưng",
    stations: [
      { name: "TT Đông Hưng", address: "QL10, TT. Đông Hưng" },
      { name: "Trạm xăng Petrolimex Đông Hưng", address: "QL39, xã Đông La" },
    ],
  },
  {
    district: "Huyện Vũ Thư",
    stations: [
      { name: "TT Vũ Thư", address: "QL10, TT. Vũ Thư" },
      { name: "KCN Vũ Thư", address: "Xã Tân Hòa, H. Vũ Thư" },
    ],
  },
  {
    district: "Huyện Kiến Xương",
    stations: [{ name: "TT Thanh Nê", address: "TT. Thanh Nê, H. Kiến Xương" }],
  },
  {
    district: "Huyện Hưng Hà",
    stations: [
      { name: "TT Hưng Hà", address: "TT. Hưng Hà, H. Hưng Hà" },
      { name: "Cụm CN Hưng Hà", address: "Xã Hồng An, H. Hưng Hà" },
    ],
  },
  {
    district: "Huyện Quỳnh Phụ",
    stations: [{ name: "TT Quỳnh Côi", address: "TT. Quỳnh Côi, H. Quỳnh Phụ" }],
  },
  {
    district: "Huyện Thái Thụy",
    stations: [
      { name: "TT Diêm Điền", address: "TT. Diêm Điền, H. Thái Thụy" },
      { name: "Bến cảng Diêm Điền", address: "Xã Thụy Hải, H. Thái Thụy" },
    ],
  },
  {
    district: "Huyện Tiền Hải",
    stations: [
      { name: "TT Tiền Hải", address: "TT. Tiền Hải, H. Tiền Hải" },
      { name: "Khu du lịch Đồng Châu", address: "Xã Đông Minh, H. Tiền Hải" },
    ],
  },
];

export const TOTAL_STATIONS = CHARGING_STATIONS.reduce((sum, d) => sum + d.stations.length, 0);
