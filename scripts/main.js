const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
const contactForm = document.querySelector('.contact-form');
const formMessage = document.querySelector('.form-message');

const validators = {
  nombre: {
    test: (value) => value.trim().length >= 2,
    message: 'Ingresá tu nombre completo (mínimo 2 caracteres).',
  },
  telefono: {
    test: (value) => /^[+()\d\s-]{8,}$/.test(value.trim()),
    message: 'Ingresá un teléfono válido (mínimo 8 caracteres).',
  },
  email: {
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()),
    message: 'Ingresá un email válido.',
  },
  mensaje: {
    test: (value) => value.trim().length >= 10,
    message: 'Contanos un poco más (mínimo 10 caracteres).',
  },
};

const setFieldState = (field, isValid, errorMessage = '') => {
  field.setAttribute('aria-invalid', String(!isValid));
  field.classList.toggle('is-invalid', !isValid);
  field.classList.toggle('is-valid', isValid);
  field.setCustomValidity(isValid ? '' : errorMessage);
};

const setFormMessage = (message, type) => {
  if (!formMessage) return;

  formMessage.textContent = message;
  formMessage.classList.remove('is-error', 'is-success', 'is-sending');
  if (type) formMessage.classList.add(type);
};

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  nav.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menú');
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', targetId);
  });
});

if (contactForm) {
  const formFields = ['nombre', 'telefono', 'email', 'mensaje']
    .map((name) => contactForm.elements.namedItem(name))
    .filter(Boolean);

  formFields.forEach((field) => {
    field.addEventListener('input', () => {
      const rule = validators[field.name];
      if (!rule) return;
      const isValid = rule.test(field.value);
      setFieldState(field, isValid, rule.message);
    });

    field.addEventListener('blur', () => {
      const rule = validators[field.name];
      if (!rule) return;
      const isValid = rule.test(field.value);
      setFieldState(field, isValid, rule.message);
    });
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const errors = [];
    formFields.forEach((field) => {
      const rule = validators[field.name];
      if (!rule) return;

      const isValid = rule.test(field.value);
      setFieldState(field, isValid, rule.message);
      if (!isValid) errors.push(rule.message);
    });

    if (errors.length > 0) {
      setFormMessage('Revisá los campos marcados para poder enviar el formulario.', 'is-error');
      const firstInvalidField = formFields.find((field) => field.classList.contains('is-invalid'));
      firstInvalidField?.focus();
      return;
    }

    setFormMessage('Enviando consulta...', 'is-sending');

    window.setTimeout(() => {
      setFormMessage('¡Gracias! Recibimos tu consulta y te contactaremos pronto.', 'is-success');
      contactForm.reset();
      formFields.forEach((field) => {
        field.classList.remove('is-valid', 'is-invalid');
        field.removeAttribute('aria-invalid');
        field.setCustomValidity('');
      });
    }, 500);
  });
}

const whatsappLinks = document.querySelectorAll('[data-whatsapp-number], a[data-whatsapp-message]');

whatsappLinks.forEach((link) => {
  const phone = (link.dataset.whatsappNumber || '').replace(/\D/g, '');
  const message = link.dataset.whatsappMessage || '';

  if (!phone) return;

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  link.setAttribute('href', whatsappUrl);
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
});
