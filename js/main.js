/* ============================================================
   ARO TATTOOS 89s — Main JavaScript
   ============================================================ */

'use strict';

/* ---------- Constants ---------- */
const WHATSAPP_NUMBER = '523318737958';
const COMPLEXITY_PRICES = [0, 150, 300, 600, 1000];
const COMPLEXITY_LABELS = ['Simple', 'Básico', 'Normal', 'Complejo', 'Muy complejo'];

/* ============================================================
   PARTICLES
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  const PARTICLE_COUNT = Math.min(60, Math.floor((W * H) / 18000));
  const particles = [];

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.6 + 0.1;
      this.color = Math.random() > 0.5
        ? `rgba(201,168,76,${this.opacity})`
        : `rgba(255,255,255,${this.opacity * 0.4})`;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });
})();

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let frame;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    frame = requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverEls = document.querySelectorAll('a, button, label, input[type=radio], input[type=range], select');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
})();

/* ============================================================
   NAVBAR
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const navLinkEls = document.querySelectorAll('.nav-link');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveLink();
  });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
  }

  navLinkEls.forEach(link => {
    link.addEventListener('click', () => {
      toggle && toggle.classList.remove('open');
      links && links.classList.remove('open');
    });
  });

  function highlightActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top < 120) current = sec.getAttribute('id');
    });
    navLinkEls.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }
})();

/* ============================================================
   STAT COUNTER ANIMATION
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  let started = false;

  function startCounting() {
    if (started) return;
    const hero = document.getElementById('hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      started = true;
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target, 10);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const update = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(update);
          } else {
            counter.textContent = target;
          }
        };
        requestAnimationFrame(update);
      });
    }
  }

  window.addEventListener('scroll', startCounting);
  startCounting();
})();

/* ============================================================
   SCROLL REVEAL (simple AOS-like)
   ============================================================ */
(function initScrollReveal() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => observer.observe(el));
})();

/* ============================================================
   GALLERY FILTERS + LIGHTBOX
   ============================================================ */
(function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxStyle = document.getElementById('lightboxStyle');
  const lightboxIcon = document.getElementById('lightboxIcon');

  // Filter
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      items.forEach(item => {
        const cat = item.dataset.category;
        const show = filter === 'all' || cat === filter;
        item.style.transition = 'opacity 0.4s, transform 0.4s';
        if (show) {
          item.style.display = '';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => { item.style.display = 'none'; }, 400);
        }
      });
    });
  });

  // Lightbox open
  document.querySelectorAll('.gallery-zoom').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = btn.dataset.title;
      const style = btn.dataset.style;
      lightboxTitle.textContent = title;
      lightboxStyle.textContent = style;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Lightbox close
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose && lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay && lightboxOverlay.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
})();

/* ============================================================
   QUOTE CALCULATOR
   ============================================================ */
