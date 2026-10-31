// js/pages/cart.js
import { initStorage, getProducts } from "../utils/storage.js";
import { getCartWithProducts, updateCartQuantity, removeFromCart, cartTotal } from "../utils/cart.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { formatVND } from "../utils/format.js";
import { productImgSrc, farmImgSrc, imgTag, logoStamp } from "../utils/images.js";


initStorage();
renderHeader("");
renderFooter();

const tableWrap = document.getElementById("cart-table-wrap");
const emptyState = document.getElementById("cart-empty");
const body = document.getElementById("cart-body");

function render(){
  const cart = getCartWithProducts();

  if(cart.length === 0){
    tableWrap.style.display = "none";
    emptyState.style.display = "block";
    return;
  }
  tableWrap.style.display = "grid";
  emptyState.style.display = "none";

  body.innerHTML = cart.map(item => {
    const p = item.product;
    const atMax = item.quantity >= p.stock;
    return `
      <tr>
        <td>
          <div class="cart-item">
            <div class="cart-thumb">${p.glyph || "🌿"}${imgTag(productImgSrc(p), p.name)}</div>
            <div class="cart-item-info">
              <div class="name">${p.name}</div>
              <div class="meta">${p.origin} · Còn ${p.stock} ${p.unit}</div>
              <a href="#" class="remove-link" data-id="${p.id}">Xóa</a>
              ${atMax ? '<div class="qty-warning">Đã đạt số lượng tồn kho tối đa</div>' : ""}
            </div>
          </div>
        </td>
        <td>${formatVND(p.price)}/${p.unit}</td>
        <td>
          <div class="qty-control">
            <button type="button" class="js-minus" data-id="${p.id}" title="${item.quantity === 1 ? "Xóa sản phẩm" : "Giảm số lượng"}">${item.quantity === 1 ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash" aria-hidden="true"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' : "−"}</button>
            <input type="text" readonly value="${item.quantity}">
            <button type="button" class="js-plus" data-id="${p.id}" ${atMax ? "disabled" : ""}>+</button>
          </div>
        </td>
        <td><strong>${formatVND(p.price * item.quantity)}</strong></td>
      </tr>`;
  }).join("");

  document.getElementById("cart-subtotal").textContent = formatVND(cartTotal());
  document.getElementById("cart-total").textContent = formatVND(cartTotal());

  body.querySelectorAll(".js-minus").forEach(btn => btn.addEventListener("click", () => {
    const cart = getCartWithProducts();
    const item = cart.find(i => i.productId === Number(btn.dataset.id));
    if(item.quantity - 1 <= 0){
      // Bấm trừ khi số lượng đang là 1 → xóa luôn sản phẩm khỏi giỏ hàng
      removeFromCart(btn.dataset.id);
    }else{
      updateCartQuantity(btn.dataset.id, item.quantity - 1);
    }
    render();
  }));
  body.querySelectorAll(".js-plus").forEach(btn => btn.addEventListener("click", () => {
    const cart = getCartWithProducts();
    const item = cart.find(i => i.productId === Number(btn.dataset.id));
    updateCartQuantity(btn.dataset.id, item.quantity + 1);
    render();
  }));
  body.querySelectorAll(".remove-link").forEach(link => link.addEventListener("click", (e) => {
    e.preventDefault();
    removeFromCart(link.dataset.id);
    render();
  }));
}

render();
