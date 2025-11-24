// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('nav-links');
if (navToggle && navLinks) {
navToggle.addEventListener('click', () => {
const open = navLinks.classList.toggle('is-open');
navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
}


// Scroll reveal: turns [data-reveal] into .reveal when in view
const revealables = document.querySelectorAll('[data-reveal]');
if (revealables.length) {
const io = new IntersectionObserver((entries) => {
entries.forEach((e) => {
if (e.isIntersecting) {
e.target.classList.add('reveal');
io.unobserve(e.target);
}
});
}, { threshold: 0.12 });
revealables.forEach((el) => io.observe(el));
}


// Active link highlight while scrolling
const sections = [...document.querySelectorAll('section[id]')];
const links = [...document.querySelectorAll('.nav-links a[href^="#"], .nav-links a[href$=".html#hero"]')];
function setActive() {
const y = window.scrollY + 140; // offset for sticky header
let current = sections[0]?.id;
sections.forEach((s) => {
if (y >= s.offsetTop) current = s.id;
});
links.forEach((a) => {
const href = a.getAttribute('href') || '';
const id = href.split('#')[1];
a.classList.toggle('active', id === current);
});
}
window.addEventListener('scroll', setActive);
window.addEventListener('load', setActive);


// Optional: subtle parallax on hero image
// const heroImg = document.querySelector('.hero-image img');
// if (heroImg) {
// window.addEventListener('scroll', () => {
// const dy = Math.min(30, window.scrollY * 0.06);
// heroImg.style.transform = `translateY(${dy}px)`;
// }, { passive: true });
// }


// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// Typing effect: gradient only on "Maulik", neat spacing
const preEl  = document.querySelector(".fx-pre");
const nameEl = document.querySelector(".fx-name");
const postEl = document.querySelector(".fx-post");
const roleEl = document.querySelector(".fx-role");

if (preEl && nameEl && postEl && roleEl) {
  const pre  = "Hello! I'm ";
  const name = "Maulik";
  const post = ","; // comma after the name
  const role = "A Mechanical Engineer.";

  let i = 0, j = 0, k = 0, m = 0;

  function typePre() {
    if (i < pre.length) {
      preEl.textContent += pre.charAt(i++);
      return setTimeout(typePre, 70);
    }
    setTimeout(typeName, 70);
  }

  function typeName() {
    if (j < name.length) {
      nameEl.textContent += name.charAt(j++);
      return setTimeout(typeName, 80);
    }
    setTimeout(typePost, 60);
  }

  function typePost() {
    if (k < post.length) {
      postEl.textContent += post.charAt(k++);
      return setTimeout(typePost, 70);
    }
    setTimeout(typeRole, 350); // tiny pause before 2nd line
  }

  function typeRole() {
    if (m < role.length) {
      roleEl.textContent += role.charAt(m++);
      return setTimeout(typeRole, 80);
    }
  }

  // start after initial page settle
  setTimeout(typePre, 500);
}

// === Fade out "scroll" indicator when user scrolls down ===
function toggleScrollIndicator() {
  const indicator = document.querySelector('.scroll-indicator');
  if (!indicator) return;
  const y = window.scrollY || document.documentElement.scrollTop || 0;
  indicator.classList.toggle('is-hidden', y > 80);
}

document.addEventListener('DOMContentLoaded', toggleScrollIndicator);
window.addEventListener('load', toggleScrollIndicator);
window.addEventListener('scroll', toggleScrollIndicator, { passive: true });

// === Navbar: shrink on scroll, active link, mobile toggle ===
(function () {
  const header = document.querySelector('.site-header');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  const nav = document.getElementById('nav-links');
  const toggle = document.querySelector('.nav-toggle');
  const overlay = document.querySelector('.nav-overlay');

  // shrink on scroll
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    header?.classList.toggle('scrolled', y > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // simple scrollspy (marks closest section as active)
  const sections = [...links]
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const spy = () => {
    const mid = (window.scrollY || 0) + window.innerHeight * 0.35;
    let current = null;
    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      if (mid >= top - 10) current = sec;
    }
    links.forEach(a => a.classList.remove('is-active'));
    if (current) {
      const active = [...links].find(a => a.getAttribute('href') === `#${current.id}`);
      active?.classList.add('is-active');
    }
  };
  window.addEventListener('scroll', spy, { passive: true });
  window.addEventListener('load', spy);

  // mobile toggle
  const setOpen = (open) => {
    if (!nav) return;
    nav.classList.toggle('is-open', open);
    toggle?.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (overlay) overlay.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle?.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  overlay?.addEventListener('click', () => setOpen(false));
  links.forEach(a => a.addEventListener('click', () => setOpen(false)));
})();


// === Mobile drawer: position under header & toggling ==============
(function () {
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('nav-links');
  const toggle = document.querySelector('.nav-toggle');
  const overlay = document.querySelector('.nav-overlay');

  if (!header || !nav || !toggle) return;

  // Compute top offset from current header height
  function setNavTop() {
    const h = header.offsetHeight || 64;
    document.documentElement.style.setProperty('--nav-top', (h + 8) + 'px');
  }
  setNavTop();
  window.addEventListener('resize', setNavTop);
  window.addEventListener('load', setNavTop);

  // Open/close helpers
  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (overlay) overlay.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  overlay?.addEventListener('click', () => setOpen(false));

  // Close when clicking any in-page link
  nav.querySelectorAll('a[href^="#"]').forEach(a =>
    a.addEventListener('click', () => setOpen(false))
  );
})();



// === Scroll progress bar ===
(function () {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = progress + '%';
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('load', updateProgress);
})();


// ==========================================
// About section: animated counters
// ==========================================
(function () {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!('IntersectionObserver' in window) || !statNumbers.length) return;

  const animateCounter = (element, target) => {
    let current = 0;
    const steps = 50;
    const increment = target / steps;
    const interval = 30;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, interval);
  };

  const statObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-count'), 10) || 0;
          animateCounter(entry.target, target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(stat => statObserver.observe(stat));
})();

// ==========================================
// About section: 3D tilt on skill cards
// ==========================================
(function () {
  const tiltCards = document.querySelectorAll('.tilt-card');
  if (!tiltCards.length) return;

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 18;  // smaller divisor = stronger tilt
      const rotateY = (centerX - x) / 18;

      card.style.transform =
        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    });
  });
})();





