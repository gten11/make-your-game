# Space Invaders Game
A simple browser-based arcade game where you control a ship and fight waves of alien invaders.
## Gameplay Rules
Alien Waves: The game starts with 3 waves of aliens.
Ship Lives: You begin with 4 lives.
Shooter Lives: Your shooter starts with 10 lives.
## Scoring System
+10 points → when you destroy an alien.
-30 points → when your ship is hit by an alien.
-20 points → when your ship shoots your own shooter (also costs the shooter 2 lives).
-2 points → when your shooter is hit by aliens (also costs the shooter 1 life).
## Life System
Ship: Loses 1 life per alien hit.
Shooter: Loses 1 life when hit by aliens, or 2 lives when shot byb your ship.
## How to Play
Use arrow keys (← →) to move your ship.
Press "s" to fire bullets.
Survive all waves and score as high as possible!
## Required course objectives & how this project meets them
### 60 FPS / No frame drops
Movement & animation use requestAnimationFrame.
Game uses CSS transforms (translateX) and opacity to animate motion — those are GPU-friendly and avoid layout thrash.
Heavy DOM insertion/removal is avoided inside the frame loop (elements are pre-created and toggled).
A performance monitor is included to measure frame times and detect jank.
### Proper use of requestAnimationFrame
The main loop runs under requestAnimationFrame and does only what is needed per frame (read, update, write pattern).
### Pause menu with Continue / Restart
A floating overlay is used for the pause menu. It is position: absolute/fixed and z-indexed above the game; it toggles display without rerunning expensive DOM operations.
### Scoreboard / HUD
HUD contains: timer (elapsed or countdown), score, lives. It’s updated each frame (lightweight) or only when values change.
### Minimal layer usage
The game uses a small number of composited layers (transformed elements). We avoid creating new layers per frame.
## Project Notes
Built with plain JavaScript, HTML, and CSS.
Game loop handles movement, collisions, and rendering.
HUD always displays your score and remaining lives.