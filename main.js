const gameManager = new GameManager(); // Create a single instance of GameManager

// --- Event Listeners ---

// Keyboard input event listeners (only for Player 1)
document.addEventListener('keydown', (e) => {
if (gameManager.gameRunning && gameManager.gameStarted) {
const key = e.key;
const now = Date.now(); 

// Use Arrow keys for movement and jump
if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'w', 's'].includes(key)) {
if (gameManager.commandBuffer.length === 0 || (now - gameManager.lastInputTime > 30 && gameManager.commandBuffer[gameManager.commandBuffer.length - 1].key !== key)) { // 30ms
gameManager.commandBuffer.push({ key: key, timestamp: now });
gameManager.lastInputTime = now;
} else if (gameManager.commandBuffer.length > 0 && gameManager.commandBuffer[gameManager.commandBuffer.length - 1].key === key && (now - gameManager.lastInputTime) <= 30) {
gameManager.lastInputTime = now;
}
}

// Check for special move command
gameManager.checkSpecialMoveCommand(gameManager.player1, gameManager.player2);

switch (key) {
case 'ArrowLeft': gameManager.keys.ArrowLeft = true; break;
case 'ArrowRight': gameManager.keys.ArrowRight = true; break;
case 'ArrowUp': gameManager.keys.ArrowUp = true; break; // Jump
case 'ArrowDown': gameManager.keys.ArrowDown = true; break; // Down / Guard
case 'w': // Player 1 Basic Attack (Still 'w' for attack)
// Allow basic attack only if not attacking, not guarding, and on ground (not jumping)
if (!gameManager.player1.isAttacking && !gameManager.player1.isGuarding && !gameManager.player1.isJumping) {
if (!gameManager.player1.specialAttackActive) {
gameManager.handleAttack(gameManager.player1, gameManager.player2);
}
}
break;
case 's': // Player 1 Guard (Still 's' for guard)
gameManager.keys.s = true;
gameManager.player1.isGuarding = true;
break;
}
}
});

document.addEventListener('keyup', (e) => {
const key = e.key;
switch (key) {
case 'ArrowLeft': gameManager.keys.ArrowLeft = false; break;
case 'ArrowRight': gameManager.keys.ArrowRight = false; break;
case 'ArrowUp': gameManager.keys.ArrowUp = false; break;
case 'ArrowDown': gameManager.keys.ArrowDown = false; break;
case 'w': break;
case 's':
gameManager.keys.s = false;
gameManager.player1.isGuarding = false;
break;
}
});

// Button click event listeners (basic attack and guard)
player1AttackButton.addEventListener('click', () => {
// Only allow basic attack if not attacking, not guarding, and on ground (not jumping)
if (gameManager.gameRunning && gameManager.gameStarted && !gameManager.player1.isAttacking && !gameManager.player1.isGuarding && !gameManager.player1.isJumping) {
gameManager.handleAttack(gameManager.player1, gameManager.player2);
}
});

player1GuardButton.addEventListener('mousedown', () => {
if (gameManager.gameRunning && gameManager.gameStarted) {
gameManager.player1.isGuarding = true;
gameManager.displayCanvasMessage("가드!");
}
});
player1GuardButton.addEventListener('mouseup', () => {
if (gameManager.gameRunning && gameManager.gameStarted) {
gameManager.player1.isGuarding = false;
}
});
player1GuardButton.addEventListener('mouseleave', () => {
if (gameManager.gameRunning && gameManager.gameStarted) {
gameManager.player1.isGuarding = false;
}
});

// Character selection button listeners
selectTungtungButton.addEventListener('click', () => {
gameManager.selectedCharacterId = 'tungtung'; // Set selected character
generateLoreButton.style.display = 'block'; // Show lore button
characterLoreDisplay.style.display = 'block'; // Show lore display
characterLoreDisplay.textContent = '퉁퉁퉁퉁퉁퉁퉁퉁퉁사후르를 선택했습니다. 이야기 생성 버튼을 누르거나 바로 게임을 시작하세요!'; // Initial message for lore
startGameButton.style.display = 'block'; // Show "Start Game" button
});
selectTralalaroButton.addEventListener('click', () => { // Changed to new character button
gameManager.selectedCharacterId = 'tralarero'; // Set selected character
generateLoreButton.style.display = 'block'; // Show lore button
characterLoreDisplay.style.display = 'block'; // Show lore display
characterLoreDisplay.textContent = '트랄라레로 트랄랄라를 선택했습니다. 이야기 생성 버튼을 누르거나 바로 게임을 시작하세요!'; // Initial message for lore
startGameButton.style.display = 'block'; // Show "Start Game" button
});

