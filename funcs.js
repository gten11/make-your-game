

    document.addEventListener("DOMContentLoaded", () => {


    let stopGame = true
    const game = document.getElementById("game")
    const myShooter = document.getElementById("myShooter")
    const asteroid1 = document.getElementById("asteroid1")
    const asteroid2 = document.getElementById("asteroid2")
    const asteroid3= document.getElementById("asteroid3")
    const asteroid4 = document.getElementById("asteroid4")
    const gameWhere = game.getBoundingClientRect()
    const gameLeft = gameWhere.left
    const gameHeight = gameWhere.height
    const asteroidWhere1 = asteroid1.getBoundingClientRect()
    const asteroidWhere2 = asteroid2.getBoundingClientRect()
    const asteroidWhere3 = asteroid3.getBoundingClientRect()
    const asteroidWhere4 = asteroid4.getBoundingClientRect()
    const asteroid1Left = asteroidWhere1.left - gameLeft
    const asteroid1Right = asteroidWhere1.right - gameLeft
    const asteroid2Left = asteroidWhere2.left - gameLeft
    const asteroid2Right = asteroidWhere2.right - gameLeft
    const asteroid3Left = asteroidWhere3.left - gameLeft
    const asteroid3Right = asteroidWhere3.right - gameLeft
    const asteroid4Left = asteroidWhere4.left - gameLeft
    const asteroid4Right = asteroidWhere4.right - gameLeft
    const gameWidth = document.getElementById("game").offsetWidth;
    const myShip = document.getElementById("myShip")
    let collisionShown = false
    let shipMoving = false
    let shooterRemoved = false

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

   
    let bullets = []
    let left = 0;
    let countBullet = 0;
    let direction = 1;
    let shooterCollisionCooldown = false
    const shooterWidth = document.getElementById("myShooter").offsetWidth;
    
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
        myShooter.style.left = left + 'px'
    
        } else if (shipMoving) {
            direction *= (-1);
            left += direction * 2;
        if (left + shooterWidth >= gameWidth || left <= 0) {
            direction *= (-1);
        }
        myShooter.style.left = left + 'px'
        }
    }

    function myBullets() {
        countBullet++
        let name = "myBullet" + countBullet;
        const myBullet = document.createElement("img")
        const shooterHeight = document.getElementById("myShooter")?.offsetHeight || 50;
        myBullet.id = name
        myBullet.src = "images/bulletMine.png"
        myBullet.style.width = "0.5vw";
        let bulletShooterWidth = vwToPx(0.5);
        myBullet.style.position = "absolute"
        myBullet.style.left = left + shooterWidth/2 - bulletShooterWidth/2 + 'px';
        myBullet.style.bottom =  19 + pxToVh(shooterHeight) + "vh";
        game.appendChild(myBullet);
        bullets.push(myBullet)
    }

    //I need to make an explosion if my bullets get into an object. 

    function moveBullets() {
        for (let bullet of bullets) {
            let bottomStr = bullet.style.bottom
            if (bottomStr.endsWith("vh")) {
            bottomStr = bullet.style.bottom.slice(0,-2)
            } else {
                continue
            }
            let bottom = parseFloat(bottomStr, 10)
            bottom += 2
            if (bottom >= 88) {
                bullet.remove()
            } else {
            bullet.style.bottom = bottom + 'vh';
            }
        }
    }

    function gameLoop() {
        if (stopGame) {
            return
        }
        if (!shooterRemoved) {
        moveShooter()
        const bulletWidth = vwToPx(0.5)
        let bulletLeft = left + shooterWidth/2 - bulletWidth/2
        if (left % 15 === 0 && !((bulletLeft + bulletWidth/2> asteroid1Left && bulletLeft + bulletWidth/2 < asteroid1Right) || (bulletLeft + bulletWidth/2 > asteroid2Left && bulletLeft + bulletWidth/2 < asteroid2Right) || (bulletLeft + bulletWidth/2 > asteroid3Left && bulletLeft + bulletWidth/2 < asteroid3Right) || (bulletLeft + bulletWidth/2> asteroid4Left && bulletLeft + bulletWidth/2 < asteroid4Right)) ) {
            myBullets()
        }
        }
        moveBullets()
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
        if (isOverlapping && !collisionShown && shipMoving) {
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

        requestAnimationFrame(moveShip);
    }

    moveShip()
   
    const shipBulletWidth = 0.5
    let shipBullets = []
    let animating = false
    var intervalId;

    document.addEventListener("keydown", (event) => {
        if (event.key === "s") {
            if (!intervalId) {
            createBullets()
            intervalId = setInterval(createBullets, 200)
            }
            if (!animating) {
            shootBullet()
            animating = true
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
        requestAnimationFrame(shootBullet)
    }
    
 })