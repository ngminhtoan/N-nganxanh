// js/components/product-card.js
// Sinh HTML cho 1 Product Card — dùng lại ở trang chủ, trang sản phẩm, tìm kiếm, chi tiết nhà vườn.

import { formatPriceShort, seasonLabel, isPurchasable } from "../utils/format.js";
import { productImgSrc, imgTag, logoStamp } from "../utils/images.js";

let cartNoticeTimer;

export function showCartNotice(result){
  let notice = document.getElementById("cart-notice");
  if(!notice){
    notice = document.createElement("div");
    notice.id = "cart-notice";
    notice.className = "cart-notice";
    notice.innerHTML = `
      <div class="cart-notice-dialog" role="dialog" aria-modal="true" aria-labelledby="cart-notice-title" aria-describedby="cart-notice-message">
        <div class="cart-notice-icon" aria-hidden="true">✓</div>
        <h2 id="cart-notice-title"></h2>
        <p id="cart-notice-message"></p>
      </div>`;
    notice.addEventListener("click", (event) => {
      if(event.target === notice) closeCartNotice();
    });
    document.body.appendChild(notice);
  }

  notice.querySelector("#cart-notice-title").textContent = result.ok ? "Đã thêm vào giỏ hàng!" : "Chưa thể thêm sản phẩm";
  const message = notice.querySelector("#cart-notice-message");
  message.textContent = result.ok ? "" : result.message;
  message.hidden = result.ok;
  notice.classList.toggle("is-error", !result.ok);
  notice.classList.add("is-visible");
  window.clearTimeout(cartNoticeTimer);
  cartNoticeTimer = window.setTimeout(closeCartNotice, 2600);
  document.addEventListener("keydown", handleCartNoticeKeydown);
}

function closeCartNotice(){
  document.getElementById("cart-notice")?.classList.remove("is-visible");
  document.removeEventListener("keydown", handleCartNoticeKeydown);
}

function handleCartNoticeKeydown(event){
  if(event.key === "Escape") closeCartNotice();
}

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
  const harvestHtml = product.harvestSeason
    ? `<div class="product-origin product-harvest">Mùa vụ: ${product.harvestSeason}</div>`
    : "";

  return `
    <div class="product-card">
      <div class="product-thumb">
        <div class="thumb-badges">
          ${product.stock <= 0 ? '<span class="badge badge-stock-out">Tạm hết hàng</span>' : ""}
          ${product.seasonStatus !== "in-season" ? `<span class="badge ${season.badgeClass}">${season.text}</span>` : ""}
        </div>
        ${imgTag(productImgSrc(product, basePath), product.name)}
        ${logoStamp(basePath)}
      </div>
      <div class="product-body">
        <div class="product-name"><a href="${basePath}chi-tiet-san-pham.html?id=${product.id}">${product.name}</a></div>
        ${originHtml}
        ${harvestHtml}
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
        ${imgTag(productImgSrc(product, basePath), product.name)}
        <div class="shop-card-tags">${(product.standards || []).map(s => `<span>${s}</span>`).join("")}</div>
      </div>
      <div class="shop-card-name">${product.name}</div>
      <div class="shop-card-price">Giá: <b>${formatPriceShort(product, farm)}</b></div>
    </a>`;
}
