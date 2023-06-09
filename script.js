const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const winBtn = document.getElementById("winBtn");

const baseUrl = "/whiskey-run/";

let stop = false;
let frameCount = 0;
let fps, fpsInterval, startTime, now, then, elapsed;

// Get the device pixel ratio
const dpr = window.devicePixelRatio || 1;

// Get the canvas size in CSS pixels
const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;

// Set the canvas size in device pixels
canvas.width = canvasWidth * dpr;
canvas.height = canvasHeight * dpr;

// canvas.width = canvas.clientWidth;
// canvas.height = canvas.clientHeight;

const gravity = 0.5;
let score = 0;
let lastScore = 0;
let gameOver = false;
let win = false;

let playerImage = new Image();
playerImage.src = `${baseUrl}images/man20.png`;
const spriteWidth = 80;
const spriteHeight = 110;
let playerFrameX = 0;
let playerFrameY = 0;

let enemyImage = new Image();
enemyImage.src = `${baseUrl}images/zombie1.png`;
let enemyFrameX = 0;
let enemyFrameY = 0;

let appleImage = new Image();
appleImage.src = `${baseUrl}images/bottle.png`;

let rockImage = new Image();
rockImage.src = `${baseUrl}images/meteor1.png`;
let rockFrameX = 0;
let rockFrameY = 0;

let backgroundImg = new Image();
backgroundImg.src = `${baseUrl}images/background_01.jpg`;

let platformImage = new Image();
platformImage.src = `${baseUrl}images/platform.png`;

let gameFrame = 0;
let stagerFrame = 5;

let animationRequestId;

let winScore = 10;

