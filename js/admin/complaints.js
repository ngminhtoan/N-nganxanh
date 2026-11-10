import { initStorage, getItem, setItem } from "../utils/storage.js";
import { requireFarmLogin, logout } from "../utils/auth.js";
import { formatDate } from "../utils/format.js";

initStorage();
const user = requireFarmLogin("../dang-nhap.html?role=farm");
const COMPLAINTS_KEY = "nsv_sadmin_complaints";
const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char]);
const statusMeta = {
  pending:{ label:"Chờ xử lý", className:"complaint-status-pending" },
  reviewing:{ label:"Đang xác minh", className:"complaint-status-reviewing" },
  resolved:{ label:"Đã giải quyết", className:"complaint-status-resolved" },
};

if(user){
  document.getElementById("admin-user-name").textContent = user.name;
  document.getElementById("admin-logout").addEventListener("click", () => {
    logout();
    window.location.href = "../dang-nhap.html?role=farm";
  });

  const list = document.getElementById("farm-complaints-list");
  const empty = document.getElementById("farm-complaints-empty");

  function render(){
    const complaints = getItem(COMPLAINTS_KEY, [])
      .filter(item => Number(item.targetFarmId) === Number(user.farmId))
      .reverse();
    empty.hidden = complaints.length > 0;
    list.innerHTML = complaints.map(item => {
      const status = statusMeta[item.status] || statusMeta.pending;
      return `<article class="farm-complaint-card">
        <header class="farm-complaint-head">
          <div><span class="farm-complaint-id">${esc(item.id)} · Đơn #${esc(item.orderId || "—")}</span><h2>${esc(item.category)} — ${esc(item.customer)}</h2><small>Tiếp nhận: ${esc(formatDate(item.date))}</small></div>
          <label class="farm-complaint-status ${status.className}"><span>Trạng thái</span><select class="js-farm-complaint-status" data-id="${esc(item.id)}" aria-label="Cập nhật trạng thái"><option value="pending" ${item.status === "pending" ? "selected" : ""}>Chờ xử lý</option><option value="reviewing" ${item.status === "reviewing" ? "selected" : ""}>Đang xác minh</option><option value="resolved" ${item.status === "resolved" ? "selected" : ""}>Đã giải quyết</option></select></label>
        </header>
        <p class="farm-complaint-message">${esc(item.message)}</p>
        ${item.reply ? `<div class="farm-complaint-response"><strong>Phản hồi quản trị viên</strong><p>${esc(item.reply)}</p></div>` : ""}
        ${item.farmReply ? `<div class="farm-complaint-response"><strong>Phản hồi HTX/nhà vườn</strong><p>${esc(item.farmReply)}</p></div>` : ""}
        <form class="farm-complaint-reply-form" data-id="${esc(item.id)}"><label for="farm-reply-${esc(item.id)}">${item.farmReply ? "Cập nhật phản hồi của bạn" : "Trả lời khách hàng"}</label><textarea id="farm-reply-${esc(item.id)}" name="reply" rows="3" required placeholder="Nhập phản hồi…">${esc(item.farmReply || "")}</textarea><button type="submit" class="btn">${item.farmReply ? "Lưu phản hồi" : "Gửi phản hồi"}</button></form>
      </article>`;
    }).join("");

    list.querySelectorAll(".js-farm-complaint-status").forEach(select => select.addEventListener("change", () => {
      const records = getItem(COMPLAINTS_KEY, []);
      const complaint = records.find(item => item.id === select.dataset.id && Number(item.targetFarmId) === Number(user.farmId));
      if(!complaint) return;
      complaint.status = select.value;
      setItem(COMPLAINTS_KEY, records);
      render();
    }));
    list.querySelectorAll(".farm-complaint-reply-form").forEach(form => form.addEventListener("submit", event => {
      event.preventDefault();
      const records = getItem(COMPLAINTS_KEY, []);
      const complaint = records.find(item => item.id === form.dataset.id && Number(item.targetFarmId) === Number(user.farmId));
      const reply = String(new FormData(form).get("reply") || "").trim();
      if(!complaint || !reply) return;
      complaint.farmReply = reply;
      complaint.farmRepliedAt = new Date().toISOString().slice(0, 10);
      if(complaint.status === "pending") complaint.status = "reviewing";
      setItem(COMPLAINTS_KEY, records);
      render();
    }));
  }

  window.addEventListener("storage", event => {
    if(event.key === COMPLAINTS_KEY) render();
  });
  render();
}
