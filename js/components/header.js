// js/components/header.js
// Header dùng chung cho mọi trang. Gọi renderHeader('home') tại mỗi trang
// với tham số là tên mục đang active để bôi đậm menu tương ứng.

import { getCurrentUser, logout } from "../utils/auth.js";
import { refreshCartBadge } from "../utils/cart.js";

const NAV_ITEMS = [
  { key: "home", href: "index.html", label: "Trang chủ" },
  { key: "shop", href: "cua-hang.html", label: "Sản phẩm" },
  { key: "farms", href: "nha-vuon.html", label: "Nhà vườn/HTX" },
  { key: "about", href: "gioi-thieu.html", label: "Giới thiệu" },
  { key: "contact", href: "index.html#lien-he", label: "Liên hệ" },
  { key: "products", href: "san-pham.html", label: "Cửa hàng" },
];

export function renderHeader(activeKey = "", basePath = ""){
  const root = document.getElementById("site-header");
  if(!root) return;

  const user = getCurrentUser();
  const nav = NAV_ITEMS.map(item =>
    `<a href="${basePath}${item.href}" class="${item.key === activeKey ? 'active' : ''}">${item.label}</a>`
  ).join("");

  const accountHtml = user
    ? `<a href="${basePath}tai-khoan.html" class="account-btn">👤 ${user.name.split(" ").slice(-1)[0]}</a>`
    : `<a href="${basePath}dang-nhap.html" class="account-btn login-link">Đăng nhập</a>`;

  root.innerHTML = `
    <div class="header-top">
      <a href="${basePath}index.html" class="logo header-logo"><img class="header-logo-image" src="${basePath}img/logo-nong-san-xanh.png" alt="Logo Nông Sản Xanh"></a>
      <form class="search-box" id="header-search-form">
        <input type="search" id="header-search-input" placeholder="Tìm sản phẩm, nông sản, nhà vườn...">
        <button type="submit" title="Tìm kiếm">🔍</button>
      </form>
      <div class="header-actions">
        ${accountHtml}
        <a href="${basePath}gio-hang.html" class="icon-btn" title="Giỏ hàng"><span class="cart-icon">🛒</span><span class="cart-count" id="cart-count">0</span></a>
        <button class="nav-toggle" id="nav-toggle" aria-label="Menu">☰</button>
      </div>
    </div>
    <div class="header-bottom">
      <div class="wrap"><nav class="main-nav">${nav}</nav></div>
    </div>
    <div class="mobile-menu" id="mobile-menu">
      ${nav}
      ${user ? `<a href="#" id="mobile-logout">Đăng xuất (${user.name})</a>` : ""}
    </div>`;

  document.getElementById("header-search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.getElementById("header-search-input").value.trim();
    window.location.href = `${basePath}tim-kiem.html?q=${encodeURIComponent(q)}`;
  });

  document.getElementById("nav-toggle").addEventListener("click", () => {
    document.getElementById("mobile-menu").classList.toggle("is-open");
  });

  const mobileLogout = document.getElementById("mobile-logout");
  if(mobileLogout){
    mobileLogout.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
      window.location.href = `${basePath}index.html`;
    });
  }

  refreshCartBadge();
}
