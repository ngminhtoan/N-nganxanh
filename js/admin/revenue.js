// js/admin/revenue.js
// Doanh thu gian hàng: tổng hợp sản phẩm đã bán, tính doanh thu sau thuế
// và lưu lại từng lần "chốt doanh thu" vào localStorage (đóng vai trò cơ sở dữ liệu mô phỏng).

import { initStorage, getProducts, getOrders, getRevenueRecords, saveRevenueRecords } from "../utils/storage.js";
import { requireFarmLogin, logout } from "../utils/auth.js";
import { formatVND, formatDate, orderStatusLabel } from "../utils/format.js";

initStorage();
const user = requireFarmLogin("../dang-nhap.html");

// Trạng thái được tính là "đã bán" — đơn đã hoàn tất, tiền chắc chắn về gian hàng.
const SOLD_STATUS = "completed";

if(user){
  document.getElementById("admin-user-name").textContent = user.name;
  document.getElementById("admin-logout").addEventListener("click", () => {
    logout();
    window.location.href = "../index.html";
  });

  const myProducts = getProducts().filter(p => p.farmId === user.farmId);
  const orders = getOrders().filter(o => o.status === SOLD_STATUS && o.items.some(it => myProducts.some(p => p.id === it.productId)));

  /* ---------- Tổng hợp số lượng & doanh thu theo từng sản phẩm ---------- */
  const soldMap = new Map(); // productId -> { qty, revenue }
  orders.forEach(o => {
    o.items.forEach(it => {
      const p = myProducts.find(pp => pp.id === it.productId);
      if(!p) return;
      const entry = soldMap.get(p.id) || { product: p, qty: 0, revenue: 0 };
      entry.qty += it.quantity;
      entry.revenue += it.quantity * p.price;
      soldMap.set(p.id, entry);
    });
  });
  const soldList = [...soldMap.values()].sort((a, b) => b.revenue - a.revenue);
  const grossRevenue = soldList.reduce((sum, e) => sum + e.revenue, 0);

  document.getElementById("rv-gross-revenue").textContent = formatVND(grossRevenue);
  document.getElementById("rv-order-count").textContent = orders.length;
  document.getElementById("rv-product-sold-count").textContent = soldList.length;

  /* ---------- Bảng chi tiết sản phẩm đã bán ---------- */
  const body = document.getElementById("rv-products-body");
  if(soldList.length === 0){
    body.innerHTML = `<tr><td colspan="4">Chưa có sản phẩm nào được bán (đơn hoàn thành).</td></tr>`;
  }else{
    body.innerHTML = soldList.map(e => `
      <tr>
        <td>${e.product.name}</td>
        <td>${e.qty} ${e.product.unit}</td>
        <td>${formatVND(e.product.price)}/${e.product.unit}</td>
        <td><strong>${formatVND(e.revenue)}</strong></td>
      </tr>`).join("");
  }

  /* ---------- Tính & lưu doanh thu sau thuế ---------- */
  const taxInput = document.getElementById("rv-tax-rate");
  const netPreview = document.getElementById("rv-net-preview");

  function computeNet(){
    const rate = Math.min(100, Math.max(0, Number(taxInput.value) || 0));
    const tax = Math.round(grossRevenue * rate / 100);
    const net = grossRevenue - tax;
    netPreview.innerHTML = `
      <div class="summary-row"><span>Doanh thu (gian hàng đã bán)</span><span>${formatVND(grossRevenue)}</span></div>
      <div class="summary-row"><span>Thuế (${rate}%)</span><span>− ${formatVND(tax)}</span></div>
      <div class="summary-row total"><span>Doanh thu sau thuế</span><span>${formatVND(net)}</span></div>`;
    return { rate, tax, net };
  }
  taxInput.addEventListener("input", computeNet);
  computeNet();

  document.getElementById("rv-save-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const { rate, tax, net } = computeNet();

    const records = getRevenueRecords();
    records.push({
      id: records.length ? Math.max(...records.map(r => r.id)) + 1 : 1,
      farmId: user.farmId,
      grossRevenue,
      taxRate: rate,
      taxAmount: tax,
      netRevenue: net,
      orderCount: orders.length,
      savedAt: new Date().toISOString().slice(0, 10),
    });
    saveRevenueRecords(records);

    alert(`Đã lưu doanh thu sau thuế: ${formatVND(net)} (thuế suất ${rate}%) vào cơ sở dữ liệu.`);
    renderHistory();
  });

  /* ---------- Lịch sử các lần đã lưu ---------- */
  const historyBody = document.getElementById("rv-history-body");
  function renderHistory(){
    const myRecords = getRevenueRecords().filter(r => r.farmId === user.farmId).reverse();
    if(myRecords.length === 0){
      historyBody.innerHTML = `<tr><td colspan="6">Chưa có lần chốt doanh thu nào được lưu.</td></tr>`;
      return;
    }
    historyBody.innerHTML = myRecords.map(r => `
      <tr>
        <td>${formatDate(r.savedAt)}</td>
        <td>${formatVND(r.grossRevenue)}</td>
        <td>${r.taxRate}%</td>
        <td>${formatVND(r.taxAmount)}</td>
        <td><strong>${formatVND(r.netRevenue)}</strong></td>
        <td>${r.orderCount} đơn</td>
      </tr>`).join("");
  }
  renderHistory();
}
