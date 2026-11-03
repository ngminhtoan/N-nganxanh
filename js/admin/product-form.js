// js/admin/product-form.js
import { initStorage, getProducts, saveProducts } from "../utils/storage.js";
import { requireFarmLogin, logout } from "../utils/auth.js";
import { CATEGORIES } from "../data/products.js";

initStorage();
const user = requireFarmLogin("../dang-nhap.html");

const ALL_STANDARDS = ["VietGAP", "GlobalGAP", "OCOP", "Hữu cơ"];

if(user){
  document.getElementById("admin-user-name").textContent = user.name;
  document.getElementById("admin-logout").addEventListener("click", () => {
    logout();
    window.location.href = "../index.html";
  });

  const form = document.getElementById("product-form");
  const editId = Number(new URLSearchParams(window.location.search).get("id")) || null;
  const isEdit = !!editId;

  document.getElementById("form-title").textContent = isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm mới";

  // Danh mục
  document.getElementById("pf-category").innerHTML = CATEGORIES
    .map(c => `<option value="${c.key}">${c.key}</option>`).join("");

  // Chứng nhận (checkbox)
  document.getElementById("pf-standards").innerHTML = ALL_STANDARDS.map(s => `
    <label><input type="checkbox" name="standard" value="${s}"> ${s}</label>`).join("");

  let existingProduct = null;
  if(isEdit){
    existingProduct = getProducts().find(p => p.id === editId && p.farmId === user.farmId);
    if(!existingProduct){
      alert("Không tìm thấy sản phẩm hoặc bạn không có quyền chỉnh sửa.");
      window.location.href = "san-pham.html";
    }else{
      fillForm(existingProduct);
    }
  }

  function fillForm(p){
    document.getElementById("pf-name").value = p.name;
    document.getElementById("pf-category").value = p.category;
    document.getElementById("pf-price").value = p.price;
    document.getElementById("pf-priceType").value = p.priceType;
    document.getElementById("pf-unit").value = p.unit;
    document.getElementById("pf-stock").value = p.stock;
    document.getElementById("pf-season").value = p.seasonStatus;
    document.getElementById("pf-harvest").value = p.harvestSeason || "";
    document.getElementById("pf-origin").value = p.origin;
    document.getElementById("pf-description").value = p.description || "";
    document.querySelectorAll('input[name="standard"]').forEach(cb => {
      cb.checked = (p.standards || []).includes(cb.value);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("pf-name").value.trim();
    const price = Number(document.getElementById("pf-price").value);
    const stock = Number(document.getElementById("pf-stock").value);

    if(!name){ alert("Vui lòng nhập tên sản phẩm."); return; }
    if(price < 0 || isNaN(price)){ alert("Giá không hợp lệ."); return; }
    if(stock < 0 || isNaN(stock)){ alert("Tồn kho không hợp lệ."); return; }

    const standards = [...document.querySelectorAll('input[name="standard"]:checked')].map(cb => cb.value);

    const productData = {
      name,
      category: document.getElementById("pf-category").value,
      farmId: user.farmId,
      price,
      priceType: document.getElementById("pf-priceType").value,
      unit: document.getElementById("pf-unit").value.trim() || "kg",
      priceUpdatedAt: new Date().toISOString().slice(0, 10),
      stock,
      seasonStatus: document.getElementById("pf-season").value,
      harvestSeason: document.getElementById("pf-harvest").value.trim(),
      standards,
      origin: document.getElementById("pf-origin").value.trim(),
      description: document.getElementById("pf-description").value.trim(),
    };

    const all = getProducts();
    if(isEdit){
      const idx = all.findIndex(p => p.id === editId);
      all[idx] = { ...all[idx], ...productData };
    }else{
      const newId = all.length ? Math.max(...all.map(p => p.id)) + 1 : 1;
      all.push({ id: newId, ...productData });
    }
    saveProducts(all);

    alert(isEdit ? "Đã cập nhật sản phẩm." : "Đã thêm sản phẩm mới.");
    window.location.href = "san-pham.html";
  });
}
