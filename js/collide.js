/* =====================================================================
   collide.js  --  DID THE PLAYER TOUCH SOMETHING?

   The player is a BOX for collision, even though it is drawn as a
   circle. Boxes are much easier to check, and nobody can tell.

   Every function here answers one yes-or-no question about a box.
   ===================================================================== */

var Collide = {};

// Which grid squares does this box overlap?
// Returns a list of { col: , row: } objects.
Collide.squaresUnder = function (x, y, width, height) {
  var firstCol = Math.floor(x / CONFIG.TILE);
  var lastCol  = Math.floor((x + width  - 1) / CONFIG.TILE);
  var firstRow = Math.floor(y / CONFIG.TILE);
  var lastRow  = Math.floor((y + height - 1) / CONFIG.TILE);

  var squares = [];
  for (var row = firstRow; row <= lastRow; row++) {
    for (var col = firstCol; col <= lastCol; col++) {
      squares.push({ col: col, row: row });
    }
  }
  return squares;
};

// Is this box inside a solid block?
Collide.hitsSolid = function (x, y, width, height) {
  var squares = Collide.squaresUnder(x, y, width, height);
  for (var i = 0; i < squares.length; i++) {
    if (Level.isSolid(squares[i].col, squares[i].row)) { return true; }
  }
  return false;
};

// Is this box touching a spike? 
// The player is a circle and the spike is a triangle, so we test 
// points around the player's circle against the spike's triangle. 
Collide.hitsSpike = function (x, y, width, height) { 
 var squares = Collide.squaresUnder(x, y, width, height); 
 for (var i = 0; i < squares.length; i++) { 
   var col = squares[i].col; 
   var row = squares[i].row; 
   if (!Level.isSpike(col, row)) { continue; } 
    // the spike triangle's three corners, matching Draw.spike 
   var tx = col * CONFIG.TILE; 
   var ty = row * CONFIG.TILE; 
   var s = CONFIG.TILE; 
   var ax = tx,         ay = ty + s;     // bottom-left corner 
   var bx = tx + s / 2, by = ty;         // top tip 
   var cx = tx + s,     cy = ty + s;     // bottom-right corner 
    // sample points around the player's circle 
   var px = x + width / 2; 
   var py = y + height / 2; 
   var r = width / 2 - 4;  // slightly smaller than drawn, so grazes are safe 
    for (var a = 0; a < 12; a++) { 
     var angle = (a / 12) * Math.PI * 2; 
     var qx = px + Math.cos(angle) * r; 
     var qy = py + Math.sin(angle) * r; 
     if (Collide.pointInTriangle(qx, qy, ax, ay, bx, by, cx, cy)) { return true; } 
   } 
 } 
 return false; 
}; 
 // Is this point inside this triangle? 
// Works by checking which side of each edge the point is on. 
Collide.pointInTriangle = function (qx, qy, ax, ay, bx, by, cx, cy) { 
 var d1 = (qx - bx) * (ay - by) - (ax - bx) * (qy - by); 
 var d2 = (qx - cx) * (by - cy) - (bx - cx) * (qy - cy); 
 var d3 = (qx - ax) * (cy - ay) - (cx - ax) * (qy - ay); 
 var hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0); 
 var hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0); 
 return !(hasNeg && hasPos); 
}; 

// Is this box touching the finish?
Collide.hitsFinish = function (x, y, width, height) {
  var squares = Collide.squaresUnder(x, y, width, height);
  for (var i = 0; i < squares.length; i++) {
    if (Level.isFinish(squares[i].col, squares[i].row)) { return true; }
  }
  return false;
};
