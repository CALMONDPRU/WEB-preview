document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('siteNav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Allow the "Our Products" item (and nested items like Roofline) to expand as an accordion on mobile
document.querySelectorAll('.has-dropdown > a, .has-submenu > a').forEach((link) => {
  link.addEventListener('click', (e) => {
    if (window.matchMedia('(max-width: 880px)').matches) {
      e.preventDefault();
      link.parentElement.classList.toggle('is-open');
    } else {
      // Desktop: let the anchor jump happen, then blur so the dropdown
      // doesn't stay stuck open via :focus-within after the click.
      setTimeout(() => link.blur(), 0);
    }
  });
});

// Close mobile nav after choosing a link
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    const parent = link.parentElement.classList;
    if (window.matchMedia('(max-width: 880px)').matches && !parent.contains('has-dropdown') && !parent.contains('has-submenu')) {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', false);
    }
  });
});

// Close mobile nav when tapping anywhere outside the open panel
document.addEventListener('click', (e) => {
  if (
    nav.classList.contains('is-open') &&
    !nav.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', false);
  }
});
