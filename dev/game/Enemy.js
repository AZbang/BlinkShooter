const Entity = require('./Entity');

class Enemy extends Entity {
	constructor(level, x, y, type='robot') {
		super(level, x, y, type);

		// coping flags and deleting flags which is not in walking distance
		this.flags = this.level.patruleFlags.slice(0);
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
		// patrule mode on!
		this.isPatruleMode = true;
		this.findPathToFlag();
	}

	update() {
		// if enemy saw player, then he starting attack him
		let distance = this.level.physics.arcade.distanceBetween(this.sprite, this.level.player.sprite);
		if(distance < this.radiusVisibility) {
			let angle = this.level.physics.arcade.angleToXY(this.sprite, this.level.player.sprite.x,  this.level.player.sprite.y);
			this.level.add.tween(this.sprite)
				.to({rotation: angle}, this.speed/2)
				.start();
			this.weapon.fire();
			
			// patrule mode off
			this.isPatruleMode = false;
		}
	}

	onWounded() {
		!this.hp-- && this.dead();
	}
	findPathToFlag() {
		if(!this.isPatruleMode) return;

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

		this.level.pathfinder.preparePathCalculation([x, y], [x2, y2]);
		this.level.pathfinder.calculatePath();
	}

	moveToFlag(path) {
		let i = 0;
		let timer = this.level.time.create(false);
		timer.loop(this.speed, () => {
			i++;
			if(path[i] == null || !this.isPatruleMode) {
				timer.destroy();
				this.level.time.events.add(1000, this.findPathToFlag, this);
				return;
			}

			this.level.add.tween(this.sprite)
				.to({rotation: this.level.physics.arcade.angleToXY(this.sprite, path[i].x*16+8, path[i].y*16+8)}, this.speed/2)
				.start();

			this.level.physics.arcade.moveToXY(this.sprite, path[i].x*16+8, path[i].y*16+8, 30, this.speed);
		}, this);
		timer.start();
	}

	findСlosestFlag() {
		// using not used flags (countRepeat) and finded closest flag
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