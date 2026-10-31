// js/data/users.js
// Tài khoản mô phỏng có sẵn để test đăng nhập (Front-end only, KHÔNG bảo mật thật).
// type: "customer" | "farm"
// Tài khoản farm có farmId liên kết tới js/data/farms.js

export const SEED_USERS = [
  {
    id: 1, type: "customer",
    name: "Nguyễn Thị Lan", email: "khachhang@demo.vn", password: "123456",
    phone: "0901 234 567", address: "12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
  },
  {
    id: 2, type: "farm", farmId: 1,
    name: "Hợp tác xã Xoài Cát Hòa Lộc", email: "htx.xoai@demo.vn", password: "123456",
    phone: "0273 xxx xxx", address: "Xã Hòa Hưng, huyện Cái Bè, tỉnh Tiền Giang",
    description: "HTX chuyên canh tác xoài cát Hòa Lộc theo tiêu chuẩn VietGAP.",
  },
  {
    id: 3, type: "farm", farmId: 3,
    name: "HTX Nông nghiệp Hữu cơ Đà Lạt", email: "htx.dalat@demo.vn", password: "123456",
    phone: "0263 xxx xxx", address: "Phường 7, TP. Đà Lạt, tỉnh Lâm Đồng",
    description: "Chuyên rau củ hữu cơ trồng trong nhà kính, đạt chứng nhận hữu cơ và OCOP 4 sao.",
  },
  {
    // Tài khoản Quản trị hệ thống (Super Admin) — quản lý toàn bộ gian hàng/HTX trên sàn.
    // Đăng nhập tại sadmin/dang-nhap.html (khác với đăng nhập nhà vườn/khách hàng).
    id: 100, type: "admin",
    name: "Quản trị hệ thống", email: "admin@nongsanviet.vn", password: "admin123",
    phone: "", address: "",
  },
];
