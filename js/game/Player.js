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
	}

	update() {
		// Items use
		this.level.physics.arcade.overlap(this.sprite, this.level.items, (sprite, item) => {
			if(item.type == 'health') this.interface.setHP(this.interface.hp+2);
			else this.interface.setScores(this.interface.scores+100);
			item.kill();
		});

		// Show text window
		for(let i = 0; i < this.level.textAreas.length; i++) {
			let rect = this.level.textAreas[i];

			let pl = new Phaser.Rectangle(this.sprite.body.x, this.sprite.body.y, this.sprite.body.width, this.sprite.body.height);
			if(Phaser.Rectangle.intersects(rect, pl)) {
				this.interface.showTextWindow(rect);
				this.level.textAreas.splice(i, 1);
				return;
			}
		}

		if(this.cursors.up.isDown)
			this.level.physics.arcade.accelerationFromRotation(this.sprite.rotation, 300, this.sprite.body.acceleration);

		else this.sprite.body.acceleration.set(0);

		if(this.cursors.left.isDown)
			this.sprite.body.angularVelocity = -200;

		else if(this.cursors.right.isDown)
			this.sprite.body.angularVelocity = 200;

		else this.sprite.body.angularVelocity = 0;

		if(this.fireButton.isDown && this.interface.scores) {
			this.weapon.fire() && this.interface.setScores(this.interface.scores-10);
		}

		if(this.jumpButton.isDown && !this.isJumping) {
			this.fxJump.play('active', 20);
			this.fxJump.alpha = 1;
			this.fxJump.x = this.sprite.body.x+5;
			this.fxJump.y = this.sprite.body.y+5;
			this.level.add.tween(this.fxJump).to({alpha: 0}, 600).start();
			this.jump(this.jumping);
		}
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