// Screen shake effect
function shakeScreen() {
  gameContainer.classList.add('shake-screen');
  setTimeout(() => {
    gameContainer.classList.remove('shake-screen');
  }, SCREEN_SHAKE_DURATION);
}
