// js/admin/dashboard.js
import { initStorage, getProducts, getOrders, getFarms } from "../utils/storage.js";
import { requireFarmLogin, logout } from "../utils/auth.js";
import { formatVND, formatDate, orderStatusLabel } from "../utils/format.js";

initStorage();
const user = requireFarmLogin("../dang-nhap.html");

if(user){
  document.getElementById("admin-user-name").textContent = user.name;
  document.getElementById("admin-logout").addEventListener("click", () => {
    logout();
    window.location.href = "../index.html";
  });

  const products = getProducts().filter(p => p.farmId === user.farmId);
  const allOrders = getOrders();
  const orders = allOrders.filter(o => o.items.some(it => {
    const p = products.find(pp => pp.id === it.productId);
    return !!p;
  }));

  document.getElementById("stat-total-products").textContent = products.length;
  document.getElementById("stat-active-products").textContent = products.filter(p => p.stock > 0 && p.seasonStatus !== "out-of-season").length;
  document.getElementById("stat-out-products").textContent = products.filter(p => p.stock <= 0).length;
  document.getElementById("stat-pending-orders").textContent = orders.filter(o => o.status === "pending").length;
  document.getElementById("stat-shipping-orders").textContent = orders.filter(o => o.status === "shipping").length;

  // Doanh thu gian hàng = tổng tiền các đơn đã hoàn thành (chỉ tính phần sản phẩm của gian hàng này)
  const revenue = orders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => {
      const farmItemsTotal = o.items.reduce((s, it) => {
        const p = products.find(pp => pp.id === it.productId);
        return p ? s + p.price * it.quantity : s;
      }, 0);
      return sum + farmItemsTotal;
    }, 0);
  document.getElementById("stat-revenue").textContent = formatVND(revenue);

  // Doanh thu sau thuế = doanh thu gian hàng - thuế suất do nhà vườn/HTX tự khai báo
  // (lấy từ hồ sơ HTX, xem admin/thong-tin-htx.html — lưu trong localStorage cùng dữ liệu farms).
  const farm = getFarms().find(f => f.id === user.farmId);
  const taxRate = farm ? (farm.taxRate ?? 0) : 0;
  const netRevenue = revenue * (1 - taxRate / 100);
  document.getElementById("stat-taxrate-label").textContent = `Doanh thu sau thuế (${taxRate}%)`;
  document.getElementById("stat-net-revenue").textContent = formatVND(netRevenue);

  const recentBox = document.getElementById("recent-orders-body");
  const recent = [...orders].reverse().slice(0, 5);
  if(recent.length === 0){
    recentBox.innerHTML = `<tr><td colspan="4">Chưa có đơn hàng nào.</td></tr>`;
  }else{
    recentBox.innerHTML = recent.map(o => {
      const s = orderStatusLabel(o.status);
      return `<tr>
        <td>#${o.id}</td>
        <td>${formatDate(o.createdAt)}</td>
        <td>${formatVND(o.total)}</td>
        <td><span class="badge ${s.badgeClass}">${s.text}</span></td>
      </tr>`;
    }).join("");
  }
}
