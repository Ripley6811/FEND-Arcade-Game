
/**
 * Vertical pixel adjustment for aligning enemies and player over tiles.
 * @type {Number}
 */
var yOffset = 54;
/**
 * Vertical length in pixels of the tile area used by the game.
 * @type {Number}
 */
var tileHeight = 83;
/**
 * Horizontal length in pixels of the tile area used by the game.
 * @type {Number}
 */
var tileWidth = 101;

/**
 * Convert horizontal tile steps (X-direction) into pixel distance.
 * @param {Number} nTiles Distance in number of tiles.
 * @return {Number} Horizontal pixel distance of `nTiles`.
 */
var xSteps = function(nTiles) { return nTiles*tileWidth; }

/**
 * Convert vertical tile steps (Y-direction) into pixel distance.
 * @param {Number} nTiles Distance in number of tiles.
 * @return {Number} Vertical pixel distance of `nTiles`.
 */
var ySteps = function(nTiles) { return nTiles*tileHeight; }

/**
 * Generate a random speed for a new enemy entering the game.
 * @return {Number} Speed value.
 */
var randomSpeed = function() { return Math.floor(Math.random() * 150) + 20; }

/**
 * Image overlap threshold between enemy and player images in pixels.
 * @type {Number}
 */
var touchThreshold = 66;

/**
 * Enemies our player must avoid
 * @constructor
 */
var Enemy = function() {
    // Number of enemy rows to occupy.
    this.eRows = 3;
    // The image/sprite for enemies. 
    this.sprite = 'images/enemy-bug.png';
    // Initialize starting position and speed.
    this.restart();
}
/**
 * Update the enemy's position, required method for game
 * @param {number} dt A time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    if (this.x > xSteps(5)) {
        this.restart();
    }
    this.x += this.speedx * dt;
}
/**
 * Draw the enemy on the screen, required method for game.
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
/**
 * Method for setting the starting position and speed for an enemy.
 */
Enemy.prototype.restart = function() {
    this.x = xSteps(-1);
    this.y = yOffset + ySteps(Math.floor(Math.random() * this.eRows));
    this.speedx = randomSpeed();
}

/**
 * Player class.
 * @constructor
 */
var Player = function() {
    this.x = undefined;
    this.y = undefined;
    this.sprite = 'images/char-cat-girl.png';
}
/**
 * Test if the player encounters an enemy and reset position.
 * Also reset when encountering the water.
 * @param {number} dt A time delta between ticks
 */
Player.prototype.update = function(dt) {
    if (this.x == undefined) {
        runSelector = true;
    }
    for (var i = 0; i < nEnemies; i++) {
        if (Math.abs(allEnemies[i].x - this.x) < touchThreshold &&
            allEnemies[i].y == this.y) {
            this.restart();
        }
    }
    if (this.y <= 0) {
        this.restart();
    }
}
/**
 * Method for drawing player on screen.
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
/**
 * Handle keyboard input to adjust player position.
 * Up, down, left, right for movement.
 * "Esc" exits to player selection screen.
 * @param {string} move_dir A word representing a pressed key.
 */
Player.prototype.handleInput = function(move_dir) {
    if (move_dir === 'left' && this.x > 0 ) {
        this.x -= xSteps(1);
    }
    if (move_dir === 'right' && this.x < xSteps(4) ) {
        this.x += xSteps(1);
    }
    if (move_dir === 'up' && this.y >= yOffset ) {
        this.y -= ySteps(1);
    }
    if (move_dir === 'down' && this.y < ySteps(4) ) {
        this.y += ySteps(1);
    }
    if (move_dir === 'esc') {
        this.y = undefined;
        this.x = undefined;
        runSelector = true;
    }
}
/**
 * Sets player starting position at bottom center.
 */
Player.prototype.restart = function() {
    this.x = xSteps(2);
    this.y = yOffset + ySteps(4);
}

/**
 * Selector (character selection) class.
 * Allows player to select one of five character images.
 * @constructor
 */
var Selector = function() {
    this.y = yOffset + ySteps(4);
    this.x = 0;
    this.goto = 0;
    this.speed = 0;
    this.selectorSprite = 'images/Selector.png';
    this.sprites = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
    ];
}
// Boolean that shows or hides the character selection menu.
var runSelector = true;
/**
 * Draws the selection background, character choices and selector light.
 */
Selector.prototype.render = function() {
    if (runSelector) {
        // Draw a semi-transparent blue backdrop.
        ctx.globalAlpha=0.6;
        ctx.fillStyle = '#03f';
        ctx.fillRect(0,50,505,540);
        ctx.globalAlpha=1;
        // Draw selector light image and characters.
        ctx.drawImage(Resources.get(this.selectorSprite), this.x, this.y);
        for (var i = 0; i < 5; i++) {
            ctx.drawImage(Resources.get(this.sprites[i]), xSteps(i), this.y);
        }
        ctx.globalAlpha=0.1;
        ctx.drawImage(Resources.get(this.selectorSprite), this.x, this.y);
        ctx.globalAlpha=1;
        // Text instructions on selection screen.
        ctx.fillStyle = '#ff1';
        ctx.font = '30px Georgia';
        ctx.fillText('<Enter> to select a character.', 60, 280);
        ctx.fillText('<Esc> to return to this menu.', 60, 340);
                     
    }
}
/**
 * Moves the selector light from character to character after keyboard input.
 * @param {number} dt A time delta between ticks
 */
Selector.prototype.update = function(dt) {
    // Move selection icon.
    var diff = this.goto - this.x;
    if (diff > 1) {
        this.x += this.speed;
    } else if (diff < -1) {
        this.x -= this.speed;
    } else {
        this.x = this.goto;
    }
    // Adjust icon movement speed based on distance from target.
    this.speed = 10*Math.abs(diff * dt);  
    
}
/**
 * Handle keyboard input to move selector light to different character images.
 * "Enter" key adds selected image to player object and starts game.
 * @param {string} move_dir A word representing a pressed key.
 */
Selector.prototype.handleInput = function(move_dir) {
    if (move_dir === 'left' && this.goto > 0 ) {
        this.goto -= xSteps(1);
    }
    if (move_dir === 'right' && this.goto < xSteps(4) ) {
        this.goto += xSteps(1);
    }
    if (move_dir === 'enter') {
        runSelector = false;
        player.sprite = this.sprites[this.goto / xSteps(1)];
        player.restart()
    }
}

/**
 * Instantiate game objects.
 * Place all enemy objects in an array called allEnemies
 * Set number of enemies to add.
 * Place the player object in a variable called player.
 */
var nEnemies = 4;
var allEnemies = [];
for (var i = 0; i < nEnemies; i++){
    allEnemies.push(new Enemy());
}
var player = new Player();
var selector = new Selector();


/**
 * This listens for key presses and sends the keys to your
 * Player.handleInput() method. You don't need to modify this.
 * Extra key codes found at http://www.javascripter.net/faq/keycodes.htm
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter',
        27: 'esc',
    };
    if (runSelector) {
        selector.handleInput(allowedKeys[e.keyCode]);
    } else {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});
