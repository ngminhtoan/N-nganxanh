// js/pages/farm-detail.js
import { initStorage, getProducts, getFarms } from "../utils/storage.js";
import { addToCart } from "../utils/cart.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { productCardHtml, bindAddToCartButtons } from "../components/product-card.js";
import { productImgSrc, farmImgSrc, imgTag, logoStamp } from "../utils/images.js";


initStorage();
renderHeader("farms");
renderFooter();

const products = getProducts();
const farms = getFarms();
const id = Number(new URLSearchParams(window.location.search).get("id"));
const farm = farms.find(f => f.id === id);
const root = document.getElementById("farm-detail-root");

if(!farm){
  root.innerHTML = `<div class="state-box"><div class="glyph">🔍</div><p>Không tìm thấy nhà vườn/HTX.</p><a href="nha-vuon.html" class="btn btn-outline">Về danh sách nhà vườn</a></div>`;
}else{
  const farmProducts = products.filter(p => p.farmId === farm.id);
  const standardsHtml = (farm.standards || []).map(s => `<span class="badge badge-standard">${s}</span>`).join("");

  root.innerHTML = `
    <div class="breadcrumb"><a href="index.html">Trang chủ</a> / <a href="nha-vuon.html">Nhà vườn/HTX</a> / ${farm.name}</div>

    <div class="farm-card" style="margin-bottom:36px;">
      <div class="farm-card-top">
        <div class="farm-logo" style="width:72px;height:72px;font-size:2.2rem;">${farm.glyph}${imgTag(farmImgSrc(farm), "Logo " + farm.name)}</div>
        <div>
          <h1 style="margin-bottom:2px;">${farm.name}</h1>
          <div class="farm-meta">${farm.type} · ${farm.province}</div>
        </div>
      </div>
      <p class="farm-desc">${farm.description}</p>
      ${standardsHtml ? `<div class="product-standards">${standardsHtml}</div>` : ""}
      <div class="detail-meta-list">
        <div class="row"><span>Địa chỉ</span><span>${farm.address || "—"}</span></div>
        <div class="row"><span>Điện thoại</span><span>${farm.phone || "—"}</span></div>
        <div class="row"><span>Số sản phẩm đang bán</span><span>${farmProducts.length}</span></div>
      </div>
    </div>

    <div class="section-head"><h2>Sản phẩm đang bán</h2></div>
    <div class="product-grid" id="farm-product-grid"></div>`;

  const grid = document.getElementById("farm-product-grid");
  if(farmProducts.length === 0){
    grid.innerHTML = `<div class="state-box" style="grid-column:1/-1;"><div class="glyph">🌾</div><p>Chưa có sản phẩm.</p></div>`;
  }else{
    grid.innerHTML = farmProducts.map(p => productCardHtml(p, farm)).join("");
    bindAddToCartButtons(grid, addToCart, (result) => alert(result.message));
  }
}
