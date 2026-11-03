/* ===== Shamnad P portfolio — 3D effects, matching Pip's World style ===== */

// ---------- Mouse tilt on cards/sections ----------
document.querySelectorAll('[data-tilt]').forEach(el => {
  const strength = el.classList.contains('hero') || el.classList.contains('section') ? 4 : 9;
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

// ---------- Draggable skills cube ----------
const cube = document.getElementById('cube');
const scene = document.getElementById('cube-scene');
let rx = -18, ry = 0, dragging = false, lastX = 0, lastY = 0;

scene.addEventListener('pointerdown', e => {
  dragging = true; lastX = e.clientX; lastY = e.clientY;
  cube.classList.add('dragging');
  scene.setPointerCapture(e.pointerId);
});
scene.addEventListener('pointermove', e => {
  if (!dragging) return;
  ry += (e.clientX - lastX) * 0.6;
  rx -= (e.clientY - lastY) * 0.6;
  rx = Math.max(-80, Math.min(80, rx));
  lastX = e.clientX; lastY = e.clientY;
  cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
});
['pointerup', 'pointercancel'].forEach(ev =>
  scene.addEventListener(ev, () => { dragging = false; })
);

// ---------- Robot buddy: pupils follow mouse + poke spin ----------
const buddy = document.getElementById('buddy');
const pupils = buddy.querySelectorAll('.pupil');
document.addEventListener('mousemove', e => {
  const r = buddy.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const ang = Math.atan2(e.clientY - cy, e.clientX - cx);
  const d = Math.min(4, Math.hypot(e.clientX - cx, e.clientY - cy) / 40);
  pupils.forEach(p => p.style.transform = `translate(${Math.cos(ang) * d}px, ${Math.sin(ang) * d}px)`);
});
buddy.addEventListener('click', () => {
  buddy.classList.remove('poked'); void buddy.offsetWidth; // restart animation
  buddy.classList.add('poked');
  burst(window.innerWidth * 0.7, window.innerHeight * 0.35);
});

// ---------- Confetti with fake depth ----------
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
resize(); addEventListener('resize', resize);

const COLORS = ['#6db9ff', '#ffd766', '#8fd6a8', '#ffb3c7', '#ffffff'];
const pieces = [];
for (let i = 0; i < 40; i++) spawn(Math.random() * W, Math.random() * H, false);

function spawn(x, y, fast) {
  const depth = Math.random();               // 0 far → 1 near
  pieces.push({
    x, y, depth,
    size: 4 + depth * 7,
    vx: (Math.random() - 0.5) * (fast ? 6 : 0.6),
    vy: fast ? -(Math.random() * 6 + 3) : Math.random() * 0.5 + 0.2,
    g: fast ? 0.18 : 0.01,
    rot: Math.random() * Math.PI, vr: (Math.random() - .5) * 0.2,
    color: COLORS[i % COLORS.length],
    life: fast ? 120 : Infinity
  });
}
function burst(x, y) { for (let i = 0; i < 30; i++) spawn(x, y, true); }

(function loop() {
  ctx.clearRect(0, 0, W, H);
  for (let i = pieces.length - 1; i >= 0; i--) {
    const p = pieces[i];
    p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    if (--p.life <= 0 || p.y > H + 20) {
      if (p.life !== undefined && p.life <= 0) { pieces.splice(i, 1); continue; }
    }
    if (p.y > H + 20 && p.life === Infinity) { p.y = -10; p.x = Math.random() * W; p.vy = Math.random() * .5 + .2; }
    ctx.save();
    ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.globalAlpha = 0.35 + p.depth * 0.55;
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    ctx.restore();
  }
  requestAnimationFrame(loop);
})();
