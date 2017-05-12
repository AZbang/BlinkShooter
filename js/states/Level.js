const Player = require('../game/Player');
const Enemy = require('../game/Enemy');

class Level {
	constructor() {
		this.level;
	}
	preload() {
		this.load.tilemap('map', '../assets/levels/test/level1.json', null, Phaser.Tilemap.TILED_JSON);
	}
	create() {
		// TileMap
		this.map = this.game.add.tilemap('map', 16, 16);
		this.map.addTilesetImage('tilemap');
		this.map.debugMap = true;

		this.bg = this.game.add.tileSprite(0, 0, 10000, 10000, 'bg');
		this.world.setBounds(0, 0, 10000, 10000);

		this.firstLayerMap = this.map.createLayer('map1');
		this.firstLayerMap.resizeWorld();
		this.firstLayerMap.smoothed = false;

		this.secondLayerMap = this.map.createLayer('map2');
		this.secondLayerMap.resizeWorld();
		this.secondLayerMap.smoothed = false;

		// PathFinder
		let arr = [];
		console.log(this.map.tilesets[0].total);
		for(let i in this.map.tilesets[0].tileProperties) {
			if(this.map.tilesets[0].tileProperties[i].solid === 'false') arr.push(+i);
			else {
				this.map.setCollision(+i, true, this.firstLayerMap);
				this.map.setCollision(+i, true, this.secondLayerMap);
			}
		}

		this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
		this.pathfinder.setGrid(this.map.layers[0].data, arr);

		this._createTextAreas();
		this._createDeadAreas();
		this._createPatruleFlags();
		this._createItems();
		this._createEnemies();

		// group for bullets
		this.bullets = this.add.group();

		// Player
		let posPlayer = this.map.objects.player[0];
		this.player = new Player(this, posPlayer.x+posPlayer.width/2, posPlayer.y+posPlayer.height/2);
	}
	_createEnemies() {
		this.enemies = this.game.add.group();
		this.map.objects.spawner && this.map.objects.spawner.forEach((spawn) => {
			let enemy = new Enemy(this, spawn.x+spawn.width/2, spawn.y+spawn.height/2, spawn.properties.type);
			this.enemies.add(enemy.sprite);
		});
	}
	_createItems() {
		this.items = this.add.group();
		this.items.enableBody = true;
		this.map.objects.items && this.map.objects.items.forEach((rect) => {
			let id;
			if(rect.properties.type == 'coins') id = 5;
			else if(rect.properties.type == 'health') id = 2;
			else id = 0;

			let item = this.add.sprite(rect.x+rect.width/2, rect.y+rect.height/2, 'items', id);
			item.type = rect.properties.type;
			item.smoothed = false;
			this.items.add(item);
		});		
	}
	_createPatruleFlags() {
		this.patruleFlags = [];
		this.map.objects.moving && this.map.objects.moving.forEach((rect) => {
			let rectangle = new Phaser.Rectangle(rect.x, rect.y, rect.width, rect.height)
			this.patruleFlags.push(rectangle);
		});
	}
	_createDeadAreas() {
		this.deadAreas = [];
		this.map.objects.deadArea && this.map.objects.deadAreas.forEach((rect) => {
			let rectangle = new Phaser.Rectangle(rect.x, rect.y, rect.width, rect.height)
			this.deadAreas.push(rectangle);
		});
	}

	_createTextAreas() {
		this.textAreas = [];
		this.map.objects.textAreas && this.map.objects.textAreas.forEach((rect) => {
			let rectangle = new Phaser.Rectangle(rect.x, rect.y, rect.width, rect.height)
			let i = 1;
			while(rect.properties['text' + i]) {
				rectangle['text' + i] = rect.properties['text' + i];
				i++;
			}
			this.textAreas.push(rectangle);
		});
	}

	update() {
		this.world.pivot.x = 1/this.player.sprite.x;
		this.world.pivot.y = 1/this.player.sprite.y;
		this.player._update();

		for(let i = 0; i < this.enemies.children.length; i++) {
			this.enemies.children[i].class._update();
		}

		this.bg.tilePosition.x += 1;
		this.bg.tilePosition.y += 1;
	}
}


module.exports = Level;