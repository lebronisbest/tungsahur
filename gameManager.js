// --- GameManager Class ---
class GameManager {
constructor() {
this.player1 = {};
this.player2 = {};
this.keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false, w: false, s: false };
this.gameRunning = true;
this.gameStarted = false;
this.roundTimer = ROUND_TIME;
this.timerInterval = null;
this.animationFrameId = null;
this.commandBuffer = [];
this.lastInputTime = 0;
this.canvasMessage = '';
this.canvasMessageTimer = 0;
this.floatingDamageNumbers = [];
this.projectiles = [];
this.currentRound = 1;
this.player1Score = 0;
this.player2Score = 0;
this.selectedCharacterId = null; // Track selected character for lore generation

// Camera state
this.cameraX = WORLD_WIDTH / 2;
this.cameraY = canvas.height / 2;
this.cameraZoom = MIN_ZOOM;
}

/**
* Displays a game message directly on the canvas for a short duration.
* @param {string} message - Message to display.
*/
displayCanvasMessage(message) {
this.canvasMessage = message;
this.canvasMessageTimer = 1500; // Display for 1.5 seconds
}

/**
* Adds a floating damage number to be displayed.
* @param {number} x - X coordinate to display.
* @param {number} y - Y coordinate to display.
* @param {number} damage - Damage value.
* @param {boolean} isCrit - Whether it's a critical hit.
*/
addFloatingDamage(x, y, damage, isCrit = false) {
this.floatingDamageNumbers.push({
x: x,
y: y,
damage: damage,
timer: 1000, // Display for 1 second
isCrit: isCrit
});
}

/**
* Initializes player data based on character selection.
* @param {string} player1CharId - ID of the character selected by Player 1.
*/
initPlayers(player1CharId) {
const player1Data = characterDefinitions[player1CharId];
// Changed opponent to tralalaro
const player2CharId = (player1CharId === "tungtung") ? "tralarero" : "tungtung";
const player2Data = characterDefinitions[player2CharId];

this.player1 = {
...player1Data,
x: 100,
y: GROUND_Y, // Tungtung starts on the ground
width: PLAYER_WIDTH,
height: PLAYER_HEIGHT,
health: MAX_HEALTH,
mana: MAX_MANA,
isAttacking: false,
attackCooldown: 0,
direction: 1, // Facing right
hitEffectTimer: 0,
isGuarding: false,
isWinner: false,
isLoser: false,
isJumping: false, // New: for Tungtung's jump state
velocityY: 0, // New: for Tungtung's vertical velocity
groundY: GROUND_Y, // New: Tungtung's ground level
specialMove: {
...player1Data.specialMove,
command: player1Data.specialMove.command ? [...player1Data.specialMove.command] : []
}
};

this.player2 = {
...player2Data,
x: WORLD_WIDTH - 100 - PLAYER_WIDTH,
y: GROUND_Y, // Tralalaro also starts on the ground
width: PLAYER_WIDTH,
height: PLAYER_HEIGHT,
health: MAX_HEALTH,
mana: MAX_MANA,
isAttacking: false,
attackCooldown: 0,
direction: -1, // Facing left
isAI: true,
aiActionTimer: 0,
hitEffectTimer: 0,
isGuarding: false,
aiGuardTimer: 0,
isWinner: false,
isLoser: false,
isJumping: false, // Tralalaro also has jump
velocityY: 0,
groundY: GROUND_Y,
specialMove: {
...player2Data.specialMove,
command: player2Data.specialMove.command ? [...player2Data.specialMove.command] : []
}
};
}

