// Draw the current player using its drawCharacter callback
function drawPlayer(player) {
  if (player.drawCharacter) {
    player.drawCharacter(player, ctx);
  }
}

// Background
function drawPixelBackground() {
  const pixel = 1;
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGradient.addColorStop(0, '#87CEEB');
  skyGradient.addColorStop(1, '#6A5ACD');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, WORLD_WIDTH, canvas.height);

  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 70; i++) {
    const cloudX = Math.floor(Math.random() * WORLD_WIDTH / pixel) * pixel;
    const cloudY = Math.floor(Math.random() * canvas.height / 3 / pixel) * pixel;
    const cloudWidth = Math.floor(Math.random() * 8 + 3) * pixel;
    const cloudHeight = Math.floor(Math.random() * 4 + 2) * pixel;
    ctx.fillRect(cloudX, cloudY, cloudWidth, cloudHeight);
  }

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

  ctx.fillStyle = '#48BB78';
  ctx.fillRect(0, canvas.height - 40, WORLD_WIDTH, 40);

  ctx.fillStyle = '#38A169';
  for (let i = 0; i < 150; i++) {
    const detailX = Math.floor(Math.random() * WORLD_WIDTH / pixel) * pixel;
    const detailY = Math.floor(Math.random() * 30 / pixel) * pixel + (canvas.height - 40);
    ctx.fillRect(detailX, detailY, pixel, pixel);
  }
}

// Draw UI on canvas
function drawCanvasUI() {
  const barWidth = canvas.width / 2 - 50;
  const barHeight = 15;
  const barY = 20;
  const pixel = 1;

  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(20, barY, barWidth, barHeight);
  ctx.fillStyle = '#63b3ed';
  ctx.fillRect(20, barY, barWidth * (gameManager.player1.health / MAX_HEALTH), barHeight);
  ctx.strokeStyle = '#202020';
  ctx.lineWidth = pixel;
  ctx.strokeRect(20, barY, barWidth, barHeight);
  ctx.font = `${10 * pixel}px 'Press Start 2P'`;
  ctx.fillStyle = '#1a202c';
  ctx.textAlign = 'center';
  ctx.fillText(`${gameManager.player1.health.toFixed(0)}/${MAX_HEALTH}`, 20 + barWidth / 2, barY + barHeight / 2 + 4);

  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(canvas.width - 20 - barWidth, barY, barWidth, barHeight);
  ctx.fillStyle = '#f56565';
  ctx.fillRect(canvas.width - 20 - barWidth, barY, barWidth * (gameManager.player2.health / MAX_HEALTH), barHeight);
  ctx.strokeStyle = '#202020';
  ctx.strokeRect(canvas.width - 20 - barWidth, barY, barWidth, barHeight);
  ctx.fillText(`${gameManager.player2.health.toFixed(0)}/${MAX_HEALTH}`, canvas.width - 20 - barWidth / 2, barY + barHeight / 2 + 4);

  const manaBarY = barY + barHeight + 10;
  const manaBarHeight = 10;

  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(20, manaBarY, barWidth, manaBarHeight);
  ctx.fillStyle = '#9f7aea';
  ctx.fillRect(20, manaBarY, barWidth * (gameManager.player1.mana / MAX_MANA), manaBarHeight);
  ctx.strokeStyle = '#202020';
  ctx.strokeRect(20, manaBarY, barWidth, manaBarHeight);
  ctx.fillText(`${gameManager.player1.mana.toFixed(0)}/${MAX_MANA}`, 20 + barWidth / 2, manaBarY + manaBarHeight / 2 + 4);

  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(canvas.width - 20 - barWidth, manaBarY, barWidth, manaBarHeight);
  ctx.fillStyle = '#9f7aea';
  ctx.fillRect(canvas.width - 20 - barWidth, manaBarY, barWidth * (gameManager.player2.mana / MAX_MANA), manaBarHeight);
  ctx.strokeStyle = '#202020';
  ctx.strokeRect(canvas.width - 20 - barWidth, manaBarY, barWidth, manaBarHeight);
  ctx.fillText(`${gameManager.player2.mana.toFixed(0)}/${MAX_MANA}`, canvas.width - 20 - barWidth / 2, manaBarY + manaBarHeight / 2 + 4);

  ctx.font = `${12 * pixel}px 'Press Start 2P'`;
  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'left';
  ctx.fillText(gameManager.player1.name, 20, barY - 5);
  ctx.textAlign = 'right';
  ctx.fillText(gameManager.player2.name, canvas.width - 20, barY - 5);

  ctx.font = `${24 * pixel}px 'Press Start 2P'`;
  ctx.fillStyle = '#ecc94b';
  ctx.textAlign = 'center';
  ctx.fillText(gameManager.roundTimer.toString(), canvas.width / 2, 40);

  ctx.font = `${16 * pixel}px 'Press Start 2P'`;
  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'left';
  ctx.fillText(`P1: ${gameManager.player1Score}`, 20, 100);
  ctx.textAlign = 'right';
  ctx.fillText(`P2: ${gameManager.player2Score}`, canvas.width - 20, 100);

  if (gameManager.canvasMessageTimer > 0) {
    ctx.font = `${48 * pixel}px 'Press Start 2P'`;
    ctx.fillStyle = '#ecc94b';
    ctx.textAlign = 'center';
    ctx.fillText(gameManager.canvasMessage, canvas.width / 2, canvas.height / 2);
  }

  ctx.textAlign = 'center';
  floatingDamageNumbers.forEach(dmg => {
    ctx.font = `${dmg.isCrit ? 18 : 14}px 'Press Start 2P'`;
    ctx.fillStyle = dmg.isCrit ? 'yellow' : 'white';
    ctx.fillText(dmg.damage.toFixed(0), dmg.x, dmg.y - (1000 - dmg.timer) / 20);
  });
}

