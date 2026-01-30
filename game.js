const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

let snake = [{ x: 150, y: 150 }];
let food = randomFood();
let dx = 10;
let dy = 0;
let score = 0;
let speed = 120;
let gameInterval;
let paused = false;

/* ---------- UTILIDADES ---------- */
function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / 10)) * 10,
    y: Math.floor(Math.random() * (canvas.height / 10)) * 10
  };
}

/* ---------- GAME LOOP ---------- */
function draw() {
  if (paused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Comida
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(food.x + 5, food.y + 5, 5, 0, Math.PI * 2);
  ctx.fill();

  // Serpiente
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#00ff99" : "#00cc66";
    ctx.fillRect(part.x, part.y, 10, 10);
  });

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    food = randomFood();
  } else {
    snake.pop();
  }

  // Colisiones
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width ||
    head.y >= canvas.height ||
    snake.slice(1).some(p => p.x === head.x && p.y === head.y)
  ) {
    alert("Game Over");
    resetGame();
  }
}

/* ---------- DIRECCIÓN ---------- */
function changeDirection(direction) {
  if (direction === "up" && dy === 0) {
    dx = 0; dy = -10;
  }
  if (direction === "down" && dy === 0) {
    dx = 0; dy = 10;
  }
  if (direction === "left" && dx === 0) {
    dx = -10; dy = 0;
  }
  if (direction === "right" && dx === 0) {
    dx = 10; dy = 0;
  }
}

/* 🔑 HACER LAS FUNCIONES GLOBALES */
window.changeDirection = changeDirection;
window.togglePause = () => paused = !paused;

/* ---------- TECLADO ---------- */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") changeDirection("up");
  if (e.key === "ArrowDown") changeDirection("down");
  if (e.key === "ArrowLeft") changeDirection("left");
  if (e.key === "ArrowRight") changeDirection("right");
});

/* ---------- CONTROL ---------- */
function resetGame() {
  snake = [{ x: 150, y: 150 }];
  dx = 10;
  dy = 0;
  score = 0;
  scoreEl.textContent = score;
}

gameInterval = setInterval(draw, speed);
