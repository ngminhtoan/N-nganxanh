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
      <div class="farm-stats"><span>📦 ${productCount} sản phẩm</span></div>
      <a href="${basePath}chi-tiet-nha-vuon.html?id=${farm.id}" class="btn btn-outline btn-sm">Xem nhà vườn</a>
    </div>`;
}
