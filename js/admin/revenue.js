// js/admin/revenue.js
// Doanh thu gian hàng: tổng hợp sản phẩm đã bán, tính doanh thu sau thuế
// và lưu lại từng lần "chốt doanh thu" vào localStorage (đóng vai trò cơ sở dữ liệu mô phỏng).

import { initStorage, getProducts, getOrders, getRevenueRecords, saveRevenueRecords } from "../utils/storage.js";
import { requireFarmLogin, logout } from "../utils/auth.js";
import { formatVND, formatDate, orderStatusLabel } from "../utils/format.js";

initStorage();
const user = requireFarmLogin("../dang-nhap.html?role=farm");

// Trạng thái được tính là "đã bán" — đơn đã hoàn tất, tiền chắc chắn về gian hàng.
const SOLD_STATUS = "completed";

if(user){
  document.getElementById("admin-user-name").textContent = user.name;
  document.getElementById("admin-logout").addEventListener("click", () => {
    logout();
    window.location.href = "../dang-nhap.html?role=farm";
  });

  const myProducts = getProducts().filter(p => p.farmId === user.farmId);
  const orders = getOrders().filter(o => o.status === SOLD_STATUS && o.items.some(it => myProducts.some(p => p.id === it.productId)));
  const salesByOrder = orders.map(order => {
    const date = String(order.createdAt || "");
    const soldItems = order.items.map(item => ({
      item,
      product: myProducts.find(product => product.id === item.productId),
    })).filter(entry => entry.product);
    return {
      year: Number(date.slice(0, 4)),
      month: Number(date.slice(5, 7)),
      gross: soldItems.reduce((sum, entry) => sum + entry.item.quantity * entry.product.price, 0),
      quantity: soldItems.reduce((sum, entry) => sum + entry.item.quantity, 0),
    };
  }).filter(sale => sale.year && sale.month >= 1 && sale.month <= 12);

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

  /* ---------- Thống kê doanh thu theo tháng và năm ---------- */
  const yearFilter = document.getElementById("rv-filter-year");
  const monthFilter = document.getElementById("rv-filter-month");
  const periodCaption = document.getElementById("rv-period-caption");
  const yearOptions = [...new Set([new Date().getFullYear(), ...salesByOrder.map(sale => sale.year)])]
    .sort((a, b) => b - a);
  yearFilter.innerHTML = yearOptions.map(year => "<option value=\"" + year + "\">" + year + "</option>").join("");
  const monthlyNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

  function renderPeriodStats(){
    const selectedYear = Number(yearFilter.value);
    const selectedMonth = monthFilter.value === "all" ? null : Number(monthFilter.value);
    const yearSales = salesByOrder.filter(sale => sale.year === selectedYear);
    const periodSales = selectedMonth
      ? yearSales.filter(sale => sale.month === selectedMonth)
      : yearSales;
    const periodGross = periodSales.reduce((sum, sale) => sum + sale.gross, 0);
    const periodOrderCount = periodSales.length;
    const periodProductCount = periodSales.reduce((sum, sale) => sum + sale.quantity, 0);

    document.getElementById("rv-period-gross").textContent = formatVND(periodGross);
    document.getElementById("rv-period-orders").textContent = periodOrderCount;
    document.getElementById("rv-period-products").textContent = periodProductCount;
    periodCaption.textContent = selectedMonth
      ? monthlyNames[selectedMonth - 1] + " năm " + selectedYear
      : "Cả năm " + selectedYear;

    const monthlyTotals = Array(12).fill(0);
    yearSales.forEach(sale => { monthlyTotals[sale.month - 1] += sale.gross; });
    const maxMonthly = Math.max(...monthlyTotals, 0);
    document.getElementById("rv-month-chart").innerHTML = monthlyTotals.map((total, index) => {
      const height = maxMonthly ? Math.max(total ? 6 : 0, Math.round(total / maxMonthly * 100)) : 0;
      const selectedClass = selectedMonth === index + 1 ? " is-selected" : "";
      return "<div class=\"revenue-month" + selectedClass + "\" title=\"" + monthlyNames[index] + ": " + formatVND(total) + "\">" +
        "<div class=\"revenue-month-value\">" + (total ? formatVND(total) : "—") + "</div>" +
        "<div class=\"revenue-month-track\"><span class=\"revenue-month-bar\" style=\"height:" + height + "%\"></span></div>" +
        "<span class=\"revenue-month-label\">T" + (index + 1) + "</span></div>";
    }).join("");
  }
  yearFilter.addEventListener("change", renderPeriodStats);
  monthFilter.addEventListener("change", renderPeriodStats);
  renderPeriodStats();

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
  const netPreview = document.getElementById("rv-net-preview");

  function computeNet(){
    const rate = 10;
    const tax = Math.round(grossRevenue * rate / 100);
    const net = grossRevenue - tax;
    netPreview.innerHTML = `
      <div class="summary-row"><span>Doanh thu (gian hàng đã bán)</span><span>${formatVND(grossRevenue)}</span></div>
      <div class="summary-row"><span>Thuế (${rate}%)</span><span>− ${formatVND(tax)}</span></div>
      <div class="summary-row total"><span>Doanh thu sau thuế</span><span>${formatVND(net)}</span></div>`;
    return { rate, tax, net };
  }
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