/**
* Starts a new round, resetting player health/mana and positions.
*/
startNewRound() {
this.player1.health = MAX_HEALTH;
this.player1.mana = MAX_MANA;
this.player1.x = 100;
this.player1.y = GROUND_Y; // Reset Tungtung to ground
this.player1.isJumping = false;
this.player1.velocityY = 0;
this.player1.isAttacking = false;
this.player1.isGuarding = false;
this.player1.specialAttackActive = false;
this.player1.hitEffectTimer = 0;
this.player1.isWinner = false;
this.player1.isLoser = false;

this.player2.health = MAX_HEALTH;
this.player2.mana = MAX_MANA;
this.player2.x = WORLD_WIDTH - 100 - PLAYER_WIDTH;
this.player2.y = GROUND_Y; // Reset Tralalaro to ground
this.player2.isJumping = false;
this.player2.velocityY = 0;
this.player2.isAttacking = false;
this.player2.isGuarding = false;
this.player2.specialAttackActive = false;
this.player2.hitEffectTimer = 0;
this.player2.isWinner = false;
this.player2.isLoser = false;
this.player2.aiGuardTimer = 0;
this.player2.aiActionTimer = 0;

this.roundTimer = ROUND_TIME;
this.canvasMessage = '';
this.canvasMessageTimer = 0;
this.floatingDamageNumbers = [];
this.projectiles = [];
this.commandBuffer = [];
this.lastInputTime = 0;
this.gameStarted = false; // Reset gameStarted for countdown

// Reset camera for new round
this.cameraX = WORLD_WIDTH / 2;
this.cameraY = canvas.height / 2;
this.cameraZoom = MIN_ZOOM;

// Start countdown for new round
let countdownValue = 3;
this.displayCanvasMessage(`ROUND ${this.currentRound}`);
setTimeout(() => {
const countdownInterval = setInterval(() => {
if (countdownValue > 0) {
this.displayCanvasMessage(countdownValue.toString());
countdownValue--;
} else {
clearInterval(countdownInterval);
this.displayCanvasMessage("FIGHT!");
this.gameStarted = true;
this.timerInterval = setInterval(() => this.updateRoundTimer(), 1000);
}
}, 1000);
}, 1500); // Display "ROUND X" for 1.5 seconds, then start countdown
}


/**
* Starts the countdown and then the game.
* @param {string} player1CharId - ID of the character selected by Player 1.
*/
async startCountdownAndGame(player1CharId) {
this.initPlayers(player1CharId);

// Hide lore generation elements
generateLoreButton.style.display = 'none';
characterLoreDisplay.style.display = 'none';
characterLoreDisplay.textContent = ''; // Clear previous lore

// Update special moves list for player 1
if (this.player1.specialMove && this.player1.specialMove.command) {
let movesHtml = `<strong>${this.player1.name} 특수 기술:</strong><br>`;
// Update command display for arrow keys
movesHtml += `${this.player1.specialMove.name}: ${this.player1.specialMove.command.map(k => {
if (k === 'ArrowLeft') return '←';
if (k === 'ArrowRight') return '→';
if (k === 'ArrowUp') return '↑';
if (k === 'ArrowDown') return '↓';
return k.toUpperCase();
}).join(' → ')} + W (공격)<br>`;
specialMovesListElement.innerHTML = movesHtml;
} else {
specialMovesListElement.innerHTML = `<strong>특수 기술 정보 없음.</strong>`;
}

characterSelectionScreen.style.display = 'none';
gameContainer.style.display = 'flex';

// Initial drawing to show characters before countdown
drawPixelBackground();
drawPlayer(this.player1);
drawPlayer(this.player2);
this.drawUI();

this.currentRound = 1;
this.player1Score = 0;
this.player2Score = 0;
this.startNewRound(); // Start the first round

this.gameRunning = true;
this.gameLoop();
}

/**
* Resets game state and prepares for a new game.
*/
resetGame() {
gameContainer.style.display = 'none';
characterSelectionScreen.style.display = 'flex';

this.player1 = {};
this.player2 = {};
this.keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false, w: false, s: false }; // Reset keys state
this.gameRunning = false;
this.gameStarted = false;
clearInterval(this.timerInterval);
cancelAnimationFrame(this.animationFrameId);
this.roundTimer = ROUND_TIME;
this.canvasMessage = '';
this.canvasMessageTimer = 0;
this.floatingDamageNumbers = [];
this.projectiles = [];
this.commandBuffer = [];
this.lastInputTime = 0;
this.currentRound = 1;
this.player1Score = 0;
this.player2Score = 0;
this.selectedCharacterId = null; // Clear selected character
generateLoreButton.style.display = 'none'; // Hide lore button
characterLoreDisplay.style.display = 'none'; // Hide lore display
characterLoreDisplay.textContent = ''; // Clear lore text

