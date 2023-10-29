const PlayerControls = {
    ARROW_KEYS: { UP: 'ArrowUp', DOWN: 'ArrowDown', LEFT: 'ArrowLeft', RIGHT: 'ArrowRight' },
    WASD: { UP: 'KeyW', DOWN: 'KeyS', LEFT: 'KeyA', RIGHT: 'KeyD' },
    EQUAL_BRACKETS: { UP: 'Equal', DOWN: 'BracketLeft', LEFT: 'BracketRight', RIGHT: 'Backslash' },
    QWE2: { UP: 'KeyQ', DOWN: 'KeyW', LEFT: 'KeyE', RIGHT: 'Digit2' },
    SZXC: { UP: 'KeyZ', DOWN: 'KeyX', LEFT: 'KeyC', RIGHT: 'KeyS' },
};

class Player {
    constructor(color, playerControls, startingPosition, startingDirection, bike = new Bike()) {
        this.color = color;
        this.controls = PlayerControls[playerControls];
        this.position = { ...startingPosition, z: 0 };
        this.direction = startingDirection;
        this.bike = bike;
        this.sprite = new Image(); // assuming the sprite is an image
        this.sprite.src = 'sprites/bike.png'; // change this path to your sprite's location
    
    }

    move(direction) {
        // You can use this method to change the player's direction based on input
        switch (direction) {
            case this.controls.UP:
                this.direction = 'up';
                break;
            case this.controls.DOWN:
                this.direction = 'down';
                break;
            case this.controls.LEFT:
                this.direction = 'left';
                break;
            case this.controls.RIGHT:
                this.direction = 'right';
                break;
            default:
                break;
        }
    }
}

class Bike {
    constructor() {
        // default bike settings here
    }
}