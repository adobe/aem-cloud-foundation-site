import { readBlockConfig, decorateIcons } from '../../scripts/scripts.js';

const BRAND_IMG = '<img loading="lazy" alt="Adobe" src="/blocks/header/adobe-logo.svg">';

/**
 * collapses all open nav sections
 * @param {Element} sections The container element
 */

function collapseAllNavSections(sections) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', 'false');
  });
}

function decorateLogo() {
  const logo = document.body.querySelector('.adobe-logo a');
  logo.classList.add('nav-logo');
  logo.setAttribute('aria-label', logo.textContent);
  logo.textContent = '';
  logo.insertAdjacentHTML('afterbegin', BRAND_IMG);
  return logo;
}

function navExpanded(nav) {
  return nav.getAttribute('aria-expanded') === 'true';
}

function toggleNav(nav, expanded) {
  document.body.style.overflowY = expanded ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch nav content
  const navPath = cfg.nav || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.innerHTML = html;
    decorateIcons(nav);

    const classes = ['brand', 'sections', 'tools'];
    classes.forEach((e, j) => {
      const section = nav.children[j];
      if (section) section.classList.add(`nav-${e}`);
    });

    const navSections = [...nav.children][1];
    if (navSections) {
      navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
        navSection.addEventListener('click', () => {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          collapseAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        });
      });

      navSections.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          const expanded = navExpanded(nav);
          if (expanded) {
            toggleNav(nav, expanded);
          }
        });
      });
    }

    // hamburger for mobile
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = '<div class="nav-hamburger-icon"></div>';
    hamburger.addEventListener('click', () => {
      toggleNav(nav, navExpanded(nav));
    });
    nav.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'false');
    decorateIcons(nav);
    block.append(nav);
  }

  // decorate brand logo
  decorateLogo();
}