// Reset camera state
this.cameraX = WORLD_WIDTH / 2;
this.cameraY = canvas.height / 2;
this.cameraZoom = MIN_ZOOM;
}

/**
* Handles player attacks (basic and special moves).
* @param {object} attacker - Attacking player.
* @param {object} target - Target player.
* @param {object} [move] - Special move object if applicable.
*/
handleAttack(attacker, target, move = null) {
const damage = move ? move.damage : attacker.basicAttackDamage;
const manaCost = move ? move.manaCost : 0;
const cooldown = move ? move.cooldown : BASIC_ATTACK_COOLDOWN;
const attackName = move ? move.name : "기본 공격";

if (attacker.attackCooldown > 0) {
if (move) this.displayCanvasMessage(`${attacker.name}: ${attackName} 쿨다운 중!`);
return;
}

if (move && attacker.mana < manaCost) {
this.displayCanvasMessage(`${attacker.name}: ${attackName} 마나가 부족합니다!`);
return;
}

attacker.isAttacking = true;
attacker.attackCooldown = cooldown;
attacker.specialAttackActive = move ? attackName : false;

if (move) {
attacker.mana -= manaCost;
}

// If it's a projectile-based basic attack (Tralalaro's basic bomb)
if (!move && attacker.basicAttackProjectile) {
const projX = attacker.x + attacker.width / 2 - attacker.basicAttackProjectile.width / 2;
const projY = attacker.y + attacker.height; // Drop from below the bomber
const newProjectile = new Projectile(
projX, projY,
attacker.basicAttackProjectile.width, attacker.basicAttackProjectile.height,
attacker.basicAttackProjectile.speed, 0, // Direction 0 means straight down
attacker.basicAttackDamage, attacker,
attacker.basicAttackProjectile.draw
);
this.projectiles.push(newProjectile);
}
// If it's a special move with a projectile (Tungtung's Hadouken)
else if (move && move.projectile) {
const projX = attacker.direction === 1 ? attacker.x + attacker.width : attacker.x - move.projectile.width;
const projY = attacker.y + attacker.height / 2 - move.projectile.height / 2;
const newProjectile = new Projectile(
projX, projY,
move.projectile.width, move.projectile.height,
move.projectile.speed, attacker.direction,
move.damage, attacker,
move.projectile.draw
);
this.projectiles.push(newProjectile);
}


setTimeout(() => {
attacker.isAttacking = false;
attacker.specialAttackActive = false;
}, move ? move.effectDuration : 150); // Use move's effect duration or default

// Collision detection for non-projectile attacks
// This part handles Tungtung's basic melee attack and Tralalaro's special attack (dash/lunge)
if (!move || (!move.projectile && !attacker.basicAttackProjectile)) { // Only check collision here if not a projectile
let finalDamage = damage;
let hit = false;

if (move && move.name === "상어 돌진") { // Tralalaro's special attack (dash/lunge)
const dashRange = PLAYER_WIDTH * 1.5;
const targetCenterX = target.x + target.width / 2;
const attackerCenterX = attacker.x + attacker.width / 2;

if (Math.abs(attackerCenterX - targetCenterX) < dashRange &&
attacker.y < target.y + target.height &&
attacker.y + attacker.height > target.y) {
hit = true;
}
} else if (!attacker.basicAttackProjectile) { // Tungtung's basic attack (melee)
let attackHitboxXStart;
let attackHitboxXEnd;

if (attacker.direction === 1) {
attackHitboxXStart = attacker.x + attacker.width;
attackHitboxXEnd = attacker.x + attacker.width + ATTACK_RANGE;
} else {
attackHitboxXStart = attacker.x - ATTACK_RANGE;
attackHitboxXEnd = attacker.x;
}

if (attackHitboxXEnd > target.x &&
attackHitboxXStart < target.x + target.width &&
attacker.y < target.y + target.height &&
attacker.y + attacker.height > target.y) {
hit = true;
}
}

if (hit) {
if (target.isGuarding) {
finalDamage *= GUARD_DAMAGE_REDUCTION_FACTOR;
this.displayCanvasMessage(`${target.name}이(가) 공격을 막았습니다!`);
}
target.health -= finalDamage;
if (target.health < 0) target.health = 0;
this.displayCanvasMessage(`${attacker.name}이(가) ${target.name}에게 ${finalDamage.toFixed(0)} 피해를 입혔습니다! (${attackName})`);
this.addFloatingDamage(target.x + target.width / 2, target.y, finalDamage, finalDamage > damage * 0.8);
shakeScreen();
target.hitEffectTimer = HIT_EFFECT_DURATION;
if (!move && !attacker.basicAttackProjectile) { // Only draw basic attack effect if it's a basic melee attack
drawAttackEffect(target, 'basic');
}
} else if (move && !move.projectile && !attacker.basicAttackProjectile) {
this.displayCanvasMessage(`${attacker.name}의 ${attackName}이(가) 빗나갔습니다!`);
}
}
}

