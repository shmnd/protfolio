/* ===== White Mood · 3D interactions ===== */

// ---------- Floating white particles (canvas) ----------
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let W, H, dots = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function makeDots(n = 60) {
  dots = Array.from({ length: n }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 2.4 + 0.8,          // size → fake depth
    z: Math.random(),                       // depth 0..1
    vx: (Math.random() - 0.5) * 0.25,
    vy: -(Math.random() * 0.35 + 0.08),     // gentle rise like snow
    a: Math.random() * Math.PI * 2,
  }));
}
makeDots();

function draw(t) {
  ctx.clearRect(0, 0, W, H);
  for (const d of dots) {
    d.x += d.vx + Math.sin(t / 1400 + d.a) * 0.15 * d.z;
    d.y += d.vy * (0.4 + d.z);              // nearer dots move faster (parallax)
    if (d.y < -10) { d.y = H + 10; d.x = Math.random() * W; }
    if (d.x < -10) d.x = W + 10;
    if (d.x > W + 10) d.x = -10;

    const alpha = 0.25 + d.z * 0.55;
    const radius = d.r * (0.6 + d.z);
    // soft glow sphere look
    const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, radius * 3);
    g.addColorStop(0, `rgba(255,255,255,${alpha})`);
    g.addColorStop(0.5, `rgba(240,244,250,${alpha * 0.5})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(d.x, d.y, radius * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// ---------- Mouse-driven 3D tilt on cards ----------
const tiltCards = document.querySelectorAll(".card-3d");

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 .. 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const rx = (-py * 10).toFixed(2);  // rotateX
    const ry = (px * 12).toFixed(2);   // rotateY
    card.style.transform =
      `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(12px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transition = "transform .6s cubic-bezier(.2,.8,.2,1)";
    card.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateZ(0)";
    setTimeout(() => (card.style.transition = ""), 600);
  });
});

// ---------- Subtle background parallax with mouse ----------
const sceneBack = document.querySelector(".scene-back");
window.addEventListener("mousemove", (e) => {
  const nx = e.clientX / window.innerWidth - 0.5;
  const ny = e.clientY / window.innerHeight - 0.5;
  sceneBack.style.transform = `translate3d(${nx * -25}px, ${ny * -25}px, 0)`;
});

// ---------- Pulse button effect ----------
const pulseBtn = document.getElementById("pulseBtn");
pulseBtn.addEventListener("click", () => {
  pulseBtn.classList.remove("pulse");
  void pulseBtn.offsetWidth; // restart animation
  pulseBtn.classList.add("pulse");
});
