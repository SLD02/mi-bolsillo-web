(() => {
  document.getElementById('year')?.replaceChildren(document.createTextNode(new Date().getFullYear()));
  const button = document.querySelector('.menu-button');
  const menu = document.getElementById('nav-links');
  button?.addEventListener('click', () => {
    const opened = menu.classList.toggle('open');
    button.setAttribute('aria-expanded', String(opened));
    button.setAttribute('aria-label', opened ? 'Cerrar menú' : 'Abrir menú');
  });
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');button?.setAttribute('aria-expanded', 'false');
  }));
  if (!('IntersectionObserver' in window)) { document.querySelectorAll('.reveal').forEach(n => n.classList.add('visible')); return; }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {entry.target.classList.add('visible'); observer.unobserve(entry.target);}
  }, {threshold:0.08});
  document.querySelectorAll('.reveal').forEach(n => observer.observe(n));
})();
