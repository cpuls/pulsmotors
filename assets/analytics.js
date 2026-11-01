(() => {
  const id = 'G-SRR1NLMS3S';
  const live = ['pulsmotors.com', 'www.pulsmotors.com'].includes(location.hostname);
  const german = document.documentElement.lang === 'de';
  const key = 'puls_analytics_consent_v1';
  let enabled = false;
  let loaded = false;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  function readChoice() { try { return localStorage.getItem(key); } catch { return null; } }
  function activate() {
    if (!live || loaded) return;
    loaded = true;
    gtag('js', new Date());
    gtag('config', id, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: location.origin + location.pathname,
      page_referrer: document.referrer ? document.referrer.split(/[?#]/)[0] : '',
      language: document.documentElement.lang
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(script);
  }
  function apply(choice) {
    enabled = choice === 'granted';
    gtag('consent', 'update', { analytics_storage: enabled ? 'granted' : 'denied' });
    if (!enabled) {
      for (const cookie of document.cookie.split(';')) {
        const name = cookie.split('=')[0].trim();
        if (name === '_ga' || name.startsWith('_ga_')) {
          for (const domain of ['', ';domain=' + location.hostname, ';domain=.pulsmotors.com'])
            document.cookie = name + '=;Max-Age=0;path=/' + domain;
        }
      }
    }
  }
  const panel = document.createElement('section');
  panel.className = 'analytics-choice';
  panel.setAttribute('aria-label', german ? 'Besuchsstatistik' : 'Visitor analytics');
  panel.innerHTML = german
    ? '<p>Google Analytics erhält grundlegende Messdaten ohne Analyse-Cookies. Dürfen wir zusätzlich Analyse-Cookies für genauere Besuchsstatistiken setzen? Ihre Auswahl können Sie unten jederzeit ändern.</p><div><button type="button" data-choice="granted">Cookies zulassen</button><button type="button" data-choice="denied">Cookies ablehnen</button></div>'
    : '<p>Google Analytics receives basic measurements without analytics cookies. May we also use analytics cookies for more detailed visit statistics? You can change your choice in the footer at any time.</p><div><button type="button" data-choice="granted">Allow cookies</button><button type="button" data-choice="denied">Decline cookies</button></div>';
  document.body.append(panel);
  const settings = document.createElement('button');
  settings.type = 'button';
  settings.className = 'analytics-settings';
  settings.textContent = german ? 'Analyse-Einstellungen' : 'Analytics preferences';
  document.querySelector('footer').append(settings);
  settings.addEventListener('click', () => { panel.hidden = false; panel.querySelector('button').focus(); });
  panel.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => {
    const choice = button.dataset.choice;
    try { localStorage.setItem(key, choice); } catch {}
    apply(choice);
    panel.hidden = true;
    settings.focus({ preventScroll: true });
  }));
  const choice = readChoice();
  apply(choice);
  activate(); // Advanced Consent Mode: load with analytics_storage denied until allowed.
  panel.hidden = choice === 'granted' || choice === 'denied';
  if (!panel.hidden) event('consent_prompt_view');
  function event(name, parameters = {}) {
    if (live) gtag('event', name, { ...parameters, page_location: location.origin + location.pathname, site_language: document.documentElement.lang });
  }
  document.addEventListener('puls:inquiry-sent', () => event('generate_lead', { form_name: 'contact_inquiry' }));
  document.querySelectorAll('a[href]').forEach(link => {
    let url;
    try { url = new URL(link.href); } catch { return; }
    if (!['youtube.com', 'www.youtube.com', 'youtu.be'].includes(url.hostname)) return;
    link.addEventListener('click', () => event('youtube_click', { destination: 'Puls Motors YouTube' }));
  });
})();
