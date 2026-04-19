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
    var scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
    // Show/hide back to top
    if (scrollTop > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  // ===== AOS Init =====
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 600,
      once: true,
      offset: 60,
      easing: 'ease-out-cubic',
      disable: window.innerWidth < 640 ? false : false
    });
  }

  // ===== Navbar Scroll =====
  var navbar = document.getElementById('navbar');
  if (navbar) {
    var onScroll = function () {
      if (window.scrollY > 40) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
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
        // Force reflow before adding class
        void mobileMenu.offsetHeight;
        mobileMenu.classList.add('menu-open');
      }
      var icon = mobileBtn.querySelector('i');
      icon.className = isOpen ? 'fas fa-bars' : 'fas fa-times';
      // Animate menu items
      if (!isOpen) {
        var items = mobileMenu.querySelectorAll('a, div.pt-3');
        items.forEach(function (item, idx) {
          item.style.opacity = '0';
          item.style.transform = 'translateX(-20px)';
          setTimeout(function () {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          }, 50 + idx * 40);
        });
      }
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
  var mobileDropdowns = [
    { toggle: 'mobile-products-toggle', submenu: 'mobile-products-submenu' },
    { toggle: 'mobile-services-toggle', submenu: 'mobile-services-submenu' }
  ];
  mobileDropdowns.forEach(function (dd) {
    var toggle = document.getElementById(dd.toggle);
    var submenu = document.getElementById(dd.submenu);
    if (toggle && submenu) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        var isOpen = !submenu.classList.contains('hidden');
        submenu.classList.toggle('hidden');
        var chevron = toggle.querySelector('.fa-chevron-down');
        if (chevron) chevron.classList.toggle('rotate-180');
        // Animate submenu items
        if (!isOpen) {
          var links = submenu.querySelectorAll('a');
          links.forEach(function (link, idx) {
            link.style.opacity = '0';
            link.style.transform = 'translateX(-10px)';
            setTimeout(function () {
              link.style.transition = 'all 0.25s ease';
              link.style.opacity = '1';
              link.style.transform = 'translateX(0)';
            }, 50 + idx * 60);
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
  document.querySelectorAll('#mobile-menu a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    if (path === '/' && href === '/') link.classList.add('text-white', 'font-semibold');
    else if (href !== '/' && path.startsWith(href)) link.classList.add('text-white', 'font-semibold');
  });

  // ===== Counter Animation =====
  var counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    var animateCounter = function (el) {
      var target = parseInt(el.getAttribute('data-counter'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1800;
      var startTime = null;
      var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
      var animate = function (ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / dur, 1);
        var val = Math.floor(easeOut(progress) * target);
        el.textContent = val.toLocaleString() + suffix;
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          el.classList.add('counted');
        }
      };
      requestAnimationFrame(animate);
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

  // ===== Typing Effect (Homepage only) =====
  var typingEl = document.querySelector('[data-typing]');
  if (typingEl) {
    var words = typingEl.getAttribute('data-typing').split(',');
    var wordIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
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
      if (!isDeleting && charIndex === current.length) {
        delay = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 400;
      }
      setTimeout(typeLoop, delay);
    }
    typeLoop();
  }

  // ===== Card Tilt Effect (Desktop only) =====
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card, .stakeholder-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -3;
        var rotateY = ((x - centerX) / centerX) * 3;
        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  // ===== Ripple Effect on Buttons =====
  document.querySelectorAll('.btn-primary, .btn-whatsapp, .btn-secondary').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      var size = Math.max(rect.width, rect.height);
      ripple.style.cssText = 'position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);pointer-events:none;width:' + size + 'px;height:' + size + 'px;left:' + (e.clientX - rect.left - size / 2) + 'px;top:' + (e.clientY - rect.top - size / 2) + 'px;transform:scale(0);animation:rippleAnim 0.5s ease-out forwards;';
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });
  });

  // Add ripple animation style
  var rippleStyle = document.createElement('style');
  rippleStyle.textContent = '@keyframes rippleAnim{to{transform:scale(2.5);opacity:0;}}';
  document.head.appendChild(rippleStyle);

  // ===== Parallax Hero =====
  var parallaxBgs = document.querySelectorAll('.hero-parallax');
  if (parallaxBgs.length) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      parallaxBgs.forEach(function (el) {
        el.style.transform = 'translate3d(0,' + (y * 0.25) + 'px,0)';
      });
    }, { passive: true });
  }

  // ===== Smooth Reveal =====
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

  // ===== Floating decorative cards animation =====
  document.querySelectorAll('.anim-float, .anim-float-delayed, .anim-float-slow').forEach(function (el) {
    // Already handled by CSS animation
  });

  // ===== Touch feedback for cards on mobile =====
  if ('ontouchstart' in window) {
    document.querySelectorAll('.card, .module-item, .stakeholder-card').forEach(function (el) {
      el.addEventListener('touchstart', function () {
        el.style.transition = 'all 0.15s ease';
        el.style.borderColor = 'rgba(255, 59, 48, 0.3)';
      }, { passive: true });
      el.addEventListener('touchend', function () {
        setTimeout(function () {
          el.style.borderColor = '';
        }, 200);
      }, { passive: true });
    });
  }

});
