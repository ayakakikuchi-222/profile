const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuButton.classList.toggle('is-active', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuButton.classList.remove('is-active');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const header = document.querySelector('.site-header');

if (header) {
  const isMobile = () => window.matchMedia('(max-width: 900px)').matches;

  const updateHeaderState = () => {
    const triggerPoint = window.innerHeight * (isMobile() ? 0.75 : 1);
    header.classList.toggle('is-scrolled', window.scrollY > triggerPoint);
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
  window.addEventListener('resize', updateHeaderState);
}

// Project/Work image galleries (Swiper, loaded via CDN — see index.html <head>).
// Each ".project-gallery" card gets its own independent main+thumbs Swiper pair
// (its thumbnails only ever drive its own main image, never another card's),
// but the autoplay "tick" is shared across all of them via a single interval
// below, so every gallery advances to its next slide at the same moment
// instead of drifting apart over time.
if (typeof Swiper !== 'undefined') {
  const mainSwipers = [];

  document.querySelectorAll('.project-gallery').forEach((gallery) => {
    const mainEl = gallery.querySelector('.project-gallery__main');
    const thumbsEl = gallery.querySelector('.project-gallery__thumbs');
    if (!mainEl || !thumbsEl) return;

    const thumbsSwiper = new Swiper(thumbsEl, {
      slidesPerView: 'auto',
      spaceBetween: 8,
      freeMode: true,
      watchSlidesProgress: true,
    });

    const mainSwiper = new Swiper(mainEl, {
      rewind: true,
      speed: 800,
      thumbs: { swiper: thumbsSwiper },
    });

    mainSwipers.push(mainSwiper);
  });

  if (mainSwipers.length) {
    setInterval(() => {
      mainSwipers.forEach((swiper) => swiper.slideNext());
    }, 4000);
  }
}
