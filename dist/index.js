(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const Level = require('./states/Level.js');
const Player = require('./Player.js');

class Boot {
	constructor(game) {
		this.game = game;
	}

	preload() {
		this.load.tilemap('map', '../assets/levels/test/map.csv', null, Phaser.Tilemap.CSV);
		this.load.image('tilemap', '../assets/levels/tilemap.png');
		this.load.image('bg', '../assets/bg.png');
		this.load.image('person1', '../assets/_/characters/example.png');

		this.load.atlas('heads', 'assets/atlases/heads.png', 'assets/atlases/heads.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('bodies', 'assets/atlases/bodies.png', 'assets/atlases/bodies.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('attachToBody', 'assets/atlases/attachToBody.png', 'assets/atlases/attachToBody.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('weapons', 'assets/atlases/weapons.png', 'assets/atlases/weapons.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('items', 'assets/atlases/items.png', 'assets/atlases/items.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('bullets', 'assets/atlases/bullets.png', 'assets/atlases/bullets.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
	}

	create() {
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		this.game.scale.setMaximum();

		this.game.renderer.renderSession.roundPixels = true;
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.level = new Level(this);
		console.log(this);
		this.player = new Player(this, this.world.centerX, this.world.centerY);
	}

	update() {
		this.player.update();
	}
}

module.exports = Boot;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJvb3QuanMiXSwibmFtZXMiOlsiTGV2ZWwiLCJyZXF1aXJlIiwiUGxheWVyIiwiQm9vdCIsImNvbnN0cnVjdG9yIiwiZ2FtZSIsInByZWxvYWQiLCJsb2FkIiwidGlsZW1hcCIsIlBoYXNlciIsIlRpbGVtYXAiLCJDU1YiLCJpbWFnZSIsImF0bGFzIiwiTG9hZGVyIiwiVEVYVFVSRV9BVExBU19KU09OX0hBU0giLCJjcmVhdGUiLCJzY2FsZSIsInNjYWxlTW9kZSIsIlNjYWxlTWFuYWdlciIsIlNIT1dfQUxMIiwiZnVsbFNjcmVlblNjYWxlTW9kZSIsIkVYQUNUX0ZJVCIsInBhZ2VBbGlnbkhvcml6b250YWxseSIsInBhZ2VBbGlnblZlcnRpY2FsbHkiLCJzZXRNYXhpbXVtIiwicmVuZGVyZXIiLCJyZW5kZXJTZXNzaW9uIiwicm91bmRQaXhlbHMiLCJDYW52YXMiLCJzZXRJbWFnZVJlbmRlcmluZ0NyaXNwIiwiY2FudmFzIiwicGh5c2ljcyIsInN0YXJ0U3lzdGVtIiwiUGh5c2ljcyIsIkFSQ0FERSIsImxldmVsIiwiY29uc29sZSIsImxvZyIsInBsYXllciIsIndvcmxkIiwiY2VudGVyWCIsImNlbnRlclkiLCJ1cGRhdGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQSxNQUFNQSxRQUFRQyxRQUFRLG1CQUFSLENBQWQ7QUFDQSxNQUFNQyxTQUFTRCxRQUFRLGFBQVIsQ0FBZjs7QUFFQSxNQUFNRSxJQUFOLENBQVc7QUFDVkMsYUFBWUMsSUFBWixFQUFrQjtBQUNqQixPQUFLQSxJQUFMLEdBQVlBLElBQVo7QUFDQTs7QUFFREMsV0FBVTtBQUNULE9BQUtDLElBQUwsQ0FBVUMsT0FBVixDQUFrQixLQUFsQixFQUF5QiwrQkFBekIsRUFBMEQsSUFBMUQsRUFBZ0VDLE9BQU9DLE9BQVAsQ0FBZUMsR0FBL0U7QUFDQSxPQUFLSixJQUFMLENBQVVLLEtBQVYsQ0FBZ0IsU0FBaEIsRUFBMkIsOEJBQTNCO0FBQ0EsT0FBS0wsSUFBTCxDQUFVSyxLQUFWLENBQWdCLElBQWhCLEVBQXNCLGtCQUF0QjtBQUNBLE9BQUtMLElBQUwsQ0FBVUssS0FBVixDQUFnQixTQUFoQixFQUEyQixvQ0FBM0I7O0FBRUEsT0FBS0wsSUFBTCxDQUFVTSxLQUFWLENBQWdCLE9BQWhCLEVBQXlCLDBCQUF6QixFQUFxRCwyQkFBckQsRUFBa0ZKLE9BQU9LLE1BQVAsQ0FBY0MsdUJBQWhHO0FBQ0EsT0FBS1IsSUFBTCxDQUFVTSxLQUFWLENBQWdCLFFBQWhCLEVBQTBCLDJCQUExQixFQUF1RCw0QkFBdkQsRUFBcUZKLE9BQU9LLE1BQVAsQ0FBY0MsdUJBQW5HO0FBQ0EsT0FBS1IsSUFBTCxDQUFVTSxLQUFWLENBQWdCLGNBQWhCLEVBQWdDLGlDQUFoQyxFQUFtRSxrQ0FBbkUsRUFBdUdKLE9BQU9LLE1BQVAsQ0FBY0MsdUJBQXJIO0FBQ0EsT0FBS1IsSUFBTCxDQUFVTSxLQUFWLENBQWdCLFNBQWhCLEVBQTJCLDRCQUEzQixFQUF5RCw2QkFBekQsRUFBd0ZKLE9BQU9LLE1BQVAsQ0FBY0MsdUJBQXRHO0FBQ0EsT0FBS1IsSUFBTCxDQUFVTSxLQUFWLENBQWdCLE9BQWhCLEVBQXlCLDBCQUF6QixFQUFxRCwyQkFBckQsRUFBa0ZKLE9BQU9LLE1BQVAsQ0FBY0MsdUJBQWhHO0FBQ0EsT0FBS1IsSUFBTCxDQUFVTSxLQUFWLENBQWdCLFNBQWhCLEVBQTJCLDRCQUEzQixFQUF5RCw2QkFBekQsRUFBd0ZKLE9BQU9LLE1BQVAsQ0FBY0MsdUJBQXRHO0FBQ0E7O0FBRURDLFVBQVM7QUFDUixPQUFLWCxJQUFMLENBQVVZLEtBQVYsQ0FBZ0JDLFNBQWhCLEdBQTRCVCxPQUFPVSxZQUFQLENBQW9CQyxRQUFoRDtBQUNBLE9BQUtmLElBQUwsQ0FBVVksS0FBVixDQUFnQkksbUJBQWhCLEdBQXNDWixPQUFPVSxZQUFQLENBQW9CRyxTQUExRDtBQUNBLE9BQUtqQixJQUFMLENBQVVZLEtBQVYsQ0FBZ0JNLHFCQUFoQixHQUF3QyxJQUF4QztBQUNBLE9BQUtsQixJQUFMLENBQVVZLEtBQVYsQ0FBZ0JPLG1CQUFoQixHQUFzQyxJQUF0QztBQUNBLE9BQUtuQixJQUFMLENBQVVZLEtBQVYsQ0FBZ0JRLFVBQWhCOztBQUVBLE9BQUtwQixJQUFMLENBQVVxQixRQUFWLENBQW1CQyxhQUFuQixDQUFpQ0MsV0FBakMsR0FBK0MsSUFBL0M7QUFDQW5CLFNBQU9vQixNQUFQLENBQWNDLHNCQUFkLENBQXFDLEtBQUt6QixJQUFMLENBQVUwQixNQUEvQzs7QUFFQSxPQUFLMUIsSUFBTCxDQUFVMkIsT0FBVixDQUFrQkMsV0FBbEIsQ0FBOEJ4QixPQUFPeUIsT0FBUCxDQUFlQyxNQUE3Qzs7QUFFQSxPQUFLQyxLQUFMLEdBQWEsSUFBSXBDLEtBQUosQ0FBVSxJQUFWLENBQWI7QUFDQXFDLFVBQVFDLEdBQVIsQ0FBWSxJQUFaO0FBQ0EsT0FBS0MsTUFBTCxHQUFjLElBQUlyQyxNQUFKLENBQVcsSUFBWCxFQUFpQixLQUFLc0MsS0FBTCxDQUFXQyxPQUE1QixFQUFxQyxLQUFLRCxLQUFMLENBQVdFLE9BQWhELENBQWQ7QUFDQTs7QUFFREMsVUFBUztBQUNSLE9BQUtKLE1BQUwsQ0FBWUksTUFBWjtBQUNBO0FBdENTOztBQXlDWEMsT0FBT0MsT0FBUCxHQUFpQjFDLElBQWpCIiwiZmlsZSI6IkJvb3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBMZXZlbCA9IHJlcXVpcmUoJy4vc3RhdGVzL0xldmVsLmpzJyk7XHJcbmNvbnN0IFBsYXllciA9IHJlcXVpcmUoJy4vUGxheWVyLmpzJyk7XHJcblxyXG5jbGFzcyBCb290IHtcclxuXHRjb25zdHJ1Y3RvcihnYW1lKSB7XHJcblx0XHR0aGlzLmdhbWUgPSBnYW1lO1xyXG5cdH1cclxuXHJcblx0cHJlbG9hZCgpIHtcclxuXHRcdHRoaXMubG9hZC50aWxlbWFwKCdtYXAnLCAnLi4vYXNzZXRzL2xldmVscy90ZXN0L21hcC5jc3YnLCBudWxsLCBQaGFzZXIuVGlsZW1hcC5DU1YpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCd0aWxlbWFwJywgJy4uL2Fzc2V0cy9sZXZlbHMvdGlsZW1hcC5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnYmcnLCAnLi4vYXNzZXRzL2JnLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCdwZXJzb24xJywgJy4uL2Fzc2V0cy9fL2NoYXJhY3RlcnMvZXhhbXBsZS5wbmcnKTtcclxuXHJcblx0XHR0aGlzLmxvYWQuYXRsYXMoJ2hlYWRzJywgJ2Fzc2V0cy9hdGxhc2VzL2hlYWRzLnBuZycsICdhc3NldHMvYXRsYXNlcy9oZWFkcy5qc29uJywgUGhhc2VyLkxvYWRlci5URVhUVVJFX0FUTEFTX0pTT05fSEFTSCk7XHJcblx0XHR0aGlzLmxvYWQuYXRsYXMoJ2JvZGllcycsICdhc3NldHMvYXRsYXNlcy9ib2RpZXMucG5nJywgJ2Fzc2V0cy9hdGxhc2VzL2JvZGllcy5qc29uJywgUGhhc2VyLkxvYWRlci5URVhUVVJFX0FUTEFTX0pTT05fSEFTSCk7XHJcblx0XHR0aGlzLmxvYWQuYXRsYXMoJ2F0dGFjaFRvQm9keScsICdhc3NldHMvYXRsYXNlcy9hdHRhY2hUb0JvZHkucG5nJywgJ2Fzc2V0cy9hdGxhc2VzL2F0dGFjaFRvQm9keS5qc29uJywgUGhhc2VyLkxvYWRlci5URVhUVVJFX0FUTEFTX0pTT05fSEFTSCk7XHJcblx0XHR0aGlzLmxvYWQuYXRsYXMoJ3dlYXBvbnMnLCAnYXNzZXRzL2F0bGFzZXMvd2VhcG9ucy5wbmcnLCAnYXNzZXRzL2F0bGFzZXMvd2VhcG9ucy5qc29uJywgUGhhc2VyLkxvYWRlci5URVhUVVJFX0FUTEFTX0pTT05fSEFTSCk7XHJcblx0XHR0aGlzLmxvYWQuYXRsYXMoJ2l0ZW1zJywgJ2Fzc2V0cy9hdGxhc2VzL2l0ZW1zLnBuZycsICdhc3NldHMvYXRsYXNlcy9pdGVtcy5qc29uJywgUGhhc2VyLkxvYWRlci5URVhUVVJFX0FUTEFTX0pTT05fSEFTSCk7XHJcblx0XHR0aGlzLmxvYWQuYXRsYXMoJ2J1bGxldHMnLCAnYXNzZXRzL2F0bGFzZXMvYnVsbGV0cy5wbmcnLCAnYXNzZXRzL2F0bGFzZXMvYnVsbGV0cy5qc29uJywgUGhhc2VyLkxvYWRlci5URVhUVVJFX0FUTEFTX0pTT05fSEFTSCk7XHJcblx0fVxyXG5cclxuXHRjcmVhdGUoKSB7XHJcblx0XHR0aGlzLmdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcclxuXHRcdHRoaXMuZ2FtZS5zY2FsZS5mdWxsU2NyZWVuU2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5FWEFDVF9GSVQ7XHJcblx0XHR0aGlzLmdhbWUuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcclxuXHRcdHRoaXMuZ2FtZS5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZTtcclxuXHRcdHRoaXMuZ2FtZS5zY2FsZS5zZXRNYXhpbXVtKCk7XHJcblxyXG5cdFx0dGhpcy5nYW1lLnJlbmRlcmVyLnJlbmRlclNlc3Npb24ucm91bmRQaXhlbHMgPSB0cnVlO1xyXG5cdFx0UGhhc2VyLkNhbnZhcy5zZXRJbWFnZVJlbmRlcmluZ0NyaXNwKHRoaXMuZ2FtZS5jYW52YXMpO1xyXG5cclxuXHRcdHRoaXMuZ2FtZS5waHlzaWNzLnN0YXJ0U3lzdGVtKFBoYXNlci5QaHlzaWNzLkFSQ0FERSk7XHJcblxyXG5cdFx0dGhpcy5sZXZlbCA9IG5ldyBMZXZlbCh0aGlzKTtcclxuXHRcdGNvbnNvbGUubG9nKHRoaXMpXHJcblx0XHR0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIodGhpcywgdGhpcy53b3JsZC5jZW50ZXJYLCB0aGlzLndvcmxkLmNlbnRlclkpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKCkge1xyXG5cdFx0dGhpcy5wbGF5ZXIudXBkYXRlKCk7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJvb3Q7Il19
},{"./Player.js":3,"./states/Level.js":6}],2:[function(require,module,exports){
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

		if (bullet) {
			this.sprite.body.angularVelocity = -400;
			this.game.physics.arcade.accelerationFromRotation(this.sprite.rotation, 300, this.sprite.body.acceleration);
			bullet.smoothed = false;
			bullet.scale.setTo(this.sprite.scale.x / 2, this.sprite.scale.y / 2);
			return bullet.body.updateBounds();
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
				this.weapon.trackSprite(this.sprite, 16 * this.sprite.scale.x, 4 * this.sprite.scale.y, true);
			}, this);
		}, this);
	}
}