// character
class Player {
  constructor() {
    this.position = {
      x: 500,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 80;
    this.height = 170;
  }

  draw() {
    c.drawImage(
      playerImage,
      80 * playerFrameX,
      175 * playerFrameY,
      80,
      175,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (gameFrame % stagerFrame == 0) {
      if (this.velocity.x > 0) {
        if (playerFrameX < 1) {
          playerFrameX++;
        } else playerFrameX = 0;
        playerFrameY = 1;
      } else if (this.velocity.x < 0) {
        if (playerFrameX < 1) {
          playerFrameX++;
        } else playerFrameX = 0;
        playerFrameY = 2;
      } else if (this.velocity.y > 0) {
        playerFrameX = 1;
        playerFrameY = 3;
      } else if (this.velocity.y < 0) {
        playerFrameX = 0;
        playerFrameY = 3;
      } else {
        playerFrameX = 0;
        playerFrameY = 0;
      }
    }

    if (
      this.position.y + this.height + this.velocity.y <=
      platform.position.y
    ) {
      this.velocity.y += gravity;
    } else this.velocity.y = 0;

    if (this.position.x + this.width >= canvas.width) {
      this.velocity.x = 0;
      this.position.x = canvas.width - this.width;
    } else if (this.position.x <= 0) {
      this.velocity.x = 0;
      this.position.x = 0;
    }
  }
}

class PlateForm {
  constructor() {
    this.position = {
      x: 0,
      y: canvas.height - 80,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 2000;
    this.height = 80;
  }

  draw() {
    c.drawImage(
      platformImage,
      0,
      0,
      2000,
      80,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else this.velocity.y = 0;
  }
}

// enemy
class Enemy {
  constructor(x) {
    this.position = {
      x,
      y: 0,
    };
    this.velocity = {
      x: 1,
      y: 0,
    };
    this.width = 80;
    this.height = 110;

    if (this.position.x >= canvas.width / 2) {
      this.position.x = canvas.width + 10;
    } else if (this.position.x < canvas.width / 2) {
      this.position.x = -10 - this.width;
    }
  }

  draw() {
    c.drawImage(
      enemyImage,
      spriteWidth * enemyFrameX,
      spriteHeight * enemyFrameY,
      spriteWidth,
      spriteHeight,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (gameFrame % stagerFrame == 0) {
      if (this.velocity.x > 0) {
        if (enemyFrameX < 1) {
          enemyFrameX++;
        } else enemyFrameX = 0;
        enemyFrameY = 0;
      } else if (this.velocity.x < 0) {
        if (enemyFrameX < 1) {
          enemyFrameX++;
        } else enemyFrameX = 0;
        enemyFrameY = 1;
      }
    }

    if (
      this.position.y + this.height + this.velocity.y <=
      platform.position.y
    ) {
      this.velocity.y += gravity;
    } else this.velocity.y = 0;
  }
}

// rock
class Rock {
  constructor(x) {
    this.position = {
      x,
      y: -100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 58;
    this.height = 100;
  }

  draw() {
    c.drawImage(
      rockImage,
      58 * rockFrameX,
      100 * rockFrameY,
      58,
      100,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update(hit) {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (gameFrame % 2 == 0) {
      if (rockFrameY < 2) {
        if (rockFrameX < 3) {
          rockFrameX++;
        } else rockFrameX = 0;
        rockFrameY++;
      } else rockFrameY = 0;
    }
    if (hit) {
      this.velocity.y = 0;
      this.position.y = -100;
      this.position.x = Math.floor(Math.random() * canvas.width);
    } else if (
      this.position.y + this.height + this.velocity.y <=
      canvas.height
    ) {
      this.velocity.y += gravity * 0.25;
    } else if (this.position.y > 1000) {
      this.velocity.y = 0;
      this.position.y = -100;
      this.position.x = Math.floor(Math.random() * canvas.width);
    }
  }
}

class Perk {
  constructor(x) {
    this.position = {
      x,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 40;
    this.height = 80;
  }

  draw() {
    c.drawImage(
      appleImage,
      0,
      0,
      40,
      80,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update(hit) {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (
      this.position.y + this.height + this.velocity.y <=
      platform.position.y
    ) {
      this.velocity.y += gravity;
    } else this.velocity.y = 0;

    if (hit) {
      this.position.x = Math.floor(Math.random() * (canvas.width - 10));
      this.position.y = 100;
    }
  }
}

const player = new Player();
const enemy1 = new Enemy(Math.floor(Math.random() * canvas.width));
const perk = new Perk(Math.floor(Math.random() * canvas.width));
const rock = new Rock(Math.floor(Math.random() * canvas.width));
const platform = new PlateForm();

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  up: {
    pressed: false,
  },
};

function animate() {
  animationRequestId = requestAnimationFrame(animate);

  now = Date.now();
  elapsed = now - then;
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);

    gameFrame++;
    c.clearRect(0, 0, canvas.width, canvas.height);

    if (score >= winScore) {
      cancelAnimationFrame(animationRequestId);
      winGame();
      return;
    }

    if (gameOver) {
      c.font = "40px Arial";
      let gameOverString = `Game Over Score: ${lastScore}`;
      let againString = `Click to play again`;
      c.textAlign = "center";
      c.fillText(gameOverString, canvas.width / 2, canvas.height / 2);
      c.fillText(againString, canvas.width / 2, canvas.height / 2 + 50);
      return;
    }

    c.font = "30px Arial";
    c.fillText(`Score: ${score}`, 100, 50);

    player.update();
    enemy1.update();
    rock.update();
    perk.update();
    platform.update();

    if (
      player.position.x + player.width >= enemy1.position.x &&
      player.position.x <= enemy1.position.x + enemy1.width &&
      player.position.y + player.height >= enemy1.position.y &&
      player.position.y <= enemy1.position.y + enemy1.height
    ) {
      lastScore = score;
      gameOver = true;
      perk.update(true);
      score = 0;
      player.position.x = 100;
      player.position.y = 100;
      enemy1.position.x = canvas.width - enemy1.width - 10;
    } else if (
      player.position.x + player.width >= rock.position.x &&
      player.position.x <= rock.position.x + rock.width &&
      player.position.y + player.height >= rock.position.y &&
      player.position.y <= rock.position.y + rock.height
    ) {
      rock.update(true);
      lastScore = score;
      gameOver = true;
      perk.update(true);
      score = 0;
      player.position.x = 100;
      player.position.y = 100;
      enemy1.position.x = canvas.width - enemy1.width - 10;
    } else if (
      player.position.x + player.width >= perk.position.x &&
      player.position.x <= perk.position.x + perk.width &&
      player.position.y + player.height >= perk.position.y &&
      player.position.y <= perk.position.y + perk.height
    ) {
      perk.update(true);
      score++;
    }

    if (enemy1.position.x > player.position.x) {
      enemy1.velocity.x = -1;
    } else if (enemy1.position.x < player.position.x) {
      enemy1.velocity.x = 1;
    }

    if (keys.right.pressed) {
      player.velocity.x = 5;
    } else if (keys.left.pressed) {
      player.velocity.x = -5;
    } else player.velocity.x = 0;
  }
}

startBtn.addEventListener("click", () => {
  startAnimating(60);
  document.getElementById("startContainer").classList.add("hide");
});

function startAnimating(fps) {
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  animate();
}

function winGame() {
  document.getElementById("winContainer").style.display = "flex";
}

addEventListener("keydown", ({ key }) => {
  if (key === "a" || key === "ArrowLeft") {
    keys.left.pressed = true;
    return;
  } else if (key === "d" || key === "ArrowRight") {
    keys.right.pressed = true;
    return;
  } else if (key === "w" || key === "ArrowUp" || key === " ") {
    if (player.velocity.y == 0 && !keys.up.pressed) {
      player.velocity.y -= 20;
    }
    keys.up.pressed = true;
    return;
  }
});

addEventListener("keyup", ({ key }) => {
  if (key === "a" || key === "ArrowLeft") {
    keys.left.pressed = false;
    return;
  } else if (key === "d" || key === "ArrowRight") {
    keys.right.pressed = false;
    return;
  } else if (key === "w" || key === "ArrowUp" || key === " ") {
    keys.up.pressed = false;
    return;
  } else if (key === "Enter") {
    if (gameOver) {
      gameOver = false;
    }
  }
});

addEventListener("mouseup", () => {
  gameOver = false;
});

addEventListener("touchstart", (touch) => {
  // console.log("🙎Player: ", player.position.x, player.position.y);
  // console.log(
  //   "👆 Touch: ",
  //   touch.touches[0].clientX * dpr,
  //   touch.touches[0].clientY * dpr
  // );
  const touchX = touch.touches[0].clientX * dpr;
  const touchY = touch.touches[0].clientY * dpr;
  if (touchY < canvas.height / 2) {
    if (player.velocity.y == 0 && !keys.up.pressed) {
      player.velocity.y -= 20;
    }
    keys.up.pressed = true;
  }
  if (touchX > canvas.width / 2) {
    keys.right.pressed = true;
  } else if (touchX <= canvas.width / 2) {
    keys.left.pressed = true;
  }
});

addEventListener("touchend", () => {
  gameOver = false;
  keys.up.pressed = false;
  keys.right.pressed = false;
  keys.left.pressed = false;
});

winBtn.addEventListener("click", () => {
  window.location.href = "https://82chapters.com/pages/game";
});
