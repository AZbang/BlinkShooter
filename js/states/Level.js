const Player = require('../Player.js');
const Enemy = require('../Enemy');

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
		this.map.objects.deadArea.forEach((rect) => {
			let rectangle = new Phaser.Rectangle(rect.x, rect.y, rect.width, rect.height)
			this.deadRects.push(rectangle);
		});

		this.enemies = [];
		this.map.objects.spawner.forEach((spawn) => {
			let enemy = new Enemy(this.game, spawn.x+spawn.width/2, spawn.y+spawn.height/2, spawn.properties.type);
			this.enemies.push(enemy);
		});

		let posPlayer = this.map.objects.player[0];
		this.player = new Player(this.game, posPlayer.x+posPlayer.width/2, posPlayer.y+posPlayer.height/2);
		
		let arr = [];
		for(let i = 1; i < 300; i++) {
			arr.push(i);
		}
		this.game.pathfinder.setGrid(this.map.layers[0].data, arr);
	}

	update() {
		this.player.update();

		for(let i = 0; i < this.enemies.length; i++) {
			this.enemies[i].update();
		}
	}
}


module.exports = Level;