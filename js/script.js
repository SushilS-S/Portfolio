'use strict';

// ─── HELPERS ────────────────────────────────────────────────────────────────

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const addActiveClass    = el => el.classList.add('active');
const removeActiveClass = el => el.classList.remove('active');

// ─── SIDEBAR TOGGLE (mobile) ─────────────────────────────────────────────────

const sidebar    = $('[data-sidebar]');
const sidebarBtn = $('[data-sidebar-btn]');

sidebarBtn.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// ─── TESTIMONIALS MODAL ───────────────────────────────────────────────────────

const testimonialItems = $$('[data-testimonials-item]');
const modal            = $('[data-modal-container]');
const overlay          = $('[data-overlay]');
const closeBtn         = $('[data-modal-close-btn]');
const modalImg         = $('[data-modal-img]');
const modalTitle       = $('[data-modal-title]');
const modalText        = $('[data-modal-text]');

function openModal(item) {
  modalImg.src     = $('[data-testimonials-avatar]', item).src;
  modalImg.alt     = $('[data-testimonials-avatar]', item).alt;
  modalTitle.textContent = $('[data-testimonials-title]', item).textContent;
  modalText.innerHTML    = $('[data-testimonials-text]', item).innerHTML;
  addActiveClass(modal);
}

testimonialItems.forEach(item => {
  item.addEventListener('click', () => openModal(item));
});

[overlay, closeBtn].forEach(el => {
  el.addEventListener('click', () => removeActiveClass(modal));
});

// Close modal on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    removeActiveClass(modal);
  }
});

// ─── TAB NAVIGATION ───────────────────────────────────────────────────────────

const navLinks = $$('[data-nav-link]');
const pages    = $$('[data-page]');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const target = link.textContent.trim().toLowerCase();

    navLinks.forEach(removeActiveClass);
    pages.forEach(removeActiveClass);

    addActiveClass(link);

    const page = pages.find(p => p.dataset.page === target);
    if (page) addActiveClass(page);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ─── PORTFOLIO FILTER ─────────────────────────────────────────────────────────

const filterBtns  = $$('[data-filter-btn]');
const filterItems = $$('[data-filter-item]');
const selectBox   = $('[data-select]');
const selectList  = $('.select-list');
const selectItems = $$('[data-select-item]');
const selectValue = $('[data-selecct-value]');

function filterProjects(category) {
  const lower = category.toLowerCase();
  filterItems.forEach(item => {
    const match = lower === 'all' || item.dataset.category === lower;
    item.classList.toggle('active', match);
  });
}

// Desktop filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(removeActiveClass);
    addActiveClass(btn);
    filterProjects(btn.textContent.trim());
  });
});

// Mobile select dropdown
if (selectBox) {
  selectBox.addEventListener('click', () => {
    selectList.classList.toggle('active');
    selectBox.querySelector('.select-icon ion-icon').setAttribute(
      'name',
      selectList.classList.contains('active') ? 'chevron-up' : 'chevron-down'
    );
  });
}

selectItems.forEach(item => {
  item.addEventListener('click', () => {
    const value = item.textContent.trim();
    selectValue.textContent = value;
    selectList.classList.remove('active');
    filterProjects(value);
    // Keep desktop buttons in sync
    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim() === value);
    });
  });
});

// Close select on outside click
document.addEventListener('click', e => {
  if (selectBox && !selectBox.parentElement.contains(e.target)) {
    selectList.classList.remove('active');
  }
});

// ─── CONTACT FORM — ENABLE/DISABLE BUTTON ────────────────────────────────────

const form    = $('[data-form]');
const formBtn = $('[data-form-btn]');
const inputs  = $$('[data-form-input]');

if (form && formBtn) {
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      formBtn.disabled = !form.checkValidity();
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    // Replace this with a real form service (e.g. Formspree) when deploying
    formBtn.textContent = 'Message Sent!';
    formBtn.disabled = true;
    setTimeout(() => {
      form.reset();
      formBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>';
      formBtn.disabled = true;
    }, 3000);
  });
}
