// Camera constants
const CAMERA_ZOOM_SPEED = 0.03;
const CAMERA_PAN_SPEED = 0.05;
const MIN_ZOOM = 1.0;
const MAX_ZOOM = 0.6;
const CAMERA_BUFFER_X = canvas.width * 0.2;
const CAMERA_BUFFER_Y = canvas.height * 0.1;

let camera = { x: 0, y: 0, zoom: 1.0 };

function updateCamera(player1, player2) {
  const centerX = (player1.x + player2.x) / 2;
  camera.x = Math.max(0, Math.min(centerX - canvas.width / 2 / camera.zoom, WORLD_WIDTH - canvas.width / camera.zoom));

  const distance = Math.abs(player1.x - player2.x);
  const desiredZoom = Math.max(
    MIN_ZOOM,
    Math.min(MAX_ZOOM, canvas.width / (distance + 400))
  );
  camera.zoom += (desiredZoom - camera.zoom) * CAMERA_ZOOM_SPEED;
}

function render() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.scale(camera.zoom, camera.zoom);
  ctx.translate(-camera.x, 0);

  drawParallaxBackground(camera);
  // drawPlayers, drawProjectiles etc.

  ctx.restore();

  drawCanvasUI();
}
