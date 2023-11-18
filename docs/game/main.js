title = "prototype-2-individual";

description = `
 Shoot the ball toward the basket
 for more time.

[Hold]    Change angle
[Release] Shoot Ball
`;

characters = [
    `
 YYYY
YYYYYY
YYYYYY
YYYYYY
YYYYYY
 YYYY
    `,
    `
  R
  R
  R
  R
  R
  R
  R
  `,
];

/*
  `
   BBBBBBBBBBBBB
  B             B
   BBBBBBBBBBBBB
  `
*/

const xBounds = 200;
const yBounds = 100;

options = {
    viewSize: { x: xBounds, y: yBounds },
    isPlayingBgm: true,
    // isReplayEnabled: true,
    seed: 10,
    theme: "shapeDark",
    //isCapturing: true // uncomment to capture & press 'c'
};

let gameOver = false;

let player, v;
let isJumping;
let angle;
let width;
let space;
let scr;
let playerCollision;
let thrown = false;
let gameTime = 750; // 15 second

const groundX = 0;
const groundY = 90;
const groundWidth = 300;
const groundHeight = 10;

let angleSpeed = 0.02;

// Hoop Spawning variables
let hoopY;
let hoopSpeed = 0.5;
let hoopCollision = char("b", hoopY);
score = 0;
var highScore = 0;

function spawn() {
    player = vec(30, 85);
    thrown = false;
}

function update() {
    if (gameTime <= 0) {
        endGame();
    }
    if (gameOver && input.isPressed) {
        // restart game
        gameOver = false;
        score = 0;
        gameTime = 750;
    }
    if (!gameOver) {
        if (!ticks) {
            spawn();
            isJumping = angle = width = space = 0;
        }

        if (width + space < 0) {
            width = 200;
            space = rnd(50, 150);
        }

        color("blue");
        rect(groundX, groundY, groundWidth, groundHeight);
        color("black");
        gameTime--;
        drawTime(gameTime, 80, 3);
        playerCollision = char("a", player);
        //console.log(player.x);
        if (player.x < 0 || player.y > yBounds || player.x > xBounds) {
            setTimeout(spawn, 500); // respawns after 1 second
            // play("lucky");
            // end(); // ends game
        }

        if (isJumping) {
            thrown = true;
            player.add(v);
            v.y += 0.1; // gravity

            if (playerCollision.isColliding.rect.blue && thrown) {
                isJumping = angle = 0;
                player.y = 85;
                setTimeout(spawn, 500);
            }
        } else {
            if (input.isPressed) {
                angle -= angleSpeed; // how fast the angle changes

                if (angle < -PI / 2 ) {
                    angleSpeed *= -1;
                } else if (angle > 0) {
                    angleSpeed *= -1;
                }

                bar(player, 20, 1.25, angle, 0); // this for aiming
            }

            if (input.isJustReleased) {
                play("jump");
                isJumping = 1;
                v = vec(4.5).rotate(angle); // controls how far ball goes
            }
        }

        scr = clamp(player.x - 50, 0, 99) * 0.1 + difficulty;
        //score += scr; controls score, for later

        // ----- Hoop Spawning & score updating -----
        if (!hoopY) {
            hoopY = 0;
        }

        // Move the hoop up and down
        hoopY += hoopSpeed;

        // Reverse direction when reaching the top or bottom
        if (hoopY <= 0 || hoopY >= yBounds - 10) {
            hoopSpeed *= -1;
        }

        // Draw the hoop
        char("b", 100, hoopY);
		char("b", 150, hoopY);
		char("b", 190, hoopY);

        onCollide();
    }
}

// Function to end the game and update the high score
function endGame() {
    gameOver = true;
    // play("explosion");
    if (score > highScore) {
        highScore = score;
    }

    hoopY = undefined;
    end();
}

// Check for collision with the hoop
function onCollide() {
    if (char("a", player).isColliding.char.b) {
        play("powerUp"); // play sound effect
        addScore(1);
		gameTime += 250;
    }
}

// Code from skygolf
function drawTime(time, x, y) {
    let t = Math.floor((time * 100) / 50);
    if (t >= 10 * 60 * 100) {
        t = 10 * 60 * 100 - 1;
    }
    const ts =
        getPaddedNumber(Math.floor(t / 6000), 1) +
        "'" +
        getPaddedNumber(Math.floor((t % 6000) / 100), 2) +
        '"' +
        getPaddedNumber(Math.floor(t % 100), 2);
    text(ts, x, y);
}

// Code from skygolf
function getPaddedNumber(v, digit) {
    return ("0000" + v).slice(-digit);
}