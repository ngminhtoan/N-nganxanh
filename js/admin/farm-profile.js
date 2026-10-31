// js/admin/farm-profile.js
import { initStorage, getFarms, saveFarms, getUsers, saveUsers } from "../utils/storage.js";
import { requireFarmLogin, logout, getCurrentUser } from "../utils/auth.js";
import { KEYS, setItem } from "../utils/storage.js";

initStorage();
const user = requireFarmLogin("../dang-nhap.html");

if(user){
  document.getElementById("admin-user-name").textContent = user.name;
  document.getElementById("admin-logout").addEventListener("click", () => {
    logout();
    window.location.href = "../index.html";
  });

  const farm = getFarms().find(f => Number(f.id) === Number(user.farmId));
  const form = document.getElementById("farm-profile-form");

  if(!farm){
    alert("Không tìm thấy hồ sơ nhà vườn/HTX được liên kết với tài khoản này.");
    window.location.href = "../dang-nhap.html";
  } else {

  document.getElementById("fp-name").value = farm.name;
  document.getElementById("fp-type").value = farm.type;
  document.getElementById("fp-province").value = farm.province || "";
  document.getElementById("fp-address").value = farm.address || "";
  document.getElementById("fp-phone").value = farm.phone || "";
  document.getElementById("fp-taxrate").value = farm.taxRate ?? 10;
  document.getElementById("fp-description").value = farm.description || "";

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    farm.name = document.getElementById("fp-name").value.trim();
    farm.type = document.getElementById("fp-type").value;
    farm.province = document.getElementById("fp-province").value.trim();
    farm.address = document.getElementById("fp-address").value.trim();
    farm.phone = document.getElementById("fp-phone").value.trim();
    const taxInput = Number(document.getElementById("fp-taxrate").value);
    farm.taxRate = isNaN(taxInput) ? 0 : Math.min(100, Math.max(0, taxInput));
    farm.description = document.getElementById("fp-description").value.trim();

    // Lưu toàn bộ thông tin (bao gồm SĐT và thuế suất) vào cơ sở dữ liệu mô phỏng (localStorage)
    const farms = getFarms().map(f => f.id === farm.id ? farm : f);
    saveFarms(farms);

    // Đồng bộ lại tên/địa chỉ/điện thoại trên tài khoản đăng nhập của nhà vườn
    const users = getUsers().map(u => u.id === user.id
      ? { ...u, name: farm.name, address: farm.address, phone: farm.phone, description: farm.description }
      : u);
    saveUsers(users);

    const updatedCurrent = getCurrentUser();
    setItem(KEYS.CURRENT_USER, { ...updatedCurrent, name: farm.name, address: farm.address, phone: farm.phone });

    document.getElementById("admin-user-name").textContent = farm.name;
    alert("Đã cập nhật thông tin nhà vườn/HTX.");
  });
  }
}
