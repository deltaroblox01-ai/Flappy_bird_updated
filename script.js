const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load images
const bg = new Image();
const birdFrames = [new Image(), new Image(), new Image()];
const pipeTop = new Image();
const pipeBottom = new Image();
const ground = new Image();

bg.src = "image/bg.png";
birdFrames[0].src = "image/bird1.png";
birdFrames[1].src = "image/bird2.png";
birdFrames[2].src = "image/bird3.png";
pipeTop.src = "image/pipeTop.png";
pipeBottom.src = "image/pipeBottom.png";
ground.src = "image/ground.png";

let frames = 0;
let score = 0;
let gameOver = false;
let gravity = 0.25;
let jump = 4.6;

// Bird object
const bird = {
  x: 50,
  y: 150,
  w: 34,
  h: 24,
  velocity: 0,
  frame: 0,
  draw() {
    ctx.drawImage(birdFrames[this.frame], this.x, this.y);
  },
  update() {
    this.velocity += gravity;
    this.y += this.velocity;
    this.frame = Math.floor(frames / 5) % 3;
    if (this.y + this.h >= canvas.height - 100) gameOver = true;
  },
  flap() {
    this.velocity = -jump;
  },
};

// Pipes
const pipes = [];
const gap = 130;
const pipeWidth = 52;

function drawPipes() {
  for (let i = 0; i < pipes.length; i++) {
    const p = pipes[i];
    ctx.drawImage(pipeTop, p.x, p.top - pipeTop.height);
    ctx.drawImage(pipeBottom, p.x, p.top + gap);
  }
}

function updatePipes() {
  if (frames % 90 === 0) {
    let top = Math.random() * (canvas.height - gap - 200) + 50;
    pipes.push({ x: canvas.width, top: top });
  }

  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    p.x -= 2;

    // Collision
    if (
      bird.x < p.x + pipeWidth &&
      bird.x + bird.w > p.x &&
      (bird.y < p.top || bird.y + bird.h > p.top + gap)
    ) {
      gameOver = true;
    }

    // Score
    if (p.x + pipeWidth < bird.x && !p.scored) {
      score++;
      p.scored = true;
    }
  }

  // Remove off-screen pipes
  if (pipes.length && pipes[0].x + pipeWidth < 0) pipes.shift();
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, 10, 50);
}

function loop() {
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  bird.draw();
  bird.update();

  drawPipes();
  updatePipes();

  ctx.drawImage(ground, 0, canvas.height - 100, canvas.width, 100);
  drawScore();

  frames++;
  if (!gameOver) {
    requestAnimationFrame(loop);
  } else {
    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.fillText("Game Over", 80, 300);
  }
}

// Controls
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") bird.flap();
});
document.addEventListener("touchstart", () => bird.flap());


loop();
