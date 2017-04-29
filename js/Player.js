const Entity = require('./Entity.js');

class Player extends Entity {
	constructor(game, x, y) {
		super(game, x, y, 'player');

		this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON , 0.1, 0.1);

		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
	}

	update() {
		if(this.isDead) return;

		this.game.physics.arcade.collide(this.sprite, this.game.level.layerMap);
		if(!this.isJumping) {
			for(let i = 0; i < this.game.level.deadRects.length; i++) {
				let rect = this.game.level.deadRects[i];

				let pl = new Phaser.Rectangle(this.sprite.body.x, this.sprite.body.y, this.sprite.body.width, this.sprite.body.height);
				if(Phaser.Rectangle.intersects(rect, pl)) {
					this.sprite.body.acceleration.set(0);
					this.fallDead();
					return;
				}
			}
		}
		this.weapon.forEach((bullet) => {
			this.game.level.enemies.forEach((enemy) => {
				this.game.physics.arcade.overlap(bullet, enemy, (b, e) => {b.kill(); e.kill()}, null, this);
			});
		});

		if(this.isJumping)
			this.weapon.trackSprite(this.sprite, 16*this.sprite.scale.x, 4*this.sprite.scale.y, true);

		if(this.cursors.up.isDown)
			this.game.physics.arcade.accelerationFromRotation(this.sprite.rotation, 300, this.sprite.body.acceleration);

		else this.sprite.body.acceleration.set(0);

		if(this.cursors.left.isDown)
			this.sprite.body.angularVelocity = -300;

		else if(this.cursors.right.isDown)
			this.sprite.body.angularVelocity = 300;

		else this.sprite.body.angularVelocity = 0;

		if(this.fireButton.isDown)
			this.fire();

		if(this.jumpButton.isDown && !this.isJumping) {
			this.jump(this.jumping);
		}

	}
}
			
module.exports = Player;