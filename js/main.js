(function () {
  'use strict';

  const COLORES_CONFETI = ['#e8b4bc', '#c9a962', '#f8e8ee', '#fff9f5', '#d4a5b0', '#fce4ec'];

  /* ── Partículas en landing ── */
  const particlesContainer = document.getElementById('particles');
  const colors = ['#e8b4bc', '#f8e8ee', '#c9a962', '#fce4ec', '#d4a5b0'];

  if (particlesContainer) {
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 10 + 4;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration: ${Math.random() * 12 + 14}s;
        animation-delay: ${Math.random() * 10}s;
      `;
      particlesContainer.appendChild(p);
    }
  }

  /* ── Referencias DOM ── */
  const landing = document.getElementById('landing');
  const mainContent = document.getElementById('main-content');
  const btnAbrir = document.getElementById('btn-abrir');
  const bgMusic = document.getElementById('bg-music');
  const seccionFinal = document.getElementById('seccion-final');
  const btnAbrirSobre = document.getElementById('btn-abrir-sobre');
  const btnAbrirSobre2 = document.getElementById('btn-abrir-sobre-2');
  const carta2Box = document.getElementById('carta2-box');
  const carta2Inner = document.getElementById('carta2-inner');
  const sobreVisual = document.getElementById('sobre-visual');
  const razonesGrid = document.getElementById('razones-grid');

  let typedInstance = null;
  let confettiDisparado = false;
  let sobreAbierto = false;

  function reproducirMusica() {
    if (!bgMusic) return;

    const src = bgMusic.getAttribute('src') || bgMusic.currentSrc;
    if (!src || src.trim() === '') {
      console.warn('No hay archivo de música. Coloca musica/cancion.mp3 en el proyecto.');
      return;
    }

    bgMusic.volume = 0.45;
    bgMusic.load();

    const intento = bgMusic.play();
    if (intento && typeof intento.catch === 'function') {
      intento.catch(function (err) {
        console.warn('No se pudo reproducir el audio:', err.message);
        console.warn('Prueba con Live Server (no abras solo el archivo con doble clic).');
      });
    }
  }

  /* ── Confeti ligero (al abrir sorpresa) ── */
  function confetiLigero() {
    if (typeof confetti !== 'function') return;

    confetti({
      particleCount: 55,
      spread: 70,
      startVelocity: 28,
      origin: { y: 0.55 },
      colors: COLORES_CONFETI,
      scalar: 0.9,
      ticks: 120,
    });

    setTimeout(function () {
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 50,
        origin: { x: 0.2, y: 0.5 },
        colors: COLORES_CONFETI,
      });
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 50,
        origin: { x: 0.8, y: 0.5 },
        colors: COLORES_CONFETI,
      });
    }, 180);
  }

  /* ── Confeti celebración (sección final) ── */
  function lanzarCelebracion() {
    const duration = 3500;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: COLORES_CONFETI,
        ticks: 200,
        gravity: 0.9,
        scalar: 1.1,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: COLORES_CONFETI,
        ticks: 200,
        gravity: 0.9,
        scalar: 1.1,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    setTimeout(function () {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.55 },
        colors: COLORES_CONFETI,
      });
    }, 200);

    setTimeout(function () {
      confetti({
        particleCount: 25,
        spread: 70,
        startVelocity: 35,
        scalar: 1.8,
        shapes: ['circle'],
        colors: ['#e8b4bc', '#d4a5b0', '#c9a962'],
        origin: { y: 0.7 },
      });
    }, 600);
  }

  /* ── Fechas y contadores ── */
  function parseFecha(str) {
    if (!str) return null;
    const d = new Date(str + 'T12:00:00');
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function calcularEdad(fechaNac) {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const m = hoy.getMonth() - fechaNac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad;
  }

  function esCumpleanosHoy(fechaNac) {
    const hoy = new Date();
    return (
      hoy.getMonth() === fechaNac.getMonth() &&
      hoy.getDate() === fechaNac.getDate()
    );
  }

  function diasDesde(fecha) {
    const inicio = new Date(fecha.getTime());
    const hoy = new Date();
    inicio.setHours(12, 0, 0, 0);
    hoy.setHours(12, 0, 0, 0);
    const diff = hoy - inicio;
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }

  function formatearNumero(n) {
    return n.toLocaleString('es-MX');
  }

  function initContadores() {
    const statCumple = document.getElementById('stat-cumple');
    const statCumpleLabel = document.getElementById('stat-cumple-label');
    const statDias = document.getElementById('stat-dias');
    const statDiasLabel = document.getElementById('stat-dias-label');

    if (!statCumple || !statDias || typeof CONFIG === 'undefined') return;

    const fechaNac = parseFecha(CONFIG.fechaCumpleanos);
    const fechaConocimos = parseFecha(CONFIG.fechaConocimos);

    if (fechaNac) {
      const edad = calcularEdad(fechaNac);
      if (esCumpleanosHoy(fechaNac)) {
        statCumple.textContent = '¡' + edad + '!';
        statCumpleLabel.textContent = 'Hoy cumples ' + edad + ' años 🎂';
      } else {
        statCumple.textContent = edad;
        statCumpleLabel.textContent = 'Años que tienes de grande y especial';
      }
    } else {
      statCumple.textContent = '♥';
      statCumpleLabel.textContent = 'Edita fechaCumpleanos en js/config.js';
    }

    if (fechaConocimos) {
      const dias = diasDesde(fechaConocimos);
      statDias.textContent = formatearNumero(dias);
      statDiasLabel.textContent =
        dias === 1 ? 'Día desde que nos conocimos' : 'Días desde que nos conocimos';
    } else {
      statDias.textContent = '∞';
      statDiasLabel.textContent = 'Edita fechaConocimos en js/config.js';
    }
  }

  /* ── Razones (desde config) ── */
  function initRazones() {
    if (!razonesGrid || typeof CONFIG === 'undefined' || !CONFIG.razones) return;

    CONFIG.razones.forEach(function (razon) {
      const card = document.createElement('article');
      card.className = 'razon-card scroll-reveal-child';
      card.innerHTML =
        '<span class="razon-emoji">' + razon.emoji + '</span>' +
        '<h3 class="razon-titulo">' + razon.titulo + '</h3>' +
        '<p class="razon-texto">' + razon.texto + '</p>';
      razonesGrid.appendChild(card);
    });
  }

  /* ── Segundo sobre ── */
  function abrirSobre() {
    if (sobreAbierto) return;
    sobreAbierto = true;

    if (carta2Inner && typeof CONFIG !== 'undefined') {
      carta2Inner.innerHTML = CONFIG.carta2;
    }

    if (sobreVisual) sobreVisual.classList.add('is-open');
    if (carta2Box) carta2Box.classList.add('is-open');

    [btnAbrirSobre, btnAbrirSobre2].forEach(function (btn) {
      if (btn) {
        btn.setAttribute('aria-expanded', 'true');
        btn.classList.add('is-hidden');
      }
    });

    setTimeout(function () {
      if (carta2Box) {
        carta2Box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 400);
  }

  function mostrarBotonSobre() {
    if (btnAbrirSobre) {
      btnAbrirSobre.classList.remove('is-hidden');
    }
  }

  if (btnAbrirSobre) {
    btnAbrirSobre.addEventListener('click', abrirSobre);
  }
  if (btnAbrirSobre2) {
    btnAbrirSobre2.addEventListener('click', abrirSobre);
  }

  /* ── Scroll reveal ── */
  function initScrollReveal() {
    const elementos = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    elementos.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Abrir sorpresa ── */
  if (btnAbrir) {
    btnAbrir.addEventListener('click', function () {
      landing.classList.add('fade-out');
      confetiLigero();

      reproducirMusica();

      setTimeout(function () {
        landing.style.display = 'none';
        mainContent.classList.add('visible');
        mainContent.style.pointerEvents = 'auto';
        iniciarTypewriter();
      }, 1200);
    });
  }

  /* ── Máquina de escribir (Typed.js) ── */
  function iniciarTypewriter() {
    if (typedInstance) return;

    typedInstance = new Typed('#typed-text', {
      strings: [
        'Hola Nidia Lizbeth...<br><br>Hoy no quería darte un regalo normal.<br><br>Así que decidí programarte algo especial...',
      ],
      typeSpeed: 42,
      contentType: 'html',
      backSpeed: 0,
      showCursor: true,
      cursorChar: '|',
      fadeOut: false,
      loop: false,
      smartBackspace: false,
      onComplete: function () {
        const cursor = document.querySelector('.typed-cursor');
        if (cursor) {
          setTimeout(function () {
            cursor.style.opacity = '0';
            cursor.style.transition = 'opacity 0.8s';
          }, 1500);
        }
        mostrarBotonSobre();
      },
    });
  }

  /* ── Confeti al llegar al final ── */
  if (seccionFinal) {
    const observerConfeti = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !confettiDisparado) {
            confettiDisparado = true;
            lanzarCelebracion();
            observerConfeti.disconnect();
          }
        });
      },
      { threshold: 0.45, rootMargin: '0px 0px -40px 0px' }
    );

    observerConfeti.observe(seccionFinal);
  }

  initContadores();
  initRazones();
  initScrollReveal();
})();
