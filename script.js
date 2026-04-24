const form = document.getElementById("bookingForm");
const stepPills = [...document.querySelectorAll(".step-pill")];
const steps = [...document.querySelectorAll(".form-step")];
const nextButtons = [...document.querySelectorAll(".next-step")];
const prevButtons = [...document.querySelectorAll(".prev-step")];
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const heroEstimate = document.getElementById("heroEstimate");
const filterButtons = [...document.querySelectorAll(".filter-btn")];
const galleryCards = [...document.querySelectorAll(".gallery-card")];
const faqQuestions = [...document.querySelectorAll(".faq-question")];
const revealItems = [...document.querySelectorAll(".reveal")];
const cursorGlow = document.querySelector(".cursor-glow");
const particleCanvas = document.getElementById("particleCanvas");
const referencesInput = document.getElementById("references");
const fileSummary = document.getElementById("fileSummary");
const detailRange = document.getElementById("painScale");
const detailLabel = document.getElementById("detailLabel");

const output = {
  summaryStyle: document.getElementById("summaryStyle"),
  summarySize: document.getElementById("summarySize"),
  summaryPlacement: document.getElementById("summaryPlacement"),
  summaryFinish: document.getElementById("summaryFinish"),
  summaryDetail: document.getElementById("summaryDetail"),
  summaryExtras: document.getElementById("summaryExtras"),
  subtotalPrice: document.getElementById("subtotalPrice"),
  depositPrice: document.getElementById("depositPrice"),
  totalPrice: document.getElementById("totalPrice"),
  summarySchedule: document.getElementById("summarySchedule"),
  sessionLength: document.getElementById("sessionLength"),
};

const whatsappNumber = "523318737958";
let activeStep = 1;

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

function formatMoney(value) {
  return `${currency.format(value)} MXN`;
}

function getSelectedRadio(name) {
  return document.querySelector(`input[name="${name}"]:checked`);
}

function getDetailInfo(value) {
  const numericValue = Number(value);
  const detailMap = {
    1: { label: "Detalle basico", fee: 0, hours: 1.5 },
    2: { label: "Detalle limpio", fee: 180, hours: 2 },
    3: { label: "Detalle medio", fee: 380, hours: 2.5 },
    4: { label: "Detalle alto", fee: 720, hours: 3.5 },
    5: { label: "Detalle extremo", fee: 1200, hours: 5 },
  };

  return detailMap[numericValue] || detailMap[3];
}

function getSelectedExtras() {
  return [...document.querySelectorAll('input[name="extra"]:checked')];
}

function setOptionState(input) {
  const container = input.closest(".option-grid, .toggle-set");
  if (!container) return;

  const siblings = [...container.querySelectorAll("label")];
  if (input.type === "radio") {
    siblings.forEach((label) => label.classList.remove("selected"));
  }
  input.closest("label").classList.toggle("selected", input.checked);
}

function calculateQuote() {
  const style = getSelectedRadio("style");
  const finish = getSelectedRadio("finish");
  const size = document.getElementById("tattooSize");
  const placement = document.getElementById("placement");
  const detail = getDetailInfo(detailRange.value);
  const extras = getSelectedExtras();

  const basePrice = Number(style?.dataset.price || 0);
  const sizeMultiplier = Number(size.selectedOptions[0].dataset.multiplier || 1);
  const placementFee = Number(placement.selectedOptions[0].dataset.fee || 0);
  const finishFee = Number(finish?.dataset.fee || 0);
  const extrasFee = extras.reduce((sum, item) => sum + Number(item.dataset.fee || 0), 0);

  const subtotal = Math.round(basePrice * sizeMultiplier + placementFee + finishFee + detail.fee + extrasFee);
  const deposit = Math.round(subtotal * 0.3);

  output.summaryStyle.textContent = style?.value || "No definido";
  output.summarySize.textContent = size.value;
  output.summaryPlacement.textContent = placement.value;
  output.summaryFinish.textContent = finish?.value || "No definido";
  output.summaryDetail.textContent = detail.label;
  output.subtotalPrice.textContent = formatMoney(subtotal);
  output.depositPrice.textContent = formatMoney(deposit);
  output.totalPrice.textContent = formatMoney(subtotal);
  output.sessionLength.textContent = `Sesion estimada: ${detail.hours} horas`;
  heroEstimate.textContent = formatMoney(subtotal);

  output.summaryExtras.innerHTML = "";
  if (!extras.length) {
    const tag = document.createElement("span");
    tag.textContent = "Sin extras";
    output.summaryExtras.appendChild(tag);
  } else {
    extras.forEach((item) => {
      const tag = document.createElement("span");
      tag.textContent = item.value;
      output.summaryExtras.appendChild(tag);
    });
  }

  updateScheduleSummary();

  return {
    subtotal,
    deposit,
    detailLabel: detail.label,
    hours: detail.hours,
    extras: extras.map((item) => item.value),
  };
}