(function initQuoteCalculator() {
  const steps = {
    qStep1: 1, qStep2: 2, qStep3: 3, qStep4: 4
  };

  let quoteData = {
    size: null, sizePrice: 0, sizeLabel: '',
    style: null, styleMult: 1, styleLabel: '',
    color: null, colorAdd: 0, colorLabel: '',
    complexity: 0
  };

  // Next/Prev buttons
  document.querySelectorAll('.quote-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentStepEl = btn.closest('.quote-step');
      const nextId = btn.dataset.next;

      if (currentStepEl.id === 'qStep1') {
        const sizeInput = document.querySelector('input[name="size"]:checked');
        if (!sizeInput) { showToast('Por favor selecciona un tamaño.'); return; }
        quoteData.size = sizeInput.value;
        quoteData.sizePrice = parseInt(sizeInput.dataset.price, 10);
        quoteData.sizeLabel = sizeInput.dataset.label;
      }

      if (currentStepEl.id === 'qStep2') {
        const styleInput = document.querySelector('input[name="style"]:checked');
        if (!styleInput) { showToast('Por favor selecciona un estilo.'); return; }
        quoteData.style = styleInput.value;
        quoteData.styleMult = parseFloat(styleInput.dataset.mult);
        quoteData.styleLabel = styleInput.dataset.label;
      }

      if (currentStepEl.id === 'qStep3') {
        const colorInput = document.querySelector('input[name="color"]:checked');
        if (!colorInput) { showToast('Por favor selecciona una opción de color.'); return; }
        quoteData.color = colorInput.value;
        quoteData.colorAdd = parseInt(colorInput.dataset.add, 10);
        quoteData.colorLabel = colorInput.dataset.label;
        quoteData.complexity = parseInt(document.getElementById('complexitySlider').value, 10);

        // Calculate price
        calculateAndShowPrice();
      }

      goToQuoteStep(nextId);
    });
  });

  document.querySelectorAll('.quote-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      const prevId = btn.dataset.prev;
      goToQuoteStep(prevId);
    });
  });

  function goToQuoteStep(stepId) {
    document.querySelectorAll('.quote-step').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(stepId);
    if (target) target.classList.add('active');

    // Update progress
    const stepNum = steps[stepId];
    document.querySelectorAll('.progress-step').forEach(dot => {
      const n = parseInt(dot.dataset.step, 10);
      dot.classList.remove('active', 'done');
      if (n < stepNum) dot.classList.add('done');
      else if (n === stepNum) dot.classList.add('active');
    });
  }

  function calculateAndShowPrice() {
    const base = quoteData.sizePrice;
    const styled = Math.round(base * quoteData.styleMult);
    const colored = styled + quoteData.colorAdd;
    const complexAdd = COMPLEXITY_PRICES[quoteData.complexity] || 0;
    const total = colored + complexAdd;

    // Animate price
    const priceEl = document.getElementById('quotePriceValue');
    if (priceEl) {
      animateNumber(priceEl, 0, total, 900);
    }

    // Summary list
    const list = document.getElementById('quoteSummaryList');
    if (list) {
      list.innerHTML = `
        <li><i class="fas fa-ruler"></i> Tamaño: ${quoteData.sizeLabel}</li>
        <li><i class="fas fa-paint-brush"></i> Estilo: ${quoteData.styleLabel} (x${quoteData.styleMult})</li>
        <li><i class="fas fa-palette"></i> Color: ${quoteData.colorLabel} (+$${quoteData.colorAdd})</li>
        <li><i class="fas fa-layer-group"></i> Complejidad: ${COMPLEXITY_LABELS[quoteData.complexity]} (+$${complexAdd})</li>
        <li class="total-row"><i class="fas fa-tag"></i> <strong>Total estimado: $${total.toLocaleString('es-MX')} MXN</strong></li>
      `;
    }

    // Store total for WhatsApp
    quoteData.total = total;
  }

  // WhatsApp quote
  document.getElementById('btnWhatsAppQuote')?.addEventListener('click', () => {
    const msg = encodeURIComponent(
      `¡Hola ARO TATTOOS! Me interesa cotizar mi tatuaje:\n\n` +
      `📏 Tamaño: ${quoteData.sizeLabel}\n` +
      `🎨 Estilo: ${quoteData.styleLabel}\n` +
      `🎨 Color: ${quoteData.colorLabel}\n` +
      `⚙️ Complejidad: ${COMPLEXITY_LABELS[quoteData.complexity]}\n\n` +
      `💰 Cotización estimada: $${quoteData.total?.toLocaleString('es-MX')} MXN\n\n` +
      `¿Podemos agendar una consulta? 🙏`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  });

  // Reset quote
  document.getElementById('btnResetQuote')?.addEventListener('click', () => {
    quoteData = {
      size: null, sizePrice: 0, sizeLabel: '',
      style: null, styleMult: 1, styleLabel: '',
      color: null, colorAdd: 0, colorLabel: '',
      complexity: 0
    };
    document.querySelectorAll('input[name="size"], input[name="style"], input[name="color"]').forEach(i => i.checked = false);
    const slider = document.getElementById('complexitySlider');
    if (slider) { slider.value = 0; updateSliderBackground(slider); }
    goToQuoteStep('qStep1');
  });

  // Complexity slider live update
  const slider = document.getElementById('complexitySlider');
  if (slider) {
    slider.addEventListener('input', () => updateSliderBackground(slider));
    updateSliderBackground(slider);
  }

  function updateSliderBackground(el) {
    const pct = (el.value / el.max) * 100;
    el.style.background = `linear-gradient(to right, var(--gold) 0%, var(--gold) ${pct}%, var(--black-5) ${pct}%)`;
  }
})();

/* ============================================================
   BOOKING FORM (multi-step + WhatsApp)
   ============================================================ */
