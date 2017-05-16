const UI = require('../mixins/UI.js');

class LevelManager {
	create() {
		this.world.setBounds(0, 0, 480, 320);
		this.bg = this.game.add.tileSprite(0, 0, this.world.width, this.world.height, 'bg');

		this.label = UI.addText(this.world.centerX+20, 50, 'font', 'LEVEL SELECT', 30);
		this.buttonsLevelSelect = this.add.group();
		let i = 0;
		for(let y = 0; y < 3; y++) {
			for(let x = 0; x < 8; x++) {
				i++;
				let btn = UI.addTextButton(45*x+80, 45*y+110, 'font', i, 18, () => {
					this.game.currentLevel = btn.level;
					this.goLevel();
				});
				btn.level = i;
				if(i > this.game.totalLevels) {
					btn.tint = 0xB0B0B0;
					btn.disable = true;
				} 
				this.buttonsLevelSelect.add(btn);
			}
		}
		this.buttonsLevelSelect.x = this.world.centerX-30*8;

		this.btnClose = UI.addIconButton(60, 45, 'ui', 0, () => this.state.start('Menu'));

		this.info = UI.addText(10, 220, 'font2', 'Powered by azbang @v0.1', 14);
		this.info.anchor.set(0);
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