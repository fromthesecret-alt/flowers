const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("intro").classList.add("hide");
  startFlowers();
});

/* ---------- Flower ---------- */
function drawFlower(f) {
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(f.rot);
  ctx.globalAlpha = f.alpha;

  // petals
  for (let i = 0; i < f.petals; i++) {
    ctx.beginPath();
    ctx.fillStyle = f.color;
    ctx.ellipse(0, -f.size, f.size * 0.38, f.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.rotate((Math.PI * 2) / f.petals);
  }
  // center
  ctx.beginPath();
  ctx.fillStyle = "#7a4a00";
  ctx.arc(0, 0, f.size * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHeart(s, color) {
  ctx.save();
  ctx.scale(s / 20, s / 20);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(-14, -8, -5, -18, 0, -10);
  ctx.bezierCurveTo(5, -18, 14, -8, 0, 6);
  ctx.fill();
  ctx.restore();
}

/* ---------- Particles ---------- */
let particles = [];

function spawn() {
  const petalColors = ["#ffd93d", "#ffe97d", "#ffc300", "#fff3b0"];
  return {
    x: Math.random() * canvas.width,
    y: canvas.height + 60,
    size: 12 + Math.random() * 22,
    speed: 1 + Math.random() * 2,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.01 + Math.random() * 0.03,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.02,
    petals: 5 + Math.floor(Math.random() * 4),
    color: petalColors[(Math.random() * petalColors.length) | 0],
    isHeart: Math.random() < 0.18,
    heartColor: ["#ff5c8a", "#ff2e63", "#ffb3c6"][(Math.random() * 3) | 0],
    alpha: 1
  };
}

let running = false;

function loop() {
  if (!running) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (particles.length < 40 && Math.random() < 0.15) particles.push(spawn());

  particles.forEach(p => {
    p.y -= p.speed;
    p.sway += p.swaySpeed;
    p.x += Math.sin(p.sway) * 1.2;
    p.rot += p.rotSpeed;

    // fade out near the top
    if (p.y < 120) p.alpha -= 0.01;

    if (p.isHeart) {
      ctx.save();
      ctx.translate(p.x, p.y);
      drawHeart(p.size * 0.9, p.heartColor);
      ctx.restore();
    } else {
      drawFlower(p);
    }
  });

  particles = particles.filter(p => p.alpha > 0);
  requestAnimationFrame(loop);
}

function startFlowers() {
  if (running) return;
  running = true;
  for (let i = 0; i < 25; i++) particles.push(spawn());
  loop();
}
