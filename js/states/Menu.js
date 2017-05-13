class Menu {
	create() {
		this.bg = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'bg');

		this.labelPath1 = this.add.bitmapText(87, 25, 'font', 'BLINK', 35);
		this.labelPath1.smoothed = false;
		this.add.tween(this.labelPath1)
			.to({alpha: 0}, 200)
			.to({alpha: 1}, 100)
			.start()
			.loop();

		this.labelPart2 = this.add.bitmapText(248, 35, 'font', 'SHOOTER', 25);
		this.labelPart2.smoothed = false;

		this.btnStart = this.add.bitmapText(this.world.centerX, this.world.centerY-35, 'font', 'START', 30);
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


		this.btnSettings = this.add.bitmapText(this.world.centerX, this.world.centerY+10, 'font', 'SETTINGS', 30);
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

		this.info = this.add.bitmapText(10, this.world.height-75, 'font2', 'Powered by azbang @v0.1', 14);
		this.info.smoothed = false;
	}
	update() {
		this.bg.tilePosition.x += 1;
		this.bg.tilePosition.y += 1;
	}
}

module.exports = Menu;