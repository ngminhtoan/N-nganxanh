// js/pages/checkout.js
import { initStorage, getProducts, saveProducts, getOrders, saveOrders, isProductApproved } from "../utils/storage.js";
import { getCartWithProducts, cartTotal, clearCart } from "../utils/cart.js";
import { getCurrentUser, isLoggedIn } from "../utils/auth.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { formatVND } from "../utils/format.js";

initStorage();
renderHeader("");
renderFooter();

const loginRequiredBox = document.getElementById("login-required");
const checkoutContent = document.getElementById("checkout-content");

if(!isLoggedIn()){
  loginRequiredBox.style.display = "block";
  checkoutContent.style.display = "none";
}else{
  loginRequiredBox.style.display = "none";
  checkoutContent.style.display = "grid";
  initCheckout();
}

function initCheckout(){
  const user = getCurrentUser();
  const cart = getCartWithProducts();

  if(cart.length === 0){
    checkoutContent.innerHTML = `<div class="state-box" style="grid-column:1/-1;"><div class="glyph">🛒</div><p>Giỏ hàng đang trống, không thể đặt hàng.</p><a href="san-pham.html" class="btn btn-outline">Chọn sản phẩm</a></div>`;
    return;
  }

  document.getElementById("co-name").value = user.name || "";
  document.getElementById("co-phone").value = user.phone || "";
  document.getElementById("co-address").value = user.address || "";

  const reviewBox = document.getElementById("order-review");
  reviewBox.innerHTML = cart.map(item => `
    <div class="order-review-item">
      <span>${item.product.name} × ${item.quantity}</span>
      <span>${formatVND(item.product.price * item.quantity)}</span>
    </div>`).join("");

  document.getElementById("checkout-total").textContent = formatVND(cartTotal());

  document.getElementById("checkout-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("co-name").value.trim();
    const phone = document.getElementById("co-phone").value.trim();
    const address = document.getElementById("co-address").value.trim();
    const note = document.getElementById("co-note").value.trim();

    if(!name || !phone || !address){
      alert("Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.");
      return;
    }

    // Kiểm tra lại tồn kho lần cuối trước khi tạo đơn
    const products = getProducts();
    for(const item of cart){
      const p = products.find(pp => pp.id === item.productId);
      if(!p || !isProductApproved(p) || p.stock < item.quantity){
        alert(`Sản phẩm "${item.product.name}" hiện không thể đặt hàng. Vui lòng cập nhật giỏ hàng.`);
        return;
      }
    }

    // Trừ tồn kho
    cart.forEach(item => {
      const p = products.find(pp => pp.id === item.productId);
      p.stock -= item.quantity;
    });
    saveProducts(products);

    // Tạo đơn hàng
    const orders = getOrders();
    const newOrder = {
      id: orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1001,
      userId: user.id,
      customerName: name, phone, address, note,
      items: cart.map(i => ({ productId: i.productId, quantity: i.quantity })),
      total: cartTotal(),
      status: "pending",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    orders.push(newOrder);
    saveOrders(orders);
    clearCart();

    alert(`Đặt hàng thành công! Mã đơn hàng #${newOrder.id}.`);
    window.location.href = "lich-su-don-hang.html";
  });
}
