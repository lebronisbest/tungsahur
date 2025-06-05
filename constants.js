// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

/**
* 화면 흔들림 효과를 적용합니다.
*/
function shakeScreen() {
gameContainer.classList.add('shake-screen');
setTimeout(() => {
gameContainer.classList.remove('shake-screen');
}, SCREEN_SHAKE_DURATION);
}

/**
* 캔버스에 플레이어를 그립니다.
* 이 함수는 이제 각 플레이어 객체에 정의된 `drawCharacter` 함수를 호출합니다.
* @param {object} player - 그릴 플레이어 객체.
*/
function drawPlayer(player) {
if (player.drawCharacter) {
player.drawCharacter(player, ctx);
}
}

// Get UI elements
const characterSelectionScreen = document.getElementById('characterSelectionScreen');
const gameContainer = document.getElementById('gameContainer');
const selectTungtungButton = document.getElementById('selectTungtung');
const selectTralalaroButton = document.getElementById('selectTralalaro'); // Changed to new character button
const player1AttackButton = document.getElementById('player1AttackButton');
const player1GuardButton = document.getElementById('player1GuardButton');
const player1SpecialButton = document.getElementById('player1SpecialButton');
const specialMovesListElement = document.getElementById('specialMovesList');
const messageBoxOverlay = document.getElementById('messageBoxOverlay');
const messageBoxTitle = document.getElementById('messageBoxTitle');
const messageBoxContent = document.getElementById('messageBoxContent');
const messageBoxCloseButton = document.getElementById('messageBoxCloseButton');
const generateLoreButton = document.getElementById('generateLoreButton');
const characterLoreDisplay = document.getElementById('characterLoreDisplay');

// Game constants
const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 32;
const PLAYER_SPEED = 2; // Reduced for 32x32 characters
const ATTACK_RANGE = 20;
const MAX_HEALTH = 100;
const MAX_MANA = 100;
const MANA_REGEN_RATE_PER_SECOND = 15;
const BASIC_ATTACK_COOLDOWN = 400; // Basic attack cooldown
const HIT_EFFECT_DURATION = 100;
const GUARD_DAMAGE_REDUCTION_FACTOR = 0.5;
const AI_GUARD_CHANCE = 0.4;
const AI_GUARD_DURATION = 800;
const COMMAND_WINDOW = 300;
const SCREEN_SHAKE_DURATION = 150;
const ROUND_TIME = 99;
const MAX_ROUNDS = 3; // Best of 3 rounds

// Size of the world, larger than the canvas to allow camera panning
const WORLD_WIDTH = 2000;

const GRAVITY = 0.3; // Gravity for jump
const JUMP_VELOCITY = -7; // Initial upward velocity for jump
const GROUND_Y = canvas.height - PLAYER_HEIGHT - 20; // Ground level for Tungtung

// Tralalaro specific constants, it's a ground based character
const TRALALARO_HEIGHT_OFFSET = 0; // Tralalaro is ground based
const TRALALARO_VERTICAL_SPEED = 0; // Tralalaro does not fly
const TRALALARO_MIN_Y = GROUND_Y;
const TRALALARO_MAX_Y = GROUND_Y;


// Camera constants
const CAMERA_ZOOM_SPEED = 0.03; // How fast camera zooms (slower)
const CAMERA_PAN_SPEED = 0.05; // How fast camera pans (slower)
const MIN_ZOOM = 1.0; // Minimum zoom level (zoomed in)
const MAX_ZOOM = 0.6; // Adjusted: Maximum zoom level (zoomed out more to see both)
const CAMERA_BUFFER_X = canvas.width * 0.2; // Horizontal buffer to trigger zoom out
const CAMERA_BUFFER_Y = canvas.height * 0.1; // Vertical buffer to trigger zoom out

// Game state variables
let player1 = {};
let player2 = {};
// Updated keys to use Arrow keys for movement and jump
let keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false, w: false, s: false };
let gameRunning = true;
let gameStarted = false; // True after countdown
let roundTimer = ROUND_TIME;
let timerInterval;
let animationFrameId;
let commandBuffer = [];
let lastInputTime = 0;
let canvasMessage = '';
let canvasMessageTimer = 0;
let floatingDamageNumbers = []; // [{x, y, damage, timer}]
let projectiles = []; // Array to hold active projectiles

// --- Utility Functions ---

/**
* Displays a custom message box.
* @param {string} title - Message title.
* @param {string} message - Message content.
* @param {function} onClose - Callback function to be called when the message box closes.
*/
function showMessageBox(title, message, onClose = () => {}) {
messageBoxTitle.textContent = title;
messageBoxContent.textContent = message;
messageBoxOverlay.classList.add('active');

const closeHandler = () => {
messageBoxOverlay.classList.remove('active');
messageBoxCloseButton.removeEventListener('click', closeHandler);
onClose();
};
messageBoxCloseButton.addEventListener('click', closeHandler);
}

