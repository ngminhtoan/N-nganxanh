// js/components/farm-card.js
// Sinh HTML cho 1 Farm Card (nhà vườn / HTX / cơ sở sản xuất).

import { farmImgSrc, imgTag, logoMarkSrc } from "../utils/images.js";

export function farmCardHtml(farm, productCount, basePath = ""){
  const standardsHtml = (farm.standards || [])
    .map(s => `<span class="badge badge-standard">${s}</span>`)
    .join("");
  // Luôn render hàng chứng nhận: nếu không có OCOP/VietGAP... thì để ô TRỐNG giữ chỗ,
  // nhờ đó mọi thẻ cao bằng nhau và dòng "sản phẩm" + nút "Xem nhà vườn" luôn thẳng hàng.

  return `
    <div class="farm-card">
      <div class="farm-card-top">
        <div class="farm-logo">${farm.glyph || "🌱"}${imgTag(farmImgSrc(farm, basePath), "Logo " + farm.name)}<img class="farm-logo-badge" src="${logoMarkSrc(basePath)}" alt="Logo Nông Sản Xanh"></div>
        <div>
          <h3 title="${farm.name}">${farm.name}</h3>
          <div class="farm-meta">${farm.type} · ${farm.province}</div>
        </div>
      </div>
      <p class="farm-desc" title="${farm.description}">${farm.description}</p>
      <div class="product-standards${standardsHtml ? "" : " is-empty"}">${standardsHtml}</div>
      <div class="farm-stats"><span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paper-bag" aria-hidden="true" style="display:inline-block; vertical-align:-2px; margin-right:3px;"><path d="M5.364 3.848C4 6 3 9.652 3 12.652V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5c0-2.334-1.816-4.668-2.622-7.002"/><path d="M7 3h11.379a2 2 0 0 1 1.789 1.106l.723 1.447A1 1 0 0 1 19.997 7h-8.525a2 2 0 0 1-1.789-1.106L8.79 4.105a1 1 0 1 0-1.789.895l2.261 4.522A5 5 0 0 1 8 12.652V21"/></svg>${productCount} sản phẩm</span></div>
      <a href="${basePath}chi-tiet-nha-vuon.html?id=${farm.id}" class="btn btn-outline btn-sm">Xem nhà vườn</a>
    </div>`;
}
