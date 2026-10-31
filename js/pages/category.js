// js/pages/category.js — Danh sách sản phẩm theo loại (?cat=) hoặc theo mùa vụ (?season=)
import { initStorage, getProducts, getFarms } from "../utils/storage.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { shopCardHtml } from "../components/product-card.js";
import { filterProducts, sortProducts } from "../utils/filter.js";
import { CATEGORIES } from "../data/products.js";
import { SEASON_LABELS } from "../utils/format.js";
import { categoryImgSrc } from "../utils/images.js";

initStorage();
renderHeader("shop");
renderFooter();

const products = getProducts();
const farms = getFarms();
const params = new URLSearchParams(window.location.search);
const catKey = params.get("cat");
const season = params.get("season");
const category = CATEGORIES.find(c => c.key === catKey);

const grid = document.getElementById("product-grid");
const sortSelect = document.getElementById("sort-select");
const intro = document.getElementById("cat-intro");

let heading = "Tất cả sản phẩm";
if(category) heading = `Sản phẩm ${category.key}`;
else if(season && SEASON_LABELS[season]) heading = SEASON_LABELS[season].text;

document.title = `${heading} — Nông Sản Xanh`;
document.getElementById("cat-heading").textContent = heading;
document.getElementById("cat-breadcrumb").innerHTML =
  `<a href="index.html">Trang chủ</a> / <a href="cua-hang.html">Sản phẩm</a> / ${heading}`;

if(category){
  if(category.key === "Trái cây") intro.classList.add("has-image");
  intro.innerHTML = `
    <div class="cat-intro-copy">
      <h1 class="cat-title">${heading}</h1>
      ${category.desc.map(t => `<p>${t}</p>`).join("")}
    </div>
    ${category.key === "Trái cây" ? `<img class="cat-intro-image" src="${categoryImgSrc(category.key)}" alt="Rổ trái cây tươi nhiều màu sắc">` : ""}`;
}else{
  intro.innerHTML = `<h1 class="cat-title">${heading}</h1>`;
}

function render(){
  const list = sortProducts(
    filterProducts(products, farms, { category: category ? category.key : null, seasonStatus: season }),
    sortSelect.value
  );
  if(list.length === 0){
    grid.innerHTML = `<div class="state-box" style="grid-column:1/-1;"><div class="glyph">🌾</div><p>Chưa có sản phẩm trong mục này.</p><a href="cua-hang.html" class="btn btn-outline">Về trang Sản phẩm</a></div>`;
    return;
  }
  grid.innerHTML = list.map(p => shopCardHtml(p, farms.find(f => f.id === p.farmId))).join("");
}
sortSelect.addEventListener("change", render);
render();
