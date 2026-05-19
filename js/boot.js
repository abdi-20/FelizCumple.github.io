(function () {
  'use strict';

  /* Ritmo tipo arranque de SO — más lento y pausado */
  const TYPE_SPEED_MS = 52;
  const DELAY_BEFORE_BOOT = 1400;
  const DELAY_BEFORE_WELCOME = 900;
  const DELAY_WELCOME_SCREEN = 4800;

  const BOOT_LINES = [
    { text: 'Initializing Birthday System...', progress: 33, pause: 2200 },
    { text: 'Loading memories...', progress: 66, pause: 2600 },
    { text: 'Starting happiness.exe...', progress: 100, pause: 2400 },
  ];

  const bootScreen = document.getElementById('boot-screen');
  const bootParticles = document.getElementById('boot-particles');
  const bootTerminal = document.getElementById('boot-terminal');
  const bootWelcome = document.getElementById('boot-welcome');
  const bootProgressFill = document.getElementById('boot-progress-fill');
  const bootProgressLabel = document.getElementById('boot-progress-label');

  if (!bootScreen) return;

  /* Partículas del boot (morado, rosa, azul) */
  const particleColors = [
    'rgba(124, 58, 237, 0.9)',
    'rgba(248, 180, 217, 0.85)',
    'rgba(167, 139, 250, 0.8)',
    'rgba(59, 130, 246, 0.6)',
  ];

  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    p.className = 'boot-particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${particleColors[Math.floor(Math.random() * particleColors.length)]};
      box-shadow: 0 0 ${size * 2}px currentColor;
      animation-duration: ${Math.random() * 10 + 12}s;
      animation-delay: ${Math.random() * 8}s;
    `;
    bootParticles.appendChild(p);
  }

  function wait(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function addBootLine(text) {
    const line = document.createElement('div');
    line.className = 'boot-line';
    line.innerHTML =
      '<span class="boot-line-prefix">&gt;</span>' +
      '<span class="boot-line-text"></span>' +
      '<span class="boot-line-ok">[ OK ]</span>';
    bootTerminal.appendChild(line);

    const textEl = line.querySelector('.boot-line-text');
    return typeText(textEl, text, TYPE_SPEED_MS);
  }

  function typeText(element, text, speed) {
    return new Promise(function (resolve) {
      let i = 0;
      const cursor = document.createElement('span');
      cursor.className = 'boot-cursor';
      element.appendChild(cursor);

      function tick() {
        if (i < text.length) {
          element.insertBefore(document.createTextNode(text[i]), cursor);
          i++;
          setTimeout(tick, speed);
        } else {
          cursor.remove();
          resolve();
        }
      }
      tick();
    });
  }

  function setProgress(percent) {
    if (bootProgressFill) {
      bootProgressFill.style.width = percent + '%';
    }
    if (bootProgressLabel) {
      bootProgressLabel.textContent = percent + '%';
    }
  }

  function showWelcome() {
    bootWelcome.classList.add('is-visible');
  }

  function exitBoot() {
    bootScreen.classList.add('boot-fade-out');
    document.body.classList.remove('boot-active');

    setTimeout(function () {
      bootScreen.style.display = 'none';
    }, 1400);
  }

  async function runBootSequence() {
    document.body.classList.add('boot-active');
    setProgress(0);
    await wait(DELAY_BEFORE_BOOT);

    for (const item of BOOT_LINES) {
      await addBootLine(item.text);
      await wait(350);
      setProgress(item.progress);
      await wait(item.pause);
    }

    await wait(DELAY_BEFORE_WELCOME);
    showWelcome();
    await wait(DELAY_WELCOME_SCREEN);
    exitBoot();
  }

  runBootSequence();
})();