/**
* Checks the command input buffer for special move activation.
* @param {object} player - Player object.
* @param {object} target - Target player object.
*/
checkSpecialMoveCommand(player, target) {
const now = Date.now();
this.commandBuffer = this.commandBuffer.filter(input => (now - input.timestamp) < COMMAND_WINDOW);

if (this.commandBuffer.length === 0) return;

const specialMove = player.specialMove;
if (!specialMove || !specialMove.command) return;

const requiredCommand = specialMove.command;

if (this.commandBuffer.length >= requiredCommand.length) {
let match = true;
for (let i = 0; i < requiredCommand.length; i++) {
const bufferIndex = this.commandBuffer.length - requiredCommand.length + i;
if (this.commandBuffer[bufferIndex].key !== requiredCommand[i]) {
match = false;
break;
}
}

if (match) {
// Check if player is on ground for ground-based special moves
if (player.id === "tungtung" && player.isJumping) {
this.displayCanvasMessage(`${player.name}: 공중에서는 파동권을 사용할 수 없습니다!`); // Custom message
return;
}
// Tralalaro's Dash requires not jumping
if (player.id === "tralarero" && player.isJumping) {
this.displayCanvasMessage(`${player.name}: 공중에서는 돌진을 사용할 수 없습니다!`);
return;
}

this.handleAttack(player, target, specialMove);
this.commandBuffer = [];
}
}
}

/**
* Handles Player 2 (AI) logic.
*/
handleAILogic() {
if (!this.player2.isAI || !this.gameRunning || !this.gameStarted) return;

const distanceX = Math.abs(this.player1.x - this.player2.x);
const distanceY = Math.abs(this.player1.y - this.player2.y);
const basicAttackRange = PLAYER_WIDTH * 1.5; // Tralalaro's melee basic attack range

// AI Guard logic
if (this.player1.isAttacking && distanceX < PLAYER_WIDTH * 2 && Math.random() < AI_GUARD_CHANCE && !this.player2.isGuarding) {
this.player2.isGuarding = true;
this.player2.aiGuardTimer = AI_GUARD_DURATION;
}

if (this.player2.aiGuardTimer > 0) {
this.player2.aiGuardTimer -= 1000 / 60;
if (this.player2.aiGuardTimer <= 0) {
this.player2.isGuarding = false;
}
}

// AI cannot move or attack while guarding
if (this.player2.isGuarding) {
this.player2.aiActionTimer = 0;
return;
}

// AI decision making (Tralalaro specific AI - Ground based)
if (this.player2.aiActionTimer <= 0) {
this.player2.aiActionTimer = Math.random() * 500 + 300; // Random delay for next action

// Prioritize special move (dash) if mana and cooldown allow and in good range
if (distanceX < canvas.width / 3 && this.player2.attackCooldown <= 0 && this.player2.mana >= this.player2.specialMove.manaCost && Math.random() < 0.4 && !this.player2.isJumping) {
this.handleAttack(this.player2, this.player1, this.player2.specialMove);
}
// Basic attack if in range
else if (distanceX < basicAttackRange && this.player2.attackCooldown <= 0 && !this.player2.isAttacking && !this.player2.isJumping) {
this.handleAttack(this.player2, this.player1);
}
// Move horizontally towards player
else {
if (this.player1.x < this.player2.x) {
this.player2.x -= PLAYER_SPEED;
this.player2.direction = -1;
} else if (this.player1.x > this.player2.x) {
this.player2.x += PLAYER_SPEED;
this.player2.direction = 1;
}

// AI Jump logic to follow player's vertical movement or avoid attacks
if (this.player2.y === this.player2.groundY) { // Only jump if on ground
if (this.player1.isJumping || (distanceY > PLAYER_HEIGHT * 0.8 && Math.random() < 0.2) || this.projectiles.some(p => p.owner === this.player1 && Math.abs(p.x - this.player2.x) < PLAYER_WIDTH * 2 && p.y > this.player2.y - 10)) { // Jump to avoid projectiles
this.player2.isJumping = true;
this.player2.velocityY = JUMP_VELOCITY;
}
}
}
} else {
this.player2.aiActionTimer -= 1000 / 60;
}

// Apply gravity to AI if jumping
if (this.player2.isJumping) {
this.player2.y += this.player2.velocityY;
this.player2.velocityY += GRAVITY;
if (this.player2.y >= this.player2.groundY) {
this.player2.y = this.player2.groundY;
this.player2.isJumping = false;
this.player2.velocityY = 0;
}
}
}

