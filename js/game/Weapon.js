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
		}
	}
	update() {
		this.level.physics.arcade.collide(this.weapon.bullets, this.level.layerMap, (bullet) => {
			bullet.kill();
			// animation #bang!
		});
	}
}

module.exports = Weapon;