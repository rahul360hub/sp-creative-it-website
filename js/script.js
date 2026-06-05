document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeaderScroll();
  initFAQ();
  initForms();
  initScrollReveal();
  initAnimatedStats();
  initTestimonialSlider();
  setActiveNavLink();
});

function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  let overlay = document.querySelector('.menu-overlay');

  if (!toggle || !nav) return;

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
  }

  const closeMenu = () => {
    nav.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    overlay.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  overlay.addEventListener('click', closeMenu);
  nav.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', closeMenu));
}

function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      const answer = item.querySelector('.faq-answer');

      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('active');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

function initForms() {
  document.querySelectorAll('.sp-form').forEach(form => {
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn && !submitBtn.dataset.originalText) {
      submitBtn.dataset.originalText = submitBtn.textContent;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const successMsg = form.querySelector('.form-success');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'পাঠানো হচ্ছে...';
      }

      setTimeout(() => {
        form.reset();
        if (successMsg) successMsg.classList.add('show');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.originalText;
        }
        setTimeout(() => successMsg?.classList.remove('show'), 6000);
      }, 900);
    });
  });
}

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}

function initAnimatedStats() {
  const statNumbers = document.querySelectorAll('[data-count]');
  if (!statNumbers.length) return;

  const animateValue = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const isDecimal = el.dataset.decimal === 'true';
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString('bn-BD')) + suffix;

      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + (isDecimal ? target.toFixed(1) : target.toLocaleString('bn-BD')) + suffix;
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateValue(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => observer.observe(el));
}

function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const dotsContainer = document.querySelector('.slider-dots');

  if (!track || !slides.length) return;

  let current = 0;
  let autoplayTimer;

  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `রিভিউ ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  const dots = document.querySelectorAll('.slider-dot');

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  prevBtn?.addEventListener('click', () => { prev(); resetAutoplay(); });
  nextBtn?.addEventListener('click', () => { next(); resetAutoplay(); });

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(next, 5500);
  }

  resetAutoplay();

  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    resetAutoplay();
  });
}

function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link:not(.nav-cta)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}