/**
* Updates the round timer.
*/
updateRoundTimer() {
this.roundTimer--;

if (this.roundTimer <= 0) {
clearInterval(this.timerInterval);
this.gameRunning = false;
let winner = null;
if (this.player1.health > this.player2.health) {
winner = this.player1;
this.player1Score++;
} else if (this.player2.health > this.player1.health) {
winner = this.player2;
this.player2Score++;
}

if (winner) {
winner.isWinner = true;
(winner === this.player1 ? this.player2 : this.player1).isLoser = true;
this.displayCanvasMessage("KO!"); // Display KO message
} else {
this.displayCanvasMessage("무승부!");
}

setTimeout(() => {
if (this.player1Score >= MAX_ROUNDS || this.player2Score >= MAX_ROUNDS) {
      const finalWinner = this.player1Score >= MAX_ROUNDS ? this.player1 : this.player2;
      showMessageBox("게임 종료!", `${finalWinner.name} 최종 승리!`, () => this.resetGame(), "다시 시작");
} else {
this.currentRound++;
this.startNewRound();
}
}, 2000); // Wait 2 seconds before next round or game over
}
}

/**
* Updates all game elements.
*/
update() {
if (!this.gameStarted) return;

// Mana regeneration
this.player1.mana = Math.min(MAX_MANA, this.player1.mana + (MANA_REGEN_RATE_PER_SECOND / 60));
this.player2.mana = Math.min(MAX_MANA, this.player2.mana + (MANA_REGEN_RATE_PER_SECOND / 60));

// Player 1 movement (cannot move while guarding)
if (!this.player1.isGuarding && !this.player1.isLoser && !this.player1.isWinner) {
if (this.keys.ArrowLeft) {
this.player1.x -= PLAYER_SPEED;
this.player1.direction = -1;
}
if (this.keys.ArrowRight) {
this.player1.x += PLAYER_SPEED;
this.player1.direction = 1;
}
// Jump logic for Tungtung
if (this.keys.ArrowUp && !this.player1.isJumping && this.player1.y === this.player1.groundY) { // Only jump if on ground
this.player1.isJumping = true;
this.player1.velocityY = JUMP_VELOCITY;
}
}

// Apply gravity to Tungtung if jumping
if (this.player1.isJumping) {
this.player1.y += this.player1.velocityY;
this.player1.velocityY += GRAVITY;
// Prevent falling through ground
if (this.player1.y >= this.player1.groundY) {
this.player1.y = this.player1.groundY;
this.player1.isJumping = false;
this.player1.velocityY = 0;
}
}


// Keep players within canvas bounds
this.player1.x = Math.max(0, Math.min(WORLD_WIDTH - this.player1.width, this.player1.x));
this.player2.x = Math.max(0, Math.min(WORLD_WIDTH - this.player2.width, this.player2.x));
// Clamp Tralalaro's vertical position
this.player2.y = Math.max(TRALALARO_MIN_Y, Math.min(TRALALARO_MAX_Y, this.player2.y));


// Update cooldowns
if (this.player1.attackCooldown > 0) {
this.player1.attackCooldown -= 1000 / 60;
}
if (this.player2.attackCooldown > 0) {
this.player2.attackCooldown -= 1000 / 60;
}

// Update hit effect timers
if (this.player1.hitEffectTimer > 0) {
this.player1.hitEffectTimer -= 1000 / 60;
}
if (this.player2.hitEffectTimer > 0) {
this.player2.hitEffectTimer -= 1000 / 60;
}

// Handle AI logic
this.handleAILogic();

// Update projectiles
this.projectiles.forEach(proj => {
proj.update();
// Check projectile-player collision
const target = proj.owner === this.player1 ? this.player2 : this.player1;
if (proj.active &&
proj.x < target.x + target.width &&
proj.x + proj.width > target.x &&
proj.y < target.y + target.height &&
proj.y + proj.height > target.y) {

let finalDamage = proj.damage;
if (target.isGuarding) {
finalDamage *= GUARD_DAMAGE_REDUCTION_FACTOR;
this.displayCanvasMessage(`${target.name}이(가) 공격을 막았습니다!`);
}
target.health -= finalDamage;
if (target.health < 0) target.health = 0;
this.displayCanvasMessage(`${proj.owner.name}이(가) ${target.name}에게 ${finalDamage.toFixed(0)} 피해를 입혔습니다! (${proj.owner.specialMove.name || '기본 공격'})`); // Handle basic attack projectiles
this.addFloatingDamage(target.x + target.width / 2, target.y, finalDamage, finalDamage > proj.damage * 0.8);
shakeScreen();
target.hitEffectTimer = HIT_EFFECT_DURATION;
proj.active = false; // Deactivate projectile on hit
}
});
this.projectiles = this.projectiles.filter(proj => proj.active); // Remove inactive projectiles

// Update floating damage numbers
this.floatingDamageNumbers.forEach(dmg => {
dmg.timer -= 1000 / 60;
});
this.floatingDamageNumbers = this.floatingDamageNumbers.filter(dmg => dmg.timer > 0);

// Check for round/game over conditions (health based)
if (this.player1.health <= 0 || this.player2.health <= 0) {
clearInterval(this.timerInterval); // Stop round timer
this.gameStarted = false; // Pause game logic
this.gameRunning = false; // Stop main loop temporarily for KO animation

let winner = null;
if (this.player1.health <= 0 && this.player2.health <= 0) {
this.displayCanvasMessage("더블 KO!");
} else if (this.player1.health <= 0) {
winner = this.player2;
this.player1.isLoser = true;
this.player2.isWinner = true;
this.player2Score++;
this.displayCanvasMessage("KO!");
} else if (this.player2.health <= 0) {
winner = this.player1;
this.player2.isLoser = true;
this.player1.isWinner = true;
this.player1Score++;
this.displayCanvasMessage("KO!");
}

setTimeout(() => {
if (this.player1Score >= MAX_ROUNDS || this.player2Score >= MAX_ROUNDS) {
      const finalWinner = this.player1Score >= MAX_ROUNDS ? this.player1 : this.player2;
      showMessageBox("게임 종료!", `${finalWinner.name} 최종 승리!`, () => this.resetGame(), "다시 시작");
} else {
this.currentRound++;
this.startNewRound();
}
}, 2000); // Wait 2 seconds before next round or game over
}
}

