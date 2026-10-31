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
        <button type="submit" title="Tìm kiếm" aria-label="Tìm kiếm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search" aria-hidden="true"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg></button>
      </form>
      <div class="header-actions">
        ${accountHtml}
        <a href="${basePath}gio-hang.html" class="icon-btn" title="Giỏ hàng" aria-label="Giỏ hàng"><span class="cart-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart" aria-hidden="true"><path d="m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18"/><path d="M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25"/><circle cx="18" cy="20" r="2"/><circle cx="8" cy="20" r="2"/></svg></span><span class="cart-count" id="cart-count">0</span></a>
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