// New: Generate Lore Button Listener
generateLoreButton.addEventListener('click', async () => {
if (!gameManager.selectedCharacterId) {
characterLoreDisplay.textContent = '먼저 캐릭터를 선택해주세요!';
return;
}

characterLoreDisplay.textContent = '이야기 생성 중...'; // Loading message
generateLoreButton.disabled = true; // Disable button during generation

const selectedChar = characterDefinitions[gameManager.selectedCharacterId];
const prompt = `다음 캐릭터에 대한 짧고 창의적인 배경 이야기(lore)를 픽셀 아트 게임 스타일에 맞춰 50단어 이내로 생성해 주세요.

캐릭터 이름: ${selectedChar.name}
특징: ${selectedChar.description}

이야기:`;

try {
let chatHistory = [];
chatHistory.push({ role: "user", parts: [{ text: prompt }] });
const payload = { contents: chatHistory };
const apiKey = ""; 
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

const response = await fetch(apiUrl, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload)
});

if (!response.ok) {
throw new Error(`API error! status: ${response.status}`);
}

const result = await response.json();

if (result.candidates && result.candidates.length > 0 &&
result.candidates[0].content && result.candidates[0].content.parts &&
result.candidates[0].content.parts.length > 0) {
const loreText = result.candidates[0].content.parts[0].text;
characterLoreDisplay.textContent = loreText;
} else {
characterLoreDisplay.textContent = '이야기를 생성할 수 없습니다. 다시 시도해주세요.';
console.error("Gemini API response structure unexpected:", result);
}
} catch (error) {
characterLoreDisplay.textContent = `이야기 생성 중 오류 발생: ${error.message}`;
console.error("Error generating lore:", error);
} finally {
generateLoreButton.disabled = false; // Re-enable button
}
});


// Initial setup on window load
window.onload = function() {
characterSelectionScreen.style.display = 'flex';
gameContainer.style.display = 'none';
showMessageBox("게임 시작", "플레이할 캐릭터를 선택하세요!");
};

// Canvas resizing (CSS handles responsive display, drawing buffer size is fixed)
window.addEventListener('resize', () => {
// No need to adjust player positions on resize for this simple game.
});

// Add a general "Start Game" button after character selection to clearly proceed
const startGameButton = document.createElement('button');
startGameButton.id = 'startGameButton';
startGameButton.className = 'control-button mt-4';
startGameButton.textContent = '게임 시작!';
startGameButton.style.display = 'none'; // Initially hidden
characterSelectionScreen.appendChild(startGameButton);

startGameButton.addEventListener('click', () => {
if (gameManager.selectedCharacterId) {
gameManager.startCountdownAndGame(gameManager.selectedCharacterId);
} else {
characterLoreDisplay.textContent = '먼저 캐릭터를 선택해주세요!';
}
});

// Show start game button after a character is selected (event delegation or individual listeners)
selectTungtungButton.addEventListener('click', () => {
gameManager.selectedCharacterId = 'tungtung';
generateLoreButton.style.display = 'block';
characterLoreDisplay.style.display = 'block';
characterLoreDisplay.textContent = '퉁퉁퉁퉁퉁퉁퉁퉁퉁사후르를 선택했습니다. 이야기 생성 버튼을 누르거나 바로 게임을 시작하세요!';
startGameButton.style.display = 'block'; // Show "Start Game" button
});
selectTralalaroButton.addEventListener('click', () => {
gameManager.selectedCharacterId = 'tralarero';
generateLoreButton.style.display = 'block';
characterLoreDisplay.style.display = 'block';
characterLoreDisplay.textContent = '트랄라레로 트랄랄라를 선택했습니다. 이야기 생성 버튼을 누르거나 바로 게임을 시작하세요!';
startGameButton.style.display = 'block'; // Show "Start Game" button
});

