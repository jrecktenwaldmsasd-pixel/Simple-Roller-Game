// =====================================================================  
// effects.js -- particle bursts: death shatter and landing dust  
// =====================================================================  
var Effects = { particles: [] };  
  
Effects.reset = function () {  
  Effects.particles = [];  
};  
  
// a ring of dark shards flying out where the player died  
Effects.deathBurst = function (x, y) {  
  var cx = x + CONFIG.PLAYER_SIZE / 2;  
  var cy = y + CONFIG.PLAYER_SIZE / 2;  
  for (var i = 0; i < 16; i++) {  
    var angle = (i / 16) * Math.PI * 2;  
    var speed = 3 + Math.random() * 3;  
    Effects.particles.push({  
      x: cx, y: cy,  
      vx: Math.cos(angle) * speed,  
      vy: Math.sin(angle) * speed - 2, // bias upward so the burst blooms  
      life: 40,  
      maxLife: 40,  
      size: 3 + Math.random() * 3,  
      color: "#ffffff"  
    });  
  }  
};  
  
// a few soft puffs kicking out sideways where the player landed  
Effects.landDust = function (x, y) {  
  var feetX = x + CONFIG.PLAYER_SIZE / 2;  
  var feetY = y + CONFIG.PLAYER_SIZE;  
  for (var i = 0; i < 6; i++) {  
    var side = (i < 3) ? -1 : 1; // half go left, half go right  
    Effects.particles.push({  
      x: feetX, y: feetY - 2,  
      vx: side * (1 + Math.random() * 1.5),  
      vy: -0.5 - Math.random() * 1,   // gentle upward drift  
      life: 18,  
      maxLife: 18,  
      size: 2 + Math.random() * 2,  
      color: "#b8a8e0" // dusty lavender to match the sky  
    });  
  }  
};  
  
// move every particle and delete the dead ones  
Effects.update = function () {  
  for (var i = 0; i < Effects.particles.length; i++) {  
    var p = Effects.particles[i];  
    p.x = p.x + p.vx;  
    p.y = p.y + p.vy;  
    p.vy = p.vy + 0.15; // light gravity so bursts arc and settle  
    p.life = p.life - 1;  
  }  
  var alive = [];  
  for (var j = 0; j < Effects.particles.length; j++) {  
    if (Effects.particles[j].life > 0) { alive.push(Effects.particles[j]); }  
  }  
  Effects.particles = alive;  
};  
  
// draw particles fading out as they die  
Effects.draw = function () {  
  var ctx = Draw.ctx;  
  for (var i = 0; i < Effects.particles.length; i++) {  
    var p = Effects.particles[i];  
    ctx.globalAlpha = p.life / p.maxLife;  
    ctx.fillStyle = p.color;  
    ctx.beginPath();  
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);  
    ctx.fill();  
  }  
  ctx.globalAlpha = 1;  
};  
