const Player = require('../game/Player.js');
const Enemy = require('../game/Enemy');

class Level {
	constructor() {
		this.level;
	}
	preload() {
		this.load.tilemap('map', '../assets/levels/test/level.json', null, Phaser.Tilemap.TILED_JSON);
	}
	create() {
		// TileMap
		this.map = this.game.add.tilemap('map', 16, 16);
		this.map.addTilesetImage('tilemap');

		this.bg = this.game.add.tileSprite(0, 0, 10000, 10000, 'bg');
		this.world.setBounds(0, 0, 10000, 10000);

		this.layerMap = this.map.createLayer('map');
		this.layerMap.resizeWorld();
		
		this.map.setCollisionBetween(72, 79);
		this.map.setCollisionBetween(90, 97);

		// Dead Area
		this.deadRects = [];
		this.map.objects.deadArea.forEach((rect) => {
			let rectangle = new Phaser.Rectangle(rect.x, rect.y, rect.width, rect.height)
			this.deadRects.push(rectangle);
		});

		// Patrule Flags
		this.patruleFlags = [];
		this.map.objects.moving.forEach((rect) => {
			let rectangle = new Phaser.Rectangle(rect.x, rect.y, rect.width, rect.height)
			this.patruleFlags.push(rectangle);
		});

		// PathFinder
		let arr = this._createWalkableArr(300, [[72, 79], [90, 97]]);
		this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
		this.pathfinder.setGrid(this.map.layers[0].data, arr);

		// group for bullets
		this.bullets = this.add.group();

		// Player
		let posPlayer = this.map.objects.player[0];
		this.player = new Player(this, posPlayer.x+posPlayer.width/2, posPlayer.y+posPlayer.height/2);
		
		// Enemies
		this.enemies = this.game.add.group();
		this.map.objects.spawner.forEach((spawn) => {
			let enemy = new Enemy(this, spawn.x+spawn.width/2, spawn.y+spawn.height/2, spawn.properties.type);
			this.enemies.add(enemy.sprite);
		});
	}

	// utils method for inverted impassable tiles to passable (SHIT CODE!)
	_createWalkableArr(all, ranges) {
		let result = [];

		for(let i = 0; i < all; i++) {
			let isWalkable = false;
			for(let j = 0; j < ranges.length; j++) {
				if(i >= ranges[j][0] && i <= ranges[j][1]) {
					isWalkable = false;
					break;
				}
				isWalkable = true;
			}
			isWalkable && result.push(i);
		}
		return result;
	}

	update() {
		this.player._update();

		for(let i = 0; i < this.enemies.children.length; i++) {
			this.enemies.children[i].class._update();
		}

		this.bg.tilePosition.x += 1;
		this.bg.tilePosition.y += 1;
	}
}


module.exports = Level;