const tiger = document.getElementById('tiger');
const obstacles = [document.getElementById('tree1'), document.getElementById('tree2')];
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const gameOverMessage = document.getElementById('gameOverMessage');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

let isJumping = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0; // Ambil skor tertinggi dari localStorage
let obstacleSpeed = 5;
let velocity = 0;
let gravity = 0.9;
let tigerBottom = 0;
let gameOver = false;

highScoreElement.textContent = `High Score: ${highScore}`;

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !isJumping && !gameOver) {
        jump();
    }
});

restartButton.addEventListener('click', () => {
    resetGame();
});

function jump() {
    isJumping = true;
    let jumpHeight = 0;
    velocity = 18;

    function jumpAnimation() {
        if (jumpHeight >= 200 || velocity <= 0) {
            fall();
        } else {
            velocity -= gravity;
            jumpHeight += velocity;
            tigerBottom = jumpHeight;
            tiger.style.bottom = `${jumpHeight}px`;
            requestAnimationFrame(jumpAnimation);
        }
    }

    function fall() {
        if (jumpHeight > 0) {
            velocity += gravity;
            jumpHeight -= velocity;
            tigerBottom = jumpHeight;
            tiger.style.bottom = `${Math.max(jumpHeight, 0)}px`;
            requestAnimationFrame(fall);
        } else {
            isJumping = false;
        }
    }

    requestAnimationFrame(jumpAnimation);
}

function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
        let position = window.innerWidth + (index * 300);
        function moveObstacle() {
            if (position < -50) {
                position = window.innerWidth;
                score += 10;
                scoreElement.textContent = `Score: ${score}`;
            }
            position -= obstacleSpeed;
            obstacle.style.left = `${position}px`;

            if (gameOver) return;

            const tigerRect = tiger.getBoundingClientRect();
            const obstacleRect = obstacle.getBoundingClientRect();

            if (
                tigerRect.right > obstacleRect.left &&
                tigerRect.left < obstacleRect.right &&
                tigerRect.bottom > obstacleRect.top &&
                tigerRect.top < obstacleRect.bottom
            ) {
                gameOver = true;
                finalScoreElement.textContent = `Final Score: ${score}`;
                gameOverMessage.style.display = 'block';

                // Update skor tertinggi jika skor saat ini lebih tinggi
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('highScore', highScore); // Simpan skor tertinggi di localStorage
                    highScoreElement.textContent = `High Score: ${highScore}`;
                }
                return;
            }
            requestAnimationFrame(moveObstacle);
        }
        moveObstacle();
    });
}

function resetGame() {
    obstacles.forEach(obstacle => obstacle.style.left = `${window.innerWidth}px`);
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    gameOverMessage.style.display = 'none';
    gameOver = false;
    startGame();
}

function startGame() {
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    moveObstacles();
}

startGame();
