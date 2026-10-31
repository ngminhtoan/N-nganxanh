// js/components/product-card.js
// Sinh HTML cho 1 Product Card — dùng lại ở trang chủ, trang sản phẩm, tìm kiếm, chi tiết nhà vườn.

import { formatPriceShort, seasonLabel, isPurchasable } from "../utils/format.js";
import { productImgSrc, imgTag, logoStamp } from "../utils/images.js";

export function productCardHtml(product, farm, basePath = "", options = {}){
  const season = seasonLabel(product.seasonStatus);
  const standardsHtml = (product.standards || [])
    .map(s => `<span class="badge badge-standard">${s}</span>`)
    .join("");

  const purchasable = isPurchasable(product);
  const priceExtra = (product.priceType === "market")
    ? '<span class="unit">(giá thị trường)</span>'
    : (product.priceType === "negotiable" || product.priceType === "contact")
      ? ""
      : `<span class="unit">/${product.unit}</span>`;

  const priceClass = (product.priceType === "negotiable" || product.priceType === "contact") ? "price-note" : "";
  const priceLabel = formatPriceShort(product, farm);
  const originHtml = options.showOrigin === false
    ? ""
    : `<div class="product-origin">${product.origin}${farm ? " · " + farm.name : ""}</div>`;

  return `
    <div class="product-card">
      <div class="product-thumb">
        <div class="thumb-badges">
          ${product.stock <= 0 ? '<span class="badge badge-stock-out">Tạm hết hàng</span>' : ""}
          ${product.seasonStatus !== "in-season" ? `<span class="badge ${season.badgeClass}">${season.text}</span>` : ""}
        </div>
        ${product.glyph || "🌿"}
        ${imgTag(productImgSrc(product, basePath), product.name)}
        ${logoStamp(basePath)}
      </div>
      <div class="product-body">
        <span class="product-cat">${product.category}</span>
        <div class="product-name"><a href="${basePath}chi-tiet-san-pham.html?id=${product.id}">${product.name}</a></div>
        ${originHtml}
        <div class="product-origin product-harvest">${product.harvestSeason ? `🗓️ Mùa vụ: ${product.harvestSeason}` : ""}</div>
        <div class="product-standards${standardsHtml ? "" : " is-empty"}">${standardsHtml}</div>
        <div class="product-price ${priceClass}">
          ${priceLabel}${priceExtra}
        </div>
      </div>
      <div class="product-actions">
        <a href="${basePath}chi-tiet-san-pham.html?id=${product.id}" class="btn btn-outline btn-sm btn-block">Xem chi tiết</a>
        <button class="btn btn-sm btn-block js-add-cart" data-id="${product.id}" ${purchasable ? "" : "disabled"}>
          Thêm vào giỏ
        </button>
      </div>
    </div>`;
}

/** Gắn sự kiện "Thêm vào giỏ" cho mọi nút .js-add-cart bên trong 1 container. */
export function bindAddToCartButtons(container, addToCartFn, onDone){
  container.querySelectorAll(".js-add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const result = addToCartFn(Number(btn.dataset.id), 1);
      if(onDone) onDone(result);
    });
  });
}

/** Thẻ sản phẩm dạng cửa hàng: cả thẻ là 1 liên kết tới trang chi tiết (ảnh, tên, giá). */
export function shopCardHtml(product, farm, basePath = ""){
  const out = product.stock <= 0 ? '<span class="badge badge-stock-out">Tạm hết hàng</span>' : "";
  return `
    <a class="shop-card" href="${basePath}chi-tiet-san-pham.html?id=${product.id}&from=shop">
      <div class="shop-card-thumb">
        <div class="thumb-badges">${out}</div>
        <span class="shop-card-glyph">${product.glyph || "🌿"}</span>
        ${imgTag(productImgSrc(product, basePath), product.name)}
        <div class="shop-card-tags">${(product.standards || []).map(s => `<span>${s}</span>`).join("")}</div>
      </div>
      <div class="shop-card-name">${product.name}</div>
      <div class="shop-card-price">Giá: <b>${formatPriceShort(product, farm)}</b></div>
    </a>`;
}
