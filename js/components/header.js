// js/components/header.js
// Header dùng chung cho mọi trang. Gọi renderHeader('home') tại mỗi trang
// với tham số là tên mục đang active để bôi đậm menu tương ứng.

import { getCurrentUser, logout } from "../utils/auth.js";
import { refreshCartBadge } from "../utils/cart.js";
import { getUsers, saveUsers, KEYS, setItem } from "../utils/storage.js";

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

  const safeAvatar = /^data:image\/(?:jpeg|png|webp);base64,/i.test(user?.avatar || "") ? user.avatar : "";
  const initials = user ? user.name.trim().split(/\s+/).slice(-2).map(part => part[0]).join("").toLocaleUpperCase("vi").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char])) : "";
  const accountHtml = user?.type === "admin"
    ? `<div class="account-profile-control account-profile-control-admin">
        <a href="${basePath}sadmin/index.html" class="account-btn account-btn-profile" aria-label="Mở quản trị hệ thống" title="Mở quản trị hệ thống"><span class="account-avatar-menu account-avatar-menu-fallback" aria-hidden="true">${initials}</span></a><a class="account-admin-label" href="${basePath}sadmin/index.html">Quản trị hệ thống</a>
      </div>`
    : user
    ? `<div class="account-profile-control">
        <a href="${basePath}tai-khoan.html" class="account-btn account-btn-profile" aria-label="Tài khoản của tôi" title="Tài khoản của tôi">${safeAvatar ? `<img class="account-avatar-menu" src="${safeAvatar}" alt="">` : `<span class="account-avatar-menu account-avatar-menu-fallback" aria-hidden="true">${initials}</span>`}</a>
        <button type="button" class="account-avatar-edit-menu" id="header-avatar-edit" aria-label="Thay đổi ảnh đại diện" title="Thay đổi ảnh đại diện">+</button>
        <input type="file" class="account-avatar-file" id="header-avatar-file" accept="image/*" aria-label="Chọn ảnh đại diện">
        <span class="visually-hidden" id="header-avatar-status" role="status" aria-live="polite"></span>
      </div>`
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
      ${user?.type === "admin" ? `<a href="${basePath}sadmin/index.html">Quản trị hệ thống</a>` : ""}
      ${user ? `<a href="#" id="mobile-logout">Đăng xuất (${user.name})</a>` : ""}
    </div>`;

  if(user && user.type !== "admin") bindAvatarUpload(user);

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

function bindAvatarUpload(user){
  const trigger = document.getElementById("header-avatar-edit");
  const input = document.getElementById("header-avatar-file");
  const status = document.getElementById("header-avatar-status");
  trigger.addEventListener("click", () => input.click());
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if(!file) return;
    if(!file.type.startsWith("image/")){
      status.textContent = "Vui lòng chọn một tệp ảnh.";
      input.value = "";
      return;
    }
    if(file.size > 8 * 1024 * 1024){
      status.textContent = "Ảnh quá lớn. Hãy chọn ảnh dưới 8 MB.";
      input.value = "";
      return;
    }
    try{
      const avatar = await compressAvatar(file);
      const users = getUsers();
      const userIndex = users.findIndex(savedUser => savedUser.id === user.id);
      if(userIndex !== -1){
        users[userIndex].avatar = avatar;
        saveUsers(users);
      }
      user.avatar = avatar;
      setItem(KEYS.CURRENT_USER, user);
      const profileLink = document.querySelector(".account-btn-profile");
      let photo = profileLink.querySelector("img");
      if(!photo){
        photo = document.createElement("img");
        photo.className = "account-avatar-menu";
        photo.alt = "";
        profileLink.replaceChildren(photo);
      }
      photo.src = avatar;
      status.textContent = "Ảnh đại diện đã được cập nhật.";
    }catch(error){
      status.textContent = "Không thể lưu ảnh. Vui lòng thử ảnh khác.";
    }
    input.value = "";
  });
}

function compressAvatar(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Image read failed"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Invalid image"));
      image.onload = () => {
        const maxSize = 512;
        const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext("2d");
        if(!context){ reject(new Error("Canvas unavailable")); return; }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        try{ resolve(canvas.toDataURL("image/jpeg", .82)); }
        catch(error){ reject(error); }
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