// ===== PREMIUM PASTEL BLUE DOT CURSOR =====
(function () {
  if (!window.matchMedia('(pointer:fine)').matches) return;

  const dot = document.querySelector('.cursor-dot');
  if (!dot) return;

  let mouseX = 0;
  let mouseY = 0;

  // Instant movement
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const hover = document.body.classList.contains('cursor-hover');
    const scale = hover ? 1.7 : 1;

    dot.style.transform =
      `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%) scale(${scale})`;

    document.body.classList.remove('cursor-hidden');
  });

  // Hide on window exit
  window.addEventListener('mouseleave', () => {
    document.body.classList.add('cursor-hidden');
  });

  // Clickable hover targets
  const hoverTargets = `
    a, button, .btn, .nav-toggle,
    .project-card, .skill-card, .nav-links a
  `;

  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });
})();


// ===== Work Selector: tie radios to right-hand panels =====
document.addEventListener('DOMContentLoaded', () => {
  const radios = document.querySelectorAll('input[name="work-tab"]');
  const panels = document.querySelectorAll('.work-panel-view');

  if (!radios.length || !panels.length) return;

  function setActivePanel(id) {
    panels.forEach(panel => {
      panel.classList.toggle('is-active', panel.classList.contains(id));
    });
  }

  // Initialize on load (w1 is checked by default)
  const checked = document.querySelector('input[name="work-tab"]:checked');
  if (checked) setActivePanel(checked.id);

  // Update on change
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        setActivePanel(radio.id); // id = w1, w2, etc. matches panel class
      }
    });
  });
});



// ===============================
// WORK SELECTOR AUTO-ROTATE (simple)
// ===============================
(function () {
  const section = document.querySelector('.work-selector');
  if (!section) return;

  const tabs = Array.from(section.querySelectorAll('input[name="work-tab"]'));
  const panels = Array.from(section.querySelectorAll('.work-panel-view'));
  if (!tabs.length || !panels.length) return;

  let currentIndex = tabs.findIndex(t => t.checked);
  if (currentIndex < 0) currentIndex = 0;

  let rotateInterval = null;
  let resumeTimeout = null;

  function setActive(index) {
    currentIndex = index;

    // update radios
    tabs.forEach((tab, i) => {
      tab.checked = i === index;
    });

    // update panels
    panels.forEach(panel => panel.classList.remove('is-active'));
    if (panels[index]) {
      panels[index].classList.add('is-active');
    }
  }

  function startAutoRotate() {
    clearInterval(rotateInterval);
    rotateInterval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % tabs.length;
      setActive(nextIndex);
    }, 7000); // 7 seconds
  }

  function pauseAutoRotateForUser() {
    clearInterval(rotateInterval);
    clearTimeout(resumeTimeout);

    // resume auto-rotate after 1 minute
    resumeTimeout = setTimeout(() => {
      startAutoRotate();
    }, 60000);
  }

  // When user clicks/changes a tab: show that panel and pause rotation
  tabs.forEach((tab, index) => {
    tab.addEventListener('change', () => {
      setActive(index);
      pauseAutoRotateForUser();
    });
  });

  // Initial setup
  setActive(currentIndex);
  startAutoRotate();
})();



