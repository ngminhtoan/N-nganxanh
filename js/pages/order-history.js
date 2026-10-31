// js/pages/order-history.js
import { initStorage, getOrders, getProducts } from "../utils/storage.js";
import { getCurrentUser, requireLogin } from "../utils/auth.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { formatVND, formatDate, orderStatusLabel } from "../utils/format.js";

initStorage();
renderHeader("");
renderFooter();

if(requireLogin("dang-nhap.html")){
  const user = getCurrentUser();
  const products = getProducts();
  const orders = getOrders().filter(o => o.userId === user.id).reverse();
  const body = document.getElementById("order-history-body");
  const emptyState = document.getElementById("order-history-empty");
  const tableWrap = document.getElementById("order-history-table-wrap");

  if(orders.length === 0){
    tableWrap.style.display = "none";
    emptyState.style.display = "block";
  }else{
    tableWrap.style.display = "block";
    emptyState.style.display = "none";

    body.innerHTML = orders.map(o => {
      const s = orderStatusLabel(o.status);
      const itemsHtml = o.items.map(it => {
        const p = products.find(pp => pp.id === it.productId);
        return `<div class="order-review-item"><span>${p ? p.name : "Sản phẩm đã bị xóa"} × ${it.quantity}</span></div>`;
      }).join("");

      return `
        <tr>
          <td>#${o.id}</td>
          <td>${formatDate(o.createdAt)}</td>
          <td>${o.items.length} sản phẩm</td>
          <td>${formatVND(o.total)}</td>
          <td><span class="badge ${s.badgeClass}">${s.text}</span></td>
          <td><button type="button" class="order-detail-toggle" data-id="${o.id}">Xem chi tiết</button></td>
        </tr>
        <tr class="order-detail-row" id="detail-${o.id}">
          <td colspan="6">
            <strong>Người nhận:</strong> ${o.customerName} · ${o.phone}<br>
            <strong>Địa chỉ:</strong> ${o.address}<br>
            ${o.note ? `<strong>Ghi chú:</strong> ${o.note}<br>` : ""}
            <div style="margin-top:10px;">${itemsHtml}</div>
          </td>
        </tr>`;
    }).join("");

    body.querySelectorAll(".order-detail-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        document.getElementById(`detail-${btn.dataset.id}`).classList.toggle("is-open");
      });
    });
  }
}
