const Player = require('../Player.js');

class Level {
	constructor(game) {
		this.game = game;

		this.map = game.add.tilemap('map', 16, 16);
		this.map.addTilesetImage('tilemap');

		game.add.tileSprite(0, 0, 10000, 10000, 'bg');
		game.world.setBounds(0, 0, 10000, 10000);

		this.layerMap = this.map.createLayer('map');
		this.layerMap.resizeWorld();

		this.map.setCollisionBetween(72, 79);
		this.map.setCollisionBetween(90, 97);

		this.deadRects = [];
		this.map.objects.collisions.forEach((rect) => {
			if(rect.properties.dead_fall == 'true') {
				let rectangle = new Phaser.Rectangle(rect.x, rect.y, rect.width, rect.height)
				this.deadRects.push(rectangle);
			}

			else if(rect.properties.spawn_player == 'true') {
				this.player = new Player(this.game, rect.x+rect.width/2, rect.y+rect.height/2);
			}
		});

	}

	update() {
		this.player.update();
	}
}


module.exports = Level;