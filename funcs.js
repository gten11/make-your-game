

    document.addEventListener("DOMContentLoaded", () => {


    let stopGame = true
    let lives = 3
    let game = document.getElementById("game")
    let myShooter = document.getElementById("myShooter")
    let asteroid1 = document.getElementById("asteroid1")
    let asteroid2 = document.getElementById("asteroid2")
    let asteroid3= document.getElementById("asteroid3")
    let asteroid4 = document.getElementById("asteroid4")
    let gameWhere = game.getBoundingClientRect()
    let gameLeft = gameWhere.left
    let gameHeight = gameWhere.height
    let asteroidWhere1 = asteroid1.getBoundingClientRect()
    let asteroidWhere2 = asteroid2.getBoundingClientRect()
    let asteroidWhere3 = asteroid3.getBoundingClientRect()
    let asteroidWhere4 = asteroid4.getBoundingClientRect()
    let asteroid1Left = asteroidWhere1.left - gameLeft
    let asteroid1Right = asteroidWhere1.right - gameLeft
    let asteroid2Left = asteroidWhere2.left - gameLeft
    let asteroid2Right = asteroidWhere2.right - gameLeft
    let asteroid3Left = asteroidWhere3.left - gameLeft
    let asteroid3Right = asteroidWhere3.right - gameLeft
    let asteroid4Left = asteroidWhere4.left - gameLeft
    let asteroid4Right = asteroidWhere4.right - gameLeft
    let gameWidth = document.getElementById("game").offsetWidth;
    const myShip = document.getElementById("myShip")
    let shooterHeight = document.getElementById("myShooter")?.offsetHeight || 26;
    let collisionShown = false
    let shipMoving = false
    let shooterRemoved = false
    let gameStarted = false

        //obj1 must be smaller than obj2
    function isOverlapping(obj1, obj2) {
        obj1Rect = obj1.getBoundingClientRect()
        obj2Rect = obj2.getBoundingClientRect()

        if (obj1Rect.right < obj2Rect.right &&  obj1Rect.left > obj2Rect.left && obj1Rect.top >= obj2Rect.top && obj1Rect.bottom <= obj2Rect.bottom) {
            return true
        }
        return false
    }

    function startGame() {
        const gameName = document.getElementById("gameName")
        const instr = document.getElementById("instructionStart")
        gameName.style.animation = "fadeOut 3s forwards"
        instr.style.animation = "fadeOut 3s forwards"
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === " ") {
            startGame()
            gameStarted = true
        }
    })

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

    let aliens = []
    let countAliens = 28
    let totalAliens = 0
    let alienId = 1

   const alienInterval = setInterval(() => {
        if (gameStarted && countAliens > totalAliens) {
            let alien = document.createElement("img")
            alien.style.position = "absolute"
            switch (true) {
                case (totalAliens < 7) :
                alien.src = "images/ship1.png"
                alien.style.bottom = "71.5vh"
                alien.style.left = (totalAliens * 5) + "vw"
                break
                case (totalAliens >= 7 && totalAliens < 14): 
                alien.src = "images/ship2.png"
                alien.style.bottom = "78.5vh"
                alien.style.left = ((totalAliens - 7 ) * 5 + 2) + "vw"
                break
                case (totalAliens >= 14 && totalAliens < 21):
                alien.src = "images/ship3.png"
                alien.style.bottom = "85.5vh"
                alien.style.left = ((totalAliens - 14) * 5 + 4) + "vw"
                break
                case (totalAliens >= 21):
                alien.src = "images/ship4.png"
                alien.style.bottom = "92.5vh"
                alien.style.left = ((totalAliens - 21) * 5 + 6) + "vw"
                break
            }
        alien.id = "alien" + alienId
        alien.style.width = "3vw"
        game.appendChild(alien)
        alien.dataset.baseLeft = alien.offsetLeft
        aliens.push(alien)
        totalAliens++
        alienId++
        } else if (countAliens === totalAliens) {
        clearInterval(alienInterval)
        }
    }, 200)

    let aliensOffset = 0
    let aliensDirection = 1

    function moveAliens() {

        let alienWidth = vwToPx(3)
        let maxRight = Math.max(...aliens.map(a => parseFloat(a.dataset.baseLeft) + aliensOffset + alienWidth))
        let minLeft = Math.min(...aliens.map(a => parseFloat(a.dataset.baseLeft) + aliensOffset))
            if (maxRight >= gameWhere.width || minLeft <= 5) {
            aliensDirection *= (-1)
            }
            aliensOffset += aliensDirection * 2;
            for (let alien of aliens) {
            alien.style.transform = `translateX(${aliensOffset}px)`;
            }
    }

    let alienBullets = []
    let bulletsMap = new Map()
    
    function createAlienBullets() {
        for (let i = 0; i < aliens.length; i++) {
            let alienId = aliens[i].id.slice(5)
            if (!bulletsMap.has(alienId)) {
        let name = "alienBullet" + aliens[i].id.slice(5);
        let alienRect = aliens[i].getBoundingClientRect()
        let alienWidth = alienRect.width
        const alienBullet = document.createElement("img")
        alienBullet.id = name
        alienBullet.src = "images/bullet.png"
        alienBullet.style.width = "0.7vw";
        let bulletAlienWidth = vwToPx(0.7);
        alienBullet.style.position = "absolute"
        alienBullet.style.left = alienRect.left + alienWidth/2 - bulletAlienWidth/2 + 'px';
        let bottom = aliens[i].style.bottom;
        alienBullet.style.bottom = bottom;
        alienBullet.style.transform = `translateY(${0}vh)`
        alienBullet.dataset.bottom = bottom.slice(0,-2);
        alienBullet.dataset.offset = 0;
        game.appendChild(alienBullet);
        alienBullets.push(alienBullet)
        bulletsMap.set(alienId, alienBullet)
        }
    }
    }

    let alertLifeShown = false

    function moveAlienBullets() {
        for (let bullet of alienBullets) {
            let bottom = parseFloat(bullet.dataset.bottom)
            let alienBulletOffset = parseFloat(bullet.dataset.offset)
            alienBulletOffset += 1;
            bullet.dataset.offset = alienBulletOffset;
            if (isOverlapping(bullet, myShip) && !alertLifeShown) {
                let id = bullet.id.slice(11)
                bullet.remove()
                alienBullets = alienBullets.filter(b =>  b != bullet)
                bulletsMap.delete(id)
                let myShipLocation = myShip.getBoundingClientRect()
                console.log("ship left", myShipLocation.left)
                console.log("game width", gameWhere.width)
                if (lives === 0) {
                stopGame = true
                let alertGameOver =  document.createElement("div")
                alertGameOver.textContent = "⚠ GAME OVER"
                alertGameOver.style.position = "absolute"
                alertGameOver.style.left = "50%"
                alertGameOver.style.top = "50%"
                alertGameOver.style.transform = "translate(-50%, -50%)"
                alertGameOver.style.color = "red"
                alertGameOver.style.size = "10rem";
                game.appendChild(alertGameOver)
                let explShip = document.createElement("img")
                explShip.src = "images/explosion.png"
                explShip.style.position = "absolute";
                explShip.style.bottom = 0.5 + "vh";
                explShip.style.width = "3vw";
                explShip.style.left = myShipLocation.left -gameLeft + "px";
                console.log(explShip.style.left)
                explShip.style.animation = "fadeOut 3s forwards"
                myShip.remove()
                game.appendChild(explShip)
                } else {
                    lives--
                    let id = bullet.id.slice(11)
                    bullet.remove()
                    alienBullets = alienBullets.filter(b =>  b != bullet)
                    bulletsMap.delete(id)
                    let alertLife =  document.createElement("div")
                    alertLife.textContent = "⚠ Life lost! " + `${lives}` + " lives remain"
                    alertLife.style.position = "absolute"
                    alertLife.style.left = "50%"
                    alertLife.style.top = "50%"
                    alertLife.style.transform = "translate(-50%, -50%)"
                    alertLife.style.color = "red"
                    alertLife.style.size = "10rem";
                    game.appendChild(alertLife)
                    alertLifeShown = true
                    setTimeout(() => {
                    alertLife.remove()
                    alertLifeShown = false;
            }, 1000)
                }
            }
            if (bottom - alienBulletOffset <= 5) {
                let id = bullet.id.slice(11)
                bullet.remove()
                alienBullets = alienBullets.filter(b => b != bullet)
                bulletsMap.delete(id)
            } else {
            bullet.style.transform = `translateY(${alienBulletOffset}vh)`
            }
        }
    }
    

    let bullets = []
    let left = 0;
    let countBullet = 0;
    let direction = 1;
    let shooterCollisionCooldown = false
    let shooterWidth = document.getElementById("myShooter").offsetWidth;
    let bottom = 0;
    
    function moveShooter() {
        let myShooterRect = myShooter.getBoundingClientRect()
        let myShipRect = myShip.getBoundingClientRect()
        if (!(myShooterRect.left <= myShipRect.right && myShooterRect.right >= myShipRect.left) || ((myShooterRect.left <= myShipRect.right && myShooterRect.right >= myShipRect.left) && !shipMoving)) {
        left += direction * 2;
        shooterCollisionCooldown = true
            setTimeout(() => {
                shooterCollisionCooldown = false
            }, 400)
        if (left + shooterWidth >= gameWidth || left <= 0) {
            direction *= (-1);
        }
        myShooter.style.transform = `translateX(${left}px)`;
        } else if (shipMoving) {
            direction *= (-1);
            left += direction * 2;
        if (left + shooterWidth >= gameWidth || left <= 0) {
            direction *= (-1);
        }
        myShooter.style.transform = `translateX(${left}px)`;
        }
    }

    function myBullets() {
        countBullet++
        let name = "myBullet" + countBullet;
        const myBullet = document.createElement("img")
        myBullet.id = name
        myBullet.src = "images/bulletMine.png"
        myBullet.style.width = "0.5vw";
        let bulletShooterWidth = vwToPx(0.5);
        myBullet.style.position = "absolute"
        myBullet.style.left = left + shooterWidth/2 - bulletShooterWidth/2 + 'px';
        bottom = 19 + pxToVh(shooterHeight);
        myBullet.style.bottom = bottom + "vh";
        myBullet.style.transform = `translateY(${0}vh)`
        myBullet.dataset.bottom = bottom;
        myBullet.dataset.offset = 0;
        // myBullet.style.bottom =  19 + pxToVh(shooterHeight) + "vh";
        game.appendChild(myBullet);
        bullets.push(myBullet)
    }

    //I need to make an explosion if my bullets get into an object. 

    function moveBullets() {
        for (let bullet of bullets) {
            let bottom = parseFloat(bullet.dataset.bottom)
            let offset = parseFloat(bullet.dataset.offset)
            offset -= 1;
            bullet.dataset.offset = offset
            for (let alien of aliens) {
                if (isOverlapping(bullet, alien)) {
                let alienLocation = alien.getBoundingClientRect()
                let alienBottom = gameWhere.height - alienLocation.height + (alienLocation.bottom - gameWhere.top);
                alien.remove()
                aliens.filter(a => a != alien)
                let expl = document.createElement("img")
                expl.src = "images/explosion.png"
                expl.style.position = "absolute";
                expl.style.bottom = alienBottom + "px";
                expl.style.width = "3vw";
                expl.style.left = alienLocation.left -gameLeft + "px";
                expl.style.animation = "fadeOut 3s forwards"
                game.appendChild(expl)
                }
            }
            if (bottom - offset >= 97) {
                bullet.remove()
            } else {
            bullet.style.transform = `translateY(${offset}vh)`
            // bullet.style.bottom = bottom + 'vh';
            }
        }
    }

    let movingRight = false;
    let movingLeft = false;

    document.addEventListener("keydown", (event) => {
        if (!collisionShown && event.key === "ArrowLeft") {
            movingLeft = true;
            shipMoving = true;
        } else if (!collisionShown && event.key === "ArrowRight") {
            movingRight = true;
            shipMoving = true;
        }
    })

    document.addEventListener("keyup", (event) => {
        shipMoving = false
        if (event.key === "ArrowLeft") {
            movingLeft = false;
        } else if (event.key === "ArrowRight") {
            movingRight = false;
        }
    })

    const myShipWidth = myShip.offsetWidth;
    let startPosition = 0 + gameWidth / 2;
    let leftMostPosition = 0 + myShipWidth/2;
  

    function moveShip() {
        let left = parseInt(myShip.style.left || startPosition,10)
        let myShooterRect = myShooter.getBoundingClientRect()
        let myShipRect = myShip.getBoundingClientRect()
        let buffer = myShipWidth/2 - 5
        let isOverlapping = !(myShooterRect.left - buffer >= myShipRect.right || myShooterRect.right <= myShipRect.left - buffer);
        if (isOverlapping && !collisionShown && shipMoving && !shooterRemoved && shootingBullets) {
            let alertCollision =  document.createElement("div")
            alertCollision.textContent = "⚠ Collision imminent!"
            alertCollision.style.position = "absolute"
            alertCollision.style.left = "50%"
            alertCollision.style.top = "50%"
            alertCollision.style.transform = "translate(-50%, -50%)"
            alertCollision.style.color = "red"
            alertCollision.style.size = "10rem";
            game.appendChild(alertCollision)
            collisionShown = true
            setTimeout(() => {
                alertCollision.remove()
                collisionShown = false;
            }, 1000)
        }
        if (!collisionShown) {
        if (movingLeft) {
            left -= 4;
        } else if (movingRight) {
            left += 4;
        } 
            
        }
        left = Math.max(leftMostPosition, Math.min(left, gameWidth - myShipWidth / 2))
        myShip.style.left = left + 'px';
    }

    moveShip()
   
    const shipBulletWidth = 0.5
    let shipBullets = []
    let shootingBullets = false
    var intervalId;

    document.addEventListener("keydown", (event) => {
        if (event.key === "s") {
            if (!intervalId) {
            createBullets()
            intervalId = setInterval(createBullets, 200)
            }
            if (!shootingBullets) {
            shootBullet()
            shootingBullets = true
            }
        } 
    })

    document.addEventListener("keyup", (event) => {
        if (event.key === "s") {
            clearInterval(intervalId);
            intervalId = null;
        }
    })

    function createBullets() {
        if (!collisionShown) {
        let shipRect = myShip.getBoundingClientRect();
        let shipLeft = shipRect.left;
        let shipRight = shipRect.right;
        let shipHeight = shipRect.height;
        const bulletStart = shipLeft + shipRect.width/2 - gameLeft - vwToPx(shipBulletWidth)/2;
        const shipBullet = document.createElement("img")
        shipBullet.src = "images/fire.png"
        shipBullet.style.width = "0.5vw";
        const bottomBullet = 0.5 + pxToVh(shipHeight); 
        shipBullet.style.bottom = bottomBullet + "vh";
        shipBullet.style.position = "absolute";
        shipBullet.style.left = bulletStart + "px";
        shipBullets.push(shipBullet)
        game.appendChild(shipBullet)
        }
    }      
    
    function shootBullet() {
       
        for (let bullet of shipBullets) {
            let bulletRect = bullet.getBoundingClientRect()
            let bulletHeight = bulletRect.height
            let bulletBottomstr = bullet.style.bottom.slice(0,-2)
            let bulletBottomNum = vhToPx(parseFloat(bulletBottomstr, 10))
            let bulletLeft = bulletRect.left + vwToPx(1)/2 - gameLeft
            for (let alien of aliens) {
                if (isOverlapping(bullet, alien)) {
                let alienLocation = alien.getBoundingClientRect()
                let alienBottom = gameWhere.height - alienLocation.height + (alienLocation.bottom - gameWhere.top);
                alien.remove()
                aliens.filter(a => a != alien)
                let expl = document.createElement("img")
                expl.src = "images/explosion.png"
                expl.style.position = "absolute";
                expl.style.bottom = alienBottom + "px";
                expl.style.width = "3vw";
                expl.style.left = alienLocation.left -gameLeft + "px";
                expl.style.animation = "fadeOut 3s forwards"
                game.appendChild(expl)
                }
            }
            if (isOverlapping(bullet, myShooter)) {
                let myShooterLocation = myShooter.getBoundingClientRect()
                shooterRemoved = true
                myShooter.remove()
                let expl = document.createElement("img")
                expl.src = "images/explosion.png"
                expl.style.position = "absolute";
                expl.style.bottom = "19vh";
                expl.style.width = "5vw";
                expl.style.left = myShooterLocation.left -gameLeft + "px";
                expl.style.animation = "fadeOut 3s forwards"
                game.appendChild(expl)
            } else if (!(bulletLeft > asteroid1Left && bulletLeft < asteroid1Right) && !(bulletLeft > asteroid2Left && bulletLeft < asteroid2Right) && !(bulletLeft > asteroid3Left && bulletLeft < asteroid3Right) && !(bulletLeft > asteroid4Left && bulletLeft < asteroid4Right)) {
                if (bulletBottomNum + bulletHeight + 5 < gameHeight) {
                    bulletBottomNum += 10;
                    bullet.style.bottom = pxToVh(bulletBottomNum) + "vh";
                } else {
                    shipBullets = shipBullets.filter(b => b !== bullet)
                    bullet.remove()
                }
            } else {
                  if (bulletBottomNum + bulletHeight + 5 < vhToPx(30)) {
                    bulletBottomNum += 10;
                    bullet.style.bottom = pxToVh(bulletBottomNum) + "vh";
                } else {
                    bullet.remove()
                    shipBullets = shipBullets.filter(b => b !== bullet)
                }
            }
        }
    }


     function gameLoop() {
        if (stopGame) {
            return
        }
        if (!shooterRemoved) {
        moveShooter()
        moveShip()
        const bulletWidth = vwToPx(0.5)
        let bulletLeft = left + shooterWidth/2 - bulletWidth/2
        if (left % 15 === 0 && !((bulletLeft + bulletWidth/2> asteroid1Left && bulletLeft + bulletWidth/2 < asteroid1Right) || (bulletLeft + bulletWidth/2 > asteroid2Left && bulletLeft + bulletWidth/2 < asteroid2Right) || (bulletLeft + bulletWidth/2 > asteroid3Left && bulletLeft + bulletWidth/2 < asteroid3Right) || (bulletLeft + bulletWidth/2> asteroid4Left && bulletLeft + bulletWidth/2 < asteroid4Right)) ) {
            myBullets()
        }
        }
        moveAliens()
        createAlienBullets()
        moveAlienBullets()
        moveBullets()
        shootBullet()
        requestAnimationFrame(gameLoop)
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === " ") {
            stopGame = !stopGame;
            if (!stopGame) {
            gameLoop()
        }
        }
    })
    
    gameLoop()
    
 })