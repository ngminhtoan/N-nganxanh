// Bảng điều khiển quản trị hệ thống Nông Sản Xanh (dữ liệu demo lưu trên trình duyệt).
import {
  initStorage, getFarms, saveFarms, getProducts, saveProducts, getUsers, saveUsers,
  getOrders, getItem, setItem, KEYS,
} from "../utils/storage.js";
import { requireAdminLogin, logout, getCurrentUser } from "../utils/auth.js";
import { formatVND, formatDate } from "../utils/format.js";

initStorage();
const admin = requireAdminLogin("dang-nhap.html");
const COMPLAINTS_KEY = "nsv_sadmin_complaints";
const SETTINGS_KEY = "nsv_sadmin_settings";
const statuses = {
  pending: { label: "Chờ xử lý", className: "sadmin-status-pending" },
  reviewing: { label: "Đang xác minh", className: "sadmin-status-warning" },
  resolved: { label: "Đã giải quyết", className: "sadmin-status" },
};
const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

if(admin){
  const currentUser = getCurrentUser();
  const nameEl = document.getElementById("sadmin-name");
  nameEl.textContent = admin.name || "Quản trị viên";
  document.getElementById("sadmin-logout").addEventListener("click", () => { logout(); window.location.href = "dang-nhap.html"; });
  document.getElementById("footer-year").textContent = new Date().getFullYear();
  document.getElementById("today-label").textContent = new Intl.DateTimeFormat("vi-VN", { weekday:"long", day:"numeric", month:"long", year:"numeric" }).format(new Date());

  let complaints = getItem(COMPLAINTS_KEY, null);
  if(!complaints){
    complaints = [
      { id:"KN-2408", orderId:"1002", customer:"Nguyễn Thị Lan", category:"Sản phẩm / chất lượng", message:"Xoài giao đến có vài quả bị dập, mong được hỗ trợ đổi sản phẩm.", date:"2026-11-05", status:"pending" },
      { id:"KN-2407", orderId:"1001", customer:"Trần Minh An", category:"Đóng gói / vận chuyển", message:"Kiện rau giao trễ hơn dự kiến, bao gói bị ẩm do quá trình vận chuyển.", date:"2026-11-03", status:"reviewing" },
      { id:"KN-2406", orderId:"—", customer:"Lê Thu Hà", category:"Nhà bán / dịch vụ", message:"Khách hàng cần xác minh lại thông tin chứng nhận của gian hàng.", date:"2026-10-29", status:"resolved" },
    ];
    setItem(COMPLAINTS_KEY, complaints);
  }
  const defaults = { siteName:"Nông Sản Xanh", supportEmail:"hotro@nongsanviet.vn", feeRate:5 };
  const settings = { ...defaults, ...getItem(SETTINGS_KEY, {}) };
  const allProducts = () => getProducts();
  const allFarms = () => getFarms();
  const allOrders = () => getOrders();
  const farmOwner = id => getUsers().find(user => user.type === "farm" && Number(user.farmId) === Number(id));
  const farmProductCount = (farmId, products = allProducts()) => products.filter(product => Number(product.farmId) === Number(farmId)).length;
  const initials = value => String(value || "NS").trim().split(/\s+/).slice(-2).map(part => part[0]).join("").toUpperCase();
  const standardsMarkup = standards => (standards || []).length ? `<div class="sadmin-cert-chips">${standards.map(value => `<span class="sadmin-cert-chip">${esc(value)}</span>`).join("")}</div>` : `<span class="sadmin-cert-empty">Chưa cập nhật</span>`;
  const farmMarkup = (farm, products) => `<div class="sadmin-farm-cell"><span class="sadmin-farm-avatar">${esc(initials(farm.name))}${farm.image ? `<img src="../${esc(farm.image)}" alt="Logo ${esc(farm.name)}" loading="lazy" onerror="this.remove()">` : ""}</span><span><strong>${esc(farm.name)}</strong><small>${esc(farm.type || "Nhà bán nông sản")}</small></span></div>`;
  const activeOrders = orders => orders.filter(order => !["cancelled", "canceled", "refunded"].includes(order.status));
  const orderLabel = status => ({ pending:"Chờ xác nhận", shipping:"Đang giao", completed:"Hoàn tất", cancelled:"Đã hủy", canceled:"Đã hủy", refunded:"Đã hoàn tiền" }[status] || status || "Khác");
  const drawBars = (target, orders) => {
    const configs = [ ["pending", "Chờ xác nhận"], ["shipping", "Đang giao"], ["completed", "Hoàn tất"], ["cancelled", "Đã hủy"] ];
    const maximum = Math.max(1, ...configs.map(([key]) => orders.filter(order => order.status === key || (key === "cancelled" && order.status === "canceled")).length));
    document.getElementById(target).innerHTML = configs.map(([key, label]) => {
      const count = orders.filter(order => order.status === key || (key === "cancelled" && order.status === "canceled")).length;
      return `<div class="sadmin-bar-row"><span>${label}</span><div class="sadmin-bar-track"><div class="sadmin-bar-fill" style="width:${count ? Math.max(5, count / maximum * 100) : 0}%"></div></div><strong>${count}</strong></div>`;
    }).join("");
  };

  function renderOverview(){
    const farms = allFarms(), products = allProducts(), orders = allOrders();
    const completed = orders.filter(order => order.status === "completed");
    document.getElementById("overview-farms").textContent = farms.length;
    document.getElementById("overview-products").textContent = products.length;
    document.getElementById("overview-orders").textContent = orders.length;
    document.getElementById("overview-revenue").textContent = formatVND(completed.reduce((sum, order) => sum + Number(order.total || 0), 0));
    drawBars("overview-order-bars", orders);
    document.getElementById("overview-order-summary").textContent = `${activeOrders(orders).length} đơn đang được theo dõi`;
    const pendingComplaints = complaints.filter(item => item.status === "pending").length;
    const farmWarnings = farms.reduce((sum, farm) => sum + (farm.warnings || []).length, 0);
    const pendingOrders = orders.filter(order => order.status === "pending").length;
    const pendingProducts = products.filter(product => product.approvalStatus === "pending").length;
    const attention = [
      ["◇", `<strong>${pendingProducts} sản phẩm</strong> đang chờ duyệt`, "products", pendingProducts],
      ["◷", `<strong>${pendingComplaints} khiếu nại</strong> đang chờ xử lý`, "complaints", pendingComplaints],
      ["⚑", `<strong>${farmWarnings} cảnh báo chất lượng</strong> đã ghi nhận`, "farms", farmWarnings],
      ["▤", `<strong>${pendingOrders} đơn hàng</strong> chờ xác nhận`, "reports", pendingOrders],
    ];
    document.getElementById("overview-attention").innerHTML = attention.map(([icon, message, section, count]) => `<div class="sadmin-attention-item"><span class="sadmin-attention-icon">${icon}</span><p>${message}</p>${Number(count) ? `<button type="button" data-go="${section}">Xem →</button>` : ""}</div>`).join("");
    document.getElementById("overview-farm-rows").innerHTML = farms.slice().sort((a,b) => b.id-a.id).slice(0,4).map(farm => `<tr><td>${farmMarkup(farm, products)}</td><td>${esc(farm.province || "Chưa cập nhật")}</td><td>${standardsMarkup(farm.standards)}</td><td>${farmProductCount(farm.id, products)}</td><td><span class="sadmin-status"><i></i>Đang hoạt động</span></td></tr>`).join("") || `<tr><td colspan="5" class="sadmin-empty-cell">Chưa có nhà bán nào.</td></tr>`;
  }

  function renderProductReviews(){
    const products = allProducts();
    const query = document.getElementById("product-review-search").value.trim().toLowerCase();
    const filter = document.getElementById("product-review-filter").value;
    const statusOf = product => product.approvalStatus || "approved";
    const pending = products.filter(product => statusOf(product) === "pending").length;
    document.getElementById("product-stat-pending").textContent = pending;
    document.getElementById("product-stat-approved").textContent = products.filter(product => statusOf(product) === "approved").length;
    document.getElementById("product-stat-rejected").textContent = products.filter(product => statusOf(product) === "rejected").length;
    document.getElementById("product-stat-total").textContent = products.length;
    document.getElementById("nav-product-count").textContent = pending;
    const farms = allFarms();
    const rows = products.filter(product => {
      const farm = farms.find(entry => Number(entry.id) === Number(product.farmId));
      const haystack = [product.name, product.category, product.origin, farm?.name, farm?.province].join(" ").toLowerCase();
      return (filter === "all" || statusOf(product) === filter) && (!query || haystack.includes(query));
    }).sort((a,b) => {
      const priority = { pending:0, rejected:1, approved:2 };
      return priority[statusOf(a)] - priority[statusOf(b)] || Number(b.id)-Number(a.id);
    });
    const body = document.getElementById("sadmin-products-body");
    body.innerHTML = rows.length ? rows.map(product => {
      const farm = farms.find(entry => Number(entry.id) === Number(product.farmId));
      const status = statusOf(product);
      const statusInfo = status === "pending"
        ? `<span class="sadmin-status sadmin-status-warning"><i></i>Chờ duyệt</span>`
        : status === "rejected"
          ? `<span class="sadmin-status sadmin-status-pending"><i></i>Cần chỉnh sửa</span><small class="sadmin-review-note">${esc(product.approvalNote || "Chưa có ghi chú")}</small>`
          : `<span class="sadmin-status"><i></i>Đã duyệt</span>`;
      const actions = status === "approved"
        ? `<span class="sadmin-cert-empty">Đang hiển thị</span>`
        : `<div class="sadmin-review-actions"><button type="button" class="sadmin-primary-button js-approve-product" data-id="${Number(product.id)}">Duyệt</button>${status === "pending" ? `<button type="button" class="sadmin-review-reject js-reject-product" data-id="${Number(product.id)}">Từ chối</button>` : ""}</div>`;
      const price = product.priceType === "fixed" || product.priceType === "market" ? `${formatVND(product.price)}/${esc(product.unit || "kg")}` : esc(product.priceType || "Liên hệ");
      return `<tr><td><div class="sadmin-product-cell"><span class="sadmin-product-icon">◇</span><span><strong>${esc(product.name)}</strong><small>${esc(product.category || "Nông sản")}</small></span></div></td><td>${farm ? farmMarkup(farm, products) : `<span class="sadmin-cert-empty">Nhà bán #${Number(product.farmId) || "—"}</span>`}</td><td>${esc(product.origin || farm?.province || "Chưa cập nhật")}<br><small>${esc((product.standards || []).join(", ") || "Chưa có chứng nhận")}</small></td><td><strong>${price}</strong><br><small>${Number(product.stock) || 0} ${esc(product.unit || "kg")}</small></td><td>${statusInfo}</td><td>${actions}</td></tr>`;
    }).join("") : `<tr><td colspan="6" class="sadmin-empty-cell">Không có sản phẩm phù hợp trạng thái này.</td></tr>`;
    document.getElementById("product-review-count").textContent = `Hiển thị ${rows.length} / ${products.length} sản phẩm`;
    body.querySelectorAll(".js-approve-product").forEach(button => button.addEventListener("click", () => {
      const all = allProducts(), product = all.find(entry => Number(entry.id) === Number(button.dataset.id));
      if(!product) return;
      product.approvalStatus = "approved"; product.approvalNote = ""; product.approvedAt = new Date().toISOString();
      saveProducts(all); renderProductReviews(); renderOverview();
    }));
    body.querySelectorAll(".js-reject-product").forEach(button => button.addEventListener("click", () => {
      const product = allProducts().find(entry => Number(entry.id) === Number(button.dataset.id));
      if(!product) return;
      const note = prompt(`Nhập lý do từ chối sản phẩm “${product.name}” để nhà bán biết nội dung cần chỉnh sửa:`, product.approvalNote || "");
      if(note === null) return;
      const all = allProducts(), target = all.find(entry => Number(entry.id) === Number(button.dataset.id));
      target.approvalStatus = "rejected"; target.approvalNote = note.trim() || "Vui lòng kiểm tra và bổ sung thông tin sản phẩm.";
      saveProducts(all); renderProductReviews(); renderOverview();
    }));
  }

  function renderFarms(){
    const farms = allFarms(), products = allProducts();
    const query = document.getElementById("farm-search").value.trim().toLowerCase();
    const filter = document.getElementById("farm-filter").value;
    const warningsTotal = farms.reduce((sum, farm) => sum + (farm.warnings || []).length, 0);
    document.getElementById("farm-stat-total").textContent = farms.length;
    document.getElementById("farm-stat-certified").textContent = farms.filter(farm => (farm.standards || []).length).length;
    document.getElementById("farm-stat-active").textContent = farms.filter(farm => farmProductCount(farm.id, products)).length;
    document.getElementById("farm-stat-warnings").textContent = warningsTotal;
    document.getElementById("nav-farm-count").textContent = farms.length;
    const filtered = farms.filter(farm => {
      const owner = farmOwner(farm.id);
      const haystack = [farm.name, farm.type, farm.province, farm.address, owner?.email].join(" ").toLowerCase();
      if(query && !haystack.includes(query)) return false;
      if(filter === "certified" && !(farm.standards || []).length) return false;
      if(filter === "warnings" && !(farm.warnings || []).length) return false;
      return true;
    });
    const body = document.getElementById("sadmin-farms-body");
    body.innerHTML = filtered.length ? filtered.map(farm => {
      const owner = farmOwner(farm.id), warnings = farm.warnings || [];
      return `<tr><td>${farmMarkup(farm, products)}</td><td>${esc(farm.address || farm.province || "Chưa cập nhật")}<br><small>${esc(owner?.email || farm.phone || "Chưa có thông tin liên hệ")}</small></td><td>${standardsMarkup(farm.standards)}</td><td><strong>${farmProductCount(farm.id, products)}</strong></td><td>${warnings.length ? `<span class="sadmin-status sadmin-status-warning"><i></i>${warnings.length} cảnh báo</span>` : `<span class="sadmin-cert-empty">Không có</span>`}</td><td><button type="button" class="sadmin-row-button js-farm-detail" data-id="${Number(farm.id)}">Chi tiết</button></td></tr><tr class="sadmin-farm-detail-row" id="farm-detail-${Number(farm.id)}" hidden><td colspan="6"><div class="sadmin-detail-panel"><div><strong>Giới thiệu</strong><p>${esc(farm.description || "Chưa có mô tả.")}</p><span>Địa chỉ: ${esc(farm.address || farm.province || "Chưa cập nhật")}</span><span>Tiêu chuẩn: ${esc((farm.standards || []).join(", ") || "Chưa cập nhật")}</span></div><div><strong>Ghi chú nội bộ</strong><textarea class="sadmin-note-input" data-id="${Number(farm.id)}" rows="2" placeholder="Ghi chú để quản trị viên theo dõi…">${esc(farm.adminNote || "")}</textarea><button type="button" class="sadmin-primary-button js-save-farm-note" data-id="${Number(farm.id)}">Lưu ghi chú</button></div></div></td></tr>`;
    }).join("") : `<tr><td colspan="6" class="sadmin-empty-cell">Không tìm thấy nhà bán phù hợp.</td></tr>`;
    document.getElementById("farm-table-count").textContent = `Hiển thị ${filtered.length} / ${farms.length} nhà bán`;
    body.querySelectorAll(".js-farm-detail").forEach(button => button.addEventListener("click", () => { const row = document.getElementById(`farm-detail-${button.dataset.id}`); row.hidden = !row.hidden; button.textContent = row.hidden ? "Chi tiết" : "Thu gọn"; }));
    body.querySelectorAll(".js-save-farm-note").forEach(button => button.addEventListener("click", () => {
      const farmList = allFarms(), farm = farmList.find(item => Number(item.id) === Number(button.dataset.id));
      if(!farm) return;
      farm.adminNote = body.querySelector(`.sadmin-note-input[data-id="${button.dataset.id}"]`).value.trim();
      saveFarms(farmList); button.textContent = "Đã lưu ✓"; setTimeout(() => { if(button.isConnected) button.textContent = "Lưu ghi chú"; }, 1500);
    }));
  }

  function renderComplaints(){
    const query = document.getElementById("complaint-search").value.trim().toLowerCase();
    const filter = document.getElementById("complaint-filter").value;
    document.getElementById("complaint-stat-total").textContent = complaints.length;
    document.getElementById("complaint-stat-open").textContent = complaints.filter(item => item.status === "pending").length;
    document.getElementById("complaint-stat-review").textContent = complaints.filter(item => item.status === "reviewing").length;
    document.getElementById("complaint-stat-done").textContent = complaints.filter(item => item.status === "resolved").length;
    document.getElementById("nav-complaint-count").textContent = complaints.filter(item => item.status === "pending").length;
    const shown = complaints.filter(item => {
      const haystack = [item.id, item.orderId, item.customer, item.category, item.message].join(" ").toLowerCase();
      return (!query || haystack.includes(query)) && (filter === "all" || item.status === filter);
    });
    document.getElementById("complaints-list").innerHTML = shown.map(item => {
      const status = statuses[item.status] || statuses.pending;
      return `<article class="sadmin-complaint"><div class="sadmin-complaint-top"><div><span class="sadmin-complaint-id">${esc(item.id)} · Đơn #${esc(item.orderId || "—")}</span><h3>${esc(item.category)} — ${esc(item.customer)}</h3><div class="sadmin-complaint-meta"><span>Tiếp nhận: ${esc(formatDate(item.date))}</span><span>HTX/nhà vườn: ${esc(item.targetFarmName || "Chưa xác định")}</span></div></div><div class="sadmin-complaint-actions"><span class="sadmin-status ${status.className}"><i></i>${status.label}</span><select class="js-complaint-status" data-id="${esc(item.id)}" aria-label="Cập nhật trạng thái khiếu nại"><option value="pending" ${item.status === "pending" ? "selected" : ""}>Chờ xử lý</option><option value="reviewing" ${item.status === "reviewing" ? "selected" : ""}>Đang xác minh</option><option value="resolved" ${item.status === "resolved" ? "selected" : ""}>Đã giải quyết</option></select></div></div><p>${esc(item.message)}</p>${item.farmReply ? `<div class="sadmin-complaint-reply"><strong>Phản hồi HTX/nhà vườn</strong><p>${esc(item.farmReply)}</p></div>` : ""}${item.reply ? `<div class="sadmin-complaint-reply"><strong>Phản hồi của quản trị viên</strong><p>${esc(item.reply)}</p></div>` : ""}<form class="sadmin-complaint-reply-form" data-id="${esc(item.id)}"><label for="reply-${esc(item.id)}">${item.reply ? "Cập nhật phản hồi" : "Trả lời khiếu nại"}</label><textarea id="reply-${esc(item.id)}" name="reply" rows="2" required placeholder="Nhập nội dung phản hồi…">${esc(item.reply || "")}</textarea><button class="sadmin-primary-button" type="submit">${item.reply ? "Lưu phản hồi" : "Gửi phản hồi"}</button></form></article>`;
    }).join("");
    document.getElementById("complaint-empty").style.display = shown.length ? "none" : "block";
    document.querySelectorAll(".js-complaint-status").forEach(select => select.addEventListener("change", () => {
      const complaint = complaints.find(item => item.id === select.dataset.id);
      if(!complaint) return;
      complaint.status = select.value; setItem(COMPLAINTS_KEY, complaints); renderComplaints(); renderOverview();
    }));
    document.querySelectorAll(".sadmin-complaint-reply-form").forEach(form => form.addEventListener("submit", event => {
      event.preventDefault();
      const complaint = complaints.find(item => item.id === form.dataset.id);
      const reply = String(new FormData(form).get("reply") || "").trim();
      if(!complaint || !reply) return;
      complaint.reply = reply;
      complaint.repliedAt = new Date().toISOString().slice(0, 10);
      setItem(COMPLAINTS_KEY, complaints);
      renderComplaints();
    }));
  }

  window.addEventListener("storage", event => {
    if(event.key !== COMPLAINTS_KEY) return;
    complaints = getItem(COMPLAINTS_KEY, []);
    renderComplaints();
    renderOverview();
  });

  function filteredOrders(){
    const period = document.getElementById("report-period").value;
    const now = new Date();
    return allOrders().filter(order => {
      if(order.status !== "completed") return false;
      const date = new Date(`${order.createdAt || ""}T00:00:00`);
      if(Number.isNaN(date.getTime())) return period === "all";
      if(period === "year") return date.getFullYear() === now.getFullYear();
      if(period === "month") return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
      return true;
    });
  }
  function renderReports(){
    const orders = filteredOrders(), revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const quantity = orders.reduce((sum, order) => sum + (order.items || []).reduce((lineSum, item) => lineSum + Number(item.quantity || 0), 0), 0);
    const period = document.getElementById("report-period").value, now = new Date();
    document.getElementById("report-period-label").textContent = period === "year" ? `Năm ${now.getFullYear()}` : period === "month" ? `Tháng ${now.getMonth()+1}/${now.getFullYear()}` : "Tổng hợp mọi thời điểm";
    document.getElementById("report-revenue").textContent = formatVND(revenue);
    document.getElementById("report-orders").textContent = orders.length;
    document.getElementById("report-quantity").textContent = quantity;
    document.getElementById("report-average").textContent = formatVND(orders.length ? revenue / orders.length : 0);
    drawBars("report-order-bars", allOrders());
    const products = allProducts(), categories = new Map();
    products.forEach(product => { const category = product.category || "Nông sản khác"; categories.set(category, (categories.get(category) || 0) + 1); });
    const categoryRows = [...categories.entries()].sort((a,b) => b[1]-a[1]).slice(0,6), maxCategory = Math.max(1,...categoryRows.map(([,count])=>count));
    document.getElementById("report-categories").innerHTML = categoryRows.map(([name,count]) => `<div class="sadmin-category-row"><span>${esc(name)}</span><div class="sadmin-category-track"><i style="width:${count/maxCategory*100}%"></i></div><strong>${count}</strong></div>`).join("") || `<p class="sadmin-cert-empty">Chưa có dữ liệu sản phẩm.</p>`;
    const farms = allFarms();
    const salesByFarm = new Map(farms.map(farm => [Number(farm.id), { quantity:0, revenue:0 }]));
    orders.forEach(order => (order.items || []).forEach(item => {
      const product = products.find(entry => Number(entry.id) === Number(item.productId));
      if(!product || !salesByFarm.has(Number(product.farmId))) return;
      const sales = salesByFarm.get(Number(product.farmId));
      sales.quantity += Number(item.quantity || 0);
      sales.revenue += Number(item.quantity || 0) * Number(product.price || 0);
    }));
    const rows = farms.map(farm => ({ farm, ...(salesByFarm.get(Number(farm.id)) || {quantity:0,revenue:0}) })).sort((a,b) => b.revenue-a.revenue);
    document.getElementById("report-farm-rows").innerHTML = rows.map(({farm,quantity:units,revenue:sales}) => `<tr><td>${farmMarkup(farm,products)}</td><td>${esc(farm.province || "—")}</td><td>${farmProductCount(farm.id,products)}</td><td>${units}</td><td><strong>${formatVND(sales)}</strong></td></tr>`).join("") || `<tr><td colspan="5" class="sadmin-empty-cell">Chưa có dữ liệu nhà bán.</td></tr>`;
  }

  function renderSettings(){
    const profile = getCurrentUser() || admin;
    document.getElementById("setting-admin-name").value = profile.name || "";
    document.getElementById("setting-admin-email").value = profile.email || "";
    document.getElementById("setting-admin-phone").value = profile.phone || "";
    document.getElementById("setting-session-email").textContent = profile.email || "—";
    document.getElementById("setting-site-name").value = settings.siteName;
    document.getElementById("setting-support-email").value = settings.supportEmail;
    document.getElementById("setting-fee-rate").value = settings.feeRate;
  }
  document.getElementById("settings-profile-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget), email = String(form.get("email")).trim().toLowerCase();
    const users = getUsers(), target = users.find(user => Number(user.id) === Number(currentUser.id));
    const collision = users.some(user => user.email.toLowerCase() === email && Number(user.id) !== Number(currentUser.id));
    const message = document.getElementById("settings-profile-message");
    if(collision){ message.textContent = "Email này đã được tài khoản khác sử dụng."; message.style.color = "#aa5952"; return; }
    if(!target){ message.textContent = "Không tìm thấy tài khoản quản trị."; message.style.color = "#aa5952"; return; }
    target.name = String(form.get("name")).trim(); target.email = email; target.phone = String(form.get("phone")).trim();
    saveUsers(users); const { password: _password, ...safeUser } = target; setItem(KEYS.CURRENT_USER, safeUser);
    nameEl.textContent = safeUser.name; document.getElementById("setting-session-email").textContent = safeUser.email;
    message.textContent = "Đã lưu hồ sơ."; message.style.color = "";
  });
  document.getElementById("settings-password-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget), message = document.getElementById("settings-password-message");
    const users = getUsers(), target = users.find(user => Number(user.id) === Number(currentUser.id));
    if(!target || target.password !== form.get("currentPassword")){ message.textContent = "Mật khẩu hiện tại không đúng."; message.style.color = "#aa5952"; return; }
    if(String(form.get("newPassword")).length < 6){ message.textContent = "Mật khẩu mới cần ít nhất 6 ký tự."; message.style.color = "#aa5952"; return; }
    if(form.get("newPassword") !== form.get("confirmPassword")){ message.textContent = "Mật khẩu nhập lại chưa khớp."; message.style.color = "#aa5952"; return; }
    target.password = String(form.get("newPassword")); saveUsers(users); event.currentTarget.reset(); message.textContent = "Đã cập nhật mật khẩu."; message.style.color = "";
  });
  document.getElementById("settings-system-form").addEventListener("submit", event => {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    settings.siteName = String(form.get("siteName")).trim(); settings.supportEmail = String(form.get("supportEmail")).trim(); settings.feeRate = Number(form.get("feeRate"));
    setItem(SETTINGS_KEY, settings);
    const message = document.getElementById("settings-system-message"); message.textContent = "Đã lưu cấu hình."; setTimeout(() => { if(message.isConnected) message.textContent = ""; }, 2000);
  });
  const sections = { overview:"Tổng quan", farms:"Nhà bán nông sản", products:"Duyệt sản phẩm", complaints:"Quản lý khiếu nại", reports:"Báo cáo thống kê", settings:"Cấu hình & bảo mật" };
  document.querySelectorAll(".sadmin-nav [data-section]").forEach(button => button.addEventListener("click", () => {
    const key = button.dataset.section;
    document.querySelectorAll(".sadmin-nav [data-section]").forEach(item => item.classList.toggle("is-active", item === button));
    document.querySelectorAll(".sadmin-section").forEach(section => section.classList.toggle("is-visible", section.id === `section-${key}`));
    document.getElementById("breadcrumb-current").textContent = sections[key];
    if(key === "overview") renderOverview(); if(key === "farms") renderFarms(); if(key === "products") renderProductReviews(); if(key === "complaints") renderComplaints(); if(key === "reports") renderReports(); if(key === "settings") renderSettings();
  }));
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-go]");
    if(button) document.querySelector(`.sadmin-nav [data-section="${button.dataset.go}"]`)?.click();
  });
  document.getElementById("farm-search").addEventListener("input", renderFarms);
  document.getElementById("farm-filter").addEventListener("change", renderFarms);
  document.getElementById("product-review-search").addEventListener("input", renderProductReviews);
  document.getElementById("product-review-filter").addEventListener("change", renderProductReviews);
  document.getElementById("complaint-search").addEventListener("input", renderComplaints);
  document.getElementById("complaint-filter").addEventListener("change", renderComplaints);
  document.getElementById("report-period").addEventListener("change", renderReports);
  renderOverview(); renderFarms(); renderProductReviews(); renderComplaints(); renderReports();
}
