/* =====================================================================
   draw.js  --  EVERYTHING YOU CAN SEE.

   Nothing in this file changes the game. It only puts pixels on screen.
   If you want to change how the game LOOKS, this is the only file you
   need. If you want to change how it BEHAVES, this is the wrong file.

   The whole game is black and white on purpose. That is your room to
   work in.
   ===================================================================== */

var Draw = {  
  canvas: null,  
  ctx: null,  
  cameraX: 0,    // how far the view has scrolled to the right  
  time: 0,       // counts every frame, for animating the background  
  stars: []      // the galaxy's stars  
};  

Draw.setup = function () {
  Draw.canvas = document.getElementById("game");
  Draw.ctx = Draw.canvas.getContext("2d");
};

// make a field of stars at random positions, done once at startup  
Draw.makeStars = function () {  
  for (var i = 0; i < 60; i++) {  
    Draw.stars.push({  
      x: Math.random() * CONFIG.CANVAS_W,  
      y: Math.random() * CONFIG.CANVAS_H,  
      size: Math.random() * 2 + 1,   // between 1 and 3 pixels  
      speed: Math.random() * 0.5 + 0.2 // each star drifts at its own speed  
    });  
  }  
};  

  // the purple galaxy: a gradient sky with slowly drifting, twinkling stars  
Draw.galaxy = function () {  
  var ctx = Draw.ctx;  
  
  // the gradient sky, drawn over the whole screen  
  var sky = ctx.createLinearGradient(0, 0, 0, CONFIG.CANVAS_H);  
  sky.addColorStop(0, "#1a0533"); // dark purple at the top  
  sky.addColorStop(1, "#4b0f6b"); // brighter purple at the bottom  
  ctx.fillStyle = sky;  
  ctx.fillRect(0, 0, CONFIG.CANVAS_W, CONFIG.CANVAS_H);  
  
  // the stars, drifting slowly and twinkling  
  ctx.fillStyle = "#ffffff";  
  for (var i = 0; i < Draw.stars.length; i++) {  
    var star = Draw.stars[i];  
    var x = star.x - Draw.time * star.speed; // drift left over time  
    if (x < 0) { x = x + CONFIG.CANVAS_W; }  // wrap around the edge  
    var twinkle = 0.4 + 0.6 * Math.abs(Math.sin(Draw.time / 30 + i));  
    ctx.globalAlpha = twinkle;  
    ctx.beginPath();  
    ctx.arc(x, star.y, star.size, 0, Math.PI * 2);  
    ctx.fill();  
  }  
  ctx.globalAlpha = 1;  
};  

// the moon rises and crosses the sky as you travel through the level  
Draw.moon = function () {  
  var ctx = Draw.ctx;  
  
  // how far through the level are we? 0 at the start, 1 at the end  
  var progress = Player.x / Level.pixelWidth();  
  if (progress > 1) { progress = 1; }  
  
  // the moon starts low on the left and arcs high to the right  
  var moonX = 80 + progress * (CONFIG.CANVAS_W - 160);  
  var moonY = 300 - Math.sin(progress * Math.PI) * 220;  
  
  // glow: a bigger, fainter circle behind the moon  
  ctx.globalAlpha = 0.2;  
  ctx.fillStyle = "#e8e0ff";  
  ctx.beginPath();  
  ctx.arc(moonX, moonY, 34, 0, Math.PI * 2);  
  ctx.fill();  
  ctx.globalAlpha = 1;  
  
  // the moon itself, with a couple of craters  
  ctx.fillStyle = "#e8e0ff";  
  ctx.beginPath();  
  ctx.arc(moonX, moonY, 24, 0, Math.PI * 2);  
  ctx.fill();  
  ctx.fillStyle = "#b8a8e0";  
  ctx.beginPath();  
  ctx.arc(moonX - 8, moonY - 5, 6, 0, Math.PI * 2);  
  ctx.fill();  
  ctx.beginPath();  
  ctx.arc(moonX + 7, moonY + 8, 4, 0, Math.PI * 2);  
  ctx.fill();  
};  

// light poles: a small pole with a glowing cone of light above it  
Draw.lamps = function () {  
  var ctx = Draw.ctx;  
  var size = CONFIG.TILE;  
  
  // the cones first, so the poles sit on top of them  
  ctx.globalAlpha = 0.15;  
  ctx.fillStyle = "#fff3c4"; // warm light color  
  for (var row = 0; row < CONFIG.ROWS; row++) {  
    for (var col = 0; col < Level.cols; col++) {  
      if (Level.charAt(col, row) === "L") {  
        // a triangle of light spreading upward from the lamp head  
        var topX = col * size + size / 2;  
        var topY = row * size - 8;  
        ctx.beginPath();  
        ctx.moveTo(topX, topY);  
        ctx.lineTo(topX - 34, topY - 90);  
        ctx.lineTo(topX + 34, topY - 90);  
        ctx.closePath();  
        ctx.fill();  
      }  
    }  
  }  
  ctx.globalAlpha = 1;  
  
  // the poles themselves: a dark post with a glowing bulb  
  for (var r = 0; r < CONFIG.ROWS; r++) {  
    for (var c = 0; c < Level.cols; c++) {  
      if (Level.charAt(c, r) === "L") {  
        var x = c * size + size / 2;  
        var y = r * size;  
        ctx.fillStyle = "#2a2140"; // dark post against the sky  
        ctx.fillRect(x - 2, y - 34, 4, 74); // long enough to reach the ground tile  
        ctx.fillStyle = "#fff3c4";  
        ctx.beginPath();  
        ctx.arc(x, y - 38, 6, 0, Math.PI * 2);  
        ctx.fill();  
      }  
    }  
  }  
};  


