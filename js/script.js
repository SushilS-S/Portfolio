'use strict';

console.log('[script.js] loaded');

// ─── HELPERS ────────────────────────────────────────────────────────────────

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const addActiveClass    = el => el.classList.add('active');
const removeActiveClass = el => el.classList.remove('active');

// ─── SIDEBAR TOGGLE (mobile) ─────────────────────────────────────────────────

const sidebar    = $('[data-sidebar]');
const sidebarBtn = $('[data-sidebar-btn]');

if (sidebarBtn) {
  sidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });
}

// ─── TAB NAVIGATION ───────────────────────────────────────────────────────────

const navLinks = $$('[data-nav-link]');
const pages    = $$('[data-page]');

console.log('[script.js] navLinks found:', navLinks.length, 'pages found:', pages.length);

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const target = link.textContent.trim().toLowerCase();
    console.log('[script.js] nav clicked:', target);

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
if (selectBox && selectList) {
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
    if (selectValue) selectValue.textContent = value;
    if (selectList) selectList.classList.remove('active');
    filterProjects(value);
    // Keep desktop buttons in sync
    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim() === value);
    });
  });
});

// Close select on outside click
document.addEventListener('click', e => {
  if (selectBox && selectList && !selectBox.parentElement.contains(e.target)) {
    selectList.classList.remove('active');
  }
});

