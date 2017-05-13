class Settings {
	create() {
		this.bg = this.game.add.tileSprite(0, 0, this.world.width, this.world.height, 'bg');

		this.label = this.add.bitmapText(this.world.centerX, 50, 'font', 'SETTINGS', 30);
		this.label.anchor.set(0.5);
		this.label.smoothed = false;
	}
	update() {
		this.bg.tilePosition.x += 1;
		this.bg.tilePosition.y += 1;
	}
}

module.exports = Settings;