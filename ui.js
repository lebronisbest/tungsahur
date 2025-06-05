// UI element references
const characterSelectionScreen = document.getElementById('characterSelectionScreen');
const gameContainer = document.getElementById('gameContainer');
const selectTungtungButton = document.getElementById('selectTungtung');
const selectTralalaroButton = document.getElementById('selectTralalaro');
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

// Show a custom message box
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
