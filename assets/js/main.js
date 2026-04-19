/* ========================================
   TRIVARTA TECH - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

  // ===== Scroll Progress Bar =====
  var progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.setAttribute('data-testid', 'scroll-progress');
  document.body.prepend(progressBar);

  // ===== Back to Top Button =====
  var backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('data-testid', 'back-to-top-btn');
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '<i class="fas fa-arrow-up text-sm"></i>';
  document.body.appendChild(backToTop);
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', function () {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = ((scrollTop / docHeight) * 100) + '%';
    backToTop.classList.toggle('visible', scrollTop > 400);
  }, { passive: true });

  // ===== Navbar Scroll =====
  var navbar = document.getElementById('navbar');
  if (navbar) {
    var onScroll = function () {
      navbar.classList.toggle('navbar-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ===== Mobile Menu =====
  var mobileBtn = document.getElementById('mobile-menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('menu-open');
      if (isOpen) {
        mobileMenu.classList.remove('menu-open');
        setTimeout(function () { mobileMenu.classList.add('hidden'); }, 400);
      } else {
        mobileMenu.classList.remove('hidden');
        void mobileMenu.offsetHeight;
        mobileMenu.classList.add('menu-open');
        var items = mobileMenu.querySelectorAll('a, div.pt-3');
        items.forEach(function (item, idx) {
          item.style.opacity = '0';
          item.style.transform = 'translateX(-16px)';
          setTimeout(function () {
            item.style.transition = 'all 0.28s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          }, 50 + idx * 35);
        });
      }
      var icon = mobileBtn.querySelector('i');
      icon.className = isOpen ? 'fas fa-bars' : 'fas fa-times';
    });
    mobileMenu.querySelectorAll('a:not([id])').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('menu-open');
        setTimeout(function () { mobileMenu.classList.add('hidden'); }, 400);
        mobileBtn.querySelector('i').className = 'fas fa-bars';
      });
    });
  }

  // ===== Mobile Dropdowns =====
  [
    { toggle: 'mobile-products-toggle', submenu: 'mobile-products-submenu' },
    { toggle: 'mobile-services-toggle', submenu: 'mobile-services-submenu' }
  ].forEach(function (dd) {
    var toggle = document.getElementById(dd.toggle);
    var submenu = document.getElementById(dd.submenu);
    if (toggle && submenu) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        var isOpen = !submenu.classList.contains('hidden');
        submenu.classList.toggle('hidden');
        var chevron = toggle.querySelector('.fa-chevron-down');
        if (chevron) chevron.classList.toggle('rotate-180');
        if (!isOpen) {
          submenu.querySelectorAll('a').forEach(function (link, idx) {
            link.style.opacity = '0';
            link.style.transform = 'translateX(-10px)';
            setTimeout(function () {
              link.style.transition = 'all 0.22s ease';
              link.style.opacity = '1';
              link.style.transform = 'translateX(0)';
            }, 50 + idx * 55);
          });
        }
      });
    }
  });

  // ===== Active Nav Link =====
  var path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    link.classList.remove('active');
    if (path === '/' && href === '/') link.classList.add('active');
    else if (href !== '/' && path.startsWith(href)) link.classList.add('active');
  });

  // ===== Counter Animation =====
  var counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    var animateCounter = function (el) {
      var target = parseInt(el.getAttribute('data-counter'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 2000;
      var startTime = null;
      var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
      var step = function (ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / dur, 1);
        el.textContent = Math.floor(easeOut(progress) * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.classList.add('counted');
      };
      requestAnimationFrame(step);
    };
    var counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { counterObs.observe(c); });
  }

  // ===== Typing Effect (other pages) =====
  var typingEl = document.querySelector('[data-typing]');
  if (typingEl) {
    var words = typingEl.getAttribute('data-typing').split(',');
    var wordIndex = 0, charIndex = 0, isDeleting = false;
    var cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    typingEl.parentNode.insertBefore(cursor, typingEl.nextSibling);
    function typeLoop() {
      var current = words[wordIndex];
      if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }
      var delay = isDeleting ? 40 : 80;
      if (!isDeleting && charIndex === current.length) { delay = 2200; isDeleting = true; }
      else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; delay = 400; }
      setTimeout(typeLoop, delay);
    }
    typeLoop();
  }

  // ===== Ripple Effect =====
  document.querySelectorAll('.btn-primary, .btn-whatsapp, .btn-outline, .btn-secondary').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var ripple = document.createElement('span');
      ripple.style.cssText = [
        'position:absolute',
        'border-radius:50%',
        'background:rgba(255,255,255,0.25)',
        'pointer-events:none',
        'width:' + size + 'px',
        'height:' + size + 'px',
        'left:' + (e.clientX - rect.left - size / 2) + 'px',
        'top:' + (e.clientY - rect.top - size / 2) + 'px',
        'transform:scale(0)',
        'animation:rippleAnim 0.5s ease-out forwards'
      ].join(';');
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });
  });
  var rippleStyle = document.createElement('style');
  rippleStyle.textContent = '@keyframes rippleAnim{to{transform:scale(2.5);opacity:0;}}';
  document.head.appendChild(rippleStyle);

  // ===== Smooth Reveal (other pages fallback) =====
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { revealObs.observe(el); });
  }

  // ===== Touch feedback =====
  if ('ontouchstart' in window) {
    document.querySelectorAll('.glass-card, .card, .module-item').forEach(function (el) {
      el.addEventListener('touchstart', function () {
        el.style.borderColor = 'rgba(255,59,48,0.25)';
      }, { passive: true });
      el.addEventListener('touchend', function () {
        setTimeout(function () { el.style.borderColor = ''; }, 250);
      }, { passive: true });
    });
  }

  // ===== GSAP Animations =====
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Set initial states explicitly so GSAP owns the animation
    gsap.set('.hero-badge', { opacity: 0, y: -8 });
    gsap.set('.hero-word', { opacity: 0, y: 44 });
    gsap.set('.hero-sub', { opacity: 0, y: 16 });
    gsap.set('.hero-actions', { opacity: 0, y: 16 });
    gsap.set('.hero-card', { opacity: 0, x: 44 });

    // Hero entrance timeline
    var heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 });
    heroTimeline
      .to('.hero-badge', { opacity: 1, y: 0, duration: 0.7 })
      .to('.hero-word', { opacity: 1, y: 0, duration: 0.75, stagger: 0.07 }, '-=0.3')
      .to('.hero-sub', { opacity: 1, y: 0, duration: 0.7 }, '-=0.2')
      .to('.hero-actions', { opacity: 1, y: 0, duration: 0.7 }, '-=0.45')
      .to('.hero-card', { opacity: 1, x: 0, duration: 0.75, stagger: 0.14 }, '-=0.6');

    if (typeof ScrollTrigger !== 'undefined') {
      // Section reveals
      document.querySelectorAll('.gsap-reveal').forEach(function (el) {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          opacity: 0,
          y: 44,
          duration: 0.9,
          ease: 'power3.out'
        });
      });

      // Staggered card reveals
      var cardGroups = {};
      document.querySelectorAll('.gsap-card').forEach(function (el) {
        var parent = el.parentElement;
        if (!cardGroups[parent]) cardGroups[parent] = [];
        cardGroups[parent].push(el);
      });
      Object.values(cardGroups).forEach(function (group) {
        group.forEach(function (el, i) {
          gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            opacity: 0,
            y: 54,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.12
          });
        });
      });

      // Feature items slide in from right
      document.querySelectorAll('.gsap-feature').forEach(function (el, i) {
        gsap.to(el, {
          scrollTrigger: { trigger: el, start: 'top 87%', once: true },
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power3.out',
          delay: i * 0.09
        });
      });

      // Orb parallax on scroll
      gsap.to('.orb-1', {
        scrollTrigger: { trigger: '.hero-section', scrub: 1.5 },
        y: -120, x: 60,
      });
      gsap.to('.orb-2', {
        scrollTrigger: { trigger: '.hero-section', scrub: 1.5 },
        y: -70, x: -40,
      });
    }
  } else {
    // Fallback: show hero elements if GSAP failed to load
    setTimeout(function () {
      document.querySelectorAll('.hero-badge, .hero-word, .hero-sub, .hero-actions, .hero-card').forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }, 1200);
  }

  // ===== Magnetic Buttons =====
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.22) + 'px, ' + (y * 0.28) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
        btn.style.transform = '';
        setTimeout(function () { btn.style.transition = ''; }, 400);
      });
    });

    // Card tilt (other pages)
    document.querySelectorAll('.card, .stakeholder-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var rotX = ((e.clientY - rect.top - rect.height / 2) / rect.height) * -4;
        var rotY = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 4;
        card.style.transform = 'perspective(900px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-6px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

});
