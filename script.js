const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const reveals = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

reveals.forEach((item) => revealObserver.observe(item));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const target = entry.target;
    const endValue = Number(target.dataset.count);
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      target.textContent = Math.round(endValue * eased);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
    countObserver.unobserve(target);
  });
}, { threshold: 0.7 });

counters.forEach((counter) => countObserver.observe(counter));

const demoForm = document.querySelector('.demo-form');
const formStatus = document.querySelector('.form-status');

if (demoForm && formStatus) {
  demoForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    formStatus.textContent = 'Invio in corso...';

    const formData = new FormData(demoForm);
    const body = new URLSearchParams(formData);

    try {
      const response = await fetch(demoForm.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: body.toString(),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Errore di invio');
      }

      window.location.href = '/thank-you.html';
    } catch (error) {
      formStatus.textContent = 'Si è verificato un errore. Riprova tra poco.';
    }
  });
}


