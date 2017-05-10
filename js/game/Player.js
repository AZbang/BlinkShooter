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
		// Bonuses use (mrrr)
		this.level.physics.arcade.overlap(this.sprite, this.level.bonuses, (sprite, bonus) => {
			if(bonus.type == 'health') this.interface.setHP(this.interface.hp+2);
			else this.interface.setScores(this.interface.scores+100);
			bonus.kill();
		});

		if(this.cursors.up.isDown)
			this.level.physics.arcade.accelerationFromRotation(this.sprite.rotation, 300, this.sprite.body.acceleration);

		else this.sprite.body.acceleration.set(0);

		if(this.cursors.left.isDown)
			this.sprite.body.angularVelocity = -300;

		else if(this.cursors.right.isDown)
			this.sprite.body.angularVelocity = 300;

		else this.sprite.body.angularVelocity = 0;

		if(this.fireButton.isDown && this.interface.scores) {
			this.weapon.fire() && this.interface.setScores(this.interface.scores-10);
		}

		if(this.jumpButton.isDown && !this.isJumping)
			this.jump(this.jumping);
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