/**
* Displays a game message directly on the canvas for a short duration.
* @param {string} message - Message to display.
*/
function displayCanvasMessage(message) {
canvasMessage = message;
canvasMessageTimer = 1500; // Display for 1.5 seconds
}

/**
* Adds a floating damage number to be displayed.
* @param {number} x - X coordinate to display.
* @param {number} y - Y coordinate to display.
* @param {number} damage - Damage value.
* @param {boolean} isCrit - Whether it's a critical hit.
*/
function addFloatingDamage(x, y, damage, isCrit = false) {
floatingDamageNumbers.push({
x: x,
y: y,
damage: damage,
timer: 1000, // Display for 1 second
isCrit: isCrit
});
}

// --- Drawing Functions ---

/**
* Draws a pixel art background on the canvas.
*/
function drawPixelBackground() {
const pixel = 1;

// Sky (gradient)
const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
skyGradient.addColorStop(0, '#87CEEB');
skyGradient.addColorStop(1, '#6A5ACD');
ctx.fillStyle = skyGradient;
ctx.fillRect(0, 0, WORLD_WIDTH, canvas.height);

// Clouds (random pixels)
ctx.fillStyle = '#FFFFFF';
for (let i = 0; i < 70; i++) {
const cloudX = Math.floor(Math.random() * WORLD_WIDTH / pixel) * pixel;
const cloudY = Math.floor(Math.random() * canvas.height / 3 / pixel) * pixel;
const cloudWidth = Math.floor(Math.random() * 8 + 3) * pixel;
const cloudHeight = Math.floor(Math.random() * 4 + 2) * pixel;
ctx.fillRect(cloudX, cloudY, cloudWidth, cloudHeight);
}

// Distant Mountains (darker)
ctx.fillStyle = '#36454F';
ctx.beginPath();
ctx.moveTo(0, canvas.height - 80);
ctx.lineTo(WORLD_WIDTH * 0.15, canvas.height - 130);
ctx.lineTo(WORLD_WIDTH * 0.3, canvas.height - 90);
ctx.lineTo(WORLD_WIDTH * 0.45, canvas.height - 150);
ctx.lineTo(WORLD_WIDTH * 0.6, canvas.height - 100);
ctx.lineTo(WORLD_WIDTH * 0.8, canvas.height - 140);
ctx.lineTo(WORLD_WIDTH, canvas.height - 90);
ctx.lineTo(WORLD_WIDTH, canvas.height);
ctx.lineTo(0, canvas.height);
ctx.fill();

// Closer Mountains (lighter)
ctx.fillStyle = '#4B5563';
ctx.beginPath();
ctx.moveTo(0, canvas.height - 50);
ctx.lineTo(WORLD_WIDTH / 4, canvas.height - 100);
ctx.lineTo(WORLD_WIDTH / 2, canvas.height - 50);
ctx.lineTo(WORLD_WIDTH * 3 / 4, canvas.height - 120);
ctx.lineTo(WORLD_WIDTH, canvas.height - 60);
ctx.lineTo(WORLD_WIDTH, canvas.height);
ctx.lineTo(0, canvas.height);
ctx.fill();

// Ground (green)
ctx.fillStyle = '#48BB78';
ctx.fillRect(0, canvas.height - 40, WORLD_WIDTH, 40);

// Ground details (darker green pixels)
ctx.fillStyle = '#38A169';
for (let i = 0; i < 150; i++) {
const detailX = Math.floor(Math.random() * WORLD_WIDTH / pixel) * pixel;
const detailY = Math.floor(Math.random() * 30 / pixel) * pixel + (canvas.height - 40);
ctx.fillRect(detailX, detailY, pixel, pixel);
}
}

