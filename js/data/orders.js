// js/data/orders.js
// Đơn hàng mẫu ban đầu (mô phỏng), gắn với userId = 1 (khachhang@demo.vn)
// để trang lịch sử đơn hàng / dashboard nhà vườn có dữ liệu minh họa ngay từ đầu.

export const SEED_ORDERS = [
  {
    id: 1001, userId: 1,
    customerName: "Nguyễn Thị Lan", phone: "0901 234 567",
    address: "12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh", note: "Giao giờ hành chính",
    items: [
      { productId: 1, quantity: 2 },
      { productId: 9, quantity: 5 },
    ],
    total: 330000, status: "completed", createdAt: "2026-09-10",
  },
  {
    id: 1002, userId: 1,
    customerName: "Nguyễn Thị Lan", phone: "0901 234 567",
    address: "12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh", note: "",
    items: [
      { productId: 6, quantity: 3 },
      { productId: 7, quantity: 2 },
    ],
    total: 160000, status: "shipping", createdAt: "2026-09-18",
  },
  {
    id: 1003, userId: 1,
    customerName: "Nguyễn Thị Lan", phone: "0901 234 567",
    address: "12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh", note: "Gọi trước khi giao",
    items: [
      { productId: 11, quantity: 1 },
    ],
    total: 120000, status: "pending", createdAt: "2026-09-22",
  },
];
