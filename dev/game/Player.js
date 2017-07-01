const Entity = require('./Entity.js');
const LevelInterface = require('./LevelInterface');

class Player extends Entity {
	constructor(level, x, y) {
		super(level, x, y, 'player');

		this.level.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON , 0.1, 0.1);

		this.interface = new LevelInterface(this.level, {hp: Math.min(8, this.hp), scores: 100});

		this.cursors = this.level.input.keyboard.createCursorKeys();
		this.jumpButton = this.level.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.fireButton = this.level.input.keyboard.addKey(Phaser.Keyboard.Z);

		this.buttonFire = this.level.add.button(435, 210, 'buttonFire');
		this.buttonFire.anchor.set(0.5);
		this.buttonFire.scale.set(2.5);
		this.buttonFire.smoothed = false;
		this.buttonFire.fixedToCamera = true;

		this.buttonFire.onInputDown.add(() => {
			if(this.interface.scores)
				if(this.weapon.fire()) {
					this.interface.scores -= 10;
					this.interface.setScores(this.interface.scores);
				}
		});

		this.buttonJump = this.level.add.button(375, 230, 'buttonJump');
		this.buttonJump.anchor.set(0.5);
		this.buttonJump.scale.set(2);
		this.buttonJump.smoothed = false;
		this.buttonJump.fixedToCamera = true;

		this.buttonJump.onInputDown.add(() => {
			if(!this.isJumping) {
				this.fxJump.play('active', 20);
				this.fxJump.alpha = 1;
				this.fxJump.x = this.sprite.body.x+5;
				this.fxJump.y = this.sprite.body.y+5;
				this.level.add.tween(this.fxJump).to({alpha: 0}, 600).start();
				this.jump(this.jumping);
			}
		});
	}

	update() {
		// Items use
		this.level.physics.arcade.overlap(this.sprite, this.level.items, (sprite, item) => {
			if(item.isCollide) return;

			if(item.type == 'health') this.interface.setHP(this.interface.hp+2);
			else if(item.type == 'coins') {
				this.interface.scores += 100;
				this.interface.setScores(this.interface.scores);
			} else if(item.type == 'cartridge') this.isCatridgeUse = true;

			item.tween && item.tween.stop();
			item.isCollide = true;
			this.level.add.tween(item.scale)
				.to({x: 0, y: 0}, 600, Phaser.Easing.Bounce.In)
				.start()
				.onComplete.add(() => item.kill);
		});


		let pl = new Phaser.Rectangle(this.sprite.body.x, this.sprite.body.y, this.sprite.body.width, this.sprite.body.height);

		if(this.isCatridgeUse) {
			if(Phaser.Rectangle.intersects(this.level.nextLevelArea, pl)) {
				this.level.nextLevel();
				this.isCatridgeUse = false;

			}
		}

		// Show text window
		for(let i = 0; i < this.level.textAreas.length; i++) {
			let rect = this.level.textAreas[i];
			if(Phaser.Rectangle.intersects(rect, pl)) {
				this.interface.showTextWindow(rect);
				this.level.textAreas.splice(i, 1);
				return;
			}
		}

		let rad = Phaser.Math.degToRad(Phaser.Math.radToDeg(this.level.vjoy.rotation));
		if(this.level.vjoy.isDown) {
			this.level.physics.arcade.velocityFromRotation(rad, 100, this.sprite.body.velocity);
			this.sprite.rotation = rad;
		} else this.sprite.body.velocity.set(0);
	}

	onWounded() {
		this.interface.setHP(this.interface.hp-1);
		this.interface.hp === 0 && this.onDead();
	}

	onDead() {
		this.level.state.restart();
	}
}

module.exports = Player;
