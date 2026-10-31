// js/utils/images.js
// Đường dẫn + thẻ <img> dùng chung cho ảnh sản phẩm / nhà vườn / danh mục / logo.
// Ảnh nằm trong thư mục img/. Khi có ảnh thật, chỉ cần thay file cùng tên (hoặc sửa đường dẫn ở đây).
// Nếu ảnh không tồn tại (ví dụ sản phẩm mới thêm từ trang quản trị) thì thẻ <img> tự gỡ bỏ
// và biểu tượng emoji (glyph) phía sau sẽ hiện ra thay thế.

import { PRODUCT_IMAGE_SOURCES } from "../data/product-image-sources.js";

const slugify = (s) => String(s)
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const logoSrc = (basePath = "") => `${basePath}img/logo-nong-san-xanh.png`;
export const logoMarkSrc = (basePath = "") => `${basePath}img/logo-mark-nong-san-xanh.png`;
export const productImgSrc = (p, basePath = "") => {
  const image = PRODUCT_IMAGE_SOURCES[p.id]?.image || `img/products/${p.id}.svg`;
  return /^https?:\/\//i.test(image) ? image : `${basePath}${image}`;
};
export const farmImgSrc = (f, basePath = "") => `${basePath}${f.image || `img/farms/${f.id}.svg`}`;
export const categoryImgSrc = (key, basePath = "") =>
  `${basePath}img/categories/${slugify(key)}.${["Trái cây", "Rau củ", "Gạo", "Cà phê", "Trà", "Nông sản khô", "Đặc sản vùng miền"].includes(key) ? "png" : "svg"}`;

export function imgTag(src, alt, cls = "img-fill"){
  return `<img class="${cls}" src="${src}" alt="${String(alt).replace(/"/g, "&quot;")}" loading="lazy" onerror="this.remove()">`;
}
/** Logo nhỏ đóng dấu trên thẻ */
export const logoStamp = (basePath = "") => `<img class="thumb-logo" src="${logoMarkSrc(basePath)}" alt="Logo Nông Sản Xanh">`;
