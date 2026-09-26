(() => { const stored = localStorage.getItem('portfolio-theme'); if (stored === 'dark' || (!stored && matchMedia('(prefers-color-scheme: dark)').matches)) document.body.classList.add('dark-theme'); document.addEventListener('click', e => { const btn = e.target.closest('.theme-btn'); if (!btn) return; document.body.classList.toggle('dark-theme'); localStorage.setItem('portfolio-theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light'); }); })();

(() => {
  const page = document.body.dataset.page || '';
  const homeUrl = page === 'home' ? 'index.html' : '../index.html';
  const sectionUrl = file => page === 'home' ? `pages/${file}` : file;
  const items = [['Home', homeUrl, 'home welcome'], ['About', sectionUrl('about.html'), 'about skills experience process'], ['Projects', sectionUrl('projects.html'), 'projects aurora luma mori noya'], ['Services', sectionUrl('services.html'), 'services front end development ui ux website redesign landing page'], ['Contact', sectionUrl('contact.html'), 'contact email hire'], ['Skills', sectionUrl('about.html'), 'html css javascript figma webflow']];
  document.addEventListener('input', event => { if (event.target.id !== 'siteSearch') return; const query = event.target.value.trim().toLowerCase(), output = document.querySelector('.search-results'); output.innerHTML = query ? items.filter(item => item.join(' ').toLowerCase().includes(query)).map(item => `<a href="${item[1]}">${item[0]}</a>`).join('') || `<a href="${sectionUrl('404.html')}">No results found</a>` : ''; });
  document.addEventListener('click', event => { const toggle = event.target.closest('.search-btn'), popover = document.querySelector('.search-pop'); if (toggle && popover) { popover.classList.toggle('open'); if (popover.classList.contains('open')) setTimeout(() => document.querySelector('#siteSearch').focus(), 100); } else if (popover && !event.target.closest('.search-pop')) popover.classList.remove('open'); });
})();

(() => { const grid = document.querySelector('.projects-grid'); if (!grid) return; const cards = [...grid.querySelectorAll('.project-card')], filters = [...document.querySelectorAll('.filter')], search = document.querySelector('#projectSearch'), empty = document.querySelector('.empty-state'), count = document.querySelector('.results-count'); let active = 'all', query = ''; function render() { let shown = 0; cards.forEach(card => { const yes = (active === 'all' || card.dataset.category.includes(active)) && card.dataset.search.includes(query); card.classList.toggle('is-hidden', !yes); if (yes) shown++ }); empty.hidden = shown !== 0; count.textContent = `${shown} project${shown === 1 ? '' : 's'} shown`; } filters.forEach(btn => btn.addEventListener('click', () => { active = btn.dataset.filter; filters.forEach(b => b.classList.toggle('active', b === btn)); render() })); search.addEventListener('input', () => { query = search.value.trim().toLowerCase(); render() }); render(); })();

(() => {
    const form = document.querySelector('#contactForm');
    if (!form) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let valid = true;

        [...form.elements]
            .filter(el => el.name)
            .forEach(el => {
                const small = el.closest('label')?.querySelector('small');

                let error = '';

                if (!el.value.trim()) {
                    error = 'This field is required.';
                } else if (
                    el.type === 'email' &&
                    !emailRegex.test(el.value)
                ) {
                    error = 'Please enter a valid email.';
                }

                if (small) {
                    small.textContent = error;
                }

                if (error) {
                    valid = false;
                }
            });

        if (!valid) return;

        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;

        button.disabled = true;
        button.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

        const formData = new FormData(form);

        try {
            const response = await fetch(
                'https://formspree.io/f/xbgrdkez',
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.ok) {
                form.hidden = true;

                const success = form.parentElement.querySelector('.form-success');

                if (success) {
                    success.hidden = false;
                }

                const toast = document.querySelector('.toast');

                if (toast) {
                    toast.textContent = 'Message sent successfully.';
                    toast.classList.add('show');

                    setTimeout(() => {
                        toast.classList.remove('show');
                    }, 3500);
                }

                form.reset();
            } else {
                throw new Error('Form submission failed.');
            }

        } catch (error) {
            console.error(error);

            button.disabled = false;
            button.innerHTML = originalText;

            const toast = document.querySelector('.toast');

            if (toast) {
                toast.textContent =
                    'Something went wrong. Please try again.';
                toast.classList.add('show');

                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3500);
            }
        }
    });
})();

