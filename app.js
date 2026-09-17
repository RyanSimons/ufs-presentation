/* ==========================================================================
   Ryan Simons · UFS Alumni Talk
   Deck navigation. No framework, no build step. Loaded as a classic script
   so that opening index.html straight off disk (file://) works too.

   Steps are read from the DOM — add a <section class="step"> to index.html
   and it joins the deck automatically.
   ========================================================================== */

(function () {
  'use strict';

  var steps    = Array.prototype.slice.call(document.querySelectorAll('.step'));
  var railItems= Array.prototype.slice.call(document.querySelectorAll('.rail__item'));
  var prevBtn  = document.getElementById('prevBtn');
  var nextBtn  = document.getElementById('nextBtn');
  var counter  = document.getElementById('counter');
  var progress = document.getElementById('progressBar');
  var toggle   = document.getElementById('themeToggle');

  if (!steps.length) return;

  var current = -1;

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ------------------------------------------------------------- theme --- */

  function currentTheme() {
    var set = document.documentElement.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('ufs-theme', next); } catch (e) { /* private mode */ }
    });
  }

  /* -------------------------------------------------------- navigation --- */

  /* The hash is a routing token, deliberately NOT an element id: if it named
     a real element the browser would scroll to it on load and on every
     hashchange, fighting the deck layout. Sections carry id="step-<slug>". */
  function slugOf(step) { return step.id.replace(/^step-/, ''); }

  function indexFromHash() {
    var slug = (location.hash || '').replace(/^#/, '');
    if (!slug) return -1;
    for (var i = 0; i < steps.length; i++) {
      if (slugOf(steps[i]) === slug) return i;
    }
    return -1;
  }

  function show(i, updateHash) {
    i = Math.max(0, Math.min(steps.length - 1, i));
    if (i === current) return;

    if (current > -1) steps[current].classList.remove('is-active');
    steps[i].classList.add('is-active');
    current = i;

    var chapter = parseInt(steps[i].getAttribute('data-chapter'), 10) || 1;

    railItems.forEach(function (item, n) {
      var isCurrent = (n + 1) === chapter;
      item.classList.toggle('is-current', isCurrent);
      item.classList.toggle('is-done', (n + 1) < chapter);
      if (isCurrent) { item.setAttribute('aria-current', 'step'); }
      else { item.removeAttribute('aria-current'); }
    });

    if (counter)  counter.innerHTML = '<b>' + (i + 1) + '</b> / ' + steps.length;
    if (progress) progress.style.width = ((i + 1) / steps.length * 100) + '%';
    if (prevBtn)  prevBtn.disabled = (i === 0);
    if (nextBtn)  nextBtn.disabled = (i === steps.length - 1);

    document.title = (steps[i].getAttribute('data-chapter-name') || 'Talk') +
                     ' · Ryan Simons · UFS Alumni Talk';

    if (updateHash !== false && steps[i].id) {
      /* replaceState keeps the URL shareable and refresh-safe without
         turning the browser Back button into a second Previous button. */
      history.replaceState(null, '', '#' + slugOf(steps[i]));
    }

    window.scrollTo(0, 0);
  }

  function move(delta) { show(current + delta); }

  if (prevBtn) prevBtn.addEventListener('click', function () { move(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { move(1); });

  railItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var target = item.getAttribute('data-goto');
      for (var i = 0; i < steps.length; i++) {
        if (slugOf(steps[i]) === target) { show(i); return; }
      }
    });
  });

  /* Brand link goes home without leaving a stale hash behind. */
  var brand = document.querySelector('.brand');
  if (brand) brand.addEventListener('click', function (e) { e.preventDefault(); show(0); });

  /* ---------------------------------------------------------- keyboard --- */

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Spacebar':
        e.preventDefault(); move(1); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp':
        e.preventDefault(); move(-1); break;
      case 'Home':
        e.preventDefault(); show(0); break;
      case 'End':
        e.preventDefault(); show(steps.length - 1); break;
      case '1': case '2': case '3': case '4':
        e.preventDefault();
        var item = railItems[parseInt(e.key, 10) - 1];
        if (item) item.click();
        break;
      case 't': case 'T':
        if (toggle) toggle.click();
        break;
    }
  });

  /* ------------------------------------------------------ touch swipe --- */

  var touchX = 0, touchY = 0;

  document.addEventListener('touchstart', function (e) {
    touchX = e.changedTouches[0].clientX;
    touchY = e.changedTouches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchX;
    var dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 55 && Math.abs(dy) < 60) move(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* ----------------------------------------------------------- startup --- */

  window.addEventListener('hashchange', function () {
    var i = indexFromHash();
    if (i > -1) show(i, false);
  });

  var start = indexFromHash();
  show(start > -1 ? start : 0);
})();
