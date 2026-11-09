// js/pages/account.js
import { initStorage, getOrders } from "../utils/storage.js";
import { getCurrentUser, requireLogin, logout } from "../utils/auth.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { formatVND, formatDate, orderStatusLabel } from "../utils/format.js";

initStorage();
renderHeader("");
renderFooter();

if(getCurrentUser()?.type === "admin"){
  window.location.replace("sadmin/index.html");
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

  document.getElementById("logout-btn").addEventListener("click", () => {
    logout();
    window.location.href = "index.html";
  });
}
