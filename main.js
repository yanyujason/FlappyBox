var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game');
// Creates a new 'main' state that will contain the game
var main_state = {
    preload: function () {
        // Function called first to load all the assets
        // Change the background color of the game
        this.game.load.image('bird', 'bird.png');
        this.game.load.image('pipe', 'pipe.png');
        this.game.load.audio('jump', 'jump.wav');
        this.game.stage.backgroundColor = '#71c5cf';
    },

    create: function () {
        // Function called after 'preload' to setup the game
        // Display the bird on the screen
        this.bird = this.game.add.sprite(100, 245, 'bird');
        this.jumpSound = this.game.add.audio('jump');
        this.bird.anchor.setTo(-0.2, 0.5);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;

        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe');
        this.game.physics.arcade.enable(this.pipes);

        this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = 0;
        this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
    },

    update: function () {
        // Function called 60 times per second
        if (this.bird.inWorld == false) {
            this.restartGame();
        };
        this.game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
        if (this.bird.angle < 20) {
            this.bird.angle += 1;
        };
    },

    jump: function () {
        if (this.bird.alive == false) return;
        this.bird.body.velocity.y = -350;
//        this.bird.angle=-20;
        var animation = this.game.add.tween(this.bird);

        // Set the animation to change the angle of the sprite to -20° in 100 milliseconds
        animation.to({angle: -20}, 100);

        // And start the animation
        animation.start();
//        this.jumpSound.play();
    },

    restartGame: function () {
        // Start the 'main' state, which restarts the game
        this.game.state.start('main');
        this.game.time.events.remove(this.timer);
    },

    addOnePipe: function (x, y) {
        // Get the first dead pipe of our group
        var pipe = this.pipes.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;

        // Kill the pipe when it's no longer visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function () {
        if(this.pipes.getFirstAlive()) {
            this.score += 1;
            this.labelScore.text = this.score;
            this.jumpSound.play();
        }
        var hole = Math.floor(Math.random() * 5) + 1;

        for (var i = 0; i < 8; i++) {
            if (i != hole && i != hole + 1) {
                this.addOnePipe(400, i * 60 + 10);
            }
        }
    },

    hitPipe: function() {
        // If the bird has already hit a pipe, we have nothing to do
        if (this.bird.alive == false)
            return;

        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        this.game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
    }
};

// Add and start the 'main' state to start the game
game.state.add('main', main_state);
game.state.start('main');


