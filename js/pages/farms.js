// js/pages/farms.js
import { initStorage, getPublicProducts, getFarms } from "../utils/storage.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { farmCardHtml } from "../components/farm-card.js";

initStorage();
renderHeader("farms");
renderFooter();

const products = getPublicProducts();
let farms = getFarms();
const grid = document.getElementById("farm-grid-full");
const typeFilter = document.getElementById("farm-type-filter");

function render(list){
  if(list.length === 0){
    grid.innerHTML = `<div class="state-box" style="grid-column:1/-1;"><div class="glyph">🌱</div><p>Chưa có nhà vườn nào.</p></div>`;
    return;
  }
  grid.innerHTML = list.map(f => {
    const count = products.filter(p => p.farmId === f.id).length;
    return farmCardHtml(f, count);
  }).join("");
}
render(farms);

// Khi hồ sơ được lưu ở trang quản trị đang mở trong tab khác, localStorage
// phát sự kiện storage. Nạp lại danh sách để trang HTX đang mở cũng cập nhật.
window.addEventListener("storage", (event) => {
  if(event.key !== "nsv_farms") return;
  farms = getFarms();
  const val = typeFilter.value;
  render(val === "all" ? farms : farms.filter(f => f.type === val));
});

typeFilter.addEventListener("change", () => {
  const val = typeFilter.value;
  render(val === "all" ? farms : farms.filter(f => f.type === val));
});
