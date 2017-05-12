const weapons = require('./weapons.json');

class Weapon {
	constructor(person, type) {
		this.level = person.level;
		this.person = person;

		this._weapons = weapons[type];
		this.id = this._weapons.id != null ? this._weapons.id : 0;
		this.trackX = this._weapons.trackX != null ? this._weapons.trackX : 16;
		this.trackY = this._weapons.trackY != null ? this._weapons.trackY : 4;
		this.speed = this._weapons.speed != null ? this._weapons.speed : 100;
		this.damage = this._weapons.damage != null ? this._weapons.damage : 1;
		this.delay = this._weapons.delay != null ? this._weapons.delay : 10;
		this.quantity = this._weapons.quantity != null ? this._weapons.quantity : 1;

		this.weapon = this.level.add.weapon(this.quantity, 'bullets', this.id, this.level.bullets);
		this.weapon.setBulletFrames(this.id, this.id, true);
		this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.weapon.bulletSpeed = this.speed;
		this.weapon.fireRate = this.delay; 
		this.weapon.bullets.typeOwner = this.person.constructor.name;

		this.fxFire = this.level.add.sprite(0, 0, 'fx_fire', 0);
		this.fxFire.alpha = 0;
		this.fxFire.scale.set(2);
		this.fxFire.anchor.set(0.5);
		this.fxFire.smoothed = false;
		this.fxFire.animations.add('active');

		this.fxCollide = this.level.add.sprite(0, 0, 'fx_explosion', 0);
		this.fxCollide.alpha = 0;
		this.fxCollide.anchor.set(0.5);
		this.fxCollide.smoothed = false;
		this.fxCollide.animations.add('active');

		this.updateTrack();
	}

	updateTrack() {
		let x = this.trackX*this.person.sprite.scale.x;
		let y = this.trackY*this.person.sprite.scale.y;
		
		this.weapon.trackSprite(this.person.sprite, x, y, true);
	}
	fire() {
		let bullet = this.weapon.fire();

		if(bullet) {
			bullet.smoothed = false;
			bullet.scale.setTo(this.person.sprite.scale.x/2, this.person.sprite.scale.y/2);
			bullet.body.updateBounds();

			this.person.sprite.body.velocity.x -= Math.cos(this.person.sprite.rotation) * 100;
			this.person.sprite.body.velocity.y -= Math.sin(this.person.sprite.rotation) * 100;

			this.fxFire.scale.x = this.person.sprite.scale.x;
			this.fxFire.scale.y = this.person.sprite.scale.y;
			this.fxFire.x = this.weapon._rotatedPoint.x;
			this.fxFire.y = this.weapon._rotatedPoint.y;
			this.fxFire.alpha = 1;
			this.fxFire.play('active', 20);
			this.level.add.tween(this.fxFire).to({alpha: 0}, 600).start();

			return true;
		}
	}
	update() {
		this.level.physics.arcade.collide(this.weapon.bullets, this.level.layerMap, (bullet) => {
			this.fxCollide.x = bullet.x;
			this.fxCollide.y = bullet.y;
			this.fxCollide.alpha = 1;
			this.fxCollide.play('active', 100);
			this.level.add.tween(this.fxCollide).to({alpha: 0}, 300).start();

			bullet.kill();
		});
	}
}

module.exports = Weapon;