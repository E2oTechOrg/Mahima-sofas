// Import Bootstrap JS
import { Offcanvas } from 'bootstrap';

import './custom.js';
import './swiper.js';
import './ms-enhance.js';

// Import SCSS
import '../scss/style.scss';
import '../css/ms-enhance.css';

// Mobile offcanvas menu
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('offcanvasMenu');

  if (!menu) return;

  const offcanvas = Offcanvas.getOrCreateInstance(menu);

  // Handle mobile navigation links
  menu.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');

      // Ignore empty or invalid section links
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);

      if (!target) return;

      e.preventDefault();

      // Wait for the offcanvas drawer to finish closing
      menu.addEventListener(
        'hidden.bs.offcanvas',
        () => {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update the URL hash
          history.pushState(null, '', targetId);
        },
        { once: true }
      );

      // Close the mobile menu
      offcanvas.hide();
    });
  });
});