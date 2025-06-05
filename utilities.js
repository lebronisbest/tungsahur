// Screen shake effect
function shakeScreen() {
  gameContainer.classList.add('shake-screen');
  setTimeout(() => {
    gameContainer.classList.remove('shake-screen');
  }, SCREEN_SHAKE_DURATION);
}

// Display a canvas message for a short duration
let canvasMessage = '';
let canvasMessageTimer = 0;
function displayCanvasMessage(message) {
  canvasMessage = message;
  canvasMessageTimer = 1500; // ms
}

// Floating damage numbers
let floatingDamageNumbers = [];
function addFloatingDamage(x, y, damage, isCrit = false) {
  floatingDamageNumbers.push({
    x,
    y,
    damage,
    timer: 1000,
    isCrit
  });
}
