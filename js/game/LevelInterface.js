
class LevelInterface {
	constructor(level, data) {
		this.level = level;

		this.padding = {
			x: 10,
			y: 10
		}

		// HP BAR
		this.lifebox = this.level.add.sprite(this.padding.x, this.padding.y, 'lifebox');
		this.lifebox.fixedToCamera = true;
		this.hp = data.hp;
		for(let i = 0; i < this.hp; i++) {
			let life = this.level.add.sprite(7*i+12, 6, 'liferect');
			this.lifebox.addChild(life);
		}

		// SCORES
		this.scores = data.scores;
		this.textScores = this.level.add.bitmapText(this.padding.x+10,  this.padding.y+30, 'font', this.scores, 20);
		this.textScores.fixedToCamera = true;
		this.textScores.smoothed = false;

		this.timerHP = this.level.time.create(false);
		this.timerScores = this.level.time.create(false);
	}

	setHP(val) {
		if(val < 0 || val >= 8) return;

		let sign = val-this.hp > 0 ? 1 : 0;

		this.timerHP.loop(100, () => {
			if(this.hp === val || this.hp < 1 || this.hp > 8) {
				this.timerHP.stop();
				return;
			}
			this.level.add.tween(this.lifebox.children[this.hp-1])
				.to({alpha: sign}, 20)
				.to({alpha: 1-sign}, 20)
				.to({alpha: sign}, 20)
				.to({alpha: 1-sign}, 20)
				.to({alpha: sign}, 20)
				.start();
			sign ? this.hp++ : this.hp--;
		});
		this.timerHP.start();
	}
	setScores(val) {
		let sign = val-this.scores > 0 ? 1 : 0;
		this.timerScores.loop(10, () => {
			if(this.scores === val || this.scores <= 0) {
				this.timerScores.stop();
				return;
			}
			sign ? this.scores++ : this.scores--;
			this.textScores.text = this.scores;
		});
		this.timerScores.start();
	}
}

module.exports = LevelInterface;