/**
* Draws all game elements.
*/
draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
drawPixelBackground();

// --- Camera Transform ---
ctx.save();

// Calculate midpoint between players
const midpointX = (this.player1.x + this.player1.width / 2 + this.player2.x + this.player2.width / 2) / 2;
// Since both are ground-based, fix Y slightly above ground level or average their Y if jumping
const midpointY = (this.player1.y + this.player1.height / 2 + this.player2.y + this.player2.height / 2) / 2;
const fixedCameraY = GROUND_Y - (canvas.height * 0.2); // Fixed height to keep ground and jump space visible

// Calculate required zoom based on player distance
const playersLeft = Math.min(this.player1.x, this.player2.x);
const playersRight = Math.max(this.player1.x + this.player1.width, this.player2.x + this.player2.width);
// For vertical extent, consider the lowest point (ground) and the highest point (jump apex)
const playersTop = Math.min(this.player1.y, this.player2.y);
const playersBottom = GROUND_Y + PLAYER_HEIGHT; // Always includes ground

const requiredWidth = playersRight - playersLeft + CAMERA_BUFFER_X;
const requiredHeight = (playersBottom - playersTop) + CAMERA_BUFFER_Y; // Includes jump height

let targetZoomX = canvas.width / requiredWidth;
let targetZoomY = canvas.height / requiredHeight;
let targetZoom = Math.min(targetZoomX, targetZoomY); // Use the smaller zoom to fit both dimensions