/**
* Draws UI elements directly on the canvas.
*/
function drawCanvasUI() {
const barWidth = canvas.width / 2 - 50;
const barHeight = 15;
const barY = 20;
const pixel = 1;

// Player 1 Health Bar
ctx.fillStyle = '#e2e8f0';
ctx.fillRect(20, barY, barWidth, barHeight);
ctx.fillStyle = '#63b3ed';
ctx.fillRect(20, barY, barWidth * (gameManager.player1.health / MAX_HEALTH), barHeight);
ctx.strokeStyle = '#202020';
ctx.lineWidth = pixel;
ctx.strokeRect(20, barY, barWidth, barHeight);
ctx.font = `${10 * pixel}px 'Press Start 2P'`; // Smaller font for numbers
ctx.fillStyle = '#1a202c'; // Dark text
ctx.textAlign = 'center';
ctx.fillText(`${gameManager.player1.health.toFixed(0)}/${MAX_HEALTH}`, 20 + barWidth / 2, barY + barHeight / 2 + 4);

// Player 2 Health Bar
ctx.fillStyle = '#e2e8f0';
ctx.fillRect(canvas.width - 20 - barWidth, barY, barWidth, barHeight);
ctx.fillStyle = '#f56565';
ctx.fillRect(canvas.width - 20 - barWidth, barY, barWidth * (gameManager.player2.health / MAX_HEALTH), barHeight);
ctx.strokeStyle = '#202020';
ctx.strokeRect(canvas.width - 20 - barWidth, barY, barWidth, barHeight);
ctx.fillText(`${gameManager.player2.health.toFixed(0)}/${MAX_HEALTH}`, canvas.width - 20 - barWidth / 2, barY + barHeight / 2 + 4);

// Mana Bars
const manaBarY = barY + barHeight + 10;
const manaBarHeight = 10;

// Player 1 Mana Bar
ctx.fillStyle = '#e2e8f0';
ctx.fillRect(20, manaBarY, barWidth, manaBarHeight);
ctx.fillStyle = '#9f7aea';
ctx.fillRect(20, manaBarY, barWidth * (gameManager.player1.mana / MAX_MANA), manaBarHeight);
ctx.strokeStyle = '#202020';
ctx.strokeRect(20, manaBarY, barWidth, manaBarHeight);
ctx.fillText(`${gameManager.player1.mana.toFixed(0)}/${MAX_MANA}`, 20 + barWidth / 2, manaBarY + manaBarHeight / 2 + 4);

// Player 2 Mana Bar
ctx.fillStyle = '#e2e8f0';
ctx.fillRect(canvas.width - 20 - barWidth, manaBarY, barWidth, manaBarHeight);
ctx.fillStyle = '#9f7aea';
ctx.fillRect(canvas.width - 20 - barWidth, manaBarY, barWidth * (gameManager.player2.mana / MAX_MANA), manaBarHeight);
ctx.strokeStyle = '#202020';
ctx.strokeRect(canvas.width - 20 - barWidth, manaBarY, barWidth, manaBarHeight);
ctx.fillText(`${gameManager.player2.mana.toFixed(0)}/${MAX_MANA}`, canvas.width - 20 - barWidth / 2, manaBarY + manaBarHeight / 2 + 4);

// Player Names
ctx.font = `${12 * pixel}px 'Press Start 2P'`;
ctx.fillStyle = '#e2e8f0';
ctx.textAlign = 'left';
ctx.fillText(gameManager.player1.name, 20, barY - 5);
ctx.textAlign = 'right';
ctx.fillText(gameManager.player2.name, canvas.width - 20, barY - 5);

// Round Timer
ctx.font = `${24 * pixel}px 'Press Start 2P'`;
ctx.fillStyle = '#ecc94b';
ctx.textAlign = 'center';
ctx.fillText(gameManager.roundTimer.toString(), canvas.width / 2, 40);

// Round Score
ctx.font = `${16 * pixel}px 'Press Start 2P'`;
ctx.fillStyle = '#e2e8f0';
ctx.textAlign = 'left';
ctx.fillText(`P1: ${gameManager.player1Score}`, 20, 100);
ctx.textAlign = 'right';
ctx.fillText(`P2: ${gameManager.player2Score}`, canvas.width - 20, 100);


// Canvas Message (GO!, countdown, etc.)
if (gameManager.canvasMessageTimer > 0) {
ctx.font = `${48 * pixel}px 'Press Start 2P'`;
ctx.fillStyle = '#ecc94b';
ctx.textAlign = 'center';
ctx.fillText(gameManager.canvasMessage, canvas.width / 2, canvas.height / 2);
}

// Floating Damage Numbers
ctx.textAlign = 'center';
floatingDamageNumbers.forEach(dmg => {
ctx.font = `${dmg.isCrit ? 18 : 14}px 'Press Start 2P'`;
ctx.fillStyle = dmg.isCrit ? 'yellow' : 'white';
ctx.fillText(dmg.damage.toFixed(0), dmg.x, dmg.y - (1000 - dmg.timer) / 20);
});
}

/**
* Draws a basic attack visual effect (e.g., hit spark).
* @param {object} target - The target player.
* @param {string} type - Type of attack (e.g., 'basic').
*/
function drawAttackEffect(target, type) {
if (type === 'basic') {
const effectSize = 10;
const effectX = target.x + target.width / 2 - effectSize / 2;
const effectY = target.y + target.height / 2 - effectSize / 2;

ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // White spark
ctx.fillRect(effectX, effectY, effectSize, effectSize);
ctx.fillStyle = 'rgba(255, 165, 0, 0.8)'; // Orange center
ctx.fillRect(effectX + effectSize / 4, effectY + effectSize / 4, effectSize / 2, effectSize / 2);
}
}

// Add dust effect for ground movement
function drawDustEffect(x, y) {
const pixel = 1;
ctx.fillStyle = 'rgba(150, 150, 150, 0.5)'; // Grayish dust
for (let i = 0; i < 3; i++) { // Fewer dust particles for smaller size
const dustX = x + (Math.random() - 0.5) * 5 * pixel; // Smaller spread
const dustY = y + (Math.random() - 0.5) * 2 * pixel; // Smaller vertical movement
ctx.fillRect(dustX, dustY, 1 * pixel, 1 * pixel); // Smaller dust particles
}
}

