// js/pages/home.js
import { initStorage, getPublicProducts, getFarms, getLeads, saveLeads } from "../utils/storage.js";
import { addToCart } from "../utils/cart.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { productCardHtml, bindAddToCartButtons, showCartNotice } from "../components/product-card.js";
import { farmCardHtml } from "../components/farm-card.js";
import { CATEGORIES } from "../data/products.js";
import { formatPriceShort } from "../utils/format.js";
import { initPercentSlider, initPixelCarousel } from "../utils/slider.js";
import { initScrollReveal } from "../utils/reveal.js";
import { productImgSrc, categoryImgSrc, imgTag, logoStamp } from "../utils/images.js";

initStorage();
renderHeader("home");
renderFooter();

const products = getPublicProducts();
const farms = getFarms();

/* ---------- Danh mục sản phẩm ---------- */
const categoryGrid = document.getElementById("category-grid");
categoryGrid.innerHTML = CATEGORIES.map(c => `
  <a class="category-card reveal" href="san-pham.html?cat=${encodeURIComponent(c.key)}">
    <img class="category-img" src="${categoryImgSrc(c.key)}" alt="Nhóm ${c.key}" loading="lazy">
    <span>${c.key}</span>
  </a>`).join("");

/* ---------- Thanh thống kê (số liệu thật lấy từ dữ liệu hiện có) ---------- */
document.getElementById("stat-products").textContent = `${products.length}+`;
document.getElementById("stat-farms").textContent = `${farms.length}+`;
document.getElementById("stat-categories").textContent = `${CATEGORIES.length}`;

/* ---------- Đang vào mùa (vẫn dùng Product Card đầy đủ chức năng) ---------- */
const seasonGrid = document.getElementById("season-grid");
const inSeason = products.filter(p => p.seasonStatus === "in-season").slice(0, 4);
if(inSeason.length === 0){
  document.getElementById("season-section").style.display = "none";
}else{
  seasonGrid.innerHTML = inSeason.map(p => `<div class="reveal">${productCardHtml(p, farms.find(f => f.id === p.farmId))}</div>`).join("");
  bindAddToCartButtons(seasonGrid, addToCart, showCartNotice);
}

/* ---------- Sản phẩm nổi bật: khung CHỈ chứa ảnh, ảnh phủ vừa khít khung ---------- */
const featureTrack = document.getElementById("feature-slide-track");
const featured = products.filter(p => p.stock > 0).slice(0, 10);
featureTrack.innerHTML = featured.map(p => `
  <div class="feature-slide reveal">
    <div class="feature-slide-image">${imgTag(productImgSrc(p), p.name)}${logoStamp()}</div>
    <div class="feature-slide-caption">
      <div class="cat">${p.category}</div>
      <h3>${p.name}</h3>
      <div class="price">${formatPriceShort(p, farms.find(f => f.id === p.farmId))}</div>
    </div>
  </div>`).join("");
initPixelCarousel({ containerId: "feature-slider", trackId: "feature-slide-track", prevId: "feature-prev", nextId: "feature-next", step: 238 });

/* ---------- Nhà vườn/HTX: carousel, thẻ đồng đều kích thước, nút "Xem nhà vườn" ngang hàng ---------- */
const farmTrack = document.getElementById("farm-carousel-track");
farmTrack.innerHTML = farms.map(f => {
  const count = products.filter(p => p.farmId === f.id).length;
  return farmCardHtml(f, count).replace('class="farm-card"', 'class="farm-card reveal"');
}).join("");
initPixelCarousel({ containerId: "farm-carousel", trackId: "farm-carousel-track", prevId: "farm-prev", nextId: "farm-next", step: 320 });

/* =========================================================
   MODAL "NHẬN BÁO GIÁ" — mở từ 2 nút cạnh "Sản phẩm nổi bật"
   ========================================================= */
const leadModalOverlay = document.getElementById("lead-modal-overlay");
const modalCategorySelect = document.getElementById("modal-lead-category");
const modalCategoryField = document.getElementById("modal-lead-category-field");
const modalMessageField = document.getElementById("modal-lead-message-field");
const modalEmailField = document.getElementById("modal-lead-email-field");
const modalEmailInput = document.getElementById("modal-lead-email");
let currentLeadMode = "quote";
modalCategorySelect.innerHTML = `<option value="">-- Chọn dòng sản phẩm --</option>` +
  CATEGORIES.map(c => `<option value="${c.key}">${c.key}</option>`).join("") +
  `<option value="Khác">Khác</option>`;

function openLeadModal(mode = "quote"){
  currentLeadMode = mode === "contact" ? "contact" : "quote";
  const isContact = currentLeadMode === "contact";
  modalCategoryField.hidden = isContact;
  modalMessageField.hidden = isContact;
  modalEmailField.hidden = !isContact;
  modalEmailInput.required = isContact;
  document.getElementById("modal-lead-tag").textContent = isContact ? "LIÊN HỆ NGAY" : "YÊU CẦU BÁO GIÁ";
  document.getElementById("modal-lead-heading").textContent = isContact ? "Để lại email để được liên hệ" : "Điền thông tin để nhận ưu đãi";
  document.getElementById("modal-lead-submit").textContent = isContact ? "Gửi thông tin liên hệ" : "Gửi yêu cầu báo giá";
  leadModalOverlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
}
function closeLeadModal(){
  leadModalOverlay.classList.remove("is-open");
  document.body.style.overflow = "";
}

document.querySelectorAll(".js-open-lead-modal").forEach(btn => btn.addEventListener("click", () => openLeadModal(btn.dataset.leadMode)));
document.getElementById("lead-modal-close").addEventListener("click", closeLeadModal);
leadModalOverlay.addEventListener("click", (e) => {
  if(e.target === leadModalOverlay) closeLeadModal();
});
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape") closeLeadModal();
});

document.getElementById("modal-lead-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("modal-lead-name").value.trim();
  const phone = document.getElementById("modal-lead-phone").value.trim();
  const isContact = currentLeadMode === "contact";
  const email = isContact ? modalEmailInput.value.trim() : "";
  const category = isContact ? "" : modalCategorySelect.value;
  const message = isContact ? "" : document.getElementById("modal-lead-message").value.trim();

  if(!name || phone.length < 8 || (isContact && !email)){
    alert(isContact ? "Vui lòng nhập họ tên, số điện thoại và email hợp lệ." : "Vui lòng nhập họ tên và số điện thoại hợp lệ.");
    return;
  }

  const leads = getLeads();
  leads.push({
    id: leads.length ? Math.max(...leads.map(l => l.id)) + 1 : 1,
    name, phone, category, message, ...(isContact ? { email } : {}),
    createdAt: new Date().toISOString().slice(0, 10),
  });
  saveLeads(leads);

  const successBox = document.getElementById("modal-lead-success");
  successBox.classList.add("is-visible");
  document.getElementById("modal-lead-form").reset();
  setTimeout(() => {
    successBox.classList.remove("is-visible");
    closeLeadModal();
  }, 1600);
});

/* ---------- Hero: ảnh chạy full bề ngang đầu trang ---------- */
initPercentSlider({ trackId: "hero-slide-track", dotsId: "hero-dots", prevId: "hero-prev", nextId: "hero-next", autoMs: 3500 });

/* ---------- Hiệu ứng xuất hiện khi cuộn trang ---------- */
initScrollReveal();