document.addEventListener('DOMContentLoaded', () => {
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (!timelineItems.length) return;

  // give each item a small stagger delay
  timelineItems.forEach((item, index) => {
    item.style.setProperty('--tl-delay', `${index * 70}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // reveal once, then stop observing that item
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.35, // item needs ~35% in view
    }
  );

  timelineItems.forEach((item) => observer.observe(item));
});



document.addEventListener("click", (e) => {
  if (e.target.classList.contains("copy-btn")) {
    const text = e.target.getAttribute("data-copy");
    navigator.clipboard.writeText(text);
    e.target.textContent = "Copied!";
    setTimeout(() => e.target.textContent = "Copy", 1200);
  }
});







// ===== Staggered reveal for project cards =====
(function () {
  const items = document.querySelectorAll('.proj-feed-item');
  if (!items.length || !('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('proj-reveal-in');
      obs.unobserve(el);
    });
  }, { threshold: 0.2 });

  items.forEach((item, index) => {
    item.style.setProperty('--proj-delay', `${index * 70}ms`);
    obs.observe(item);
  });
})();



// ===== Make entire project cards clickable =====
(function () {
  const cards = document.querySelectorAll('.proj-feed-item[data-href]');
  if (!cards.length) return;

  cards.forEach(card => {
    card.style.cursor = 'pointer';

    card.addEventListener('click', (e) => {
      // If user clicked a real link inside, let that behave normally
      if (e.target.closest('a')) return;

      const url = card.getAttribute('data-href');
      if (url) {
        window.location.href = url;
      }
    });
  });
})();



// ===== INDIVIDUAL PROJECT PAGE: Scroll Reveal + Active Nav =====
(function () {
  const sections = document.querySelectorAll(
    '.proj-docs-section, .proj-docs-visual-main, .proj-docs-visual-card'
  );
  const navLinks = document.querySelectorAll('.proj-docs-link');

  if (!sections.length || !navLinks.length) return; // not on a docs page → bail

  document.body.classList.add('js-doc-reveal');

  // ---------- 1) REVEAL ANIMATION ----------
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    {
      threshold: 0.18,
    }
  );

  sections.forEach((sec) => revealObserver.observe(sec));

  // ---------- 2) ACTIVE LINK ON SCROLL ----------
  const header = document.querySelector('.site-header');
  const headerOffset = header ? header.offsetHeight + 12 : 72;

  const idToLink = new Map();
  navLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#')) return;
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (target) {
      idToLink.set(id, link);
    }
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        if (!id) return;

        const activeLink = idToLink.get(id);
        if (!activeLink) return;

        navLinks.forEach((a) => a.classList.remove('is-active'));
        activeLink.classList.add('is-active');
      });
    },
    {
      root: null,
      // "active region" is slightly below the sticky header and not too close to bottom
      rootMargin: `-${headerOffset}px 0px -55% 0px`,
      threshold: 0.25,
    }
  );

  document
    .querySelectorAll('.proj-docs-section[id]')
    .forEach((sec) => sectionObserver.observe(sec));

  // ---------- 3) SMOOTH SCROLL WITH HEADER OFFSET ON CLICK ----------
  navLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#')) return;

    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();

      const rect = target.getBoundingClientRect();
      const offsetTop = rect.top + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });

      // Immediately reflect selection in sidebar
      navLinks.forEach((a) => a.classList.remove('is-active'));
      link.classList.add('is-active');
    });
  });
})();



// ===== Simple project media carousel (docs pages) =====
// ===== Project Page Carousel (images + full-duration videos) =====
document.querySelectorAll(".proj-carousel").forEach(carousel => {
  const slides = [...carousel.querySelectorAll(".proj-slide")];
  const dotsContainer = carousel.querySelector(".proj-carousel-dots");

  if (!slides.length || !dotsContainer) return;

  let index = 0;
  let autoplayTimer = null;

  // --- Create dots ---
  slides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "proj-carousel-dot" + (i === 0 ? " is-active" : "");
    dot.dataset.index = i;
    dotsContainer.appendChild(dot);
  });

  const dots = [...dotsContainer.children];

  function clearAllVideos() {
    slides.forEach(slide => {
      const vid = slide.querySelector("video");
      if (vid) {
        vid.pause();
      }
    });
  }

  function queueNext() {
    clearTimeout(autoplayTimer);

    const activeSlide = slides[index];
    const video = activeSlide.querySelector("video");

    // default delay for images
    let delay = 5500;

    if (video && !isNaN(video.duration) && video.duration > 0.5) {
      delay = video.duration * 1000; // full video length
    }

    autoplayTimer = setTimeout(() => {
      const nextIndex = (index + 1) % slides.length;
      showSlide(nextIndex); // <-- no special fromAuto flag
    }, delay);
  }

  function showSlide(i) {
    slides.forEach(s => s.classList.remove("is-active"));
    dots.forEach(d => d.classList.remove("is-active"));

    slides[i].classList.add("is-active");
    dots[i].classList.add("is-active");
    index = i;

    // reset videos
    clearAllVideos();

    const activeVideo = slides[i].querySelector("video");
    if (activeVideo) {
      activeVideo.currentTime = 0;

      const startPlayback = () => {
        const playPromise = activeVideo.play();
        if (playPromise && typeof playPromise.then === "function") {
          playPromise.catch(() => {
            // ignore autoplay errors (e.g. not allowed without user gesture)
          });
        }
        // once we know duration, schedule next slide
        queueNext();
      };

      if (isNaN(activeVideo.duration) || activeVideo.duration === Infinity) {
        // wait for metadata, then play + queue next
        activeVideo.addEventListener("loadedmetadata", startPlayback, { once: true });
      } else {
        startPlayback();
      }
    } else {
      // image slide → just schedule next with default delay
      queueNext();
    }
  }

  // --- Arrow buttons ---
  const leftArrow  = carousel.querySelector(".proj-carousel-arrow.left");
  const rightArrow = carousel.querySelector(".proj-carousel-arrow.right");

  if (leftArrow) {
    leftArrow.addEventListener("click", () => {
      const nextIndex = (index - 1 + slides.length) % slides.length;
      showSlide(nextIndex);
    });
  }

  if (rightArrow) {
    rightArrow.addEventListener("click", () => {
      const nextIndex = (index + 1) % slides.length;
      showSlide(nextIndex);
    });
  }

  // --- Dot click ---
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const target = Number(dot.dataset.index);
      if (!Number.isNaN(target)) {
        showSlide(target);
      }
    });
  });

  // initial state (this will also start autoplay)
  showSlide(0);
});




// About-carousel initializer (namespaced)
document.querySelectorAll('.about-carousel').forEach(carousel => {
  const slides = [...carousel.querySelectorAll('.about-slide')];
  const dotsContainer = carousel.querySelector('.about-carousel-dots');
  if (!slides.length || !dotsContainer) return;

  let index = 0;
  let autoplayTimer = null;

  // create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'about-carousel-dot' + (i === 0 ? ' is-active' : '');
    dot.dataset.index = i;
    dotsContainer.appendChild(dot);
  });
  const dots = [...dotsContainer.children];

  function clearAllVideos() {
    slides.forEach(slide => {
      const vid = slide.querySelector('video');
      if (vid) vid.pause();
    });
  }

  function scheduleNext() {
    clearTimeout(autoplayTimer);
    let delay = 4500; // default for images
    autoplayTimer = setTimeout(() => showSlide((index + 1) % slides.length, { fromAuto: true }), delay);
  }

  function showSlide(i, opts = {}) {
    const { fromAuto = false } = opts;
    slides.forEach(s => s.classList.remove('is-active'));
    dots.forEach(d => d.classList.remove('is-active'));
    slides[i].classList.add('is-active');
    dots[i].classList.add('is-active');
    index = i;
    clearAllVideos();
    const activeVideo = slides[i].querySelector('video');
    if (activeVideo) {
      activeVideo.currentTime = 0;
      const prom = activeVideo.play();
      if (prom && typeof prom.then === 'function') prom.catch(()=>{/* ignore play errors */});
    }
    if (!fromAuto) scheduleNext();
  }

  // arrows
  const left = carousel.querySelector('.about-carousel-arrow.left');
  const right = carousel.querySelector('.about-carousel-arrow.right');
  if (left) left.addEventListener('click', () => showSlide((index - 1 + slides.length) % slides.length));
  if (right) right.addEventListener('click', () => showSlide((index + 1) % slides.length));

  // dots
  dots.forEach(dot => dot.addEventListener('click', () => {
    const target = Number(dot.dataset.index);
    if (!Number.isNaN(target)) showSlide(target);
  }));

  // init
  showSlide(0);
});