(function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  let currentStep = 1;

  // Set min date to tomorrow
  const dateInput = document.getElementById('appointDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }

  // Next buttons
  document.querySelectorAll('.booking-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = btn.closest('.booking-step');
      if (!validateBookingStep(current.id)) return;
      const nextId = btn.dataset.next;
      goToBookingStep(nextId);

      if (nextId === 'bStep4') {
        buildReview();
      }
    });
  });

  // Prev buttons
  document.querySelectorAll('.booking-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      const prevId = btn.dataset.prev;
      goToBookingStep(prevId);
    });
  });

  function goToBookingStep(stepId) {
    document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(stepId);
    if (target) target.classList.add('active');

    const stepNum = parseInt(stepId.replace('bStep', ''), 10);
    currentStep = stepNum;

    document.querySelectorAll('.bp-step').forEach(dot => {
      const n = parseInt(dot.dataset.step, 10);
      dot.classList.remove('active', 'done');
      if (n < stepNum) dot.classList.add('done');
      else if (n === stepNum) dot.classList.add('active');
    });

    // Scroll to form
    const section = document.getElementById('agendar');
    if (section) {
      setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  function validateBookingStep(stepId) {
    let valid = true;
    clearErrors();

    if (stepId === 'bStep1') {
      const name = document.getElementById('clientName');
      const phone = document.getElementById('clientPhone');
      const age = document.getElementById('clientAge');

      if (!name?.value.trim()) {
        setError('errName', 'Ingresa tu nombre completo.'); valid = false;
      }
      if (!phone?.value.trim()) {
        setError('errPhone', 'Ingresa tu número de WhatsApp.'); valid = false;
      } else if (!/[\d\s\+\-]{8,15}/.test(phone.value.trim())) {
        setError('errPhone', 'Ingresa un número de teléfono válido.'); valid = false;
      }
      if (!age?.value) {
        setError('errAge', 'Debes ser mayor de 18 años.'); valid = false;
      } else if (parseInt(age.value, 10) < 18) {
        setError('errAge', 'Debes ser mayor de 18 años.'); valid = false;
      }
    }

    if (stepId === 'bStep2') {
      const desc = document.getElementById('tattooDesc');
      const style = document.getElementById('tattooStyle');
      const body = document.getElementById('bodyPart');

      if (!desc?.value.trim()) {
        setError('errDesc', 'Describe tu diseño.'); valid = false;
      }
      if (!style?.value) {
        setError('errStyle', 'Selecciona un estilo.'); valid = false;
      }
      if (!body?.value) {
        setError('errBody', 'Selecciona la zona del cuerpo.'); valid = false;
      }
    }

    if (stepId === 'bStep3') {
      const date = document.getElementById('appointDate');
      const time = document.querySelector('input[name="timeSlot"]:checked');

      if (!date?.value) {
        setError('errDate', 'Selecciona una fecha.'); valid = false;
      }
      if (!time) {
        setError('errTime', 'Selecciona un horario.'); valid = false;
      }
    }

    return valid;
  }

  function setError(id, msg) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = msg;
      el.style.display = 'block';
    }
  }

  function clearErrors() {
    document.querySelectorAll('.field-error').forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
  }

  function buildReview() {
    const review = document.getElementById('bookingReview');
    if (!review) return;

    const name = document.getElementById('clientName')?.value || '-';
    const phone = document.getElementById('clientPhone')?.value || '-';
    const email = document.getElementById('clientEmail')?.value || '-';
    const age = document.getElementById('clientAge')?.value || '-';
    const desc = document.getElementById('tattooDesc')?.value || '-';
    const style = document.getElementById('tattooStyle')?.value || '-';
    const size = document.getElementById('tattooSize')?.value || '-';
    const body = document.getElementById('bodyPart')?.value || '-';
    const date = document.getElementById('appointDate')?.value || '-';
    const time = document.querySelector('input[name="timeSlot"]:checked')?.value || '-';
    const hasRef = document.querySelector('input[name="hasRef"]:checked')?.value || '-';
    const notes = document.getElementById('extraNotes')?.value || '-';

    const formatDate = (d) => {
      if (!d || d === '-') return d;
      const [y, m, day] = d.split('-');
      const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
      return `${day} ${months[parseInt(m,10)-1]} ${y}`;
    };

    const formatTime = (t) => {
      if (!t || t === '-') return t;
      const [h, min] = t.split(':');
      const hour = parseInt(h, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const disp = hour > 12 ? hour - 12 : hour;
      return `${disp}:${min} ${ampm}`;
    };

    review.innerHTML = `
      <div class="review-section">
        <h4><i class="fas fa-user"></i> Datos Personales</h4>
        <div class="review-row"><span class="label">Nombre</span><span class="value">${name}</span></div>
        <div class="review-row"><span class="label">WhatsApp</span><span class="value">${phone}</span></div>
        <div class="review-row"><span class="label">Correo</span><span class="value">${email}</span></div>
        <div class="review-row"><span class="label">Edad</span><span class="value">${age} años</span></div>
      </div>
      <div class="review-section">
        <h4><i class="fas fa-pen-nib"></i> Detalles del Tatuaje</h4>
        <div class="review-row"><span class="label">Descripción</span><span class="value" style="max-width:200px;word-break:break-word">${desc}</span></div>
        <div class="review-row"><span class="label">Estilo</span><span class="value">${style}</span></div>
        <div class="review-row"><span class="label">Tamaño</span><span class="value">${size}</span></div>
        <div class="review-row"><span class="label">Zona</span><span class="value">${body}</span></div>
        <div class="review-row"><span class="label">Referencia</span><span class="value">${hasRef === 'si' ? 'Sí tengo' : 'Necesito asesoría'}</span></div>
      </div>
      <div class="review-section">
        <h4><i class="fas fa-calendar-alt"></i> Cita</h4>
        <div class="review-row"><span class="label">Fecha</span><span class="value">${formatDate(date)}</span></div>
        <div class="review-row"><span class="label">Horario</span><span class="value">${formatTime(time)}</span></div>
        ${notes && notes !== '-' ? `<div class="review-row"><span class="label">Notas</span><span class="value" style="max-width:200px;word-break:break-word">${notes}</span></div>` : ''}
      </div>
    `;

    // Confirm via WhatsApp
    document.getElementById('btnConfirmBooking')?.addEventListener('click', () => {
      sendBookingWhatsApp({ name, phone, email, age, desc, style, size, body, hasRef, notes, date: formatDate(date), time: formatTime(time) });
    });
  }

  function sendBookingWhatsApp(data) {
    const msg = encodeURIComponent(
      `✏️ *SOLICITUD DE CITA — ARO TATTOOS 89s*\n\n` +
      `👤 *Datos personales:*\n` +
      `• Nombre: ${data.name}\n` +
      `• WhatsApp: ${data.phone}\n` +
      `• Correo: ${data.email}\n` +
      `• Edad: ${data.age} años\n\n` +
      `🖤 *Detalles del tatuaje:*\n` +
      `• Descripción: ${data.desc}\n` +
      `• Estilo: ${data.style}\n` +
      `• Tamaño: ${data.size}\n` +
      `• Zona: ${data.body}\n` +
      `• Referencia: ${data.hasRef === 'si' ? 'Sí tengo' : 'Necesito asesoría'}\n\n` +
      `📅 *Cita deseada:*\n` +
      `• Fecha: ${data.date}\n` +
      `• Horario: ${data.time}\n` +
      (data.notes && data.notes.trim() ? `• Notas: ${data.notes}\n` : '') +
      `\n¡Espero su confirmación! 🙏`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    showToast('¡Redirigiendo a WhatsApp! Revisa tu mensaje. 🎉');
  }
})();

