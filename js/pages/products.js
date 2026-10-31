// js/pages/products.js
import { initStorage, getProducts, getFarms } from "../utils/storage.js";
import { addToCart } from "../utils/cart.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { productCardHtml, bindAddToCartButtons } from "../components/product-card.js";
import { filterProducts, sortProducts } from "../utils/filter.js";
import { CATEGORIES } from "../data/products.js";

initStorage();
renderHeader("products");
renderFooter();

const products = getProducts();
const farms = getFarms();
const provinces = [...new Set(farms.map(f => f.province))].sort();
const standards = [...new Set(products.flatMap(p => p.standards || []))].sort();

const grid = document.getElementById("product-grid");
const resultCount = document.getElementById("result-count");
const sortSelect = document.getElementById("sort-select");

/* ---------- Sinh bộ lọc động ---------- */
document.getElementById("filter-category").innerHTML = radioGroup("category", "all", "Tất cả", CATEGORIES.map(c => ({ value: c.key, label: c.key })));
document.getElementById("filter-province").innerHTML = radioGroup("province", "all", "Tất cả", provinces.map(p => ({ value: p, label: p })));
document.getElementById("filter-farm").innerHTML = radioGroup("farm", "all", "Tất cả", farms.map(f => ({ value: f.id, label: f.name })));
document.getElementById("filter-standard").innerHTML = radioGroup("standard", "all", "Tất cả", standards.map(s => ({ value: s, label: s })));
document.getElementById("filter-season").innerHTML = radioGroup("season", "all", "Tất cả", [
  { value: "in-season", label: "Đang vào mùa" },
  { value: "limited", label: "Nguồn cung hạn chế" },
  { value: "pre-order", label: "Đặt trước" },
  { value: "out-of-season", label: "Đã hết mùa" },
]);

function radioGroup(name, defaultValue, defaultLabel, options){
  const all = [{ value: defaultValue, label: defaultLabel }, ...options];
  return all.map(o => `
    <label>
      <input type="radio" name="${name}" value="${o.value}" ${o.value === defaultValue ? "checked" : ""}>
      ${o.label}
    </label>`).join("");
}

/* ---------- Đọc filter hiện tại từ form ---------- */
function readFilters(){
  const val = (name) => {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el && el.value !== "all" ? el.value : null;
  };
  return {
    category: val("category"),
    province: val("province"),
    farmId: val("farm"),
    standard: val("standard"),
    seasonStatus: val("season"),
    minPrice: document.getElementById("price-min").value || null,
    maxPrice: document.getElementById("price-max").value || null,
  };
}

function applyAndRender(){
  const filters = readFilters();
  let list = filterProducts(products, farms, filters);
  list = sortProducts(list, sortSelect.value);

  resultCount.textContent = `${list.length} sản phẩm`;
  if(list.length === 0){
    grid.innerHTML = `<div class="state-box" style="grid-column:1/-1;"><div class="glyph">🌾</div><p>Chưa có sản phẩm phù hợp bộ lọc.</p></div>`;
    return;
  }
  grid.innerHTML = list.map(p => productCardHtml(p, farms.find(f => f.id === p.farmId), "", { showOrigin: false })).join("");
  bindAddToCartButtons(grid, addToCart, (result) => alert(result.message));
}

/* ---------- Áp dụng ?cat= và ?season= từ URL (link từ trang chủ/footer) ---------- */
const urlParams = new URLSearchParams(window.location.search);
const urlCat = urlParams.get("cat");
if(urlCat){
  const radio = document.querySelector(`input[name="category"][value="${CSS.escape(urlCat)}"]`);
  if(radio) radio.checked = true;
}
const urlSeason = urlParams.get("season");
if(urlSeason){
  const radio = document.querySelector(`input[name="season"][value="${CSS.escape(urlSeason)}"]`);
  if(radio){
    radio.checked = true;
    radio.closest("[data-filter-item]").classList.add("is-open");
  }
}

document.getElementById("filter-panel").addEventListener("change", applyAndRender);
sortSelect.addEventListener("change", applyAndRender);
document.getElementById("price-min").addEventListener("input", applyAndRender);
document.getElementById("price-max").addEventListener("input", applyAndRender);
document.getElementById("filter-reset").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelectorAll('#filter-panel input[type=radio][value="all"]').forEach(r => r.checked = true);
  document.getElementById("price-min").value = "";
  document.getElementById("price-max").value = "";
  applyAndRender();
});

/* ---------- Menu xổ (accordion) cho từng nhóm bộ lọc ---------- */
document.querySelectorAll("[data-filter-item] .filter-accordion-head").forEach(head => {
  head.addEventListener("click", () => {
    head.closest("[data-filter-item]").classList.toggle("is-open");
  });
});

applyAndRender();
