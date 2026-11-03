// js/data/products.js
// Dữ liệu sản phẩm mẫu. "image" dùng đường dẫn ảnh trong img/products/,
// vì đồ án demo không có ảnh thật — có thể thay bằng ảnh thật trong img/products/.
// harvestSeason: mùa thu hoạch thực tế (thông tin tham khảo, khác với seasonStatus
// là trạng thái còn hàng/hết mùa hiện tại của lô hàng).

export const PRODUCTS = [
  {
    id: 1, name: "Xoài Cát Hòa Lộc", category: "Trái cây", farmId: 1,
    price: 85000, priceType: "market", unit: "kg", priceUpdatedAt: "2026-09-20",
    stock: 120, seasonStatus: "in-season", harvestSeason: "Tháng 3 - Tháng 5", standards: ["VietGAP"],
    origin: "Tiền Giang",
    description: "Xoài cát Hòa Lộc thịt vàng, thơm, ít xơ, vị ngọt thanh — đặc sản nổi tiếng của vùng Cái Bè, Tiền Giang."
  },
  {
    id: 2, name: "Sầu Riêng Ri6", category: "Trái cây", farmId: 2,
    price: 95000, priceType: "market", unit: "kg", priceUpdatedAt: "2026-09-21",
    stock: 40, seasonStatus: "limited", harvestSeason: "Tháng 4 - Tháng 6", standards: [],
    origin: "Bến Tre",
    description: "Sầu riêng Ri6 cơm vàng, hạt lép, vị béo ngậy. Nguồn cung hạn chế do đang cuối vụ."
  },
  {
    id: 3, name: "Cam Sành Bắc Quang", category: "Trái cây", farmId: 7,
    price: 32000, priceType: "market", unit: "kg", priceUpdatedAt: "2026-09-18",
    stock: 200, seasonStatus: "in-season", harvestSeason: "Tháng 10 - Tháng 2", standards: [],
    origin: "Hà Giang",
    description: "Cam sành trồng trên vùng núi đá, vỏ sần, mọng nước, vị chua ngọt hài hòa."
  },
  {
    id: 4, name: "Bơ Sáp Đắk Lắk", category: "Trái cây", farmId: 2,
    price: 55000, priceType: "fixed", unit: "kg", priceUpdatedAt: "2026-09-15",
    stock: 0, seasonStatus: "out-of-season", harvestSeason: "Tháng 4 - Tháng 6", standards: [],
    origin: "Bến Tre",
    description: "Bơ sáp dẻo, béo, hạt nhỏ. Hiện đã hết mùa thu hoạch, dự kiến quay lại vào tháng 5 năm sau."
  },
  {
    id: 5, name: "Bưởi Da Xanh", category: "Trái cây", farmId: 2,
    price: 45000, priceType: "market", unit: "kg", priceUpdatedAt: "2026-09-19",
    stock: 85, seasonStatus: "in-season", harvestSeason: "Quanh năm", standards: ["VietGAP"],
    origin: "Bến Tre",
    description: "Bưởi da xanh ruột hồng, không hạt, vị ngọt thanh, đạt chuẩn VietGAP."
  },
  {
    id: 6, name: "Rau Cải Xanh Hữu Cơ", category: "Rau củ", farmId: 3,
    price: 28000, priceType: "fixed", unit: "kg", priceUpdatedAt: "2026-09-22",
    stock: 60, seasonStatus: "in-season", harvestSeason: "Quanh năm", standards: ["Hữu cơ"],
    origin: "Lâm Đồng",
    description: "Cải xanh trồng theo phương pháp hữu cơ trong nhà kính, không dùng thuốc bảo vệ thực vật hóa học."
  },
  {
    id: 7, name: "Cà Chua Bi Đà Lạt", category: "Rau củ", farmId: 3,
    price: 38000, priceType: "market", unit: "kg", priceUpdatedAt: "2026-09-22",
    stock: 70, seasonStatus: "in-season", harvestSeason: "Quanh năm", standards: ["OCOP", "Hữu cơ"],
    origin: "Lâm Đồng",
    description: "Cà chua bi ngọt, giòn, trồng trong nhà kính công nghệ cao tại Đà Lạt."
  },
  {
    id: 8, name: "Khoai Lang Mật", category: "Rau củ", farmId: 3,
    price: 25000, priceType: "market", unit: "kg", priceUpdatedAt: "2026-09-17",
    stock: 15, seasonStatus: "limited", harvestSeason: "Tháng 8 - Tháng 11", standards: [],
    origin: "Lâm Đồng",
    description: "Khoai lang mật ruột vàng cam, vị ngọt đậm khi nướng hoặc hấp. Nguồn cung đang hạn chế."
  },
  {
    id: 9, name: "Gạo ST25", category: "Gạo", farmId: 4,
    price: 32000, priceType: "fixed", unit: "kg", priceUpdatedAt: "2026-09-10",
    stock: 300, seasonStatus: "in-season", harvestSeason: "Quanh năm", standards: ["VietGAP"],
    origin: "Đồng Tháp",
    description: "Gạo ST25 — từng đạt giải gạo ngon nhất thế giới, hạt dài, thơm, dẻo vừa."
  },
  {
    id: 10, name: "Gạo Thơm Jasmine", category: "Gạo", farmId: 4,
    price: 21000, priceType: "fixed", unit: "kg", priceUpdatedAt: "2026-09-10",
    stock: 250, seasonStatus: "in-season", harvestSeason: "Quanh năm", standards: [],
    origin: "Đồng Tháp",
    description: "Gạo Jasmine hạt dài, thơm nhẹ, phù hợp dùng hàng ngày cho cả gia đình."
  },
  {
    id: 11, name: "Cà Phê Robusta Rang Xay", category: "Cà phê", farmId: 5,
    price: 120000, priceType: "fixed", unit: "kg", priceUpdatedAt: "2026-09-12",
    stock: 90, seasonStatus: "in-season", harvestSeason: "Tháng 10 - Tháng 1", standards: ["OCOP"],
    origin: "Đắk Lắk",
    description: "Cà phê Robusta rang mộc, vị đậm đắng đặc trưng, rang xay thủ công theo mẻ nhỏ."
  },
  {
    id: 12, name: "Cà Phê Arabica Hạt", category: "Cà phê", farmId: 5,
    price: 185000, priceType: "negotiable", unit: "kg", priceUpdatedAt: "2026-09-12",
    stock: 35, seasonStatus: "in-season", harvestSeason: "Tháng 10 - Tháng 1", standards: [],
    origin: "Đắk Lắk",
    description: "Cà phê Arabica hạt nguyên, hương thơm dịu, vị chua thanh. Giá có thể thương lượng theo số lượng."
  },
  {
    id: 13, name: "Trà Shan Tuyết Cổ Thụ", category: "Trà", farmId: 6,
    price: 350000, priceType: "contact", unit: "kg", priceUpdatedAt: "2026-09-05",
    stock: 20, seasonStatus: "limited", harvestSeason: "Tháng 3 - Tháng 4 (vụ xuân)", standards: ["OCOP", "Hữu cơ"],
    origin: "Yên Bái",
    description: "Trà Shan Tuyết hái từ cây chè cổ thụ trên 100 năm tuổi. Sản lượng giới hạn, vui lòng liên hệ nhà vườn để đặt mua."
  },
  {
    id: 14, name: "Trà Ô Long Suối Giàng", category: "Trà", farmId: 6,
    price: 210000, priceType: "fixed", unit: "kg", priceUpdatedAt: "2026-09-05",
    stock: 45, seasonStatus: "in-season", harvestSeason: "Tháng 3 - Tháng 9", standards: ["OCOP"],
    origin: "Yên Bái",
    description: "Trà Ô Long lên men bán phần, hương thơm dịu, hậu vị ngọt kéo dài."
  },
  {
    id: 15, name: "Chuối Sấy Dẻo", category: "Nông sản khô", farmId: 8,
    price: 65000, priceType: "fixed", unit: "gói 500g", priceUpdatedAt: "2026-09-08",
    stock: 150, seasonStatus: "in-season", harvestSeason: "Quanh năm", standards: ["OCOP"],
    origin: "An Giang",
    description: "Chuối sấy dẻo tự nhiên, không chất bảo quản, giữ nguyên vị ngọt của chuối chín cây."
  },
  {
    id: 16, name: "Khô Cá Lóc Đồng", category: "Nông sản khô", farmId: 8,
    price: 280000, priceType: "market", unit: "kg", priceUpdatedAt: "2026-09-14",
    stock: 0, seasonStatus: "pre-order", harvestSeason: "Tháng 9 - Tháng 11 (mùa nước nổi)", standards: [],
    origin: "An Giang",
    description: "Khô cá lóc đồng miền Tây, thịt chắc, thơm. Hiện chỉ nhận đặt trước theo mùa nước nổi."
  },
  {
    id: 17, name: "Đường Thốt Nốt", category: "Đặc sản vùng miền", farmId: 8,
    price: 48000, priceType: "fixed", unit: "kg", priceUpdatedAt: "2026-09-11",
    stock: 110, seasonStatus: "in-season", harvestSeason: "Tháng 11 - Tháng 4", standards: ["OCOP"],
    origin: "An Giang",
    description: "Đường thốt nốt nguyên chất từ vùng Bảy Núi, vị ngọt thanh, thơm mùi mật đặc trưng."
  },
  {
    id: 18, name: "Mắm Cá Linh", category: "Đặc sản vùng miền", farmId: 8,
    price: 95000, priceType: "negotiable", unit: "hũ 500g", priceUpdatedAt: "2026-09-09",
    stock: 25, seasonStatus: "in-season", harvestSeason: "Tháng 9 - Tháng 11", standards: [],
    origin: "An Giang",
    description: "Mắm cá linh miền Tây làm theo công thức gia truyền, đậm đà hương vị Nam Bộ."
  },
  {
    id: 19, name: "Bún Gạo Khô Chi Lăng", category: "Nông sản khô", farmId: 9,
    price: 45000, priceType: "fixed", unit: "gói 500g", priceUpdatedAt: "2026-10-28",
    stock: 80, seasonStatus: "in-season", harvestSeason: "Quanh năm", standards: ["OCOP"],
    origin: "Đắk Lắk",
    description: "Bún gạo khô làm từ gạo, sợi thanh, tiện bảo quản và chế biến các món bún nước hoặc bún xào. Ảnh sản phẩm mang tính minh họa."
  },
  {
    id: 20, name: "Gạo Thơm Jasmine Phước Thành", category: "Gạo", farmId: 10,
    price: 22000, priceType: "fixed", unit: "kg", priceUpdatedAt: "2026-10-28",
    stock: 200, seasonStatus: "in-season", harvestSeason: "Quanh năm", standards: [],
    origin: "Vĩnh Long",
    description: "Gạo thơm Jasmine hạt dài, phù hợp cho bữa cơm gia đình. Ảnh hạt gạo mang tính minh họa, không phải bao bì riêng của cơ sở."
  },
];

