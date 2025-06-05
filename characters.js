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
                width: 32, // Even larger projectile for immense impact
                height: 24, // Even larger projectile
                speed: 15, // Even faster projectile
                color: 'cyan',
                draw: function (proj, ctx) {
                    const centerX = proj.x + proj.width / 2;
                    const centerY = proj.y + proj.height / 2;
                    const radius = proj.width / 2;

                    // Deepest core glow
                    const innermostGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.4);
                    innermostGradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Brightest white core
                    innermostGradient.addColorStop(1, 'rgba(150, 255, 255, 1)'); // Light cyan
                    ctx.fillStyle = innermostGradient;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius * 0.4, 0, Math.PI * 2);
                    ctx.fill();

                    // Main core glow
                    const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.7);
                    coreGradient.addColorStop(0, 'rgba(0, 255, 255, 1)'); // Cyan core
                    coreGradient.addColorStop(0.7, 'rgba(0, 200, 255, 1)'); // Deeper cyan
                    coreGradient.addColorStop(1, 'rgba(0, 100, 200, 0.9)'); // Darker blue
                    ctx.fillStyle = coreGradient;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius * 0.7, 0, Math.PI * 2);
                    ctx.fill();

                    // Outer aura with heavy blur
                    ctx.shadowBlur = 25; // Even more intense glow
                    ctx.shadowColor = 'cyan';
                    ctx.fillStyle = 'rgba(0, 200, 255, 0.2)'; // Lighter, more transparent aura
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2); // Significantly larger aura
                    ctx.fill();
                    ctx.shadowBlur = 0; // Reset shadow for other drawings

                    // Layered energy rings
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
                    ctx.lineWidth = 1;
                    for (let i = 0; i < 3; i++) {
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, radius * (0.6 + i * 0.2), 0, Math.PI * 2);
                        ctx.stroke();
                    }

                    // Subtle inner light particles (randomized)
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    for (let i = 0; i < 5; i++) {
                        const particleRadius = radius * (0.1 + Math.random() * 0.3);
                        const angle = Math.random() * Math.PI * 2;
                        const dist = Math.random() * radius * 0.7;
                        ctx.beginPath();
                        ctx.arc(centerX + Math.cos(angle) * dist, centerY + Math.sin(angle) * dist, 1, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            },
            command: ['ArrowDown', 'ArrowRight', 'w']
        },
        // Function to draw Tungtung (32x32 pixel art)
        drawCharacter: function (player, ctx) {
            const x = player.x;
            const y = player.y;
            const pixel = 1; // Base pixel unit for drawing

            // --- Color Palette for Tungtung ---
            const skinLightest = '#ffe0b2'; // Highlights
            const skinBase = '#d2b48c';   // Main skin tone
            const skinMid = '#bf9e7c';    // Mid-tone shading
            const skinDark = '#a0856a';   // Deep shading/creases
            const skinOutline = '#7a644f'; // Strongest outline for skin features

            const eyeWhite = '#ffffff';   // Eye sclera
            const eyePupil = '#000000';   // Pupil
            const eyeShine = '#ffffff';   // Eye reflection highlight

            const mouthInner = '#4a2c0f'; // Inner mouth color
            const toothColor = '#ffffff'; // Teeth color
            const tongueColor = '#c75e6d'; // Tongue color

            const batWoodLight = '#cc7a00'; // Bat highlights
            const batWoodBase = '#8B4513';  // Main bat wood color
            const batWoodDark = '#5a2d0f';  // Bat shading/grain
            const batOutline = '#5a2d0f'; // <-- MISSING: Bat outline color, explicitly added
            const batGrip = '#303030';     // Bat grip color
            const batGripHighlight = '#505050'; // Bat grip highlight

            const outlineStrong = '#202020'; // Main character outline
            const shadowGround = 'rgba(0,0,0,0.3)'; // Shadow beneath character


            // --- Animation State Variables ---
            let yBob = 0; // Vertical bobbing for idle/walk
            let legSwingOffset = 0; // Leg animation for walking
            let armSwingOffset = 0; // Arm animation for walking
            let bodyTilt = 0; // Subtle body tilt for dynamic movement
            let headTilt = 0; // Slight head tilt for expressiveness
            let armRotate = 0; // Rotation for attack arm

            // Walking/Running Animation
            if ((player === gameManager.player1 && (gameManager.keys.ArrowLeft || gameManager.keys.ArrowRight)) || (player === gameManager.player2 && (Math.abs(gameManager.player1.x - gameManager.player2.x) > ATTACK_RANGE && !gameManager.player2.isGuarding))) {
                yBob = Math.sin(Date.now() * 0.08) * pixel * 1.5; // More pronounced bob
                legSwingOffset = Math.sin(Date.now() * 0.15) * pixel * 3; // Wider leg swing
                armSwingOffset = Math.cos(Date.now() * 0.15) * pixel * 2; // Opposite arm swing
                bodyTilt = Math.sin(Date.now() * 0.05) * 0.03 * player.direction; // Slight lean into movement
                headTilt = Math.sin(Date.now() * 0.07) * 0.01; // Gentle head bob
                if (!player.isJumping) {
                    drawDustEffect(x + player.width / 2, y + player.height - 2);
                }
            } else {
                // Idle Animation
                yBob = Math.sin(Date.now() * 0.04) * pixel * 0.5; // Gentle idle bob
                headTilt = Math.sin(Date.now() * 0.03) * 0.005; // Very subtle idle head tilt
            }

            // Attack Animation
            if (player.isAttacking) {
                const attackProgress = (Date.now() - player.attackStartTime) / player.attackDuration;
                armRotate = Math.sin(attackProgress * Math.PI) * 0.5; // Swing motion
                yBob = Math.sin(attackProgress * Math.PI * 2) * pixel * 0.5; // Slight up/down with swing
            }

            // Guard Animation
            if (player.isGuarding) {
                bodyTilt = 0; // Straighten body for guard
                headTilt = 0; // Straighten head
                yBob = 0; // No bobbing
            }

            // Winning/Losing Animation
            if (player.isWinner) {
                yBob = -pixel * 8 + Math.sin(Date.now() * 0.15) * pixel * 2; // Happy bounce
                headTilt = Math.sin(Date.now() * 0.1) * 0.1; // Head joyfully
            } else if (player.isLoser) {
                yBob = pixel * 12; // Falls lower
                bodyTilt = Math.PI / 6 * player.direction; // Tilted on the ground
                headTilt = -Math.PI / 10; // Head down
            }

            // --- Context Transformations ---
            ctx.save();
            ctx.translate(x + player.width / 2, y + player.height / 2 + yBob);
            ctx.scale(player.direction, 1); // Flip horizontally
            ctx.rotate(bodyTilt); // Apply body tilt

            const drawX = -player.width / 2;
            const drawY = -player.height / 2;

            // --- Drawing Tungtung Pixel Art: Layer by Layer ---

            // --- Body Base ---
            ctx.fillStyle = outlineStrong;
            ctx.fillRect(drawX + 8 * pixel, drawY + 10 * pixel, 16 * pixel, 20 * pixel); // Main outline
            ctx.fillRect(drawX + 9 * pixel, drawY + 9 * pixel, 14 * pixel, 1 * pixel); // Shoulder outline
            ctx.fillStyle = skinBase;
            ctx.fillRect(drawX + 9 * pixel, drawY + 11 * pixel, 14 * pixel, 18 * pixel); // Main fill
            ctx.fillRect(drawX + 10 * pixel, drawY + 10 * pixel, 12 * pixel, 1 * pixel); // Shoulder fill

            // --- Body Shading & Highlights ---
            ctx.fillStyle = skinDark; // Deep shade on sides
            ctx.fillRect(drawX + 9 * pixel, drawY + 11 * pixel, 1 * pixel, 18 * pixel);
            ctx.fillRect(drawX + 22 * pixel, drawY + 11 * pixel, 1 * pixel, 18 * pixel);
            ctx.fillStyle = skinMid; // Mid-tone shade
            ctx.fillRect(drawX + 10 * pixel, drawY + 28 * pixel, 12 * pixel, 1 * pixel); // Bottom shadow
            ctx.fillRect(drawX + 11 * pixel, drawY + 15 * pixel, 10 * pixel, 1 * pixel); // Belly crease
            ctx.fillStyle = skinLightest; // Highlights
            ctx.fillRect(drawX + 12 * pixel, drawY + 12 * pixel, 8 * pixel, 1 * pixel); // Chest highlight
            ctx.fillRect(drawX + 11 * pixel, drawY + 13 * pixel, 1 * pixel, 1 * pixel); // Shoulder highlight dot
            ctx.fillRect(drawX + 20 * pixel, drawY + 13 * pixel, 1 * pixel, 1 * pixel); // Shoulder highlight dot

            // --- Head Base (nested transformations for head tilt) ---
            ctx.save();
            ctx.translate(drawX + 16 * pixel, drawY + 6 * pixel); // Translate to head center
            ctx.rotate(headTilt); // Apply head tilt
            const headDrawX = -8 * pixel; // Relative X for drawing head parts
            const headDrawY = -6 * pixel; // Relative Y for drawing head parts

            ctx.fillStyle = outlineStrong;
            // More complex head shape for roundedness
            ctx.fillRect(headDrawX + 2 * pixel, headDrawY + 1 * pixel, 12 * pixel, 12 * pixel); // Main head outline
            ctx.fillRect(headDrawX + 3 * pixel, headDrawY + 0 * pixel, 10 * pixel, 1 * pixel); // Top curve
            ctx.fillRect(headDrawX + 1 * pixel, headDrawY + 3 * pixel, 1 * pixel, 6 * pixel); // Side curve left
            ctx.fillRect(headDrawX + 14 * pixel, headDrawY + 3 * pixel, 1 * pixel, 6 * pixel); // Side curve right
            ctx.fillStyle = skinBase;
            ctx.fillRect(headDrawX + 3 * pixel, headDrawY + 2 * pixel, 10 * pixel, 10 * pixel); // Main head fill
            ctx.fillRect(headDrawX + 4 * pixel, headDrawY + 1 * pixel, 8 * pixel, 1 * pixel); // Top curve fill
            ctx.fillRect(headDrawX + 2 * pixel, headDrawY + 4 * pixel, 1 * pixel, 4 * pixel); // Side curve fill left
            ctx.fillRect(headDrawX + 13 * pixel, headDrawY + 4 * pixel, 1 * pixel, 4 * pixel); // Side curve fill right

            // --- Head Shading & Highlights ---
            ctx.fillStyle = skinDark;
            ctx.fillRect(headDrawX + 3 * pixel, headDrawY + 11 * pixel, 10 * pixel, 1 * pixel); // Chin shadow
            ctx.fillRect(headDrawX + 3 * pixel, headDrawY + 2 * pixel, 1 * pixel, 9 * pixel); // Left side shade
            ctx.fillRect(headDrawX + 12 * pixel, headDrawY + 2 * pixel, 1 * pixel, 9 * pixel); // Right side shade
            ctx.fillStyle = skinMid;
            ctx.fillRect(headDrawX + 4 * pixel, headDrawY + 9 * pixel, 8 * pixel, 1 * pixel); // Lower face shadow
            ctx.fillStyle = skinLightest;
            ctx.fillRect(headDrawX + 6 * pixel, headDrawY + 3 * pixel, 4 * pixel, 1 * pixel); // Forehead highlight
            ctx.fillRect(headDrawX + 5 * pixel, headDrawY + 4 * pixel, 1 * pixel, 1 * pixel); // Cheek highlight dot
            ctx.fillRect(headDrawX + 11 * pixel, headDrawY + 4 * pixel, 1 * pixel, 1 * pixel); // Cheek highlight dot

            // --- Eyes (detailed) ---
            // Left Eye
            ctx.fillStyle = outlineStrong;
            ctx.fillRect(headDrawX + 5 * pixel, headDrawY + 5 * pixel, 3 * pixel, 3 * pixel); // Eye outline
            ctx.fillStyle = eyeWhite;
            ctx.fillRect(headDrawX + 6 * pixel, headDrawY + 6 * pixel, 2 * pixel, 2 * pixel); // Sclera
            ctx.fillStyle = eyePupil;
            ctx.fillRect(headDrawX + 7 * pixel, headDrawY + 7 * pixel, 1 * pixel, 1 * pixel); // Pupil
            ctx.fillStyle = eyeShine;
            ctx.fillRect(headDrawX + 6 * pixel, headDrawY + 6 * pixel, 1 * pixel, 1 * pixel); // Eye shine

            // Right Eye
            ctx.fillStyle = outlineStrong;
            ctx.fillRect(headDrawX + 10 * pixel, headDrawY + 5 * pixel, 3 * pixel, 3 * pixel); // Eye outline
            ctx.fillStyle = eyeWhite;
            ctx.fillRect(headDrawX + 11 * pixel, headDrawY + 6 * pixel, 2 * pixel, 2 * pixel); // Sclera
            ctx.fillStyle = eyePupil;
            ctx.fillRect(headDrawX + 12 * pixel, headDrawY + 7 * pixel, 1 * pixel, 1 * pixel); // Pupil
            ctx.fillStyle = eyeShine;
            ctx.fillRect(headDrawX + 11 * pixel, headDrawY + 6 * pixel, 1 * pixel, 1 * pixel); // Eye shine

            // Eyebrows (subtle)
            ctx.fillStyle = skinDark;
            ctx.fillRect(headDrawX + 5 * pixel, headDrawY + 4 * pixel, 3 * pixel, 1 * pixel);
            ctx.fillRect(headDrawX + 10 * pixel, headDrawY + 4 * pixel, 3 * pixel, 1 * pixel);

            // --- Mouth (detailed smile) ---
            ctx.fillStyle = outlineStrong;
            ctx.fillRect(headDrawX + 6 * pixel, headDrawY + 9 * pixel, 6 * pixel, 1 * pixel); // Upper lip outline
            ctx.fillRect(headDrawX + 7 * pixel, headDrawY + 10 * pixel, 4 * pixel, 1 * pixel); // Lower lip outline
            ctx.fillStyle = mouthInner;
            ctx.fillRect(headDrawX + 7 * pixel, headDrawY + 9 * pixel, 4 * pixel, 1 * pixel); // Inner mouth
            ctx.fillRect(headDrawX + 8 * pixel, headDrawY + 10 * pixel, 2 * pixel, 1 * pixel); // Inner mouth lower
            ctx.fillStyle = toothColor;
            ctx.fillRect(headDrawX + 7 * pixel, headDrawY + 9 * pixel, 1 * pixel, 1 * pixel); // Tooth 1
            ctx.fillRect(headDrawX + 9 * pixel, headDrawY + 9 * pixel, 1 * pixel, 1 * pixel); // Tooth 2
            ctx.fillRect(headDrawX + 11 * pixel, headDrawY + 9 * pixel, 1 * pixel, 1 * pixel); // Tooth 3
            ctx.fillStyle = tongueColor;
            ctx.fillRect(headDrawX + 8 * pixel, headDrawY + 10 * pixel, 2 * pixel, 1 * pixel); // Tongue

            ctx.restore(); // Restore after head tilt

            // --- Arms (conditional drawing with rotation for attack) ---
            if (player.isAttacking) {
                // Right Arm (Swinging arm)
                ctx.save();
                ctx.translate(drawX + 20 * pixel, drawY + 13 * pixel); // Pivot point for arm
                ctx.rotate(armRotate * (player.direction === 1 ? 1 : -1)); // Rotate based on swing and player direction
                const armDrawX = -2 * pixel; // Relative X for arm parts
                const armDrawY = -2 * pixel; // Relative Y for arm parts

                ctx.fillStyle = outlineStrong;
                ctx.fillRect(armDrawX + 0 * pixel, armDrawY + 0 * pixel, 8 * pixel, 4 * pixel); // Upper arm outline
                ctx.fillRect(armDrawX + 5 * pixel, armDrawY + 3 * pixel, 4 * pixel, 5 * pixel); // Forearm outline
                ctx.fillRect(armDrawX + 8 * pixel, armDrawY + 6 * pixel, 3 * pixel, 3 * pixel); // Hand outline
                ctx.fillStyle = skinBase;
                ctx.fillRect(armDrawX + 1 * pixel, armDrawY + 1 * pixel, 6 * pixel, 2 * pixel); // Upper arm fill
                ctx.fillRect(armDrawX + 6 * pixel, armDrawY + 4 * pixel, 2 * pixel, 3 * pixel); // Forearm fill
                ctx.fillRect(armDrawX + 9 * pixel, armDrawY + 7 * pixel, 1 * pixel, 1 * pixel); // Hand fill
                ctx.fillStyle = skinDark; // Arm shading
                ctx.fillRect(armDrawX + 1 * pixel, armDrawY + 2 * pixel, 5 * pixel, 1 * pixel);
                ctx.fillRect(armDrawX + 6 * pixel, armDrawY + 6 * pixel, 2 * pixel, 1 * pixel);
                ctx.restore(); // Restore arm context

                // Baseball bat (attached to attacking arm)
                ctx.save();
                ctx.translate(drawX + 24 * pixel, drawY + 10 * pixel); // Pivot point for bat relative to attacking arm
                ctx.rotate(armRotate * (player.direction === 1 ? 1 : -1)); // Rotate with arm
                const batDrawX = -4 * pixel;
                const batDrawY = -4 * pixel;

                ctx.fillStyle = batOutline; // Changed from outlineStrong to batOutline
                ctx.fillRect(batDrawX + 0 * pixel, batDrawY + 0 * pixel, 16 * pixel, 5 * pixel); // Bat blade outline
                ctx.fillRect(batDrawX + 0 * pixel, batDrawY + 5 * pixel, 4 * pixel, 6 * pixel); // Bat handle outline
                ctx.fillStyle = batWoodBase;
                ctx.fillRect(batDrawX + 1 * pixel, batDrawY + 1 * pixel, 14 * pixel, 3 * pixel); // Bat blade fill
                ctx.fillRect(batDrawX + 1 * pixel, batDrawY + 6 * pixel, 2 * pixel, 5 * pixel); // Bat handle fill
                ctx.fillStyle = batWoodDark; // Bat shading/grain
                ctx.fillRect(batDrawX + 1 * pixel, batDrawY + 3 * pixel, 13 * pixel, 1 * pixel);
                ctx.fillRect(batDrawX + 2 * pixel, batDrawY + 8 * pixel, 1 * pixel, 3 * pixel);
                ctx.fillStyle = batWoodLight; // Bat highlight
                ctx.fillRect(batDrawX + 4 * pixel, batDrawY + 1 * pixel, 6 * pixel, 1 * pixel);
                ctx.fillRect(batDrawX + 1 * pixel, batDrawY + 6 * pixel, 1 * pixel, 1 * pixel);
                ctx.restore(); // Restore bat context

            } else if (player.isGuarding) {
                // Arms crossed for guard
                ctx.fillStyle = outlineStrong;
                ctx.fillRect(drawX + 6 * pixel, drawY + 12 * pixel, 20 * pixel, 6 * pixel); // Guarding arm block
                ctx.fillStyle = skinBase;
                ctx.fillRect(drawX + 7 * pixel, drawY + 13 * pixel, 18 * pixel, 4 * pixel);
                ctx.fillStyle = skinDark; // Guarding arm shading
                ctx.fillRect(drawX + 7 * pixel, drawY + 16 * pixel, 17 * pixel, 1 * pixel);
                ctx.fillStyle = skinLightest; // Guarding arm highlight
                ctx.fillRect(drawX + 9 * pixel, drawY + 13 * pixel, 5 * pixel, 1 * pixel);
                ctx.fillRect(drawX + 17 * pixel, drawY + 13 * pixel, 5 * pixel, 1 * pixel);

            } else {
                // Left Arm (Back arm, further away)
                ctx.fillStyle = outlineStrong;
                ctx.fillRect(drawX + 6 * pixel, drawY + 14 * pixel - armSwingOffset, 6 * pixel, 10 * pixel);
                ctx.fillStyle = skinBase;
                ctx.fillRect(drawX + 7 * pixel, drawY + 15 * pixel - armSwingOffset, 4 * pixel, 8 * pixel);
                ctx.fillStyle = skinDark; // Shading
                ctx.fillRect(drawX + 7 * pixel, drawY + 22 * pixel - armSwingOffset, 3 * pixel, 1 * pixel);
                ctx.fillStyle = skinLightest; // Highlight
                ctx.fillRect(drawX + 8 * pixel, drawY + 15 * pixel - armSwingOffset, 2 * pixel, 1 * pixel);

                // Right Arm (Front arm, closer)
                ctx.fillStyle = outlineStrong;
                ctx.fillRect(drawX + 20 * pixel, drawY + 12 * pixel + armSwingOffset, 6 * pixel, 10 * pixel);
                ctx.fillStyle = skinBase;
                ctx.fillRect(drawX + 21 * pixel, drawY + 13 * pixel + armSwingOffset, 4 * pixel, 8 * pixel);
                ctx.fillStyle = skinDark; // Shading
                ctx.fillRect(drawX + 21 * pixel, drawY + 20 * pixel + armSwingOffset, 3 * pixel, 1 * pixel);
                ctx.fillStyle = skinLightest; // Highlight
                ctx.fillRect(drawX + 22 * pixel, drawY + 13 * pixel + armSwingOffset, 2 * pixel, 1 * pixel);

                // Baseball Bat (Idle, rested on shoulder)
                ctx.fillStyle = batOutline; // Changed from outlineStrong to batOutline
                ctx.fillRect(drawX + 26 * pixel, drawY + 20 * pixel, 5 * pixel, 10 * pixel); // Bat blade
                ctx.fillRect(drawX + 26 * pixel, drawY + 28 * pixel, 3 * pixel, 2 * pixel); // Bat handle
                ctx.fillStyle = batWoodBase;
                ctx.fillRect(drawX + 27 * pixel, drawY + 21 * pixel, 3 * pixel, 8 * pixel);
                ctx.fillRect(drawX + 27 * pixel, drawY + 29 * pixel, 2 * pixel, 1 * pixel);
                ctx.fillStyle = batWoodLight; // Highlight
                ctx.fillRect(drawX + 27 * pixel, drawY + 22 * pixel, 2 * pixel, 1 * pixel);
                ctx.fillRect(drawX + 27 * pixel, drawY + 29 * pixel, 1 * pixel, 1 * pixel);
            }

            // --- Legs & Feet (detailed and animated) ---
            // Left Leg (Front leg for walking, or slightly lifted)
            ctx.fillStyle = outlineStrong;
            ctx.fillRect(drawX + 9 * pixel + legSwingOffset, drawY + 28 * pixel, 6 * pixel, 6 * pixel); // Leg outline
            ctx.fillStyle = skinBase;
            ctx.fillRect(drawX + 10 * pixel + legSwingOffset, drawY + 29 * pixel, 4 * pixel, 4 * pixel); // Leg fill
            ctx.fillStyle = skinDark; // Shading
            ctx.fillRect(drawX + 10 * pixel + legSwingOffset, drawY + 32 * pixel, 3 * pixel, 1 * pixel); // Bottom shade
            ctx.fillRect(drawX + 9 * pixel + legSwingOffset, drawY + 30 * pixel, 1 * pixel, 2 * pixel); // Side shade
            ctx.fillStyle = skinLightest; // Highlight
            ctx.fillRect(drawX + 11 * pixel + legSwingOffset, drawY + 29 * pixel, 2 * pixel, 1 * pixel);

            // Right Leg (Back leg for walking, or slightly trailing)
            ctx.fillStyle = outlineStrong;
            ctx.fillRect(drawX + 17 * pixel - legSwingOffset, drawY + 28 * pixel, 6 * pixel, 6 * pixel); // Leg outline
            ctx.fillStyle = skinBase;
            ctx.fillRect(drawX + 18 * pixel - legSwingOffset, drawY + 29 * pixel, 4 * pixel, 4 * pixel); // Leg fill
            ctx.fillStyle = skinDark; // Shading
            ctx.fillRect(drawX + 18 * pixel - legSwingOffset, drawY + 32 * pixel, 3 * pixel, 1 * pixel); // Bottom shade
            ctx.fillRect(drawX + 17 * pixel - legSwingOffset, drawY + 30 * pixel, 1 * pixel, 2 * pixel); // Side shade
            ctx.fillStyle = skinLightest; // Highlight
            ctx.fillRect(drawX + 19 * pixel - legSwingOffset, drawY + 29 * pixel, 2 * pixel, 1 * pixel);

            ctx.restore(); // Restore after body tilt and overall transformations

            // --- Ground Shadow (always drawn relative to canvas, not flipped) ---
            if (!player.isLoser) { // Don't draw shadow if fallen
                ctx.fillStyle = shadowGround;
                ctx.beginPath();
                ctx.ellipse(x + player.width / 2, y + player.height - 2, player.width / 2 * 0.8, 5, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            // --- Special Effects (always drawn on top, not affected by player direction) ---
            if (player.specialAttackActive) {
                ctx.fillStyle = 'rgba(255, 255, 0, 0.7)'; // Yellow aura for special
                ctx.fillRect(x, y, player.width, player.height);
            }

            // --- Hit Effect (always drawn on top) ---
            if (player.hitEffectTimer > 0) {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.7)'; // Red overlay when hit
                ctx.fillRect(x, y, player.width, player.height);
            }
        }
    },
    "tralarero": { // New character: 트랄라레로 트랄랄라 (Shark with shoes)
        id: "tralarero",
        name: "트랄라레로 트랄랄라",
        description: "파란색 운동화를 신고 있는 픽셀화된 상어. 지상에서 빠르게 움직이며 날카로운 이빨과 강력한 발차기 공격을 사용합니다.",
        basicAttackDamage: 20,
        basicAttackProjectile: null,
        specialMove: {
            name: "상어 돌진",
            damage: 35,
            manaCost: 35,
            cooldown: 1800,
            effectDuration: 400,
            drawEffect: function (player, ctx) {
                const dashColor = 'rgba(100, 100, 255, 0.9)'; // Stronger blue for dash
                const trailColor = 'rgba(150, 150, 255, 0.5)'; // Lighter blue for trails
                const sparkColor = 'rgba(255, 255, 200, 1)'; // Brighter yellowish sparks
                const glowColor = 'rgba(200, 200, 255, 0.3)'; // Subtle outer glow

                // Main aura around the shark with subtle pulsation
                ctx.fillStyle = dashColor;
                ctx.fillRect(player.x - player.width * 0.3, player.y - player.height * 0.3,
                    player.width * 1.6, player.height * 1.6);

                // Outer glow layer
                ctx.shadowBlur = 15;
                ctx.shadowColor = 'blue';
                ctx.fillStyle = glowColor;
                ctx.fillRect(player.x - player.width * 0.4, player.y - player.height * 0.4,
                    player.width * 1.8, player.height * 1.8);
                ctx.shadowBlur = 0;

                // Trailing lines with varying lengths, opacity, and slight curve
                const trailLengthFactor = player.specialAttackTimer / player.specialMove.effectDuration;
                const baseTrailX = player.x + (player.direction === 1 ? player.width : 0);

                for (let i = 0; i < 7; i++) {
                    const length = (10 + i * 7) * trailLengthFactor;
                    const opacity = 0.8 - i * 0.1;
                    ctx.fillStyle = `rgba(100, 100, 255, ${opacity})`;
                    const trailYOffset = Math.sin(Date.now() * 0.2 + i) * 2; // Subtle wave
                    ctx.fillRect(baseTrailX - player.direction * length - player.direction * (i * 3), player.y + player.height / 2 - 6 + i * 2 + trailYOffset, length, 2);
                }

                // More numerous and dynamic sparks/dust
                ctx.fillStyle = sparkColor;
                for (let i = 0; i < 8; i++) {
                    const sparkX = player.x + player.width / 2 + Math.random() * player.direction * player.width * 0.6 - player.direction * (Math.random() * 20 * trailLengthFactor);
                    const sparkY = player.y + player.height - Math.random() * 15;
                    ctx.fillRect(sparkX, sparkY, 2 + Math.random() * 2, 2 + Math.random() * 2); // Varying spark size
                }
            },
            command: ['ArrowRight', 'ArrowRight', 'w']
        },
        // Function to draw Tralalaro (Shark with shoes)
        drawCharacter: function (player, ctx) {
            const x = player.x;
            const y = player.y;
            const pixel = 1;

            // --- Color Palette for Tralarero ---
            const sharkBodyLight = '#8ac6eb'; // Body highlights
            const sharkBodyBase = '#63a3d2';   // Main shark body color
            const sharkBodyMid = '#508ac2';    // Mid-tone shading
            const sharkBodyDark = '#4a7ea3';   // Deep shading/creases
            const sharkOutline = '#3a6285';    // Strongest shark body outline

            const sharkBellyLight = '#f0f4f8'; // Belly highlights
            const sharkBellyBase = '#e2e8f0';  // Main belly color
            const sharkBellyDark = '#cdd5e0';  // Belly shading

            const finBase = '#4a7ea3';     // Fin base color
            const finDark = '#3a6285';     // Fin shading
            const finHighlight = '#7dc0e5'; // Fin highlights

            const eyeBlack = '#000000';   // Eye outline/fill
            const eyeRed = '#ff0000';     // Intense eye dot
            const eyePupilLight = '#ffffff'; // Pupil highlight

            const teethWhite = '#ffffff'; // Teeth color
            const mouthGums = '#800000'; // Dark red for gums

            const shoeMain = '#3b82f6';     // Main shoe color (bright blue)
            const shoeMid = '#2a6ddb';      // Mid-tone shoe shade
            const shoeDark = '#1a54ad';     // Deep shoe shade
            const shoeSole = '#4f46e5';     // Dark sole color
            const shoeLaces = '#dbeafe';    // White laces/swoosh
            const shoeOutline = '#103070';  // Strong shoe outline

            const outlineStrong = '#202020'; // General character outline
            const shadowGround = 'rgba(0,0,0,0.3)'; // Shadow beneath character

            // --- Animation State Variables ---
            let yBob = 0; // Vertical bobbing for idle/walk
            let shoeLift = 0; // Animation for lifting shoes during walk
            let bodyTilt = 0; // Slight body tilt for dynamic movement
            let tailWagAngle = 0; // Tail wagging for movement
            let headBounce = 0; // Subtle head bounce for movement
            let finFlutter = 0; // Slight fin movement

            // Walking/Running Animation
            if ((player === gameManager.player1 && (gameManager.keys.ArrowLeft || gameManager.keys.ArrowRight)) || (player === gameManager.player2 && (Math.abs(gameManager.player1.x - gameManager.player2.x) > ATTACK_RANGE && !gameManager.player2.isGuarding))) {
                yBob = Math.sin(Date.now() * 0.07) * pixel * 0.7;
                shoeLift = Math.sin(Date.now() * 0.12) * pixel * 2; // More pronounced lift
                bodyTilt = Math.sin(Date.now() * 0.08) * 0.06; // More dynamic tilt
                tailWagAngle = Math.sin(Date.now() * 0.12) * 0.15; // Wider tail wag
                headBounce = Math.sin(Date.now() * 0.1) * 0.01; // Gentle head bounce
                finFlutter = Math.sin(Date.now() * 0.18) * 0.05; // Quick fin flutter
                if (!player.isJumping) {
                    drawDustEffect(x + player.width / 2, y + player.height - 2);
                }
            } else {
                // Idle Animation
                yBob = Math.sin(Date.now() * 0.04) * pixel * 0.3; // Subtle idle bob
                tailWagAngle = Math.sin(Date.now() * 0.06) * 0.05; // Gentle idle wag
                finFlutter = Math.sin(Date.now() * 0.08) * 0.02; // Very subtle fin flutter
            }

            // Attack Animation (dash or basic attack)
            if (player.isAttacking || player.specialAttackActive) {
                // For dash, bodyTilt will be handled by the special move's drawEffect for dynamic movement
                bodyTilt = 0; // Reset for special move if it applies its own
                headBounce = 0; // Stable head during attack
            }

            // Winning/Losing Animation
            if (player.isWinner) {
                yBob = -pixel * 6 + Math.sin(Date.now() * 0.15) * pixel * 1.5; // Happy bounce
                tailWagAngle = Math.sin(Date.now() * 0.1) * 0.2; // Exaggerated wag
                bodyTilt = 0;
            } else if (player.isLoser) {
                yBob = pixel * 10; // Falls down further
                bodyTilt = Math.PI / 4 * player.direction; // Tilted on the ground
                tailWagAngle = 0;
                finFlutter = 0;
            }

            // --- Context Transformations ---
            ctx.save();
            ctx.translate(x + player.width / 2, y + player.height / 2 + yBob);
            ctx.scale(player.direction, 1); // Flip horizontally
            ctx.rotate(bodyTilt * player.direction); // Apply body tilt

            const drawX = -player.width / 2;
            const drawY = -player.height / 2;

            // --- Drawing Tralarero Pixel Art: Layer by Layer ---

            // --- Body Base ---
            ctx.fillStyle = sharkOutline;
            // Main shark body shape with more refined curvature and snout
            ctx.fillRect(drawX + 2 * pixel, drawY + 8 * pixel, 28 * pixel, 16 * pixel);
            ctx.fillRect(drawX + 0 * pixel, drawY + 11 * pixel, 2 * pixel, 6 * pixel); // Snout tip
            ctx.fillStyle = sharkBodyBase;
            ctx.fillRect(drawX + 3 * pixel, drawY + 9 * pixel, 26 * pixel, 14 * pixel);
            ctx.fillRect(drawX + 1 * pixel, drawY + 12 * pixel, 1 * pixel, 4 * pixel); // Snout fill

            // --- Body Shading & Highlights (scales implied) ---
            ctx.fillStyle = sharkBodyDark; // Deep shading
            ctx.fillRect(drawX + 3 * pixel, drawY + 9 * pixel, 1 * pixel, 14 * pixel); // Left edge shade
            ctx.fillRect(drawX + 28 * pixel, drawY + 9 * pixel, 1 * pixel, 14 * pixel); // Right edge shade
            ctx.fillRect(drawX + 4 * pixel, drawY + 22 * pixel, 24 * pixel, 1 * pixel); // Bottom edge shade
            ctx.fillRect(drawX + 1 * pixel, drawY + 15 * pixel, 2 * pixel, 1 * pixel); // Snout bottom shade
            ctx.fillStyle = sharkBodyMid; // Mid-tone
            ctx.fillRect(drawX + 5 * pixel, drawY + 19 * pixel, 20 * pixel, 2 * pixel); // Belly top shadow
            ctx.fillRect(drawX + 8 * pixel, drawY + 10 * pixel, 15 * pixel, 1 * pixel); // Upper body shadow
            ctx.fillStyle = sharkBodyLight; // Highlights
            ctx.fillRect(drawX + 6 * pixel, drawY + 10 * pixel, 15 * pixel, 1 * pixel); // Top body highlight
            ctx.fillRect(drawX + 4 * pixel, drawY + 11 * pixel, 1 * pixel, 1 * pixel); // Snout highlight dot

            // --- Gill slits (more prominent) ---
            ctx.fillStyle = sharkOutline;
            ctx.fillRect(drawX + 9 * pixel, drawY + 13 * pixel, 1 * pixel, 4 * pixel);
            ctx.fillRect(drawX + 11 * pixel, drawY + 13 * pixel, 1 * pixel, 4 * pixel);
            ctx.fillRect(drawX + 13 * pixel, drawY + 13 * pixel, 1 * pixel, 4 * pixel);
            ctx.fillStyle = sharkBodyDark; // Shading within gills
            ctx.fillRect(drawX + 9 * pixel + 1, drawY + 14 * pixel, 1 * pixel, 2 * pixel);
            ctx.fillRect(drawX + 11 * pixel + 1, drawY + 14 * pixel, 1 * pixel, 2 * pixel);
            ctx.fillRect(drawX + 13 * pixel + 1, drawY + 14 * pixel, 1 * pixel, 2 * pixel);


            // --- Belly ---
            ctx.fillStyle = sharkBellyBase;
            ctx.fillRect(drawX + 4 * pixel, drawY + 16 * pixel, 22 * pixel, 6 * pixel); // Main belly fill
            ctx.fillRect(drawX + 1 * pixel, drawY + 15 * pixel, 3 * pixel, 3 * pixel); // Belly under snout
            ctx.fillStyle = sharkBellyDark; // Belly shading
            ctx.fillRect(drawX + 4 * pixel, drawY + 21 * pixel, 22 * pixel, 1 * pixel); // Bottom belly shade
            ctx.fillRect(drawX + 4 * pixel, drawY + 16 * pixel, 1 * pixel, 5 * pixel); // Left belly shade
            ctx.fillStyle = sharkBellyLight; // Belly highlight
            ctx.fillRect(drawX + 6 * pixel, drawY + 17 * pixel, 18 * pixel, 1 * pixel); // Top belly highlight

            // --- Dorsal Fin ---
            ctx.fillStyle = sharkOutline;
            ctx.beginPath();
            ctx.moveTo(drawX + 16 * pixel, drawY + 8 * pixel);
            ctx.lineTo(drawX + 18 * pixel, drawY + 1 * pixel); // Sharper tip
            ctx.lineTo(drawX + 20 * pixel, drawY + 8 * pixel);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = finBase;
            ctx.beginPath();
            ctx.moveTo(drawX + 17 * pixel, drawY + 9 * pixel);
            ctx.lineTo(drawX + 18 * pixel, drawY + 2 * pixel);
            ctx.lineTo(drawX + 19 * pixel, drawY + 9 * pixel);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = finDark; // Fin shading
            ctx.fillRect(drawX + 17 * pixel, drawY + 7 * pixel, 1 * pixel, 2 * pixel);
            ctx.fillStyle = finHighlight; // Fin highlight
            ctx.fillRect(drawX + 18 * pixel, drawY + 3 * pixel, 1 * pixel, 1 * pixel); // Highlight dot

            // --- Pectoral Fins (arms) with more definition and animation ---
            // Left Pectoral Fin (front)
            ctx.save();
            ctx.translate(drawX + 11 * pixel, drawY + 19 * pixel); // Pivot
            ctx.rotate(finFlutter * (player.direction === 1 ? 1 : -1));
            const finDrawX = -2 * pixel;
            const finDrawY = -1 * pixel;
            ctx.fillStyle = sharkOutline;
            ctx.fillRect(finDrawX + 0 * pixel, finDrawY + 0 * pixel, 7 * pixel, 4 * pixel);
            ctx.fillStyle = finBase;
            ctx.fillRect(finDrawX + 1 * pixel, finDrawY + 1 * pixel, 5 * pixel, 2 * pixel);
            ctx.fillStyle = finDark;
            ctx.fillRect(finDrawX + 1 * pixel, finDrawY + 2 * pixel, 4 * pixel, 1 * pixel);
            ctx.fillStyle = finHighlight;
            ctx.fillRect(finDrawX + 2 * pixel, finDrawY + 1 * pixel, 1 * pixel, 1 * pixel);
            ctx.restore();

            // Right Pectoral Fin (back)
            ctx.save();
            ctx.translate(drawX + 21 * pixel, drawY + 19 * pixel); // Pivot
            ctx.rotate(-finFlutter * (player.direction === 1 ? 1 : -1));
            ctx.fillStyle = sharkOutline;
            ctx.fillRect(finDrawX + 0 * pixel, finDrawY + 0 * pixel, 7 * pixel, 4 * pixel);
            ctx.fillStyle = finBase;
            ctx.fillRect(finDrawX + 1 * pixel, finDrawY + 1 * pixel, 5 * pixel, 2 * pixel);
            ctx.fillStyle = finDark;
            ctx.fillRect(finDrawX + 1 * pixel, finDrawY + 2 * pixel, 4 * pixel, 1 * pixel);
            ctx.fillStyle = finHighlight;
            ctx.fillRect(finDrawX + 2 * pixel, finDrawY + 1 * pixel, 1 * pixel, 1 * pixel);
            ctx.restore();

            // --- Tail Fin (more dynamic wagging) ---
            ctx.save(); // Save for tail rotation
            ctx.translate(drawX + 29 * pixel, drawY + 15 * pixel); // Pivot point for tail
            ctx.rotate(tailWagAngle * player.direction); // Wag based on direction
            const tailDrawX = -2 * pixel;
            const tailDrawY = -7 * pixel; // Adjusted to be centered on pivot point

            ctx.fillStyle = sharkOutline;
            ctx.beginPath();
            ctx.moveTo(tailDrawX + 0 * pixel, tailDrawY + 0 * pixel);
            ctx.lineTo(tailDrawX + 4 * pixel, tailDrawY - 8 * pixel); // Upper tip
            ctx.lineTo(tailDrawX + 2 * pixel, tailDrawY + 4 * pixel);
            ctx.lineTo(tailDrawX + 4 * pixel, tailDrawY + 8 * pixel); // Lower tip
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = finBase;
            ctx.beginPath();
            ctx.moveTo(tailDrawX + 1 * pixel, tailDrawY + 1 * pixel);
            ctx.lineTo(tailDrawX + 3 * pixel, tailDrawY - 6 * pixel);
            ctx.lineTo(tailDrawX + 3 * pixel, tailDrawY + 3 * pixel);
            ctx.lineTo(tailDrawX + 3 * pixel, tailDrawY + 7 * pixel);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = finDark; // Tail shading
            ctx.fillRect(tailDrawX + 1 * pixel, tailDrawY + 0 * pixel, 1 * pixel, 7 * pixel);
            ctx.fillRect(tailDrawX + 2 * pixel, tailDrawY + 4 * pixel, 1 * pixel, 2 * pixel);
            ctx.fillStyle = finHighlight;
            ctx.fillRect(tailDrawX + 2 * pixel, tailDrawY - 5 * pixel, 1 * pixel, 1 * pixel); // Tail highlight
            ctx.restore(); // Restore after tail rotation


            // --- Mouth (sharper, more menacing with gums) ---
            ctx.fillStyle = sharkOutline;
            ctx.fillRect(drawX + 0 * pixel, drawY + 12 * pixel, 6 * pixel, 4 * pixel); // Mouth outline
            ctx.fillStyle = mouthGums; // Gums color
            ctx.fillRect(drawX + 1 * pixel, drawY + 13 * pixel, 4 * pixel, 2 * pixel); // Gums fill
            ctx.fillStyle = teethWhite; // Teeth (more numerous and pointed)
            ctx.fillRect(drawX + 1 * pixel, drawY + 12 * pixel, 1 * pixel, 1 * pixel); // Top teeth
            ctx.fillRect(drawX + 2 * pixel, drawY + 12 * pixel, 1 * pixel, 1 * pixel);
            ctx.fillRect(drawX + 3 * pixel, drawY + 12 * pixel, 1 * pixel, 1 * pixel);
            ctx.fillRect(drawX + 4 * pixel, drawY + 12 * pixel, 1 * pixel, 1 * pixel);
            ctx.fillRect(drawX + 1 * pixel, drawY + 15 * pixel, 1 * pixel, 1 * pixel); // Bottom teeth
            ctx.fillRect(drawX + 2 * pixel, drawY + 15 * pixel, 1 * pixel, 1 * pixel);
            ctx.fillRect(drawX + 3 * pixel, drawY + 15 * pixel, 1 * pixel, 1 * pixel);
            ctx.fillRect(drawX + 4 * pixel, drawY + 15 * pixel, 1 * pixel, 1 * pixel);


            // --- Eye (more intense, with distinct pupil and reflection) ---
            ctx.fillStyle = sharkOutline;
            ctx.fillRect(drawX + 6 * pixel, drawY + 10 * pixel, 4 * pixel, 4 * pixel); // Eye outline
            ctx.fillStyle = eyeBlack;
            ctx.fillRect(drawX + 7 * pixel, drawY + 11 * pixel, 2 * pixel, 2 * pixel); // Eye black fill
            ctx.fillStyle = eyePupilLight; // Pupil white dot
            ctx.fillRect(drawX + 7 * pixel, drawY + 11 * pixel, 1 * pixel, 1 * pixel); // Small white pupil dot
            ctx.fillStyle = eyeRed; // Red intensity dot
            ctx.fillRect(drawX + 9 * pixel, drawY + 10 * pixel, 1 * pixel, 1 * pixel); // Red corner dot for glint


            // --- Front Shoe (dynamically lifted with more detail) ---
            ctx.fillStyle = shoeOutline;
            ctx.fillRect(drawX + 6 * pixel, drawY + 20 * pixel + (shoeLift > 0 ? shoeLift : 0), 10 * pixel, 6 * pixel); // Shoe body outline
            ctx.fillRect(drawX + 7 * pixel, drawY + 25 * pixel + (shoeLift > 0 ? shoeLift : 0), 8 * pixel, 1 * pixel); // Sole outline
            ctx.fillStyle = shoeMain;
            ctx.fillRect(drawX + 7 * pixel, drawY + 21 * pixel + (shoeLift > 0 ? shoeLift : 0), 8 * pixel, 4 * pixel); // Shoe body fill
            ctx.fillStyle = shoeDark; // Shoe shading
            ctx.fillRect(drawX + 7 * pixel, drawY + 21 * pixel + (shoeLift > 0 ? shoeLift : 0), 1 * pixel, 4 * pixel); // Left side shade
            ctx.fillRect(drawX + 14 * pixel, drawY + 21 * pixel + (shoeLift > 0 ? shoeLift : 0), 1 * pixel, 4 * pixel); // Right side shade
            ctx.fillRect(drawX + 8 * pixel, drawY + 24 * pixel + (shoeLift > 0 ? shoeLift : 0), 6 * pixel, 1 * pixel); // Top sole shade
            ctx.fillStyle = shoeSole;
            ctx.fillRect(drawX + 8 * pixel, drawY + 25 * pixel + (shoeLift > 0 ? shoeLift : 0), 6 * pixel, 1 * pixel); // Sole fill
            ctx.fillStyle = shoeLaces; // Laces & swoosh
            ctx.fillRect(drawX + 12 * pixel, drawY + 22 * pixel + (shoeLift > 0 ? shoeLift : 0), 3 * pixel, 1 * pixel); // Swoosh
            ctx.fillRect(drawX + 11 * pixel, drawY + 21 * pixel + (shoeLift > 0 ? shoeLift : 0), 1 * pixel, 1 * pixel); // Lace dot
            ctx.fillRect(drawX + 9 * pixel, drawY + 21 * pixel + (shoeLift > 0 ? shoeLift : 0), 1 * pixel, 1 * pixel); // Lace dot
            ctx.fillRect(drawX + 10 * pixel, drawY + 23 * pixel + (shoeLift > 0 ? shoeLift : 0), 1 * pixel, 1 * pixel); // Lace dot

            // --- Back Shoe (dynamically lowered/trailing with more detail) ---
            ctx.fillStyle = shoeOutline;
            ctx.fillRect(drawX + 16 * pixel, drawY + 20 * pixel + (shoeLift < 0 ? Math.abs(shoeLift) : 0), 10 * pixel, 6 * pixel); // Shoe body outline
            ctx.fillRect(drawX + 17 * pixel, drawY + 25 * pixel + (shoeLift < 0 ? Math.abs(shoeLift) : 0), 8 * pixel, 1 * pixel); // Sole outline
            ctx.fillStyle = shoeMain;
            ctx.fillRect(drawX + 17 * pixel, drawY + 21 * pixel + (shoeLift < 0 ? Math.abs(shoeLift) : 0), 8 * pixel, 4 * pixel); // Shoe body fill
            ctx.fillStyle = shoeDark; // Shoe shading
            ctx.fillRect(drawX + 17 * pixel, drawY + 21 * pixel + (shoeLift < 0 ? Math.abs(shoeLift) : 0), 1 * pixel, 4 * pixel);
            ctx.fillRect(drawX + 24 * pixel, drawY + 21 * pixel + (shoeLift < 0 ? Math.abs(shoeLift) : 0), 1 * pixel, 4 * pixel);
            ctx.fillRect(drawX + 18 * pixel, drawY + 24 * pixel + (shoeLift < 0 ? Math.abs(shoeLift) : 0), 6 * pixel, 1 * pixel);
            ctx.fillStyle = shoeSole;
            ctx.fillRect(drawX + 18 * pixel, drawY + 25 * pixel + (shoeLift < 0 ? Math.abs(shoeLift) : 0), 6 * pixel, 1 * pixel);
            ctx.fillStyle = shoeLaces; // Laces & swoosh
            ctx.fillRect(drawX + 22 * pixel, drawY + 22 * pixel + (shoeLift < 0 ? Math.abs(shoeLift) : 0), 3 * pixel, 1 * pixel);
            ctx.fillRect(drawX + 21 * pixel, drawY + 21 * pixel + (shoeLift < 0 ? Math.abs(shoeLift) : 0), 1 * pixel, 1 * pixel);
            ctx.fillRect(drawX + 19 * pixel, drawY + 21 * pixel + (shoeLift < 0 ? Math.abs(shoeLift) : 0), 1 * pixel, 1 * pixel);
            ctx.fillRect(drawX + 20 * pixel, drawY + 23 * pixel + (shoeLift < 0 ? Math.abs(shoeLift) : 0), 1 * pixel, 1 * pixel);

            ctx.restore(); // Restore after body tilt and overall transformations

            // --- Ground Shadow (always drawn relative to canvas, not flipped) ---
            if (!player.isLoser) { // Don't draw shadow if fallen
                ctx.fillStyle = shadowGround;
                ctx.beginPath();
                ctx.ellipse(x + player.width / 2, y + player.height - 2, player.width / 2 * 0.9, 6, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            // --- Special Effects (always drawn on top, not affected by player direction) ---
            if (player.specialAttackActive && player.specialMove.drawEffect) {
                player.specialMove.drawEffect(player, ctx);
            }

            // --- Hit Effect (always drawn on top) ---
            if (player.hitEffectTimer > 0) {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.7)'; // Red overlay when hit
                ctx.fillRect(x, y, player.width, player.height);
            }
        }
    }
};
