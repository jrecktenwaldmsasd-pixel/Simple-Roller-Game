// =====================================================================  
// trail.js -- a fading contrail that follows the player  
// =====================================================================  
var Trail = { points: [] };  
  
// forget every old position when a level starts  
Trail.reset = function () {  
  Trail.points = [];  
};  
  
// remember where the player is this frame  
Trail.update = function () {  
  Trail.points.push({ x: Player.x, y: Player.y });  
  // keep the list short enough  
  while (Trail.points.length > CONFIG.TRAIL_LENGTH) {  
    Trail.points.shift(); // drop the oldest position  
  }  
};  
  
// draw faint circles at the old positions, fading toward the tail  
Trail.draw = function () {  
  var ctx = Draw.ctx;  
  var r = CONFIG.PLAYER_RADIUS;  
  for (var i = 0; i < Trail.points.length; i++) {  
    var point = Trail.points[i];  
    var fade = (i + 1) / Trail.points.length; // 0 at the tail, 1 near the player  
    ctx.strokeStyle = "rgba(255, 255, 255, " + (fade * 0.4) + ")";  
    ctx.lineWidth = 1;  
    ctx.beginPath();  
    ctx.arc(point.x + CONFIG.PLAYER_SIZE / 2,  
      point.y + CONFIG.PLAYER_SIZE / 2, r, 0, Math.PI * 2);  
    ctx.stroke();  
  }  
};  
