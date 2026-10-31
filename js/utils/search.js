// js/utils/search.js
// Tìm kiếm sản phẩm theo tên, danh mục, nguồn gốc, tên nhà vườn.

function normalize(str){
  return (str || "").toString().toLowerCase().normalize("NFC");
}

export function searchProducts(products, farms, query){
  const q = normalize(query).trim();
  if(!q) return [];
  return products.filter(p => {
    const farm = farms.find(f => f.id === p.farmId);
    const haystack = [p.name, p.category, p.origin, farm ? farm.name : ""]
      .map(normalize)
      .join(" | ");
    return haystack.includes(q);
  });
}
