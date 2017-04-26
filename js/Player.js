const Entity = require('./Entity.js');

class Player extends Entity {
	constructor(game, x, y) {
		super(game, x, y, 'player');

		this.game.physics.arcade.enable(this.sprite);
		this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON , 0.1, 0.1);

		this.sprite.body.drag.set(150);
		this.sprite.body.maxVelocity.set(100);

		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	}

	update() {
		if(this.isJumping)
			this.weapon.trackSprite(this.sprite, 16*this.sprite.scale.x, 4*this.sprite.scale.y, true);

		if(this.cursors.up.isDown) {
			this.fire();
			this.game.physics.arcade.accelerationFromRotation(this.sprite.rotation, 300, this.sprite.body.acceleration);
		}
		else this.sprite.body.acceleration.set(0);

		if(this.cursors.left.isDown)
			this.sprite.body.angularVelocity = -300;

		else if(this.cursors.right.isDown)
			this.sprite.body.angularVelocity = 300;

		else this.sprite.body.angularVelocity = 0;

		if(this.jumpButton.isDown && !this.isJumping) {
			this.jump(this.jumping);
		}
	}
}
			
module.exports = Player;