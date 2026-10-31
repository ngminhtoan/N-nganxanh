// js/data/about.js — Nội dung trang Giới thiệu. Sửa chữ / đổi ảnh nền tại đây.
// Muốn dùng ảnh thật: chép ảnh vào img/banners/ rồi đổi đường dẫn "image" bên dưới.

export const ABOUT = {
  values: {
    title: "Giá trị cốt lõi",
    image: "img/banners/gia-tri-cot-loi.svg",   // ảnh nền full-width (khuyến nghị 1920×640)
    autoMs: 5000,                               // sau bao nhiêu mili-giây thì tự chuyển dòng chữ
    items: [
      { title: "Chất lượng", text: "Chất lượng không chỉ nằm ở sản phẩm cuối cùng, mà bắt đầu từ cách lựa chọn nguyên liệu, kiểm soát quy trình và gìn giữ sự chỉn chu trong từng chi tiết nhỏ. Mỗi sản phẩm được làm ra phải mang đến sự an tâm, ổn định và xứng đáng với niềm tin của khách hàng." },
      { title: "Minh bạch", text: "Mọi sản phẩm đều hiển thị rõ nguồn gốc, nhà vườn/HTX sản xuất, tình trạng mùa vụ và chứng nhận (nếu có) — không mập mờ, không cam kết quá mức." },
      { title: "Kết nối", text: "Rút ngắn khoảng cách giữa nơi sản xuất và người tiêu dùng, giúp nông sản vùng miền đến tay khách hàng nhanh hơn, tươi hơn." },
      { title: "Bền vững", text: "Đồng hành lâu dài cùng nhà vườn/HTX, khuyến khích canh tác có trách nhiệm với môi trường và cộng đồng địa phương." },
    ],
  },

  journey: {
    image: "img/banners/hanh-trinh-phat-trien.svg", // ảnh nền full-width (khuyến nghị 1920×720)
    title: "Hành trình phát triển",
    text: "Chúng tôi dành nhiều thời gian tìm hiểu văn hóa nông sản các vùng miền, từ đó lựa chọn nguồn nguyên liệu phù hợp với thổ nhưỡng, khí hậu và thế mạnh sản xuất của từng địa phương. Chúng tôi hợp tác với các cơ sở sản xuất uy tín để phát triển những sản phẩm có chất lượng ổn định, mang đặc trưng riêng của sàn thương mại nông sản.",
  },
};
