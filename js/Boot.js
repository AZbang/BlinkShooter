const Level = require('./states/Level.js');

class Boot {
	constructor(game) {
		this.game = game;
	}

	preload() {
		this.load.tilemap('map', '../assets/levels/test/level.json', null, Phaser.Tilemap.TILED_JSON);
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
		this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);


		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		this.game.scale.setMaximum();

		this.game.renderer.renderSession.roundPixels = true;
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.level = new Level(this);
	}

	update() {
		this.level.update();
	}
}

module.exports = Boot;