/* ============================================================
   BACK TO TOP
   ============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   SMOOTH SCROLL for anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ============================================================
   ANIMATE NUMBER
   ============================================================ */
function animateNumber(el, from, to, duration) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(from + (to - from) * eased).toLocaleString('es-MX');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* ============================================================
   STYLE CARD HOVER EFFECT (tilt)
   ============================================================ */
document.querySelectorAll('.style-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -6;
    const rotY = ((x - cx) / cx) * 6;
    card.style.transform = `translateY(-6px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ============================================================
   CONTACT CARD — WhatsApp / Instagram links
   ============================================================ */
document.querySelectorAll('.contact-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' || e.target.closest('a')) return;
    const link = card.querySelector('a');
    if (link) link.click();
  });
  card.style.cursor = 'pointer';
});

/* ============================================================
   FLOATING WHATSAPP — pulse on visibility
   ============================================================ */
(function initFloatWA() {
  const btn = document.querySelector('.float-whatsapp');
  if (!btn) return;

  let shown = false;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300 && !shown) {
      btn.style.transform = 'scale(1.1)';
      setTimeout(() => { btn.style.transform = ''; }, 400);
      shown = true;
    }
  });
})();

/* ============================================================
   INIT LOG
   ============================================================ */
console.log('%c ARO TATTOOS 89s ', 'background:#c9a84c;color:#000;font-size:18px;font-weight:bold;padding:6px 20px;border-radius:4px;');
console.log('%c Arte permanente. Diseños únicos. Tu historia en la piel.', 'color:#c9a84c;font-size:12px;');
