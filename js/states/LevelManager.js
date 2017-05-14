class LevelManager {
	create() {
		this.world.setBounds(0, 0, 480, 320);
		this.bg = this.game.add.tileSprite(0, 0, this.world.width, this.world.height, 'bg');

		this.label = this.add.bitmapText(this.world.centerX, 50, 'font', 'LEVEL SELECT', 30);
		this.label.anchor.set(0.5);
		this.label.smoothed = false;

		this.buttonsLevelSelect = this.add.group();
		let i = 0;
		for(let y = 0; y < 3; y++) {
			for(let x = 0; x < 8; x++) {
				i++;
				let btn = this.add.bitmapText(45*x+80, 45*y+110, 'font', i, 18);
				btn.anchor.set(0.5);
				btn.inputEnabled = true;
				btn.level = i;
				if(i > this.game.totalLevels) {
					btn.tint = 0xB0B0B0;
					btn.disable = true;
				} 
				this.buttonsLevelSelect.add(btn);
			}
		}
		this.buttonsLevelSelect.x = this.world.centerX-30*8;
		this.buttonsLevelSelect.inputEnableChildren = true;

		this.buttonsLevelSelect.onChildInputDown.add((btn) => {
			if(btn.disable) return;

			this.add.tween(btn.scale).to({x: 1.3, y: 1.3}, 300).start();
		});
		this.buttonsLevelSelect.onChildInputUp.add((btn) => {
			if(btn.disable) return;

			this.game.currentLevel = btn.level;
			this.goLevel();
		}, this);

		this.buttonsLevelSelect.onChildInputOver.add((btn) => {
			if(btn.disable) return;

			this.add.tween(btn.scale).to({x: 1.3, y: 1.3}, 300).start();
		});
		this.buttonsLevelSelect.onChildInputOut.add((btn) => {
			if(btn.disable) return;

			this.add.tween(btn.scale).to({x: 1, y: 1}, 300).start();
		});
	}

	goLevel(i) {
		this.state.start('Level');
	}

	update() {
		this.bg.tilePosition.x += 1;
		this.bg.tilePosition.y += 1;
	}
}

module.exports = LevelManager;