class Game {

    constructor(numPlayers = 1) {

        // Instance variables start with this.
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.instanceVariable = 0;
        this.currentRotation = 0;  // in radians
        this.targetRotation = 0;  // in radians
        
        this.gameRunning = true;
        
        this.trailSize = 1;
        this.gridWidth = this.canvas.width / this.trailSize;
        this.gridHeight = this.canvas.height / this.trailSize;

        // Initialize the grid
        this.grid = Array.from({ length: this.gridHeight }, () => Array(this.gridWidth).fill(null));

        this.offScreenCanvas = document.createElement('canvas');
        this.offScreenCanvas.width = this.canvas.width;
        this.offScreenCanvas.height = this.canvas.height;
        this.offScreenCtx = this.offScreenCanvas.getContext('2d');

        // Object to track keys pressed
        this.keysPressed = {};

        // Handle keyboard input
        document.addEventListener('keydown', (e) => {
            this.keysPressed[e.code] = true;
            this.handleInput();
        });

        document.addEventListener('keyup', (e) => {
            delete this.keysPressed[e.code];
        });

        // Create players based on input
        const playerConfigs = [
            { color: 'red', playerControls: 'ARROW_KEYS', startingPosition: { x: 0, y: 0 }, startingDirection: 'right' },
            { color: 'blue', playerControls: 'WASD', startingPosition: { x: 10, y: 10 }, startingDirection: 'right' },
            { color: 'green', playerControls: 'EQUAL_BRACKETS', startingPosition: { x: 20, y: 20 }, startingDirection: 'right' },
            { color: 'yellow', playerControls: 'QWE2', startingPosition: { x: 30, y: 30 }, startingDirection: 'right' }
        ];

        this.players = [];

        for (let i = 0; i < numPlayers; i++) {
            const config = playerConfigs[i];
            this.players.push(new Player(config.color, config.playerControls, config.startingPosition, config.startingDirection));
        }

        this.startGame();
    }

    startGame() {
        // Clear the main canvas and the off-screen canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.offScreenCtx.clearRect(0, 0, this.offScreenCanvas.width, this.offScreenCanvas.height);
        this.update();
    }

    redraw() {
        // // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Copy the entire off-screen canvas to the main canvas
        this.ctx.drawImage(this.offScreenCanvas, 0, 0);

    }

    handleInput(e) {
        this.players.forEach(player => {
            for (const key in this.keysPressed) {
                if (this.keysPressed[key]) {
                    player.move(key);
                }
            }
        });
    }

    checkCollision(obj1, obj2) {
        // Check if the two objects are colliding
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }

    update() {
        
      if (!this.gameRunning) return;
      // Insert a menu here if the gameplay stops.
      
        this.redraw();

        const ROTATION_STEP = Math.PI / (2 * 6);  // Half Pi divided by number of frames (6 in this case)

        this.players.forEach(player => {
            if (player.currentRotation !== player.targetRotation) {
                if (Math.abs(player.targetRotation - player.currentRotation) <= ROTATION_STEP) {
                    player.currentRotation = player.targetRotation;
                } else if (player.targetRotation > player.currentRotation) {
                    player.currentRotation += ROTATION_STEP;
                } else {
                    player.currentRotation -= ROTATION_STEP;
                }
            }
        });
        

        // Move players
        this.players.forEach(player => {
            switch (player.direction) {
                case 'up':
                    player.position.y--;
                    break;
                case 'down':
                    player.position.y++;
                    break;
                case 'left':
                    player.position.x--;
                    break;
                case 'right':
                    player.position.x++;
                    break;
                default:
                    break;
            }

        });

        
        // Check collisions
        let self = this;
        this.players.forEach(player => {
            
            const gridX = Math.floor(player.position.x / self.trailSize);
            const gridY = Math.floor(player.position.y / self.trailSize);

            // Check for collision using the grid
            if (self.grid[gridY] && self.grid[gridY][gridX] !== null) {
                this.gameRunning = false;
                alert(`${player.color} player crashed! Game Over.`);
                return;
            }

            // Update the grid with the player's trail
            if (self.grid[gridY]) {
                self.grid[gridY][gridX] = player.color;
            }

            // Add current position to trail
            player.trail.push({ x: player.position.x, y: player.position.y });

            // Set the context's filter to adjust the sprite's hue to match the player's color.
            // This is a simple example; you might need a more complex filter based on your specific colors.
            switch (player.color) {
                case 'red':
                    this.ctx.filter = 'hue-rotate(0deg)';
                    break;
                case 'blue':
                    this.ctx.filter = 'hue-rotate(240deg)';
                    break;
                case 'green':
                    this.ctx.filter = 'hue-rotate(120deg)';
                    break;
                case 'yellow':
                    this.ctx.filter = 'hue-rotate(60deg)';
                    break;
                default:
                    this.ctx.filter = 'none';
            }

            // Save the current context state
            this.ctx.save();

            // Translate to the player's position
            this.ctx.translate(player.position.x + (player.spriteSize/2), player.position.y + (player.spriteSize/2)); // 32 is half the sprite size to ensure rotation is around the center

            // Rotate based on direction
            switch (player.direction) {
                case 'up':
                    this.ctx.rotate(-Math.PI / 2);
                    this.ctx.drawImage(player.sprite, 0,-player.spriteSize, player.spriteSize, player.spriteSize);
                    break;
                case 'down':
                    this.ctx.rotate(Math.PI / 2); // 180 degrees
                    this.ctx.drawImage(player.sprite, -player.spriteSize, 0, player.spriteSize, player.spriteSize);
                    break;
                case 'left':
                    this.ctx.rotate(Math.PI); // -90 degrees
                    this.ctx.drawImage(player.sprite, 0, 0, player.spriteSize, player.spriteSize); 
                    break;
                case 'right':
                    this.ctx.rotate(0); // 90 degrees
                    this.ctx.drawImage(player.sprite, -player.spriteSize, -player.spriteSize, player.spriteSize, player.spriteSize); 
                    break;
            }
            
            // Remove the old switch that was directly modifying rotation based on the direction. 
            // Instead, use the interpolated currentRotation:
            this.ctx.rotate(player.currentRotation);


            // Restore the context to its previous state
            this.ctx.restore();

            
            // Draw the new trail segment on the off-screen canvas
            this.offScreenCtx.fillStyle = player.color;
            this.offScreenCtx.fillRect(gridX * this.trailSize, gridY * this.trailSize, this.trailSize, this.trailSize);
            // // Draw the trail
            // this.ctx.fillStyle = player.color;
            // for (const segment of player.trail) {
            //     this.ctx.fillRect(segment.x, segment.y, player.size, player.size);
            // }

        });


        // Use requestAnimationFrame for smooth animations
        requestAnimationFrame(() => this.update());
    }
}

// Initialize the game
document.myGame = new Game();



// log the score once every second
setInterval(() => console.log(document.myGame.score), 1000);