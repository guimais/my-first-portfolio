'use strict';

document.addEventListener('DOMContentLoaded', function () {

  
  const backToTop  = document.getElementById('backToTop');
  const nav        = document.getElementById('nav');
  const navToggle  = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const cursor     = document.getElementById('cursor');
  const cursorDot  = document.getElementById('cursorDot');
  const typedEl    = document.getElementById('typedText');
  const form       = document.getElementById('contactForm');
  const yr         = document.getElementById('year');

  
  if (yr) yr.textContent = new Date().getFullYear();

  
  (function initShader() {
    const canvas = document.getElementById('shader-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

        float d = length(p) * distortion;

        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);

        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `;

    const scene    = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new THREE.Color(0x000000));

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

    const uniforms = {
      resolution: { value: [window.innerWidth, window.innerHeight] },
      time:       { value: 0.0 },
      xScale:     { value: 1.0 },
      yScale:     { value: 0.5 },
      distortion: { value: 0.05 },
    };

    const positions = new THREE.BufferAttribute(
      new Float32Array([-1,-1,0, 1,-1,0, -1,1,0, 1,-1,0, -1,1,0, 1,1,0]), 3
    );

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', positions);

    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      uniforms.resolution.value = [w, h];
    }

    function animate() {
      uniforms.time.value += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener('resize', resize);
  })();

  
  document.addEventListener('pointermove', e => {
    const xp = (e.clientX / window.innerWidth).toFixed(2);
    const yp = (e.clientY / window.innerHeight).toFixed(2);
    document.querySelectorAll('[data-glow]').forEach(el => {
      el.style.setProperty('--x', e.clientX.toFixed(2));
      el.style.setProperty('--xp', xp);
      el.style.setProperty('--y', e.clientY.toFixed(2));
      el.style.setProperty('--yp', yp);
    });
  });

  
  if (cursor && cursorDot) {
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
  }

  
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    backToTop.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  
  navToggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
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
      mobileMenu.setAttribute('aria-hidden', 'true');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.querySelectorAll('span').forEach(s => s.style.cssText = '');
    });
  });

  
  if (typedEl) {
    const words = ['Front-end', 'UI Developer', 'Web Creator', 'React Dev'];
    let wIndex = 0, cIndex = 0, deleting = false;

    function typeEffect() {
      const word = words[wIndex];
      typedEl.textContent = deleting ? word.slice(0, --cIndex) : word.slice(0, ++cIndex);

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

  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.skill-bar__fill:not([data-done])');
        bars.forEach(bar => {
          bar.dataset.done = '1';
          setTimeout(() => {
            bar.style.width = bar.getAttribute('data-width') + '%';
          }, 200);
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) barObserver.observe(skillsSection);

  
  if (form) {
    const btn = document.getElementById('submitBtn');
    const ok  = document.getElementById('formSuccess');

    const showErr = (id, eid, msg) => {
      const input = document.getElementById(id);
      input.classList.add('error');
      input.setAttribute('aria-invalid', 'true');
      const el = document.getElementById(eid);
      el.textContent = msg;
      el.classList.add('show');
    };

    const clrErr = (id, eid) => {
      const input = document.getElementById(id);
      input.classList.remove('error');
      input.setAttribute('aria-invalid', 'false');
      const el = document.getElementById(eid);
      el.classList.remove('show');
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