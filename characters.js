// --- Character Definitions ---
const characterDefinitions = {
"tungtung": {
id: "tungtung",
name: "퉁퉁퉁퉁퉁퉁퉁퉁퉁사후르",
description: "야구 방망이를 휘두르는 픽셀화된 생명체, 퉁퉁한 몸집, 큰 눈, 미소 짓는 입.",
basicAttackDamage: 15,
specialMove: {
name: "파동권",
damage: 30,
manaCost: 30,
cooldown: 1500,
projectile: { // Projectile properties
width: 15,
height: 10,
speed: 8,
color: 'cyan',
draw: function(proj, ctx) {
ctx.fillStyle = proj.color;
ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
}
},
command: ['ArrowDown', 'ArrowRight', 'w'] // Adjusted command for arrow keys
},
// Function to draw Tungtung (32x32 pixel art)
drawCharacter: function(player, ctx) {
const x = player.x; // Use const for player.x, it's the player's actual position
const y = player.y; // Use const for player.y, it's the player's actual position
const pixel = 1;

const baseColor = '#d2b48c';
const darkSkin = '#a0856a';
const eyeWhite = 'white';
const pupilBlack = 'black';
const mouthColor = '#4a2c0f';
const toothColor = 'white';
const batColor = '#8B4513';
const outlineColor = '#202020';

let yOffset = 0;
let legOffset = 0;
if ((player === gameManager.player1 && (gameManager.keys.ArrowLeft || gameManager.keys.ArrowRight)) || (player === gameManager.player2 && (Math.abs(gameManager.player1.x - gameManager.player2.x) > ATTACK_RANGE && !gameManager.player2.isGuarding))) {
yOffset = Math.sin(Date.now() * 0.05) * pixel * 1;
legOffset = Math.sin(Date.now() * 0.1) * pixel * 1;
// Dust effect for ground movement
if (!player.isJumping) { // Only show dust if on ground
drawDustEffect(x + player.width / 2, y + player.height - 2);
}
}

if (player.isWinner) {
yOffset = -pixel * 5;
} else if (player.isLoser) {
yOffset = pixel * 5;
}

// Body
ctx.fillStyle = outlineColor;
ctx.fillRect(x + 10*pixel, y + 10*pixel + yOffset, 12*pixel, 18*pixel);
ctx.fillStyle = baseColor;
ctx.fillRect(x + 11*pixel, y + 11*pixel + yOffset, 10*pixel, 16*pixel);
ctx.fillStyle = darkSkin;
ctx.fillRect(x + 11*pixel, y + 11*pixel + yOffset, 1*pixel, 16*pixel);
ctx.fillRect(x + 20*pixel, y + 11*pixel + yOffset, 1*pixel, 16*pixel);

// Head
ctx.fillStyle = outlineColor;
ctx.fillRect(x + 12*pixel, y + 2*pixel + yOffset, 8*pixel, 8*pixel);
ctx.fillStyle = baseColor;
ctx.fillRect(x + 13*pixel, y + 3*pixel + yOffset, 6*pixel, 6*pixel);

// Eyes
ctx.fillStyle = eyeWhite;
ctx.fillRect(x + 14*pixel, y + 4*pixel + yOffset, 2*pixel, 2*pixel);
ctx.fillRect(x + 17*pixel, y + 4*pixel + yOffset, 2*pixel, 2*pixel);
ctx.fillStyle = pupilBlack;
ctx.fillRect(x + 15*pixel, y + 5*pixel + yOffset, 1*pixel, 1*pixel);
ctx.fillRect(x + 18*pixel, y + 5*pixel + yOffset, 1*pixel, 1*pixel);

// Mouth
ctx.fillStyle = outlineColor;
ctx.fillRect(x + 14*pixel, y + 7*pixel + yOffset, 4*pixel, 1*pixel);
ctx.fillStyle = mouthColor;
ctx.fillRect(x + 15*pixel, y + 7*pixel + yOffset, 2*pixel, 1*pixel);
ctx.fillStyle = toothColor;
ctx.fillRect(x + 15*pixel, y + 7*pixel + yOffset, 1*pixel, 1*pixel);
ctx.fillRect(x + 17*pixel, y + 7*pixel + yOffset, 1*pixel, 1*pixel);

// Arms (Attack/Guard/Idle state)
ctx.fillStyle = outlineColor;
if (player.isAttacking) {
if (player.direction === 1) {
ctx.fillRect(x + 20*pixel, y + 10*pixel + yOffset, 8*pixel, 3*pixel);
} else {
ctx.fillRect(x + 4*pixel, y + 10*pixel + yOffset, 8*pixel, 3*pixel);
}
} else if (player.isGuarding) {
ctx.fillRect(x + 8*pixel, y + 12*pixel + yOffset, 16*pixel, 4*pixel);
} else {
if (player.direction === 1) {
ctx.fillRect(x + 20*pixel, y + 12*pixel + yOffset, 4*pixel, 8*pixel);
ctx.fillRect(x + 8*pixel, y + 14*pixel + yOffset, 4*pixel, 8*pixel);
} else {
ctx.fillRect(x + 8*pixel, y + 12*pixel + yOffset, 4*pixel, 8*pixel);
ctx.fillRect(x + 20*pixel, y + 14*pixel + yOffset, 4*pixel, 8*pixel);
}
}
ctx.fillStyle = baseColor;
if (player.isAttacking) {
if (player.direction === 1) {
ctx.fillRect(x + 21*pixel, y + 11*pixel + yOffset, 6*pixel, 1*pixel);
} else {
ctx.fillRect(x + 5*pixel, y + 11*pixel + yOffset, 6*pixel, 1*pixel);
}
} else if (player.isGuarding) {
ctx.fillRect(x + 9*pixel, y + 13*pixel + yOffset, 14*pixel, 2*pixel);
} else {
if (player.direction === 1) {
ctx.fillRect(x + 21*pixel, y + 13*pixel + yOffset, 2*pixel, 6*pixel);
ctx.fillRect(x + 9*pixel, y + 15*pixel + yOffset, 2*pixel, 6*pixel);
} else {
ctx.fillRect(x + 9*pixel, y + 13*pixel + yOffset, 2*pixel, 6*pixel);
ctx.fillRect(x + 21*pixel, y + 15*pixel + yOffset, 2*pixel, 6*pixel);
}
}

// Legs
ctx.fillStyle = outlineColor;
ctx.fillRect(x + 11*pixel, y + 28*pixel + yOffset + legOffset, 4*pixel, 4*pixel);
ctx.fillRect(x + 17*pixel, y + 28*pixel + yOffset - legOffset, 4*pixel, 4*pixel);
ctx.fillStyle = baseColor;
ctx.fillRect(x + 12*pixel, y + 29*pixel + yOffset + legOffset, 2*pixel, 2*pixel);
ctx.fillRect(x + 18*pixel, y + 29*pixel + yOffset - legOffset, 2*pixel, 2*pixel);

// Baseball bat
ctx.fillStyle = outlineColor;
if (player.isAttacking) {
if (player.direction === 1) {
ctx.fillRect(x + 28*pixel, y + 10*pixel + yOffset, 8*pixel, 2*pixel);
} else {
ctx.fillRect(x - 4*pixel, y + 10*pixel + yOffset, 8*pixel, 2*pixel);
}
} else if (!player.isGuarding) {
if (player.direction === 1) {
ctx.fillRect(x + 24*pixel, y + 20*pixel + yOffset, 2*pixel, 8*pixel);
} else {
ctx.fillRect(x + 6*pixel, y + 20*pixel + yOffset, 2*pixel, 8*pixel);
}
}
ctx.fillStyle = batColor;
if (player.isAttacking) {
if (player.direction === 1) {
ctx.fillRect(x + 29*pixel, y + 11*pixel + yOffset, 6*pixel, 1*pixel);
} else {
ctx.fillRect(x - 3*pixel, y + 11*pixel + yOffset, 6*pixel, 1*pixel);
}
} else if (!player.isGuarding) {
if (player.direction === 1) {
ctx.fillRect(x + 25*pixel, y + 21*pixel + yOffset, 1*pixel, 6*pixel);
} else {
ctx.fillRect(x + 7*pixel, y + 21*pixel + yOffset, 1*pixel, 6*pixel);
}
}

// Special effects based on state (drawn on top)
if (player.specialAttackActive) {
ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
ctx.fillRect(x, y, player.width, player.height);
}

// Hit effect (drawn on top)
if (player.hitEffectTimer > 0) {
ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
ctx.fillRect(x, y, player.width, player.height);
}
}
},
"tralarero": { // New character: 트랄라레로 트랄랄라 (Shark with shoes)
id: "tralarero",
name: "트랄라레로 트랄랄라",
description: "파란색 운동화를 신고 있는 픽셀화된 상어. 지상에서 빠르게 움직이며 날카로운 이빨과 강력한 발차기 공격을 사용합니다.",
basicAttackDamage: 20, // Stronger basic attack
basicAttackProjectile: null, // No basic attack projectile for this character
specialMove: {
name: "상어 돌진",
damage: 35,
manaCost: 35,
cooldown: 1800,
effectDuration: 400,
drawEffect: function(player, ctx) {
ctx.fillStyle = 'rgba(100, 100, 255, 0.7)'; // Blue aura for dash
const auraSize = player.width * 1.5;
ctx.fillRect(player.x - auraSize / 4, player.y - auraSize / 4, player.width + auraSize / 2, player.height + auraSize / 2);
},
command: ['ArrowRight', 'ArrowRight', 'w'] // Dash forward + Attack
},
// Function to draw Tralalaro (Shark with shoes)
drawCharacter: function(player, ctx) {
let drawX = 0; // Relative drawing position
let drawY = 0; // Relative drawing position
const pixel = 1;

const sharkBodyColor = '#63a3d2'; // Blue-grey shark body
const sharkBellyColor = '#e2e8f0'; // White belly
const finColor = '#4a7ea3'; // Darker blue for fins
const eyeColor = 'black';
const teethColor = 'white';
const shoeColor = '#3b82f6'; // Bright blue shoes (Nike-like)
const shoeSoleColor = '#4f46e5'; // Darker blue sole
const shoeAccentColor = '#dbeafe'; // White swoosh
const outlineColor = '#202020';

let yOffset = 0;
let legOffset = 0; // For shoe movement
if ((player === gameManager.player1 && (gameManager.keys.ArrowLeft || gameManager.keys.ArrowRight)) || (player === gameManager.player2 && (Math.abs(gameManager.player1.x - gameManager.player2.x) > ATTACK_RANGE && !gameManager.player2.isGuarding))) {
yOffset = Math.sin(Date.now() * 0.05) * pixel * 0.5; // Slightly less bobbing
legOffset = Math.sin(Date.now() * 0.1) * pixel * 1; // Show leg/shoe movement
if (!player.isJumping) { // Only show dust if on ground
drawDustEffect(player.x + player.width / 2, player.y + player.height - 2);
}
}

if (player.isWinner) {
yOffset = -pixel * 5; // Jump in joy
} else if (player.isLoser) {
yOffset = pixel * 5; // Fall down
}

// Save context for possible flipping
ctx.save();
// Translate to player's center, then apply yOffset for bobbing/jump
ctx.translate(player.x + player.width / 2, player.y + player.height / 2 + yOffset);
// Apply horizontal flip based on direction
ctx.scale(player.direction, 1);
// No tilt for ground character

// Now, draw relative to the new (0,0) which is the player's center.
// So, coordinates for drawing will be relative to -player.width/2, -player.height/2
drawX = -player.width / 2;
drawY = -player.height / 2;


// Body
ctx.fillStyle = outlineColor;
ctx.fillRect(drawX + 4*pixel, drawY + 8*pixel, 24*pixel, 14*pixel); // Main body
ctx.fillStyle = sharkBodyColor;
ctx.fillRect(drawX + 5*pixel, drawY + 9*pixel, 22*pixel, 12*pixel);
ctx.fillStyle = sharkBellyColor;
ctx.fillRect(drawX + 6*pixel, drawY + 16*pixel, 18*pixel, 4*pixel); // Belly part

// Dorsal Fin
ctx.fillStyle = outlineColor;
ctx.beginPath();
ctx.moveTo(drawX + 14*pixel, drawY + 8*pixel);
ctx.lineTo(drawX + 16*pixel, drawY + 2*pixel);
ctx.lineTo(drawX + 18*pixel, drawY + 8*pixel);
ctx.fill();
ctx.fillStyle = finColor;
ctx.beginPath();
ctx.moveTo(drawX + 15*pixel, drawY + 9*pixel);
ctx.lineTo(drawX + 16*pixel, drawY + 3*pixel);
ctx.lineTo(drawX + 17*pixel, drawY + 9*pixel);
ctx.fill();

// Tail Fin
ctx.fillStyle = outlineColor;
ctx.beginPath();
ctx.moveTo(drawX + 27*pixel, drawY + 10*pixel);
ctx.lineTo(drawX + 30*pixel, drawY + 6*pixel);
ctx.lineTo(drawX + 28*pixel, drawY + 14*pixel);
ctx.lineTo(drawX + 30*pixel, drawY + 18*pixel);
ctx.fill();
ctx.fillStyle = finColor;
ctx.beginPath();
ctx.moveTo(drawX + 28*pixel, drawY + 11*pixel);
ctx.lineTo(drawX + 29*pixel, drawY + 7*pixel);
ctx.lineTo(drawX + 29*pixel, drawY + 13*pixel);
ctx.lineTo(drawX + 29*pixel, drawY + 17*pixel);
ctx.fill();

// Mouth and eye
ctx.fillStyle = outlineColor;
ctx.fillRect(drawX + 2*pixel, drawY + 11*pixel, 4*pixel, 2*pixel); // Mouth outline
ctx.fillStyle = sharkBellyColor;
ctx.fillRect(drawX + 3*pixel, drawY + 12*pixel, 2*pixel, 1*pixel); // Mouth interior
ctx.fillStyle = teethColor; // Teeth
ctx.fillRect(drawX + 3*pixel, drawY + 11*pixel, 1*pixel, 1*pixel);
ctx.fillRect(drawX + 4*pixel, drawY + 11*pixel, 1*pixel, 1*pixel);

ctx.fillStyle = outlineColor;
ctx.fillRect(drawX + 7*pixel, drawY + 10*pixel, 2*pixel, 2*pixel); // Eye outline
ctx.fillStyle = eyeColor;
ctx.fillRect(drawX + 8*pixel, drawY + 11*pixel, 1*pixel, 1*pixel); // Pupil

// Front Shoes
ctx.fillStyle = outlineColor;
ctx.fillRect(drawX + 8*pixel, drawY + 20*pixel + legOffset, 6*pixel, 4*pixel); // Shoe body outline
ctx.fillStyle = shoeColor;
ctx.fillRect(drawX + 9*pixel, drawY + 21*pixel + legOffset, 4*pixel, 2*pixel); // Shoe body
ctx.fillStyle = shoeSoleColor;
ctx.fillRect(drawX + 8*pixel, drawY + 23*pixel + legOffset, 6*pixel, 1*pixel); // Shoe sole
ctx.fillStyle = shoeAccentColor;
ctx.fillRect(drawX + 11*pixel, drawY + 21*pixel + legOffset, 2*pixel, 1*pixel); // Swoosh

// Back Shoes (slightly offset for animation)
ctx.fillStyle = outlineColor;
ctx.fillRect(drawX + 18*pixel, drawY + 20*pixel - legOffset, 6*pixel, 4*pixel); // Shoe body outline
ctx.fillStyle = shoeColor;
ctx.fillRect(drawX + 19*pixel, drawY + 21*pixel - legOffset, 4*pixel, 2*pixel); // Shoe body
ctx.fillStyle = shoeSoleColor;
ctx.fillRect(drawX + 18*pixel, drawY + 23*pixel - legOffset, 6*pixel, 1*pixel); // Shoe sole
ctx.fillStyle = shoeAccentColor;
ctx.fillRect(drawX + 21*pixel, drawY + 21*pixel - legOffset, 2*pixel, 1*pixel); // Swoosh

// Restore context (important for camera logic)
ctx.restore();

// Special effects based on state (drawn on top)
if (player.specialAttackActive) {
ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Hit effect (drawn on top)
if (player.hitEffectTimer > 0) {
ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
ctx.fillRect(player.x, player.y, player.width, player.height);
}
}
}
};

