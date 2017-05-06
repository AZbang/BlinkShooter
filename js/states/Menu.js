class Menu {
	constructor() {

	}
	create() {
		this.stage.backgroundColor = '#6BADFF';

		// this.label = this.add.retroFont('font', 31, 25, Phaser.RetroFont.TEXT_SET6, 10, 1, 1);
		// this.label.text = 'menu';

		// this.labelBtnStart = this.add.retroFont('font', 31, 25, Phaser.RetroFont.TEXT_SET6, 10, 1, 1);
		// this.labelBtnStart.text = 'START';
		// this.labelBtnStart.x = this.world.centerX;
		// this.labelBtnStart.y = this.world.centerY;
		this.btnStart = this.add.button(this.world.centerX, this.world.centerY-20, 'null', this.goLevelManager, this);
		this.btnStart.width = 200;
		this.btnStart.height = 80;
		this.btnStart.anchor.set(0.5, 0.5);
	}

	goLevelManager() {
		this.state.start('LevelManager');
	}
}

module.exports = Menu;