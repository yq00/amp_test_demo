// 游戏配置
const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const INITIAL_SPEED = 150;

// 游戏状态
let canvas, ctx;
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = {};
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gameLoop;

// 初始化游戏
function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // 显示最高分
    document.getElementById('high-score').textContent = highScore;
    
    // 生成食物
    generateFood();
    
    // 添加事件监听器
    document.addEventListener('keydown', handleKeyPress);
    document.getElementById('restartBtn').addEventListener('click', restartGame);
    
    // 开始游戏循环
    startGame();
}

// 开始游戏
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gameLoop = setInterval(updateGame, INITIAL_SPEED);
    }
}

// 更新游戏状态
function updateGame() {
    moveSnake();
    
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    if (checkFoodCollision()) {
        eatFood();
        generateFood();
    }
    
    draw();
}

// 移动蛇
function moveSnake() {
    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;
    
    snake.unshift(head);
    
    // 如果没有吃到食物，移除尾巴
    if (head.x !== food.x || head.y !== food.y) {
        snake.pop();
    }
}

// 检查碰撞
function checkCollision() {
    const head = snake[0];
    
    // 检查墙壁碰撞
    if (head.x < 0 || head.x >= CANVAS_SIZE || head.y < 0 || head.y >= CANVAS_SIZE) {
        return true;
    }
    
    // 检查自身碰撞
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// 检查食物碰撞
function checkFoodCollision() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}

// 吃食物
function eatFood() {
    score += 10;
    document.getElementById('score').textContent = score;
    
    // 更新最高分
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        document.getElementById('high-score').textContent = highScore;
    }
}

// 生成食物
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)) * GRID_SIZE,
            y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)) * GRID_SIZE
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    food = newFood;
}

// 绘制游戏
function draw() {
    // 清除画布
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // 绘制蛇
    ctx.fillStyle = '#4ecdc4';
    snake.forEach((segment, index) => {
        if (index === 0) {
            // 蛇头用不同颜色
            ctx.fillStyle = '#ff6b6b';
        } else {
            ctx.fillStyle = '#4ecdc4';
        }
        ctx.fillRect(segment.x, segment.y, GRID_SIZE - 2, GRID_SIZE - 2);
    });
    
    // 绘制食物
    ctx.fillStyle = '#feca57';
    ctx.fillRect(food.x, food.y, GRID_SIZE - 2, GRID_SIZE - 2);
}

// 处理键盘输入
function handleKeyPress(event) {
    if (!gameRunning) return;
    
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) {
                direction = { x: 0, y: -GRID_SIZE };
            }
            break;
        case 'ArrowDown':
            if (direction.y === 0) {
                direction = { x: 0, y: GRID_SIZE };
            }
            break;
        case 'ArrowLeft':
            if (direction.x === 0) {
                direction = { x: -GRID_SIZE, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (direction.x === 0) {
                direction = { x: GRID_SIZE, y: 0 };
            }
            break;
    }
    
    // 阻止方向键滚动页面
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }
}

// 游戏结束
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    
    // 显示游戏结束界面
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').style.display = 'block';
}

// 重新开始游戏
function restartGame() {
    // 重置游戏状态
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    score = 0;
    gameRunning = false;
    
    // 更新界面
    document.getElementById('score').textContent = score;
    document.getElementById('gameOver').style.display = 'none';
    
    // 生成新食物
    generateFood();
    
    // 清除旧的游戏循环
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    
    // 重新绘制
    draw();
    
    // 开始新游戏
    startGame();
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', initGame);
