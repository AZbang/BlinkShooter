
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
		this.timerText = this.level.time.create(false);

		// TEXT WINDOW
		this.textWindow = this.level.add.sprite(90, this.padding.y, 'window');
		this.textWindow.alpha = 0;
		this.textWindow.fixedToCamera = true;
		this.textWindow.inputEnabled = true;

		let content = this.level.add.bitmapText(20,  5, 'font2', null, 13);
		this.textWindow.addChild(content);

		let infoText = this.level.add.bitmapText(this.textWindow.width-5, this.textWindow.height-10, 'font2', 'TAP TO CONTINUE', 15);
		infoText.anchor.set(1);
		this.textWindow.addChild(infoText);

		this.blinkInfoText = this.level.add.tween(infoText)
			.to({alpha: 0}, 300)
			.to({alpha: 1}, 300)
			.loop();

		this.fxVoice = this.level.add.sprite(this.padding.x+15, this.textWindow.height+this.textWindow.y, 'fx_voice', 0);
		this.fxVoice.anchor.set(0, 1);
		this.fxVoice.scale.set(2);
		this.fxVoice.alpha = 0;
		this.fxVoice.fixedToCamera = true;
		this.fxVoice.smoothed = false;
		this.fxVoice.animations.add('active');
	}

	showTextWindow(info, current=1) {
		this.textWindow.children[0].text = '';

		if(info['text' + current]) {
			this.level.add.tween(this.textWindow)
				.to({alpha: 1}, 500)
				.start();

			this.blinkInfoText.start();

			this.fxVoice.alpha = 1;
			this.fxVoice.play('active', 10, true);

			this.textWindow.inputEnabled = true;
			this.textWindow.events.onInputUp.add(() => {
				this.showTextWindow(info, current+1);
			});

			let i = 0;
			let txt = info['text' + current];
			this.timerText.loop(50, () => {
				if(!txt[i]) {
					this.timerText.stop();
					return;
				}
				this.textWindow.children[0].text += txt[i];
				i++;
			});
			this.timerText.start();
		} else {
			this.fxVoice.alpha = 0;
			this.fxVoice.animations.stop(null, true);
			this.blinkInfoText.stop();
			this.timerText.stop();
			this.level.add.tween(this.textWindow)
				.to({alpha: 0}, 500)
				.start();
			this.textWindow.inputEnabled = false;
			this.currentTextWindow = 1;
		}
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
		}).start();
	}
	setScores(val) {
		this.tweenCoins && this.tweenCoins.stop();
		this.tweenCoins = this.level.add.tween(this.textScores);
		this.tweenCoins
			.to({text: val}, 1000)
			.start();
		this.tweenCoins.onUpdateCallback((f, v) => {
			this.textScores.text = Math.round(this.textScores.text);
		});
	}
}

module.exports = LevelInterface;
