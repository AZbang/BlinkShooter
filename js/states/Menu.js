class Menu {
	constructor() {

	}
	create() {
		this.bg = this.game.add.tileSprite(0, 0, this.world.width, this.world.height, 'bg');

		this.label = this.add.bitmapText(this.world.centerX, 50, 'font', 'MENU', 50);
		this.label.anchor.set(0.5);
		this.label.smoothed = false;

		this.btnStart = this.add.bitmapText(this.world.centerX, this.world.centerY-20, 'font', 'START', 30);
		this.btnStart.anchor.set(0.5);
		this.btnStart.inputEnabled = true;
		this.btnStart.events.onInputDown.add(() => {
			this.add.tween(this.btnStart.scale).to({x: 1.3, y: 1.3}, 300).start();
		});
		this.btnStart.events.onInputUp.add(() => {
			this.state.start('LevelManager');
		});
		this.btnStart.events.onInputOver.add(() => {
			this.add.tween(this.btnStart.scale).to({x: 1.3, y: 1.3}, 300).start();
		});
		this.btnStart.events.onInputOut.add(() => {
			this.add.tween(this.btnStart.scale).to({x: 1, y: 1}, 300).start();
		});


		this.btnSettings = this.add.bitmapText(this.world.centerX, this.world.centerY+25, 'font', 'SETTINGS', 30);
		this.btnSettings.anchor.set(0.5);
		this.btnSettings.inputEnabled = true;
		this.btnSettings.events.onInputDown.add(() => {
			this.add.tween(this.btnSettings.scale).to({x: 1.3, y: 1.3}, 300).start();
		});
		this.btnSettings.events.onInputUp.add(() => {
			this.state.start('Settings');
		});
		this.btnSettings.events.onInputOver.add(() => {
			this.add.tween(this.btnSettings.scale).to({x: 1.3, y: 1.3}, 300).start();
		});
		this.btnSettings.events.onInputOut.add(() => {
			this.add.tween(this.btnSettings.scale).to({x: 1, y: 1}, 300).start();
		});
	}
	update() {
		this.bg.tilePosition.x += 1;
		this.bg.tilePosition.y += 1;
	}
}

module.exports = Menu;