module.exports = Entity;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVudGl0eS5qcyJdLCJuYW1lcyI6WyJlbnRpdGllcyIsInJlcXVpcmUiLCJFbnRpdHkiLCJjb25zdHJ1Y3RvciIsImdhbWUiLCJ4IiwieSIsInR5cGUiLCJfZW50aXR5IiwiaHAiLCJqdW1waW5nIiwianVtcCIsInNwZWVkIiwiaXNKdW1waW5nIiwiaGVhZElkIiwiaGVhZCIsImJvZHlJZCIsImJvZHkiLCJ3ZWFwb25JZCIsIndlYXBvbiIsIl9jcmVhdGVQaGFzZXJPYmplY3RzIiwic3ByaXRlIiwiYWRkIiwiYW5jaG9yIiwic2V0Iiwic21vb3RoZWQiLCJtYWtlIiwiYWRkQ2hpbGQiLCJhdHRhY2hUb0JvZHkiLCJzZXRCdWxsZXRGcmFtZXMiLCJidWxsZXRLaWxsVHlwZSIsIlBoYXNlciIsIldlYXBvbiIsIktJTExfV09STERfQk9VTkRTIiwiYnVsbGV0U3BlZWQiLCJmaXJlUmF0ZSIsInRyYWNrU3ByaXRlIiwiZmlyZSIsImJ1bGxldCIsImFuZ3VsYXJWZWxvY2l0eSIsInBoeXNpY3MiLCJhcmNhZGUiLCJhY2NlbGVyYXRpb25Gcm9tUm90YXRpb24iLCJyb3RhdGlvbiIsImFjY2VsZXJhdGlvbiIsInNjYWxlIiwic2V0VG8iLCJ1cGRhdGVCb3VuZHMiLCJwb3dlciIsInR3ZWVuVXAiLCJ0d2VlbiIsInRvIiwiRWFzaW5nIiwiUXVhZHJhdGljIiwiT3V0Iiwib25Db21wbGV0ZSIsInR3ZWVuRG93biIsIlF1aW50aWMiLCJJbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBLE1BQU1BLFdBQVdDLFFBQVEsaUJBQVIsQ0FBakI7O0FBRUEsTUFBTUMsTUFBTixDQUFhO0FBQ1pDLGFBQVlDLElBQVosRUFBa0JDLENBQWxCLEVBQXFCQyxDQUFyQixFQUF3QkMsSUFBeEIsRUFBOEI7QUFDN0IsT0FBS0EsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsT0FBS0gsSUFBTCxHQUFZQSxJQUFaOztBQUVBLE9BQUtDLENBQUwsR0FBU0EsS0FBSyxJQUFMLEdB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b0IsS0FBSzdCLE1BQUwsQ0FBWXdCLEtBQWhDLEVBQXVDTSxFQUF2QyxDQUEwQztBQUN6RDlDLE9BQUcsQ0FEc0Q7QUFFekRDLE9BQUc7QUFGc0QsSUFBMUMsRUFHYixHQUhhLEVBR1J5QixPQUFPcUIsTUFBUCxDQUFjSyxPQUFkLENBQXNCQyxFQUhkLEVBR2tCLElBSGxCLENBQWhCOztBQU1BRixhQUFVRCxVQUFWLENBQXFCakMsR0FBckIsQ0FBeUIsTUFBTTtBQUM5QixTQUFLVCxTQUFMLEdBQWlCLEtBQWpCO0FBQ0EsU0FBS00sTUFBTCxDQUFZaUIsV0FBWixDQUF3QixLQUFLZixNQUE3QixFQUFxQyxLQUFHLEtBQUtBLE1BQUwsQ0FBWXdCLEtBQVosQ0FBa0J4QyxDQUExRCxFQUE2RCxJQUFFLEtBQUtnQixNQUFMLENBQVl3QixLQUFaLENBQWtCdkMsQ0FBakYsRUFBb0YsSUFBcEY7QUFDQSxJQUhELEVBR0csSUFISDtBQUtBLEdBZEQsRUFjRyxJQWRIO0FBZUE7QUE5RVc7O0FBaUZicUQsT0FBT0MsT0FBUCxHQUFpQjFELE1BQWpCIiwiZmlsZSI6IkVudGl0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGVudGl0aWVzID0gcmVxdWlyZSgnLi9lbnRpdGllcy5qc29uJyk7XHJcblxyXG5jbGFzcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKGdhbWUsIHgsIHksIHR5cGUpIHtcclxuXHRcdHRoaXMudHlwZSA9IHR5cGU7XHJcblx0XHR0aGlzLmdhbWUgPSBnYW1lO1xyXG5cclxuXHRcdHRoaXMueCA9IHggIT0gbnVsbCA/IHggOiAwO1xyXG5cdFx0dGhpcy55ID0geSAhPSBudWxsID8geSA6IDA7XHJcblxyXG5cdFx0dGhpcy5fZW50aXR5ID0gZW50aXRpZXNbdHlwZV07XHJcblxyXG5cdFx0dGhpcy5ocCA9IHRoaXMuX2VudGl0eS5ocCAhPSBudWxsID8gdGhpcy5fZW50aXR5LmhwIDogMTA7XHJcblx0XHR0aGlzLmp1bXBpbmcgPSB0aGlzLl9lbnRpdHkuanVtcCAhPSBudWxsID8gdGhpcy5fZW50aXR5Lmp1bXAgOiAyO1xyXG5cdFx0dGhpcy5zcGVlZCA9IHRoaXMuX2VudGl0eS5zcGVlZCAhPSBudWxsID8gdGhpcy5fZW50aXR5LnNwZWVkIDogMTAwO1xyXG5cdFx0dGhpcy5pc0p1bXBpbmcgPSBmYWxzZTtcclxuXHJcblx0XHR0aGlzLmhlYWRJZCA9IHRoaXMuX2VudGl0eS5oZWFkICE9IG51bGwgPyB0aGlzLl9lbnRpdHkuaGVhZCA6IDA7XHJcblx0XHR0aGlzLmJvZHlJZCA9IHRoaXMuX2VudGl0eS5ib2R5ICE9IG51bGwgPyB0aGlzLl9lbnRpdHkuYm9keSA6IDA7XHJcblx0XHR0aGlzLndlYXBvbklkID0gdGhpcy5fZW50aXR5LndlYXBvbiAhPSBudWxsID8gdGhpcy5fZW50aXR5LndlYXBvbiA6IDA7XHJcblxyXG5cdFx0dGhpcy5fY3JlYXRlUGhhc2VyT2JqZWN0cygpO1xyXG5cdH1cclxuXHJcblx0X2NyZWF0ZVBoYXNlck9iamVjdHMoKSB7XHJcblx0XHR0aGlzLnNwcml0ZSA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKHRoaXMueCwgdGhpcy55LCAnYm9kaWVzJywgdGhpcy5ib2R5SWQpO1xyXG5cdFx0dGhpcy5zcHJpdGUuYW5jaG9yLnNldCgwLjUpO1xyXG5cdFx0dGhpcy5zcHJpdGUuc21vb3RoZWQgPSBmYWxzZTtcclxuXHJcblx0XHR0aGlzLmhlYWQgPSB0aGlzLmdhbWUubWFrZS5zcHJpdGUoLTEyLCAtNywgJ2hlYWRzJywgdGhpcy5oZWFkSWQpO1xyXG5cdFx0dGhpcy5oZWFkLnNtb290aGVkID0gZmFsc2U7XHJcblx0XHR0aGlzLnNwcml0ZS5hZGRDaGlsZCh0aGlzLmhlYWQpO1xyXG5cclxuXHRcdHRoaXMuYXR0YWNoVG9Cb2R5ID0gdGhpcy5nYW1lLm1ha2Uuc3ByaXRlKDMuNSwgLTQsICdhdHRhY2hUb0JvZHknLCB0aGlzLndlYXBvbklkKTtcclxuXHRcdHRoaXMuYXR0YWNoVG9Cb2R5LnNtb290aGVkID0gZmFsc2U7XHJcblx0XHR0aGlzLnNwcml0ZS5hZGRDaGlsZCh0aGlzLmF0dGFjaFRvQm9keSk7XHRcclxuXHJcblx0XHR0aGlzLndlYXBvbiA9IHRoaXMuZ2FtZS5hZGQud2VhcG9uKDEwLCAnYnVsbGV0cycpO1xyXG5cdFx0dGhpcy53ZWFwb24uc2V0QnVsbGV0RnJhbWVzKHRoaXMud2VhcG9uSWQsIHRoaXMud2VhcG9uSWQsIHRydWUpO1xyXG5cdFx0dGhpcy53ZWFwb24uYnVsbGV0S2lsbFR5cGUgPSBQaGFzZXIuV2VhcG9uLktJTExfV09STERfQk9VTkRTO1xyXG5cdFx0dGhpcy53ZWFwb24uYnVsbGV0U3BlZWQgPSA0MDA7XHJcblx0XHR0aGlzLndlYXBvbi5maXJlUmF0ZSA9IDUwO1xyXG5cdFx0dGhpcy53ZWFwb24udHJhY2tTcHJpdGUodGhpcy5zcHJpdGUsIDE2LCA0LCB0cnVlKTtcclxuXHR9XHJcblxyXG5cdGZpcmUoKSB7XHJcblx0XHRsZXQgYnVsbGV0ID0gdGhpcy53ZWFwb24uZmlyZSgpO1xyXG5cclxuXHRcdGlmKGJ1bGxldCkge1xyXG5cdFx0XHR0aGlzLnNwcml0ZS5ib2R5LmFuZ3VsYXJWZWxvY2l0eSA9IC00MDA7XHJcblx0XHRcdHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS5hY2NlbGVyYXRpb25Gcm9tUm90YXRpb24odGhpcy5zcHJpdGUucm90YXRpb24sIDMwMCwgdGhpcy5zcHJpdGUuYm9keS5hY2NlbGVyYXRpb24pO1xyXG5cdFx0XHRidWxsZXQuc21vb3RoZWQgPSBmYWxzZTtcclxuXHRcdFx0YnVsbGV0LnNjYWxlLnNldFRvKHRoaXMuc3ByaXRlLnNjYWxlLngvMiwgdGhpcy5zcHJpdGUuc2NhbGUueS8yKTtcclxuXHRcdFx0cmV0dXJuIChidWxsZXQuYm9keS51cGRhdGVCb3VuZHMpKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRqdW1wKHBvd2VyKSB7XHJcblx0XHR0aGlzLmlzSnVtcGluZyA9IHRydWU7XHJcblxyXG5cdFx0bGV0IHR3ZWVuVXAgPSB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMuc3ByaXRlLnNjYWxlKS50byh7XHJcblx0XHRcdHg6IHBvd2VyLCBcclxuXHRcdFx0eTogcG93ZXJcclxuXHRcdH0sIDMwMCwgUGhhc2VyLkVhc2luZy5RdWFkcmF0aWMuT3V0LCB0cnVlKTtcclxuXHJcblx0XHR0d2VlblVwLm9uQ29tcGxldGUuYWRkKCgpID0+IHtcclxuXHRcdFx0dGhpcy5zcHJpdGUuYm9keS51cGRhdGVCb3VuZHMoKTtcclxuXHJcblx0XHRcdGxldCB0d2VlbkRvd24gPSB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMuc3ByaXRlLnNjYWxlKS50byh7XHJcblx0XHRcdFx0eDogMSxcclxuXHRcdFx0XHR5OiAxXHJcblx0XHRcdH0sIDMwMCwgUGhhc2VyLkVhc2luZy5RdWludGljLkluLCB0cnVlKTtcclxuXHJcblxyXG5cdFx0XHR0d2VlbkRvd24ub25Db21wbGV0ZS5hZGQoKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuaXNKdW1waW5nID0gZmFsc2U7XHJcblx0XHRcdFx0dGhpcy53ZWFwb24udHJhY2tTcHJpdGUodGhpcy5zcHJpdGUsIDE2KnRoaXMuc3ByaXRlLnNjYWxlLngsIDQqdGhpcy5zcHJpdGUuc2NhbGUueSwgdHJ1ZSk7XHJcblx0XHRcdH0sIHRoaXMpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHR9LCB0aGlzKTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRW50aXR5OyJdfQ==
},{"./entities.json":4}],3:[function(require,module,exports){
const Entity = require('./Entity.js');

class Player extends Entity {
	constructor(game, x, y) {
		super(game, x, y, 'player');

		this.game.physics.arcade.enable(this.sprite);
		this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

		this.sprite.body.drag.set(150);
		this.sprite.body.maxVelocity.set(100);

		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	}

	update() {
		if (this.isJumping) this.weapon.trackSprite(this.sprite, 16 * this.sprite.scale.x, 4 * this.sprite.scale.y, true);

		if (this.cursors.up.isDown) {
			this.fire();
			this.game.physics.arcade.accelerationFromRotation(this.sprite.rotation, 300, this.sprite.body.acceleration);
		} else this.sprite.body.acceleration.set(0);

		if (this.cursors.left.isDown) this.sprite.body.angularVelocity = -300;else if (this.cursors.right.isDown) this.sprite.body.angularVelocity = 300;else this.sprite.body.angularVelocity = 0;

		if (this.jumpButton.isDown && !this.isJumping) {
			this.jump(this.jumping);
		}
	}
}

module.exports = Player;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXllci5qcyJdLCJuYW1lcyI6WyJFbnRpdHkiLCJyZXF1aXJlIiwiUGxheWVyIiwiY29uc3RydWN0b3IiLCJnYW1lIiwieCIsInkiLCJwaHlzaWNzIiwiYXJjYWRlIiwiZW5hYmxlIiwic3ByaXRlIiwiY2FtZXJhIiwiZm9sbG93IiwiUGhhc2VyIiwiQ2FtZXJhIiwiRk9MTE9XX0xPQ0tPTiIsImJvZHkiLCJkcmFnIiwic2V0IiwibWF4VmVsb2NpdHkiLCJjdXJzb3JzIiwiaW5wdXQiLCJrZXlib2FyZCIsImNyZWF0ZUN1cnNvcktleXMiLCJqdW1wQnV0dG9uIiwiYWRkS2V5IiwiS2V5Ym9hcmQiLCJTUEFDRUJBUiIsInVwZGF0ZSIsImlzSnVtcGluZyIsIndlYXBvbiIsInRyYWNrU3ByaXRlIiwic2NhbGUiLCJ1cCIsImlzRG93biIsImZpcmUiLCJhY2NlbGVyYXRpb25Gcm9tUm90YXRpb24iLCJyb3RhdGlvbiIsImFjY2VsZXJhdGlvbiIsImxlZnQiLCJhbmd1bGFyVmVsb2NpdHkiLCJyaWdodCIsImp1bXAiLCJqdW1waW5nIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTUEsU0FBU0MsUUFBUSxhQUFSLENBQWY7O0FBRUEsTUFBTUMsTUFBTixTQUFxQkYsTUFBckIsQ0FBNEI7QUFDM0JHLGFBQVlDLElBQVosRUFBa0JDLENBQWxCLEVBQXFCQyxDQUFyQixFQUF3QjtBQUN2QixRQUFNRixJQUFOLEVBQVlDLENBQVosRUFBZUMsQ0FBZixFQUFrQixRQUFsQjs7QUFFQSxPQUFLRixJQUFMLENBQVVHLE9BQVYsQ0FBa0JDLE1BQWxCLENBQXlCQyxNQUF6QixDQUFnQyxLQUFLQyxNQUFyQztBQUNBLE9BQUtOLElBQUwsQ0FBVU8sTUFBVixDQUFpQkMsTUFBakIsQ0FBd0IsS0FBS0YsTUFBN0IsRUFBcUNHLE9BQU9DLE1BQVAsQ0FBY0MsYUFBbkQsRUFBbUUsR0FBbkUsRUFBd0UsR0FBeEU7O0FBRUEsT0FBS0wsTUFBTCxDQUFZTSxJQUFaLENBQWlCQyxJQUFqQixDQUFzQkMsR0FBdEIsQ0FBMEIsR0FBMUI7QUFDQSxPQUFLUixNQUFMLENBQVlNLElBQVosQ0FBaUJHLFdBQWpCLENBQTZCRCxHQUE3QixDQUFpQyxHQUFqQzs7QUFFQSxPQUFLRSxPQUFMLEdBQWUsS0FBS2hCLElBQUwsQ0FBVWlCLEtBQVYsQ0FBZ0JDLFFBQWhCLENBQXlCQyxnQkFBekIsRUFBZjtBQUNBLE9BQUtDLFVBQUwsR0FBa0IsS0FBS3BCLElBQUwsQ0FBVWlCLEtBQVYsQ0FBZ0JDLFFBQWhCLENBQXlCRyxNQUF6QixDQUFnQ1osT0FBT2EsUUFBUCxDQUFnQkMsUUFBaEQsQ0FBbEI7QUFDQTs7QUFFREMsVUFBUztBQUNSLE1BQUcsS0FBS0MsU0FBUixFQUNDLEtBQUtDLE1BQUwsQ0FBWUMsV0FBWixDQUF3QixLQUFLckIsTUFBN0IsRUFBcUMsS0FBRyxLQUFLQSxNQUFMLENBQVlzQixLQUFaLENBQWtCM0IsQ0FBMUQsRUFBNkQsSUFBRSxLQUFLSyxNQUFMLENBQVlzQixLQUFaLENBQWtCMUIsQ0FBakYsRUFBb0YsSUFBcEY7O0FBRUQsTUFBRyxLQUFLYyxPQUFMLENBQWFhLEVBQWIsQ0FBZ0JDLE1BQW5CLEVBQTJCO0FBQzFCLFFBQUtDLElBQUw7QUFDQSxRQUFLL0IsSUFBTCxDQUFVRyxPQUFWLENBQWtCQyxNQUFsQixDQUF5QjRCLHdCQUF6QixDQUFrRCxLQUFLMUIsTUFBTCxDQUFZMkIsUUFBOUQsRUFBd0UsR0FBeEUsRUFBNkUsS0FBSzNCLE1BQUwsQ0FBWU0sSUFBWixDQUFpQnNCLFlBQTlGO0FBQ0EsR0FIRCxNQUlLLEtBQUs1QixNQUFMLENBQVlNLElBQVosQ0FBaUJzQixZQUFqQixDQUE4QnBCLEdBQTlCLENBQWtDLENBQWxDOztBQUVMLE1BQUcsS0FBS0UsT0FBTCxDQUFhbUIsSUFBYixDQUFrQkwsTUFBckIsRUFDQyxLQUFLeEIsTUFBTCxDQUFZTSxJQUFaLENBQWlCd0IsZUFBakIsR0FBbUMsQ0FBQyxHQUFwQyxDQURELEtBR0ssSUFBRyxLQUFLcEIsT0FBTCxDQUFhcUIsS0FBYixDQUFtQlAsTUFBdEIsRUFDSixLQUFLeEIsTUFBTCxDQUFZTSxJQUFaLENBQWlCd0IsZUFBakIsR0FBbUMsR0FBbkMsQ0FESSxLQUdBLEtBQUs5QixNQUFMLENBQVlNLElBQVosQ0FBaUJ3QixlQUFqQixHQUFtQyxDQUFuQzs7QUFFTCxNQUFHLEtBQUtoQixVQUFMLENBQWdCVSxNQUFoQixJQUEwQixDQUFDLEtBQUtMLFNBQW5DLEVBQThDO0FBQzdDLFFBQUthLElBQUwsQ0FBVSxLQUFLQyxPQUFmO0FBQ0E7QUFDRDtBQW5DMEI7O0FBc0M1QkMsT0FBT0MsT0FBUCxHQUFpQjNDLE1BQWpCIiwiZmlsZSI6IlBsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEVudGl0eSA9IHJlcXVpcmUoJy4vRW50aXR5LmpzJyk7XHJcblxyXG5jbGFzcyBQbGF5ZXIgZXh0ZW5kcyBFbnRpdHkge1xyXG5cdGNvbnN0cnVjdG9yKGdhbWUsIHgsIHkpIHtcclxuXHRcdHN1cGVyKGdhbWUsIHgsIHksICdwbGF5ZXInKTtcclxuXHJcblx0XHR0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHRoaXMuc3ByaXRlKTtcclxuXHRcdHRoaXMuZ2FtZS5jYW1lcmEuZm9sbG93KHRoaXMuc3ByaXRlLCBQaGFzZXIuQ2FtZXJhLkZPTExPV19MT0NLT04gLCAwLjEsIDAuMSk7XHJcblxyXG5cdFx0dGhpcy5zcHJpdGUuYm9keS5kcmFnLnNldCgxNTApO1xyXG5cdFx0dGhpcy5zcHJpdGUuYm9keS5tYXhWZWxvY2l0eS5zZXQoMTAwKTtcclxuXHJcblx0XHR0aGlzLmN1cnNvcnMgPSB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuY3JlYXRlQ3Vyc29yS2V5cygpO1xyXG5cdFx0dGhpcy5qdW1wQnV0dG9uID0gdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuU1BBQ0VCQVIpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKCkge1xyXG5cdFx0aWYodGhpcy5pc0p1bXBpbmcpXHJcblx0XHRcdHRoaXMud2VhcG9uLnRyYWNrU3ByaXRlKHRoaXMuc3ByaXRlLCAxNip0aGlzLnNwcml0ZS5zY2FsZS54LCA0KnRoaXMuc3ByaXRlLnNjYWxlLnksIHRydWUpO1xyXG5cclxuXHRcdGlmKHRoaXMuY3Vyc29ycy51cC5pc0Rvd24pIHtcclxuXHRcdFx0dGhpcy5maXJlKCk7XHJcblx0XHRcdHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS5hY2NlbGVyYXRpb25Gcm9tUm90YXRpb24odGhpcy5zcHJpdGUucm90YXRpb24sIDMwMCwgdGhpcy5zcHJpdGUuYm9keS5hY2NlbGVyYXRpb24pO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB0aGlzLnNwcml0ZS5ib2R5LmFjY2VsZXJhdGlvbi5zZXQoMCk7XHJcblxyXG5cdFx0aWYodGhpcy5jdXJzb3JzLmxlZnQuaXNEb3duKVxyXG5cdFx0XHR0aGlzLnNwcml0ZS5ib2R5LmFuZ3VsYXJWZWxvY2l0eSA9IC0zMDA7XHJcblxyXG5cdFx0ZWxzZSBpZih0aGlzLmN1cnNvcnMucmlnaHQuaXNEb3duKVxyXG5cdFx0XHR0aGlzLnNwcml0ZS5ib2R5LmFuZ3VsYXJWZWxvY2l0eSA9IDMwMDtcclxuXHJcblx0XHRlbHNlIHRoaXMuc3ByaXRlLmJvZHkuYW5ndWxhclZlbG9jaXR5ID0gMDtcclxuXHJcblx0XHRpZih0aGlzLmp1bXBCdXR0b24uaXNEb3duICYmICF0aGlzLmlzSnVtcGluZykge1xyXG5cdFx0XHR0aGlzLmp1bXAodGhpcy5qdW1waW5nKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHRcdFx0XHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyOyJdfQ==
},{"./Entity.js":2}],4:[function(require,module,exports){
module.exports={
	"player": {
		"hp": 10,
		"jump": 3,
		"speed": 100,

		"head": 1,
		"body": 2,
		"weapon": 5
	}
}
},{}],5:[function(require,module,exports){
var Boot = require('./Boot.js');

var game = new Phaser.Game(480, 320, Phaser.AUTO, 'ShooterBlink');
game.state.add('Boot', Boot, true);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIkJvb3QiLCJyZXF1aXJlIiwiZ2FtZSIsIlBoYXNlciIsIkdhbWUiLCJBVVRPIiwic3RhdGUiLCJhZGQiXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLE9BQU9DLFFBQVEsV0FBUixDQUFYOztBQUVBLElBQUlDLE9BQU8sSUFBSUMsT0FBT0MsSUFBWCxDQUFnQixHQUFoQixFQUFxQixHQUFyQixFQUEwQkQsT0FBT0UsSUFBakMsRUFBdUMsY0FBdkMsQ0FBWDtBQUNBSCxLQUFLSSxLQUFMLENBQVdDLEdBQVgsQ0FBZSxNQUFmLEVBQXVCUCxJQUF2QixFQUE2QixJQUE3QiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBCb290ID0gcmVxdWlyZSgnLi9Cb290LmpzJyk7XHJcblxyXG52YXIgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSg0ODAsIDMyMCwgUGhhc2VyLkFVVE8sICdTaG9vdGVyQmxpbmsnKTtcclxuZ2FtZS5zdGF0ZS5hZGQoJ0Jvb3QnLCBCb290LCB0cnVlKTsiXX0=
},{"./Boot.js":1}],6:[function(require,module,exports){
class Level {
	constructor(game) {
		this.map1 = game.add.tilemap('map', 16, 16);
		this.map1.addTilesetImage('tilemap');

		game.add.tileSprite(0, 0, 10000, 10000, 'bg');
		game.world.setBounds(0, 0, 10000, 10000);

		this.layer1 = this.map1.createLayer(0);
		this.layer1.resizeWorld();
	}
}

module.exports = Level;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxldmVsLmpzIl0sIm5hbWVzIjpbIkxldmVsIiwiY29uc3RydWN0b3IiLCJnYW1lIiwibWFwMSIsImFkZCIsInRpbGVtYXAiLCJhZGRUaWxlc2V0SW1hZ2UiLCJ0aWxlU3ByaXRlIiwid29ybGQiLCJzZXRCb3VuZHMiLCJsYXllcjEiLCJjcmVhdGVMYXllciIsInJlc2l6ZVdvcmxkIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTUEsS0FBTixDQUFZO0FBQ1hDLGFBQVlDLElBQVosRUFBa0I7QUFDakIsT0FBS0MsSUFBTCxHQUFZRCxLQUFLRSxHQUFMLENBQVNDLE9BQVQsQ0FBaUIsS0FBakIsRUFBd0IsRUFBeEIsRUFBNEIsRUFBNUIsQ0FBWjtBQUNBLE9BQUtGLElBQUwsQ0FBVUcsZUFBVixDQUEwQixTQUExQjs7QUFFQUosT0FBS0UsR0FBTCxDQUFTRyxVQUFULENBQW9CLENBQXBCLEVBQXVCLENBQXZCLEVBQTBCLEtBQTFCLEVBQWlDLEtBQWpDLEVBQXdDLElBQXhDO0FBQ0FMLE9BQUtNLEtBQUwsQ0FBV0MsU0FBWCxDQUFxQixDQUFyQixFQUF3QixDQUF4QixFQUEyQixLQUEzQixFQUFrQyxLQUFsQzs7QUFFQSxPQUFLQyxNQUFMLEdBQWMsS0FBS1AsSUFBTCxDQUFVUSxXQUFWLENBQXNCLENBQXRCLENBQWQ7QUFDQSxPQUFLRCxNQUFMLENBQVlFLFdBQVo7QUFDQTtBQVZVOztBQWNaQyxPQUFPQyxPQUFQLEdBQWlCZCxLQUFqQiIsImZpbGUiOiJMZXZlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIExldmVsIHtcclxuXHRjb25zdHJ1Y3RvcihnYW1lKSB7XHJcblx0XHR0aGlzLm1hcDEgPSBnYW1lLmFkZC50aWxlbWFwKCdtYXAnLCAxNiwgMTYpO1xyXG5cdFx0dGhpcy5tYXAxLmFkZFRpbGVzZXRJbWFnZSgndGlsZW1hcCcpO1xyXG5cclxuXHRcdGdhbWUuYWRkLnRpbGVTcHJpdGUoMCwgMCwgMTAwMDAsIDEwMDAwLCAnYmcnKTtcclxuXHRcdGdhbWUud29ybGQuc2V0Qm91bmRzKDAsIDAsIDEwMDAwLCAxMDAwMCk7XHJcblxyXG5cdFx0dGhpcy5sYXllcjEgPSB0aGlzLm1hcDEuY3JlYXRlTGF5ZXIoMCk7XHJcblx0XHR0aGlzLmxheWVyMS5yZXNpemVXb3JsZCgpO1xyXG5cdH1cclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGV2ZWw7Il19
},{}]},{},[5])