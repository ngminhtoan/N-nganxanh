// js/sadmin/auth.js
// Đăng nhập dành riêng cho Quản trị hệ thống (Super Admin).
// Chỉ chấp nhận tài khoản có type === "admin" — khác với đăng nhập nhà vườn/khách hàng.

import { initStorage } from "../utils/storage.js";
import { login, isLoggedIn, getCurrentUser, logout } from "../utils/auth.js";

initStorage();

// Nếu đã đăng nhập nhưng không phải admin (ví dụ đang là khách hàng/nhà vườn), đăng xuất trước.
if(isLoggedIn() && getCurrentUser().type !== "admin"){
  logout();
}
if(isLoggedIn() && getCurrentUser().type === "admin"){
  window.location.href = "index.html";
}

const form = document.getElementById("sadmin-login-form");
const note = document.getElementById("form-note");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("sadmin-email").value.trim();
  const password = document.getElementById("sadmin-password").value;

  const result = login(email, password);
  if(!result.ok || result.user.type !== "admin"){
    if(result.ok) logout(); // đăng nhập đúng nhưng không phải tài khoản quản trị → hủy phiên
    note.textContent = "Sai email/mật khẩu hoặc tài khoản này không có quyền quản trị hệ thống.";
    note.classList.add("is-visible", "is-error");
    note.classList.remove("is-success");
    return;
  }

  note.textContent = "Đăng nhập thành công! Đang chuyển đến trang quản trị...";
  note.classList.add("is-visible", "is-success");
  note.classList.remove("is-error");
  setTimeout(() => window.location.href = "index.html", 500);
});
