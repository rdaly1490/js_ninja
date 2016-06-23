var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var cursors, player;

var levelOne = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
				1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
				1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
				1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
				1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
				1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
				1,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,1,
				1,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,1,
				1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
				1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
				1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
				1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,
				1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,
				1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,1,
				1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,];

// key to above grid
var gameWall = 1;
var gameTrees = 2;

function preload() {
	game.load.image('sky', 'images/sky.png');
    game.load.image('wall', 'images/wall.png');
    game.load.image('trees', 'images/trees.png');
    // game.load.spritesheet('dude', 'images/dude.png', 32, 48);
    game.load.spritesheet('ninja', 'images/ninja.png', 30, 20, -1, 7, 10);
}

function create() {
	//physics engine has basic collisions but may be good enough.  Less overhead than others
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // setup keyboard for game controls
    cursors = game.input.keyboard.createCursorKeys();

    drawEntireGame(levelOne);
}

function update() {

	// collide the player with obstacles
    game.physics.arcade.collide(player, obstacles);

    movementControls();

}

function movementControls() {

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
        player.frame = 0;

    } else if (cursors.down.isDown) {

        player.body.velocity.y = 150;
        player.frame = 0;

    } else {

        player.animations.play('still');

    }

}

function drawEntireGame(levelArray) {

	// render background
	game.add.sprite(0,0,'sky');

	// draw obstacles based on level Array
	generateObstaclesFromArray(levelArray);

	// draw player somewhere, maybe later throw him into number array and draw then
	drawPlayer(200, 200, 'ninja');
}

function generateObstaclesFromArray(levelArray, isGroup) {

	var height = game.world.height;
	var width = game.world.width;
	// the tiles Im using are 40x40
	var tileWidth = 40;
	var tileHeight = 40;

	var numRows = height/tileHeight;
	var numCols = width/tileWidth;

	//create a group that can modified all together
	obstacles = game.add.group();
	// enable physics for anything created in this group
    obstacles.enableBody = true;

    /*
	    Ok, so basically we divide the canvas into how many rows and colums it would take to fill it
	    based on the dimensions of the tile.  Then we iterate over each row, generating a obstacle tile
	    for each column position if applicable.  Then like a typewriter, we go back to the far left 
	    of the canvas after we reach the right side by setting currentCol back to 0, and begin drawing
	    for the next row.  Repeat until no rows left.
	*/
    for (var currentRow = 0; currentRow < numRows; currentRow++) {
		for (var currentCol = 0; currentCol < numCols; currentCol++) {

			var overallIndex = getArrayIndexFromColRow(numCols, currentCol, currentRow);
			var valueAtIndex = levelArray[overallIndex];
			var whatToDraw;

			if (valueAtIndex) {
				if (valueAtIndex === gameWall) {
					whatToDraw = 'wall';
				} else if (valueAtIndex === gameTrees) {
					whatToDraw = 'trees';
				}

				var obstacle = obstacles.create(tileWidth*currentCol, currentRow*tileHeight, whatToDraw);
				obstacle.body.immovable = true;
			} // end check if value > 0
		} // end loop through current rows columns
		currentCol = 0;
	} // end iterating over all rows
} // end generate obstacles function

// this function converts whatever col/row combo we're at into an index in the level array
function getArrayIndexFromColRow(totalCols, currentCol, currentRow) {
	return currentCol + totalCols * currentRow;
}

function drawPlayer(x, y, name) {

	// if we already have a player, kill it
	if (player) {
		player.kill();
	}

	// bring in the player
	player = game.add.sprite(x, y, name);

	// enable physics on the player
	game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    // add which frames are for each motion
	player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [0, 1, 2, 3], 10, true);
    player.animations.add('still', [0, 6, 12, 18], 10, true);

    player.scale.setTo(3,3);

}




