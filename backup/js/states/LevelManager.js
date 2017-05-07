class LevelManager {
	constructor(game) {
		this.level;
	}
	create() {
		this.stage.backgroundColor = '#FD4F4F';

		// this.label = this.add.bitmapText(200, 100, 'font', 'level select', 64);

		this.buttonsLevelSelect = this.add.group();
		for(let x = 0; x < 8; x++) {
			for(let y = 0; y < 4; y++) {
				let btn = this.add.button(45*x+50, 45*y+50, 'null', this.goLevel, this);
				this.buttonsLevelSelect.add(btn);
			}
		}
		this.buttonsLevelSelect.x = this.world.centerX-30*8+10;
	}

	goLevel(i) {
		this.state.start('Level');
	}
}

module.exports = LevelManager;