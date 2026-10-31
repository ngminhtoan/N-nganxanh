// js/pages/gioi-thieu.js
import { initStorage } from "../utils/storage.js";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { initPercentSlider } from "../utils/slider.js";
import { initScrollReveal } from "../utils/reveal.js";
import { ABOUT } from "../data/about.js";

initStorage();
renderHeader("about");
renderFooter();

/* ---------- Gallery ảnh minh họa đầu trang ---------- */
initPercentSlider({
  trackId: "about-gallery-track",
  prevId: "about-gallery-prev",
  nextId: "about-gallery-next",
  autoMs: 4000,
});

/* ---------- Giá trị cốt lõi: chữ tự chạy sau một khoảng thời gian, hoặc nhấn giữ chuột và kéo ---------- */
function initValues(){
  const cfg = ABOUT.values;
  const frame = document.getElementById("values-full");
  const viewport = document.getElementById("values-viewport");
  const track = document.getElementById("values-track");
  const dotsBox = document.getElementById("values-dots");
  if(!frame || !track) return;

  frame.style.backgroundImage = `url("${cfg.image}")`;
  document.getElementById("values-title").textContent = cfg.title;
  track.innerHTML = cfg.items.map((it, i) =>
    `<div class="value-slide"><h3>${i + 1}. ${it.title}</h3><p>${it.text}</p></div>`).join("");
  dotsBox.innerHTML = cfg.items.map((_, i) =>
    `<button type="button" data-index="${i}" aria-label="Giá trị ${i + 1}"></button>`).join("");
  const dots = [...dotsBox.children];
  const total = cfg.items.length;

  let index = 0, timer = null;
  let dragging = false, startX = 0, dx = 0;

  const place = (px = 0) => { track.style.transform = `translateX(calc(${-index * 100}% + ${px}px))`; };
  function goTo(i){
    index = (i + total) % total;
    place(0);
    dots.forEach((d, di) => d.classList.toggle("is-active", di === index));
  }
  function stopAuto(){ if(timer){ clearInterval(timer); timer = null; } }
  function startAuto(){
    stopAuto();
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer = setInterval(() => goTo(index + 1), cfg.autoMs || 5000);
  }

  dots.forEach(d => d.addEventListener("click", () => { goTo(Number(d.dataset.index)); startAuto(); }));

  // Kéo bằng chuột / ngón tay: chữ chạy theo con trỏ, thả ra thì trượt sang mục gần nhất
  frame.addEventListener("pointerdown", (e) => {
    if(e.pointerType === "mouse" && e.button !== 0) return;
    if(e.target.closest(".values-dots")) return;
    dragging = true; startX = e.clientX; dx = 0;
    track.classList.add("no-anim");
    frame.classList.add("is-dragging");
    stopAuto();
    frame.setPointerCapture(e.pointerId);
  });
  frame.addEventListener("pointermove", (e) => {
    if(!dragging) return;
    dx = e.clientX - startX;
    place(dx);
  });
  function endDrag(){
    if(!dragging) return;
    dragging = false;
    track.classList.remove("no-anim");
    frame.classList.remove("is-dragging");
    const threshold = viewport.offsetWidth * 0.15;
    if(dx < -threshold) goTo(index + 1);
    else if(dx > threshold) goTo(index - 1);
    else goTo(index);
    startAuto();
  }
  frame.addEventListener("pointerup", endDrag);
  frame.addEventListener("pointercancel", endDrag);
  frame.addEventListener("dragstart", (e) => e.preventDefault());

  goTo(0);
  startAuto();
}
initValues();

/* ---------- Hành trình phát triển: ảnh nền + thẻ chữ lấy từ js/data/about.js ---------- */
function initJourney(){
  const cfg = ABOUT.journey;
  const box = document.getElementById("journey-full");
  if(!box) return;
  box.style.backgroundImage = `url("${cfg.image}")`;
  document.getElementById("journey-title").textContent = cfg.title;
  document.getElementById("journey-text").textContent = cfg.text;
}
initJourney();

/* ---------- Hiệu ứng xuất hiện khi cuộn trang ---------- */
initScrollReveal();
