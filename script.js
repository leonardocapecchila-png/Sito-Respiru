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

const faqButtons = document.querySelectorAll('.faq-question');

faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    if (!item) return;
    item.classList.toggle('active');
  });
});

const pricingToggleButtons = document.querySelectorAll('.pricing-toggle-btn');
const pricingValues = document.querySelectorAll('.pricing-value');
const pricingPeriods = document.querySelectorAll('.pricing-period');

pricingToggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const billing = button.dataset.billing;

    pricingToggleButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));

    pricingValues.forEach((el) => {
      const value = billing === 'year' ? el.dataset.priceYear : el.dataset.priceMonth;
      el.textContent = `€${value}`;
    });

    pricingPeriods.forEach((el) => {
      el.textContent = billing === 'year' ? el.dataset.periodYear : el.dataset.periodMonth;
    });
  });
});

/* Respiru Stories: card list + editorial overlay */
const storiesGrid = document.getElementById('storiesGrid');
const storyOverlay = document.getElementById('storyOverlay');
const storyPanelContent = document.getElementById('storyPanelContent');

if (storiesGrid && storyOverlay && storyPanelContent && typeof RESPIRU_STORIES !== 'undefined') {
  let lastFocusedElement = null;

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const renderBodyBlock = (block) => {
    switch (block.type) {
      case 'lead':
        return `<p class="story-lead">${escapeHtml(block.text)}</p>`;
      case 'paragraph':
        return `<p>${escapeHtml(block.text)}</p>`;
      case 'highlight':
        return `<p class="story-highlight">${escapeHtml(block.text)}</p>`;
      case 'list':
        return `<ul class="story-list">${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
      case 'closing':
        return `<p class="story-closing">${escapeHtml(block.text)}</p>`;
      default:
        return '';
    }
  };

  RESPIRU_STORIES.forEach((story) => {
    const card = document.createElement('article');
    card.className = 'story-card';
    card.innerHTML = `
      <p class="story-card-number">${escapeHtml(story.id)}</p>
      <p class="story-card-category">${escapeHtml(story.category)}</p>
      <h3 class="story-card-company">${escapeHtml(story.company)}</h3>
      <p class="story-card-metric">${escapeHtml(story.metric)}</p>
      <p class="story-card-headline">${escapeHtml(story.headline)}</p>
      <p class="story-card-preview">${escapeHtml(story.preview)}</p>
      <button type="button" class="story-card-cta" data-story-id="${escapeHtml(story.id)}">
        Scopri la storia <span aria-hidden="true">→</span>
      </button>
    `;
    storiesGrid.appendChild(card);
  });

  /* Carousel controls: only needed with more than one story */
  const storyCards = Array.from(storiesGrid.children);
  const storiesDots = document.getElementById('storiesDots');
  const storiesControls = document.querySelector('.stories-controls');
  const storiesPrev = document.querySelector('.stories-prev');
  const storiesNext = document.querySelector('.stories-next');

  if (storyCards.length > 1 && storiesDots && storiesControls && storiesPrev && storiesNext) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    storyCards.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'stories-dot';
      dot.setAttribute('aria-label', `Vai alla storia ${index + 1} di ${storyCards.length}`);
      dot.addEventListener('click', () => {
        storyCards[index].scrollIntoView({ behavior: scrollBehavior, inline: 'start', block: 'nearest' });
      });
      storiesDots.appendChild(dot);
    });

    const dotEls = Array.from(storiesDots.children);

    const updateCarouselState = () => {
      const trackLeft = storiesGrid.getBoundingClientRect().left;
      let activeIndex = 0;
      let closestDistance = Infinity;

      storyCards.forEach((card, index) => {
        const distance = Math.abs(card.getBoundingClientRect().left - trackLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          activeIndex = index;
        }
      });

      dotEls.forEach((dot, index) => {
        const isActive = index === activeIndex;
        dot.classList.toggle('is-active', isActive);
        if (isActive) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });

      storiesPrev.disabled = activeIndex === 0;
      storiesNext.disabled = activeIndex === storyCards.length - 1;
    };

    let scrollDebounce;
    storiesGrid.addEventListener('scroll', () => {
      window.clearTimeout(scrollDebounce);
      scrollDebounce = window.setTimeout(updateCarouselState, 80);
    }, { passive: true });

    storiesGrid.addEventListener('scrollend', updateCarouselState, { passive: true });

    storiesPrev.addEventListener('click', () => {
      storiesGrid.scrollBy({ left: -storiesGrid.clientWidth, behavior: scrollBehavior });
    });

    storiesNext.addEventListener('click', () => {
      storiesGrid.scrollBy({ left: storiesGrid.clientWidth, behavior: scrollBehavior });
    });

    window.addEventListener('resize', updateCarouselState, { passive: true });
    updateCarouselState();
  } else if (storiesControls) {
    storiesControls.hidden = true;
  }

  const getFocusable = () =>
    Array.from(
      storyOverlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => el.offsetParent !== null);

  const openStory = (story, trigger) => {
    lastFocusedElement = trigger || document.activeElement;

    const metricLabel = story.metricLabel ? `<span>${escapeHtml(story.metricLabel)}</span>` : '';
    const sourceHtml = story.source ? `<p class="story-source">${escapeHtml(story.source.label)}</p>` : '';

    storyPanelContent.innerHTML = `
      <p class="story-panel-eyebrow">${escapeHtml(story.category)} · Storia ${escapeHtml(story.id)}</p>
      <h2 class="story-panel-title" id="storyPanelTitle">${escapeHtml(story.company)} — ${escapeHtml(story.headline)}</h2>
      <p class="story-panel-metric">${escapeHtml(story.metric)}${metricLabel}</p>
      <div class="story-panel-body">${story.body.map(renderBodyBlock).join('')}</div>
      ${sourceHtml}
    `;

    storyOverlay.hidden = false;
    document.body.classList.add('story-lock');
    requestAnimationFrame(() => {
      storyOverlay.classList.add('is-open');
      storyOverlay.querySelector('.story-panel').focus();
    });
  };

  const closeStory = () => {
    if (storyOverlay.hidden) return;
    storyOverlay.classList.remove('is-open');
    document.body.classList.remove('story-lock');

    window.setTimeout(() => {
      storyOverlay.hidden = true;
    }, 300);

    if (lastFocusedElement) lastFocusedElement.focus();
  };

  storiesGrid.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-story-id]');
    if (!trigger) return;
    const story = RESPIRU_STORIES.find((item) => item.id === trigger.dataset.storyId);
    if (story) openStory(story, trigger);
  });

  storyOverlay.querySelectorAll('[data-story-close]').forEach((el) => {
    el.addEventListener('click', closeStory);
  });

  document.addEventListener('keydown', (event) => {
    if (storyOverlay.hidden) return;

    if (event.key === 'Escape') {
      closeStory();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = getFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

