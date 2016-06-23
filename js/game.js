var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var cursors, player;

function preload() {
	game.load.image('sky', 'images/sky.png');
    game.load.image('obstacle', 'images/obstacle.png');
    game.load.spritesheet('dude', 'images/dude.png', 32, 48);
}

function create() {

	//physics engine has basic collisions but may be good enough.  Less overhead than others
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // render background
	game.add.sprite(0,0,'sky');

	//create a group that can modified all together
	obstacles = game.add.group();
	// enable physics for anything created in this group
    obstacles.enableBody = true;

    var greenObstacle1 = obstacles.create(400, 400, 'obstacle');
    var greenObstacle2 = obstacles.create(-150, 250, 'obstacle');

    // without immovable things bounce in opposite directions when they collide
    greenObstacle1.body.immovable = true;
    greenObstacle2.body.immovable = true;


    // bring in the player
	player = game.add.sprite(32, game.world.height - 150, 'dude');

	// enable physics on the player
	game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

	// add which frames are for each motion
	player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

	// use keyboard for game controls
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {

	// collide the player with obstacles
    game.physics.arcade.collide(player, obstacles);

    // reset player movement on each update otherwise he kinda ice skates after key releaed
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown) {

        player.body.velocity.x = -150;
        player.animations.play('left');

    } else if (cursors.right.isDown) {

        player.body.velocity.x = 150;
        player.animations.play('right');

    }  else if (cursors.up.isDown) {

        player.body.velocity.y = -150;
        player.frame = 4;

    } else if (cursors.down.isDown) {

        player.body.velocity.y = 150;
        player.frame = 4;

    } else {
    	// standing still, so stop any animations going on
    	player.animations.stop();

    	// for now set him back to a static frame 4, later base it off which direction he
    	// was moving when btn was released
        player.frame = 4;
    }


}




