// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // Number of enemy rows to occupy (Maybe turn in to difficulty level).
    this.eRows = 3;
    
    this.speedx = Math.floor(Math.random() * 150) + 50;
    // Randomized starting position.
    this.x = 1000;
    this.y = 0;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x > 5 * 101) {
        this.restart();
    }
    this.x += this.speedx * dt;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Enemy.prototype.restart = function() {
    this.x = Math.floor(Math.random() * 2) * -101 - 101;
    this.y = 54 + Math.floor(Math.random() * this.eRows) * 83;
    this.speedx = Math.floor(Math.random() * 150) + 20;
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x = undefined;
    this.y = undefined;
    this.sprite = 'images/char-cat-girl.png';
}
Player.prototype.update = function(dt) {
    if (this.x == undefined) {
        runSelector = true;
    }
    for (var i = 0; i < nEnemies; i++){
        if (Math.abs(allEnemies[i].x - this.x) < 66
           && allEnemies[i].y == this.y) {
            this.restart();
        }
    }
}
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Player.prototype.handleInput = function(move_dir) {
    if (move_dir === 'left' && this.x > 0 ) {
        this.x -= 101;
    }
    if (move_dir === 'right' && this.x < 4 * 101 ) {
        this.x += 101;
    }
    if (move_dir === 'up' && this.y > 54 ) {
        this.y -= 83;
    }
    if (move_dir === 'down' && this.y < 4 * 83 ) {
        this.y += 83;
    }
    if (move_dir === 'esc') {
        this.y = undefined;
        this.x = undefined;
        runSelector = true;
    }
}
// Player starting position is bottom center.
Player.prototype.restart = function() {
    this.x = 2 * 101;
    this.y = 54 + 4 * 83;
}

// Selector (character selection) class
var runSelector = true;
var Selector = function() {
    this.y = 54 + 4 * 83;
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
Selector.prototype.render = function() {
    if (runSelector) {
        ctx.globalAlpha=0.6;
        ctx.fillStyle = '#03f';
        ctx.fillRect(0,50,505,540);
        ctx.globalAlpha=1;
        ctx.drawImage(Resources.get(this.selectorSprite), this.x, this.y);
        for (var i = 0; i < 5; i++) {
            ctx.drawImage(Resources.get(this.sprites[i]), i * 101, this.y);
        }
        ctx.globalAlpha=0.1;
        ctx.drawImage(Resources.get(this.selectorSprite), this.x, this.y);
        ctx.globalAlpha=1;
    }
}
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
    // Adjust speed.
    this.speed = 10*Math.abs(diff * dt);  
    
}
Selector.prototype.handleInput = function(move_dir) {
    if (move_dir === 'left' && this.goto > 0 ) {
        this.goto -= 101;
    }
    if (move_dir === 'right' && this.goto < 4 * 101 ) {
        this.goto += 101;
    }
    if (move_dir === 'enter') {
        runSelector = false;
        player.sprite = this.sprites[this.goto / 101];
        player.restart()
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Number of enemies to add.
var nEnemies = 4;
var allEnemies = [];
for (var i = 0; i < nEnemies; i++){
    allEnemies.push(new Enemy());
}
// Place the player object in a variable called player
var player = new Player();
var selector = new Selector();
//player.restart();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
// Key codes found at http://www.javascripter.net/faq/keycodes.htm
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
