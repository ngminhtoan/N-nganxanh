// js/pages/checkout.js
import { initStorage, getProducts, saveProducts, getOrders, saveOrders, isProductApproved } from "../utils/storage.js";
import { getCartWithProducts, removeCartItems } from "../utils/cart.js";
import { getCurrentUser, isLoggedIn } from "../utils/auth.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { formatVND } from "../utils/format.js";
import { validateVoucher, recordVoucherUse } from "../utils/voucher.js";

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
  const allCartItems = getCartWithProducts();
  const selectionKey = "nsv_checkout_product_ids";
  let selectedIds;
  try{ selectedIds = JSON.parse(sessionStorage.getItem(selectionKey)); }catch{ selectedIds = null; }
  const cart = Array.isArray(selectedIds)
    ? allCartItems.filter(item => selectedIds.map(Number).includes(Number(item.productId)))
    : allCartItems;

  if(cart.length === 0){
    checkoutContent.innerHTML = `<div class="state-box" style="grid-column:1/-1;"><div class="glyph">🛒</div><p>${allCartItems.length ? "Bạn chưa chọn sản phẩm nào để thanh toán." : "Giỏ hàng đang trống, không thể đặt hàng."}</p><a href="gio-hang.html" class="btn btn-outline">Quay lại giỏ hàng</a></div>`;
    return;
  }

  document.getElementById("co-name").value = user.name || "";
  document.getElementById("co-phone").value = user.phone || "";
  document.getElementById("co-address").value = user.address || "";

  const reviewBox = document.getElementById("order-review");
  reviewBox.innerHTML = `<div class="checkout-card-heading checkout-review-heading"><span class="checkout-card-icon" aria-hidden="true">▤</span><div><h2>Đơn hàng của bạn</h2><p>${cart.length} sản phẩm · Nông sản từ nhà vườn</p></div></div><div class="checkout-review-list">${cart.map(item => `
    <div class="order-review-item">
      <span><strong>${item.product.name}</strong><small>Số lượng: ${item.quantity}</small></span>
      <b>${formatVND(item.product.price * item.quantity)}</b>
    </div>`).join("")}</div>`;

  const subtotal=cart.reduce((sum,item)=>sum+item.product.price*item.quantity,0);
  const totalWeight=cart.reduce((sum,item)=>{
    const unit=(item.product.unit||"").toLowerCase();
    const weight=Number(item.product.weightKg)||(unit==="kg"?1:0);
    return sum+weight*item.quantity;
  },0);
  const shippingFee=totalWeight>5?100000:30000;
  let appliedVoucher=null, discount=0;
  const renderTotal=()=>{
    document.getElementById("checkout-subtotal").textContent=formatVND(subtotal);
    document.getElementById("checkout-shipping").textContent=formatVND(shippingFee);
    document.getElementById("checkout-discount").textContent=`−${formatVND(discount)}`;
    document.getElementById("checkout-total").textContent=formatVND(Math.max(0,subtotal+shippingFee-discount));
  };
  renderTotal();
  document.getElementById("apply-voucher").addEventListener("click",()=>{
    const result=validateVoucher(document.getElementById("voucher-code").value,cart,{shippingFee});
    const message=document.getElementById("voucher-message");
    message.textContent=result.message;
    message.style.color=result.ok?"var(--color-primary)":"var(--color-danger)";
    appliedVoucher=result.ok?result.voucher:null; discount=result.ok?result.discount:0; renderTotal();
  });

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
      subtotal, shippingFee, discount, voucherCode:appliedVoucher?.code||null, total: Math.max(0,subtotal+shippingFee-discount),
      status: "pending",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    orders.push(newOrder);
    saveOrders(orders);
    if(appliedVoucher) recordVoucherUse(appliedVoucher.code);
    removeCartItems(cart.map(item => item.productId));
    sessionStorage.removeItem(selectionKey);

    alert(`Đặt hàng thành công! Mã đơn hàng #${newOrder.id}.`);
    window.location.href = "lich-su-don-hang.html";
  });
}
