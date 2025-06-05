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

// World size and physics
const WORLD_WIDTH = 2000;
const GRAVITY = 0.3; // Gravity for jump
const JUMP_VELOCITY = -7; // Initial upward velocity for jump
const GROUND_Y = canvas.height - PLAYER_HEIGHT - 20; // Ground level

// Tralalaro specifics
const TRALALARO_HEIGHT_OFFSET = 0; // Ground based
const TRALALARO_VERTICAL_SPEED = 0; // Does not fly
const TRALALARO_MIN_Y = GROUND_Y;
const TRALALARO_MAX_Y = GROUND_Y;

// Camera behavior
const CAMERA_ZOOM_SPEED = 0.03; // How fast camera zooms
const CAMERA_PAN_SPEED = 0.05; // How fast camera pans
const MIN_ZOOM = 1.0; // Minimum zoom level (zoomed in)
const MAX_ZOOM = 0.6; // Maximum zoom level (zoomed out)
const CAMERA_BUFFER_X = canvas.width * 0.2; // Horizontal zoom-out buffer
const CAMERA_BUFFER_Y = canvas.height * 0.1; // Vertical zoom-out buffer