// Clamp zoom level
targetZoom = Math.max(MAX_ZOOM, Math.min(MIN_ZOOM, targetZoom));

// Smoothly interpolate camera position and zoom
this.cameraX += (midpointX - this.cameraX) * CAMERA_PAN_SPEED;
// Blend current midpointY with fixedCameraY or simply use fixedCameraY if characters are mostly on ground
this.cameraY += (midpointY - this.cameraY) * CAMERA_PAN_SPEED; // Keep following midpointY, but it will be clamped by character movement
this.cameraZoom += (targetZoom - this.cameraZoom) * CAMERA_ZOOM_SPEED;

// Apply transforms: translate to center, scale, then translate by inverse camera position
ctx.translate(canvas.width / 2, canvas.height / 2);
ctx.scale(this.cameraZoom, this.cameraZoom);
ctx.translate(-this.cameraX, -this.cameraY);

// --- Draw Game Elements (affected by camera) ---
drawPlayer(this.player1);
drawPlayer(this.player2);

// Draw special move effects (non-projectile)
if (this.player1.specialAttackActive && this.player1.specialMove.drawEffect && !this.player1.specialMove.projectile) {
this.player1.specialMove.drawEffect(this.player1, ctx);
}
if (this.player2.specialAttackActive && this.player2.specialMove.drawEffect && !this.player2.specialMove.projectile) {
this.player2.specialMove.drawEffect(this.player2, ctx);
}

// Draw projectiles
this.projectiles.forEach(proj => proj.draw());

// Restore context to draw UI not affected by camera
ctx.restore();

// --- Draw UI Elements (not affected by camera) ---
this.drawUI();
}