function updateScheduleSummary() {
  const appointmentDate = document.getElementById("appointmentDate").value;
  const appointmentTime = document.getElementById("appointmentTime").value;

  if (appointmentDate && appointmentTime) {
    const date = new Date(`${appointmentDate}T00:00:00`);
    const dateText = new Intl.DateTimeFormat("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
    output.summarySchedule.textContent = `${dateText} - ${appointmentTime}`;
  } else {
    output.summarySchedule.textContent = "Por definir";
  }
}

function goToStep(step) {
  activeStep = step;
  steps.forEach((section) => {
    section.classList.toggle("active", Number(section.dataset.step) === step);
  });
  stepPills.forEach((pill) => {
    pill.classList.toggle("active", Number(pill.dataset.stepTarget) === step);
  });
}

function validateStep(step) {
  const currentStep = document.querySelector(`.form-step[data-step="${step}"]`);
  const requiredInputs = [...currentStep.querySelectorAll("[required]")];
  return requiredInputs.every((input) => {
    if (input.type === "checkbox") {
      if (!input.checked) {
        input.reportValidity();
        return false;
      }
      return true;
    }
    if (!input.value.trim()) {
      input.reportValidity();
      return false;
    }
    return true;
  });
}

function handleStepNavigation() {
  nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!validateStep(activeStep)) return;
      goToStep(Math.min(activeStep + 1, steps.length));
    });
  });

  prevButtons.forEach((button) => {
    button.addEventListener("click", () => {
      goToStep(Math.max(activeStep - 1, 1));
    });
  });

  stepPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const targetStep = Number(pill.dataset.stepTarget);
      if (targetStep <= activeStep || validateStep(activeStep)) {
        goToStep(targetStep);
      }
    });
  });
}

function handleInputStates() {
  const selectableInputs = [...document.querySelectorAll('.option-card input, .toggle-card input')];
  selectableInputs.forEach((input) => {
    input.addEventListener("change", () => {
      setOptionState(input);
      calculateQuote();
    });
  });

  ["tattooSize", "placement", "appointmentDate", "appointmentTime"].forEach((id) => {
    document.getElementById(id).addEventListener("change", calculateQuote);
  });

  detailRange.addEventListener("input", () => {
    detailLabel.textContent = getDetailInfo(detailRange.value).label;
    calculateQuote();
  });

  referencesInput.addEventListener("change", () => {
    const names = [...referencesInput.files].map((file) => file.name);
    fileSummary.textContent = names.length
      ? `Referencias cargadas: ${names.join(", ")}`
      : "No se han seleccionado referencias.";
  });
}

function initGalleryFilter() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;

      galleryCards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.style.display = match ? "block" : "none";
      });
    });
  });
}

function initFaq() {
  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const item = question.closest(".faq-item");
      item.classList.toggle("open");
    });
  });
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initMenu() {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("open");
    menuToggle.classList.toggle("active");
    document.body.classList.toggle("menu-open", siteNav.classList.contains("open"));
  });

  [...siteNav.querySelectorAll("a")].forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      menuToggle.classList.remove("active");
      document.body.classList.remove("menu-open");
    });
  });
}

function initCursorGlow() {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.opacity = "1";
    cursorGlow.style.transform = `translate(${event.clientX - 120}px, ${event.clientY - 120}px)`;
  });
}

function initParticles() {
  const ctx = particleCanvas.getContext("2d");
  const particles = [];
  const count = 40;

  function resizeCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }

  function createParticles() {
    particles.length = 0;
    for (let index = 0; index < count; index += 1) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        radius: Math.random() * 1.8 + 0.4,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > particleCanvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > particleCanvas.height) particle.speedY *= -1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resizeCanvas();
  createParticles();
  draw();
  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });
}

function buildWhatsappMessage() {
  const quote = calculateQuote();
  const data = new FormData(form);
  const references = [...referencesInput.files].map((file) => file.name).join(", ") || "Sin referencias";
  const date = data.get("appointmentDate");
  const time = data.get("appointmentTime");

  const messageLines = [
    "Hola Aro Tattoos, quiero confirmar una cotizacion y agendar cita.",
    "",
    "*Datos del cliente*",
    `Nombre: ${data.get("clientName")}`,
    `Telefono: ${data.get("clientPhone")}`,
    `Email: ${data.get("clientEmail") || "No proporcionado"}`,
    `Presupuesto aproximado: ${data.get("budget") || "No especificado"}`,
    "",
    "*Proyecto*",
    `Estilo: ${data.get("style")}`,
    `Tamano: ${data.get("size")}`,
    `Zona: ${data.get("placement")}`,
    `Acabado: ${data.get("finish")}`,
    `Nivel de detalle: ${quote.detailLabel}`,
    `Extras: ${quote.extras.length ? quote.extras.join(", ") : "Sin extras"}`,
    `Idea / concepto: ${data.get("idea")}`,
    `Referencias: ${references}`,
    "",
    "*Agenda solicitada*",
    `Fecha: ${date || "Por definir"}`,
    `Hora: ${time || "Por definir"}`,
    `Notas adicionales: ${data.get("notes") || "Sin notas"}`,
    "",
    "*Cotizacion estimada*",
    `Total estimado: ${formatMoney(quote.subtotal)}`,
    `Anticipo sugerido: ${formatMoney(quote.deposit)}`,
    `Duracion estimada: ${quote.hours} horas`,
    "",
    "Quedo atento(a) para confirmar disponibilidad y anticipo.",
  ];

  return encodeURIComponent(messageLines.join("\n"));
}

function initSubmit() {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateStep(3)) return;
    const url = `https://wa.me/${whatsappNumber}?text=${buildWhatsappMessage()}`;
    window.open(url, "_blank");
  });
}

function setMinDate() {
  const input = document.getElementById("appointmentDate");
  const today = new Date().toISOString().split("T")[0];
  input.min = today;
}

document.querySelectorAll('input[name="style"], input[name="finish"]').forEach((input) => setOptionState(input));
document.querySelectorAll('input[name="extra"]').forEach((input) => setOptionState(input));

setMinDate();
handleStepNavigation();
handleInputStates();
initGalleryFilter();
initFaq();
initReveal();
initMenu();
initCursorGlow();
initParticles();
initSubmit();
calculateQuote();
