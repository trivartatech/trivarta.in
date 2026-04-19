/* ============================================================
   TRIVARTA TECH — Main JS
   ============================================================ */
(function () {
  'use strict';

  /* ── Scroll progress bar ──────────────────────────── */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);

  /* ── Back-to-top ──────────────────────────────────── */
  var btt = document.createElement('button');
  btt.className = 'back-to-top';
  btt.setAttribute('aria-label', 'Back to top');
  btt.innerHTML = '<i class="fas fa-arrow-up"></i>';
  document.body.appendChild(btt);
  btt.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', function () {
    var st = window.scrollY;
    var dh = document.documentElement.scrollHeight - window.innerHeight;
    if (dh > 0) bar.style.width = (st / dh * 100) + '%';
    btt.classList.toggle('visible', st > 500);
  }, { passive: true });

  /* ── Navbar scroll ────────────────────────────────── */
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    function onScroll() {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile hamburger ─────────────────────────────── */
  var hamburger = document.querySelector('.nav-hamburger');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', !isOpen);
      hamburger.classList.toggle('open', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Mobile accordions (products/services) ────────── */
  document.querySelectorAll('.mobile-accordion-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var target = document.getElementById(toggle.dataset.target);
      if (!target) return;
      var open = target.style.maxHeight && target.style.maxHeight !== '0px';
      target.style.maxHeight = open ? '0px' : target.scrollHeight + 'px';
      toggle.querySelector('i.chevron') &&
        toggle.querySelector('i.chevron').classList.toggle('rotate-180', !open);
    });
  });

  /* ── Accordion ────────────────────────────────────── */
  document.querySelectorAll('.accordion-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var body = trigger.nextElementSibling;
      var open = trigger.classList.contains('open');
      // close all others in same parent
      var parent = trigger.closest('[data-accordion]');
      if (parent) {
        parent.querySelectorAll('.accordion-trigger.open').forEach(function (t) {
          t.classList.remove('open');
          t.nextElementSibling.style.maxHeight = '0px';
        });
      }
      if (!open) {
        trigger.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ── Counter animation ────────────────────────────── */
  function animateCounter(el) {
    var target = parseInt(el.dataset.counter, 10);
    var suffix = el.dataset.suffix || '';
    var dur = 1800;
    var start = null;
    function ease(t) { return 1 - Math.pow(1 - t, 3); }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.floor(ease(p) * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(step);
  }
  var counterObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-counter]').forEach(function (el) {
    counterObs.observe(el);
  });

  /* ── Scroll reveal ────────────────────────────────── */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(function (el) {
    revealObs.observe(el);
  });

  /* ── GSAP hero (if loaded) ────────────────────────── */
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    // Hero entrance
    var hl = document.querySelectorAll('.hero-label');
    var ht = document.querySelectorAll('.hero-word');
    var hs = document.querySelectorAll('.hero-sub');
    var ha = document.querySelectorAll('.hero-actions');
    var hv = document.querySelectorAll('.hero-stat, .hero-mockup');
    if (hl.length || ht.length) {
      gsap.set(hl, { opacity: 0, y: -10 });
      gsap.set(ht, { opacity: 0, y: 40 });
      gsap.set(hs, { opacity: 0, y: 16 });
      gsap.set(ha, { opacity: 0, y: 16 });
      gsap.set(hv, { opacity: 0, x: 40 });
      var tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 });
      tl.to(hl, { opacity: 1, y: 0, duration: 0.6 })
        .to(ht, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 }, '-=0.3')
        .to(hs, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
        .to(ha, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .to(hv, { opacity: 1, x: 0, duration: 0.7, stagger: 0.1 }, '-=0.5');
    }
    // Orb parallax
    if (typeof ScrollTrigger !== 'undefined') {
      if (document.querySelector('.orb-1')) {
        gsap.to('.orb-1', { scrollTrigger: { trigger: '.hero', scrub: 1.5 }, y: -100, x: 50 });
        gsap.to('.orb-2', { scrollTrigger: { trigger: '.hero', scrub: 1.5 }, y: -60, x: -40 });
      }
    }
  } else {
    // fallback
    setTimeout(function () {
      document.querySelectorAll('.hero-label,.hero-word,.hero-sub,.hero-actions,.hero-stat,.hero-mockup').forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }, 500);
  }

  /* ── Magnetic buttons ─────────────────────────────── */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.22;
        var y = (e.clientY - r.top - r.height / 2) * 0.28;
        btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
        btn.style.transform = '';
        setTimeout(function () { btn.style.transition = ''; }, 400);
      });
    });
  }

  /* ── Ripple effect ────────────────────────────────── */
  var rippleCSS = document.createElement('style');
  rippleCSS.textContent = '@keyframes ripple{to{transform:scale(2.8);opacity:0}}';
  document.head.appendChild(rippleCSS);
  document.querySelectorAll('.btn-primary,.btn-ghost,.btn-outline,.btn-wa').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var r = btn.getBoundingClientRect();
      var sz = Math.max(r.width, r.height);
      var rip = document.createElement('span');
      rip.style.cssText =
        'position:absolute;border-radius:50%;pointer-events:none;' +
        'background:rgba(255,255,255,0.22);' +
        'width:' + sz + 'px;height:' + sz + 'px;' +
        'left:' + (e.clientX - r.left - sz / 2) + 'px;' +
        'top:' + (e.clientY - r.top - sz / 2) + 'px;' +
        'transform:scale(0);animation:ripple 0.55s ease-out forwards;';
      btn.appendChild(rip);
      setTimeout(function () { rip.remove(); }, 600);
    });
  });

  /* ── Active nav link ──────────────────────────────── */
  var path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-link[href]').forEach(function (a) {
    var href = a.getAttribute('href').replace(/\/$/, '') || '/';
    a.classList.remove('active');
    if (href === path || (href !== '/' && path.startsWith(href))) {
      a.classList.add('active');
    }
  });

}());
