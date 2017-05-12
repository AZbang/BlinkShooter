class Preload {
	constructor() {

	}
	preload() {
		this.load.audio('music1', '../assets/music/theme-1.ogg');
		this.load.audio('music2', '../assets/music/theme-2.ogg');
		this.load.audio('music3', '../assets/music/theme-3.ogg');
		this.load.audio('music4', '../assets/music/theme-4.wav');

		this.load.image('bg', '../assets/bg.png');
		this.load.image('tilemap', '../assets/levels/tilemap.png');
		this.load.image('lifebox', '../assets/hud/lifebox.png');
		this.load.image('liferect', '../assets/hud/liferect.png');
		this.load.image('score', '../assets/hud/score.png');
		this.load.image('window', '../assets/window.png');

		this.load.spritesheet('fx_jump', '../assets/FX/jump.png', 47, 45, 6);
		this.load.spritesheet('fx_fire', '../assets/FX/fire.png', 32, 33, 6);
		this.load.spritesheet('fx_explosion', '../assets/FX/explosion.png', 35, 36, 7);
		this.load.spritesheet('fx_hit', '../assets/FX/hit.png', 16, 16, 6);
		this.load.spritesheet('fx_collide', '../assets/FX/collide.png', 37, 37, 6);

		this.load.spritesheet('legs', '../assets/legs.png', 15, 17, 4);

		this.load.bitmapFont('font', '../assets/font.png', '../assets/font.xml');
		this.load.bitmapFont('font2', '../assets/font2.png', '../assets/font2.xml');

		this.load.atlas('heads', 'assets/atlases/heads.png', 'assets/atlases/heads.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('bodies', 'assets/atlases/bodies.png', 'assets/atlases/bodies.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('attachToBody', 'assets/atlases/attachToBody.png', 'assets/atlases/attachToBody.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('weapons', 'assets/atlases/weapons.png', 'assets/atlases/weapons.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('items', 'assets/atlases/items.png', 'assets/atlases/items.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('bullets', 'assets/atlases/bullets.png', 'assets/atlases/bullets.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
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

		this.state.start('Menu');
	}
}

module.exports = Preload;