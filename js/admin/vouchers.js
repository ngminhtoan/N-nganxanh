import { initStorage, getVouchers, saveVouchers } from "../utils/storage.js";
import { requireFarmLogin, logout } from "../utils/auth.js";

initStorage();
const user=requireFarmLogin("../dang-nhap.html?role=farm");
if(user){
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  document.getElementById("admin-user-name").textContent=user.name;
  document.getElementById("admin-logout").addEventListener("click",()=>{logout();window.location.href="../dang-nhap.html?role=farm";});
  const form=document.getElementById("voucher-form"), tbody=document.getElementById("farm-vouchers-body"), message=document.getElementById("voucher-form-message");
  const money=n=>`${Number(n||0).toLocaleString("vi-VN")}đ`;
  const date=s=>new Date(s).toLocaleString("vi-VN",{dateStyle:"short",timeStyle:"short"});
  function render(){
    const own=getVouchers().filter(v=>Number(v.farmId)===Number(user.farmId));
    if(!own.length){tbody.innerHTML='<tr><td colspan="6">Gian hàng chưa phát hành mã giảm giá nào.</td></tr>';return;}
    tbody.innerHTML=own.map(v=>`<tr><td><strong>${esc(v.code)}</strong><br>${esc(v.name)}</td><td>${v.type==="percent"?`${Number(v.value)}%${v.maxDiscount?` (tối đa ${money(v.maxDiscount)})`:""}`:v.type==="freeship"?`Hỗ trợ đến ${money(v.value)}`:money(v.value)}</td><td>${v.minOrder?`Đơn từ ${money(v.minOrder)}`:"Không yêu cầu đơn tối thiểu"}${v.category?`<br>${esc(v.category)}`:""}</td><td>${date(v.startAt)}<br>đến ${date(v.endAt)}</td><td>${v.usedCount||0}/${v.usageLimit??"∞"}</td><td><button class="danger js-voucher-delete" type="button" data-code="${esc(v.code)}">Gỡ mã</button></td></tr>`).join("");
  }
  form.addEventListener("submit",event=>{
    event.preventDefault();const data=new FormData(form), code=String(data.get("code")).trim().toUpperCase();
    const vouchers=getVouchers();
    if(vouchers.some(v=>v.code.toUpperCase()===code)){message.textContent="Mã này đã tồn tại. Hãy chọn mã khác.";message.className="voucher-form-message is-error";return;}
    const type=data.get("type"),value=Number(data.get("value")),startAt=new Date(data.get("startAt")),endAt=new Date(data.get("endAt"));
    if(type==="percent"&&value>100){message.textContent="Mức giảm phần trăm không được vượt quá 100%.";message.className="voucher-form-message is-error";return;}
    if(endAt<=startAt){message.textContent="Thời điểm kết thúc phải sau thời điểm bắt đầu.";message.className="voucher-form-message is-error";return;}
    const voucher={code,name:String(data.get("name")).trim(),type,value,minOrder:Number(data.get("minOrder"))||0,startAt:startAt.toISOString(),endAt:endAt.toISOString(),usageLimit:Number(data.get("usageLimit")),usedCount:0,farmId:user.farmId,farmName:user.name,createdAt:new Date().toISOString()};
    if(data.get("category"))voucher.category=data.get("category");
    if(type==="percent"&&Number(data.get("maxDiscount"))>0)voucher.maxDiscount=Number(data.get("maxDiscount"));
    vouchers.push(voucher);saveVouchers(vouchers);form.reset();document.getElementById("voucher-limit").value=100;document.getElementById("voucher-min").value=0;
    message.textContent=`Đã tạo mã ${code}. Mã sẽ hiển thị tại trang cửa hàng.`;message.className="voucher-form-message is-success";render();
  });
  tbody.addEventListener("click",event=>{
    const button=event.target.closest(".js-voucher-delete");if(!button)return;
    const vouchers=getVouchers(), target=vouchers.find(v=>v.code===button.dataset.code&&Number(v.farmId)===Number(user.farmId));
    if(!target)return;
    if(!confirm(`Gỡ mã ${target.code} khỏi danh sách ưu đãi?`))return;
    saveVouchers(vouchers.filter(v=>v!==target));render();
  });
  render();
}
