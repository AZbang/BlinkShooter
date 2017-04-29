const Entity = require('./Entity');

class Enemy extends Entity {
	constructor(game, x, y, type='robot') {
		super(game, x, y, type);

		this.path = [];

	}
	update() {
		!this.is && this.finderPlayer();
		this.is = true;
	}

	finderPlayer() {
		setInterval(() => {
			let layer = this.game.level.layerMap;

			let x = layer.getTileX(this.sprite.body.x);
			let y = layer.getTileY(this.sprite.body.y);
			let pX = layer.getTileX(this.game.level.player.sprite.body.x);
			let pY = layer.getTileY(this.game.level.player.sprite.body.y);

			this.game.pathfinder.setCallbackFunction((path) => {
				if(path == null) return;
				if(path[1] == null) return;

				this.path = path;
				this.moving();
			});

			this.game.pathfinder.preparePathCalculation([x, y], [pX, pY]);
			this.game.pathfinder.calculatePath();
		}, 1000);
	}

	moving() {
		let i = 0;
		setInterval(() => {
			i++;
			if(this.path[i] == null) return;
			this.fire();

			this.sprite.rotation = this.game.physics.arcade.angleToXY(this.sprite, this.path[i].x*16, this.path[i].y*16);
			this.game.physics.arcade.moveToXY(this.sprite, this.path[i].x*16, this.path[i].y*16, 10, 100);
		}, 100);
	}
}

module.exports = Enemy;