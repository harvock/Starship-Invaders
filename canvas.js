// Enemy constructor
function enemy(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.speed = 1;
  this.show = function () {
    const img = new Image();
    img.src = './Images/enemy_red.png';
    ctx.drawImage(img, this.x, this.y, this.w, this.h);
  };
  this.move = function (speed) {
    this.y += speed - 1;
    this.show();
  };
}

// Bullet constructor
function bullet(x, y, w, h) {
  this.x = x + 20;
  this.y = y;
  this.w = w + 5;
  this.h = h + 20;
  this.show = function () {
    const img = new Image();
    img.src = './Images/laser.png';
    ctx.drawImage(img, this.x, this.y, this.w, this.h);
  };

  this.move = function () {
    this.y -= 5;
    this.show();
  };

  this.hits = function (bullet, enemy) {
    if (bullet.y < enemy.y + enemy.h + 10 && bullet.x < enemy.x + enemy.w && bullet.x > enemy.x - 3) {
      return (true);
    }
  };
}

// Player constructure
function starship(x, y, w, h, imgPath) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.img = new Image();
  this.img.src = imgPath;

  this.show = function () {
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    if (this.x <= 0) this.x = 0;
    if (this.x >= canvas.width - this.w) this.x = canvas.width - this.w;
  };

  this.move = function (dir) {
    this.x += dir;
    this.show();
  };
}

// Background construction
// function drawBackground() {
//   const backgroundImg = new Image();
//   backgroundImg.src = './Images/space2.png';
// 	ctx.drawImage(backgroundImg, 0, 0, 900, 700);
// }

function drawBackground(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.speed = -1;

  this.img = new Image();
  this.img.src = './Images/space2.png';

  this.show = function () {
    ctx.drawImage(this.img, 0, this.y, 900, 700);
    if (this.speed < 0) {
      ctx.drawImage(this.img, 0, this.y + 700);
    } else {
      ctx.drawImage(this.img, 0, this.y - 700);
    }
  };

  this.move = function () {
    this.y += this.speed;
    this.y %= canvas.height;
  };
}

// Global variables
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let PlayerOneTurn = true;
let enemies = [];
let playerOneScore = 0;
let playerTwoScore = 0;
let enemySpeed = 1;
const callBackground = new drawBackground(0, 0, 900, 700);

// Draw Game on press button
function game() {
  document.getElementById('play').style.visibility = 'hidden';
  const playerOne = new starship(canvas.width / 2, canvas.height - 70, 60, 60, './Images/ship_blue.png');
  const playerTwo = new starship(canvas.width / 2, canvas.height - 70, 60, 60, './Images/ship_red.png');
  const bullets = [];
  const score = 0;
  let level = 1;

  // Draw enemies
  function drawEnemies(yPos) {
    for (let i = 0; i < 11; i++) {
      const enemyOne = new enemy(i * 90, yPos, 60, 60);
      enemies.push(enemyOne);
      enemies[i].show();
    }
  }


  // Main game loops, call functions
  function update() {
    if (PlayerOneTurn === true) {
      callBackground.move();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      callBackground.show();
      playerOne.show();
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      callBackground.show();
      callBackground.move();
      playerTwo.show();
    }

    // Checks which player will play
    if (PlayerOneTurn === true) {
      document.getElementById('score').innerHTML = playerOneScore;
    } else {
      document.getElementById('score').innerHTML = playerTwoScore;
    }
    // Shoot the bullets and checks if they hit an enemy
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].move();
      for (let j = 0; j < enemies.length; j++) {
        if (bullets[i].hits(bullets[i], enemies[j])) {
          enemies.splice(j, 1);
          if (PlayerOneTurn === true) {
            playerOneScore += 100;
          } else {
            playerTwoScore += 100;
          }
          level++;
        }
      }
      if (bullets[i].y <= 0) {
        bullets.splice(i, 1);
      }
    }
    if (enemies.length <= 0) {
      drawEnemies(1);
      enemySpeed++;
    }
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].move(enemySpeed);
      if (enemies[i].y > 600 && PlayerOneTurn === true) {
        PlayerOneTurn = false;
        enemies = enemies.splice();
        enemySpeed -= 1;
        game();
      } else if (enemies[i].y > 600 && PlayerOneTurn === false) {
        console.log(enemies);
        lost();
      }
    }
    window.requestAnimationFrame(update);
  }

  // Game Over display
  function lost() {
    ctx.fillStyle = 'red';
    ctx.font = '80px Arial';
    ctx.fillText('GAME OVER', 210, 100);
    if (playerOneScore > playerTwoScore) {
      ctx.font = '24px Arial';
      ctx.fillText(`Player One WINS! Score Was: ${playerOneScore}`, 250, 150);
    } else {
      ctx.font = '24px Arial';
      ctx.fillText(`Player Two WINS! Score Was: ${playerTwoScore}`, 250, 150);
    }
  }

  // Key Press functions
  window.addEventListener('keydown', (event) => {
    if (event.keyCode === 37) {
      playerOne.move(-15);
      playerTwo.move(-15);
    }
    if (event.keyCode === 39) {
      playerOne.move(15);
      playerTwo.move(15);
    }
    if (event.keyCode === 32) {
      const bulletOne = new bullet(playerOne.x + 7, playerOne.y, 5, 5);
      const bulletTwo = new bullet(playerTwo.x + 7, playerTwo.y, 5, 5);
      bullets.push(bulletOne);
      bullets.push(bulletTwo);
    }
  });
  update();
}
