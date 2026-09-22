/* Ambient Three.js backdrop: starfield + drifting gold particles + optional crescent.
   Configure per-page via `window.SCENE_CONFIG` before this script runs. */
(function () {
  const config = Object.assign(
    { crescent: true, particleCount: 220, starCount: 1800, reducedOnMobile: true },
    window.SCENE_CONFIG || {}
  );

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmall = window.innerWidth < 760;
  if (isSmall && config.reducedOnMobile) {
    config.particleCount = Math.round(config.particleCount * 0.35);
    config.starCount = Math.round(config.starCount * 0.5);
  }

  const mount = document.querySelector('.scene-layer');
  if (!mount || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 60;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  mount.appendChild(renderer.domElement);

  // --- Starfield ---
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(config.starCount * 3);
  for (let i = 0; i < config.starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 900;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 600;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 600 - 100;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xfffdf5, size: 0.9, transparent: true, opacity: 0.75 });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // --- Gold drifting particles ---
  const partGeo = new THREE.BufferGeometry();
  const partPositions = new Float32Array(config.particleCount * 3);
  const partSpeeds = new Float32Array(config.particleCount);
  for (let i = 0; i < config.particleCount; i++) {
    partPositions[i * 3] = (Math.random() - 0.5) * 260;
    partPositions[i * 3 + 1] = (Math.random() - 0.5) * 160;
    partPositions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    partSpeeds[i] = 0.02 + Math.random() * 0.05;
  }
  partGeo.setAttribute('position', new THREE.BufferAttribute(partPositions, 3));
  const partMat = new THREE.PointsMaterial({
    color: 0xd4af37, size: 1.6, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(partGeo, partMat);
  scene.add(particles);

  // --- Crescent moon (torus arc, minimal geometric form) ---
  let crescent;
  if (config.crescent) {
    const group = new THREE.Group();
    const outer = new THREE.Mesh(
      new THREE.SphereGeometry(14, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0xf4d58d, transparent: true, opacity: 0.9 })
    );
    const mask = new THREE.Mesh(
      new THREE.SphereGeometry(12, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x020b09 })
    );
    mask.position.x = 6;
    group.add(outer, mask);
    group.position.set(70, 55, -150);
    scene.add(group);
    crescent = group;
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (!prefersReduced) {
      stars.rotation.y = t * 0.005;
      const pos = particles.geometry.attributes.position;
      for (let i = 0; i < config.particleCount; i++) {
        pos.array[i * 3 + 1] += Math.sin(t * partSpeeds[i] + i) * 0.01;
        pos.array[i * 3] += Math.cos(t * partSpeeds[i] + i) * 0.006;
      }
      pos.needsUpdate = true;
      if (crescent) crescent.rotation.z = Math.sin(t * 0.1) * 0.05;

      camera.position.x += (mouseX * 6 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 4 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
    }

    renderer.render(scene, camera);
  }
  animate();
})();
/* Shared navigation behavior across all navbar styles */
(function () {
  // Cinematic navbar scroll state
  const cinematicNav = document.querySelector('.nav-cinematic');
  if (cinematicNav) {
    const onScroll = () => {
      cinematicNav.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile menu (styles 1-3)
  const mobileToggle = document.querySelector('.nav-mobile-toggle, .mobile-nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (mobileToggle && mobileMenu) {
    const closeBtn = mobileMenu.querySelector('.close-btn');
    const open = () => { mobileMenu.classList.add('is-open'); document.body.style.overflow = 'hidden'; };
    const close = () => { mobileMenu.classList.remove('is-open'); document.body.style.overflow = ''; };
    mobileToggle.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', close);
    mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  }

  // Immersive circular menu (style 4)
  const immersiveTrigger = document.querySelector('.nav-immersive-trigger');
  const immersiveOverlay = document.querySelector('.nav-immersive-overlay');
  if (immersiveTrigger && immersiveOverlay) {
    const closeBtn = immersiveOverlay.querySelector('.close-btn');
    const open = () => { immersiveOverlay.classList.add('is-open'); document.body.style.overflow = 'hidden'; };
    const close = () => { immersiveOverlay.classList.remove('is-open'); document.body.style.overflow = ''; };
    immersiveTrigger.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', close);
    immersiveOverlay.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  }

  // Mark active nav link based on current path
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-immersive-menu a, .mobile-menu a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href && href.split('/').pop() === path) a.classList.add('active');
  });

  // Cinematic page-transition on internal link clicks
  const transitionEl = document.querySelector('.page-transition');
  if (transitionEl && window.gsap) {
    document.querySelectorAll('a[href$=".html"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (link.target === '_blank' || e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        gsap.to(transitionEl, {
          scaleY: 1,
          duration: 0.5,
          ease: 'power3.inOut',
          transformOrigin: 'bottom',
          onComplete: () => { window.location.href = href; },
        });
      });
    });
    window.addEventListener('pageshow', () => {
      gsap.set(transitionEl, { transformOrigin: 'top' });
      gsap.to(transitionEl, { scaleY: 0, duration: 0.6, ease: 'power3.inOut' });
    });
  }
})();
/* 12 Rabi ul Awwal countdown — target date is configurable and NOT hard-coded into markup. */
(function () {
  // ---- CONFIGURE THE TARGET DATE HERE ----
  // Update this each year to the estimated Gregorian date of 12 Rabi ul Awwal.
  // Islamic calendar dates are moon-sighting dependent, so treat this as approximate.
  const targetDate = new Date('2026-08-25T00:00:00').getTime();
  // -----------------------------------------

  const root = document.querySelector('[data-countdown]');
  if (!root) return;

  const els = {
    days: root.querySelector('[data-days]'),
    hours: root.querySelector('[data-hours]'),
    minutes: root.querySelector('[data-minutes]'),
    seconds: root.querySelector('[data-seconds]'),
  };
  const liveState = root.querySelector('[data-countdown-active]');
  const completeState = root.querySelector('[data-countdown-complete]');

  function pad(n) { return String(n).padStart(2, '0'); }

  function render(prevValues) {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (liveState) liveState.style.display = 'none';
      if (completeState) completeState.style.display = 'block';
      return null;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    const values = { days, hours, minutes, seconds };
    Object.keys(values).forEach((key) => {
      const el = els[key];
      if (!el) return;
      const next = pad(values[key]);
      if (!prevValues || prevValues[key] !== values[key]) {
        el.textContent = next;
        if (window.gsap && prevValues) {
          gsap.fromTo(el, { y: -8, opacity: 0.4 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
        }
      }
    });
    return values;
  }

  let prev = render(null);
  const timer = setInterval(() => {
    prev = render(prev);
    if (prev === null) clearInterval(timer);
  }, 1000);
})();
/* Shared GSAP reveal + entrance animation helpers */
(function () {
  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Generic scroll reveal for any [data-reveal] element
  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    if (prefersReduced) { el.style.opacity = 1; el.style.transform = 'none'; return; }
    gsap.fromTo(
      el,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: (i % 3) * 0.08,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      }
    );
  });

  // Staggered reveal for groups: [data-reveal-group] > children
  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    const children = group.children;
    if (prefersReduced) { Array.from(children).forEach((c) => (c.style.opacity = 1)); return; }
    gsap.fromTo(
      children,
      { opacity: 0, y: 26 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: group, start: 'top 85%' },
      }
    );
  });

  // Hero entrance sequence: elements with [data-hero-in], ordered by DOM order
  const heroEls = document.querySelectorAll('[data-hero-in]');
  if (heroEls.length) {
    if (prefersReduced) {
      heroEls.forEach((el) => (el.style.opacity = 1));
    } else {
      gsap.fromTo(
        heroEls,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.14, delay: 0.2 }
      );
    }
  }
})();
/* Blog data + dynamic rendering, filtering, and search */
(function () {
  const POSTS = [
    {
      id: 'seerah-still-matters',
      title: 'Why the Seerah Still Matters Today',
      category: 'Seerah',
      excerpt: 'The life of the Prophet ﷺ is studied not as distant history, but as a living reference point for character and conduct.',
      readTime: '8 min read',
      date: 'Aug 2, 2026',
      image: 'https://images.unsplash.com/photo-1564769625392-651b2c17ea55?q=80&w=900&auto=format&fit=crop',
      href: 'article-1.html',
    },
    {
      id: 'meaning-of-the-date',
      title: 'The Meaning of 12 Rabi ul Awwal',
      category: '12 Rabi ul Awwal',
      excerpt: 'Why this date is widely observed, and how different communities mark it with remembrance and reflection.',
      readTime: '5 min read',
      date: 'Jul 28, 2026',
      image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=900&auto=format&fit=crop',
      href: 'article-2.html',
    },
    {
      id: 'mercy-way-of-life',
      title: 'Mercy as a Way of Life',
      category: 'Mercy',
      excerpt: 'Exploring how mercy shaped everyday interactions, from family life to leadership and conflict.',
      readTime: '6 min read',
      date: 'Jul 21, 2026',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=900&auto=format&fit=crop',
      href: 'article-3.html',
    },
    {
      id: 'lessons-in-character',
      title: 'Lessons in Character from the Seerah',
      category: 'Character',
      excerpt: 'Honesty, humility, and patience as recurring threads across the accounts of his early and later life.',
      readTime: '7 min read',
      date: 'Jul 14, 2026',
      image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=900&auto=format&fit=crop',
      href: 'article-4.html',
    },
    {
      id: 'patience-through-trial',
      title: 'Patience Through Trial: Makkah to Madinah',
      category: 'History',
      excerpt: 'A look at the years of hardship in Makkah and the migration that reshaped the early Muslim community.',
      readTime: '9 min read',
      date: 'Jul 5, 2026',
      image: 'https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?q=80&w=900&auto=format&fit=crop',
      href: 'article-5.html',
    },
    {
      id: 'sourcing-the-seerah',
      title: 'Sourcing the Seerah: How Scholars Verify History',
      category: 'Islamic Knowledge',
      excerpt: 'An introduction to the disciplines of hadith and seerah scholarship that separate authenticated reports from weaker ones.',
      readTime: '6 min read',
      date: 'Jun 29, 2026',
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=900&auto=format&fit=crop',
      href: 'article-6.html',
    },
  ];

  const grid = document.querySelector('[data-blog-grid]');
  if (!grid) return;

  const searchInput = document.querySelector('[data-blog-search]');
  const pills = document.querySelectorAll('[data-category-pill]');
  const resultsCount = document.querySelector('[data-results-count]');
  const emptyState = document.querySelector('[data-blog-empty]');

  let activeCategory = 'All';
  let query = '';

  function cardHTML(post) {
    return `
      <a href="${post.href}" class="blog-card glass">
        <div class="media"><img src="${post.image}" alt="" loading="lazy" /></div>
        <div class="card-body">
          <span class="card-category">${post.category}</span>
          <h4>${post.title}</h4>
          <p>${post.excerpt}</p>
          <div class="card-meta">
            <span>${post.date} · ${post.readTime}</span>
            <span class="read-link">Read <span class="arr">→</span></span>
          </div>
        </div>
      </a>`;
  }

  function render() {
    const filtered = POSTS.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesQuery =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });

    grid.innerHTML = filtered.map(cardHTML).join('');
    if (resultsCount) {
      resultsCount.textContent = query
        ? `${filtered.length} result${filtered.length === 1 ? '' : 's'} for "${query}"`
        : `${filtered.length} article${filtered.length === 1 ? '' : 's'}`;
    }
    if (emptyState) emptyState.classList.toggle('is-visible', filtered.length === 0);

    if (window.gsap) {
      gsap.fromTo(grid.children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' });
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      query = e.target.value.trim().toLowerCase();
      render();
    });
  }

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      activeCategory = pill.dataset.categoryPill;
      render();
    });
  });

  render();
})();
/* Gallery lightbox */
(function () {
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImg = document.querySelector('[data-lightbox-img]');
  if (!lightbox || !lightboxImg) return;

  const closeBtn = lightbox.querySelector('.close-btn');

  document.querySelectorAll('[data-lightbox-item] img').forEach((img) => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src.replace('w=800', 'w=1600');
      lightboxImg.alt = img.alt;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();
/* Reflection page: begin-reflection interaction */
(function () {
  const btn = document.querySelector('[data-begin-reflection]');
  const hero = document.querySelector('[data-reflection-hero]');
  const prompts = document.querySelector('[data-reflection-prompts]');
  if (!btn || !hero || !prompts) return;

  btn.addEventListener('click', () => {
    hero.classList.add('is-dimmed');
    btn.style.display = 'none';

    // Slow the ambient scene if present
    document.documentElement.style.setProperty('--reflection-active', '1');

    prompts.classList.add('is-visible');
    if (window.gsap) {
      gsap.fromTo(
        prompts.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out', stagger: 0.25, delay: 0.4 }
      );
    }

    setTimeout(() => {
      prompts.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 600);
  });
})();
/* Timeline page: fill the vertical track as the user scrolls through events */
(function () {
  const wrap = document.querySelector('[data-timeline-wrap]');
  const fill = document.querySelector('[data-timeline-fill]');
  if (!wrap || !fill) return;

  function update() {
    const rect = wrap.getBoundingClientRect();
    const viewportCenter = window.innerHeight * 0.5;
    const total = rect.height;
    const progressed = Math.min(Math.max(viewportCenter - rect.top, 0), total);
    const pct = (progressed / total) * 100;
    fill.style.height = `${pct}%`;
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();

/* Home-only CSS 3D scene. This is deliberately dependency-free: the site still
   feels alive if a visitor is offline or blocks third-party scripts. */
(function () {
  if (document.body.dataset.page !== 'home' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const scene = document.querySelector('.scene-layer');
  if (!scene) return;
  const orb = document.createElement('div');
  orb.className = 'orbital-moon';
  const ring = document.createElement('div');
  ring.className = 'orbital-ring';
  const stars = document.createElement('div');
  stars.className = 'css-stars';
  for (let i = 0; i < 42; i += 1) {
    const star = document.createElement('i');
    star.style.setProperty('--x', `${Math.random() * 100}%`);
    star.style.setProperty('--y', `${Math.random() * 100}%`);
    star.style.setProperty('--d', `${2 + Math.random() * 4}s`);
    stars.appendChild(star);
  }
  scene.append(stars, ring, orb);
  const aurora = document.createElement('div');
  aurora.className = 'aurora-veil';
  const halo = document.createElement('div');
  halo.className = 'moon-halo';
  scene.append(aurora, halo);
  window.addEventListener('pointermove', (event) => {
    const x = event.clientX / innerWidth - .5;
    const y = event.clientY / innerHeight - .5;
    scene.style.setProperty('--tilt-x', `${y * -9}deg`);
    scene.style.setProperty('--tilt-y', `${x * 12}deg`);
  }, { passive: true });
})();

/* Imam al-Nawawi's Forty Hadith: short study prompts with their source books.
   The linked collection provides the complete narration and chain context. */
(function () {
  const list = document.querySelector('[data-hadith-list]');
  if (!list) return;
  const hadith = [
    ['Intentions give actions their value.', 'Sahih al-Bukhari & Sahih Muslim'],
    ['Islam, faith, and excellence are the foundations of religion.', 'Sahih Muslim'],
    ['Islam is built upon five pillars.', 'Sahih al-Bukhari & Sahih Muslim'],
    ['Creation, provision, lifespan, deeds, and final outcome are known to Allah.', 'Sahih al-Bukhari & Sahih Muslim'],
    ['What is introduced into religion without its basis is rejected.', 'Sahih al-Bukhari & Sahih Muslim'],
    ['The lawful and unlawful are clear; avoid doubtful matters.', 'Sahih al-Bukhari & Sahih Muslim'],
    ['Religion is sincere, beneficial counsel.', 'Sahih Muslim'],
    ['Life and property are protected by the testimony of faith and its duties.', 'Sahih al-Bukhari & Sahih Muslim'],
    ['Avoid prohibitions and do commanded deeds to the best of your ability.', 'Sahih al-Bukhari & Sahih Muslim'],
    ['Allah is good and accepts only what is good.', 'Sahih Muslim'],
    ['Leave what makes you doubtful for what does not.', 'Jami at-Tirmidhi & Sunan an-Nasai'],
    ['Part of excellent Islam is leaving what does not concern one.', 'Jami at-Tirmidhi'],
    ['Love for others what you love for yourself.', 'Sahih al-Bukhari & Sahih Muslim'],
    ['Human life is sacred except by a right established in law.', 'Sahih al-Bukhari & Sahih Muslim'],
    ['Speak good or remain silent; honour neighbours and guests.', 'Sahih al-Bukhari & Sahih Muslim'],
    ['Do not give in to anger.', 'Sahih al-Bukhari'],
    ['Practice excellence and mercy in every task.', 'Sahih Muslim'],
    ['Be mindful of Allah, follow a wrong with a good, and show good character.', 'Jami at-Tirmidhi'],
    ['Be mindful of Allah and seek His help with trust.', 'Jami at-Tirmidhi'],
    ['If you feel no shame, you may do as you wish.', 'Sahih al-Bukhari'],
    ['Say, “I believe in Allah,” then remain steadfast.', 'Sahih Muslim'],
    ['Fulfilling the obligations and respecting lawful and unlawful leads to Paradise.', 'Sahih Muslim'],
    ['Purification, prayer, charity, patience, and the Quran guide a believer.', 'Sahih Muslim'],
    ['Allah forbids oppression and calls His servants to seek His guidance and forgiveness.', 'Sahih Muslim'],
    ['Every good act and helping gesture can be charity.', 'Sahih Muslim'],
    ['Every joint has a daily charity; reconciling people is among them.', 'Sahih al-Bukhari & Sahih Muslim'],
    ['Righteousness is good character; sin troubles the heart.', 'Sahih Muslim'],
    ['Hold firmly to the Sunnah and beware newly invented religious matters.', 'Sunan Abi Dawud & Jami at-Tirmidhi'],
    ['The paths of goodness include prayer, fasting, charity, and guarding the tongue.', 'Jami at-Tirmidhi'],
    ['Allah prescribed duties and limits; do not neglect or overstep them.', 'Sunan ad-Daraqutni'],
    ['Live with detachment from worldly excess and people’s possessions.', 'Sunan Ibn Majah'],
    ['There should be neither harming nor reciprocating harm.', 'Sunan Ibn Majah'],
    ['A claimant needs proof; an oath is required of one who denies.', 'Al-Bayhaqi'],
    ['Change wrongdoing with hand, speech, or heart according to ability.', 'Sahih Muslim'],
    ['Do not envy, hate, or turn away from one another; be servants of Allah and siblings.', 'Sahih Muslim'],
    ['Relieve hardship, conceal faults, help others, and seek knowledge.', 'Sahih Muslim'],
    ['Good intentions are recorded and good deeds are multiplied.', 'Sahih al-Bukhari & Sahih Muslim'],
    ['Nearness to Allah grows through obligations and voluntary deeds.', 'Sahih al-Bukhari'],
    ['Mistakes, forgetfulness, and coercion are pardoned for this community.', 'Sunan Ibn Majah'],
    ['Live in this world like a traveller or passing stranger.', 'Sahih al-Bukhari']
  ];
  list.innerHTML = hadith.map(([teaching, source], index) => {
    const number = index + 1;
    return `<article class="hadith-card glass"><span class="hadith-number">HADITH ${String(number).padStart(2, '0')}</span><h3>${teaching}</h3><p>Study the complete narration and its scholarly explanation before drawing detailed rulings.</p><a class="hadith-source" href="https://sunnah.com/nawawi40/${number}" target="_blank" rel="noopener noreferrer">Source: ${source} ↗</a></article>`;
  }).join('');
})();

/* Shared footer social links. Keeping this in the common app ensures that new
   pages automatically receive the same contact options. */
(function () {
  const footer = document.querySelector('.site-footer');
  if (!footer || footer.querySelector('.footer-socials')) return;
  const links = [
    ['WhatsApp', 'https://wa.me/923353388265?text=I%20want%20detailed%20info%20about%20your%20services.', '◉'],
    ['GitHub', 'https://github.com/hibbanfarhan17-ctrl', '⌘'],
    ['LinkedIn', 'https://www.linkedin.com/in/hibban-farhan', 'in'],
    ['Facebook', 'https://www.facebook.com/share/196jkhukdf/', 'f'],
    ['Instagram', 'https://instagram.com/_hibbanfarhan_', '◎']
  ];
  const social = document.createElement('div');
  social.className = 'footer-socials';
  social.setAttribute('aria-label', 'Social links');
  social.innerHTML = links.map(([name, url, mark]) => `<a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${name}" title="${name}"><span aria-hidden="true">${mark}</span><b>${name}</b></a>`).join('');
  const bottom = footer.querySelector('.footer-bottom');
  if (bottom) bottom.before(social); else footer.append(social);
})();

/* Replace page-specific footers with one navigable footer on every route. */
(function () {
  const isHome = document.body.dataset.page === 'home';
  const pageRoot = isHome ? 'pages/' : '';
  const home = isHome ? 'index.html' : '../index.html';
  let footer = document.querySelector('.site-footer');
  if (!footer) { footer = document.createElement('footer'); footer.className = 'site-footer'; document.body.append(footer); }
  footer.innerHTML = `<div class="footer-glow" aria-hidden="true"></div><div class="container">
    <div class="footer-top"><div class="footer-brand"><h3>12 Rabi ul Awwal</h3><p>A space to remember, reflect, and learn from the life and character of Prophet Muhammad ﷺ.</p></div>
      <div class="footer-cols"><div class="footer-col"><h4>Explore</h4><a href="${home}">Home</a><a href="${pageRoot}seerah.html">Seerah</a><a href="${pageRoot}timeline.html">Timeline</a></div>
      <div class="footer-col"><h4>Learn</h4><a href="${pageRoot}teachings.html">Teachings</a><a href="${pageRoot}hadith.html">40 Hadith</a><a href="${pageRoot}blogs.html">Blogs</a></div>
      <div class="footer-col"><h4>Discover</h4><a href="${pageRoot}reflection.html">Reflection</a><a href="${pageRoot}gallery.html">Gallery</a><a href="${pageRoot}about.html">About &amp; Sources</a></div></div>
    </div><div class="footer-socials" aria-label="Social links">
      <a href="https://wa.me/923353388265?text=I%20want%20detailed%20info%20about%20your%20services." target="_blank" rel="noopener noreferrer"><span aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.6a10.6 10.6 0 0 1-5.4-1.5l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6Zm5.8-7.9c-.3-.2-1.8-.9-2.1-1s-.5-.2-.8.2c-.2.3-.8 1-.9 1.2s-.3.2-.6 0a8.6 8.6 0 0 1-2.5-1.6 9.3 9.3 0 0 1-1.7-2.2c-.2-.3 0-.5.1-.6l.5-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6l-1-2.3c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.9 1.3 3.3 1.5 3.5c.2.2 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.5Z"/></svg></span><b>WhatsApp</b></a><a href="https://github.com/hibbanfarhan17-ctrl" target="_blank" rel="noopener noreferrer"><span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 .5A11.5 11.5 0 0 0 8.4 22.9c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6a4.7 4.7 0 0 1 1.2-3.2c-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.7.2 2.9.1 3.2a4.7 4.7 0 0 1 1.2 3.2c0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5Z"/></svg></span><b>GitHub</b></a><a href="https://www.linkedin.com/in/hibban-farhan" target="_blank" rel="noopener noreferrer"><span>in</span><b>LinkedIn</b></a><a href="https://www.facebook.com/share/196jkhukdf/" target="_blank" rel="noopener noreferrer"><span>f</span><b>Facebook</b></a><a href="https://instagram.com/_hibbanfarhan_" target="_blank" rel="noopener noreferrer"><span>◎</span><b>Instagram</b></a>
    </div><div class="footer-bottom"><span class="footer-tagline">Remember. Reflect. Live.</span><span class="footer-meta">© 2026 · 12 Rabi ul Awwal</span></div></div>`;
})();

/* Persistent, keyboard-accessible return-to-top control. */
(function () {
  const button = document.createElement('button');
  button.className = 'scroll-top';
  button.type = 'button';
  button.setAttribute('aria-label', 'Scroll to the top of the page');
  button.innerHTML = '<span aria-hidden="true">↑</span>';
  document.body.append(button);
  const sync = () => button.classList.toggle('is-visible', scrollY > 360);
  sync();
  addEventListener('scroll', sync, { passive: true });
  button.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* Calm, lightweight motion for the inner pages. */
(function () {
  if (document.body.dataset.page === 'home') return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = document.querySelector('.scene-layer');
  if (scene && !reduced) {
    const orb = document.createElement('div');
    orb.className = 'page-ambient-orb';
    scene.append(orb);
  }
  const targets = [...document.querySelectorAll('main .section-head, main .glass, main .timeline-item, main .story-card, main .blog-card, main [data-reveal]')];
  targets.forEach((element, index) => {
    element.classList.add('page-reveal');
    element.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 70}ms`);
  });
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach((element) => element.classList.add('is-revealed'));
  } else {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); }
    }), { threshold: .08, rootMargin: '0px 0px -35px' });
    targets.forEach((element) => observer.observe(element));
  }
  if (innerWidth >= 760 && !reduced) {
    document.querySelectorAll('main .glass, main .blog-card').forEach((card) => {
      card.classList.add('inner-depth-card');
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }
})();

/* Give the home content a restrained physical response to a pointer. */
(function () {
  if (document.body.dataset.page !== 'home' || innerWidth < 760 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.feature-card, .countdown-card').forEach((card) => {
    card.classList.add('depth-card');
    card.addEventListener('pointermove', (event) => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5;
      const y = (event.clientY - box.top) / box.height - .5;
      card.style.transform = `perspective(800px) rotateX(${y * -7}deg) rotateY(${x * 8}deg) translateZ(10px)`;
      card.style.setProperty('--glow-x', `${(x + .5) * 100}%`);
      card.style.setProperty('--glow-y', `${(y + .5) * 100}%`);
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
})();

/* One consistent site navbar. It replaces the older page-specific variants so
   every route has the same navigation, behavior, and visual hierarchy. */
(function () {
  const oldHeader = document.querySelector('header');
  if (!oldHeader) return;
  const isHome = document.body.dataset.page === 'home';
  const pageRoot = isHome ? 'pages/' : '';
  const home = isHome ? 'index.html' : '../index.html';
  const current = location.pathname.split('/').pop() || 'index.html';
  const item = (file, label) => `<a href="${pageRoot}${file}"${current === file ? ' class="active"' : ''}>${label}</a>`;
  const header = document.createElement('header');
  header.className = 'nav-cinematic';
  header.innerHTML = `
    <div class="nav-inner">
      <a href="${home}" class="nav-brand"><span class="crescent">☾</span> 12 Rabi ul Awwal</a>
      <nav class="nav-links" aria-label="Primary">
        <a href="${home}"${isHome ? ' class="active"' : ''}>Home</a>
        ${item('seerah.html', 'Seerah')}
        ${item('timeline.html', 'Timeline')}
        ${item('teachings.html', 'Teachings')}
        ${item('hadith.html', 'Hadith')}
        ${item('blogs.html', 'Blogs')}
      </nav>
      <div class="nav-cta"><a href="${pageRoot}teachings.html" class="btn btn-gold">Begin Journey <span class="btn-arrow">→</span></a></div>
      <button class="nav-mobile-toggle mobile-nav-toggle" aria-label="Open menu"><span></span></button>
    </div>`;
  oldHeader.replaceWith(header);

  const priorMenu = document.querySelector('.mobile-menu');
  const menu = document.createElement('div');
  menu.className = 'mobile-menu';
  menu.innerHTML = `<button class="close-btn" aria-label="Close menu">×</button>
    <a href="${home}">Home</a>${item('seerah.html', 'Seerah')}${item('timeline.html', 'Timeline')}
    ${item('teachings.html', 'Teachings')}${item('hadith.html', 'Hadith')}${item('blogs.html', 'Blogs')}
    ${item('reflection.html', 'Reflection')}${item('gallery.html', 'Gallery')}${item('about.html', 'About')}`;
  if (priorMenu) priorMenu.replaceWith(menu); else document.body.append(menu);

  const toggle = header.querySelector('.nav-mobile-toggle');
  const close = menu.querySelector('.close-btn');
  const setMenu = (open) => { menu.classList.toggle('is-open', open); document.body.style.overflow = open ? 'hidden' : ''; };
  toggle.addEventListener('click', () => setMenu(true));
  close.addEventListener('click', () => setMenu(false));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  const updateNav = () => header.classList.toggle('is-scrolled', scrollY > 40);
  updateNav();
  addEventListener('scroll', updateNav, { passive: true });
})();

/* A brief, respectful 3D opening moment before the home page becomes active. */
(function () {
  if (document.body.dataset.page !== 'home' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const intro = document.createElement('div');
  intro.className = 'site-intro';
  intro.setAttribute('aria-hidden', 'true');
  intro.innerHTML = `<div class="intro-door intro-door-left"></div><div class="intro-door intro-door-right"></div>
    <div class="intro-content"><span class="intro-crescent">☾</span><p>12 Rabi ul Awwal</p><small>A journey of mercy, light &amp; reflection</small></div>`;
  document.body.prepend(intro);
  requestAnimationFrame(() => intro.classList.add('is-playing'));
  const finish = () => { intro.classList.add('is-finished'); setTimeout(() => intro.remove(), 850); };
  setTimeout(finish, 2200);
  intro.addEventListener('click', finish, { once: true });
})();
