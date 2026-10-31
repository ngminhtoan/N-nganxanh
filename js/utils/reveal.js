// js/utils/reveal.js
// Hiệu ứng "xuất hiện" cho các thành phần khi cuộn tới: thêm class .reveal vào
// phần tử trong HTML, gọi initScrollReveal() một lần ở cuối trang.
// Các phần tử con trong một khối có [data-stagger] sẽ xuất hiện lần lượt cách nhau 90ms.

export function initScrollReveal(selector = ".reveal"){
  const elements = document.querySelectorAll(selector);
  if(elements.length === 0) return;

  document.querySelectorAll("[data-stagger]").forEach(group => {
    [...group.children].forEach((child, i) => {
      if(child.classList.contains("reveal")){
        child.style.transitionDelay = `${(i % 8) * 90}ms`;
      }
    });
  });

  if(!("IntersectionObserver" in window)){
    elements.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  elements.forEach(el => observer.observe(el));
}
