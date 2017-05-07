const entities = require('./entities.json');

class Entity {
	constructor(level, x, y, type) {
		this.type = type;
		this.level = level;

		this.x = x != null ? x : 0;
		this.y = y != null ? y : 0;

		this._entity = entities[type];

		this.hp = this._entity.hp != null ? this._entity.hp : 10;
		this.jumping = this._entity.jump != null ? this._entity.jump : 2;
		this.speed = this._entity.speed != null ? this._entity.speed : 100;
		this.radiusVisibility = this._entity.radiusVisibility != null ? this._entity.radiusVisibility : 100;
		this.isJumping = false;
		this.isDead = false;

		this.headId = this._entity.head != null ? this._entity.head : 0;
		this.bodyId = this._entity.body != null ? this._entity.body : 0;
		this.weaponId = this._entity.weapon != null ? this._entity.weapon : 0;

		this._createPhaserObjects();
	}

	_createPhaserObjects() {
		this.sprite = this.level.add.sprite(this.x, this.y, 'bodies', this.bodyId);
		this.sprite.anchor.set(0.5);
		this.sprite.smoothed = false;
		this.sprite.class = this;

		this.head = this.level.make.sprite(-12, -7, 'heads', this.headId);
		this.head.smoothed = false;
		this.sprite.addChild(this.head);

		this.attachToBody = this.level.make.sprite(3.5, -4, 'attachToBody', this.weaponId);
		this.attachToBody.smoothed = false;
		this.sprite.addChild(this.attachToBody);	

		this.weapon = this.level.add.weapon(10, 'bullets');
		this.weapon.setBulletFrames(this.weaponId, this.weaponId, true);
		this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.weapon.bulletSpeed = 400;
		this.weapon.fireRate = 100;
		this.weapon.trackSprite(this.sprite, 16, 4, true);
		
		this.level.physics.arcade.enable(this.sprite);
		this.sprite.body.drag.set(150);
		this.sprite.body.maxVelocity.set(100);
		this.sprite.syncBounds = true;

		this.tweenBreathe = this.level.add.tween(this.sprite.scale)
			.to({x:1.1, y: 1.1}, 1000, Phaser.Easing.Quadratic.Out)
			.to({x: 1, y: 1})
			.loop();
		this.tweenBreathe.start();
	}

	fire() {
		let bullet = this.weapon.fire();

		if(bullet) {
			this.sprite.body.angularVelocity = -400;
			this.level.physics.arcade.accelerationFromRotation(this.sprite.rotation, 300, this.sprite.body.acceleration);
			bullet.smoothed = false;
			bullet.scale.setTo(this.sprite.scale.x/2, this.sprite.scale.y/2);
			bullet.body.updateBounds();
		}
	}

	jump(power) {
		this.isJumping = true;
		this.tweenBreathe.pause();

		this.tweenJump = this.level.add.tween(this.sprite.scale)
			.to({x: power, y: power}, 300, Phaser.Easing.Quadratic.Out)
			.to({x: 1, y: 1}, 300, Phaser.Easing.Quintic.In)
			.start();
		this.tweenJump.onComplete.add(() => {
			this.isJumping = false;
			this.tweenBreathe.resume();
			this.weapon.trackSprite(this.sprite, 16*this.sprite.scale.x, 4*this.sprite.scale.y, true);
		}, this);
	}

	dead() {
		this.sprite.kill();
		this.isDead = true;
	}

	fallDead() {
		this.isDead = true;
		let dead = this.level.add.tween(this.sprite.scale).to({
			x: 0, 
			y: 0
		}, 300, Phaser.Easing.Quadratic.In, true);
		dead.onComplete.add(() => {
			this.level.state.restart();
		});
	}
}

module.exports = Entity;