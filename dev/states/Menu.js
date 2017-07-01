const UI = require('../mixins/UI.js');

class Menu {
	create() {
		this.world.setBounds(0, 0, 480, 320);
		this.bg = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'bg');

		this.labelPath1 = UI.addText(160, 50, 'font', 'BLINK', 35);
		this.add.tween(this.labelPath1)
			.to({alpha: 0}, 200)
			.to({alpha: 1}, 100)
			.start()
			.loop();

		this.labelPart2 = UI.addText(320, 55, 'font', 'SHOOTER', 25);


		this.btnStart = UI.addTextButton(this.world.centerX, this.world.centerY-35, 'font', 'START', 30, () => {
			this.state.start('LevelManager');
		});
		this.btnSettings = UI.addTextButton(this.world.centerX, this.world.centerY+10, 'font', 'SETTINGS', 30, () => {
			this.state.start('Settings');
		});

		this.info = UI.addText(10, 5, 'font2', 'Powered by azbang @v0.1', 14);
		this.info.anchor.set(0);
	}
	update() {
		this.bg.tilePosition.x += 1;
		this.bg.tilePosition.y += 1;
	}
}

module.exports = Menu;