export const CATEGORIES = [
  { key: "Trái cây", tagline: "Trái cây tươi theo mùa, trực tiếp từ vườn",
    desc: [
      "Trái cây Nông Sản Việt được tuyển chọn từ các vùng trồng nổi tiếng như Tiền Giang, Bến Tre hay Hà Giang – nơi thổ nhưỡng và khí hậu tạo nên hương vị đặc trưng cho từng loại quả.",
      "Mỗi sản phẩm đều gắn với một nhà vườn hoặc hợp tác xã cụ thể, có thông tin mùa vụ và trạng thái nguồn cung được cập nhật rõ ràng để bạn biết loại quả nào đang vào mùa ngon nhất.",
      "Nhiều sản phẩm đạt tiêu chuẩn VietGAP, được thu hái đúng độ chín và đóng gói cẩn thận để giữ trọn độ tươi khi đến tay người dùng.",
      "Từ xoài, sầu riêng, cam, bưởi đến những loại quả đặc sản theo vùng miền, trái cây tại đây là lựa chọn phù hợp cho bữa ăn gia đình, quà biếu và cả nhu cầu mua sỉ."
    ] },
  { key: "Rau củ", tagline: "Rau củ sạch, tươi mỗi ngày",
    desc: [
      "Rau củ Nông Sản Việt đến từ các vùng canh tác nổi tiếng như Lâm Đồng, với khí hậu mát mẻ quanh năm rất thích hợp cho rau xanh và củ quả.",
      "Nhiều sản phẩm được trồng theo hướng hữu cơ hoặc đạt chứng nhận OCOP, hạn chế tối đa thuốc bảo vệ thực vật hóa học, giúp bữa cơm gia đình thêm an tâm.",
      "Rau củ được thu hái trong ngày, sơ chế và đóng gói cẩn thận để giữ độ giòn ngọt tự nhiên khi đến tay khách hàng.",
      "Từ cải xanh, cà chua bi đến khoai lang mật, mỗi loại đều có thông tin nhà vườn và nguồn gốc rõ ràng để bạn dễ dàng lựa chọn."
    ] },
  { key: "Gạo", tagline: "Gạo ngon từ những cánh đồng lúa Việt",
    desc: [
      "Gạo Nông Sản Việt được chọn lọc từ những vùng lúa trù phú, cho hạt gạo chắc, thơm và giàu giá trị dinh dưỡng.",
      "Quy trình từ gieo trồng, thu hoạch, xay xát đến đóng gói đều được kiểm soát cẩn thận để giữ trọn mùi thơm dịu đặc trưng của gạo ngon.",
      "Cơm nấu từ gạo tại đây dẻo vừa phải, thơm nhẹ, phù hợp cho bữa ăn hằng ngày của cả gia đình.",
      "Ngoài gạo trắng, cửa hàng còn có các loại gạo đặc sản và gạo lứt dành cho người ưa chuộng lối sống lành mạnh."
    ] },
  { key: "Cà phê", tagline: "Cà phê nguyên chất, đậm vị đất đỏ",
    desc: [
      "Cà phê Nông Sản Việt được thu mua từ các nhà vườn và hợp tác xã tại vùng Tây Nguyên, nơi đất đỏ bazan và khí hậu cao nguyên tạo nên hương vị đậm đà đặc trưng.",
      "Hạt cà phê được thu hái chín kỹ, sơ chế và rang xay theo quy trình rõ ràng, không pha trộn tạp chất để giữ trọn hương thơm tự nhiên.",
      "Sản phẩm phù hợp cho cả pha phin truyền thống lẫn pha máy, mang lại tách cà phê thơm và đậm vị mỗi buổi sáng."
    ] },
  { key: "Trà", tagline: "Trà thơm từ những vùng chè nổi tiếng",
    desc: [
      "Trà Nông Sản Việt được hái từ những đồi chè xanh mướt ở vùng núi phía Bắc và cao nguyên, nơi sương sớm và khí hậu mát lành cho búp chè thơm ngọt.",
      "Mỗi loại trà đều được sao sấy theo quy trình thủ công kết hợp kiểm soát chất lượng, giữ lại hương thơm dịu và vị chát nhẹ đặc trưng.",
      "Trà thích hợp để thưởng thức hằng ngày, tiếp khách hoặc làm quà biếu ý nghĩa cho người thân."
    ] },
  { key: "Nông sản khô", tagline: "Nông sản khô tự nhiên, bảo quản lâu dài",
    desc: [
      "Nông sản khô Nông Sản Việt gồm các sản phẩm như trái cây sấy, nấm, măng, mộc nhĩ và nhiều loại đặc sản được chế biến từ nguồn nguyên liệu tươi tại vùng trồng.",
      "Sản phẩm được phơi hoặc sấy khô theo quy trình sạch, hạn chế phụ gia, giúp bảo quản được lâu mà vẫn giữ hương vị tự nhiên.",
      "Dễ sử dụng trong bữa ăn hằng ngày, làm quà biếu hoặc dự trữ cho gia đình, nhất là vào những dịp trái mùa."
    ] },
  { key: "Đặc sản vùng miền", tagline: "Đặc sản vùng miền, đậm bản sắc quê hương",
    desc: [
      "Đặc sản vùng miền là nơi tập hợp những sản phẩm mang dấu ấn riêng của từng địa phương, từ miền núi phía Bắc, miền Trung đến miền Tây Nam Bộ.",
      "Mỗi sản phẩm đều gắn với nhà vườn hoặc hợp tác xã địa phương, gìn giữ cách làm truyền thống và hương vị mộc mạc của quê hương.",
      "Đây là lựa chọn phù hợp để thưởng thức, làm quà biếu và khám phá nét ẩm thực đặc trưng của từng vùng đất."
    ] },
];

export function getProductById(id){
  return PRODUCTS.find(p => p.id === Number(id));
}
