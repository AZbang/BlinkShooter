const Level = require('./states/Level.js');
const Player = require('./Player.js');

class Boot {
	constructor(game) {
		this.game = game;
	}

	preload() {
		this.load.tilemap('map', '../assets/levels/test/map.csv', null, Phaser.Tilemap.CSV);
		this.load.image('tilemap', '../assets/levels/tilemap.png');
		this.load.image('bg', '../assets/bg.png');
		this.load.image('person1', '../assets/_/characters/example.png');

		this.load.atlas('heads', 'assets/atlases/heads.png', 'assets/atlases/heads.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('bodies', 'assets/atlases/bodies.png', 'assets/atlases/bodies.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('attachToBody', 'assets/atlases/attachToBody.png', 'assets/atlases/attachToBody.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('weapons', 'assets/atlases/weapons.png', 'assets/atlases/weapons.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('items', 'assets/atlases/items.png', 'assets/atlases/items.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('bullets', 'assets/atlases/bullets.png', 'assets/atlases/bullets.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
	}

	create() {
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		this.game.scale.setMaximum();

		this.game.renderer.renderSession.roundPixels = true;
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.level = new Level(this);
		console.log(this)
		this.player = new Player(this, this.world.centerX, this.world.centerY);
	}

	update() {
		this.player.update();
	}
}

module.exports = Boot;