// Basic attack effect
function drawAttackEffect(target, type) {
  if (type === 'basic') {
    const effectSize = 10;
    const effectX = target.x + target.width / 2 - effectSize / 2;
    const effectY = target.y + target.height / 2 - effectSize / 2;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(effectX, effectY, effectSize, effectSize);
    ctx.fillStyle = 'rgba(255, 165, 0, 0.8)';
    ctx.fillRect(effectX + effectSize / 4, effectY + effectSize / 4, effectSize / 2, effectSize / 2);
  }
}

// Dust effect when moving on ground
function drawDustEffect(x, y) {
  const pixel = 1;
  ctx.fillStyle = 'rgba(150, 150, 150, 0.5)';
  for (let i = 0; i < 3; i++) {
    const dustX = x + (Math.random() - 0.5) * 5 * pixel;
    const dustY = y + (Math.random() - 0.5) * 2 * pixel;
    ctx.fillRect(dustX, dustY, 1 * pixel, 1 * pixel);
  }
}

function drawParallaxBackground(camera) {
  const pixel = 1;
  const viewWidth = canvas.width / camera.zoom;
  const viewHeight = canvas.height / camera.zoom;

  const skyGradient = ctx.createLinearGradient(0, 0, 0, viewHeight);
  skyGradient.addColorStop(0, '#87CEEB');
  skyGradient.addColorStop(1, '#6A5ACD');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, viewWidth, viewHeight);

  ctx.save();
  ctx.translate(-camera.x * 0.2, 0);
  ctx.scale(camera.zoom, camera.zoom);
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 70; i++) {
    const cloudX = Math.floor(Math.random() * WORLD_WIDTH / pixel) * pixel;
    const cloudY = Math.floor(Math.random() * canvas.height / 3 / pixel) * pixel;
    const cloudWidth = Math.floor(Math.random() * 8 + 3) * pixel;
    const cloudHeight = Math.floor(Math.random() * 4 + 2) * pixel;
    ctx.fillRect(cloudX, cloudY, cloudWidth, cloudHeight);
  }
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.x * 0.4, 0);
  ctx.scale(camera.zoom, camera.zoom);
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
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.x * 0.6, 0);
  ctx.scale(camera.zoom, camera.zoom);
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
  ctx.restore();

  ctx.save();
  ctx.translate(-camera.x, 0);
  ctx.scale(camera.zoom, camera.zoom);
  ctx.fillStyle = '#48BB78';
  ctx.fillRect(0, canvas.height - 40, WORLD_WIDTH, 40);
  ctx.fillStyle = '#38A169';
  for (let i = 0; i < 150; i++) {
    const detailX = Math.floor(Math.random() * WORLD_WIDTH / pixel) * pixel;
    const detailY = Math.floor(Math.random() * 30 / pixel) * pixel + (canvas.height - 40);
    ctx.fillRect(detailX, detailY, pixel, pixel);
  }
  ctx.restore();
}
