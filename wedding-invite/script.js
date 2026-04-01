/* ================================================================
   Wedding Invitation — Script
   Vanilla JS: page flip, cover, music toggle, floating petals
   ================================================================ */

(function () {
  'use strict';

  /* ────── DOM refs ────── */
  const cover          = document.getElementById('cover');
  const openBtn        = document.getElementById('openBtn');
  const wrapper        = document.getElementById('notebookWrapper');
  const prevBtn        = document.getElementById('prevBtn');
  const nextBtn        = document.getElementById('nextBtn');
  const indicator      = document.getElementById('pageIndicator');
  const musicToggle    = document.getElementById('musicToggle');
  const canvas         = document.getElementById('petalsCanvas');
  const ctx            = canvas.getContext('2d');

  /* ────── State ────── */
  const pages          = document.querySelectorAll('.page');
  const totalPages     = pages.length;            // physical pages (each has front + back)
  const totalFaces     = totalPages * 2;           // visible faces
  let currentFlipped   = 0;                        // how many pages are flipped

  /* ────── Cover open ────── */
  openBtn.addEventListener('click', function () {
    cover.classList.add('hidden');
    wrapper.classList.add('visible');
  });

  /* ────── Page flip logic ────── */
  function updateControls() {
    prevBtn.disabled = currentFlipped === 0;
    nextBtn.disabled = currentFlipped >= totalPages;
    var faceNum = currentFlipped === 0 ? 1 : currentFlipped * 2;
    if (currentFlipped >= totalPages) faceNum = totalFaces;
    indicator.textContent = 'Page ' + Math.min(currentFlipped * 2 + 1, totalFaces) + ' of ' + totalFaces;
  }

  function flipNext() {
    if (currentFlipped < totalPages) {
      pages[currentFlipped].classList.add('flipped');
      currentFlipped++;
      updateControls();
    }
  }

  function flipPrev() {
    if (currentFlipped > 0) {
      currentFlipped--;
      pages[currentFlipped].classList.remove('flipped');
      updateControls();
    }
  }

  nextBtn.addEventListener('click', flipNext);
  prevBtn.addEventListener('click', flipPrev);

  /* Click on page to flip forward */
  pages.forEach(function (page) {
    page.addEventListener('click', function () {
      if (!page.classList.contains('flipped')) {
        flipNext();
      }
    });
  });

  /* ────── Swipe support ────── */
  var touchStartX = 0;
  var touchEndX = 0;

  wrapper.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  wrapper.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) flipNext();
      else flipPrev();
    }
  }, { passive: true });

  /* ────── Keyboard support ────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') flipNext();
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') flipPrev();
  });

  updateControls();

  /* ================================================================
     Background Music (Web Audio – placeholder silent tone)
     Replace the oscillator section with an <audio> element for real music.
     ================================================================ */
  var audioCtx = null;
  var isMuted = true;

  musicToggle.classList.add('muted');

  musicToggle.addEventListener('click', function () {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    isMuted = !isMuted;
    musicToggle.classList.toggle('muted', isMuted);

    /* To use a real audio file, replace this block:
       var audio = new Audio('music.mp3');
       if (isMuted) audio.pause(); else audio.play();
    */
  });

  /* ================================================================
     Floating Petals (Canvas)
     ================================================================ */
  var petals = [];
  var petalCount = 35;
  var petalColors = [
    'rgba(245,180,190,.55)',
    'rgba(240,200,160,.45)',
    'rgba(220,180,190,.5)',
    'rgba(201,168,76,.35)',
    'rgba(255,220,220,.4)'
  ];

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function Petal() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height - canvas.height;
    this.size  = Math.random() * 8 + 4;
    this.speed = Math.random() * 1 + 0.4;
    this.angle = Math.random() * Math.PI * 2;
    this.spin  = (Math.random() - 0.5) * 0.03;
    this.drift = (Math.random() - 0.5) * 0.6;
    this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
    this.opacity = Math.random() * 0.5 + 0.3;
  }

  Petal.prototype.update = function () {
    this.y     += this.speed;
    this.x     += this.drift + Math.sin(this.angle) * 0.3;
    this.angle += this.spin;
    if (this.y > canvas.height + 20) {
      this.y = -20;
      this.x = Math.random() * canvas.width;
    }
  };

  Petal.prototype.draw = function () {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  for (var i = 0; i < petalCount; i++) {
    var p = new Petal();
    p.y = Math.random() * canvas.height;  // spread initially
    petals.push(p);
  }

  function animatePetals() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var j = 0; j < petals.length; j++) {
      petals[j].update();
      petals[j].draw();
    }
    requestAnimationFrame(animatePetals);
  }
  animatePetals();

})();
