const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
const contactForm = document.querySelector('.contact-form');
const formMessage = document.querySelector('.form-message');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });
}

if (contactForm && formMessage) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      formMessage.textContent = 'Revisá los campos obligatorios antes de enviar.';
      return;
    }

    formMessage.textContent = '¡Gracias! Recibimos tu consulta y te contactaremos pronto.';
    contactForm.reset();
  });
}