(() => {
  const page = document.body.dataset.page || '';
  const homeUrl = page === 'home' ? 'index.html' : '../index.html';
  const sectionUrl = file => page === 'home' ? `pages/${file}` : file;
  const header = document.querySelector('#site-header');
  const footer = document.querySelector('#site-footer');
  const links = [['Home', homeUrl, 'home'], ['About', sectionUrl('about.html'), 'about'], ['Projects', sectionUrl('projects.html'), 'projects'], ['Services', sectionUrl('services.html'), 'services'], ['Contact', sectionUrl('contact.html'), 'contact']];

  header.innerHTML = `<nav class="site-nav"><div class="nav-inner"><a class="brand" href="${homeUrl}" aria-label="Muhammad Hibban home">hibban</a><div class="nav-links">${links.map(([name, url, key]) => `<a class="${page === key ? 'active' : ''}" href="${url}">${name}</a>`).join('')}</div><div class="nav-tools"><button class="icon-btn theme-btn" aria-label="Toggle color theme"><i class="fa-solid fa-moon moon"></i><i class="fa-solid fa-sun sun"></i></button><button class="icon-btn search-btn" aria-label="Search site"><i class="fa-solid fa-magnifying-glass"></i></button><button class="icon-btn menu-btn" aria-label="Open navigation" aria-expanded="false"><i class="fa-solid fa-bars"></i></button></div><div class="search-pop"><i class="fa-solid fa-magnifying-glass"></i><input id="siteSearch" type="search" placeholder="Search pages, work, skills"><div class="search-results"></div></div></div></nav>`;
  footer.innerHTML = `<div class="footer-inner"><div class="footer-top"><div class="footer-brand"><a class="brand" href="${homeUrl}">hibban</a><p>Intentional digital experiences, designed and developed from the inside out.</p></div><div class="footer-col"><h3>Navigate</h3>${links.slice(0, 4).map(([name, url]) => `<a href="${url}">${name}</a>`).join('')}</div><div class="footer-col"><h3>Connect</h3><a href="mailto:hibbanfarhan.17@gmail.com">Email</a><a href="https://www.linkedin.com/in/hibban-farhan/">LinkedIn</a>
  <a href="https://github.com/hibbanfarhan17-ctrl">GitHub</a></div>
  <div class="footer-col">
    <h3>A quiet note</h3>
    <div class="newsletter">
      <input type="email" aria-label="Newsletter email" placeholder="Your email address">
      <button aria-label="Subscribe">
        <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  </div>
  </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} Muhammad Hibban. All rights reserved.</span><div class="social-inline"><a href="https://www.facebook.com/share/196jkhukdf/">Facebook</a><a href="https://www.instagram.com/_hibbanfarhan_">Instagram</a></div></div></div>`;

  if (page !== 'home') document.querySelectorAll('a[href="index.html"]').forEach(link => { link.href = homeUrl; });

  const whatsappUrl = 'https://wa.me/923353388265/?text=Hello!%20I%20am%20interested%20in%20your%20services.%20Please%20share%20more%20details.';
  const footerConnect = [...footer.querySelectorAll('.footer-col')].find(column => column.querySelector('h3')?.textContent === 'Connect');
  footerConnect?.insertAdjacentHTML('beforeend', `<a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">WhatsApp</a>`);
  document.querySelector('.social-row')?.insertAdjacentHTML('beforeend', `<a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>`);

  const nav = header.querySelector('.site-nav');
  const menu = header.querySelector('.menu-btn');
  const navLinks = header.querySelector('.nav-links');
  const back = document.querySelector('.back-top');
  const closeMenu = () => { navLinks.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); const icon = menu?.querySelector('i'); if (icon) icon.className = 'fa-solid fa-bars'; };
  menu?.addEventListener('click', () => { const open = navLinks.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.querySelector('i').className = `fa-solid fa-${open ? 'xmark' : 'bars'}`; });
  navLinks?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); }, { passive: true });
  window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', scrollY > 15); back?.classList.toggle('show', scrollY > 500); }, { passive: true });
  back?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  const typed = document.querySelector('.typed');
  if (typed) { const words = ['UI/UX Designer', 'Creative Thinker', 'Detail Obsessed']; let word = 0, char = 0, deleting = false; const type = () => { const current = words[word]; typed.textContent = current.slice(0, char); if (!deleting && char < current.length) { char++; setTimeout(type, 85); } else if (!deleting) { deleting = true; setTimeout(type, 1450); } else if (char > 0) { char--; setTimeout(type, 42); } else { deleting = false; word = (word + 1) % words.length; setTimeout(type, 250); } }; type(); }
  document.addEventListener('input', event => { if (event.target.id !== 'serviceSearch') return; const query = event.target.value.toLowerCase().trim(), cards = [...document.querySelectorAll('.service-card')], empty = document.querySelector('.empty-state'); let found = 0; cards.forEach(card => { const match = card.dataset.service.includes(query); card.classList.toggle('is-hidden', !match); found += match; }); if (empty) empty.hidden = !!found; });
  const homeShowcase = document.querySelector('.project-showcase');
  if (homeShowcase) homeShowcase.innerHTML = `<article class="feature-project project-sms"><div class="project-meta"><span>01 / Web application</span><h3>Student Management System</h3><p>A practical dashboard for managing student records.</p><a href="https://studentdatabasesystem.netlify.app/" target="_blank" rel="noopener noreferrer" aria-label="Visit Student Management System"><i class="fa-solid fa-arrow-up-right-from-square"></i></a></div><img class="feature-image" src="images/student-management-system.png" alt="Student Management System preview"></article><article class="feature-project project-august"><div class="project-meta"><span>02 / Creative website</span><h3>14 August Special</h3><p>A tribute to Pakistan’s freedom and spirit.</p><a href="https://14augustspecial.netlify.app/" target="_blank" rel="noopener noreferrer" aria-label="Visit 14 August Special Website"><i class="fa-solid fa-arrow-up-right-from-square"></i></a></div><img class="feature-image" src="images/14-august-special.png" alt="14 August Special Website preview"></article>`;
  window.addEventListener('mousemove', event => { const glow = document.querySelector('.cursor-glow'); if (glow) { glow.style.left = `${event.clientX}px`; glow.style.top = `${event.clientY}px`; } }, { passive: true });
  window.addEventListener('load', () => document.querySelector('.page-loader')?.classList.add('done'));
})();

