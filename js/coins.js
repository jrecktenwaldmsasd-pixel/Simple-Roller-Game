// =====================================================================  
// coins.js -- collectible coins and the score counter  
// =====================================================================  

var Coins = {  
  count: 0,    // how many coins the player has grabbed this level  
  pops: [],    // burst particles from coins we just collected  
  popTimer: 0  // frames left that the counter stays highlighted  
};  
  
// reset everything when a level starts  
Coins.reset = function () {  
  Coins.count = 0;  
  Coins.pops = [];  
  Coins.popTimer = 0;  
};  

// check if the player is overlapping a coin tile, and collect it  
Coins.update = function () {  
  var squares = Collide.squaresUnder(Player.x, Player.y,  
    CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE);  
  
  for (var i = 0; i < squares.length; i++) {  
    var spot = squares[i];  
    if (Level.charAt(spot.col, spot.row) === "o") {  
      
            Coins.count = Coins.count + 1;  
      Coins.popTimer = CONFIG.COIN_POP_FRAMES; // highlight the counter  
      // spawn a burst of particles at the coin's center  
      var cx = spot.col * CONFIG.TILE + CONFIG.TILE / 2;  
      var cy = spot.row * CONFIG.TILE + CONFIG.TILE / 2;  
      for (var p = 0; p < 8; p++) {  
        var angle = (p / 8) * Math.PI * 2; // evenly spread around a circle  
        Coins.pops.push({  
          x: cx, y: cy,  
          vx: Math.cos(angle) * 3, vy: Math.sin(angle) * 3,  
          life: CONFIG.COIN_POP_FRAMES  
        });  
      }  
    }  
  }  
};  

// move the burst particles and count the highlight down  
Coins.popsUpdate = function () {  
  Coins.popTimer = Coins.popTimer - 1;  
  for (var i = 0; i < Coins.pops.length; i++) {  
    var pop = Coins.pops[i];  
    pop.x = pop.x + pop.vx;  
    pop.y = pop.y + pop.vy;  
    pop.life = pop.life - 1;  
  }  
  // remove finished particles  
  var alive = [];  
  for (var j = 0; j < Coins.pops.length; j++) {  
    if (Coins.pops[j].life > 0) { alive.push(Coins.pops[j]); }  
  }  
  Coins.pops = alive;  
};  

// draw the burst particles, fading as they die  
Coins.popsDraw = function () {  
  var ctx = Draw.ctx;  
  ctx.fillStyle = "#decf00";  
  for (var i = 0; i < Coins.pops.length; i++) {  
    var pop = Coins.pops[i];  
    ctx.globalAlpha = pop.life / CONFIG.COIN_POP_FRAMES;  
    ctx.beginPath();  
    ctx.arc(pop.x, pop.y, 3, 0, Math.PI * 2);  
    ctx.fill();  
  }  
  ctx.globalAlpha = 1;  
};  
