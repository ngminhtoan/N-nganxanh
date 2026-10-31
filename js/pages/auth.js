// js/pages/auth.js
import { initStorage } from "../utils/storage.js";
import { login, registerCustomer, registerFarm, isLoggedIn } from "../utils/auth.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";

initStorage();
renderHeader("");
renderFooter();

/* ---------- Trang đăng nhập ---------- */
const loginForm = document.getElementById("login-form");
if(loginForm){
  if(isLoggedIn()) window.location.href = "tai-khoan.html";

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const note = document.getElementById("form-note");
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    clearErrors(loginForm);
    let ok = true;
    if(!isValidEmail(email)){ showFieldError("login-email", "Email không hợp lệ."); ok = false; }
    if(password.length < 6){ showFieldError("login-password", "Mật khẩu tối thiểu 6 ký tự."); ok = false; }
    if(!ok) return;

    const result = login(email, password);
    if(!result.ok){
      showNote(note, result.message, false);
      return;
    }
    showNote(note, `Đăng nhập thành công! Xin chào ${result.user.name}.`, true);
    setTimeout(() => {
      window.location.href = result.user.type === "farm" ? "admin/index.html" : "tai-khoan.html";
    }, 700);
  });
}

/* ---------- Trang đăng ký ---------- */
const registerForm = document.getElementById("register-form");
if(registerForm){
  if(isLoggedIn()) window.location.href = "tai-khoan.html";

  let role = "customer";
  const roleButtons = document.querySelectorAll(".role-toggle button");
  const farmFields = document.getElementById("farm-only-fields");

  roleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      role = btn.dataset.role;
      roleButtons.forEach(b => b.classList.toggle("is-active", b === btn));
      farmFields.style.display = role === "farm" ? "block" : "none";
    });
  });

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const note = document.getElementById("form-note");
    clearErrors(registerForm);

    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const confirm = document.getElementById("reg-confirm").value;
    const phone = document.getElementById("reg-phone").value.trim();
    const address = document.getElementById("reg-address").value.trim();
    const description = document.getElementById("reg-description") ? document.getElementById("reg-description").value.trim() : "";

    let ok = true;
    const nameLabel = role === "farm" ? "reg-name" : "reg-name";
    if(name.length < 2){ showFieldError(nameLabel, role === "farm" ? "Vui lòng nhập tên nhà vườn/HTX." : "Vui lòng nhập họ tên."); ok = false; }
    if(!isValidEmail(email)){ showFieldError("reg-email", "Email không hợp lệ."); ok = false; }
    if(password.length < 6){ showFieldError("reg-password", "Mật khẩu tối thiểu 6 ký tự."); ok = false; }
    if(confirm !== password){ showFieldError("reg-confirm", "Mật khẩu nhập lại không khớp."); ok = false; }
    if(phone.length < 8){ showFieldError("reg-phone", "Số điện thoại không hợp lệ."); ok = false; }
    if(address.length < 4){ showFieldError("reg-address", "Vui lòng nhập địa chỉ."); ok = false; }
    if(!ok) return;

    const result = role === "farm"
      ? registerFarm({ name, email, password, phone, address, description })
      : registerCustomer({ name, email, password, phone, address });

    if(!result.ok){
      showNote(note, result.message, false);
      return;
    }
    showNote(note, "Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.", true);
    registerForm.reset();
  });
}

function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

function showFieldError(fieldId, message){
  const field = document.getElementById(fieldId).closest(".field");
  field.classList.add("has-error");
  field.querySelector(".field-error").textContent = message;
}
function clearErrors(form){
  form.querySelectorAll(".field").forEach(f => f.classList.remove("has-error"));
}
function showNote(el, message, success){
  el.textContent = message;
  el.classList.add("is-visible");
  el.classList.toggle("is-success", !!success);
  el.classList.toggle("is-error", !success);
}
