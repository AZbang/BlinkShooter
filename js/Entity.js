const entities = require('./entities.json');

class Entity {
	constructor(game, x, y, type) {
		this.type = type;
		this.game = game;

		this.x = x != null ? x : 0;
		this.y = y != null ? y : 0;

		this._entity = entities[type];

		this.hp = this._entity.hp != null ? this._entity.hp : 10;
		this.jumping = this._entity.jump != null ? this._entity.jump : 2;
		this.speed = this._entity.speed != null ? this._entity.speed : 100;
		this.isJumping = false;

		this.headId = this._entity.head != null ? this._entity.head : 0;
		this.bodyId = this._entity.body != null ? this._entity.body : 0;
		this.weaponId = this._entity.weapon != null ? this._entity.weapon : 0;

		this._createPhaserObjects();
	}

	_createPhaserObjects() {
		this.sprite = this.game.add.sprite(this.x, this.y, 'bodies', this.bodyId);
		this.sprite.anchor.set(0.5);
		this.sprite.smoothed = false;

		this.head = this.game.make.sprite(-12, -7, 'heads', this.headId);
		this.head.smoothed = false;
		this.sprite.addChild(this.head);

		this.attachToBody = this.game.make.sprite(3.5, -4, 'attachToBody', this.weaponId);
		this.attachToBody.smoothed = false;
		this.sprite.addChild(this.attachToBody);	

		this.weapon = this.game.add.weapon(10, 'bullets');
		this.weapon.setBulletFrames(this.weaponId, this.weaponId, true);
		this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.weapon.bulletSpeed = 400;
		this.weapon.fireRate = 50;
		this.weapon.trackSprite(this.sprite, 16, 4, true);
	}

	fire() {
		let bullet = this.weapon.fire();

		if(bullet) {
			this.sprite.body.angularVelocity = -400;
			this.game.physics.arcade.accelerationFromRotation(this.sprite.rotation, 300, this.sprite.body.acceleration);
			bullet.smoothed = false;
			bullet.scale.setTo(this.sprite.scale.x/2, this.sprite.scale.y/2);
			return (bullet.body.updateBounds)();
		}
	}

	jump(power) {
		this.isJumping = true;

		let tweenUp = this.game.add.tween(this.sprite.scale).to({
			x: power, 
			y: power
		}, 300, Phaser.Easing.Quadratic.Out, true);

		tweenUp.onComplete.add(() => {
			this.sprite.body.updateBounds();

			let tweenDown = this.game.add.tween(this.sprite.scale).to({
				x: 1,
				y: 1
			}, 300, Phaser.Easing.Quintic.In, true);


			tweenDown.onComplete.add(() => {
				this.isJumping = false;
				this.weapon.trackSprite(this.sprite, 16*this.sprite.scale.x, 4*this.sprite.scale.y, true);
			}, this);
					
		}, this);
	}
}

module.exports = Entity;