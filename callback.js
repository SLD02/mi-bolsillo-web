(() => {
  'use strict';
  const title = document.getElementById('title');
  const message = document.getElementById('message');
  const icon = document.getElementById('status-icon');
  const link = document.getElementById('open-app');
  const help = document.getElementById('help');

  const params = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const value = key => params.get(key) || hash.get(key);
  const code = value('code');
  const error = value('error') || value('error_code');

  // El código de autorización no permanece en la barra del navegador ni en su historial.
  try { window.history.replaceState(null, '', '/auth/callback'); } catch (_) {}

  const fail = (heading, detail) => {
    icon.textContent = '!';
    icon.classList.add('error');
    title.textContent = heading;
    message.textContent = detail;
    help.textContent = 'Regresa a Mi Bolsillo e intenta iniciar sesión con Google nuevamente.';
    link.hidden = true;
  };

  if (error) {
    fail('No se completó el acceso', 'Google canceló o rechazó la autorización. No se modificó tu cuenta.');
    return;
  }
  // PKCE entrega un código de un solo uso; nunca lo canjeamos en esta página.
  if (!code || code.length > 2048 || !/^[A-Za-z0-9._~-]+$/.test(code)) {
    fail('No encontramos un enlace válido', 'Para iniciar sesión, abre Mi Bolsillo y selecciona «Continuar con Google».');
    return;
  }

  const appUrl = 'mibolsillo://auth/callback?code=' + encodeURIComponent(code);
  title.textContent = '¡Verificación completada!';
  message.textContent = 'Gracias por usar Mi Bolsillo. Abre la aplicación para terminar de iniciar sesión de forma segura.';
  link.href = appUrl;
  link.hidden = false;

  // La app canjea el código con PKCE; el botón queda disponible si el retorno automático falla.
  window.setTimeout(() => { window.location.assign(appUrl); }, 350);
})();
