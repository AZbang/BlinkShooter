const UI = require('../mixins/UI.js');

class Settings {
	create() {
		this.world.setBounds(0, 0, 480, 320);
		this.bg = this.game.add.tileSprite(0, 0, this.world.width, this.world.height, 'bg');

		this.label = UI.addText(this.world.centerX+20, 50, 'font', 'SETTINGS', 30);

		this.btnClose = UI.addIconButton(110, 45, 'ui', 0, () => this.state.start('Menu'));

		this.param1 = UI.addText(this.world.centerX, 130, 'font', 'MUSIC ON', 30);
		this.param2 = UI.addText(this.world.centerX, 170, 'font', 'SOUNDS ON', 30);

		this.info = UI.addText(10, 5, 'font2', 'Powered by azbang @v0.1', 14);
		this.info.anchor.set(0);
	}
	update() {
		this.bg.tilePosition.x += 1;
		this.bg.tilePosition.y += 1;
	}
}

module.exports = Settings;