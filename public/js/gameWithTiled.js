var game = new Phaser.Game(800, 600, Phaser.AUTO, 'mapPhaser', { preload: preload, create: create, update: update });



function preload() {

	//Load the tilemap file
	game.load.tilemap('myGame', 'assets/maps/jsonMaps/test2.json', null, Phaser.Tilemap.TILED_JSON);

	//Load the spritesheet for the tilemap
	game.load.image('test', 'assets/maps/mapTileSets/grass-tiles-2-small.png');

	//Load other assets, the player
    game.load.spritesheet('player', 'assets/characters/dude.png', 32, 48);
}

var map;
var groundLayer;
var obstacleLayer;
var player;
var enemies;

function create() {    

    game.physics.startSystem(Phaser.Physics.ARCADE);


	map = game.add.tilemap('myGame');

	//'test' is the name of the spritesheet inside of Tiled Map Editor (check json file)
	map.addTilesetImage('test');

	//'Tile Layer 1' is the name of a layer inside of Tiled Map Editor (check json file)
	// ditto for 'Obstacles'
	groundLayer = map.createLayer('Tile Layer 1');
	obstacleLayer = map.createLayer('Obstacles');

	// basically choose the range to allow collisions between player and obstacles
	// will cause collision only with tiles with gid 1 through 30
	// also important to set the phyics in update function below
	map.setCollisionBetween(1, 30, true, 'Obstacles');

	groundLayer.resizeWorld();
	obstacleLayer.resizeWorld();

	//Add player
	player = game.add.sprite(100, 100, 'player');
	game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);


    ///////////// Test Enemies //////////////////
    enemies = game.add.group();

    var e1 = enemies.create(200, 120, 'player');
    e1.isDefeated = false;
    e1.frame = 5;
	game.physics.arcade.enable(e1);
    e1.body.immovable = true;

    var e2 = enemies.create(200, 200, 'player');
    e2.isDefeated = false;
	game.physics.arcade.enable(e2);
    e2.body.immovable = true;

    var e3 = enemies.create(200, 250, 'player');
    e3.isDefeated = true;
	game.physics.arcade.enable(e3);
    e3.body.immovable = true;
    /////////////////////////////////////////////


    // Add camera
    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

	// collide player with my layers from Tiled
	game.physics.arcade.collide(player, obstacleLayer);
	game.physics.arcade.collide(player, enemies);

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

    	player.animations.stop();
        player.frame = 4;

    }

    drawLineOfSight();
}

function drawLineOfSight() {
	enemies.forEach(function(enemy) {
		var leftMax, leftMin, rightMax, rightMin

		if (enemy.frame === 0) { // facing left
			leftMax = enemy.x;
			leftMin = enemy.x - 100;
		} else if (enemy.frame === 5) { // facing right
			rightMin = enemy.x;
			rightMax = enemy.x + 100;			
		}

		if (player.x < leftMax && player.x > leftMin &&
			player.y === enemy.y && enemy.isDefeated === false) {
			console.log('Left Enemy');
		}

		if (player.x < rightMax && player.x > rightMin &&
			player.y === enemy.y && enemy.isDefeated === false) {
			console.log('right Enemy');
		}
	});
}




