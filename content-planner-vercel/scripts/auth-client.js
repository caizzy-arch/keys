async function loadClerk(key) {
  const domain = atob(key.split('_')[2].replace(/-/g, '+').replace(/_/g, '/')).replace(/\$$/, '');
  if (!/^[a-z0-9.-]+$/i.test(domain)) throw Error('Invalid Clerk publishable key.');
  async function loadScript(path, publishableKey) {
    const script = document.createElement('script');
    script.src = 'https://' + domain + path;
    script.crossOrigin = 'anonymous';
    if (publishableKey) script.setAttribute('data-clerk-publishable-key', publishableKey);
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = () => reject(Error('Clerk could not load. Please refresh.'));
      document.head.append(script);
    });
  }
  await loadScript('/npm/@clerk/ui@1/dist/ui.browser.js');
  await loadScript('/npm/@clerk/clerk-js@6/dist/clerk.browser.js', key);
  await window.Clerk.load({
    ui: { ClerkUI: window.__internal_ClerkUICtor },
    localization: {
      signIn: { start: { title: 'Sign in to Content Planner' } },
      signUp: { start: { title: 'Create your Content Planner account' } }
    }
  });
  return window.Clerk;
}
async function start() {
  const status = document.getElementById('loadstate');
  try {
    const response = await fetch('/api/config');
    const config = await response.json();
    if (!response.ok) throw Error(config.error);
    const clerk = await loadClerk(config.publishableKey);
    const container = document.getElementById('signin');
    if (!clerk.user) {
      status.textContent = 'Sign in to your Content Planner.';
      container.style.cssText = 'display:grid;place-items:center;width:100%;min-height:calc(100dvh - 190px);padding:24px 16px;box-sizing:border-box';
      clerk.mountSignIn(container, {
        forceRedirectUrl: window.location.origin,
        appearance: { elements: {
          rootBox: { margin: '0 auto', width: 'fit-content', maxWidth: '100%' },
          cardBox: { margin: '0 auto', maxWidth: '100%' }
        } }
      });
      return;
    }
    container.hidden = true;
    clerk.mountUserButton(document.getElementById('account'));
    const rawFetch = window.fetch.bind(window);
    window.fetch = async (input, options = {}) => {
      const url = new URL(typeof input === 'string' ? input : input.url, window.location.origin);
      if (url.origin === window.location.origin && url.pathname.startsWith('/api/')) {
        const token = await clerk.session?.getToken();
        const headers = new Headers(options.headers);
        if (token) headers.set('Authorization', 'Bearer ' + token);
        return rawFetch(input, { ...options, headers });
      }
      return rawFetch(input, options);
    };
    const app = document.createElement('script');
    app.src = '/app.js';
    app.onerror = () => { status.textContent = 'The planner could not load. Refresh to try again.'; };
    document.body.append(app);
    clerk.addListener(({ user }) => { if (!user) window.location.reload(); });
  } catch (error) {
    status.textContent = error.message || 'Sign-in could not load. Refresh to try again.';
  }
}
start();
