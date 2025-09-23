let lastTime = performance.now();
let frameCount = 0;

function countFPS(now) {
  frameCount++;
  if (now - lastTime >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastTime = now;
    // if (fps >= 59) fps = 60;
    fpsDisplay.textContent = `FPS: ${fps}`;
  }
  requestAnimationFrame(countFPS);
}

const fpsDisplay = document.createElement("div");
fpsDisplay.id = "fpsDisplay";
fpsDisplay.style.position = "absolute";
fpsDisplay.style.top = "5px";
fpsDisplay.style.textAlign = "center"
fpsDisplay.style.left= "50%";
fpsDisplay.style.color = "lime";
fpsDisplay.style.fontSize = "14px";
fpsDisplay.style.zIndex = "1000";
game.appendChild(fpsDisplay);

// start counting
requestAnimationFrame(countFPS);
