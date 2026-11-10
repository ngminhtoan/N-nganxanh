// js/components/footer.js
// Footer dùng chung cho mọi trang.


export function renderFooter(basePath = ""){
  const root = document.getElementById("site-footer");
  if(!root) return;

  root.innerHTML = `
    <div class="wrap footer-grid">
      <div>
        <div class="footer-brand footer-brand-image"><img class="footer-logo-img" src="${basePath}img/logo-nong-san-xanh.png" alt="Logo Nông Sản Xanh"></div>
        <p>Sàn thương mại điện tử kết nối nhà vườn, hợp tác xã và người tiêu dùng trên khắp Việt Nam.</p>
      </div>
      <div>
        <h4>Danh mục</h4>
        <ul>
          <li><a href="${basePath}san-pham.html?cat=${encodeURIComponent('Trái cây')}">Trái cây</a></li>
          <li><a href="${basePath}san-pham.html?cat=${encodeURIComponent('Rau củ')}">Rau củ</a></li>
          <li><a href="${basePath}san-pham.html?cat=${encodeURIComponent('Gạo')}">Gạo</a></li>
          <li><a href="${basePath}san-pham.html?cat=${encodeURIComponent('Cà phê')}">Cà phê</a></li>
        </ul>
      </div>
      <div>
        <h4>Tài khoản</h4>
        <ul>
          <li><a href="${basePath}dang-nhap.html">Đăng nhập</a></li>
          <li><a href="${basePath}dang-ky.html">Đăng ký</a></li>
          <li><a href="${basePath}gio-hang.html">Giỏ hàng</a></li>
          <li><a href="${basePath}nha-vuon.html">Nhà vườn/HTX</a></li>
        </ul>
      </div>
      <div id="lien-he">
        <h4>Liên hệ</h4>
        <ul>
          <li>SDT: 0345506641</li>
          <li>Facebook: Nguyễn Toàn</li>
          <li>Email: toan20002006@gmail.com</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">110124190_Nguyễn Minh Toàn_DA24TTD_Lập trình front-end cho sàn thương mại nông sản dựa trên mô hình Client-side và ES6 Modules. © 2026 Nông Sản Xanh.</div>`;
}
