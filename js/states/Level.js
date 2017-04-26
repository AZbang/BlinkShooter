class Level {
	constructor(game) {
		this.map1 = game.add.tilemap('map', 16, 16);
		this.map1.addTilesetImage('tilemap');

		game.add.tileSprite(0, 0, 10000, 10000, 'bg');
		game.world.setBounds(0, 0, 10000, 10000);

		this.layer1 = this.map1.createLayer(0);
		this.layer1.resizeWorld();
	}
}


module.exports = Level;