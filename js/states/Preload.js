const UI = require('../mixins/UI.js');

class Preload {
	init() {
		UI.game = this;
		this.game.totalLevels = 2;
	}
	preload() {
		// Music
		this.load.audio('music1', '../assets/music/theme-1.ogg');
		this.load.audio('music2', '../assets/music/theme-2.ogg');
		this.load.audio('music3', '../assets/music/theme-3.ogg');
		this.load.audio('music4', '../assets/music/theme-4.wav');

		// Images
		this.load.image('bg', '../assets/bg.png');

		//  UI
		this.load.image('lifebox', '../assets/UI/lifebox.png');
		this.load.image('liferect', '../assets/UI/liferect.png');
		this.load.image('window', '../assets/UI/window.png');
		this.load.image('vjoy_body', '../assets/UI/body.png');
		this.load.image('vjoy_cap', '../assets/UI/button.png');
		this.load.image('buttonJump', '../assets/UI/buttonJump.png');
		this.load.image('buttonFire', '../assets/UI/buttonFire.png');

		// Animations
		this.load.spritesheet('fx_jump', '../assets/animations/jump.png', 47, 45, 6);
		this.load.spritesheet('fx_fire', '../assets/animations/fire.png', 32, 33, 6);
		this.load.spritesheet('fx_explosion', '../assets/animations/explosion.png', 35, 36, 7);
		this.load.spritesheet('fx_hit', '../assets/animations/hit.png', 16, 16, 6);
		this.load.spritesheet('fx_collide', '../assets/animations/collide.png', 37, 37, 6);
		this.load.spritesheet('fx_voice', '../assets/animations/voice.png', 20, 20, 7);
		this.load.spritesheet('token', '../assets/animations/token.png', 20, 20, 9);
		this.load.spritesheet('legs', '../assets/animations/legs.png', 15, 17, 4);

		// Fonts
		this.load.bitmapFont('font', '../assets/fonts/font.png', '../assets/fonts/font.xml');
		this.load.bitmapFont('font2', '../assets/fonts/font2.png', '../assets/fonts/font2.xml');

		// Game Atlases
		this.load.atlas('heads', 'assets/atlases/heads.png', 'assets/atlases/heads.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('bodies', 'assets/atlases/bodies.png', 'assets/atlases/bodies.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('attachToBody', 'assets/atlases/attachToBody.png', 'assets/atlases/attachToBody.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('weapons', 'assets/atlases/weapons.png', 'assets/atlases/weapons.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('items', 'assets/atlases/items.png', 'assets/atlases/items.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('bullets', 'assets/atlases/bullets.png', 'assets/atlases/bullets.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('ui', 'assets/UI/ui.png', 'assets/UI/ui.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

		// Levels
		let i = 1;
		for(; i <= this.game.totalLevels; i++) {
			this.load.tilemap('level' + i, '../assets/levels/level' + i + '.json', null, Phaser.Tilemap.TILED_JSON);
		}
		this.load.image('tilemap', '../assets/levels/tilemap.png');
	}

	create() {
		let musics = [
			this.add.audio('music1'),
			this.add.audio('music2'),
			this.add.audio('music3'),
			this.add.audio('music4')
		];
		for(let i = 0; i < musics.length; i++) {
			(() => {
				let next = i+1 > musics.length-1 ? 0 : i+1;
				musics[i].onStop.add(() => musics[next].play());
			})();
		}
		musics[0].play();
		this.game.musics = musics;

		this.game.currentLevel = 1;
		this.state.start('Menu');
	}
}

module.exports = Preload;