// =====================================================================  
// coins.js -- collectible coins and the score counter  
// =====================================================================  
  
var Coins = {  
  count: 0 // how many coins the player has grabbed this level  
};  
  
// find every "o" in the level; coins already exist as tiles,  
// so we only need to reset the score  
Coins.reset = function () {  
  Coins.count = 0;  
};  
  
// check if the player is overlapping a coin tile, and collect it  
Coins.update = function () {  
  var squares = Collide.squaresUnder(Player.x, Player.y,  
    CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE);  
  
  for (var i = 0; i < squares.length; i++) {  
    var spot = squares[i];  
    if (Level.charAt(spot.col, spot.row) === "o") {  
      Coins.count = Coins.count + 1;  
      // rebuild the row, because strings cannot be changed in place  
      var line = Level.grid[spot.row];  
      Level.grid[spot.row] = line.substring(0, spot.col) + "." + line.substring(spot.col + 1);  
    }  
  }  
};  
