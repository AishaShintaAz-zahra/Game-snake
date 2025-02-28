const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");

// Responsive canvas size
canvas.width = 400;
canvas.height = 400;

// Game variables
const boxSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = {
    x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
};
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameInterval;

// Update scoreboard
document.getElementById("score").textContent = score;
document.getElementById("highScore").textContent = highScore;

// Draw snake
function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#228b22" : "#37ce37"; // Head and body colors
        ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
        ctx.strokeStyle = "#222831";
        ctx.strokeRect(segment.x, segment.y, boxSize, boxSize);
    });
}

// Draw food
function drawFood() {
    ctx.fillStyle = "#ff4747"; // Food color
    ctx.beginPath();
    ctx.arc(food.x + boxSize / 2, food.y + boxSize / 2, boxSize / 2, 0, Math.PI * 2);
    ctx.fill();
}

// Update snake
function updateSnake() {
    const head = { ...snake[0] };

    if (direction === "UP") head.y -= boxSize;
    if (direction === "DOWN") head.y += boxSize;
    if (direction === "LEFT") head.x -= boxSize;
    if (direction === "RIGHT") head.x += boxSize;

    snake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").textContent = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            document.getElementById("highScore").textContent = highScore;
        }

        food = {
            x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
            y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
        };
    } else {
        snake.pop();
    }

    // Check collision
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        handleGameOver(); // Panggil fungsi Game Over
    }
}

// Handle input (keyboard for desktop and touch for mobile)
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Touch events for mobile controls
canvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    const canvasRect = canvas.getBoundingClientRect();
    const x = touch.clientX - canvasRect.left;
    const y = touch.clientY - canvasRect.top;

    // Determine direction based on touch position
    if (x < canvas.width / 2 && y < canvas.height / 2) {
        direction = "UP";
    } else if (x < canvas.width / 2 && y >= canvas.height / 2) {
        direction = "DOWN";
    } else if (x >= canvas.width / 2 && y < canvas.height / 2) {
        direction = "LEFT";
    } else if (x >= canvas.width / 2 && y >= canvas.height / 2) {
        direction = "RIGHT";
    }
});

// Start Game
startButton.addEventListener("click", () => {
    startButton.style.display = "none"; // Hide the start button
    gameInterval = setInterval(gameLoop, 150); // Start the game
});

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
    updateSnake();
}

// Reset game state
function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";
    food = {
        x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
    };
    score = 0;
    document.getElementById("score").textContent = score;
}

// Handle game over
function handleGameOver() {
    clearInterval(gameInterval);
    document.getElementById("finalScore").textContent = score;
    document.querySelector(".game-container").style.display = "none";
    document.querySelector(".game-over-container").style.display = "flex";
}

// Play again
document.getElementById("playAgainButton").addEventListener("click", () => {
    resetGame();
    document.querySelector(".game-over-container").style.display = "none";
    document.querySelector(".game-container").style.display = "block";
    gameInterval = setInterval(gameLoop, 150);
});

// Exit game
document.getElementById("exitButton").addEventListener("click", () => {
    window.close(); // Exit game or navigate to another page
});

// Variabel untuk mendeteksi sentuhan layar
let touchStartX = 0;
let touchStartY = 0;

// Menangani sentuhan layar
canvas.addEventListener("touchstart", (e) => {
    // Mencegah scroll ketika bermain
    e.preventDefault();

    const touch = e.touches[0]; // Ambil posisi sentuhan pertama
    touchStartX = touch.pageX;
    touchStartY = touch.pageY;
});


// Handle input
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Handle touch control (previously for mobile)
document.getElementById("up").addEventListener("click", () => {
    if (direction !== "DOWN") direction = "UP";
});
document.getElementById("down").addEventListener("click", () => {
    if (direction !== "UP") direction = "DOWN";
});
document.getElementById("left").addEventListener("click", () => {
    if (direction !== "RIGHT") direction = "LEFT";
});
document.getElementById("right").addEventListener("click", () => {
    if (direction !== "LEFT") direction = "RIGHT";
});

