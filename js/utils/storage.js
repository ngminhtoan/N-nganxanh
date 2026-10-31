// js/utils/storage.js
// Bọc localStorage + khởi tạo dữ liệu mô phỏng lần đầu chạy.
// Sau khi seed, mọi thay đổi (thêm/sửa/xóa sản phẩm, đơn hàng, tài khoản...)
// được lưu và đọc trực tiếp từ localStorage — không đụng lại file data/ gốc.

import { PRODUCTS } from "../data/products.js";
import { FARMS } from "../data/farms.js";
import { SEED_USERS } from "../data/users.js";
import { SEED_ORDERS } from "../data/orders.js";

export const KEYS = {
  PRODUCTS: "nsv_products",
  FARMS: "nsv_farms",
  USERS: "nsv_users",
  ORDERS: "nsv_orders",
  CART: "nsv_cart",
  CURRENT_USER: "nsv_currentUser",
  REVENUE: "nsv_revenue_records",
  LEADS: "nsv_leads",
};

export function getItem(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  }catch(e){
    return fallback;
  }
}

export function setItem(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key){
  localStorage.removeItem(key);
}

/** Nạp dữ liệu mẫu vào localStorage nếu chưa có (chạy 1 lần khi mở site). */
export function initStorage(){
  const storedProducts = getItem(KEYS.PRODUCTS, null);
  if(storedProducts === null){
    setItem(KEYS.PRODUCTS, PRODUCTS);
  }else{
    // Đưa sản phẩm demo mới vào catalog đã được lưu ở các lần chạy trước.
    const productIds = new Set(storedProducts.map(product => Number(product.id)));
    const newSeedProducts = PRODUCTS.filter(product => product.id >= 19 && !productIds.has(Number(product.id)));
    if(newSeedProducts.length) setItem(KEYS.PRODUCTS, [...storedProducts, ...newSeedProducts]);
  }
  // Cập nhật bản ghi mẫu từ data/farms.js mỗi lần khởi tạo để thay đổi dữ liệu
  // gốc luôn xuất hiện trên các trang. Giữ lại HTX đăng ký thêm (ID không có
  // trong dữ liệu mẫu), đồng thời ưu tiên bản ghi mẫu khi ID bị trùng.
  const storedFarms = getItem(KEYS.FARMS, null);
  if(storedFarms === null){
    setItem(KEYS.FARMS, FARMS);
  }else{
    const seedIds = new Set(FARMS.map(farm => Number(farm.id)));
    const additionalFarms = storedFarms.filter(farm => !seedIds.has(Number(farm.id)));
    setItem(KEYS.FARMS, [...FARMS, ...additionalFarms]);
  }
  const storedUsers = getItem(KEYS.USERS, null);
  if(storedUsers === null){
    setItem(KEYS.USERS, SEED_USERS);
  }else{
    // Bổ sung tài khoản quản trị hệ thống cho trình duyệt đã có dữ liệu cũ.
    // initStorage trước đây chỉ seed users lần đầu, nên tài khoản thêm sau đó
    // không xuất hiện trong localStorage hiện hữu.
    const seedAdmin = SEED_USERS.find(user => user.type === "admin");
    if(seedAdmin){
      const adminIndex = storedUsers.findIndex(user => user.email === seedAdmin.email);
      if(adminIndex === -1){
        storedUsers.push(seedAdmin);
        setItem(KEYS.USERS, storedUsers);
      }else if(storedUsers[adminIndex].type !== "admin"){
        storedUsers[adminIndex] = seedAdmin;
        setItem(KEYS.USERS, storedUsers);
      }
    }
  }
  if(localStorage.getItem(KEYS.ORDERS) === null) setItem(KEYS.ORDERS, SEED_ORDERS);
  if(localStorage.getItem(KEYS.CART) === null) setItem(KEYS.CART, []);
  if(localStorage.getItem(KEYS.REVENUE) === null) setItem(KEYS.REVENUE, []);
  if(localStorage.getItem(KEYS.LEADS) === null) setItem(KEYS.LEADS, []);
}

export function getProducts(){ return getItem(KEYS.PRODUCTS, []); }
export function saveProducts(list){ setItem(KEYS.PRODUCTS, list); }

export function getFarms(){ return getItem(KEYS.FARMS, []); }
export function saveFarms(list){ setItem(KEYS.FARMS, list); }

export function getUsers(){ return getItem(KEYS.USERS, []); }
export function saveUsers(list){ setItem(KEYS.USERS, list); }

export function getOrders(){ return getItem(KEYS.ORDERS, []); }
export function saveOrders(list){ setItem(KEYS.ORDERS, list); }

/** Lịch sử các lần nhà vườn/HTX "chốt" doanh thu (đã lưu thuế suất + doanh thu sau thuế). */
export function getRevenueRecords(){ return getItem(KEYS.REVENUE, []); }
export function saveRevenueRecords(list){ setItem(KEYS.REVENUE, list); }

/** Thông tin liên hệ khách hàng để lại ở trang chủ (form "Nhận tư vấn / báo giá"). */
export function getLeads(){ return getItem(KEYS.LEADS, []); }
export function saveLeads(list){ setItem(KEYS.LEADS, list); }
