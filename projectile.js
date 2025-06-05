// --- Projectile Class ---
class Projectile {
constructor(x, y, width, height, speed, direction, damage, owner, drawFunc) {
this.x = x;
this.y = y;
this.width = width;
this.height = height;
this.speed = speed;
this.direction = direction; // 1: right, -1: left, 0: down (for Tralalaro's basic attack)
this.damage = damage;
this.owner = owner; // Reference to the player who fired it
this.drawFunc = drawFunc;
this.active = true;
}

update() {
if (this.direction === 0) { // Downward projectile (Tralalaro's basic attack - if it had one)
this.y += this.speed;
// Check collision with ground
if (this.y + this.height >= GROUND_Y) {
this.active = false;
// For bomb hitting ground, create a small effect or damage nearby
gameManager.addFloatingDamage(this.x, GROUND_Y, this.damage * 0.5, false); // Small splash damage visual
shakeScreen(); // Shake screen on bomb impact
}
} else { // Horizontal projectile (Tungtung's Hadouken)
this.x += this.speed * this.direction;
}

// Deactivate if out of horizontal bounds
if (this.x < -this.width || this.x > WORLD_WIDTH) {
this.active = false;
}
}

draw() {
if (this.active) {
this.drawFunc(this, ctx);
}
}
}
