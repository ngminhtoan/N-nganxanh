// js/admin/products.js
import { initStorage, getProducts, saveProducts } from "../utils/storage.js";
import { requireFarmLogin, logout } from "../utils/auth.js";
import { formatVND, seasonLabel } from "../utils/format.js";

initStorage();
const user = requireFarmLogin("../dang-nhap.html?role=farm");

if(user){
  document.getElementById("admin-user-name").textContent = user.name;
  document.getElementById("admin-logout").addEventListener("click", () => {
    logout();
    window.location.href = "../dang-nhap.html?role=farm";
  });

  const body = document.getElementById("admin-products-body");
  const searchInput = document.getElementById("admin-product-search");
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
  const approvalLabel = product => {
    if(product.approvalStatus === "pending") return `<span class="product-review-status is-pending">Chờ duyệt</span>${product.approvalNote ? `<small class="product-review-note">${escapeHtml(product.approvalNote)}</small>` : ""}`;
    if(product.approvalStatus === "rejected") return `<span class="product-review-status is-rejected">Cần chỉnh sửa</span>${product.approvalNote ? `<small class="product-review-note">${escapeHtml(product.approvalNote)}</small>` : ""}`;
    return `<span class="product-review-status is-approved">Đã duyệt</span>`;
  };

  function render(query = ""){
    let products = getProducts().filter(p => p.farmId === user.farmId);
    if(query.trim()){
      const q = query.trim().toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q));
    }

    if(products.length === 0){
      body.innerHTML = `<tr><td colspan="7">Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên.</td></tr>`;
      return;
    }

    body.innerHTML = products.map(p => {
      const season = seasonLabel(p.seasonStatus);
      return `
        <tr>
          <td>${p.name}</td>
          <td>${p.category}</td>
          <td>${p.priceType === "fixed" ? formatVND(p.price) + "/" + p.unit : p.priceType}</td>
          <td>${p.stock <= 0 ? '<span class="badge badge-stock-out">Hết hàng</span>' : p.stock + " " + p.unit}</td>
          <td><span class="badge ${season.badgeClass}">${season.text}</span></td>
          <td>${approvalLabel(p)}</td>
          <td class="row-actions">
            <a href="sua-san-pham.html?id=${p.id}">Sửa</a>
            <button type="button" class="danger js-delete" data-id="${p.id}">Xóa</button>
          </td>
        </tr>`;
    }).join("");

    body.querySelectorAll(".js-delete").forEach(btn => {
      btn.addEventListener("click", () => {
        if(!confirm("Xóa sản phẩm này khỏi gian hàng?")) return;
        const all = getProducts().filter(p => p.id !== Number(btn.dataset.id));
        saveProducts(all);
        render(searchInput.value);
      });
    });
  }

  render();
  searchInput.addEventListener("input", () => render(searchInput.value));
}
