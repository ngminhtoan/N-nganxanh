// js/pages/product-detail.js
import { initStorage, getPublicProducts, getFarms } from "../utils/storage.js";
import { addToCart } from "../utils/cart.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { productCardHtml, shopCardHtml, bindAddToCartButtons, showCartNotice } from "../components/product-card.js";
import { formatPrice, formatDate, seasonLabel, isPurchasable } from "../utils/format.js";
import { productImgSrc, farmImgSrc, imgTag, logoStamp } from "../utils/images.js";
import { PRODUCT_IMAGE_SOURCES } from "../data/product-image-sources.js";


const fromShop = new URLSearchParams(window.location.search).get("from") === "shop";

initStorage();
renderHeader(fromShop ? "shop" : "products");
renderFooter();

const products = getPublicProducts();
const farms = getFarms();
const id = Number(new URLSearchParams(window.location.search).get("id"));
const product = products.find(p => p.id === id);
const root = document.getElementById("detail-root");

if(!product){
  root.innerHTML = `<div class="state-box"><div class="glyph"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search" aria-hidden="true"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg></div><p>Không tìm thấy sản phẩm.</p><a href="${fromShop ? "cua-hang.html" : "san-pham.html"}" class="btn btn-outline">Về trang sản phẩm</a></div>`;
}else{
  renderDetail(product);
}

function renderDetail(p){
  const farm = farms.find(f => f.id === p.farmId);
  const sku = "NSV" + String(p.id).padStart(5, "0");
  const season = seasonLabel(p.seasonStatus);
  const purchasable = isPurchasable(p);
  const standardsHtml = (p.standards || []).map(s => `<span class="badge badge-standard">${s}</span>`).join("");

  root.innerHTML = `
    <div class="breadcrumb">
      <a href="index.html">Trang chủ</a> / ${fromShop
        ? `<a href="cua-hang.html">Sản phẩm</a> / <a href="danh-muc.html?cat=${encodeURIComponent(p.category)}">${p.category}</a>`
        : `<a href="san-pham.html">Cửa hàng</a>`} / ${p.name}
    </div>
    <div class="detail-grid">
      <div class="detail-visual">${imgTag(productImgSrc(p), p.name)}${logoStamp()}</div>
      <div>
        <span class="product-cat">${p.category}</span>
        <h1>${p.name}</h1>
        <div class="detail-sku-row"><span>SKU: ${sku}</span><button type="button" class="share-btn" id="share-btn">↗ Chia sẻ</button></div>
        <div class="detail-badges">
          ${standardsHtml}
          <span class="badge ${season.badgeClass}">${season.text}</span>
          ${p.stock <= 0 ? '<span class="badge badge-stock-out">Tạm hết hàng</span>' : ""}
        </div>

        <div class="detail-price">${formatPrice(p, farm)}</div>
        ${p.priceType === "contact"
          ? `<div class="price-updated">Sản phẩm này không niêm yết giá — vui lòng gọi trực tiếp gian hàng để được báo giá.</div>`
          : `<div class="price-updated">Cập nhật giá lần cuối: ${formatDate(p.priceUpdatedAt)}</div>`}

        <div class="detail-meta-list">
          <div class="row"><span>Số lượng còn lại</span><span>${p.stock > 0 ? p.stock + " " + p.unit : "Hết hàng"}</span></div>
          <div class="row"><span>Mùa vụ thu hoạch</span><span>${p.harvestSeason || "—"}</span></div>
          <div class="row"><span>Nguồn gốc</span><span>${p.origin}</span></div>
          <div class="row"><span>Nguồn ảnh</span><span><a href="${PRODUCT_IMAGE_SOURCES[p.id]?.source || "#"}" target="_blank" rel="noopener noreferrer">${PRODUCT_IMAGE_SOURCES[p.id]?.sourceName || "—"}</a></span></div>
          <div class="row"><span>Nhà vườn/HTX</span><span>${farm ? `<a href="chi-tiet-nha-vuon.html?id=${farm.id}">${farm.name}</a>` : "—"}</span></div>
          ${farm && farm.phone ? `<div class="row"><span>Điện thoại gian hàng</span><span>📞 ${farm.phone}</span></div>` : ""}
        </div>

        <p class="detail-desc">${p.description}</p>

        ${purchasable ? `
        <div class="qty-row">
          <div class="qty-control">
            <button type="button" id="qty-minus">−</button>
            <input type="text" id="qty-input" readonly value="1">
            <button type="button" id="qty-plus">+</button>
          </div>
          <span class="stock-note">Tối đa ${p.stock} ${p.unit}</span>
        </div>
        <div class="detail-actions">
          <button class="btn" id="add-to-cart-btn">Thêm vào giỏ hàng</button>
          <a href="gio-hang.html" class="btn btn-outline">Xem giỏ hàng</a>
        </div>` : `
        <div class="detail-actions">
          ${p.priceType === "contact" && farm && farm.phone
            ? `<a href="tel:${farm.phone.replace(/\s/g, "")}" class="btn">📞 Gọi ${farm.phone}</a>`
            : `<button class="btn" disabled>${p.stock <= 0 ? "Tạm hết hàng" : "Đã hết mùa"}</button>`}
          ${farm ? `<a href="chi-tiet-nha-vuon.html?id=${farm.id}" class="btn btn-outline">Xem thông tin nhà vườn</a>` : ""}
        </div>`}
      </div>
    </div>

    <section class="section-tight">
      <div class="section-head"><h2>${fromShop ? "Sản phẩm liên quan" : "Sản phẩm khác cùng nhà vườn"}</h2></div>
      <div class="product-grid ${fromShop ? "shop-grid" : ""}" id="related-grid"></div>
    </section>`;

  if(purchasable){
    let qty = 1;
    const qtyInput = document.getElementById("qty-input");
    document.getElementById("qty-minus").addEventListener("click", () => {
      qty = Math.max(1, qty - 1);
      qtyInput.value = qty;
    });
    document.getElementById("qty-plus").addEventListener("click", () => {
      qty = Math.min(p.stock, qty + 1);
      qtyInput.value = qty;
    });
    document.getElementById("add-to-cart-btn").addEventListener("click", () => {
      const result = addToCart(p.id, qty);
      showCartNotice(result);
    });
  }

  document.getElementById("share-btn").addEventListener("click", async () => {
    const url = window.location.href;
    try{
      if(navigator.share){ await navigator.share({ title: p.name, url }); return; }
      await navigator.clipboard.writeText(url);
      alert("Đã sao chép liên kết sản phẩm.");
    }catch(e){ /* người dùng huỷ chia sẻ */ }
  });

  const relatedGrid = document.getElementById("related-grid");
  const related = fromShop
    ? products.filter(rp => rp.category === p.category && rp.id !== p.id).slice(0, 3)
    : products.filter(rp => rp.farmId === p.farmId && rp.id !== p.id).slice(0, 4);
  if(related.length === 0){
    document.querySelector(".section-tight").style.display = "none";
  }else{
    if(fromShop){
      relatedGrid.innerHTML = related.map(rp => shopCardHtml(rp, farms.find(f => f.id === rp.farmId))).join("");
    }else{
      relatedGrid.innerHTML = related.map(rp => productCardHtml(rp, farm)).join("");
      bindAddToCartButtons(relatedGrid, addToCart, showCartNotice);
    }
  }
}
