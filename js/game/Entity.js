const Weapon = require('./Weapon.js');
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
		this.attachToBodyId = this._entity.attachToBody != null ? this._entity.attachToBody : 0;
		this.weaponId = this._entity.weapon != null ? this._entity.weapon : 'blaster';

		this._createPhaserObjects();
	}

	_createPhaserObjects() {
		this.fxJump = this.level.add.sprite(this.x, this.y, 'fx_jump', 0);
		this.fxJump.alpha = 0;
		this.fxJump.scale.set(2);
		this.fxJump.anchor.set(0.5);
		this.fxJump.smoothed = false;
		this.fxJump.animations.add('active');

		this.sprite = this.level.add.sprite(this.x, this.y, 'bodies', this.bodyId);
		this.sprite.anchor.set(0.5);
		this.sprite.smoothed = false;
		this.sprite.class = this;

		this.head = this.level.make.sprite(-12, -7, 'heads', this.headId);
		this.head.smoothed = false;
		this.sprite.addChild(this.head);

		this.attachToBody = this.level.make.sprite(3.5, -4, 'attachToBody', this.attachToBodyId);
		this.attachToBody.smoothed = false;
		this.sprite.addChild(this.attachToBody);	

		this.weapon = new Weapon(this, this.weaponId);
		
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

	_update() {
		if(this.isDead) return;

		// update weapon collisions
		this.weapon.update();

		// collision person with bullets
		let bullets = this.level.bullets.children;
		for(let i = 0; i < bullets.length; i++) {
			if(this.constructor.name === bullets[i].typeOwner) continue;

			this.level.physics.arcade.overlap(bullets[i], this.sprite, (person, bullet) => {
				if(!this.isJumping && bullet.scale.x < 1) {
					bullet.kill();
					this.onWounded && this.onWounded();
				}
			});
		}
		// colliding with solid tiles
		this.level.physics.arcade.collide(this.sprite, this.level.layerMap);

		// colliding with empty map (dead)
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

		// updating tracking weapon with sprite during jumping
		if(this.isJumping) this.weapon.updateTrack();

		// extends update!
		this.update && this.update();
	}

	jump(power=this.jumping) {
		this.isJumping = true;
		this.tweenBreathe.pause();

		this.tweenJump = this.level.add.tween(this.sprite.scale)
			.to({x: power, y: power}, 300, Phaser.Easing.Quadratic.Out)
			.to({x: 1, y: 1}, 300, Phaser.Easing.Quintic.In)
			.start();
		this.tweenJump.onComplete.add(() => {
			this.isJumping = false;
			this.tweenBreathe.resume();
			this.weapon.updateTrack();
		}, this);
	}

	dead() {
		this.sprite.kill();
		this.isDead = true;
		this.onDead && this.onDead();
	}

	fallDead() {
		this.isDead = true;
		let dead = this.level.add.tween(this.sprite.scale).to({
			x: 0, 
			y: 0
		}, 300, Phaser.Easing.Quadratic.In, true);
		dead.onComplete.add(() => {
			this.onDead && this.onDead();
		});
	}
}

module.exports = Entity;