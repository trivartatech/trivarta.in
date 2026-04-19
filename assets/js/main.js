/* ============================================================
   TRIVARTA TECH — Motion Graphics JS
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

  /* ── Custom cursor (desktop only) ────────────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    var mx = -100, my = -100, rx = -100, ry = -100;
    var isHover = false;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    document.addEventListener('mousedown', function () {
      ring.classList.add('clicking');
    });
    document.addEventListener('mouseup', function () {
      ring.classList.remove('clicking');
    });

    /* lerp ring */
    (function lerpRing() {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(lerpRing);
    })();

    /* hover effect on interactive elements */
    var hoverSel = 'a, button, .card, .role-card, .module-chip, .tech-item, .nav-dropdown-toggle';
    document.querySelectorAll(hoverSel).forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        ring.classList.add('hover');
        dot.style.opacity = '0';
      });
      el.addEventListener('mouseleave', function () {
        ring.classList.remove('hover');
        dot.style.opacity = '1';
      });
    });
  }

  /* ── Navbar scroll ────────────────────────────────── */
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    function onScroll() { navbar.classList.toggle('scrolled', window.scrollY > 30); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile hamburger ─────────────────────────────── */
  var hamburger = document.querySelector('.nav-hamburger');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var open = mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', !open);
      hamburger.classList.toggle('open', !open);
      document.body.style.overflow = open ? '' : 'hidden';
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Accordion ────────────────────────────────────── */
  document.querySelectorAll('.accordion-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var body = trigger.nextElementSibling;
      var open = trigger.classList.contains('open');
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
    function easeOut(t) { return 1 - Math.pow(1 - t, 4); }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.floor(easeOut(p) * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
      else {
        el.textContent = target.toLocaleString() + suffix;
        el.classList.add('counted');
      }
    }
    requestAnimationFrame(step);
  }
  var counterObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-counter]').forEach(function (el) { counterObs.observe(el); });

  /* ── Scroll reveal (all classes) ─────────────────── */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll(
    '.reveal, .reveal-l, .reveal-r, .reveal-scale, .flip-up, .clip-reveal, .divider, .line-draw'
  ).forEach(function (el) { revealObs.observe(el); });

  /* ── Particles canvas ─────────────────────────────── */
  var canvas = document.querySelector('.particles-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var W, H, particles = [];

    function resizeCanvas() {
      W = canvas.width  = canvas.parentElement.offsetWidth;
      H = canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    var COUNT = 55;
    for (var i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        o: Math.random() * 0.5 + 0.2
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,59,48,' + p.o + ')';
        ctx.fill();
      });
      /* connect nearby particles */
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255,59,48,' + (0.06 * (1 - dist / 90)) + ')';
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  /* ── 3D card tilt ─────────────────────────────────── */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card, .glass, .role-card, .hero-stat').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r  = card.getBoundingClientRect();
        var cx = r.left + r.width  / 2;
        var cy = r.top  + r.height / 2;
        var dx = (e.clientX - cx) / (r.width  / 2);
        var dy = (e.clientY - cy) / (r.height / 2);
        var rotX = -dy * 6;
        var rotY =  dx * 6;
        card.style.transform =
          'perspective(800px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-4px)';
        card.style.transition = 'transform 0.1s';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
        card.style.transform  = '';
      });
    });

    /* Magnetic buttons */
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r  = btn.getBoundingClientRect();
        var x  = (e.clientX - r.left - r.width  / 2) * 0.22;
        var y  = (e.clientY - r.top  - r.height / 2) * 0.28;
        btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        btn.style.transition = 'transform 0.1s';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
        btn.style.transform  = '';
      });
    });
  }

  /* ── Ripple effect ────────────────────────────────── */
  var rippleCSS = document.createElement('style');
  rippleCSS.textContent = '@keyframes ripple{to{transform:scale(3);opacity:0}}';
  document.head.appendChild(rippleCSS);

  document.querySelectorAll('.btn-primary,.btn-ghost,.btn-outline,.btn-wa').forEach(function (btn) {
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', function (e) {
      var r   = btn.getBoundingClientRect();
      var sz  = Math.max(r.width, r.height);
      var rip = document.createElement('span');
      rip.style.cssText =
        'position:absolute;border-radius:50%;pointer-events:none;' +
        'background:rgba(255,255,255,0.25);' +
        'width:' + sz + 'px;height:' + sz + 'px;' +
        'left:'  + (e.clientX - r.left - sz / 2) + 'px;' +
        'top:'   + (e.clientY - r.top  - sz / 2) + 'px;' +
        'transform:scale(0);animation:ripple 0.6s ease-out forwards;';
      btn.appendChild(rip);
      setTimeout(function () { rip.remove(); }, 700);
    });
  });

  /* ── GSAP animations ──────────────────────────────── */
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    /* Hero entrance */
    var heroLabels  = document.querySelectorAll('.hero-label');
    var heroWords   = document.querySelectorAll('.hero-word');
    var heroSub     = document.querySelectorAll('.hero-sub');
    var heroActions = document.querySelectorAll('.hero-actions');
    var heroVisual  = document.querySelectorAll('.hero-stat, .hero-mockup');

    if (heroWords.length) {
      gsap.set(heroLabels,  { opacity: 0, y: -14 });
      gsap.set(heroWords,   { opacity: 0, y: 60, skewY: 3 });
      gsap.set(heroSub,     { opacity: 0, y: 20 });
      gsap.set(heroActions, { opacity: 0, y: 20 });
      gsap.set(heroVisual,  { opacity: 0, x: 50, scale: 0.96 });

      var tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.15 });
      tl.to(heroLabels,  { opacity: 1, y: 0, duration: 0.7 })
        .to(heroWords,   { opacity: 1, y: 0, skewY: 0, duration: 0.85, stagger: 0.07 }, '-=0.35')
        .to(heroSub,     { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
        .to(heroActions, { opacity: 1, y: 0, duration: 0.7 }, '-=0.45')
        .to(heroVisual,  { opacity: 1, x: 0, scale: 1, duration: 0.8, stagger: 0.1 }, '-=0.55');
    }

    if (typeof ScrollTrigger !== 'undefined') {

      /* Orb parallax */
      if (document.querySelector('.orb-1')) {
        gsap.to('.orb-1', { scrollTrigger: { trigger: '.hero', scrub: 2 }, y: -120, x:  60 });
        gsap.to('.orb-2', { scrollTrigger: { trigger: '.hero', scrub: 2 }, y:  -70, x: -50 });
        if (document.querySelector('.orb-3')) {
          gsap.to('.orb-3', { scrollTrigger: { trigger: '.hero', scrub: 2 }, y: -90, x: 30 });
        }
      }

      /* Section reveals with stagger */
      document.querySelectorAll('.gsap-reveal').forEach(function (el) {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          opacity: 0, y: 50, duration: 0.9, ease: 'power3.out'
        });
      });

      /* Card groups stagger */
      var cardGroups = {};
      document.querySelectorAll('.gsap-card').forEach(function (el) {
        var key = el.parentElement;
        if (!cardGroups[key]) cardGroups[key] = [];
        cardGroups[key].push(el);
      });
      Object.values(cardGroups).forEach(function (group) {
        group.forEach(function (el, i) {
          gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            opacity: 0, y: 60, scale: 0.95,
            duration: 0.75, ease: 'power3.out', delay: i * 0.1
          });
        });
      });

      /* Horizontal marquee speed boost on scroll */
      if (document.querySelector('.marquee-track')) {
        ScrollTrigger.create({
          trigger: '.marquee-section',
          onEnter: function () {
            var t = document.querySelector('.marquee-track');
            if (t) t.style.animationDuration = '14s';
          },
          onLeave: function () {
            var t = document.querySelector('.marquee-track');
            if (t) t.style.animationDuration = '22s';
          },
          onEnterBack: function () {
            var t = document.querySelector('.marquee-track');
            if (t) t.style.animationDuration = '14s';
          },
          onLeaveBack: function () {
            var t = document.querySelector('.marquee-track');
            if (t) t.style.animationDuration = '22s';
          }
        });
      }

      /* Stats section number pop */
      document.querySelectorAll('.stat-num').forEach(function (el) {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          scale: 0.7, opacity: 0, duration: 0.5, ease: 'back.out(1.7)'
        });
      });

      /* Feature items slide in */
      document.querySelectorAll('.feature-item').forEach(function (el, i) {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          opacity: 0, x: -30, duration: 0.6, ease: 'power3.out', delay: i * 0.08
        });
      });

      /* Roles grid bounce in */
      document.querySelectorAll('.role-card').forEach(function (el, i) {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          opacity: 0, y: 30, scale: 0.85,
          duration: 0.55, ease: 'back.out(1.4)', delay: i * 0.05
        });
      });

      /* Module chips stagger */
      document.querySelectorAll('.module-chip').forEach(function (el, i) {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          opacity: 0, scale: 0.8, duration: 0.4, ease: 'back.out(1.7)', delay: i * 0.04
        });
      });

      /* Tech items flip in */
      document.querySelectorAll('.tech-item').forEach(function (el, i) {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          opacity: 0, rotationY: 30, duration: 0.5, ease: 'power3.out', delay: i * 0.06
        });
      });

      /* CTA block dramatic entrance */
      var ctaBlock = document.querySelector('.cta-block');
      if (ctaBlock) {
        gsap.from(ctaBlock, {
          scrollTrigger: { trigger: ctaBlock, start: 'top 82%', once: true },
          opacity: 0, y: 60, scale: 0.97, duration: 0.85, ease: 'power3.out'
        });
      }

      /* Footer subtle slide */
      var footer = document.querySelector('.footer');
      if (footer) {
        gsap.from(footer, {
          scrollTrigger: { trigger: footer, start: 'top 95%', once: true },
          opacity: 0, y: 30, duration: 0.7, ease: 'power3.out'
        });
      }
    }

  } else {
    /* Fallback — show everything if GSAP fails */
    setTimeout(function () {
      document.querySelectorAll(
        '.hero-label,.hero-word,.hero-sub,.hero-actions,.hero-stat,.hero-mockup'
      ).forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }, 400);
  }

  /* ── Active nav link ──────────────────────────────── */
  var path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-link[href]').forEach(function (a) {
    var href = a.getAttribute('href').replace(/\/$/, '') || '/';
    a.classList.remove('active');
    if (href === path || (href !== '/' && href !== '' && path.endsWith(href))) {
      a.classList.add('active');
    }
  });

  /* ── Text scramble on hover (headings with data-scramble) ── */
  document.querySelectorAll('[data-scramble]').forEach(function (el) {
    var original = el.textContent;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
    var frame, iter;
    el.addEventListener('mouseenter', function () {
      clearInterval(frame);
      iter = 0;
      frame = setInterval(function () {
        el.textContent = original.split('').map(function (ch, i) {
          if (i < iter) return original[i];
          if (ch === ' ') return ' ';
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        iter += 0.4;
        if (iter >= original.length) {
          el.textContent = original;
          clearInterval(frame);
        }
      }, 30);
    });
  });

  /* ── Smooth page-load fade-in ─────────────────────── */
  document.documentElement.style.opacity = '0';
  document.documentElement.style.transition = 'opacity 0.4s ease';
  window.addEventListener('load', function () {
    document.documentElement.style.opacity = '1';
  });

}());
