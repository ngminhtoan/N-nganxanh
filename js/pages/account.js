// js/pages/account.js
import { initStorage, getOrders, getProducts, getFarms, getItem, setItem } from "../utils/storage.js";
import { getCurrentUser, requireLogin, logout } from "../utils/auth.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { formatVND, formatDate, orderStatusLabel } from "../utils/format.js";

const COMPLAINTS_KEY = "nsv_sadmin_complaints";
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char]);

initStorage();
renderHeader("");
renderFooter();

if(getCurrentUser()?.type === "admin"){
  window.location.replace("sadmin/index.html");
}else if(getCurrentUser()?.type === "farm"){
  window.location.replace("admin/index.html");
}else if(requireLogin("dang-nhap.html")){
  const user = getCurrentUser();

  document.getElementById("acc-name").textContent = user.name;
  document.getElementById("info-email").textContent = user.email;
  document.getElementById("info-phone").textContent = user.phone || "—";
  document.getElementById("info-address").textContent = user.address || "—";

  const farmLink = document.getElementById("farm-admin-link");
  if(user.type === "farm"){
    farmLink.style.display = "inline-flex";
  }else{
    farmLink.style.display = "none";
  }

  const orders = getOrders().filter(o => o.userId === user.id).slice(-3).reverse();
  const recentBox = document.getElementById("recent-orders");
  if(orders.length === 0){
    recentBox.innerHTML = `<p>Bạn chưa có đơn hàng nào. <a href="san-pham.html">Mua sắm ngay</a></p>`;
  }else{
    recentBox.innerHTML = orders.map(o => {
      const s = orderStatusLabel(o.status);
      return `
        <div class="info-row">
          <span>#${o.id} · ${formatDate(o.createdAt)}</span>
          <span><span class="badge ${s.badgeClass}">${s.text}</span> · ${formatVND(o.total)}</span>
        </div>`;
    }).join("");
  }

  const farmSelect = document.getElementById("customer-complaint-farm");
  const orderSelect = document.getElementById("customer-complaint-order");
  const farms = getFarms();
  const customerOrders = getOrders().filter(order => Number(order.userId) === Number(user.id));
  farmSelect.insertAdjacentHTML("beforeend", farms.map(farm => `<option value="${farm.id}">${escapeHtml(farm.name)}</option>`).join(""));
  orderSelect.insertAdjacentHTML("beforeend", customerOrders.map(order => `<option value="${order.id}">#${escapeHtml(order.id)} · ${escapeHtml(formatDate(order.createdAt))}</option>`).join(""));
  const complaintForm = document.getElementById("customer-complaint-form");
  const complaintNote = document.getElementById("customer-complaint-note");
  const complaintHistory = document.getElementById("customer-complaint-history");

  function renderCustomerComplaints(){
    const ownComplaints = getItem(COMPLAINTS_KEY, []).filter(item => Number(item.customerId) === Number(user.id)).reverse();
    if(!ownComplaints.length){
      complaintHistory.innerHTML = `<p class="customer-complaint-history-empty">Bạn chưa gửi khiếu nại nào.</p>`;
      return;
    }
    complaintHistory.innerHTML = `<h3>Khiếu nại đã gửi</h3>` + ownComplaints.map(item => {
      const status = { pending:"Chờ xử lý", reviewing:"Đang xác minh", resolved:"Đã giải quyết" }[item.status] || "Chờ xử lý";
      const responses = [
        item.farmReply ? `<p><strong>HTX / Nhà vườn:</strong> ${escapeHtml(item.farmReply)}</p>` : "",
        item.reply ? `<p><strong>Quản trị viên:</strong> ${escapeHtml(item.reply)}</p>` : "",
      ].filter(Boolean).join("");
      return `<article class="customer-complaint-item"><div><strong>${escapeHtml(item.category)}</strong><span>${escapeHtml(item.targetFarmName || "HTX / Nhà vườn")} · ${escapeHtml(formatDate(item.date))} · ${status}</span></div><p>${escapeHtml(item.message)}</p>${responses ? `<div class="customer-complaint-responses">${responses}</div>` : ""}</article>`;
    }).join("");
  }
  renderCustomerComplaints();
  orderSelect.addEventListener("change", () => {
    const order = customerOrders.find(item => String(item.id) === orderSelect.value);
    if(!order){
      farmSelect.value = "";
      return;
    }
    const productIds = order.items.map(item => Number(item.productId));
    const orderFarmIds = [...new Set(getProducts()
      .filter(product => productIds.includes(Number(product.id)))
      .map(product => Number(product.farmId)))];
    farmSelect.value = orderFarmIds.length ? String(orderFarmIds[0]) : "";
    if(orderFarmIds.length > 1){
      complaintNote.textContent = "Đơn này có nhiều HTX/nhà vườn. Đã chọn đơn vị đầu tiên; bạn có thể đổi sang đơn vị liên quan.";
      complaintNote.classList.remove("is-error");
    }else{
      complaintNote.textContent = "Đã tự động chọn HTX/nhà vườn theo đơn hàng.";
      complaintNote.classList.remove("is-error");
    }
  });
  window.addEventListener("storage", event => {
    if(event.key === COMPLAINTS_KEY) renderCustomerComplaints();
  });

  complaintForm.addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(complaintForm);
    const farmId = Number(form.get("farmId"));
    const orderId = String(form.get("orderId") || "").trim();
    const message = String(form.get("message") || "").trim();
    const farm = farms.find(item => Number(item.id) === farmId);
    if(!farm || !message){
      complaintNote.textContent = "Vui lòng chọn HTX/nhà vườn và nhập nội dung phản ánh.";
      complaintNote.classList.add("is-error");
      return;
    }
    if(orderId){
      const order = getOrders().find(item => String(item.id) === orderId && Number(item.userId) === Number(user.id));
      const farmProductIds = getProducts().filter(product => Number(product.farmId) === farmId).map(product => Number(product.id));
      if(!order || !order.items.some(item => farmProductIds.includes(Number(item.productId)))){
        complaintNote.textContent = "Mã đơn không hợp lệ hoặc không thuộc HTX/nhà vườn đã chọn.";
        complaintNote.classList.add("is-error");
        return;
      }
    }
    const complaints = getItem(COMPLAINTS_KEY, []);
    complaints.unshift({
      id:`KN-${String(Date.now()).slice(-8)}`,
      orderId:orderId || "—",
      customer:user.name,
      customerId:user.id,
      targetFarmId:farm.id,
      targetFarmName:farm.name,
      category:String(form.get("category")),
      message,
      date:new Date().toISOString().slice(0, 10),
      status:"pending",
      reply:"",
      farmReply:"",
    });
    setItem(COMPLAINTS_KEY, complaints);
    complaintForm.reset();
    complaintNote.textContent = "Đã gửi khiếu nại đến HTX/nhà vườn và quản trị viên sàn.";
    complaintNote.classList.remove("is-error");
    renderCustomerComplaints();
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    logout();
    window.location.href = "index.html";
  });
}