/* Portfolio Assistant: local portfolio answers first, then a protected LLM fallback. */
(() => {
  const page = document.body.dataset.page || 'home';
  const contactUrl = page === 'home' ? 'pages/contact.html' : 'contact.html';
  const projectsUrl = page === 'home' ? 'pages/projects.html' : 'projects.html';
  const aboutUrl = page === 'home' ? 'pages/about.html' : 'about.html';
  const servicesUrl = page === 'home' ? 'pages/services.html' : 'services.html';

  const knowledge = [
    { terms: ['who is hibban', 'who is muhammad hibban', 'hibban', 'muhammad hibban', 'about hibban', 'about you', 'introduce'], reply: `Muhammad Hibban is a front-end developer and UI/UX designer. He designs and builds clear, responsive digital experiences with care for both visual details and the people using them. <a href="${aboutUrl}">Learn more about Hibban</a>.` },
    { terms: ['skills', 'technologies', 'tech stack', 'what do you use', 'html', 'css', 'javascript', 'figma', 'webflow'], reply: `Hibban works with HTML, CSS, JavaScript, Figma, Webflow and UI systems. His focus is responsive front-end builds and considered user experiences.` },
    { terms: ['services', 'what do you do', 'what can hibban do', 'hire', 'offer', 'front end', 'frontend', 'ui ux', 'redesign', 'landing page', 'design system', 'portfolio design'], reply: `Hibban offers front-end development, UI/UX design, website redesigns, landing-page design, portfolio design and design systems. <a href="${servicesUrl}">See the services</a>.` },
    { terms: ['projects', 'work', 'portfolio', 'student management', 'sms', '14 august', 'independence', 'rabi ul awwal', 'milad', 'calculator'], reply: `Hibban’s featured work includes a Student Management System, a 14 August Special website, a 12 Rabi ul Awwal Special website and a browser calculator. <a href="${projectsUrl}">Explore the projects</a>.` },
    { terms: ['contact', 'email', 'whatsapp', 'linkedin', 'github', 'get in touch', 'message', 'reach'], reply: `You can contact Hibban at <a href="mailto:hibbanfarhan.17@gmail.com">hibbanfarhan.17@gmail.com</a>, or use the <a href="${contactUrl}">contact form</a>. He also has LinkedIn, GitHub and WhatsApp links on the site.` },
    { terms: ['experience', 'years', 'syntecxhub', 'career', 'job', 'worked'], reply: `Hibban has 1+ years of experience and has delivered 12 projects. He is currently a Front-End Developer at Syntecxhub, collaborating with early-stage companies and creative teams.` },
    { terms: ['location', 'where', 'pakistan', 'remote', 'worldwide', 'country'], reply: `Hibban is based in Pakistan and works remotely with clients worldwide.` },
    { terms: ['price', 'pricing', 'cost', 'budget', 'quote', 'rate'], reply: `Project pricing depends on scope, timeline and goals. Send a few details through the <a href="${contactUrl}">contact form</a> to request a tailored quote.` }
  ];

  const findLocalAnswer = question => {
    const normalized = question.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!normalized) return 'Please type a question and I’ll do my best to help.';
    if (/^(hi|hello|hey|assalam|salam|good morning|good evening)\b/.test(normalized)) return `Hello! I’m Hibban’s portfolio assistant. Ask me about Hibban, his skills, services, projects or how to get in touch.`;
    const match = knowledge.map(item => ({ item, score: item.terms.reduce((score, term) => {
      if (!normalized.includes(term)) return score;
      // “Hibban” is a useful fallback, but must not hide a more specific question such as “Hibban projects”.
      return score + ((term === 'hibban' || term === 'muhammad hibban') ? .2 : term.split(' ').length);
    }, 0) })).sort((a, b) => b.score - a.score)[0];
    return match?.score ? match.item.reply : null;
  };

  document.body.insertAdjacentHTML('beforeend', `
    <section class="portfolio-chat" aria-label="Chat with Hibban's portfolio assistant">
      <div class="portfolio-chat__panel" id="portfolioChatPanel" hidden>
        <div class="portfolio-chat__header"><div><span class="portfolio-chat__status" aria-hidden="true"></span><strong>Ask Hibban’s AI</strong><small>Offline portfolio answers + Puter AI</small></div><button type="button" class="portfolio-chat__close" aria-label="Close chat"><i class="fa-solid fa-xmark"></i></button></div>
        <div class="portfolio-chat__messages" aria-live="polite" role="log"><article class="portfolio-chat__message portfolio-chat__message--bot">Hi! I can answer portfolio questions offline. Ask “Who is Hibban?” or try a question of your own.</article></div>
        <div class="portfolio-chat__suggestions" aria-label="Suggested questions"><button type="button">Who is Hibban?</button><button type="button">What are his skills?</button><button type="button">Show projects</button></div>
        <form class="portfolio-chat__form"><label class="sr-only" for="portfolioChatInput">Your question</label><input id="portfolioChatInput" name="question" autocomplete="off" maxlength="600" placeholder="Ask a question…" required><button type="submit" aria-label="Send question"><i class="fa-solid fa-arrow-up"></i></button></form>
      </div>
      <button class="portfolio-chat__launcher" type="button" aria-controls="portfolioChatPanel" aria-expanded="false"><i class="fa-solid fa-comment-dots"></i><span>Ask Hibban</span></button>
    </section>`);

  const chat = document.querySelector('.portfolio-chat');
  const panel = chat.querySelector('.portfolio-chat__panel');
  const launcher = chat.querySelector('.portfolio-chat__launcher');
  const close = chat.querySelector('.portfolio-chat__close');
  const form = chat.querySelector('.portfolio-chat__form');
  const input = chat.querySelector('input');
  const messages = chat.querySelector('.portfolio-chat__messages');
  const addMessage = (content, role = 'bot', isHtml = false) => {
    const message = document.createElement('article');
    message.className = `portfolio-chat__message portfolio-chat__message--${role}`;
    if (isHtml) message.innerHTML = content; else message.textContent = content;
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
    return message;
  };
  const setOpen = open => { panel.hidden = !open; launcher.setAttribute('aria-expanded', String(open)); if (open) setTimeout(() => input.focus(), 80); };
  const puterContext = `You are the helpful portfolio assistant for Muhammad Hibban. Use only these verified facts for claims about Hibban: he is a front-end developer and UI/UX designer based in Pakistan, working remotely worldwide; his skills include HTML, CSS, JavaScript, Figma, Webflow and UI systems; services include front-end development, UI/UX design, website redesign, landing pages, portfolio design and design systems; projects include Student Management System, 14 August Special, 12 Rabi ul Awwal Special and Calculator; he has 1+ years of experience, 12 delivered projects, and works at Syntecxhub. His email is hibbanfarhan.17@gmail.com. Keep replies short, warm, accurate and useful. Never invent private details, pricing or availability.`;
  const loadPuter = () => {
    if (window.puter?.ai) return Promise.resolve(window.puter);
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-puter-sdk]');
      if (existing) { existing.addEventListener('load', () => resolve(window.puter)); existing.addEventListener('error', reject); return; }
      const sdk = document.createElement('script');
      sdk.src = 'https://js.puter.com/v2/';
      sdk.dataset.puterSdk = 'true';
      sdk.onload = () => window.puter?.ai ? resolve(window.puter) : reject(new Error('Puter AI did not load'));
      sdk.onerror = () => reject(new Error('Puter AI could not load'));
      document.head.append(sdk);
    });
  };
  const askAi = async question => {
    const thinking = addMessage('Thinking…', 'bot');
    try {
      const puter = await loadPuter();
      const response = await puter.ai.chat([{ role: 'system', content: puterContext }, { role: 'user', content: question }], { model: 'grok-4.7', normalize: true });
      const answer = response?.message?.content;
      if (!answer) throw new Error('Puter AI did not return an answer');
      thinking.textContent = answer;
    } catch {
      thinking.innerHTML = `I don’t have an offline answer for that yet, and Puter AI is unavailable. Try asking about Hibban, his skills, services, projects or <a href="${contactUrl}">contact details</a>.`;
    }
  };
  launcher.addEventListener('click', () => setOpen(panel.hidden));
  close.addEventListener('click', () => setOpen(false));
  chat.querySelectorAll('.portfolio-chat__suggestions button').forEach(button => button.addEventListener('click', () => { input.value = button.textContent; form.requestSubmit(); }));
  form.addEventListener('submit', event => { event.preventDefault(); const question = input.value.trim(); if (!question) return; addMessage(question, 'user'); input.value = ''; const localAnswer = findLocalAnswer(question); if (localAnswer) addMessage(localAnswer, 'bot', true); else askAi(question); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) setOpen(false); });
})();
