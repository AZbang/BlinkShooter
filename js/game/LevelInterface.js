
class LevelInterface {
	constructor(level, data) {
		this.level = level;

		this.padding = {
			x: 10,
			y: 10
		}

		// HP BAR
		this.hp = data.hp;
		this.lifebox = this.level.add.sprite(this.padding.x, this.padding.y, 'lifebox');
		this.lifebox.fixedToCamera = true;
		for(let i = 0; i < this.hp; i++) {
			let life = this.level.add.sprite(7*i+12, 6, 'liferect');
			this.lifebox.addChild(life);
		}

		// SCORES
		this.scores = data.scores;
		this.textScores = this.level.add.bitmapText(this.padding.x+10,  this.padding.y+30, 'font', this.scores, 20);
		this.textScores.fixedToCamera = true;
		this.textScores.smoothed = false;
	}

	subtractHP() {

	}
	addHP() {
		
	}
	setHP() {
		
	}
	setScores() {
		
	}
	addScores(val) {
		let timer = this.level.time.create(false);
		let top = this.scores+val;
		timer.loop(100, () => {
			if(this.scores === top) {
				timer.remove();
				return;
			}
			this.scores++;
			this.textScores.text = this.scores;
		});
		timer.start();
	}
	subtractScores(val) {
		let top = this.scores-val;
		if(!top) return false;

		let timer = this.level.time.create(false);
		timer.loop(100, () => {
			if(this.scores === top) {
				timer.remove();
				return;
			}
			this.scores--;
			this.textScores.text = this.scores;
		});
		timer.start();
		return true;
	}
}

module.exports = LevelInterface;


