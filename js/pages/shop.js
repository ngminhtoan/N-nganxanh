// js/pages/shop.js — Trang "Cửa hàng": mỗi loại sản phẩm là 1 khung riêng
import { initStorage, getPublicProducts } from "../utils/storage.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { CATEGORIES } from "../data/products.js";
import { categoryImgSrc, logoSrc } from "../utils/images.js";

initStorage();
renderHeader("shop");
renderFooter();

const products = getPublicProducts();
const root = document.getElementById("shop-sections");

root.innerHTML = CATEGORIES.map((c, i) => {
  const count = products.filter(p => p.category === c.key).length;
  const href = `danh-muc.html?cat=${encodeURIComponent(c.key)}`;
  return `
    <article class="shop-block ${i % 2 ? "is-reverse" : ""} ${["Trái cây", "Rau củ", "Gạo", "Cà phê", "Trà", "Nông sản khô", "Đặc sản vùng miền"].includes(c.key) ? "shop-block--photo" : ""}">
      <a class="shop-visual" href="${href}" aria-label="Sản phẩm ${c.key}">
        <div class="shop-visual-title">Sản phẩm ${c.key}</div>
        <div class="shop-visual-tag">${c.tagline}</div>
        <img class="shop-visual-img" src="${categoryImgSrc(c.key)}" alt="Hình ${c.key}" loading="lazy" onerror="this.remove()">
        <img class="shop-visual-logo" src="${logoSrc()}" alt="Logo Nông Sản Xanh">
      </a>
      <div class="shop-info">
        <h2 class="shop-title">Sản phẩm ${c.key}</h2>
        <div class="shop-desc" data-desc>
          ${c.desc.map(t => `<p>${t}</p>`).join("")}
        </div>
        <button type="button" class="shop-toggle" data-toggle aria-expanded="false">Xem thêm</button>
        <div><a href="${href}" class="btn shop-btn">Xem danh sách sản phẩm${count ? ` (${count})` : ""}</a></div>
      </div>
    </article>`;
}).join("");

// Xem thêm / Thu gọn cho từng khung
root.querySelectorAll(".shop-block").forEach(block => {
  const desc = block.querySelector("[data-desc]");
  const btn = block.querySelector("[data-toggle]");
  // Nếu nội dung ngắn, không cần nút
  if(desc.scrollHeight <= desc.clientHeight + 2) btn.style.display = "none";
  btn.addEventListener("click", () => {
    const open = desc.classList.toggle("is-open");
    btn.textContent = open ? "Thu gọn" : "Xem thêm";
    btn.setAttribute("aria-expanded", String(open));
  });
});