// Follow the player, but never scroll past the ends of the level.
Draw.updateCamera = function () {
  Draw.cameraX = Player.x - CONFIG.CANVAS_W / 2;
  if (Draw.cameraX < 0) { Draw.cameraX = 0; }

  var furthest = Level.pixelWidth() - CONFIG.CANVAS_W;
  if (furthest < 0) { furthest = 0; }   // level narrower than the screen
  if (Draw.cameraX > furthest) { Draw.cameraX = furthest; }
};

// a coin: a small yellow circle with a white ring  
Coins.draw = function () {  
  var ctx = Draw.ctx;  
  var size = CONFIG.TILE;  
  for (var row = 0; row < CONFIG.ROWS; row++) {  
    for (var col = 0; col < Level.cols; col++) {  
      if (Level.charAt(col, row) === "o") {  
        ctx.strokeStyle = "#ffffff";  
        ctx.fillStyle = "#decf00";  
        ctx.lineWidth = 2;  
        ctx.beginPath();  
        ctx.arc(col * size + size / 2, row * size + size / 2, 8, 0, Math.PI * 2);  
        ctx.fill();  
        ctx.stroke();  
      }  
    }  
  }  
};  

// Draw one whole frame.
Draw.everything = function () {
  var ctx = Draw.ctx;

Draw.time = Draw.time + 1; // one frame older, every frame  

  // 1. paint the galaxy (this replaces the old black wipe)  
Draw.galaxy();  

Draw.moon(); // the moon rises with your progress  

  // 2. shift everything left so the camera looks like it moved right
  ctx.save();
  ctx.translate(-Draw.cameraX, 0);

  Draw.world();
  Coins.draw();
  Crumble.draw();
  Draw.lamps();
  Draw.player();

  ctx.restore();
  // the score, fixed on screen while the world scrolls  
ctx.fillStyle = "#ffffff";  
ctx.font = "20px monospace";  
ctx.fillText("Coins: " + Coins.count, 10, 25);  

};

// Draw every grid square that is currently on screen.
Draw.world = function () {
  var ctx = Draw.ctx;
  var size = CONFIG.TILE;

  // only look at the columns that are actually visible. much faster.
  var firstCol = Math.floor(Draw.cameraX / size) - 1;
  var lastCol  = firstCol + Math.ceil(CONFIG.CANVAS_W / size) + 2;

  for (var row = 0; row < CONFIG.ROWS; row++) {
    for (var col = firstCol; col <= lastCol; col++) {
      var here = Level.charAt(col, row);
      var x = col * size;
      var y = row * size;

      if (here === "#") { Draw.block(x, y, size); }
      if (here === "^") { Draw.spike(x, y, size); }
      if (here === "F") { Draw.finish(x, y, size); }
    }
  }
};

// A solid block: black inside, white outline.
Draw.block = function (x, y, size) {
  var ctx = Draw.ctx;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, size, size);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = CONFIG.LINE_WIDTH;
  ctx.strokeRect(x + CONFIG.LINE_WIDTH / 2,
                 y + CONFIG.LINE_WIDTH / 2,
                 size - CONFIG.LINE_WIDTH,
                 size - CONFIG.LINE_WIDTH);
};

// A spike: a solid red triangle pointing up.
Draw.spike = function (x, y, size) {
  var ctx = Draw.ctx;
  ctx.fillStyle = "#870000";
  ctx.beginPath();
  ctx.moveTo(x, y + size);
  ctx.lineTo(x + size / 2, y);
  ctx.lineTo(x + size, y + size);
  ctx.closePath();
  ctx.fill();
};

// The finish: a green pole with a flag on it.
Draw.finish = function (x, y, size) {
  var ctx = Draw.ctx;
  ctx.fillStyle = "#098300";
  ctx.fillRect(x + size / 2 - 2, y, 4, size);
  ctx.beginPath();
  ctx.moveTo(x + size / 2 + 2, y + 4);
  ctx.lineTo(x + size - 4,     y + 12);
  ctx.lineTo(x + size / 2 + 2, y + 20);
  ctx.closePath();
  ctx.fill();
};




// The player: a balck circle with a white outline and one off-center
// white dot, so you can see it roll.
Draw.player = function () {
  var ctx = Draw.ctx;

  // draw the contrail first so it sits behind the player  
ctx.fillStyle = "#ffffff";  
for (var i = 0; i < Player.trail.length; i++) {  
  var spot = Player.trail[i];  
  var fade = i / Player.trail.length; // older spots are smaller  
  ctx.globalAlpha = fade * 0.4; // see-through so it looks like a trail  
  ctx.beginPath();  
  ctx.arc(spot.x + CONFIG.PLAYER_SIZE / 2,  
    spot.y + CONFIG.PLAYER_SIZE / 2,  
    CONFIG.PLAYER_RADIUS * fade * 0.6, 0, Math.PI * 2);  
  ctx.fill();  
}  
ctx.globalAlpha = 1; // back to full strength for the player  


  var r = CONFIG.PLAYER_RADIUS;
  var centerX = Player.x + CONFIG.PLAYER_SIZE / 2;
  var centerY = Player.y + CONFIG.PLAYER_SIZE / 2;

  // the circle
  ctx.fillStyle = "#000000";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = CONFIG.LINE_WIDTH;
  ctx.beginPath();
  ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // the off-center dot. its position depends on how far we have rolled.
  var dotX = centerX + Math.cos(Player.angle) * r * CONFIG.DOT_DISTANCE;
  var dotY = centerY + Math.sin(Player.angle) * r * CONFIG.DOT_DISTANCE;

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
  ctx.fill();
};
