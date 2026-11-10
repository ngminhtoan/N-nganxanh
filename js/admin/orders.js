// js/admin/orders.js
import { initStorage, getProducts, getOrders, saveOrders } from "../utils/storage.js";
import { requireFarmLogin, logout } from "../utils/auth.js";
import { formatVND, formatDate, orderStatusLabel } from "../utils/format.js";

initStorage();
const user = requireFarmLogin("../dang-nhap.html?role=farm");

const NEXT_STATUS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipping", "cancelled"],
  shipping: ["completed"],
  completed: [],
  cancelled: [],
};

if(user){
  document.getElementById("admin-user-name").textContent = user.name;
  document.getElementById("admin-logout").addEventListener("click", () => {
    logout();
    window.location.href = "../dang-nhap.html?role=farm";
  });

  const myProducts = getProducts().filter(p => p.farmId === user.farmId);
  const body = document.getElementById("admin-orders-body");

  function render(){
    const orders = getOrders().filter(o => o.items.some(it => myProducts.some(p => p.id === it.productId)));

    if(orders.length === 0){
      body.innerHTML = `<tr><td colspan="7">Chưa có đơn hàng nào chứa sản phẩm của bạn.</td></tr>`;
      return;
    }

    body.innerHTML = [...orders].reverse().map(o => {
      const s = orderStatusLabel(o.status);
      const myItems = o.items.filter(it => myProducts.some(p => p.id === it.productId));
      const itemsLabel = myItems.map(it => {
        const p = myProducts.find(pp => pp.id === it.productId);
        return `${p.name} ×${it.quantity}`;
      }).join(", ");
      const nextOptions = NEXT_STATUS[o.status] || [];

      return `
        <tr>
          <td>#${o.id}</td>
          <td>${o.customerName}<br><span style="color:var(--color-ink-soft);font-size:.8rem;">${o.phone}</span></td>
          <td>${itemsLabel}</td>
          <td>${formatVND(o.total)}</td>
          <td>${formatDate(o.createdAt)}</td>
          <td><span class="badge ${s.badgeClass}">${s.text}</span></td>
          <td>
            ${nextOptions.length > 0 ? `
            <select class="status-select js-status" data-id="${o.id}">
              <option value="">Cập nhật...</option>
              ${nextOptions.map(ns => `<option value="${ns}">${orderStatusLabel(ns).text}</option>`).join("")}
            </select>` : "—"}
          </td>
        </tr>`;
    }).join("");

    body.querySelectorAll(".js-status").forEach(select => {
      select.addEventListener("change", () => {
        if(!select.value) return;
        const orders = getOrders();
        const order = orders.find(o => o.id === Number(select.dataset.id));
        order.status = select.value;
        saveOrders(orders);
        render();
      });
    });
  }

  render();
}
