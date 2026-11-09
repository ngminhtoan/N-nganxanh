// js/pages/search.js
import { initStorage, getPublicProducts, getFarms } from "../utils/storage.js";
import { addToCart } from "../utils/cart.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { productCardHtml, bindAddToCartButtons, showCartNotice } from "../components/product-card.js";
import { searchProducts } from "../utils/search.js";

initStorage();
renderHeader("");
renderFooter();

const products = getPublicProducts();
const farms = getFarms();
const query = new URLSearchParams(window.location.search).get("q") || "";

document.getElementById("search-input").value = query;
document.getElementById("search-title").textContent = query
  ? `Kết quả tìm kiếm cho "${query}"`
  : "Tìm kiếm sản phẩm";

const grid = document.getElementById("search-grid");
runSearch(query);

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = document.getElementById("search-input").value.trim();
  const url = new URL(window.location);
  url.searchParams.set("q", q);
  window.history.pushState({}, "", url);
  document.getElementById("search-title").textContent = q ? `Kết quả tìm kiếm cho "${q}"` : "Tìm kiếm sản phẩm";
  runSearch(q);
});

document.getElementById("clear-search").addEventListener("click", () => {
  document.getElementById("search-input").value = "";
  window.history.pushState({}, "", window.location.pathname);
  document.getElementById("search-title").textContent = "Tìm kiếm sản phẩm";
  grid.innerHTML = "";
  document.getElementById("search-empty").style.display = "none";
});

function runSearch(q){
  if(!q){
    grid.innerHTML = "";
    document.getElementById("search-empty").style.display = "none";
    return;
  }
  const results = searchProducts(products, farms, q);
  if(results.length === 0){
    grid.innerHTML = "";
    document.getElementById("search-empty").style.display = "block";
    return;
  }
  document.getElementById("search-empty").style.display = "none";
  grid.innerHTML = results.map(p => productCardHtml(p, farms.find(f => f.id === p.farmId))).join("");
  bindAddToCartButtons(grid, addToCart, showCartNotice);
}
