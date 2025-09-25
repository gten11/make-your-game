document.addEventListener("DOMContentLoaded", () => {
  let stopGame = true;
  let lastTime = null
  let firstStart = true
  let gameOver = false;
  let restarted = false;
  let shooterLives = 10;
  let lives = 4;
  let score = 0;
  let alienWaves = 3;
  let game = document.getElementById("game");
  let myShooter = document.getElementById("myShooter");
  let myShip = document.getElementById("myShip");
  let asteroid1 = document.getElementById("asteroid1");
  let asteroid2 = document.getElementById("asteroid2");
  let asteroid3 = document.getElementById("asteroid3");
  let asteroid4 = document.getElementById("asteroid4");
  let gameWhere = game.getBoundingClientRect();
  let gameLeft = gameWhere.left;
  let gameHeight = gameWhere.height;
  let asteroidWhere1 = asteroid1.getBoundingClientRect();
  let asteroidWhere2 = asteroid2.getBoundingClientRect();
  let asteroidWhere3 = asteroid3.getBoundingClientRect();
  let asteroidWhere4 = asteroid4.getBoundingClientRect();
  let asteroid1Left = asteroidWhere1.left - gameLeft;
  let asteroid1Right = asteroidWhere1.right - gameLeft;
  let asteroid2Left = asteroidWhere2.left - gameLeft;
  let asteroid2Right = asteroidWhere2.right - gameLeft;
  let asteroid3Left = asteroidWhere3.left - gameLeft;
  let asteroid3Right = asteroidWhere3.right - gameLeft;
  let asteroid4Left = asteroidWhere4.left - gameLeft;
  let asteroid4Right = asteroidWhere4.right - gameLeft;
  let asteroid1Top = asteroidWhere1.bottom - asteroidWhere1.height;
  let asteroid2Top = asteroidWhere2.bottom - asteroidWhere2.height;
  let asteroid3Top = asteroidWhere3.bottom - asteroidWhere3.height;
  let asteroid4Top = asteroidWhere4.bottom - asteroidWhere4.height;
  let gameWidth = document.getElementById("game").offsetWidth;
  let shooterHeight = document.getElementById("myShooter")?.offsetHeight || 26;
  let collisionShown = false;
  let shipMoving = false;
  let shooterRemoved = false;
  let gameStarted = false;

  let alertCollision = document.createElement("div");
  alertCollision.classList.add("alerts");
  alertCollision.textContent = "⚠ Collision imminent!";
  alertCollision.style.position = "absolute";
  alertCollision.style.left = "50%";
  alertCollision.style.bottom = "30vh";
  alertCollision.style.transform = "translate(-50%, -50%)";
  alertCollision.style.color = "red";
  alertCollision.style.fontSize = "1em";
  alertCollision.style.zIndex = "940";
  alertCollision.style.display = "none";
  game.appendChild(alertCollision);

  let timerDuration = 60;
  let timerRemaining = timerDuration;
  // let lastTime = performance.now();

  function startTimer() {
    timerRemaining = timerDuration;
    lastTime = performance.now();
  }

  function updateTimer(now) {
    if (lastTime === undefined) lastTime = now;
    const delta = (now - lastTime) / 1000;
    lastTime = now;
    timerRemaining -= delta;
    if (timerRemaining <= 0) {
      timerRemaining = 0;
      if (lives > 0) {
        let alertGameOver = document.createElement("div");
        alertGameOver.classList.add("alerts");
        alertGameOver.style.display = "block";
        alertGameOver.id = "alertGameOver";
        alertGameOver.textContent = `YOU WON\nTotal score is ${score}`;
        gameOver = true;
        game.appendChild(alertGameOver);
      } else {
        let alertGameOver = document.createElement("div");
        alertGameOver.classList.add("alerts");
        alertGameOver.style.display = "block";
        alertGameOver.id = "alertGameOver";
        alertGameOver.textContent = `GAME OVER\nTotal score is ${score}`;
        gameOver = true;
        game.appendChild(alertGameOver);
      }
      stopGame = true;
    }
  }

  let hud = document.createElement("div");
  hud.id = "hud";
  game.appendChild(hud);

  function updateHud() {
    hud.textContent = `Total score ${score}\nAlien waves remain: ${alienWaves}\nTotal lives: ${lives}\nShooter lives ${Math.max(
      shooterLives,
      0
    )}\nTime: ${Math.ceil(timerRemaining)}`;
  }

  let popup = document.createElement("div");
  popup.id = "popup";
  game.appendChild(popup);

  let restartBtn = document.createElement("div");
  restartBtn.classList.add("popup-buttons");
  restartBtn.id = "button";
  restartBtn.textContent = "Restart";
  restartBtn.addEventListener("click", () => {
    restart();
  });
  popup.appendChild(restartBtn);

  let continueBtn = document.createElement("div");
  continueBtn.classList.add("popup-buttons");
  continueBtn.id = "continueBtn";
  continueBtn.textContent = "Pause";
  continueBtn.addEventListener("click", () => {
    if (!stopGame) {
      timerRemaining
      stopGame = true;
      continueBtn.textContent = "Continue";
    } else {
      stopGame = false;
      continueBtn.textContent = "Pause";
      lastTime = performance.now();
      startGame();
    }
  });
  popup.appendChild(continueBtn);

  function restart() {
    stopGame = true;
    lastTime = null;
    timerRemaining = timerDuration
    gameOver = false;
    shipMoving = false;
    shooterRemoved = false;
    collisionShown = false;
    shooterLives = 10;
    lives = 4;
    score = 0;
    alienWaves = 3;
    document
      .querySelectorAll(".aliens, .alienBullets, .shipBullets, .myBullets")
      .forEach((el) => el.remove());
    document
      .querySelectorAll(".alerts")
      .forEach((al) => (al.style.display = "none"));
    aliens = [];
    countAliens = 28;
    totalAliens = 0;
    alienId = 1;
    aliensMap = new Map();
    aliensOffset = 0;
    aliensDirection = 1;
    alienBullets = [];
    bulletsMap = new Map();
    countBullet = 0;
    alertLifeShown = false;
    bullets = [];
    left = 0;
    direction = 1;
    shooterCollisionCooldown = false;
    collisionShown = false;
    bottom = 0;
    movingRight = false;
    movingLeft = false;
    startPosition = 0 + gameWidth / 2;
    leftMostPosition = 0 + myShipWidth / 2;
    shipBullets = [];
    shootingBullets = false;
    restarted = true;
    myShipLeft = 0 + gameWidth / 2;
    myShip.style.display = "block";
    myShooter.style.display = "block";
    updateHud();
    resetIntro();
  }

  //obj1 must be smaller than obj2
  function isOverlapping(obj1, obj2) {
    obj1Rect = obj1.getBoundingClientRect();
    obj2Rect = obj2.getBoundingClientRect();

    if (
      obj1Rect.right < obj2Rect.right &&
      obj1Rect.left > obj2Rect.left &&
      obj1Rect.top >= obj2Rect.top &&
      obj1Rect.bottom <= obj2Rect.bottom
    ) {
      return true;
    }
    return false;
  }

  function resetIntro() {
    const gameName = document.getElementById("gameName");
    const instr = document.getElementById("instructionStart");
    gameName.style.animation = "none";
    instr.style.animation = "none";
    void gameName.offsetWidth;
    void instr.offsetWidth;
    gameName.style.animation = "";
    instr.style.animation = "";
  }

  function startGame() {
    const gameName = document.getElementById("gameName");
    const instr = document.getElementById("instructionStart");
    gameName.style.animation = "fadeOut 3s forwards";
    instr.style.animation = "fadeOut 3s forwards";
    gameStarted = true;
    if (firstStart) {
      firstStart = false
      timerRemaining = timerDuration;
      lastTime = performance.now();
      startTimer();
    } 
    sendAliens();
    requestAnimationFrame(gameLoop);
  }

  function vwToPx(vw) {
    return (vw / 100) * window.innerWidth;
  }

  function pxToVw(px) {
    return (px / window.innerWidth) * 100;
  }

  function pxToVh(px) {
    return (px / window.innerHeight) * 100;
  }

  function vhToPx(vh) {
    return (vh / 100) * window.innerHeight;
  }

  let aliens = [];
  let countAliens = 28;
  let totalAliens = 0;
  let alienId = 1;
  let aliensMap = new Map();

  function sendAliens() {
    if (alienWaves > 0 && totalAliens === 0 && !stopGame) {
      alienWaves--;

      const alienInterval = setInterval(() => {
        if (gameStarted && !stopGame && countAliens > totalAliens) {
          let alien = document.createElement("img");
          alien.classList.add("aliens");
          alien.style.position = "absolute";
          switch (true) {
            case totalAliens < 7:
              alien.src = "images/ship1.png";
              alien.style.bottom = "71.5vh";
              alien.style.left = totalAliens * 5 + "vw";
              break;
            case totalAliens >= 7 && totalAliens < 14:
              alien.src = "images/ship2.png";
              alien.style.bottom = "78.5vh";
              alien.style.left = (totalAliens - 7) * 5 + 2 + "vw";
              break;
            case totalAliens >= 14 && totalAliens < 21:
              alien.src = "images/ship3.png";
              alien.style.bottom = "85.5vh";
              alien.style.left = (totalAliens - 14) * 5 + 4 + "vw";
              break;
            case totalAliens >= 21:
              alien.src = "images/ship4.png";
              alien.style.bottom = "92.5vh";
              alien.style.left = (totalAliens - 21) * 5 + 6 + "vw";
              break;
          }
          let alienIdStr = "alien" + alienId;
          alien.id = alienIdStr;
          aliensMap.set(alienIdStr, true);
          alien.style.width = "3vw";
          game.appendChild(alien);
          alien.dataset.baseLeft = alien.offsetLeft;
          alien.style.transform = `translateX(${aliensOffset}px)`;
          aliens.push(alien);
          totalAliens++;
          alienId++;
        } else if (countAliens === totalAliens || restarted) {
          clearInterval(alienInterval);
        }
      }, 200);
    } else if (totalAliens === 0 && alienWaves === 0 && !stopGame) {
      stopGame = true;
      let alertGameOver = document.createElement("div");
      alertGameOver.classList.add("alerts");
      alertGameOver.style.display = "block";
      alertGameOver.id = "alertGameOver";
      alertGameOver.textContent = `YOU WON\nTotal score is ${score}`;
      gameOver = true;
      game.appendChild(alertGameOver);
    }
  }

  let aliensOffset = 0;
  let aliensDirection = 1;
  let alienWidth = vwToPx(3);
  let alienDirectionFlipped = false;

  function moveAliens() {
    let maxRight = Math.max(
      ...aliens.map(
        (a) => parseFloat(a.dataset.baseLeft) + aliensOffset + alienWidth
      )
    );
    let minLeft = Math.min(
      ...aliens.map((a) => parseFloat(a.dataset.baseLeft) + aliensOffset)
    );
    if (
      (maxRight >= gameWhere.width - 10 || minLeft <= 10) &&
      !alienDirectionFlipped
    ) {
      aliensDirection *= -1;
      alienDirectionFlipped = true;
      setTimeout(() => {
        alienDirectionFlipped = false;
      }, 1000);
    }
    aliensOffset += aliensDirection * 2;
    for (let alien of aliens) {
      alien.style.transform = `translateX(${aliensOffset}px)`;
    }
  }

  let alienBullets = [];
  let bulletsMap = new Map();

  function createAlienBullets() {
    for (let i = 0; i < aliens.length; i++) {
      let alienId = aliens[i].id.slice(5);
      if (!bulletsMap.has(alienId) && aliensMap.get(aliens[i].id) === true) {
        let name = "alienBullet" + aliens[i].id.slice(5);
        let alienRect = aliens[i].getBoundingClientRect();
        let alienWidth = alienRect.width;
        const alienBullet = document.createElement("img");
        alienBullet.classList.add("alienBullets");
        alienBullet.id = name;
        alienBullet.src = "images/bullet.png";
        alienBullet.style.width = "0.5vw";
        let bulletAlienWidth = vwToPx(0.5);
        alienBullet.style.position = "absolute";
        alienBullet.style.left =
          alienRect.left + alienWidth / 2 - bulletAlienWidth / 2 + "px";
        let bottom = aliens[i].style.bottom;
        alienBullet.style.bottom = bottom;
        alienBullet.style.transform = `translateY(${0}vh)`;
        alienBullet.dataset.bottom = bottom.slice(0, -2);
        alienBullet.dataset.offset = 0;
        game.appendChild(alienBullet);
        alienBullets.push(alienBullet);
        bulletsMap.set(alienId, alienBullet);
      }
    }
  }

  let alertLifeShown = false;

  function moveAlienBullets() {
    for (let bullet of alienBullets) {
      let bottom = parseFloat(bullet.dataset.bottom);
      let alienBulletOffset = parseFloat(bullet.dataset.offset);
      alienBulletOffset += 1.2;
      bullet.dataset.offset = alienBulletOffset;
      if (isOverlapping(bullet, myShip) && !alertLifeShown) {
        let id = bullet.id.slice(11);
        bullet.remove();
        alienBullets = alienBullets.filter((b) => b != bullet);
        bulletsMap.delete(id);
        let myShipLocation = myShip.getBoundingClientRect();
        if (lives === 0) {
          stopGame = true;
          let alertGameOver = document.createElement("div");
          alertGameOver.classList.add("alerts");
          alertGameOver.style.display = "block";
          alertGameOver.id = "alertGameOver";
          alertGameOver.textContent = `GAME OVER\nTotal score is ${score}`;
          gameOver = true;
          game.appendChild(alertGameOver);
          let explShip = document.createElement("img");
          explShip.src = "images/explosion.png";
          explShip.style.position = "absolute";
          explShip.style.bottom = 0.5 + "vh";
          explShip.style.width = "3vw";
          explShip.style.left = myShipLocation.left - gameLeft + "px";
          explShip.style.animation = "fadeOut 3s forwards";
          myShip.style.display = "none";
          game.appendChild(explShip);
        } else {
          let id = bullet.id.slice(11);
          bullet.remove();
          alienBullets = alienBullets.filter((b) => b != bullet);
          bulletsMap.delete(id);
          let alertLife = document.createElement("div");
          lives--;
          alertLife.textContent =
            "⚠ Life lost! " + `${lives}` + " lives remain";
          score -= 30;
          alertLife.style.position = "absolute";
          alertLife.style.left = "50%";
          alertLife.style.bottom = "35vh";
          alertLife.style.transform = "translate(-50%, -50%)";
          alertLife.style.color = "red";
          alertLife.style.fontSize = "2em";
          alertLife.style.zIndex = "930";
          game.appendChild(alertLife);
          alertLifeShown = true;
          setTimeout(() => {
            alertLife.remove();
            alertLifeShown = false;
          }, 1000);
        }
      }
      if (isOverlapping(bullet, myShooter)) {
        let id = bullet.id.slice(11);
        bullet.remove();
        alienBullets = alienBullets.filter((b) => b != bullet);
        bulletsMap.delete(id);
        let myShooterLocation = myShooter.getBoundingClientRect();
        if (shooterLives === 0) {
          shooterRemoved = true;
          myShooter.style.display = "none";
          score -= 20;
          let expl = document.createElement("img");
          expl.src = "images/explosion.png";
          expl.style.position = "absolute";
          expl.style.bottom = "19vh";
          expl.style.width = "5vw";
          expl.style.left = myShooterLocation.left - gameLeft + "px";
          expl.style.animation = "fadeOut 3s forwards";
          game.appendChild(expl);
        } else {
          shooterLives--;
          score -= 2;
        }
      }
      let bulletRect = bullet.getBoundingClientRect();
      let bulletLeft = bulletRect.left;
      let bulletWidth = bulletRect.width;
      let bulletBottom = bulletRect.bottom;
      if (
        (bulletLeft - bulletWidth > asteroid1Left &&
          bulletLeft - bulletWidth < asteroid1Right &&
          bulletBottom <= asteroid1Top) ||
        (bulletLeft - bulletWidth > asteroid2Left &&
          bulletLeft - bulletWidth < asteroid2Right &&
          bulletBottom <= asteroid2Top) ||
        (bulletLeft - bulletWidth > asteroid3Left &&
          bulletLeft - bulletWidth < asteroid3Right &&
          bulletBottom <= asteroid3Top) ||
        (bulletLeft - bulletWidth > asteroid4Left &&
          bulletLeft - bulletWidth < asteroid4Right &&
          bulletBottom <= asteroid4Top)
      ) {
        let id = bullet.id.slice(11);
        bullet.remove();
        alienBullets = alienBullets.filter((b) => b != bullet);
        bulletsMap.delete(id);
      }
      if (bottom - alienBulletOffset <= 5) {
        let id = bullet.id.slice(11);
        bullet.remove();
        alienBullets = alienBullets.filter((b) => b != bullet);
        bulletsMap.delete(id);
      } else {
        bullet.style.transform = `translateY(${alienBulletOffset}vh)`;
      }
    }
  }

  let bullets = [];
  let left = 0;
  let countBullet = 0;
  let direction = 1;
  let shooterCollisionCooldown = false;
  let shooterWidth = document.getElementById("myShooter").offsetWidth;
  let bottom = 0;

  function moveShooter() {
    let myShooterRect = myShooter.getBoundingClientRect();
    let myShipRect = myShip.getBoundingClientRect();
    if (
      !(
        myShooterRect.left <= myShipRect.right &&
        myShooterRect.right >= myShipRect.left
      ) ||
      (myShooterRect.left <= myShipRect.right &&
        myShooterRect.right >= myShipRect.left &&
        !shipMoving)
    ) {
      left += direction * 2;
      if (left + shooterWidth >= gameWidth || left <= 0) {
        direction *= -1;
      }
      myShooter.style.transform = `translateX(${left}px)`;
    } else if (shipMoving && !shooterCollisionCooldown) {
      direction *= -1;
      left += direction * 2;
      shooterCollisionCooldown = true;
      setTimeout(() => {
        shooterCollisionCooldown = false;
      }, 400);
      if (left + shooterWidth >= gameWidth || left <= 0) {
        direction *= -1;
      }
      myShooter.style.transform = `translateX(${left}px)`;
    }
  }

  function myBullets() {
    countBullet++;
    let name = "myBullet" + countBullet;
    const myBullet = document.createElement("img");
    myBullet.classList.add("myBullets");
    myBullet.id = name;
    myBullet.src = "images/bulletMine.png";
    myBullet.style.width = "0.5vw";
    let bulletShooterWidth = vwToPx(0.5);
    myBullet.style.position = "absolute";
    myBullet.style.left =
      left + shooterWidth / 2 - bulletShooterWidth / 2 + "px";
    bottom = 19 + pxToVh(shooterHeight);
    myBullet.style.bottom = bottom + "vh";
    myBullet.style.transform = `translateY(${0}vh)`;
    myBullet.dataset.bottom = bottom;
    myBullet.dataset.offset = 0;
    game.appendChild(myBullet);
    bullets.push(myBullet);
  }

  function moveBullets() {
    for (let bullet of bullets) {
      let bottom = parseFloat(bullet.dataset.bottom);
      let offset = parseFloat(bullet.dataset.offset);
      offset -= 1;
      bullet.dataset.offset = offset;
      for (let alien of aliens) {
        if (isOverlapping(bullet, alien)) {
          let alienLocation = alien.getBoundingClientRect();
          let alienBottom =
            gameWhere.height -
            alienLocation.height +
            (alienLocation.bottom - gameWhere.top);
          let alienIdStr = alien.id;
          let alienId = alienIdStr.slice(5);
          aliensMap.set(alienIdStr, false);
          bulletsMap.delete(alienId);
          alienBullets.filter((b) => b.id != "alienBullet" + alienId);
          aliens.filter((a) => a != alien);
          alien.remove();
          score += 10;
          totalAliens--;
          if (totalAliens === 0) {
            sendAliens();
          }
          let expl = document.createElement("img");
          expl.src = "images/explosion.png";
          expl.style.position = "absolute";
          expl.style.bottom = alienBottom + "px";
          expl.style.width = "3vw";
          expl.style.left = alienLocation.left - gameLeft + "px";
          expl.style.animation = "fadeOut 3s forwards";
          game.appendChild(expl);
        }
      }
      if (bottom - offset >= 97) {
        bullet.remove();
      } else {
        bullet.style.transform = `translateY(${offset}vh)`;
      }
    }
  }

  let movingRight = false;
  let movingLeft = false;

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      movingLeft = true;
      shipMoving = true;
    } else if (event.key === "ArrowRight") {
      movingRight = true;
      shipMoving = true;
    }
  });

  document.addEventListener("keyup", (event) => {
    shipMoving = false;
    if (event.key === "ArrowLeft") {
      movingLeft = false;
    } else if (event.key === "ArrowRight") {
      movingRight = false;
    }
  });

  const myShipWidth = myShip.offsetWidth;
  let leftMostPosition = 0;
  let myShipLeft = gameWidth / 2;

  function moveShip() {
    let myShooterRect = myShooter.getBoundingClientRect();
    let myShipRect = myShip.getBoundingClientRect();
    let buffer = myShipWidth / 2 - 5;
    let shooterOverlapping = !(
      myShooterRect.left - buffer >= myShipRect.right ||
      myShooterRect.right <= myShipRect.left - buffer
    );
    if (
      shooterOverlapping &&
      !collisionShown &&
      shipMoving &&
      !shooterRemoved &&
      shootingBullets
    ) {
      alertCollision.style.display = "block";
      collisionShown = true;
      setTimeout(() => {
        alertCollision.style.display = "none";
        collisionShown = false;
      }, 1000);
    }
    if (movingLeft) {
      myShipLeft -= 4;
    } else if (movingRight) {
      myShipLeft += 4;
    }
    myShipLeft = Math.max(
      leftMostPosition,
      Math.min(myShipLeft, gameWidth - myShipWidth)
    );
    myShip.style.transform = `translateX(${myShipLeft}px)`;
  }

  moveShip();

  const shipBulletWidth = 0.5;
  let shipBullets = [];
  let shootingBullets = false;
  var intervalId;

  document.addEventListener("keydown", (event) => {
    if (event.key === "s") {
      if (!intervalId && !restarted && !stopGame) {
        createBullets();
        intervalId = setInterval(createBullets, 200);
      } else if (restarted) {
        clearInterval(intervalId);
        intervalId = null;
        shootingBullets = false;
        createBullets();
      }
      if (!shootingBullets) {
        shootBullet();
        shootingBullets = true;
      }
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "s") {
      clearInterval(intervalId);
      intervalId = null;
      shootingBullets = false;
    }
  });

  function createBullets() {
    if (!collisionShown) {
      let shipRect = myShip.getBoundingClientRect();
      let shipLeft = shipRect.left;
      let shipRight = shipRect.right;
      let shipHeight = shipRect.height;
      const bulletStart =
        shipLeft + shipRect.width / 2 - gameLeft - vwToPx(shipBulletWidth) / 2;
      const shipBullet = document.createElement("img");
      shipBullet.classList.add("shipBullets");
      shipBullet.src = "images/fire.png";
      shipBullet.style.width = "0.5vw";
      const bottomBullet = 0.5 + pxToVh(shipHeight);
      shipBullet.style.bottom = bottomBullet + "vh";
      shipBullet.style.position = "absolute";
      shipBullet.style.left = bulletStart + "px";
      shipBullets.push(shipBullet);
      game.appendChild(shipBullet);
    }
  }

  function shootBullet() {
    for (let bullet of shipBullets) {
      let bulletRect = bullet.getBoundingClientRect();
      let bulletHeight = bulletRect.height;
      let bulletBottomstr = bullet.style.bottom.slice(0, -2);
      let bulletBottomNum = vhToPx(parseFloat(bulletBottomstr, 10));
      let bulletLeft = bulletRect.left + vwToPx(1) / 2 - gameLeft;
      for (let alien of aliens) {
        if (isOverlapping(bullet, alien)) {
          let alienLocation = alien.getBoundingClientRect();
          let alienBottom =
            gameWhere.height -
            alienLocation.height +
            (alienLocation.bottom - gameWhere.top);
          let id = alien.id.slice(5);
          let bulletOfAlien = bulletsMap.get(id);
          alienBullets = alienBullets.filter((b) => b != bulletOfAlien);
          bulletsMap.delete(id);
          if (bulletOfAlien !== undefined) {
            bulletOfAlien.remove();
          }
          aliensMap.set(alien.id, false);
          aliens.filter((a) => a != alien);
          let expl = document.createElement("img");
          expl.src = "images/explosion.png";
          expl.style.position = "absolute";
          expl.style.bottom = alienBottom + "px";
          expl.style.width = "3vw";
          expl.style.left = alienLocation.left - gameLeft + "px";
          expl.style.animation = "fadeOut 3s forwards";
          alien.remove();
          score += 10;
          totalAliens--;
          if (totalAliens === 0) {
            sendAliens();
          }
          game.appendChild(expl);
        }
      }
      if (isOverlapping(bullet, myShooter)) {
        if (shooterLives <= 0) {
          let myShooterLocation = myShooter.getBoundingClientRect();
          shooterRemoved = true;
          myShooter.style.display = "none";
          score -= 20;
          let expl = document.createElement("img");
          expl.src = "images/explosion.png";
          expl.style.position = "absolute";
          expl.style.bottom = "19vh";
          expl.style.width = "5vw";
          expl.style.left = myShooterLocation.left - gameLeft + "px";
          expl.style.animation = "fadeOut 3s forwards";
          game.appendChild(expl);
        } else {
          shooterLives -= 2;
        }
      } else if (
        !(bulletLeft > asteroid1Left && bulletLeft < asteroid1Right) &&
        !(bulletLeft > asteroid2Left && bulletLeft < asteroid2Right) &&
        !(bulletLeft > asteroid3Left && bulletLeft < asteroid3Right) &&
        !(bulletLeft > asteroid4Left && bulletLeft < asteroid4Right)
      ) {
        if (bulletBottomNum + bulletHeight + 5 < gameHeight) {
          bulletBottomNum += 10;
          bullet.style.bottom = pxToVh(bulletBottomNum) + "vh";
        } else {
          shipBullets = shipBullets.filter((b) => b !== bullet);
          bullet.remove();
        }
      } else {
        if (bulletBottomNum + bulletHeight + 5 < vhToPx(30)) {
          bulletBottomNum += 10;
          bullet.style.bottom = pxToVh(bulletBottomNum) + "vh";
        } else {
          bullet.remove();
          shipBullets = shipBullets.filter((b) => b !== bullet);
        }
      }
    }
  }

  function gameLoop(now) {
    if (stopGame) {
      return;
    }
    updateTimer(now);
    moveShip();
    moveAliens();
    createAlienBullets();
    moveAlienBullets();
    moveBullets();
    shootBullet();
    if (!shooterRemoved) {
      moveShooter();
      const bulletWidth = vwToPx(0.5);
      let bulletLeft = left + shooterWidth / 2 - bulletWidth / 2;
      if (
        left % 15 === 0 &&
        !(
          (bulletLeft + bulletWidth / 2 > asteroid1Left &&
            bulletLeft + bulletWidth / 2 < asteroid1Right) ||
          (bulletLeft + bulletWidth / 2 > asteroid2Left &&
            bulletLeft + bulletWidth / 2 < asteroid2Right) ||
          (bulletLeft + bulletWidth / 2 > asteroid3Left &&
            bulletLeft + bulletWidth / 2 < asteroid3Right) ||
          (bulletLeft + bulletWidth / 2 > asteroid4Left &&
            bulletLeft + bulletWidth / 2 < asteroid4Right)
        )
      ) {
        myBullets();
      }
    }
    updateHud();
    requestAnimationFrame(gameLoop);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === " " && !gameOver) {
      stopGame = !stopGame;
      if (!stopGame) {
        continueBtn.textContent = "Pause";
        lastTime = performance.now();
        startGame();
      } else {
        continueBtn.textContent = "Continue";
      }
    }
  });
});
