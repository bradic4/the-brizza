'use strict';

/* ─── SCROLL REVEAL ──────────────────────────────────────── */
(function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach((el) => obs.observe(el));
})();

/* ─── NAV SCROLL ─────────────────────────────────────────── */
(function initNavScroll() {
  const nav = document.querySelector('.nav-pill');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();

/* ─── SMOOTH SCROLL ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closeMobileMenu();
  });
});

/* ─── MOBILE MENU ────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');

function openMobileMenu() {
  hamburger.setAttribute('aria-expanded', 'true');
  hamburger.classList.add('is-open');
  mobileMenu.classList.add('is-open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.querySelectorAll('.mobile-nav-link').forEach((l) => l.setAttribute('tabindex', '0'));
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  if (!hamburger) return;
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.classList.remove('is-open');
  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.querySelectorAll('.mobile-nav-link').forEach((l) => l.setAttribute('tabindex', '-1'));
  document.body.style.overflow = '';
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.getAttribute('aria-expanded') === 'true' ? closeMobileMenu() : openMobileMenu();
  });
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileMenu(); });

/* ─── SERVICE PILLS ──────────────────────────────────────── */
const servicePills = document.querySelectorAll('.service-pill');
let selectedService = 'sisanje';

servicePills.forEach((pill) => {
  pill.addEventListener('click', () => {
    servicePills.forEach((p) => { p.classList.remove('active'); p.setAttribute('aria-pressed', 'false'); });
    pill.classList.add('active');
    pill.setAttribute('aria-pressed', 'true');
    selectedService = pill.dataset.service;
    updateSummary();
  });
});

/* ─── BARBER CARDS ───────────────────────────────────────── */
const barberCards = document.querySelectorAll('.barber-card');
let selectedBarber = 'nikola';

barberCards.forEach((card) => {
  card.addEventListener('click', () => {
    barberCards.forEach((c) => { c.classList.remove('active'); c.setAttribute('aria-pressed', 'false'); });
    card.classList.add('active');
    card.setAttribute('aria-pressed', 'true');
    selectedBarber = card.dataset.barber;
    updateSummary();
  });
});

/* ─── CALENDAR ───────────────────────────────────────────── */
const MESECI = [
  'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
  'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
];

let calYear, calMonth, selectedDate = null;

function initCalendar() {
  const now = new Date();
  calYear  = now.getFullYear();
  calMonth = now.getMonth();
  renderCalendar();
}

function renderCalendar() {
  const label = document.getElementById('cal-month-label');
  const grid  = document.getElementById('calendar-grid');
  if (!label || !grid) return;

  label.textContent = MESECI[calMonth] + ' ' + calYear;
  grid.innerHTML = '';

  const today    = new Date(); today.setHours(0,0,0,0);
  const firstDay = new Date(calYear, calMonth, 1);
  let startDay   = firstDay.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1; // Monday-first

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  for (let i = 0; i < startDay; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day cal-day--empty';
    el.setAttribute('aria-hidden', 'true');
    grid.appendChild(el);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date   = new Date(calYear, calMonth, d); date.setHours(0,0,0,0);
    const isSun  = date.getDay() === 0;
    const isPast = date < today;
    const isDisabled = isPast || isSun;
    const isToday    = date.getTime() === today.getTime();
    const isSelected = selectedDate &&
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth()    === selectedDate.getMonth() &&
      date.getDate()     === selectedDate.getDate();

    const btn = document.createElement('button');
    btn.className = 'cal-day';
    btn.textContent = d;
    btn.setAttribute('aria-label', d + '. ' + MESECI[calMonth] + ' ' + calYear);

    if (isSelected)         btn.classList.add('cal-day--selected');
    else if (isToday)       btn.classList.add('cal-day--today');
    if (isDisabled) {
      btn.classList.add('cal-day--disabled');
      btn.setAttribute('disabled', '');
      btn.setAttribute('aria-disabled', 'true');
    } else {
      btn.addEventListener('click', () => { selectedDate = date; renderCalendar(); renderTimeSlots(); updateSummary(); });
    }
    grid.appendChild(btn);
  }
}

document.getElementById('cal-prev')?.addEventListener('click', () => {
  if (--calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
});
document.getElementById('cal-next')?.addEventListener('click', () => {
  if (++calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
});

initCalendar();

/* ─── TIME SLOTS ─────────────────────────────────────────── */
const ALL_SLOTS   = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30'];
const TAKEN_IDX   = [2, 5, 9, 13, 18];
let selectedTime  = null;

function renderTimeSlots() {
  const grid = document.getElementById('time-slots-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!selectedDate) {
    const p = document.createElement('p');
    p.style.cssText = 'font-size:.8rem;color:rgba(255,255,255,0.32);letter-spacing:.04em;grid-column:1/-1;padding:.75rem 0;';
    p.textContent = 'Izaberite datum.';
    grid.appendChild(p);
    return;
  }

  ALL_SLOTS.forEach((slot, idx) => {
    const isTaken = TAKEN_IDX.includes(idx);
    const btn = document.createElement('button');
    btn.className = 'time-slot' + (isTaken ? ' time-slot--taken' : '') + (slot === selectedTime ? ' time-slot--selected' : '');
    btn.textContent = slot;
    btn.setAttribute('aria-label', slot + (isTaken ? ' — zauzeto' : ' — dostupno'));
    if (isTaken) { btn.setAttribute('disabled', ''); btn.setAttribute('aria-disabled', 'true'); }
    else btn.addEventListener('click', () => { selectedTime = slot; renderTimeSlots(); updateSummary(); });
    grid.appendChild(btn);
  });
}

renderTimeSlots();

/* ─── CONTACT FIELDS — live validation ───────────────────── */
document.getElementById('contact-name')?.addEventListener('input', updateSummary);
document.getElementById('contact-phone')?.addEventListener('input', updateSummary);

/* ─── SUMMARY + CONFIRM ──────────────────────────────────── */
const USLUGE_SR = {
  sisanje: 'Šišanje',
  brijanje: 'Brijanje',
  brada: 'Oblikovanje brade',
  komplet: 'Kompletna usluga'
};
const BERBERI_SR = { nikola: 'Nikola', stefan: 'Stefan', marko: 'Marko' };

function updateSummary() {
  const summaryEl  = document.getElementById('summary-text');
  const confirmBtn = document.getElementById('confirm-btn');
  if (!summaryEl || !confirmBtn) return;

  const nameVal  = document.getElementById('contact-name')?.value.trim();
  const phoneVal = document.getElementById('contact-phone')?.value.trim();

  const allDone = selectedService && selectedBarber && selectedDate && selectedTime && nameVal && phoneVal;

  if (allDone) {
    const d = selectedDate;
    const dateStr = d.getDate() + '. ' + MESECI[d.getMonth()] + ' ' + d.getFullYear() + '.';
    summaryEl.textContent = nameVal + ' · ' + USLUGE_SR[selectedService] + ' · ' + BERBERI_SR[selectedBarber] + ' · ' + dateStr + ' · ' + selectedTime + 'h';
    confirmBtn.removeAttribute('disabled');
  } else {
    const missing = [];
    if (!selectedDate)  missing.push('datum');
    if (!selectedTime)  missing.push('vreme');
    if (!nameVal)       missing.push('ime');
    if (!phoneVal)      missing.push('telefon');
    summaryEl.textContent = missing.length
      ? 'Nedostaje: ' + missing.join(', ') + '.'
      : 'Izaberite sve podatke za zakazivanje.';
    confirmBtn.setAttribute('disabled', '');
  }
}

/* ─── BOOKING MODAL ──────────────────────────────────────── */
const confirmBtn   = document.getElementById('confirm-btn');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose   = document.getElementById('modal-close');
const modalBody    = document.getElementById('modal-body');

function openModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.add('is-open');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalClose?.focus();
}
function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('is-open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  confirmBtn?.focus();
}

confirmBtn?.addEventListener('click', () => {
  if (!selectedDate || !selectedTime) return;
  const nameVal  = document.getElementById('contact-name')?.value.trim();
  const phoneVal = document.getElementById('contact-phone')?.value.trim();
  if (!nameVal || !phoneVal) return;

  const d = selectedDate;
  const dateStr = d.getDate() + '. ' + MESECI[d.getMonth()] + ' ' + d.getFullYear() + '.';
  if (modalBody) {
    modalBody.textContent =
      nameVal + ', termin za ' + USLUGE_SR[selectedService] +
      ' kod ' + BERBERI_SR[selectedBarber] +
      ', ' + dateStr + ' u ' + selectedTime + 'h je zakazan.' +
      ' Pozvacemo vas na ' + phoneVal + ' radi potvrde.';
  }
  openModal();
});

modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay?.classList.contains('is-open')) closeModal();
});
