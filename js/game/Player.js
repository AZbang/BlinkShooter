const Entity = require('./Entity.js');

class Player extends Entity {
	constructor(level, x, y) {
		super(level, x, y, 'player');

		this.level.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON , 0.1, 0.1);

		this.cursors = this.level.input.keyboard.createCursorKeys();
		this.jumpButton = this.level.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.fireButton = this.level.input.keyboard.addKey(Phaser.Keyboard.Z);
	}

	update() {
		if(this.isDead) return;

		this.level.physics.arcade.collide(this.weapon.bullets, this.level.layerMap, (bullet) => {
			bullet.kill();
		}, null, this);
		this.level.physics.arcade.collide(this.weapon.bullets, this.level.enemies, (bullet, enemy) => {
			if(!enemy.class.isJumping) {
				bullet.kill();
				enemy.class.dead();
			}
		}, null, this);

		this.level.physics.arcade.collide(this.sprite, this.level.layerMap);
		if(!this.isJumping) {
			for(let i = 0; i < this.level.deadRects.length; i++) {
				let rect = this.level.deadRects[i];

				let pl = new Phaser.Rectangle(this.sprite.body.x, this.sprite.body.y, this.sprite.body.width, this.sprite.body.height);
				if(Phaser.Rectangle.intersects(rect, pl)) {
					this.sprite.body.acceleration.set(0);
					this.fallDead();
					return;
				}
			}
		}

		if(this.isJumping)
			this.weapon.trackSprite(this.sprite, 16*this.sprite.scale.x, 4*this.sprite.scale.y, true);

		if(this.cursors.up.isDown)
			this.level.physics.arcade.accelerationFromRotation(this.sprite.rotation, 300, this.sprite.body.acceleration);

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