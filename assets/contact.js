(() => {
  const form = document.querySelector('#contact-form');
  const contact = document.querySelector('#contact-detail');
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type=submit]');
  function validateContact() {
    const value = contact.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || (!value.includes('@') && /^[+()\d\s.\-]+$/.test(value) && value.replace(/\D/g, '').length >= 7);
    contact.setCustomValidity(valid ? '' : 'Please enter a valid phone number or email address.');
  }
  contact.addEventListener('input', validateContact);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    validateContact();
    if (!form.reportValidity()) return;
    status.textContent = '';
    status.className = 'form-status';
    button.disabled = true;
    button.textContent = 'Sending…';
    document.querySelector('#reply-email').value = contact.value.includes('@') ? contact.value.trim() : '';
    try {
      const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Submission failed');
      document.dispatchEvent(new Event('puls:inquiry-sent'));
      form.reset();
      contact.setCustomValidity('');
      status.className = 'form-status success';
      status.textContent = "Thanks—your message has been sent. I’ll be in touch.";
    } catch {
      status.className = 'form-status error';
      status.textContent = 'Your message could not be sent. Please try again. Your message is still here.';
    } finally {
      button.disabled = false;
      button.textContent = 'Send message';
    }
  });
})();
