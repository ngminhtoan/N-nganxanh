// js/utils/auth.js
// Đăng nhập / đăng ký / đăng xuất mô phỏng phía Front-end.
// KHÔNG mã hóa mật khẩu, KHÔNG có máy chủ xác thực thật — chỉ phục vụ demo đồ án.

import { KEYS, getItem, setItem, removeItem, getUsers, saveUsers, getFarms, saveFarms } from "./storage.js";

export function getCurrentUser(){
  return getItem(KEYS.CURRENT_USER, null);
}

export function isLoggedIn(){
  return getCurrentUser() !== null;
}

export function login(email, password){
  const user = getUsers().find(u => u.email === email && u.password === password);
  if(!user) return { ok: false, message: "Sai email hoặc mật khẩu." };
  const { password: _pw, ...safeUser } = user;
  setItem(KEYS.CURRENT_USER, safeUser);
  return { ok: true, user: safeUser };
}

export function logout(){
  removeItem(KEYS.CURRENT_USER);
}

export function registerCustomer({ name, email, password, phone, address }){
  const users = getUsers();
  if(users.some(u => u.email === email)){
    return { ok: false, message: "Email này đã được đăng ký." };
  }
  const newUser = {
    id: Date.now(), type: "customer", name, email, password, phone, address,
  };
  users.push(newUser);
  saveUsers(users);
  return { ok: true, user: newUser };
}

export function registerFarm({ name, email, password, phone, address, description }){
  const users = getUsers();
  if(users.some(u => u.email === email)){
    return { ok: false, message: "Email này đã được đăng ký." };
  }
  const farms = getFarms();
  const newFarmId = farms.length ? Math.max(...farms.map(f => f.id)) + 1 : 1;
  const newFarm = {
    id: newFarmId, name, type: "Hợp tác xã", province: "",
    description, address, phone, standards: [], taxRate: 10,
  };
  farms.push(newFarm);
  saveFarms(farms);

  const newUser = {
    id: Date.now(), type: "farm", farmId: newFarmId, name, email, password, phone, address, description,
  };
  users.push(newUser);
  saveUsers(users);
  return { ok: true, user: newUser };
}

/** Chuyển hướng về trang đăng nhập nếu chưa đăng nhập. Trả về true nếu OK để tiếp tục. */
export function requireLogin(redirectTo = "dang-nhap.html"){
  if(!isLoggedIn()){
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

/** Dùng cho các trang admin: yêu cầu đăng nhập bằng tài khoản loại "farm". */
export function requireFarmLogin(loginPage = "../dang-nhap.html?role=farm"){
  const user = getCurrentUser();
  if(!user || user.type !== "farm"){
    window.location.href = loginPage;
    return null;
  }
  return user;
}

/** Dùng cho khu vực Quản trị hệ thống (sadmin): yêu cầu đăng nhập bằng tài khoản loại "admin". */
export function requireAdminLogin(loginPage = "dang-nhap.html"){
  const user = getCurrentUser();
  if(!user || user.type !== "admin"){
    window.location.href = loginPage;
    return null;
  }
  return user;
}
