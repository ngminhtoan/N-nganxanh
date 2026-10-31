// js/utils/slider.js
// Hai kiểu carousel dùng chung cho nhiều trang:
// - initPercentSlider: trượt toàn màn hình theo %, có dots, tự chạy (dùng cho Hero, ảnh minh họa).
// - initPixelCarousel: trượt theo khoảng cách cố định (px), hiển thị nhiều mục cùng lúc,
//   nút mũi tên tự vô hiệu ở 2 đầu (dùng cho "Sản phẩm nổi bật", "Nhà vườn/HTX"...).

export function initPercentSlider({ trackId, dotsId, prevId, nextId, autoMs = 0 }){
  const track = document.getElementById(trackId);
  if(!track) return null;
  const slides = track.children;
  if(slides.length === 0) return null;

  const dotsBox = dotsId ? document.getElementById(dotsId) : null;
  if(dotsBox){
    dotsBox.innerHTML = [...slides].map((_, i) =>
      `<button type="button" data-index="${i}" class="${i === 0 ? "is-active" : ""}"></button>`).join("");
  }
  const dots = dotsBox ? dotsBox.querySelectorAll("button") : [];

  let index = 0;
  let timer = null;

  function goTo(i){
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle("is-active", di === index));
  }
  function startAuto(){
    if(!autoMs) return;
    stopAuto();
    timer = setInterval(() => goTo(index + 1), autoMs);
  }
  function stopAuto(){
    if(timer) clearInterval(timer);
  }

  const prevBtn = prevId ? document.getElementById(prevId) : null;
  const nextBtn = nextId ? document.getElementById(nextId) : null;
  if(prevBtn) prevBtn.addEventListener("click", () => { goTo(index - 1); startAuto(); });
  if(nextBtn) nextBtn.addEventListener("click", () => { goTo(index + 1); startAuto(); });
  dots.forEach(d => d.addEventListener("click", () => { goTo(Number(d.dataset.index)); startAuto(); }));

  const container = track.closest("[id$='-slider']") || track.parentElement;
  container.addEventListener("mouseenter", stopAuto);
  container.addEventListener("mouseleave", startAuto);

  goTo(0);
  startAuto();
  return { goTo };
}

export function initPixelCarousel({ containerId, trackId, prevId, nextId, step }){
  const container = document.getElementById(containerId);
  const track = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  if(!container || !track) return null;

  let pos = 0;

  function update(){
    const maxScroll = Math.max(0, track.scrollWidth - container.clientWidth);
    pos = Math.min(Math.max(pos, 0), maxScroll);
    track.style.transform = `translateX(-${pos}px)`;
    if(prevBtn) prevBtn.disabled = pos <= 0;
    if(nextBtn) nextBtn.disabled = pos >= maxScroll - 1;
  }

  if(prevBtn) prevBtn.addEventListener("click", () => { pos -= step; update(); });
  if(nextBtn) nextBtn.addEventListener("click", () => { pos += step; update(); });
  window.addEventListener("resize", update);

  update();
  return { update };
}
