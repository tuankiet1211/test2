// ==========================================================================
// KLIGHT — script.js (bản đầy đủ, đã sửa: data-target, URL Google Script, vuốt/menu)
// ==========================================================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzqw6l0vWRk7YIOCPZ3OejRwy3g_xfIS_tPP3D-JgMt4XEtOdmloqfVjcrScxW_-QaO/exec';
const NAV_BREAKPOINT = 860;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Header + nút lên đầu trang
const header = $('#siteHeader'), scrollTopBtn = $('#scrollTop');
let ticking = false;
function onScroll() {
  const y = scrollY;
  header.classList.toggle('scrolled', y > 12);
  scrollTopBtn.classList.toggle('visible', y > 500);
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
onScroll();
scrollTopBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

// ---- Menu mobile
const burger = $('#burger'), mainNav = $('#mainNav');
function setNav(open) {
  mainNav.classList.toggle('open', open);
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('nav-open', open);
}
burger.setAttribute('aria-expanded', 'false');
burger.addEventListener('click', e => { e.stopPropagation(); setNav(!mainNav.classList.contains('open')); });
$$('.main-nav a').forEach(a => a.addEventListener('click', () => setNav(false)));
document.addEventListener('click', e => {
  if (mainNav.classList.contains('open') && !mainNav.contains(e.target) && !burger.contains(e.target)) setNav(false);
});
addEventListener('resize', () => { if (innerWidth > NAV_BREAKPOINT) setNav(false); });
addEventListener('orientationchange', () => setTimeout(() => { if (innerWidth > NAV_BREAKPOINT) setNav(false); }, 150));
$$('.mobile-bar a').forEach(a => a.addEventListener('click', () => setNav(false)));

// ---- Hiện dần khi cuộn
const revealIO = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('in-view'); revealIO.unobserve(en.target); }
}), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
$$('.reveal-up').forEach(el => revealIO.observe(el));

// ---- Bộ đếm số (HTML dùng data-target, data-suffix)
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  if (!Number.isFinite(target)) return;
  const dec = el.dataset.suffix ? 1 : 0;
  const fmt = v => v.toLocaleString('vi-VN', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  if (reduceMotion) { el.textContent = fmt(target); return; }
  const t0 = performance.now(), dur = 1600;
  (function tick(now) {
    const p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(dec ? target * e : Math.floor(target * e));
    if (p < 1) requestAnimationFrame(tick); else el.textContent = fmt(target);
  })(t0);
}
// Thanh liên hệ: ẩn khi cuộn xuống hoặc khi đang gõ form, hiện lại khi cuộn lên
const bar = $('.mobile-bar');
if (bar) {
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    const goingDown = y > lastY && y > 200;
    bar.classList.toggle('hide', goingDown || document.body.classList.contains('modal-open'));
    lastY = y;
  }, { passive: true });
  document.addEventListener('focusin', e => { if (e.target.matches('input,select')) bar.classList.add('hide'); });
  document.addEventListener('focusout', () => bar.classList.remove('hide'));
}
const counterIO = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { animateCounter(en.target); counterIO.unobserve(en.target); }
}), { threshold: 0.5 });
$$('.counter').forEach(el => counterIO.observe(el));

// ---- Slider ảnh: chỉ chạy khi đang nhìn thấy
$$('.path-thumb-slider, .talent-thumb-slider').forEach(slider => {
  const slides = $$('.slide', slider);
  if (slides.length < 2 || reduceMotion) return;
  let cur = 0, timer = null;
  const next = () => { slides[cur].classList.remove('active'); cur = (cur + 1) % slides.length; slides[cur].classList.add('active'); };
  const play = () => { if (!timer) timer = setInterval(next, 2500); };
  const stop = () => { clearInterval(timer); timer = null; };
  new IntersectionObserver(([en]) => (en.isIntersecting ? play() : stop()), { threshold: 0.3 }).observe(slider);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
});

// ---- Video: chỉ phát khi nhìn thấy
const videoIO = new IntersectionObserver(es => es.forEach(({ target, isIntersecting }) => {
  if (isIntersecting) target.play().catch(() => {}); else target.pause();
}), { threshold: 0.25 });
$$('video[autoplay]').forEach(v => videoIO.observe(v));

// ---- Ô điện thoại: chỉ số, tối đa 10 ký tự
$$('input[type="tel"]').forEach(i => i.addEventListener('input', () => { i.value = i.value.replace(/\D/g, '').slice(0, 10); }));

// ---- Gửi thông tin khách hàng (dùng chung)
async function submitLead(form, noteEl, payload) {
  const btn = $('button[type="submit"]', form);
  noteEl.classList.remove('success');
  if (!payload.name) { noteEl.textContent = 'Vui lòng nhập họ và tên.'; return false; }
  if (!/^0\d{9}$/.test(payload.phone)) { noteEl.textContent = 'Số điện thoại cần đủ 10 số và bắt đầu bằng 0.'; return false; }
  try {
    btn.disabled = true;
    noteEl.textContent = 'Đang gửi thông tin...';
    await fetch(SCRIPT_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    noteEl.textContent = 'Cảm ơn bạn! Đội ngũ KLight sẽ liên hệ trong 24h tới.';
    noteEl.classList.add('success');
    form.reset();
    return true;
  } catch (err) {
    console.error(err);
    noteEl.textContent = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
    return false;
  } finally { btn.disabled = false; }
}

const ctaForm = $('#ctaForm'), formNote = $('#formNote');
if (ctaForm) ctaForm.addEventListener('submit', e => {
  e.preventDefault();
  submitLead(ctaForm, formNote, {
    name: ctaForm.elements.name.value.trim(),
    phone: ctaForm.elements.phone.value.trim(),
    product: ctaForm.elements.product.value,
    source: 'Form tư vấn trang chủ'
  });
});

// ---- Popup "Xem chi tiết"
const modalOverlay = $('#modalOverlay'), modalClose = $('#modalClose'),
      modalTitle = $('#modalTitle'), modalDesc = $('#modalDesc'),
      modalForm = $('#modalForm'), modalFormNote = $('#modalFormNote');
let lastFocused = null;

function openModal(title, desc) {
  lastFocused = document.activeElement;
  modalTitle.textContent = title || 'Nhận tư vấn';
  modalDesc.textContent = desc || 'Để lại thông tin để KLight tư vấn cho bạn.';
  modalForm.reset();
  modalFormNote.textContent = '';
  modalFormNote.classList.remove('success');
  modalOverlay.classList.add('open');
  document.body.classList.add('modal-open');
  setTimeout(() => modalForm.elements.name.focus({ preventScroll: true }), 350);
}
function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.classList.remove('modal-open');
  if (lastFocused) lastFocused.focus({ preventScroll: true });
}
$$('.open-modal').forEach(l => l.addEventListener('click', e => {
  e.preventDefault(); setNav(false); openModal(l.dataset.title, l.dataset.desc);
}));
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); setNav(false); } });

modalForm.addEventListener('submit', async e => {
  e.preventDefault();
  const ok = await submitLead(modalForm, modalFormNote, {
    name: modalForm.elements.name.value.trim(),
    phone: modalForm.elements.phone.value.trim(),
    product: modalTitle.textContent,
    source: 'Popup KLight'
  });
  if (ok) setTimeout(closeModal, 1800);
});

document.body.classList.add('js-loaded');