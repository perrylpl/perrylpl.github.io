const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const startBtn = document.getElementById('startBtn');

// 设置方块大小
const blockSize = 20;
const boardWidth = canvas.width / blockSize;
const boardHeight = canvas.height / blockSize;

// 游戏状态
let score = 0;
let level = 1;
let gameLoop;
let currentPiece;
let board = [];

// 方块形状
const pieces = [
    [[1, 1, 1, 1]],  // I
    [[1, 1], [1, 1]],  // O
    [[1, 1, 1], [0, 1, 0]],  // T
    [[1, 1, 1], [1, 0, 0]],  // L
    [[1, 1, 1], [0, 0, 1]],  // J
    [[1, 1, 0], [0, 1, 1]],  // S
    [[0, 1, 1], [1, 1, 0]]   // Z
];

// 初始化游戏板
function initBoard() {
    for(let y = 0; y < boardHeight; y++) {
        board[y] = [];
        for(let x = 0; x < boardWidth; x++) {
            board[y][x] = 0;
        }
    }
}

// 创建新方块
function createPiece() {
    const piece = pieces[Math.floor(Math.random() * pieces.length)];
    return {
        shape: piece,
        x: Math.floor((boardWidth - piece[0].length) / 2),
        y: 0
    };
}

// 绘制方块
function draw() {
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制已固定的方块
    for(let y = 0; y < boardHeight; y++) {
        for(let x = 0; x < boardWidth; x++) {
            if(board[y][x]) {
                context.fillStyle = '#f9ce20';
                context.fillRect(x * blockSize, y * blockSize, blockSize-1, blockSize-1);
            }
        }
    }
    
    // 绘制当前方块
    if(currentPiece) {
        context.fillStyle = '#f9ce20';
        currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if(value) {
                    context.fillRect(
                        (currentPiece.x + x) * blockSize,
                        (currentPiece.y + y) * blockSize,
                        blockSize-1,
                        blockSize-1
                    );
                }
            });
        });
    }
}

// 碰撞检测
function collision() {
    return currentPiece.shape.some((row, y) => {
        return row.some((value, x) => {
            if(!value) return false;
            const boardX = currentPiece.x + x;
            const boardY = currentPiece.y + y;
            return boardX < 0 || 
                   boardX >= boardWidth ||
                   boardY >= boardHeight ||
                   (boardY >= 0 && board[boardY][boardX]);
        });
    });
}

// 合并方块到游戏板
function merge() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value) {
                board[currentPiece.y + y][currentPiece.x + x] = value;
            }
        });
    });
}

// 清除完整的行
function clearLines() {
    let linesCleared = 0;
    for(let y = boardHeight - 1; y >= 0; y--) {
        if(board[y].every(value => value)) {
            board.splice(y, 1);
            board.unshift(new Array(boardWidth).fill(0));
            linesCleared++;
            y++;
        }
    }
    if(linesCleared) {
        score += linesCleared * 100 * level;
        scoreElement.textContent = score;
        if(score >= level * 1000) {
            level++;
            levelElement.textContent = level;
        }
    }
}

// 移动方块
function movePiece(dx, dy) {
    currentPiece.x += dx;
    currentPiece.y += dy;
    if(collision()) {
        currentPiece.x -= dx;
        currentPiece.y -= dy;
        if(dy > 0) {
            merge();
            clearLines();
            currentPiece = createPiece();
            if(collision()) {
                gameOver();
            }
        }
        return false;
    }
    return true;
}

// 旋转方块
function rotatePiece() {
    const originalShape = currentPiece.shape;
    const rotated = currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map(row => row[i]).reverse()
    );
    currentPiece.shape = rotated;
    if(collision()) {
        currentPiece.shape = originalShape;
    }
}

// 游戏主循环
function update() {
    movePiece(0, 1);
    draw();
}

// 开始游戏
function startGame() {
    if(gameLoop) {
        clearInterval(gameLoop);
    }
    initBoard();
    score = 0;
    level = 1;
    scoreElement.textContent = score;
    levelElement.textContent = level;
    currentPiece = createPiece();
    gameLoop = setInterval(update, 1000 / level);
    startBtn.textContent = '重新开始';
}

// 游戏结束
function gameOver() {
    clearInterval(gameLoop);
    gameLoop = null;
    alert(`游戏结束！得分：${score}`);
}

// 键盘控制
document.addEventListener('keydown', event => {
    if(!currentPiece || !gameLoop) return;
    
    switch(event.keyCode) {
        case 37: // 左箭头
            movePiece(-1, 0);
            break;
        case 39: // 右箭头
            movePiece(1, 0);
            break;
        case 40: // 下箭头
            movePiece(0, 1);
            break;
        case 38: // 上箭头
            rotatePiece();
            break;
        case 32: // 空格
            while(movePiece(0, 1)) {}
            break;
    }
    draw();
});

startBtn.addEventListener('click', startGame);
draw(); 