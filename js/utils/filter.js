// js/utils/filter.js
// Lọc và sắp xếp danh sách sản phẩm cho trang san-pham.html

/**
 * filters: {
 *   category, province, farmId, standard, seasonStatus,
 *   minPrice, maxPrice
 * }
 */
export function filterProducts(products, farms, filters = {}){
  return products.filter(p => {
    if(filters.category && p.category !== filters.category) return false;
    if(filters.seasonStatus && p.seasonStatus !== filters.seasonStatus) return false;
    if(filters.standard && !(p.standards || []).includes(filters.standard)) return false;
    if(filters.farmId && p.farmId !== Number(filters.farmId)) return false;

    if(filters.province){
      const farm = farms.find(f => f.id === p.farmId);
      if(!farm || farm.province !== filters.province) return false;
    }
    if(filters.minPrice && p.price < Number(filters.minPrice)) return false;
    if(filters.maxPrice && p.price > Number(filters.maxPrice)) return false;

    return true;
  });
}

export function sortProducts(products, sortKey){
  const list = [...products];
  switch(sortKey){
    case "price-asc": return list.sort((a, b) => a.price - b.price);
    case "price-desc": return list.sort((a, b) => b.price - a.price);
    case "name-asc": return list.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    case "name-desc": return list.sort((a, b) => b.name.localeCompare(a.name, "vi"));
    default: return list;
  }
}
