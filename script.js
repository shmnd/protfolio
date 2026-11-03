/* ===== Pip's World — cartoon interactions + 3D effects ===== */

// ---------- Mouse tilt on cards/sections ----------
document.querySelectorAll('.tilt-wrap').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', (x * 10) + 'deg');
    el.style.setProperty('--rx', (-y * 8) + 'deg');
  });
  el.addEventListener('mouseleave', () => {
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  });
});

// ---------- Poke Pip! (3D spin + confetti) ----------
const bee = document.getElementById('bee');
const pokeBtn = document.getElementById('poke-btn');
let pokes = 0;
const reactions = ['Buzzzz! 🐝', 'Hehe, that tickles!', 'Wheee! ✨', 'Again! Again!', 'Pip is dizzy! 💫'];

function pokePip() {
  pokes++;
  bee.classList.remove('bob', 'spinning');
  void bee.offsetWidth; // restart animation
  bee.classList.add('spinning');
  burstConfetti();
  const reply = document.getElementById('hello-reply');
  if (reply) { reply.textContent = reactions[pokes % reactions.length];
               reply.classList.remove('show'); void reply.offsetWidth; reply.classList.add('show'); }
}
bee.addEventListener('click', pokePip);
pokeBtn.addEventListener('click', pokePip);
bee.addEventListener('animationend', e => {
  if (e.animationName === 'bee-spin') { bee.classList.remove('spinning'); bee.classList.add('bob'); }
});

// ---------- Drag-to-spin 3D cube ----------
const cube = document.getElementById('cube3d');
let dragging = false, lastX = 0, lastY = 0, rx = -15, ry = 0;

cube.addEventListener('pointerdown', e => {
  dragging = true; lastX = e.clientX; lastY = e.clientY;
  cube.style.animationPlayState = 'paused';
  cube.setPointerCapture(e.pointerId);
});
window.addEventListener('pointermove', e => {
  if (!dragging) return;
  ry += (e.clientX - lastX) * 0.6;
  rx -= (e.clientY - lastY) * 0.6;
  lastX = e.clientX; lastY = e.clientY;
  cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
});
window.addEventListener('pointerup', () => {
  if (!dragging) return;
  dragging = false;
  cube.style.transform = '';
  cube.style.animationPlayState = 'running';
});

// ---------- Say hello ----------
const helloBtn = document.getElementById('hello-btn');
const helloInput = document.getElementById('hello-input');
const helloReply = document.getElementById('hello-reply');
function sendHello() {
  const v = helloInput.value.trim();
  helloReply.textContent = v ? `Pip says: "${v}" right back at you! 🐝💛` : 'Type something cheerful first!';
  helloReply.classList.remove('show'); void helloReply.offsetWidth; helloReply.classList.add('show');
  if (v) burstConfetti();
}
helloBtn.addEventListener('click', sendHello);
helloInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendHello(); });

// ---------- Gentle floating confetti canvas ----------
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
resize(); addEventListener('resize', resize);

const COLORS = ['#ffd94a', '#ffb84d', '#bfe3ff', '#8fd47a', '#f2836b', '#fff'];
const bits = Array.from({ length: 40 }, () => ({
  x: Math.random() * innerWidth,
  y: Math.random() * innerHeight,
  s: 4 + Math.random() * 6,          // size = fake depth
  vx: (Math.random() - .5) * .3,
  vy: .2 + Math.random() * .6,
  rot: Math.random() * Math.PI, vr: (Math.random() - .5) * .06,
  c: COLORS[Math.floor(Math.random() * COLORS.length)],
  burst: 0
}));

function burstConfetti() {
  bits.forEach(b => {
    b.x = innerWidth / 2 + (Math.random() - .5) * 200;
    b.y = innerHeight / 3 + (Math.random() - .5) * 100;
    b.vx = (Math.random() - .5) * 6;
    b.vy = -2 - Math.random() * 4;
    b.burst = 60;
  });
}

(function loop() {
  ctx.clearRect(0, 0, W, H);
  bits.forEach(b => {
    b.x += b.vx; b.y += b.vy; b.rot += b.vr;
    if (b.burst > 0) { b.burst--; b.vy += 0.12; }      // gravity during bursts
    if (b.y > H + 20) { b.y = -20; b.x = Math.random() * W; b.vx = (Math.random()-.5)*.3; b.vy = .2+Math.random()*.6; }
    ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot);
    ctx.globalAlpha = .5 + b.s / 15;                    // nearer = more opaque
    ctx.fillStyle = b.c;
    ctx.fillRect(-b.s/2, -b.s/2, b.s, b.s * .7);
    ctx.restore();
  });
  requestAnimationFrame(loop);
})();
