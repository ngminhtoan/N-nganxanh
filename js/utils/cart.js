// js/utils/cart.js
// Giỏ hàng lưu trong localStorage dạng [{ productId, quantity }].
// Không cho phép số lượng mua vượt quá tồn kho (stock) của sản phẩm.

import { KEYS, getItem, setItem, getProducts } from "./storage.js";

export function getCart(){
  return getItem(KEYS.CART, []);
}

function saveCart(cart){
  setItem(KEYS.CART, cart);
  refreshCartBadge();
}

/**
 * Thêm sản phẩm vào giỏ, giới hạn theo tồn kho.
 * Trả về { ok, message } để trang gọi hàm này hiển thị phản hồi phù hợp.
 */
export function addToCart(productId, quantity = 1){
  const product = getProducts().find(p => p.id === Number(productId));
  if(!product) return { ok: false, message: "Sản phẩm không tồn tại." };
  if(product.stock <= 0) return { ok: false, message: "Sản phẩm tạm hết hàng." };
  if(product.seasonStatus === "out-of-season") return { ok: false, message: "Sản phẩm đã hết mùa." };
  if(product.priceType === "contact") return { ok: false, message: "Vui lòng liên hệ nhà vườn để đặt sản phẩm này." };

  const cart = getCart();
  const existing = cart.find(i => i.productId === product.id);
  const currentQty = existing ? existing.quantity : 0;
  const nextQty = Math.min(currentQty + quantity, product.stock);

  if(existing) existing.quantity = nextQty;
  else cart.push({ productId: product.id, quantity: nextQty });

  saveCart(cart);
  return { ok: true, message: "Đã thêm vào giỏ hàng.", capped: nextQty < currentQty + quantity };
}

export function updateCartQuantity(productId, quantity){
  const product = getProducts().find(p => p.id === Number(productId));
  const cart = getCart();
  const item = cart.find(i => i.productId === Number(productId));
  if(!item) return;
  let qty = Math.max(1, quantity);
  if(product) qty = Math.min(qty, product.stock);
  item.quantity = qty;
  saveCart(cart);
}

export function removeFromCart(productId){
  const cart = getCart().filter(i => i.productId !== Number(productId));
  saveCart(cart);
}

export function clearCart(){
  saveCart([]);
}

/** Danh sách giỏ hàng kèm thông tin sản phẩm đầy đủ (để render). */
export function getCartWithProducts(){
  const products = getProducts();
  return getCart()
    .map(item => ({ ...item, product: products.find(p => p.id === item.productId) }))
    .filter(i => i.product);
}

export function cartCount(){
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

export function cartTotal(){
  return getCartWithProducts().reduce((sum, i) => sum + i.product.price * i.quantity, 0);
}

/** Cập nhật số hiển thị trên icon giỏ hàng ở header, nếu header đã render. */
export function refreshCartBadge(){
  const badge = document.getElementById("cart-count");
  if(badge) badge.textContent = cartCount();
}
