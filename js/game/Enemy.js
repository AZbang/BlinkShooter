const Entity = require('./Entity');

class Enemy extends Entity {
	constructor(level, x, y, type='robot') {
		super(level, x, y, type);

		this.isMoving = false;
		this.flags = this.level.patruleFlags.slice(0);
	}
	update() {
		if(this.isDead) return;

		// Collisions
		this.level.physics.arcade.collide(this.weapon.bullets, this.level.layerMap, (bullet) => {
			bullet.kill();
		}, null, this);
		this.level.physics.arcade.collide(this.weapon.bullets, this.level.player.sprite, (player, bullet) => {
			player.class.dead();
			this.level.state.restart();
			bullet.kill();
		}, null, this);
		this.level.physics.arcade.collide(this.sprite, this.level.layerMap);

		this.patruleMode();
	}

	patruleMode() {
		if(!this.once) {
			this.flags.forEach((flag, i) => {
				let layer = this.level.layerMap;
				let x = layer.getTileX(this.sprite.x+this.sprite.width/2);
				let y = layer.getTileY(this.sprite.y+this.sprite.height/2);
				let x2 = layer.getTileX(flag.x+flag.width/2);
				let y2 = layer.getTileY(flag.y+flag.height/2);
				
				this.level.pathfinder.setCallbackFunction((path) => {
					if(path == null) this.flags.splice(i, 1);
				});

				this.level.pathfinder._easyStar.enableDiagonals();
				this.level.pathfinder.preparePathCalculation([x, y], [x2, y2]);
				this.level.pathfinder.calculatePath();
			});
			this.findPathToFlag();
		}
		this.once = true;
	}

	findPathToFlag() {
		this.flag = this.findСlosestFlag();
		this.flag.countRepeat = Math.round(this.flags.length/2);

		let layer = this.level.layerMap;
		let x = layer.getTileX(this.sprite.x+this.sprite.width/2);
		let y = layer.getTileY(this.sprite.y+this.sprite.height/2);
		let x2 = layer.getTileX(this.flag.x+this.flag.width/2);
		let y2 = layer.getTileY(this.flag.y+this.flag.height/2);
		
		this.level.pathfinder.setCallbackFunction((path) => {
			if(path == null) return;
			this.moveToFlag(path);
		});

		this.level.pathfinder._easyStar.enableDiagonals();
		this.level.pathfinder.preparePathCalculation([x, y], [x2, y2]);
		this.level.pathfinder.calculatePath();
	}

	moveToFlag(path) {
		let i = 0;
		let timer = this.level.time.create(false);
		timer.loop(300, () => {
			i++;
			if(path[i] == null) {
				timer.destroy();
				this.level.time.events.add(1000, this.findPathToFlag, this);
				return;
			}

			this.sprite.rotation = this.level.physics.arcade.angleToXY(this.sprite, path[i].x*16+8, path[i].y*16+8);
			this.level.physics.arcade.moveToXY(this.sprite, path[i].x*16+8, path[i].y*16+8, 30, 300);
		}, this);
		timer.start();
	}

	findСlosestFlag() {
		let min = Infinity;
		let resultFlag;
		this.flags.forEach((flag) => {
			let dist = this.level.physics.arcade.distanceBetween(this.sprite, flag);
			if(min > dist) {
				if(this.flag) 
					if(flag.countRepeat) {
						flag.countRepeat--;
						return;
					}

				min = dist;
				resultFlag = flag;
			}
		});
		return resultFlag || this.flag;
	}
}

module.exports = Enemy;