/**
* Draws UI elements on canvas.
*/
drawUI() {
const barWidth = canvas.width / 2 - 50;
const barHeight = 15;
const barY = 20;
const pixel = 1;

// Player 1 Health Bar
ctx.fillStyle = '#e2e8f0';
ctx.fillRect(20, barY, barWidth, barHeight);
ctx.fillStyle = '#63b3ed';
ctx.fillRect(20, barY, barWidth * (this.player1.health / MAX_HEALTH), barHeight);
ctx.strokeStyle = '#202020';
ctx.lineWidth = pixel;
ctx.strokeRect(20, barY, barWidth, barHeight);
ctx.font = `${10 * pixel}px 'Press Start 2P'`;
ctx.fillStyle = '#1a202c';
ctx.textAlign = 'center';
ctx.fillText(`${this.player1.health.toFixed(0)}/${MAX_HEALTH}`, 20 + barWidth / 2, barY + barHeight / 2 + 4);

// Player 2 Health Bar
ctx.fillStyle = '#e2e8f0';
ctx.fillRect(canvas.width - 20 - barWidth, barY, barWidth, barHeight);
ctx.fillStyle = '#f56565';
ctx.fillRect(canvas.width - 20 - barWidth, barY, barWidth * (this.player2.health / MAX_HEALTH), barHeight);
ctx.strokeStyle = '#202020';
ctx.strokeRect(canvas.width - 20 - barWidth, barY, barWidth, barHeight);
ctx.fillText(`${this.player2.health.toFixed(0)}/${MAX_HEALTH}`, canvas.width - 20 - barWidth / 2, barY + barHeight / 2 + 4);

// Mana Bars
const manaBarY = barY + barHeight + 10;
const manaBarHeight = 10;

// Player 1 Mana Bar
ctx.fillStyle = '#e2e8f0';
ctx.fillRect(20, manaBarY, barWidth, manaBarHeight);
ctx.fillStyle = '#9f7aea';
ctx.fillRect(20, manaBarY, barWidth * (this.player1.mana / MAX_MANA), manaBarHeight);
ctx.strokeStyle = '#202020';
ctx.strokeRect(20, manaBarY, barWidth, manaBarHeight);
ctx.fillText(`${this.player1.mana.toFixed(0)}/${MAX_MANA}`, 20 + barWidth / 2, manaBarY + manaBarHeight / 2 + 4);

// Player 2 Mana Bar
ctx.fillStyle = '#e2e8f0';
ctx.fillRect(canvas.width - 20 - barWidth, manaBarY, barWidth, manaBarHeight);
ctx.fillStyle = '#9f7aea';
ctx.fillRect(canvas.width - 20 - barWidth, manaBarY, barWidth * (this.player2.mana / MAX_MANA), manaBarHeight);
ctx.strokeStyle = '#202020';
ctx.strokeRect(canvas.width - 20 - barWidth, manaBarY, barWidth, manaBarHeight);
ctx.fillText(`${this.player2.mana.toFixed(0)}/${MAX_MANA}`, canvas.width - 20 - barWidth / 2, manaBarY + manaBarHeight / 2 + 4);

// Player Names
ctx.font = `${12 * pixel}px 'Press Start 2P'`;
ctx.fillStyle = '#e2e8f0';
ctx.textAlign = 'left';
ctx.fillText(this.player1.name, 20, barY - 5);
ctx.textAlign = 'right';
ctx.fillText(this.player2.name, canvas.width - 20, barY - 5);

// Round Timer
ctx.font = `${24 * pixel}px 'Press Start 2P'`;
ctx.fillStyle = '#ecc94b';
ctx.textAlign = 'center';
ctx.fillText(this.roundTimer.toString(), canvas.width / 2, 40);

// Round Score
ctx.font = `${16 * pixel}px 'Press Start 2P'`;
ctx.fillStyle = '#e2e8f0';
ctx.textAlign = 'left';
ctx.fillText(`P1: ${this.player1Score}`, 20, 100);
ctx.textAlign = 'right';
ctx.fillText(`P2: ${this.player2Score}`, canvas.width - 20, 100);


// Canvas Message (GO!, countdown, etc.)
if (this.canvasMessageTimer > 0) {
ctx.font = `${48 * pixel}px 'Press Start 2P'`;
ctx.fillStyle = '#ecc94b';
ctx.textAlign = 'center';
ctx.fillText(this.canvasMessage, canvas.width / 2, canvas.height / 2);
}

// Floating Damage Numbers
ctx.textAlign = 'center';
this.floatingDamageNumbers.forEach(dmg => {
ctx.font = `${dmg.isCrit ? 18 : 14}px 'Press Start 2P'`;
ctx.fillStyle = dmg.isCrit ? 'yellow' : 'white';
ctx.fillText(dmg.damage.toFixed(0), dmg.x, dmg.y - (1000 - dmg.timer) / 20);
});
}

/**
* Main game loop.
*/
gameLoop() {
if (!this.gameRunning) {
cancelAnimationFrame(this.animationFrameId);
return;
}

this.update();
this.draw();

// Update canvas message timer
if (this.canvasMessageTimer > 0) {
this.canvasMessageTimer -= 1000 / 60;
if (this.canvasMessageTimer <= 0) {
this.canvasMessage = '';
}
}

this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
}
}
