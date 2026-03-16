'use strict';

document.addEventListener('DOMContentLoaded', function () {

  const backToTop = document.getElementById('backToTop');
  const nav        = document.getElementById('nav');
  const navToggle  = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const cursor     = document.getElementById('cursor');
  const cursorDot  = document.getElementById('cursorDot');
  const typedEl    = document.getElementById('typedText');
  const bgText     = document.querySelector('.hero__bg-text');
  const form       = document.getElementById('contactForm');
  const yr         = document.getElementById('year');

  if (yr) yr.textContent = new Date().getFullYear();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  (function animateCursor() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(animateCursor);
  })();

  document.querySelectorAll('a, button, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    backToTop.classList.toggle('show', window.scrollY > 400);
  });

  navToggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(4.5px, 4.5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4.5px, -4.5px)';
    } else {
      spans.forEach(s => s.style.cssText = '');
    }
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navToggle.querySelectorAll('span').forEach(s => s.style.cssText = '');
    });
  });

  if (typedEl) {
    const words = ['Front-end', 'UI Developer', 'Web Creator', 'React Dev'];
    let wIndex = 0, cIndex = 0, deleting = false;

    function typeEffect() {
      const word = words[wIndex];
      typedEl.textContent = deleting
        ? word.slice(0, --cIndex)
        : word.slice(0, ++cIndex);

      if (!deleting && cIndex === word.length) {
        deleting = true;
        setTimeout(typeEffect, 1600);
        return;
      }

      if (deleting && cIndex === 0) {
        deleting = false;
        wIndex = (wIndex + 1) % words.length;
      }

      setTimeout(typeEffect, deleting ? 60 : 100);
    }

    setTimeout(typeEffect, 800);
  }

  function revealAll() {
    document.querySelectorAll('.reveal').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight + 10) {
        el.classList.add('visible');
      }
    });
  }

  revealAll();
  window.addEventListener('scroll', revealAll, { passive: true });

  function animateBars() {
    document.querySelectorAll('.skill-bar__fill:not([data-done])').forEach(bar => {
      if (bar.getBoundingClientRect().top < window.innerHeight - 20) {
        bar.dataset.done = '1';
        setTimeout(() => {
          bar.style.width = bar.getAttribute('data-width') + '%';
        }, 200);
      }
    });
  }

  animateBars();
  window.addEventListener('scroll', animateBars, { passive: true });

  if (bgText) {
    window.addEventListener('scroll', () => {
      bgText.style.transform = 'translateY(calc(-50% + ' + (window.scrollY * 0.25) + 'px))';
    }, { passive: true });
  }

  if (form) {
    const btn = document.getElementById('submitBtn');
    const ok  = document.getElementById('formSuccess');

    const showErr = (id, eid, msg) => {
      document.getElementById(id).classList.add('error');
      const el = document.getElementById(eid);
      el.textContent = msg;
      el.classList.add('show');
    };

    const clrErr = (id, eid) => {
      document.getElementById(id).classList.remove('error');
      document.getElementById(eid).classList.remove('show');
    };

    form.addEventListener('submit', e => {
      e.preventDefault();

      ['name', 'email', 'message'].forEach(id => clrErr(id, id + 'Error'));

      let valid = true;

      if (!document.getElementById('name').value.trim()) {
        showErr('name', 'nameError', 'Informe seu nome.');
        valid = false;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('email').value.trim())) {
        showErr('email', 'emailError', 'E-mail inválido.');
        valid = false;
      }

      if (document.getElementById('message').value.trim().length < 10) {
        showErr('message', 'messageError', 'Mínimo 10 caracteres.');
        valid = false;
      }

      if (!valid) return;

      btn.disabled = true;
      btn.querySelector('span').textContent = 'Enviando...';

      setTimeout(() => {
        form.reset();
        ok.classList.add('show');
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Enviar Mensagem';
        setTimeout(() => ok.classList.remove('show'), 5000);
      }, 1800);
    });

    ['name', 'email', 'message'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => clrErr(id, id + 'Error'));
    });
  }

});

