// js/sadmin/dashboard.js
// Trang Quản trị hệ thống: xem/ghi chú/xóa gian hàng & gửi email cảnh báo chất lượng.
// Đây vẫn là mô phỏng Front-end — "gửi email" sẽ mở sẵn ứng dụng email của trình duyệt
// (liên kết mailto:) và đồng thời lưu lại lịch sử cảnh báo vào localStorage để tiện theo dõi.

import { initStorage, getFarms, saveFarms, getProducts, saveProducts, getUsers, saveUsers } from "../utils/storage.js";
import { requireAdminLogin, logout } from "../utils/auth.js";
import { formatDate } from "../utils/format.js";

initStorage();
const admin = requireAdminLogin("dang-nhap.html");

if(admin){
  document.getElementById("sadmin-name").textContent = admin.name;
  document.getElementById("sadmin-logout").addEventListener("click", () => {
    logout();
    window.location.href = "dang-nhap.html";
  });

  const body = document.getElementById("sadmin-farms-body");
  const searchInput = document.getElementById("sadmin-search");

  function farmContactEmail(farmId){
    const owner = getUsers().find(u => u.type === "farm" && u.farmId === farmId);
    return owner ? owner.email : null;
  }

  function render(query = ""){
    let farms = getFarms();
    const products = getProducts();

    if(query.trim()){
      const q = query.trim().toLowerCase();
      farms = farms.filter(f => f.name.toLowerCase().includes(q) || (f.province || "").toLowerCase().includes(q));
    }

    document.getElementById("stat-total-farms").textContent = getFarms().length;
    document.getElementById("stat-total-products-all").textContent = products.length;
    document.getElementById("stat-total-warnings").textContent = getFarms().reduce((s, f) => s + (f.warnings || []).length, 0);

    if(farms.length === 0){
      body.innerHTML = `<tr><td colspan="6">Không tìm thấy gian hàng phù hợp.</td></tr>`;
      return;
    }

    body.innerHTML = farms.map(f => {
      const count = products.filter(p => p.farmId === f.id).length;
      const email = farmContactEmail(f.id);
      const warnings = f.warnings || [];

      return `
        <tr>
          <td><strong>${f.name}</strong><br><span style="color:var(--color-ink-soft); font-size:.8rem;">${f.type} · ${f.province || "—"}</span></td>
          <td>${f.phone || "—"}${email ? `<br><span style="color:var(--color-ink-soft); font-size:.8rem;">${email}</span>` : ""}</td>
          <td>${count}</td>
          <td>${warnings.length > 0 ? `<span class="badge badge-order-pending">${warnings.length} cảnh báo</span>` : "—"}</td>
          <td>${f.taxRate ?? 0}%</td>
          <td class="row-actions">
            <button type="button" class="js-toggle-detail" data-id="${f.id}">Chi tiết</button>
            <button type="button" class="danger js-delete-farm" data-id="${f.id}">Xóa</button>
          </td>
        </tr>
        <tr class="order-detail-row" id="sadmin-detail-${f.id}">
          <td colspan="6">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; padding:6px 0;">
              <div>
                <h4 style="font-size:.85rem; margin-bottom:8px;">📝 Ghi chú nội bộ (chỉ quản trị viên thấy)</h4>
                <textarea class="sadmin-note-input" data-id="${f.id}" rows="3" style="width:100%; padding:9px 11px; border:1px solid var(--color-line); border-radius:4px;" placeholder="Ví dụ: đã nhắc nhở lần 1 về đóng gói...">${f.adminNote || ""}</textarea>
                <button type="button" class="btn btn-sm js-save-note" data-id="${f.id}" style="margin-top:8px;">Lưu ghi chú</button>
              </div>
              <div>
                <h4 style="font-size:.85rem; margin-bottom:8px;">⚠️ Gửi cảnh báo chất lượng</h4>
                ${email
                  ? `
                  <textarea class="sadmin-warning-input" data-id="${f.id}" rows="3" style="width:100%; padding:9px 11px; border:1px solid var(--color-line); border-radius:4px;" placeholder="Nội dung cảnh báo gửi tới gian hàng...">Chúng tôi ghi nhận một số phản ánh về chất lượng sản phẩm từ gian hàng của quý vị. Vui lòng kiểm tra và cải thiện trong thời gian sớm nhất.</textarea>
                  <button type="button" class="btn btn-sm btn-danger js-send-warning" data-id="${f.id}" data-email="${email}" style="margin-top:8px;">✉️ Gửi email cảnh báo</button>
                  <div style="font-size:.75rem; color:var(--color-ink-soft); margin-top:6px;">Sẽ mở ứng dụng email mặc định của bạn (mailto:) gửi tới ${email} và lưu lại lịch sử bên dưới.</div>`
                  : `<p style="font-size:.85rem; color:var(--color-ink-soft);">Gian hàng này chưa có tài khoản đăng nhập nên không có email liên hệ.</p>`}

                ${warnings.length > 0 ? `
                <div style="margin-top:14px;">
                  <h4 style="font-size:.8rem; margin-bottom:6px;">Lịch sử cảnh báo đã gửi</h4>
                  ${warnings.slice().reverse().map(w => `
                    <div style="font-size:.8rem; padding:8px 0; border-top:1px solid var(--color-line);">
                      <strong>${formatDate(w.date)}</strong> — ${w.message}
                    </div>`).join("")}
                </div>` : ""}
              </div>
            </div>
          </td>
        </tr>`;
    }).join("");

    body.querySelectorAll(".js-toggle-detail").forEach(btn => {
      btn.addEventListener("click", () => {
        document.getElementById(`sadmin-detail-${btn.dataset.id}`).classList.toggle("is-open");
      });
    });

    body.querySelectorAll(".js-save-note").forEach(btn => {
      btn.addEventListener("click", () => {
        const textarea = body.querySelector(`.sadmin-note-input[data-id="${btn.dataset.id}"]`);
        const farms = getFarms();
        const farm = farms.find(f => f.id === Number(btn.dataset.id));
        farm.adminNote = textarea.value.trim();
        saveFarms(farms);
        alert("Đã lưu ghi chú.");
      });
    });

    body.querySelectorAll(".js-send-warning").forEach(btn => {
      btn.addEventListener("click", () => {
        const textarea = body.querySelector(`.sadmin-warning-input[data-id="${btn.dataset.id}"]`);
        const message = textarea.value.trim();
        if(!message){ alert("Vui lòng nhập nội dung cảnh báo."); return; }

        const farms = getFarms();
        const farm = farms.find(f => f.id === Number(btn.dataset.id));
        const today = new Date().toISOString().slice(0, 10);
        farm.warnings = farm.warnings || [];
        farm.warnings.push({ date: today, message });
        saveFarms(farms);

        const subject = encodeURIComponent(`[Nông Sản Việt] Cảnh báo chất lượng gian hàng: ${farm.name}`);
        const bodyText = encodeURIComponent(message + "\n\n— Đội ngũ Quản trị Nông Sản Việt");
        window.location.href = `mailto:${btn.dataset.email}?subject=${subject}&body=${bodyText}`;

        render(searchInput.value);
      });
    });

    body.querySelectorAll(".js-delete-farm").forEach(btn => {
      btn.addEventListener("click", () => {
        const farms = getFarms();
        const farm = farms.find(f => f.id === Number(btn.dataset.id));
        const productCount = getProducts().filter(p => p.farmId === farm.id).length;

        const confirmMsg = `Xóa gian hàng "${farm.name}"?\n\nHành động này sẽ xóa luôn ${productCount} sản phẩm và tài khoản đăng nhập của gian hàng này. Không thể hoàn tác.`;
        if(!confirm(confirmMsg)) return;

        saveFarms(farms.filter(f => f.id !== farm.id));
        saveProducts(getProducts().filter(p => p.farmId !== farm.id));
        saveUsers(getUsers().filter(u => !(u.type === "farm" && u.farmId === farm.id)));

        alert("Đã xóa gian hàng.");
        render(searchInput.value);
      });
    });
  }

  render();
  searchInput.addEventListener("input", () => render(searchInput.value));
}
