import { getVouchers, saveVouchers } from "./storage.js";

export function validateVoucher(code, cart, { now = new Date(), shippingFee = 0 } = {}){
  const voucher = getVouchers().find(v => v.code.toUpperCase() === String(code).trim().toUpperCase());
  if(!voucher) return {ok:false,message:"Mã giảm giá không tồn tại."};
  if(now < new Date(voucher.startAt) || now > new Date(voucher.endAt)) return {ok:false,message:"Mã giảm giá chưa bắt đầu hoặc đã hết hạn."};
  if(voucher.daysOfWeek && !voucher.daysOfWeek.includes(now.getDay())) return {ok:false,message:"Mã này chỉ áp dụng vào Thứ 7 và Chủ Nhật."};
  if(voucher.timeStart){const hhmm=now.toTimeString().slice(0,5); if(hhmm < voucher.timeStart || hhmm > voucher.timeEnd) return {ok:false,message:`Mã chỉ áp dụng từ ${voucher.timeStart} đến ${voucher.timeEnd}.`};}
  if(voucher.usageLimit != null && voucher.usedCount >= voucher.usageLimit) return {ok:false,message:"Mã giảm giá đã hết lượt sử dụng."};
  const scopedCart=voucher.farmId ? cart.filter(i=>Number(i.product.farmId)===Number(voucher.farmId)) : cart;
  if(voucher.farmId && !scopedCart.length) return {ok:false,message:`Mã chỉ áp dụng cho sản phẩm của ${voucher.farmName||"nhà vườn/HTX phát hành"}.`};
  const subtotal=scopedCart.reduce((s,i)=>s+i.product.price*i.quantity,0);
  if(subtotal < voucher.minOrder) return {ok:false,message:`Đơn hàng cần đạt tối thiểu ${voucher.minOrder.toLocaleString("vi-VN")}đ để dùng mã này.`};
  const eligible= voucher.category ? scopedCart.filter(i=>i.product.category===voucher.category) : scopedCart;
  if(voucher.category && !eligible.length) return {ok:false,message:`Mã chỉ áp dụng cho danh mục ${voucher.category}.`};
  const eligibleTotal=eligible.reduce((s,i)=>s+i.product.price*i.quantity,0);
  if(voucher.type === "freeship"){
    const weight=scopedCart.reduce((s,i)=>s+(Number(i.product.weightKg)||((i.product.unit||"").toLowerCase()==="kg"?1:0))*i.quantity,0);
    if(weight < voucher.minWeight) return {ok:false,message:`Đơn hàng cần có ít nhất ${voucher.minWeight} kg hàng hóa để dùng mã freeship.`};
    return {ok:true,voucher,discount:Math.min(shippingFee,voucher.value),message:"Áp dụng mã miễn phí vận chuyển thành công."};
  }
  const discount=Math.min(voucher.type === "percent" ? Math.round(eligibleTotal*voucher.value/100) : voucher.value, voucher.maxDiscount ?? Infinity, eligibleTotal);
  return {ok:true,voucher,discount,message:`Áp dụng mã ${voucher.code} thành công.`};
}

// Gọi sau khi đơn hàng đã được lưu thành công.
export function recordVoucherUse(code){
  const vouchers=getVouchers(), v=vouchers.find(x=>x.code===code);
  if(!v) return false;
  if(v.usageLimit != null && v.usedCount >= v.usageLimit) return false;
  v.usedCount=(v.usedCount||0)+1; saveVouchers(vouchers); return true;
}
