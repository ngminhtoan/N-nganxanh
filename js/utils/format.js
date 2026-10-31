// js/utils/format.js
// Định dạng giá tiền, ngày tháng, nhãn trạng thái mùa vụ / đơn hàng.

export function formatVND(n){
  return Number(n).toLocaleString("vi-VN") + "đ";
}

/**
 * Trả về chuỗi hiển thị giá theo priceType — không xem giá nông sản là cố định tuyệt đối.
 * farm (tùy chọn): khi priceType = "contact", hiển thị SĐT gian hàng/HTX thay vì giá.
 */
export function formatPrice(product, farm){
  switch(product.priceType){
    case "market":
      return `${formatVND(product.price)}/${product.unit} (giá thị trường)`;
    case "fixed":
      return `${formatVND(product.price)}/${product.unit}`;
    case "negotiable":
      return "Giá thỏa thuận";
    case "contact":
      return farm && farm.phone ? `📞 Liên hệ: ${farm.phone}` : "Liên hệ nhà vườn";
    default:
      return `${formatVND(product.price)}/${product.unit}`;
  }
}

/** Giá rút gọn dùng cho product card. farm (tùy chọn) để hiển thị SĐT khi priceType = "contact". */
export function formatPriceShort(product, farm){
  if(product.priceType === "negotiable") return "Thỏa thuận";
  if(product.priceType === "contact") return farm && farm.phone ? `📞 ${farm.phone}` : "Liên hệ";
  return formatVND(product.price);
}

export function formatDate(dateStr){
  if(!dateStr) return "—";
  const d = new Date(dateStr);
  if(isNaN(d)) return dateStr;
  return d.toLocaleDateString("vi-VN");
}

export const SEASON_LABELS = {
  "in-season": { text: "Đang vào mùa", badgeClass: "badge-season-in" },
  "out-of-season": { text: "Đã hết mùa", badgeClass: "badge-season-out" },
  "limited": { text: "Nguồn cung hạn chế", badgeClass: "badge-season-limited" },
  "pre-order": { text: "Đặt trước", badgeClass: "badge-season-preorder" },
};

export function seasonLabel(status){
  return SEASON_LABELS[status] || { text: status, badgeClass: "badge-season-out" };
}

export const ORDER_STATUS_LABELS = {
  pending: { text: "Chờ xác nhận", badgeClass: "badge-order-pending" },
  confirmed: { text: "Đã xác nhận", badgeClass: "badge-order-confirmed" },
  shipping: { text: "Đang giao hàng", badgeClass: "badge-order-shipping" },
  completed: { text: "Hoàn thành", badgeClass: "badge-order-completed" },
  cancelled: { text: "Đã hủy", badgeClass: "badge-order-cancelled" },
};

export function orderStatusLabel(status){
  return ORDER_STATUS_LABELS[status] || { text: status, badgeClass: "badge-order-pending" };
}

/** Sản phẩm có được phép mua trực tiếp (thêm vào giỏ) hay không. */
export function isPurchasable(product){
  if(product.stock <= 0) return false;
  if(product.seasonStatus === "out-of-season") return false;
  if(product.priceType === "contact") return false;
  return true;
}
