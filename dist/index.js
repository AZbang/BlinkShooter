(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const Entity = require('./Entity');

class Enemy extends Entity {
	constructor(level, x, y, type = 'robot') {
		super(level, x, y, type);

		// coping flags and deleting flags which is not in walking distance
		this.flags = this.level.patruleFlags.slice(0);
		this.flags.forEach((flag, i) => {
			let layer = this.level.layerMap;
			let x = layer.getTileX(this.sprite.x + this.sprite.width / 2);
			let y = layer.getTileY(this.sprite.y + this.sprite.height / 2);
			let x2 = layer.getTileX(flag.x + flag.width / 2);
			let y2 = layer.getTileY(flag.y + flag.height / 2);

			this.level.pathfinder.setCallbackFunction(path => {
				if (path == null) this.flags.splice(i, 1);
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
		if (distance < this.radiusVisibility) {
			let angle = this.level.physics.arcade.angleToXY(this.sprite, this.level.player.sprite.x, this.level.player.sprite.y);
			this.level.add.tween(this.sprite).to({ rotation: angle }, this.speed / 2).start();
			this.weapon.fire();

			// patrule mode off
			this.isPatruleMode = false;
		}
	}

	onWounded() {
		!this.hp-- && this.dead();
	}
	findPathToFlag() {
		if (!this.isPatruleMode) return;

		this.flag = this.findСlosestFlag();
		this.flag.countRepeat = Math.round(this.flags.length / 2);

		let layer = this.level.layerMap;
		let x = layer.getTileX(this.sprite.x + this.sprite.width / 2);
		let y = layer.getTileY(this.sprite.y + this.sprite.height / 2);
		let x2 = layer.getTileX(this.flag.x + this.flag.width / 2);
		let y2 = layer.getTileY(this.flag.y + this.flag.height / 2);

		this.level.pathfinder.setCallbackFunction(path => {
			if (path == null) return;
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
			if (path[i] == null || !this.isPatruleMode) {
				timer.destroy();
				this.level.time.events.add(1000, this.findPathToFlag, this);
				return;
			}

			this.level.add.tween(this.sprite).to({ rotation: this.level.physics.arcade.angleToXY(this.sprite, path[i].x * 16 + 8, path[i].y * 16 + 8) }, this.speed / 2).start();

			this.level.physics.arcade.moveToXY(this.sprite, path[i].x * 16 + 8, path[i].y * 16 + 8, 30, this.speed);
		}, this);
		timer.start();
	}

	findСlosestFlag() {
		// using not used flags (countRepeat) and finded closest flag
		let min = Infinity;
		let resultFlag;
		this.flags.forEach(flag => {
			let dist = this.level.physics.arcade.distanceBetween(this.sprite, flag);
			if (min > dist) {
				if (this.flag) if (flag.countRepeat) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVuZW15LmpzIl0sIm5hbWVzIjpbIkVudGl0eSIsInJlcXVpcmUiLCJFbmVteSIsImNvbnN0cnVjdG9yIiwibGV2ZWwiLCJ4IiwieSIsInR5cGUiLCJmbGFncyIsInBhdHJ1bGVGbGFncyIsInNsaWNlIiwiZm9yRWFjaCIsImZsYWciLCJpIiwibGF5ZXIiLCJsYXllck1hcCIsImdldFRpbGVYIiwic3ByaXRlIiwid2lkdGgiLCJnZXRUaWxlWSIsImhlaWdodCIsIngyIiwieTIiLCJwYXRoZmluZGVyIiwic2V0Q2FsbGJhY2tGdW5jdGlvbiIsInBhdGgiLCJzcGxpY2UiLCJfZWFzeVN0YXIiLCJlbmFibGVEaWFnb25hbHMiLCJwcmVwYXJlUGF0aENhbGN1bGF0aW9uIiwiY2FsY3VsYXRlUGF0aCIsImlzUGF0cnVsZU1vZGUiLCJmaW5kUGF0aFRvRmxhZyIsInVwZGF0ZSIsImRpc3RhbmNlIiwicGh5c2ljcyIsImFyY2FkZSIsImRpc3RhbmNlQmV0d2VlbiIsInBsYXllciIsInJhZGl1c1Zpc2liaWxpdHkiLCJhbmdsZSIsImFuZ2xlVG9YWSIsImFkZCIsInR3ZWVuIiwidG8iLCJyb3RhdGlvbiIsInNwZWVkIiwic3RhcnQiLCJ3ZWFwb24iLCJmaXJlIiwib25Xb3VuZGVkIiwiaHAiLCJkZWFkIiwiZmluZNChbG9zZXN0RmxhZyIsImNvdW50UmVwZWF0IiwiTWF0aCIsInJvdW5kIiwibGVuZ3RoIiwibW92ZVRvRmxhZyIsInRpbWVyIiwidGltZSIsImNyZWF0ZSIsImxvb3AiLCJkZXN0cm95IiwiZXZlbnRzIiwibW92ZVRvWFkiLCJtaW4iLCJJbmZpbml0eSIsInJlc3VsdEZsYWciLCJkaXN0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTUEsU0FBU0MsUUFBUSxVQUFSLENBQWY7O0FBRUEsTUFBTUMsS0FBTixTQUFvQkYsTUFBcEIsQ0FBMkI7QUFDMUJHLGFBQVlDLEtBQVosRUFBbUJDLENBQW5CLEVBQXNCQyxDQUF0QixFQUF5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RyxPQUFYLENBQW9CQyxJQUFELElBQVU7QUFDNUIsT0FBSXlELE9BQU8sS0FBS2pFLEtBQUwsQ0FBVytCLE9BQVgsQ0FBbUJDLE1BQW5CLENBQTBCQyxlQUExQixDQUEwQyxLQUFLcEIsTUFBL0MsRUFBdURMLElBQXZELENBQVg7QUFDQSxPQUFHc0QsTUFBTUcsSUFBVCxFQUFlO0FBQ2QsUUFBRyxLQUFLekQsSUFBUixFQUNDLElBQUdBLEtBQUswQyxXQUFSLEVBQXFCO0FBQ3BCMUMsVUFBSzBDLFdBQUw7QUFDQTtBQUNBOztBQUVGWSxVQUFNRyxJQUFOO0FBQ0FELGlCQUFheEQsSUFBYjtBQUNBO0FBQ0QsR0FaRDtBQWFBLFNBQU93RCxjQUFjLEtBQUt4RCxJQUExQjtBQUNBO0FBdkd5Qjs7QUEwRzNCMEQsT0FBT0MsT0FBUCxHQUFpQnJFLEtBQWpCIiwiZmlsZSI6IkVuZW15LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRW50aXR5ID0gcmVxdWlyZSgnLi9FbnRpdHknKTtcclxuXHJcbmNsYXNzIEVuZW15IGV4dGVuZHMgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihsZXZlbCwgeCwgeSwgdHlwZT0ncm9ib3QnKSB7XHJcblx0XHRzdXBlcihsZXZlbCwgeCwgeSwgdHlwZSk7XHJcblxyXG5cdFx0Ly8gY29waW5nIGZsYWdzIGFuZCBkZWxldGluZyBmbGFncyB3aGljaCBpcyBub3QgaW4gd2Fsa2luZyBkaXN0YW5jZVxyXG5cdFx0dGhpcy5mbGFncyA9IHRoaXMubGV2ZWwucGF0cnVsZUZsYWdzLnNsaWNlKDApO1xyXG5cdFx0dGhpcy5mbGFncy5mb3JFYWNoKChmbGFnLCBpKSA9PiB7XHJcblx0XHRcdGxldCBsYXllciA9IHRoaXMubGV2ZWwubGF5ZXJNYXA7XHJcblx0XHRcdGxldCB4ID0gbGF5ZXIuZ2V0VGlsZVgodGhpcy5zcHJpdGUueCt0aGlzLnNwcml0ZS53aWR0aC8yKTtcclxuXHRcdFx0bGV0IHkgPSBsYXllci5nZXRUaWxlWSh0aGlzLnNwcml0ZS55K3RoaXMuc3ByaXRlLmhlaWdodC8yKTtcclxuXHRcdFx0bGV0IHgyID0gbGF5ZXIuZ2V0VGlsZVgoZmxhZy54K2ZsYWcud2lkdGgvMik7XHJcblx0XHRcdGxldCB5MiA9IGxheWVyLmdldFRpbGVZKGZsYWcueStmbGFnLmhlaWdodC8yKTtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMubGV2ZWwucGF0aGZpbmRlci5zZXRDYWxsYmFja0Z1bmN0aW9uKChwYXRoKSA9PiB7XHJcblx0XHRcdFx0aWYocGF0aCA9PSBudWxsKSB0aGlzLmZsYWdzLnNwbGljZShpLCAxKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLmxldmVsLnBhdGhmaW5kZXIuX2Vhc3lTdGFyLmVuYWJsZURpYWdvbmFscygpO1xyXG5cdFx0XHR0aGlzLmxldmVsLnBhdGhmaW5kZXIucHJlcGFyZVBhdGhDYWxjdWxhdGlvbihbeCwgeV0sIFt4MiwgeTJdKTtcclxuXHRcdFx0dGhpcy5sZXZlbC5wYXRoZmluZGVyLmNhbGN1bGF0ZVBhdGgoKTtcclxuXHRcdH0pO1xyXG5cdFx0Ly8gcGF0cnVsZSBtb2RlIG9uIVxyXG5cdFx0dGhpcy5pc1BhdHJ1bGVNb2RlID0gdHJ1ZTtcclxuXHRcdHRoaXMuZmluZFBhdGhUb0ZsYWcoKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZSgpIHtcclxuXHRcdC8vIGlmIGVuZW15IHNhdyBwbGF5ZXIsIHRoZW4gaGUgc3RhcnRpbmcgYXR0YWNrIGhpbVxyXG5cdFx0bGV0IGRpc3RhbmNlID0gdGhpcy5sZXZlbC5waHlzaWNzLmFyY2FkZS5kaXN0YW5jZUJldHdlZW4odGhpcy5zcHJpdGUsIHRoaXMubGV2ZWwucGxheWVyLnNwcml0ZSk7XHJcblx0XHRpZihkaXN0YW5jZSA8IHRoaXMucmFkaXVzVmlzaWJpbGl0eSkge1xyXG5cdFx0XHRsZXQgYW5nbGUgPSB0aGlzLmxldmVsLnBoeXNpY3MuYXJjYWRlLmFuZ2xlVG9YWSh0aGlzLnNwcml0ZSwgdGhpcy5sZXZlbC5wbGF5ZXIuc3ByaXRlLngsICB0aGlzLmxldmVsLnBsYXllci5zcHJpdGUueSk7XHJcblx0XHRcdHRoaXMubGV2ZWwuYWRkLnR3ZWVuKHRoaXMuc3ByaXRlKVxyXG5cdFx0XHRcdC50byh7cm90YXRpb246IGFuZ2xlfSwgdGhpcy5zcGVlZC8yKVxyXG5cdFx0XHRcdC5zdGFydCgpO1xyXG5cdFx0XHR0aGlzLndlYXBvbi5maXJlKCk7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBwYXRydWxlIG1vZGUgb2ZmXHJcblx0XHRcdHRoaXMuaXNQYXRydWxlTW9kZSA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0b25Xb3VuZGVkKCkge1xyXG5cdFx0IXRoaXMuaHAtLSAmJiB0aGlzLmRlYWQoKTtcclxuXHR9XHJcblx0ZmluZFBhdGhUb0ZsYWcoKSB7XHJcblx0XHRpZighdGhpcy5pc1BhdHJ1bGVNb2RlKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5mbGFnID0gdGhpcy5maW5k0KFsb3Nlc3RGbGFnKCk7XHJcblx0XHR0aGlzLmZsYWcuY291bnRSZXBlYXQgPSBNYXRoLnJvdW5kKHRoaXMuZmxhZ3MubGVuZ3RoLzIpO1xyXG5cclxuXHRcdGxldCBsYXllciA9IHRoaXMubGV2ZWwubGF5ZXJNYXA7XHJcblx0XHRsZXQgeCA9IGxheWVyLmdldFRpbGVYKHRoaXMuc3ByaXRlLngrdGhpcy5zcHJpdGUud2lkdGgvMik7XHJcblx0XHRsZXQgeSA9IGxheWVyLmdldFRpbGVZKHRoaXMuc3ByaXRlLnkrdGhpcy5zcHJpdGUuaGVpZ2h0LzIpO1xyXG5cdFx0bGV0IHgyID0gbGF5ZXIuZ2V0VGlsZVgodGhpcy5mbGFnLngrdGhpcy5mbGFnLndpZHRoLzIpO1xyXG5cdFx0bGV0IHkyID0gbGF5ZXIuZ2V0VGlsZVkodGhpcy5mbGFnLnkrdGhpcy5mbGFnLmhlaWdodC8yKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5sZXZlbC5wYXRoZmluZGVyLnNldENhbGxiYWNrRnVuY3Rpb24oKHBhdGgpID0+IHtcclxuXHRcdFx0aWYocGF0aCA9PSBudWxsKSByZXR1cm47XHJcblx0XHRcdHRoaXMubW92ZVRvRmxhZyhwYXRoKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMubGV2ZWwucGF0aGZpbmRlci5wcmVwYXJlUGF0aENhbGN1bGF0aW9uKFt4LCB5XSwgW3gyLCB5Ml0pO1xyXG5cdFx0dGhpcy5sZXZlbC5wYXRoZmluZGVyLmNhbGN1bGF0ZVBhdGgoKTtcclxuXHR9XHJcblxyXG5cdG1vdmVUb0ZsYWcocGF0aCkge1xyXG5cdFx0bGV0IGkgPSAwO1xyXG5cdFx0bGV0IHRpbWVyID0gdGhpcy5sZXZlbC50aW1lLmNyZWF0ZShmYWxzZSk7XHJcblx0XHR0aW1lci5sb29wKHRoaXMuc3BlZWQsICgpID0+IHtcclxuXHRcdFx0aSsrO1xyXG5cdFx0XHRpZihwYXRoW2ldID09IG51bGwgfHwgIXRoaXMuaXNQYXRydWxlTW9kZSkge1xyXG5cdFx0XHRcdHRpbWVyLmRlc3Ryb3koKTtcclxuXHRcdFx0XHR0aGlzLmxldmVsLnRpbWUuZXZlbnRzLmFkZCgxMDAwLCB0aGlzLmZpbmRQYXRoVG9GbGFnLCB0aGlzKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMubGV2ZWwuYWRkLnR3ZWVuKHRoaXMuc3ByaXRlKVxyXG5cdFx0XHRcdC50byh7cm90YXRpb246IHRoaXMubGV2ZWwucGh5c2ljcy5hcmNhZGUuYW5nbGVUb1hZKHRoaXMuc3ByaXRlLCBwYXRoW2ldLngqMTYrOCwgcGF0aFtpXS55KjE2KzgpfSwgdGhpcy5zcGVlZC8yKVxyXG5cdFx0XHRcdC5zdGFydCgpO1xyXG5cclxuXHRcdFx0dGhpcy5sZXZlbC5waHlzaWNzLmFyY2FkZS5tb3ZlVG9YWSh0aGlzLnNwcml0ZSwgcGF0aFtpXS54KjE2KzgsIHBhdGhbaV0ueSoxNis4LCAzMCwgdGhpcy5zcGVlZCk7XHJcblx0XHR9LCB0aGlzKTtcclxuXHRcdHRpbWVyLnN0YXJ0KCk7XHJcblx0fVxyXG5cclxuXHRmaW5k0KFsb3Nlc3RGbGFnKCkge1xyXG5cdFx0Ly8gdXNpbmcgbm90IHVzZWQgZmxhZ3MgKGNvdW50UmVwZWF0KSBhbmQgZmluZGVkIGNsb3Nlc3QgZmxhZ1xyXG5cdFx0bGV0IG1pbiA9IEluZmluaXR5O1xyXG5cdFx0bGV0IHJlc3VsdEZsYWc7XHJcblx0XHR0aGlzLmZsYWdzLmZvckVhY2goKGZsYWcpID0+IHtcclxuXHRcdFx0bGV0IGRpc3QgPSB0aGlzLmxldmVsLnBoeXNpY3MuYXJjYWRlLmRpc3RhbmNlQmV0d2Vlbih0aGlzLnNwcml0ZSwgZmxhZyk7XHJcblx0XHRcdGlmKG1pbiA+IGRpc3QpIHtcclxuXHRcdFx0XHRpZih0aGlzLmZsYWcpIFxyXG5cdFx0XHRcdFx0aWYoZmxhZy5jb3VudFJlcGVhdCkge1xyXG5cdFx0XHRcdFx0XHRmbGFnLmNvdW50UmVwZWF0LS07XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bWluID0gZGlzdDtcclxuXHRcdFx0XHRyZXN1bHRGbGFnID0gZmxhZztcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gcmVzdWx0RmxhZyB8fCB0aGlzLmZsYWc7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVuZW15OyJdfQ==
},{"./Entity":2}],2:[function(require,module,exports){
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

		// this.legs = this.level.add.sprite(this.x, this.y, 'legs', 0);
		// this.legs.anchor.set(0.5);
		// this.legs.smoothed = false;
		// this.legs.animations.add('walk');

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

		this.tweenBreathe = this.level.add.tween(this.sprite.scale).to({ x: 1.1, y: 1.1 }, 600, Phaser.Easing.Quadratic.Out).to({ x: 1, y: 1 }, 500, Phaser.Easing.Quadratic.In).loop();
		this.tweenBreathe.start();
	}

	_update() {
		if (this.isDead) return;

		// colliding with solid tiles
		this.level.physics.arcade.collide(this.sprite, this.level.firstLayerMap);

		// update weapon collisions
		this.weapon.update();

		// collision person with bullets
		let bullets = this.level.bullets.children;
		for (let i = 0; i < bullets.length; i++) {
			if (this.constructor.name === bullets[i].typeOwner) continue;

			this.level.physics.arcade.overlap(bullets[i], this.sprite, (person, bullet) => {
				if (!this.isJumping && bullet.scale.x < 1) {
					this.sprite.body.velocity.x += Math.cos(this.sprite.rotation) * 10;
					this.sprite.body.velocity.y += Math.sin(this.sprite.rotation) * 10;
					this.onWounded && this.onWounded();
					bullet.kill();
				}
			});
		}

		// colliding with empty map (dead)
		if (!this.isJumping) {
			for (let i = 0; i < this.level.deadAreas.length; i++) {
				let rect = this.level.deadAreas[i];

				let pl = new Phaser.Rectangle(this.sprite.body.x, this.sprite.body.y, this.sprite.body.width, this.sprite.body.height);
				if (Phaser.Rectangle.intersects(rect, pl)) {
					this.sprite.body.acceleration.set(0);
					this.fallDead();
					return;
				}
			}
		}

		// updating tracking weapon with sprite during jumping
		if (this.isJumping) this.weapon.updateTrack();

		// extends update!
		this.update && this.update();
	}

	jump(power = this.jumping) {
		this.isJumping = true;
		this.tweenBreathe.pause();

		this.tweenJump = this.level.add.tween(this.sprite.scale).to({ x: power, y: power }, 300, Phaser.Easing.Quadratic.Out).to({ x: 1, y: 1 }, 300, Phaser.Easing.Quintic.In).start();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVudGl0eS5qcyJdLCJuYW1lcyI6WyJXZWFwb24iLCJyZXF1aXJlIiwiZW50aXRpZXMiLCJFbnRpdHkiLCJjb25zdHJ1Y3RvciIsImxldmVsIiwieCIsInkiLCJ0eXBlIiwiX2VudGl0eSIsImhwIiwianVtcGluZyIsImp1bXAiLCJzcGVlZCIsInJhZGl1c1Zpc2liaWxpdHkiLCJpc0p1bXBpbmciLCJpc0RlYWQiLCJoZWFkSWQiLCJoZWFkIiwiYm9keUlkIiwiYm9keSIsImF0dGFjaFRvQm9keUlkIiwiYXR0YWNoVG9Cb2R5Iiwid2VhcG9uSWQiLCJ3ZWFwb24iLCJfY3JlYXRlUGhhc2VyT2JqZWN0cyIsImZ4SnVtcCIsImFkZCIsInNwcml0ZSIsImFscGhhIiwic2NhbGUiLCJzZXQiLCJhbmNob3IiLCJzbW9vdGhlZCIsImFuaW1hdGlvbnMiLCJjbGFzcyIsIm1ha2UiLCJhZGRDaGlsZCIsInBoeXNpY3MiLCJhcmNhZGUiLCJlbmFibGUiLCJkcmFnIiwibWF4VmVsb2NpdHkiLCJzeW5jQm91bmRzIiwidHdlZW5CcmVhdGhlIiwidHdlZW4iLCJ0byIsIlBoYXNlciIsIkVhc2luZyIsIlF1YWRyYXRpYyIsIk91dCIsIkluIiwibG9vcCIsInN0YXJ0IiwiX3VwZGF0ZSIsImNvbGxpZGUiLCJmaXJzdExheWVyTWFwIiwidXBkYXRlIiwiYnVsbGV0cyIsImNoaWxkcmVuIiwiaSIsImxlbmd0aCIsIm5hbWUiLCJ0eXBlT3duZXIiLCJvdmVybGFwIiwicGVyc29uIiwiYnVsbGV0IiwidmVsb2NpdHkiLCJNYXRoIiwiY29zIiwicm90YXRpb24iLCJzaW4iLCJvbldvdW5kZWQiLCJraWxsIiwiZGVhZEFyZWFzIiwicmVjdCIsInBsIiwiUmVjdGFuZ2xlIiwid2lkdGgiLCJoZWlnaHQiLCJpbnRlcnNlY3RzIiwiYWNjZWxlcmF0aW9uIiwiZmFsbERlYWQiLCJ1cGRhdGVUcmFjayIsInBvd2VyIiwicGF1c2UiLCJ0d2Vlbkp1bXAiLCJRdWludGljIiwib25Db21wbGV0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QUFYLENBQWVrQixLQUFmLENBQXFCLEtBQUtqQixNQUFMLENBQVlFLEtBQWpDLEVBQXdDZ0IsRUFBeEMsQ0FBMkM7QUFDckR4QyxNQUFHLENBRGtEO0FBRXJEQyxNQUFHO0FBRmtELEdBQTNDLEVBR1IsR0FIUSxFQUdId0MsT0FBT0MsTUFBUCxDQUFjQyxTQUFkLENBQXdCRSxFQUhyQixFQUd5QixJQUh6QixDQUFYO0FBSUF1QyxPQUFLRixVQUFMLENBQWdCN0QsR0FBaEIsQ0FBb0IsTUFBTTtBQUN6QixRQUFLZ0UsTUFBTCxJQUFlLEtBQUtBLE1BQUwsRUFBZjtBQUNBLEdBRkQ7QUFHQTtBQTVJVzs7QUErSWJDLE9BQU9DLE9BQVAsR0FBaUIxRixNQUFqQiIsImZpbGUiOiJFbnRpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBXZWFwb24gPSByZXF1aXJlKCcuL1dlYXBvbi5qcycpO1xyXG5jb25zdCBlbnRpdGllcyA9IHJlcXVpcmUoJy4vZW50aXRpZXMuanNvbicpO1xyXG5cclxuY2xhc3MgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihsZXZlbCwgeCwgeSwgdHlwZSkge1xyXG5cdFx0dGhpcy50eXBlID0gdHlwZTtcclxuXHRcdHRoaXMubGV2ZWwgPSBsZXZlbDtcclxuXHJcblx0XHR0aGlzLnggPSB4ICE9IG51bGwgPyB4IDogMDtcclxuXHRcdHRoaXMueSA9IHkgIT0gbnVsbCA/IHkgOiAwO1xyXG5cclxuXHRcdHRoaXMuX2VudGl0eSA9IGVudGl0aWVzW3R5cGVdO1xyXG5cclxuXHRcdHRoaXMuaHAgPSB0aGlzLl9lbnRpdHkuaHAgIT0gbnVsbCA/IHRoaXMuX2VudGl0eS5ocCA6IDEwO1xyXG5cdFx0dGhpcy5qdW1waW5nID0gdGhpcy5fZW50aXR5Lmp1bXAgIT0gbnVsbCA/IHRoaXMuX2VudGl0eS5qdW1wIDogMjtcclxuXHRcdHRoaXMuc3BlZWQgPSB0aGlzLl9lbnRpdHkuc3BlZWQgIT0gbnVsbCA/IHRoaXMuX2VudGl0eS5zcGVlZCA6IDEwMDtcclxuXHRcdHRoaXMucmFkaXVzVmlzaWJpbGl0eSA9IHRoaXMuX2VudGl0eS5yYWRpdXNWaXNpYmlsaXR5ICE9IG51bGwgPyB0aGlzLl9lbnRpdHkucmFkaXVzVmlzaWJpbGl0eSA6IDEwMDtcclxuXHRcdHRoaXMuaXNKdW1waW5nID0gZmFsc2U7XHJcblx0XHR0aGlzLmlzRGVhZCA9IGZhbHNlO1xyXG5cclxuXHRcdHRoaXMuaGVhZElkID0gdGhpcy5fZW50aXR5LmhlYWQgIT0gbnVsbCA/IHRoaXMuX2VudGl0eS5oZWFkIDogMDtcclxuXHRcdHRoaXMuYm9keUlkID0gdGhpcy5fZW50aXR5LmJvZHkgIT0gbnVsbCA/IHRoaXMuX2VudGl0eS5ib2R5IDogMDtcclxuXHRcdHRoaXMuYXR0YWNoVG9Cb2R5SWQgPSB0aGlzLl9lbnRpdHkuYXR0YWNoVG9Cb2R5ICE9IG51bGwgPyB0aGlzLl9lbnRpdHkuYXR0YWNoVG9Cb2R5IDogMDtcclxuXHRcdHRoaXMud2VhcG9uSWQgPSB0aGlzLl9lbnRpdHkud2VhcG9uICE9IG51bGwgPyB0aGlzLl9lbnRpdHkud2VhcG9uIDogJ2JsYXN0ZXInO1xyXG5cclxuXHRcdHRoaXMuX2NyZWF0ZVBoYXNlck9iamVjdHMoKTtcclxuXHR9XHJcblxyXG5cdF9jcmVhdGVQaGFzZXJPYmplY3RzKCkge1xyXG5cdFx0dGhpcy5meEp1bXAgPSB0aGlzLmxldmVsLmFkZC5zcHJpdGUodGhpcy54LCB0aGlzLnksICdmeF9qdW1wJywgMCk7XHJcblx0XHR0aGlzLmZ4SnVtcC5hbHBoYSA9IDA7XHJcblx0XHR0aGlzLmZ4SnVtcC5zY2FsZS5zZXQoMik7XHJcblx0XHR0aGlzLmZ4SnVtcC5hbmNob3Iuc2V0KDAuNSk7XHJcblx0XHR0aGlzLmZ4SnVtcC5zbW9vdGhlZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5meEp1bXAuYW5pbWF0aW9ucy5hZGQoJ2FjdGl2ZScpO1xyXG5cclxuXHRcdC8vIHRoaXMubGVncyA9IHRoaXMubGV2ZWwuYWRkLnNwcml0ZSh0aGlzLngsIHRoaXMueSwgJ2xlZ3MnLCAwKTtcclxuXHRcdC8vIHRoaXMubGVncy5hbmNob3Iuc2V0KDAuNSk7XHJcblx0XHQvLyB0aGlzLmxlZ3Muc21vb3RoZWQgPSBmYWxzZTtcclxuXHRcdC8vIHRoaXMubGVncy5hbmltYXRpb25zLmFkZCgnd2FsaycpO1xyXG5cclxuXHRcdHRoaXMuc3ByaXRlID0gdGhpcy5sZXZlbC5hZGQuc3ByaXRlKHRoaXMueCwgdGhpcy55LCAnYm9kaWVzJywgdGhpcy5ib2R5SWQpO1xyXG5cdFx0dGhpcy5zcHJpdGUuYW5jaG9yLnNldCgwLjUpO1xyXG5cdFx0dGhpcy5zcHJpdGUuc21vb3RoZWQgPSBmYWxzZTtcclxuXHRcdHRoaXMuc3ByaXRlLmNsYXNzID0gdGhpcztcclxuXHJcblx0XHR0aGlzLmhlYWQgPSB0aGlzLmxldmVsLm1ha2Uuc3ByaXRlKC0xMiwgLTcsICdoZWFkcycsIHRoaXMuaGVhZElkKTtcclxuXHRcdHRoaXMuaGVhZC5zbW9vdGhlZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5zcHJpdGUuYWRkQ2hpbGQodGhpcy5oZWFkKTtcclxuXHJcblx0XHR0aGlzLmF0dGFjaFRvQm9keSA9IHRoaXMubGV2ZWwubWFrZS5zcHJpdGUoMy41LCAtNCwgJ2F0dGFjaFRvQm9keScsIHRoaXMuYXR0YWNoVG9Cb2R5SWQpO1xyXG5cdFx0dGhpcy5hdHRhY2hUb0JvZHkuc21vb3RoZWQgPSBmYWxzZTtcclxuXHRcdHRoaXMuc3ByaXRlLmFkZENoaWxkKHRoaXMuYXR0YWNoVG9Cb2R5KTtcdFxyXG5cclxuXHRcdHRoaXMud2VhcG9uID0gbmV3IFdlYXBvbih0aGlzLCB0aGlzLndlYXBvbklkKTtcclxuXHRcdFxyXG5cdFx0dGhpcy5sZXZlbC5waHlzaWNzLmFyY2FkZS5lbmFibGUodGhpcy5zcHJpdGUpO1xyXG5cdFx0dGhpcy5zcHJpdGUuYm9keS5kcmFnLnNldCgxNTApO1xyXG5cdFx0dGhpcy5zcHJpdGUuYm9keS5tYXhWZWxvY2l0eS5zZXQoMTAwKTtcclxuXHRcdHRoaXMuc3ByaXRlLnN5bmNCb3VuZHMgPSB0cnVlO1xyXG5cclxuXHRcdHRoaXMudHdlZW5CcmVhdGhlID0gdGhpcy5sZXZlbC5hZGQudHdlZW4odGhpcy5zcHJpdGUuc2NhbGUpXHJcblx0XHRcdC50byh7eDoxLjEsIHk6IDEuMX0sIDYwMCwgUGhhc2VyLkVhc2luZy5RdWFkcmF0aWMuT3V0KVxyXG5cdFx0XHQudG8oe3g6IDEsIHk6IDF9LCA1MDAsIFBoYXNlci5FYXNpbmcuUXVhZHJhdGljLkluKVxyXG5cdFx0XHQubG9vcCgpO1xyXG5cdFx0dGhpcy50d2VlbkJyZWF0aGUuc3RhcnQoKTtcclxuXHR9XHJcblxyXG5cdF91cGRhdGUoKSB7XHJcblx0XHRpZih0aGlzLmlzRGVhZCkgcmV0dXJuO1xyXG5cclxuXHRcdC8vIGNvbGxpZGluZyB3aXRoIHNvbGlkIHRpbGVzXHJcblx0XHR0aGlzLmxldmVsLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUodGhpcy5zcHJpdGUsIHRoaXMubGV2ZWwuZmlyc3RMYXllck1hcCk7XHJcblxyXG5cdFx0Ly8gdXBkYXRlIHdlYXBvbiBjb2xsaXNpb25zXHJcblx0XHR0aGlzLndlYXBvbi51cGRhdGUoKTtcclxuXHJcblx0XHQvLyBjb2xsaXNpb24gcGVyc29uIHdpdGggYnVsbGV0c1xyXG5cdFx0bGV0IGJ1bGxldHMgPSB0aGlzLmxldmVsLmJ1bGxldHMuY2hpbGRyZW47XHJcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgYnVsbGV0cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZih0aGlzLmNvbnN0cnVjdG9yLm5hbWUgPT09IGJ1bGxldHNbaV0udHlwZU93bmVyKSBjb250aW51ZTtcclxuXHJcblx0XHRcdHRoaXMubGV2ZWwucGh5c2ljcy5hcmNhZGUub3ZlcmxhcChidWxsZXRzW2ldLCB0aGlzLnNwcml0ZSwgKHBlcnNvbiwgYnVsbGV0KSA9PiB7XHJcblx0XHRcdFx0aWYoIXRoaXMuaXNKdW1waW5nICYmIGJ1bGxldC5zY2FsZS54IDwgMSkge1xyXG5cdFx0XHRcdFx0dGhpcy5zcHJpdGUuYm9keS52ZWxvY2l0eS54ICs9IE1hdGguY29zKHRoaXMuc3ByaXRlLnJvdGF0aW9uKSAqIDEwO1xyXG5cdFx0XHRcdFx0dGhpcy5zcHJpdGUuYm9keS52ZWxvY2l0eS55ICs9IE1hdGguc2luKHRoaXMuc3ByaXRlLnJvdGF0aW9uKSAqIDEwO1xyXG5cdFx0XHRcdFx0dGhpcy5vbldvdW5kZWQgJiYgdGhpcy5vbldvdW5kZWQoKTtcclxuXHRcdFx0XHRcdGJ1bGxldC5raWxsKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBjb2xsaWRpbmcgd2l0aCBlbXB0eSBtYXAgKGRlYWQpXHJcblx0XHRpZighdGhpcy5pc0p1bXBpbmcpIHtcclxuXHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8IHRoaXMubGV2ZWwuZGVhZEFyZWFzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0bGV0IHJlY3QgPSB0aGlzLmxldmVsLmRlYWRBcmVhc1tpXTtcclxuXHJcblx0XHRcdFx0bGV0IHBsID0gbmV3IFBoYXNlci5SZWN0YW5nbGUodGhpcy5zcHJpdGUuYm9keS54LCB0aGlzLnNwcml0ZS5ib2R5LnksIHRoaXMuc3ByaXRlLmJvZHkud2lkdGgsIHRoaXMuc3ByaXRlLmJvZHkuaGVpZ2h0KTtcclxuXHRcdFx0XHRpZihQaGFzZXIuUmVjdGFuZ2xlLmludGVyc2VjdHMocmVjdCwgcGwpKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNwcml0ZS5ib2R5LmFjY2VsZXJhdGlvbi5zZXQoMCk7XHJcblx0XHRcdFx0XHR0aGlzLmZhbGxEZWFkKCk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdXBkYXRpbmcgdHJhY2tpbmcgd2VhcG9uIHdpdGggc3ByaXRlIGR1cmluZyBqdW1waW5nXHJcblx0XHRpZih0aGlzLmlzSnVtcGluZykgdGhpcy53ZWFwb24udXBkYXRlVHJhY2soKTtcclxuXHJcblx0XHQvLyBleHRlbmRzIHVwZGF0ZSFcclxuXHRcdHRoaXMudXBkYXRlICYmIHRoaXMudXBkYXRlKCk7XHJcblx0fVxyXG5cclxuXHRqdW1wKHBvd2VyPXRoaXMuanVtcGluZykge1xyXG5cdFx0dGhpcy5pc0p1bXBpbmcgPSB0cnVlO1xyXG5cdFx0dGhpcy50d2VlbkJyZWF0aGUucGF1c2UoKTtcclxuXHJcblx0XHR0aGlzLnR3ZWVuSnVtcCA9IHRoaXMubGV2ZWwuYWRkLnR3ZWVuKHRoaXMuc3ByaXRlLnNjYWxlKVxyXG5cdFx0XHQudG8oe3g6IHBvd2VyLCB5OiBwb3dlcn0sIDMwMCwgUGhhc2VyLkVhc2luZy5RdWFkcmF0aWMuT3V0KVxyXG5cdFx0XHQudG8oe3g6IDEsIHk6IDF9LCAzMDAsIFBoYXNlci5FYXNpbmcuUXVpbnRpYy5JbilcclxuXHRcdFx0LnN0YXJ0KCk7XHJcblx0XHR0aGlzLnR3ZWVuSnVtcC5vbkNvbXBsZXRlLmFkZCgoKSA9PiB7XHJcblx0XHRcdHRoaXMuaXNKdW1waW5nID0gZmFsc2U7XHJcblx0XHRcdHRoaXMudHdlZW5CcmVhdGhlLnJlc3VtZSgpO1xyXG5cdFx0XHR0aGlzLndlYXBvbi51cGRhdGVUcmFjaygpO1xyXG5cdFx0fSwgdGhpcyk7XHJcblx0fVxyXG5cclxuXHRkZWFkKCkge1xyXG5cdFx0dGhpcy5zcHJpdGUua2lsbCgpO1xyXG5cdFx0dGhpcy5pc0RlYWQgPSB0cnVlO1xyXG5cdFx0dGhpcy5vbkRlYWQgJiYgdGhpcy5vbkRlYWQoKTtcclxuXHR9XHJcblxyXG5cdGZhbGxEZWFkKCkge1xyXG5cdFx0dGhpcy5pc0RlYWQgPSB0cnVlO1xyXG5cdFx0bGV0IGRlYWQgPSB0aGlzLmxldmVsLmFkZC50d2Vlbih0aGlzLnNwcml0ZS5zY2FsZSkudG8oe1xyXG5cdFx0XHR4OiAwLCBcclxuXHRcdFx0eTogMFxyXG5cdFx0fSwgMzAwLCBQaGFzZXIuRWFzaW5nLlF1YWRyYXRpYy5JbiwgdHJ1ZSk7XHJcblx0XHRkZWFkLm9uQ29tcGxldGUuYWRkKCgpID0+IHtcclxuXHRcdFx0dGhpcy5vbkRlYWQgJiYgdGhpcy5vbkRlYWQoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbnRpdHk7Il19
},{"./Weapon.js":5,"./entities.json":6}],3:[function(require,module,exports){

class LevelInterface {
	constructor(level, data) {
		this.level = level;

		this.padding = {
			x: 10,
			y: 10
		};

		// HP BAR
		this.lifebox = this.level.add.sprite(this.padding.x, this.padding.y, 'lifebox');
		this.lifebox.fixedToCamera = true;
		this.hp = data.hp;
		for (let i = 0; i < this.hp; i++) {
			let life = this.level.add.sprite(7 * i + 12, 6, 'liferect');
			this.lifebox.addChild(life);
		}

		// SCORES
		this.scores = data.scores;
		this.textScores = this.level.add.bitmapText(this.padding.x + 10, this.padding.y + 30, 'font', this.scores, 20);
		this.textScores.fixedToCamera = true;
		this.textScores.smoothed = false;

		this.timerHP = this.level.time.create(false);
		this.timerScores = this.level.time.create(false);
		this.timerText = this.level.time.create(false);

		// TEXT WINDOW
		this.textWindow = this.level.add.sprite(90, this.padding.y, 'window');
		this.textWindow.alpha = 0;
		this.textWindow.fixedToCamera = true;
		this.textWindow.inputEnabled = true;

		let content = this.level.add.bitmapText(20, 5, 'font2', null, 13);
		this.textWindow.addChild(content);

		let infoText = this.level.add.bitmapText(this.textWindow.width - 5, this.textWindow.height - 10, 'font2', 'TAP TO CONTINUE', 15);
		infoText.anchor.set(1);
		this.textWindow.addChild(infoText);

		this.blinkInfoText = this.level.add.tween(infoText).to({ alpha: 0 }, 300).to({ alpha: 1 }, 300).loop();

		this.fxVoice = this.level.add.sprite(this.padding.x + 15, this.textWindow.height + this.textWindow.y, 'fx_voice', 0);
		this.fxVoice.anchor.set(0, 1);
		this.fxVoice.scale.set(2);
		this.fxVoice.alpha = 0;
		this.fxVoice.fixedToCamera = true;
		this.fxVoice.smoothed = false;
		this.fxVoice.animations.add('active');
	}

	showTextWindow(info, current = 1) {
		this.textWindow.children[0].text = '';

		if (info['text' + current]) {
			this.level.add.tween(this.textWindow).to({ alpha: 1 }, 500).start();

			this.blinkInfoText.start();

			this.fxVoice.alpha = 1;
			this.fxVoice.play('active', 10, true);

			this.textWindow.inputEnabled = true;
			this.textWindow.events.onInputUp.add(() => {
				this.showTextWindow(info, current + 1);
			});

			let i = 0;
			let txt = info['text' + current];
			this.timerText.loop(50, () => {
				if (!txt[i]) {
					this.timerText.stop();
					return;
				}
				this.textWindow.children[0].text += txt[i];
				i++;
			});
			this.timerText.start();
		} else {
			this.fxVoice.alpha = 0;
			this.fxVoice.animations.stop(null, true);
			this.blinkInfoText.stop();
			this.timerText.stop();
			this.level.add.tween(this.textWindow).to({ alpha: 0 }, 500).start();
			this.textWindow.inputEnabled = false;
			this.currentTextWindow = 1;
		}
	}

	setHP(val) {
		if (val < 0 || val >= 8) return;

		let sign = val - this.hp > 0 ? 1 : 0;

		this.timerHP.loop(100, () => {
			if (this.hp === val || this.hp < 1 || this.hp > 8) {
				this.timerHP.stop();
				return;
			}
			this.level.add.tween(this.lifebox.children[this.hp - 1]).to({ alpha: sign }, 20).to({ alpha: 1 - sign }, 20).to({ alpha: sign }, 20).to({ alpha: 1 - sign }, 20).to({ alpha: sign }, 20).start();
			sign ? this.hp++ : this.hp--;
		}).start();
	}
	setScores(val) {
		let sign = val - this.scores > 0 ? 1 : 0;
		this.timerScores.loop(10, () => {
			if (this.scores === val || this.scores <= 0) {
				this.timerScores.stop();
				return;
			}
			sign ? this.scores++ : this.scores--;
			this.textScores.text = this.scores;
		});
		this.timerScores.start();
	}
}

module.exports = LevelInterface;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxldmVsSW50ZXJmYWNlLmpzIl0sIm5hbWVzIjpbIkxldmVsSW50ZXJmYWNlIiwiY29uc3RydWN0b3IiLCJsZXZlbCIsImRhdGEiLCJwYWRkaW5nIiwieCIsInkiLCJsaWZlYm94IiwiYWRkIiwic3ByaXRlIiwiZml4ZWRUb0NhbWVyYSIsImhwIiwiaSIsImxpZmUiLCJhZGRDaGlsZCIsInNjb3JlcyIsInRleHRTY29yZXMiLCJiaXRtYXBUZXh0Iiwic21vb3RoZWQiLCJ0aW1lckhQIiwidGltZSIsImNyZWF0ZSIsInRpbWVyU2NvcmVzIiwidGltZXJUZXh0IiwidGV4dFdpbmRvdyIsImFscGhhIiwiaW5wdXRFbmFibGVkIiwiY29udGVudCIsImluZm9UZXh0Iiwid2lkdGgiLCJoZWlnaHQiLCJhbmNob3IiLCJzZXQiLCJibGlua0luZm9UZXh0IiwidHdlZW4iLCJ0byIsImxvb3AiLCJmeFZvaWNlIiwic2NhbGUiLCJhbmltYXRpb25zIiwic2hvd1RleHRXaW5kb3ciLCJpbmZvIiwiY3VycmVudCIsImNoaWxkcmVuIiwidGV4dCIsInN0YXJ0IiwicGxheSIsImV2ZW50cyIsIm9uSW5wdXRVcCIsInR4dCIsInN0b3AiLCJjdXJyZW50VGV4dFdpbmRvdyIsInNldEhQIiwidmFsIiwic2lnbiIsInNldFNjb3JlcyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7QUFDQSxNQUFNQSxjQUFOLENBQXFCO0FBQ3BCQyxhQUFZQyxLQUFaLEVBQW1CQyxJQUFuQixFQUF5QjtBQUN4QixPQUFLRCxLQUFMLEdBQWFBLEtBQWI7O0FBRUEsT0FBS0UsT0FBTCxHQUFlO0FBQ2RDLE1BQUcsRUFEVztBQUVkQyxNQUFHO0FBRlcsR0FBZjs7QUFLQTtBQUNBLE9BQUtDLE9BQUwsR0FBZSxLQUFLTCxLQUFMLENBQVdNLEdBQVgsQ0FBZUMsTUFBZixDQUFzQixLQUFLTCxPQUFMLENBQWFDLENBQW5DLEVBQXNDLEtBQUtELE9BQUwsQ0FBYUUsQ0FBbkQsRUFBc0QsU0FB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S0FBS3ZDLE1BQUwsRUFBUCxHQUF1QixLQUFLQSxNQUFMLEVBQXZCO0FBQ0EsUUFBS0MsVUFBTCxDQUFnQjRCLElBQWhCLEdBQXVCLEtBQUs3QixNQUE1QjtBQUNBLEdBUEQ7QUFRQSxPQUFLTyxXQUFMLENBQWlCdUIsS0FBakI7QUFDQTtBQWhJbUI7O0FBbUlyQlcsT0FBT0MsT0FBUCxHQUFpQnpELGNBQWpCIiwiZmlsZSI6IkxldmVsSW50ZXJmYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmNsYXNzIExldmVsSW50ZXJmYWNlIHtcclxuXHRjb25zdHJ1Y3RvcihsZXZlbCwgZGF0YSkge1xyXG5cdFx0dGhpcy5sZXZlbCA9IGxldmVsO1xyXG5cclxuXHRcdHRoaXMucGFkZGluZyA9IHtcclxuXHRcdFx0eDogMTAsXHJcblx0XHRcdHk6IDEwXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gSFAgQkFSXHJcblx0XHR0aGlzLmxpZmVib3ggPSB0aGlzLmxldmVsLmFkZC5zcHJpdGUodGhpcy5wYWRkaW5nLngsIHRoaXMucGFkZGluZy55LCAnbGlmZWJveCcpO1xyXG5cdFx0dGhpcy5saWZlYm94LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG5cdFx0dGhpcy5ocCA9IGRhdGEuaHA7XHJcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5ocDsgaSsrKSB7XHJcblx0XHRcdGxldCBsaWZlID0gdGhpcy5sZXZlbC5hZGQuc3ByaXRlKDcqaSsxMiwgNiwgJ2xpZmVyZWN0Jyk7XHJcblx0XHRcdHRoaXMubGlmZWJveC5hZGRDaGlsZChsaWZlKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTQ09SRVNcclxuXHRcdHRoaXMuc2NvcmVzID0gZGF0YS5zY29yZXM7XHJcblx0XHR0aGlzLnRleHRTY29yZXMgPSB0aGlzLmxldmVsLmFkZC5iaXRtYXBUZXh0KHRoaXMucGFkZGluZy54KzEwLCAgdGhpcy5wYWRkaW5nLnkrMzAsICdmb250JywgdGhpcy5zY29yZXMsIDIwKTtcclxuXHRcdHRoaXMudGV4dFNjb3Jlcy5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcclxuXHRcdHRoaXMudGV4dFNjb3Jlcy5zbW9vdGhlZCA9IGZhbHNlO1xyXG5cclxuXHRcdHRoaXMudGltZXJIUCA9IHRoaXMubGV2ZWwudGltZS5jcmVhdGUoZmFsc2UpO1xyXG5cdFx0dGhpcy50aW1lclNjb3JlcyA9IHRoaXMubGV2ZWwudGltZS5jcmVhdGUoZmFsc2UpO1xyXG5cdFx0dGhpcy50aW1lclRleHQgPSB0aGlzLmxldmVsLnRpbWUuY3JlYXRlKGZhbHNlKTtcclxuXHJcblx0XHQvLyBURVhUIFdJTkRPV1xyXG5cdFx0dGhpcy50ZXh0V2luZG93ID0gdGhpcy5sZXZlbC5hZGQuc3ByaXRlKDkwLCB0aGlzLnBhZGRpbmcueSwgJ3dpbmRvdycpO1xyXG5cdFx0dGhpcy50ZXh0V2luZG93LmFscGhhID0gMDtcclxuXHRcdHRoaXMudGV4dFdpbmRvdy5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcclxuXHRcdHRoaXMudGV4dFdpbmRvdy5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG5cclxuXHRcdGxldCBjb250ZW50ID0gdGhpcy5sZXZlbC5hZGQuYml0bWFwVGV4dCgyMCwgIDUsICdmb250MicsIG51bGwsIDEzKTtcclxuXHRcdHRoaXMudGV4dFdpbmRvdy5hZGRDaGlsZChjb250ZW50KTtcclxuXHJcblx0XHRsZXQgaW5mb1RleHQgPSB0aGlzLmxldmVsLmFkZC5iaXRtYXBUZXh0KHRoaXMudGV4dFdpbmRvdy53aWR0aC01LCB0aGlzLnRleHRXaW5kb3cuaGVpZ2h0LTEwLCAnZm9udDInLCAnVEFQIFRPIENPTlRJTlVFJywgMTUpO1xyXG5cdFx0aW5mb1RleHQuYW5jaG9yLnNldCgxKTtcclxuXHRcdHRoaXMudGV4dFdpbmRvdy5hZGRDaGlsZChpbmZvVGV4dCk7XHJcblxyXG5cdFx0dGhpcy5ibGlua0luZm9UZXh0ID0gdGhpcy5sZXZlbC5hZGQudHdlZW4oaW5mb1RleHQpXHJcblx0XHRcdC50byh7YWxwaGE6IDB9LCAzMDApXHJcblx0XHRcdC50byh7YWxwaGE6IDF9LCAzMDApXHJcblx0XHRcdC5sb29wKCk7XHJcblxyXG5cdFx0dGhpcy5meFZvaWNlID0gdGhpcy5sZXZlbC5hZGQuc3ByaXRlKHRoaXMucGFkZGluZy54KzE1LCB0aGlzLnRleHRXaW5kb3cuaGVpZ2h0K3RoaXMudGV4dFdpbmRvdy55LCAnZnhfdm9pY2UnLCAwKTtcclxuXHRcdHRoaXMuZnhWb2ljZS5hbmNob3Iuc2V0KDAsIDEpO1xyXG5cdFx0dGhpcy5meFZvaWNlLnNjYWxlLnNldCgyKTtcclxuXHRcdHRoaXMuZnhWb2ljZS5hbHBoYSA9IDA7XHJcblx0XHR0aGlzLmZ4Vm9pY2UuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcblx0XHR0aGlzLmZ4Vm9pY2Uuc21vb3RoZWQgPSBmYWxzZTtcclxuXHRcdHRoaXMuZnhWb2ljZS5hbmltYXRpb25zLmFkZCgnYWN0aXZlJyk7XHJcblx0fVxyXG5cclxuXHRzaG93VGV4dFdpbmRvdyhpbmZvLCBjdXJyZW50PTEpIHtcclxuXHRcdHRoaXMudGV4dFdpbmRvdy5jaGlsZHJlblswXS50ZXh0ID0gJyc7XHJcblx0XHRcclxuXHRcdGlmKGluZm9bJ3RleHQnICsgY3VycmVudF0pIHtcclxuXHRcdFx0dGhpcy5sZXZlbC5hZGQudHdlZW4odGhpcy50ZXh0V2luZG93KVxyXG5cdFx0XHRcdC50byh7YWxwaGE6IDF9LCA1MDApXHJcblx0XHRcdFx0LnN0YXJ0KCk7XHJcblxyXG5cdFx0XHR0aGlzLmJsaW5rSW5mb1RleHQuc3RhcnQoKTtcclxuXHJcblx0XHRcdHRoaXMuZnhWb2ljZS5hbHBoYSA9IDE7XHJcblx0XHRcdHRoaXMuZnhWb2ljZS5wbGF5KCdhY3RpdmUnLCAxMCwgdHJ1ZSk7XHJcblxyXG5cdFx0XHR0aGlzLnRleHRXaW5kb3cuaW5wdXRFbmFibGVkID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy50ZXh0V2luZG93LmV2ZW50cy5vbklucHV0VXAuYWRkKCgpID0+IHtcclxuXHRcdFx0XHR0aGlzLnNob3dUZXh0V2luZG93KGluZm8sIGN1cnJlbnQrMSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0bGV0IGkgPSAwO1xyXG5cdFx0XHRsZXQgdHh0ID0gaW5mb1sndGV4dCcgKyBjdXJyZW50XTtcclxuXHRcdFx0dGhpcy50aW1lclRleHQubG9vcCg1MCwgKCkgPT4ge1xyXG5cdFx0XHRcdGlmKCF0eHRbaV0pIHtcclxuXHRcdFx0XHRcdHRoaXMudGltZXJUZXh0LnN0b3AoKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy50ZXh0V2luZG93LmNoaWxkcmVuWzBdLnRleHQgKz0gdHh0W2ldO1xyXG5cdFx0XHRcdGkrKztcclxuXHRcdFx0fSk7XHJcblx0XHRcdHRoaXMudGltZXJUZXh0LnN0YXJ0KCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmZ4Vm9pY2UuYWxwaGEgPSAwO1xyXG5cdFx0XHR0aGlzLmZ4Vm9pY2UuYW5pbWF0aW9ucy5zdG9wKG51bGwsIHRydWUpO1xyXG5cdFx0XHR0aGlzLmJsaW5rSW5mb1RleHQuc3RvcCgpO1xyXG5cdFx0XHR0aGlzLnRpbWVyVGV4dC5zdG9wKCk7XHJcblx0XHRcdHRoaXMubGV2ZWwuYWRkLnR3ZWVuKHRoaXMudGV4dFdpbmRvdylcclxuXHRcdFx0XHQudG8oe2FscGhhOiAwfSwgNTAwKVxyXG5cdFx0XHRcdC5zdGFydCgpO1xyXG5cdFx0XHR0aGlzLnRleHRXaW5kb3cuaW5wdXRFbmFibGVkID0gZmFsc2U7XHJcblx0XHRcdHRoaXMuY3VycmVudFRleHRXaW5kb3cgPSAxO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2V0SFAodmFsKSB7XHJcblx0XHRpZih2YWwgPCAwIHx8IHZhbCA+PSA4KSByZXR1cm47XHJcblxyXG5cdFx0bGV0IHNpZ24gPSB2YWwtdGhpcy5ocCA+IDAgPyAxIDogMDtcclxuXHJcblx0XHR0aGlzLnRpbWVySFAubG9vcCgxMDAsICgpID0+IHtcclxuXHRcdFx0aWYodGhpcy5ocCA9PT0gdmFsIHx8IHRoaXMuaHAgPCAxIHx8IHRoaXMuaHAgPiA4KSB7XHJcblx0XHRcdFx0dGhpcy50aW1lckhQLnN0b3AoKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5sZXZlbC5hZGQudHdlZW4odGhpcy5saWZlYm94LmNoaWxkcmVuW3RoaXMuaHAtMV0pXHJcblx0XHRcdFx0LnRvKHthbHBoYTogc2lnbn0sIDIwKVxyXG5cdFx0XHRcdC50byh7YWxwaGE6IDEtc2lnbn0sIDIwKVxyXG5cdFx0XHRcdC50byh7YWxwaGE6IHNpZ259LCAyMClcclxuXHRcdFx0XHQudG8oe2FscGhhOiAxLXNpZ259LCAyMClcclxuXHRcdFx0XHQudG8oe2FscGhhOiBzaWdufSwgMjApXHJcblx0XHRcdFx0LnN0YXJ0KCk7XHJcblx0XHRcdHNpZ24gPyB0aGlzLmhwKysgOiB0aGlzLmhwLS07XHJcblx0XHR9KS5zdGFydCgpO1xyXG5cdH1cclxuXHRzZXRTY29yZXModmFsKSB7XHJcblx0XHRsZXQgc2lnbiA9IHZhbC10aGlzLnNjb3JlcyA+IDAgPyAxIDogMDtcclxuXHRcdHRoaXMudGltZXJTY29yZXMubG9vcCgxMCwgKCkgPT4ge1xyXG5cdFx0XHRpZih0aGlzLnNjb3JlcyA9PT0gdmFsIHx8IHRoaXMuc2NvcmVzIDw9IDApIHtcclxuXHRcdFx0XHR0aGlzLnRpbWVyU2NvcmVzLnN0b3AoKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0c2lnbiA/IHRoaXMuc2NvcmVzKysgOiB0aGlzLnNjb3Jlcy0tO1xyXG5cdFx0XHR0aGlzLnRleHRTY29yZXMudGV4dCA9IHRoaXMuc2NvcmVzO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnRpbWVyU2NvcmVzLnN0YXJ0KCk7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExldmVsSW50ZXJmYWNlO1xyXG5cclxuXHJcbiJdfQ==
},{}],4:[function(require,module,exports){
const Entity = require('./Entity.js');
const LevelInterface = require('./LevelInterface');

class Player extends Entity {
	constructor(level, x, y) {
		super(level, x, y, 'player');

		this.level.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

		this.interface = new LevelInterface(this.level, { hp: Math.min(8, this.hp), scores: 100 });

		this.cursors = this.level.input.keyboard.createCursorKeys();
		this.jumpButton = this.level.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.fireButton = this.level.input.keyboard.addKey(Phaser.Keyboard.Z);
	}

	update() {
		// Items use
		this.level.physics.arcade.overlap(this.sprite, this.level.items, (sprite, item) => {
			if (item.isCollide) return;

			if (item.type == 'health') this.interface.setHP(this.interface.hp + 2);else if (item.type == 'coins') this.interface.setScores(this.interface.scores + 100);else if (item.type == 'cartridge') this.isCatridgeUse = true;

			item.tween.stop();
			item.isCollide = true;
			this.level.add.tween(item.scale).to({ x: 0, y: 0 }, 1500, Phaser.Easing.Bounce.In).start().onComplete.add(() => item.kill);
		});

		let pl = new Phaser.Rectangle(this.sprite.body.x, this.sprite.body.y, this.sprite.body.width, this.sprite.body.height);

		if (this.isCatridgeUse) {
			if (Phaser.Rectangle.intersects(this.level.nextLevelArea, pl)) {
				this.level.nextLevel();
				this.isCatridgeUse = false;
			}
		}

		// Show text window
		for (let i = 0; i < this.level.textAreas.length; i++) {
			let rect = this.level.textAreas[i];
			if (Phaser.Rectangle.intersects(rect, pl)) {
				this.interface.showTextWindow(rect);
				this.level.textAreas.splice(i, 1);
				return;
			}
		}

		if (this.cursors.up.isDown) this.level.physics.arcade.accelerationFromRotation(this.sprite.rotation, 300, this.sprite.body.acceleration);else this.sprite.body.acceleration.set(0);

		if (this.cursors.left.isDown) this.sprite.body.angularVelocity = -200;else if (this.cursors.right.isDown) this.sprite.body.angularVelocity = 200;else this.sprite.body.angularVelocity = 0;

		if (this.fireButton.isDown && this.interface.scores) this.weapon.fire() && this.interface.setScores(this.interface.scores - 10);

		if (this.jumpButton.isDown && !this.isJumping) {
			this.fxJump.play('active', 20);
			this.fxJump.alpha = 1;
			this.fxJump.x = this.sprite.body.x + 5;
			this.fxJump.y = this.sprite.body.y + 5;
			this.level.add.tween(this.fxJump).to({ alpha: 0 }, 600).start();
			this.jump(this.jumping);
		}
	}

	onWounded() {
		this.interface.setHP(this.interface.hp - 1);
		this.interface.hp === 0 && this.onDead();
	}

	onDead() {
		this.level.state.restart();
	}
}

module.exports = Player;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXllci5qcyJdLCJuYW1lcyI6WyJFbnRpdHkiLCJyZXF1aXJlIiwiTGV2ZWxJbnRlcmZhY2UiLCJQbGF5ZXIiLCJjb25zdHJ1Y3RvciIsImxldmVsIiwieCIsInkiLCJjYW1lcmEiLCJmb2xsb3ciLCJzcHJpdGUiLCJQaGFzZXIiLCJDYW1lcmEiLCJGT0xMT1dfTE9DS09OIiwiaW50ZXJmYWNlIiwiaHAiLCJNYXRoIiwibWluIiwic2NvcmVzIiwiY3Vyc29ycyIsImlucHV0Iiwia2V5Ym9hcmQiLCJjcmVhdGVDdXJzb3JLZXlzIiwianVtcEJ1dHRvbiIsImFkZEtleSIsIktleWJvYXJkIiwiU1BBQ0VCQVIiLCJmaXJlQnV0dG9uIiwiWiIsInVwZGF0ZSIsInBoeXNpY3MiLCJhcmNhZGUiLCJvdmVybGFwIiwiaXRlbXMiLCJpdGVtIiwiaXNDb2xsaWRlIiwidHlwZSIsInNldEhQIiwic2V0U2NvcmVzIiwiaXNDYXRyaWRnZVVzZSIsInR3ZWVuIiwic3RvcCIsImFkZCIsInNjYWxlIiwidG8iLCJFYXNpbmciLCJCb3VuY2UiLCJJbiIsInN0YXJ0Iiwib25Db21wbGV0ZSIsImtpbGwiLCJwbCIsIlJlY3RhbmdsZSIsImJvZHkiLCJ3aWR0aCIsImhlaWdodCIsImludGVyc2VjdHMiLCJuZXh0TGV2ZWxBcmVhIiwibmV4dExldmVsIiwiaSIsInRleHRBcmVhcyIsImxlbmd0aCIsInJlY3QiLCJzaG93VGV4dFdpbmRvdyIsInNwbGljZSIsInVwIiwiaXNEb3duIiwiYWNjZWxlcmF0aW9uRnJvbVJvdGF0aW9uIiwicm90YXRpb24iLCJhY2NlbGVyYXRpb24iLCJzZXQiLCJsZWZ0IiwiYW5ndWxhclZlbG9jaXR5IiwicmlnaHQiLCJ3ZWFwb24iLCJmaXJlIiwiaXNKdW1waW5nIiwiZnhKdW1wIiwicGxheSIsImFscGhhIiwianVtcCIsImp1bXBpbmciLCJvbldvdW5kZWQiLCJvbkRlYWQiLCJzdGF0ZSIsInJlc3RhcnQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1h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TCxDQUFlQyxFQUFmLEtBQXNCLENBQXRCLElBQTJCLEtBQUtvRSxNQUFMLEVBQTNCO0FBQ0E7O0FBRURBLFVBQVM7QUFDUixPQUFLOUUsS0FBTCxDQUFXK0UsS0FBWCxDQUFpQkMsT0FBakI7QUFDQTtBQXBGMEI7O0FBdUY1QkMsT0FBT0MsT0FBUCxHQUFpQnBGLE1BQWpCIiwiZmlsZSI6IlBsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEVudGl0eSA9IHJlcXVpcmUoJy4vRW50aXR5LmpzJyk7XHJcbmNvbnN0IExldmVsSW50ZXJmYWNlID0gcmVxdWlyZSgnLi9MZXZlbEludGVyZmFjZScpO1xyXG5cclxuY2xhc3MgUGxheWVyIGV4dGVuZHMgRW50aXR5IHtcclxuXHRjb25zdHJ1Y3RvcihsZXZlbCwgeCwgeSkge1xyXG5cdFx0c3VwZXIobGV2ZWwsIHgsIHksICdwbGF5ZXInKTtcclxuXHJcblx0XHR0aGlzLmxldmVsLmNhbWVyYS5mb2xsb3codGhpcy5zcHJpdGUsIFBoYXNlci5DYW1lcmEuRk9MTE9XX0xPQ0tPTiAsIDAuMSwgMC4xKTtcclxuXHJcblx0XHR0aGlzLmludGVyZmFjZSA9IG5ldyBMZXZlbEludGVyZmFjZSh0aGlzLmxldmVsLCB7aHA6IE1hdGgubWluKDgsIHRoaXMuaHApLCBzY29yZXM6IDEwMH0pO1xyXG5cclxuXHRcdHRoaXMuY3Vyc29ycyA9IHRoaXMubGV2ZWwuaW5wdXQua2V5Ym9hcmQuY3JlYXRlQ3Vyc29yS2V5cygpO1xyXG5cdFx0dGhpcy5qdW1wQnV0dG9uID0gdGhpcy5sZXZlbC5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLlNQQUNFQkFSKTtcclxuXHRcdHRoaXMuZmlyZUJ1dHRvbiA9IHRoaXMubGV2ZWwuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5aKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZSgpIHtcclxuXHRcdC8vIEl0ZW1zIHVzZVxyXG5cdFx0dGhpcy5sZXZlbC5waHlzaWNzLmFyY2FkZS5vdmVybGFwKHRoaXMuc3ByaXRlLCB0aGlzLmxldmVsLml0ZW1zLCAoc3ByaXRlLCBpdGVtKSA9PiB7XHJcblx0XHRcdGlmKGl0ZW0uaXNDb2xsaWRlKSByZXR1cm47XHJcblxyXG5cdFx0XHRpZihpdGVtLnR5cGUgPT0gJ2hlYWx0aCcpIHRoaXMuaW50ZXJmYWNlLnNldEhQKHRoaXMuaW50ZXJmYWNlLmhwKzIpO1xyXG5cdFx0XHRlbHNlIGlmKGl0ZW0udHlwZSA9PSAnY29pbnMnKSB0aGlzLmludGVyZmFjZS5zZXRTY29yZXModGhpcy5pbnRlcmZhY2Uuc2NvcmVzKzEwMCk7XHJcblx0XHRcdGVsc2UgaWYoaXRlbS50eXBlID09ICdjYXJ0cmlkZ2UnKSB0aGlzLmlzQ2F0cmlkZ2VVc2UgPSB0cnVlO1xyXG5cclxuXHRcdFx0aXRlbS50d2Vlbi5zdG9wKCk7XHJcblx0XHRcdGl0ZW0uaXNDb2xsaWRlID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5sZXZlbC5hZGQudHdlZW4oaXRlbS5zY2FsZSlcclxuXHRcdFx0XHQudG8oe3g6IDAsIHk6IDB9LCAxNTAwLCBQaGFzZXIuRWFzaW5nLkJvdW5jZS5JbilcclxuXHRcdFx0XHQuc3RhcnQoKVxyXG5cdFx0XHRcdC5vbkNvbXBsZXRlLmFkZCgoKSA9PiBpdGVtLmtpbGwpO1xyXG5cdFx0fSk7XHJcblxyXG5cclxuXHRcdGxldCBwbCA9IG5ldyBQaGFzZXIuUmVjdGFuZ2xlKHRoaXMuc3ByaXRlLmJvZHkueCwgdGhpcy5zcHJpdGUuYm9keS55LCB0aGlzLnNwcml0ZS5ib2R5LndpZHRoLCB0aGlzLnNwcml0ZS5ib2R5LmhlaWdodCk7XHJcblx0XHRcclxuXHRcdGlmKHRoaXMuaXNDYXRyaWRnZVVzZSkge1xyXG5cdFx0XHRpZihQaGFzZXIuUmVjdGFuZ2xlLmludGVyc2VjdHModGhpcy5sZXZlbC5uZXh0TGV2ZWxBcmVhLCBwbCkpIHtcclxuXHRcdFx0XHR0aGlzLmxldmVsLm5leHRMZXZlbCgpO1xyXG5cdFx0XHRcdHRoaXMuaXNDYXRyaWRnZVVzZSA9IGZhbHNlO1xyXG5cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNob3cgdGV4dCB3aW5kb3dcclxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmxldmVsLnRleHRBcmVhcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgcmVjdCA9IHRoaXMubGV2ZWwudGV4dEFyZWFzW2ldO1xyXG5cdFx0XHRpZihQaGFzZXIuUmVjdGFuZ2xlLmludGVyc2VjdHMocmVjdCwgcGwpKSB7XHJcblx0XHRcdFx0dGhpcy5pbnRlcmZhY2Uuc2hvd1RleHRXaW5kb3cocmVjdCk7XHJcblx0XHRcdFx0dGhpcy5sZXZlbC50ZXh0QXJlYXMuc3BsaWNlKGksIDEpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmKHRoaXMuY3Vyc29ycy51cC5pc0Rvd24pXHJcblx0XHRcdHRoaXMubGV2ZWwucGh5c2ljcy5hcmNhZGUuYWNjZWxlcmF0aW9uRnJvbVJvdGF0aW9uKHRoaXMuc3ByaXRlLnJvdGF0aW9uLCAzMDAsIHRoaXMuc3ByaXRlLmJvZHkuYWNjZWxlcmF0aW9uKTtcclxuXHJcblx0XHRlbHNlIHRoaXMuc3ByaXRlLmJvZHkuYWNjZWxlcmF0aW9uLnNldCgwKTtcclxuXHJcblx0XHRpZih0aGlzLmN1cnNvcnMubGVmdC5pc0Rvd24pXHJcblx0XHRcdHRoaXMuc3ByaXRlLmJvZHkuYW5ndWxhclZlbG9jaXR5ID0gLTIwMDtcclxuXHJcblx0XHRlbHNlIGlmKHRoaXMuY3Vyc29ycy5yaWdodC5pc0Rvd24pXHJcblx0XHRcdHRoaXMuc3ByaXRlLmJvZHkuYW5ndWxhclZlbG9jaXR5ID0gMjAwO1xyXG5cclxuXHRcdGVsc2UgdGhpcy5zcHJpdGUuYm9keS5hbmd1bGFyVmVsb2NpdHkgPSAwO1xyXG5cclxuXHRcdGlmKHRoaXMuZmlyZUJ1dHRvbi5pc0Rvd24gJiYgdGhpcy5pbnRlcmZhY2Uuc2NvcmVzKVxyXG5cdFx0XHR0aGlzLndlYXBvbi5maXJlKCkgJiYgdGhpcy5pbnRlcmZhY2Uuc2V0U2NvcmVzKHRoaXMuaW50ZXJmYWNlLnNjb3Jlcy0xMCk7XHJcblxyXG5cdFx0aWYodGhpcy5qdW1wQnV0dG9uLmlzRG93biAmJiAhdGhpcy5pc0p1bXBpbmcpIHtcclxuXHRcdFx0dGhpcy5meEp1bXAucGxheSgnYWN0aXZlJywgMjApO1xyXG5cdFx0XHR0aGlzLmZ4SnVtcC5hbHBoYSA9IDE7XHJcblx0XHRcdHRoaXMuZnhKdW1wLnggPSB0aGlzLnNwcml0ZS5ib2R5LngrNTtcclxuXHRcdFx0dGhpcy5meEp1bXAueSA9IHRoaXMuc3ByaXRlLmJvZHkueSs1O1xyXG5cdFx0XHR0aGlzLmxldmVsLmFkZC50d2Vlbih0aGlzLmZ4SnVtcCkudG8oe2FscGhhOiAwfSwgNjAwKS5zdGFydCgpO1xyXG5cdFx0XHR0aGlzLmp1bXAodGhpcy5qdW1waW5nKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG9uV291bmRlZCgpIHtcclxuXHRcdHRoaXMuaW50ZXJmYWNlLnNldEhQKHRoaXMuaW50ZXJmYWNlLmhwLTEpO1xyXG5cdFx0dGhpcy5pbnRlcmZhY2UuaHAgPT09IDAgJiYgdGhpcy5vbkRlYWQoKTtcclxuXHR9XHJcblxyXG5cdG9uRGVhZCgpIHtcclxuXHRcdHRoaXMubGV2ZWwuc3RhdGUucmVzdGFydCgpO1xyXG5cdH1cclxufVxyXG5cdFx0XHRcclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7Il19
},{"./Entity.js":2,"./LevelInterface":3}],5:[function(require,module,exports){
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
		let x = this.trackX * this.person.sprite.scale.x;
		let y = this.trackY * this.person.sprite.scale.y;

		this.weapon.trackSprite(this.person.sprite, x, y, true);
	}
	fire() {
		let bullet = this.weapon.fire();

		if (bullet) {
			bullet.smoothed = false;
			bullet.scale.setTo(this.person.sprite.scale.x / 2, this.person.sprite.scale.y / 2);
			bullet.body.updateBounds();

			this.person.sprite.body.velocity.x -= Math.cos(this.person.sprite.rotation) * 100;
			this.person.sprite.body.velocity.y -= Math.sin(this.person.sprite.rotation) * 100;

			this.fxFire.scale.x = this.person.sprite.scale.x;
			this.fxFire.scale.y = this.person.sprite.scale.y;
			this.fxFire.x = this.weapon._rotatedPoint.x;
			this.fxFire.y = this.weapon._rotatedPoint.y;
			this.fxFire.alpha = 1;
			this.fxFire.play('active', 20);
			this.level.add.tween(this.fxFire).to({ alpha: 0 }, 600).start();

			return true;
		}
	}
	update() {
		this.level.physics.arcade.collide(this.weapon.bullets, this.level.layerMap, bullet => {
			this.fxCollide.x = bullet.x;
			this.fxCollide.y = bullet.y;
			this.fxCollide.alpha = 1;
			this.fxCollide.play('active', 100);
			this.level.add.tween(this.fxCollide).to({ alpha: 0 }, 300).start();

			bullet.kill();
		});
	}
}

module.exports = Weapon;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldlYXBvbi5qcyJdLCJuYW1lcyI6WyJ3ZWFwb25zIiwicmVxdWlyZSIsIldlYXBvbiIsImNvbnN0cnVjdG9yIiwicGVyc29uIiwidHlwZSIsImxldmVsIiwiX3dlYXBvbnMiLCJpZCIsInRyYWNrWCIsInRyYWNrWSIsInNwZWVkIiwiZGFtYWdlIiwiZGVsYXkiLCJxdWFudGl0eSIsIndlYXBvbiIsImFkZCIsImJ1bGxldHMiLCJzZXRCdWxsZXRGcmFtZXMiLCJidWxsZXRLaWxsVHlwZSIsIlBoYXNlciIsIktJTExfV09STERfQk9VTkRTIiwiYnVsbGV0U3BlZWQiLCJmaXJlUmF0ZSIsInR5cGVPd25lciIsIm5hbWUiLCJmeEZpcmUiLCJzcHJpdGUiLCJhbHBoYSIsInNjYWxlIiwic2V0IiwiYW5jaG9yIiwic21vb3RoZWQiLCJhbmltYXRpb25zIiwiZnhDb2xsaWRlIiwidXBkYXRlVHJhY2siLCJ4IiwieSIsInRyYWNrU3ByaXRlIiwiZmlyZSIsImJ1bGxldCIsInNldFRvIiwiYm9keSIsInVwZGF0ZUJvdW5kcyIsInZlbG9jaXR5IiwiTWF0aCIsImNvcyIsInJvdGF0aW9uIiwic2luIiwiX3JvdGF0ZWRQb2ludCIsInBsYXkiLCJ0d2VlbiIsInRvIiwic3RhcnQiLCJ1cGRhdGUiLCJwaHlzaWNzIiwiYXJjYWRlIiwiY29sbGlkZSIsImxheWVyTWFwIiwia2lsbCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBLE1BQU1BLFVBQVVDLFFBQVEsZ0JBQVIsQ0FBaEI7O0FBRUEsTUFBTUMsTUFBTixDQUFhO0FBQ1pDLGFBQVlDLE1BQVosRUFBb0JDLElBQXBCLEVBQTBCO0FBQ3pCLE9BQUtDLEtBQUwsR0FBYUYsT0FBT0UsS0FBcEI7QUFDQSxPQUFLRixNQUFMLEdBQWNBLE1BQWQ7O0FBRUEsT0FBS0csUUFBTCxHQUFnQlAsUUFBUUssSUFBUixDQUFoQjtBQUNBLE9BQUtHLEVBQUwsR0FBVSxLQUFLRCxRQUFMLENBQWNDLEVBQWQsSUFBb0Is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QyxFQUFvRCxHQUFwRCxFQUF5RHlCLEtBQXpEOztBQUVBYixVQUFPbUIsSUFBUDtBQUNBLEdBUkQ7QUFTQTtBQTNFVzs7QUE4RWJDLE9BQU9DLE9BQVAsR0FBaUIzRCxNQUFqQiIsImZpbGUiOiJXZWFwb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB3ZWFwb25zID0gcmVxdWlyZSgnLi93ZWFwb25zLmpzb24nKTtcclxuXHJcbmNsYXNzIFdlYXBvbiB7XHJcblx0Y29uc3RydWN0b3IocGVyc29uLCB0eXBlKSB7XHJcblx0XHR0aGlzLmxldmVsID0gcGVyc29uLmxldmVsO1xyXG5cdFx0dGhpcy5wZXJzb24gPSBwZXJzb247XHJcblxyXG5cdFx0dGhpcy5fd2VhcG9ucyA9IHdlYXBvbnNbdHlwZV07XHJcblx0XHR0aGlzLmlkID0gdGhpcy5fd2VhcG9ucy5pZCAhPSBudWxsID8gdGhpcy5fd2VhcG9ucy5pZCA6IDA7XHJcblx0XHR0aGlzLnRyYWNrWCA9IHRoaXMuX3dlYXBvbnMudHJhY2tYICE9IG51bGwgPyB0aGlzLl93ZWFwb25zLnRyYWNrWCA6IDE2O1xyXG5cdFx0dGhpcy50cmFja1kgPSB0aGlzLl93ZWFwb25zLnRyYWNrWSAhPSBudWxsID8gdGhpcy5fd2VhcG9ucy50cmFja1kgOiA0O1xyXG5cdFx0dGhpcy5zcGVlZCA9IHRoaXMuX3dlYXBvbnMuc3BlZWQgIT0gbnVsbCA/IHRoaXMuX3dlYXBvbnMuc3BlZWQgOiAxMDA7XHJcblx0XHR0aGlzLmRhbWFnZSA9IHRoaXMuX3dlYXBvbnMuZGFtYWdlICE9IG51bGwgPyB0aGlzLl93ZWFwb25zLmRhbWFnZSA6IDE7XHJcblx0XHR0aGlzLmRlbGF5ID0gdGhpcy5fd2VhcG9ucy5kZWxheSAhPSBudWxsID8gdGhpcy5fd2VhcG9ucy5kZWxheSA6IDEwO1xyXG5cdFx0dGhpcy5xdWFudGl0eSA9IHRoaXMuX3dlYXBvbnMucXVhbnRpdHkgIT0gbnVsbCA/IHRoaXMuX3dlYXBvbnMucXVhbnRpdHkgOiAxO1xyXG5cclxuXHRcdHRoaXMud2VhcG9uID0gdGhpcy5sZXZlbC5hZGQud2VhcG9uKHRoaXMucXVhbnRpdHksICdidWxsZXRzJywgdGhpcy5pZCwgdGhpcy5sZXZlbC5idWxsZXRzKTtcclxuXHRcdHRoaXMud2VhcG9uLnNldEJ1bGxldEZyYW1lcyh0aGlzLmlkLCB0aGlzLmlkLCB0cnVlKTtcclxuXHRcdHRoaXMud2VhcG9uLmJ1bGxldEtpbGxUeXBlID0gUGhhc2VyLldlYXBvbi5LSUxMX1dPUkxEX0JPVU5EUztcclxuXHRcdHRoaXMud2VhcG9uLmJ1bGxldFNwZWVkID0gdGhpcy5zcGVlZDtcclxuXHRcdHRoaXMud2VhcG9uLmZpcmVSYXRlID0gdGhpcy5kZWxheTsgXHJcblx0XHR0aGlzLndlYXBvbi5idWxsZXRzLnR5cGVPd25lciA9IHRoaXMucGVyc29uLmNvbnN0cnVjdG9yLm5hbWU7XHJcblxyXG5cdFx0dGhpcy5meEZpcmUgPSB0aGlzLmxldmVsLmFkZC5zcHJpdGUoMCwgMCwgJ2Z4X2ZpcmUnLCAwKTtcclxuXHRcdHRoaXMuZnhGaXJlLmFscGhhID0gMDtcclxuXHRcdHRoaXMuZnhGaXJlLnNjYWxlLnNldCgyKTtcclxuXHRcdHRoaXMuZnhGaXJlLmFuY2hvci5zZXQoMC41KTtcclxuXHRcdHRoaXMuZnhGaXJlLnNtb290aGVkID0gZmFsc2U7XHJcblx0XHR0aGlzLmZ4RmlyZS5hbmltYXRpb25zLmFkZCgnYWN0aXZlJyk7XHJcblxyXG5cdFx0dGhpcy5meENvbGxpZGUgPSB0aGlzLmxldmVsLmFkZC5zcHJpdGUoMCwgMCwgJ2Z4X2V4cGxvc2lvbicsIDApO1xyXG5cdFx0dGhpcy5meENvbGxpZGUuYWxwaGEgPSAwO1xyXG5cdFx0dGhpcy5meENvbGxpZGUuYW5jaG9yLnNldCgwLjUpO1xyXG5cdFx0dGhpcy5meENvbGxpZGUuc21vb3RoZWQgPSBmYWxzZTtcclxuXHRcdHRoaXMuZnhDb2xsaWRlLmFuaW1hdGlvbnMuYWRkKCdhY3RpdmUnKTtcclxuXHJcblx0XHR0aGlzLnVwZGF0ZVRyYWNrKCk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGVUcmFjaygpIHtcclxuXHRcdGxldCB4ID0gdGhpcy50cmFja1gqdGhpcy5wZXJzb24uc3ByaXRlLnNjYWxlLng7XHJcblx0XHRsZXQgeSA9IHRoaXMudHJhY2tZKnRoaXMucGVyc29uLnNwcml0ZS5zY2FsZS55O1xyXG5cdFx0XHJcblx0XHR0aGlzLndlYXBvbi50cmFja1Nwcml0ZSh0aGlzLnBlcnNvbi5zcHJpdGUsIHgsIHksIHRydWUpO1xyXG5cdH1cclxuXHRmaXJlKCkge1xyXG5cdFx0bGV0IGJ1bGxldCA9IHRoaXMud2VhcG9uLmZpcmUoKTtcclxuXHJcblx0XHRpZihidWxsZXQpIHtcclxuXHRcdFx0YnVsbGV0LnNtb290aGVkID0gZmFsc2U7XHJcblx0XHRcdGJ1bGxldC5zY2FsZS5zZXRUbyh0aGlzLnBlcnNvbi5zcHJpdGUuc2NhbGUueC8yLCB0aGlzLnBlcnNvbi5zcHJpdGUuc2NhbGUueS8yKTtcclxuXHRcdFx0YnVsbGV0LmJvZHkudXBkYXRlQm91bmRzKCk7XHJcblxyXG5cdFx0XHR0aGlzLnBlcnNvbi5zcHJpdGUuYm9keS52ZWxvY2l0eS54IC09IE1hdGguY29zKHRoaXMucGVyc29uLnNwcml0ZS5yb3RhdGlvbikgKiAxMDA7XHJcblx0XHRcdHRoaXMucGVyc29uLnNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgLT0gTWF0aC5zaW4odGhpcy5wZXJzb24uc3ByaXRlLnJvdGF0aW9uKSAqIDEwMDtcclxuXHJcblx0XHRcdHRoaXMuZnhGaXJlLnNjYWxlLnggPSB0aGlzLnBlcnNvbi5zcHJpdGUuc2NhbGUueDtcclxuXHRcdFx0dGhpcy5meEZpcmUuc2NhbGUueSA9IHRoaXMucGVyc29uLnNwcml0ZS5zY2FsZS55O1xyXG5cdFx0XHR0aGlzLmZ4RmlyZS54ID0gdGhpcy53ZWFwb24uX3JvdGF0ZWRQb2ludC54O1xyXG5cdFx0XHR0aGlzLmZ4RmlyZS55ID0gdGhpcy53ZWFwb24uX3JvdGF0ZWRQb2ludC55O1xyXG5cdFx0XHR0aGlzLmZ4RmlyZS5hbHBoYSA9IDE7XHJcblx0XHRcdHRoaXMuZnhGaXJlLnBsYXkoJ2FjdGl2ZScsIDIwKTtcclxuXHRcdFx0dGhpcy5sZXZlbC5hZGQudHdlZW4odGhpcy5meEZpcmUpLnRvKHthbHBoYTogMH0sIDYwMCkuc3RhcnQoKTtcclxuXHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHR1cGRhdGUoKSB7XHJcblx0XHR0aGlzLmxldmVsLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUodGhpcy53ZWFwb24uYnVsbGV0cywgdGhpcy5sZXZlbC5sYXllck1hcCwgKGJ1bGxldCkgPT4ge1xyXG5cdFx0XHR0aGlzLmZ4Q29sbGlkZS54ID0gYnVsbGV0Lng7XHJcblx0XHRcdHRoaXMuZnhDb2xsaWRlLnkgPSBidWxsZXQueTtcclxuXHRcdFx0dGhpcy5meENvbGxpZGUuYWxwaGEgPSAxO1xyXG5cdFx0XHR0aGlzLmZ4Q29sbGlkZS5wbGF5KCdhY3RpdmUnLCAxMDApO1xyXG5cdFx0XHR0aGlzLmxldmVsLmFkZC50d2Vlbih0aGlzLmZ4Q29sbGlkZSkudG8oe2FscGhhOiAwfSwgMzAwKS5zdGFydCgpO1xyXG5cclxuXHRcdFx0YnVsbGV0LmtpbGwoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXZWFwb247Il19
},{"./weapons.json":7}],6:[function(require,module,exports){
module.exports={
	"player": {
		"hp": 10,
		"jump": 3,
		"speed": 100,

		"head": 5,
		"body": 3,
		"attachToBody": 1,
		"weapon": "blaster"
	},
	"robot": {
		"hp": 3,
		"jump": 3,
		"speed": 100,
		"radiusVisibility": 150,

		"head": 7,
		"body": 1,
		"attachToBody": 1,
		"weapon": "blaster"
	},
	"robot2": {
		"hp": 10,
		"jump": 3,
		"speed": 100,
		"radiusVisibility": 150,

		"head": 10,
		"body": 3,
		"attachToBody": 1,
		"weapon": "blaster"
	},
	"robot3": {
		"hp": 10,
		"jump": 3,
		"speed": 100,
		"radiusVisibility": 150,

		"head": 13,
		"body": 3,
		"attachToBody": 1,
		"weapon": "blaster"
	}
}
},{}],7:[function(require,module,exports){
module.exports={
	"roket": {
		"id": 1,
		"range": 100,
		"speed": 400,
		"damage": 10,
		"delay": 10,
		"quantity": 10,
		"trackX": 1,
		"trackY": 1
	},
	"blaster": {
		"id": 3,
		"range": 100,
		"speed": 400,
		"damage": 10,
		"delay": 200,
		"quantity": 2
		// "trackX": 1,
		// "trackY": 1
	},
	"blaster2": {
		"id": 1,
		"range": 100,
		"speed": 100,
		"damage": 10,
		"delay": 10,
		"quantity": 10,
		"trackX": 1,
		"trackY": 1
	},
	"blaster3": {
		"id": 1,
		"range": 100,
		"speed": 100,
		"damage": 10,
		"delay": 10,
		"quantity": 10,
		"trackX": 1,
		"trackY": 1
	},
	"blaster4": {
		"id": 1,
		"range": 100,
		"speed": 100,
		"damage": 10,
		"delay": 10,
		"quantity": 10,
		"trackX": 1,
		"trackY": 1		
	},
	"saber": {
		"id": null,
		"range": 100,
		"speed": 100,
		"damage": 10,
		"delay": 10,
		"quantity": 10,
		"trackX": 1,
		"trackY": 1
	},
	"revolver": {
		"id": 1,
		"range": 100,
		"speed": 100,
		"damage": 10,
		"delay": 10,
		"quantity": 10,
		"trackX": 1,
		"trackY": 1
	},
	"rifle": {
		"id": 1,
		"range": 100,
		"speed": 100,
		"damage": 10,
		"delay": 10,
		"quantity": 10,
		"trackX": 1,
		"trackY": 1
	},
	"fist": {
		"id": null,
		"range": 100,
		"speed": 100,
		"damage": 10,
		"delay": 10,
		"quantity": 10,
		"trackX": 1,
		"trackY": 1
	},
	"machinegun": {
		"id": 1,
		"range": 100,
		"speed": 100,
		"damage": 10,
		"delay": 10,
		"quantity": 10,
		"trackX": 1,
		"trackY": 1
	},
	"bazooka": {
		"id": 1,
		"range": 100,
		"speed": 100,
		"damage": 10,
		"delay": 10,
		"quantity": 10,
		"trackX": 1,
		"trackY": 1
	},
	"energygun": {
		"id": 1,
		"range": 100,
		"speed": 100,
		"damage": 10,
		"delay": 10,
		"quantity": 10,
		"trackX": 1,
		"trackY": 1
	}
}
},{}],8:[function(require,module,exports){
const Boot = require('./states/Boot.js');
const Preload = require('./states/Preload.js');
const Menu = require('./states/Menu.js');
const Level = require('./states/Level.js');
const Settings = require('./states/Settings.js');
const LevelManager = require('./states/LevelManager.js');

const game = new Phaser.Game(480, 320, Phaser.AUTO, 'ShooterBlink');

game.state.add('Menu', Menu);
game.state.add('Settings', Settings);
game.state.add('Level', Level);
game.state.add('LevelManager', LevelManager);
game.state.add('Preload', Preload);
game.state.add('Boot', Boot, true);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIkJvb3QiLCJyZXF1aXJlIiwiUHJlbG9hZCIsIk1lbnUiLCJMZXZlbCIsIlNldHRpbmdzIiwiTGV2ZWxNYW5hZ2VyIiwiZ2FtZSIsIlBoYXNlciIsIkdhbWUiLCJBVVRPIiwic3RhdGUiLCJhZGQiXSwibWFwcGluZ3MiOiJBQUFBLE1BQU1BLE9BQU9DLFFBQVEsa0JBQVIsQ0FBYjtBQUNBLE1BQU1DLFVBQVVELFFBQVEscUJBQVIsQ0FBaEI7QUFDQSxNQUFNRSxPQUFPRixRQUFRLGtCQUFSLENBQWI7QUFDQSxNQUFNRyxRQUFRSCxRQUFRLG1CQUFSLENBQWQ7QUFDQSxNQUFNSSxXQUFXSixRQUFRLHNCQUFSLENBQWpCO0FBQ0EsTUFBTUssZUFBZUwsUUFBUSwwQkFBUixDQUFyQjs7QUFFQSxNQUFNTSxPQUFPLElBQUlDLE9BQU9DLElBQVgsQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEJELE9BQU9FLElBQWpDLEVBQXVDLGNBQXZDLENBQWI7O0FBRUFILEtBQUtJLEtBQUwsQ0FBV0MsR0FBWCxDQUFlLE1BQWYsRUFBdUJULElBQXZCO0FBQ0FJLEtBQUtJLEtBQUwsQ0FBV0MsR0FBWCxDQUFlLFVBQWYsRUFBMkJQLFFBQTNCO0FBQ0FFLEtBQUtJLEtBQUwsQ0FBV0MsR0FBWCxDQUFlLE9BQWYsRUFBd0JSLEtBQXhCO0FBQ0FHLEtBQUtJLEtBQUwsQ0FBV0MsR0FBWCxDQUFlLGNBQWYsRUFBK0JOLFlBQS9CO0FBQ0FDLEtBQUtJLEtBQUwsQ0FBV0MsR0FBWCxDQUFlLFNBQWYsRUFBMEJWLE9BQTFCO0FBQ0FLLEtBQUtJLEtBQUwsQ0FBV0MsR0FBWCxDQUFlLE1BQWYsRUFBdUJaLElBQXZCLEVBQTZCLElBQTdCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQm9vdCA9IHJlcXVpcmUoJy4vc3RhdGVzL0Jvb3QuanMnKTtcclxuY29uc3QgUHJlbG9hZCA9IHJlcXVpcmUoJy4vc3RhdGVzL1ByZWxvYWQuanMnKTtcclxuY29uc3QgTWVudSA9IHJlcXVpcmUoJy4vc3RhdGVzL01lbnUuanMnKTtcclxuY29uc3QgTGV2ZWwgPSByZXF1aXJlKCcuL3N0YXRlcy9MZXZlbC5qcycpO1xyXG5jb25zdCBTZXR0aW5ncyA9IHJlcXVpcmUoJy4vc3RhdGVzL1NldHRpbmdzLmpzJyk7XHJcbmNvbnN0IExldmVsTWFuYWdlciA9IHJlcXVpcmUoJy4vc3RhdGVzL0xldmVsTWFuYWdlci5qcycpO1xyXG5cclxuY29uc3QgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSg0ODAsIDMyMCwgUGhhc2VyLkFVVE8sICdTaG9vdGVyQmxpbmsnKTtcclxuXHJcbmdhbWUuc3RhdGUuYWRkKCdNZW51JywgTWVudSk7XHJcbmdhbWUuc3RhdGUuYWRkKCdTZXR0aW5ncycsIFNldHRpbmdzKTtcclxuZ2FtZS5zdGF0ZS5hZGQoJ0xldmVsJywgTGV2ZWwpO1xyXG5nYW1lLnN0YXRlLmFkZCgnTGV2ZWxNYW5hZ2VyJywgTGV2ZWxNYW5hZ2VyKTtcclxuZ2FtZS5zdGF0ZS5hZGQoJ1ByZWxvYWQnLCBQcmVsb2FkKTtcclxuZ2FtZS5zdGF0ZS5hZGQoJ0Jvb3QnLCBCb290LCB0cnVlKTtcclxuIl19
},{"./states/Boot.js":9,"./states/Level.js":10,"./states/LevelManager.js":11,"./states/Menu.js":12,"./states/Preload.js":13,"./states/Settings.js":14}],9:[function(require,module,exports){
class Boot {
	init() {
		this.w = 480;
		this.h = 320;
	}

	create() {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.scale.setMaximum();

		this.game.renderer.renderSession.roundPixels = true;
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

		this.state.start('Preload');
	}
}

module.exports = Boot;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJvb3QuanMiXSwibmFtZXMiOlsiQm9vdCIsImluaXQiLCJ3IiwiaCIsImNyZWF0ZSIsInNjYWxlIiwic2NhbGVNb2RlIiwiUGhhc2VyIiwiU2NhbGVNYW5hZ2VyIiwiU0hPV19BTEwiLCJmdWxsU2NyZWVuU2NhbGVNb2RlIiwiRVhBQ1RfRklUIiwicGFnZUFsaWduSG9yaXpvbnRhbGx5IiwicGFnZUFsaWduVmVydGljYWxseSIsInNldE1heGltdW0iLCJnYW1lIiwicmVuZGVyZXIiLCJyZW5kZXJTZXNzaW9uIiwicm91bmRQaXhlbHMiLCJDYW52YXMiLCJzZXRJbWFnZVJlbmRlcmluZ0NyaXNwIiwiY2FudmFzIiwic3RhdGUiLCJzdGFydCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBLE1BQU1BLElBQU4sQ0FBVztBQUNWQyxRQUFPO0FBQ04sT0FBS0MsQ0FBTCxHQUFTLEdBQVQ7QUFDQSxPQUFLQyxDQUFMLEdBQVMsR0FBVDtBQUNBOztBQUVEQyxVQUFTO0FBQ1IsT0FBS0MsS0FBTCxDQUFXQyxTQUFYLEdBQXVCQyxPQUFPQyxZQUFQLENBQW9CQyxRQUEzQztBQUNBLE9BQUtKLEtBQUwsQ0FBV0ssbUJBQVgsR0FBaUNILE9BQU9DLFlBQVAsQ0FBb0JHLFNBQXJEO0FBQ0EsT0FBS04sS0FBTCxDQUFXTyxxQkFBWCxHQUFtQyxJQUFuQztBQUNBLE9BQUtQLEtBQUwsQ0FBV1EsbUJBQVgsR0FBaUMsSUFBakM7QUFDQSxPQUFLUixLQUFMLENBQVdTLFVBQVg7O0FBRUEsT0FBS0MsSUFBTCxDQUFVQyxRQUFWLENBQW1CQyxhQUFuQixDQUFpQ0MsV0FBakMsR0FBK0MsSUFBL0M7QUFDQVgsU0FBT1ksTUFBUCxDQUFjQyxzQkFBZCxDQUFxQyxLQUFLTCxJQUFMLENBQVVNLE1BQS9DOztBQUVBLE9BQUtDLEtBQUwsQ0FBV0MsS0FBWCxDQUFpQixTQUFqQjtBQUNBO0FBakJTOztBQW9CWEMsT0FBT0MsT0FBUCxHQUFpQnpCLElBQWpCIiwiZmlsZSI6IkJvb3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBCb290IHtcclxuXHRpbml0KCkge1xyXG5cdFx0dGhpcy53ID0gNDgwO1xyXG5cdFx0dGhpcy5oID0gMzIwO1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlKCkge1xyXG5cdFx0dGhpcy5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xyXG5cdFx0dGhpcy5zY2FsZS5mdWxsU2NyZWVuU2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5FWEFDVF9GSVQ7XHJcblx0XHR0aGlzLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XHJcblx0XHR0aGlzLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xyXG5cdFx0dGhpcy5zY2FsZS5zZXRNYXhpbXVtKCk7XHJcblxyXG5cdFx0dGhpcy5nYW1lLnJlbmRlcmVyLnJlbmRlclNlc3Npb24ucm91bmRQaXhlbHMgPSB0cnVlO1xyXG5cdFx0UGhhc2VyLkNhbnZhcy5zZXRJbWFnZVJlbmRlcmluZ0NyaXNwKHRoaXMuZ2FtZS5jYW52YXMpO1xyXG5cclxuXHRcdHRoaXMuc3RhdGUuc3RhcnQoJ1ByZWxvYWQnKTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQm9vdDsiXX0=
},{}],10:[function(require,module,exports){
const Player = require('../game/Player');
const Enemy = require('../game/Enemy');

class Level {
	create() {
		// TileMap
		this.map = this.game.add.tilemap('level' + this.game.currentLevel, 16, 16);
		this.map.addTilesetImage('tilemap');
		this.map.debugMap = true;

		this.bg = this.game.add.tileSprite(0, 0, 10000, 10000, 'bg');
		this.world.setBounds(0, 0, 10000, 10000);

		this.firstLayerMap = this.map.createLayer('map1');
		this.firstLayerMap.resizeWorld();
		this.firstLayerMap.smoothed = false;

		this.secondLayerMap = this.map.createLayer('map2');
		this.secondLayerMap.resizeWorld();
		this.secondLayerMap.smoothed = false;

		// PathFinder
		let arr = [];
		for (let i in this.map.tilesets[0].tileProperties) {
			if (this.map.tilesets[0].tileProperties[i].solid === 'false') arr.push(+i);else this.map.setCollision(+i, true, this.firstLayerMap);
		}

		this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
		this.pathfinder.setGrid(this.map.layers[0].data, arr);

		this._createTextAreas();
		this._createDeadAreas();
		this._createPatruleFlags();
		this._createItems();
		this._createEnemies();

		// group for bullets
		this.bullets = this.add.group();

		// Next level area
		let rect = this.map.objects.nextLevelArea[0];
		this.nextLevelArea = new Phaser.Rectangle(rect.x, rect.y, rect.width, rect.height);
		console.log(this.nextLevelArea);

		// Player
		let posPlayer = this.map.objects.player[0];
		this.player = new Player(this, posPlayer.x + posPlayer.width / 2, posPlayer.y + posPlayer.height / 2);
	}
	_createEnemies() {
		this.enemies = this.game.add.group();
		this.map.objects.spawner && this.map.objects.spawner.forEach(spawn => {
			let enemy = new Enemy(this, spawn.x + spawn.width / 2, spawn.y + spawn.height / 2, spawn.properties.type);
			this.enemies.add(enemy.sprite);
		});
	}
	_createItems() {
		this.items = this.add.group();
		this.items.enableBody = true;
		this.map.objects.items && this.map.objects.items.forEach(rect => {
			let id;
			if (rect.properties.type == 'coins') id = 4;else if (rect.properties.type == 'health') id = 1;else if (rect.properties.type == 'cartridge') id = 3;else id = 0;

			let item = this.add.sprite(rect.x + rect.width / 2, rect.y + rect.height / 2, 'items', id);
			item.type = rect.properties.type;
			item.anchor.set(0.5);
			item.tween = this.add.tween(item.scale).to({ x: 1.1, y: 1.1 }, 300).to({ x: 0.8, y: 0.8 }, 400).to({ x: 1, y: 1 }, 400).loop().start();

			item.smoothed = false;
			this.items.add(item);
		});
	}
	_createPatruleFlags() {
		this.patruleFlags = [];
		this.map.objects.moving && this.map.objects.moving.forEach(rect => {
			let rectangle = new Phaser.Rectangle(rect.x, rect.y, rect.width, rect.height);
			this.patruleFlags.push(rectangle);
		});
	}
	_createDeadAreas() {
		this.deadAreas = [];
		this.map.objects.deadAreas && this.map.objects.deadAreas.forEach(rect => {
			let rectangle = new Phaser.Rectangle(rect.x, rect.y, rect.width, rect.height);
			this.deadAreas.push(rectangle);
		});
	}

	_createTextAreas() {
		this.textAreas = [];
		this.map.objects.textAreas && this.map.objects.textAreas.forEach(rect => {
			let rectangle = new Phaser.Rectangle(rect.x, rect.y, rect.width, rect.height);
			let i = 1;
			while (rect.properties['text' + i]) {
				rectangle['text' + i] = rect.properties['text' + i];
				i++;
			}
			this.textAreas.push(rectangle);
		});
	}

	nextLevel() {
		this.game.currentLevel++;

		if (this.game.currentLevel <= this.game.totalLevels) this.state.start('Level');else this.state.start('Menu');
	}

	update() {
		this.bg.tilePosition.x += 1;
		this.bg.tilePosition.y += 1;

		this.player._update();
		for (let i = 0; i < this.enemies.children.length; i++) {
			this.enemies.children[i].class._update();
		}
	}
}

module.exports = Level;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxldmVsLmpzIl0sIm5hbWVzIjpbIlBsYXllciIsInJlcXVpcmUiLCJFbmVteSIsIkxldmVsIiwiY3JlYXRlIiwibWFwIiwiZ2FtZSIsImFkZCIsInRpbGVtYXAiLCJjdXJyZW50TGV2ZWwiLCJhZGRUaWxlc2V0SW1hZ2UiLCJkZWJ1Z01hcCIsImJnIiwidGlsZVNwcml0ZSIsIndvcmxkIiwic2V0Qm91bmRzIiwiZmlyc3RMYXllck1hcCIsImNyZWF0ZUxheWVyIiwicmVzaXplV29ybGQiLCJzbW9vdGhlZCIsInNlY29uZExheWVyTWFwIiwiYXJyIiwiaSIsInRpbGVzZXRzIiwidGlsZVByb3BlcnRpZXMiLCJzb2xpZCIsInB1c2giLCJzZXRDb2xsaXNpb24iLCJwYXRoZmluZGVyIiwicGx1Z2lucyIsIlBoYXNlciIsIlBsdWdpbiIsIlBhdGhGaW5kZXJQbHVnaW4iLCJzZXRHcmlkIiwibGF5ZXJzIiwiZGF0YSIsIl9jcmVhdGVUZXh0QXJlYXMiLCJfY3JlYXRlRGVhZEFyZWFzIiwiX2NyZWF0ZVBhdHJ1bGVGbGFncyIsIl9jcmVhdGVJdGVtcyIsIl9jcmVhdGVFbmVtaWVzIiwiYnVsbGV0cyIsImdyb3VwIiwicmVjdCIsIm9iamVjdHMiLCJuZXh0TGV2ZWxBcmVhIiwiUmVjdGFuZ2xlIiwieCIsInkiLCJ3aWR0aCIsImhlaWdodCIsImNvbnNvbGUiLCJsb2ciLCJwb3NQbGF5ZXIiLCJwbGF5ZXIiLCJlbmVtaWVzIiwic3Bhd25lciIsImZvckVhY2giLCJzcGF3biIsImVuZW15IiwicHJvcGVydGllcyIsInR5cGUiLCJzcHJpdGUiLCJpdGVtcyIsImVuYWJsZUJvZHkiLCJpZCIsIml0ZW0iLCJhbmNob3IiLCJzZXQiLCJ0d2VlbiIsInNjYWxlIiwidG8iLCJsb29wIiwic3RhcnQiLCJwYXRydWxlRmxhZ3MiLCJtb3ZpbmciLCJyZWN0YW5nbGUiLCJkZWFkQXJlYXMiLCJ0ZXh0QXJlYXMiLCJuZXh0TGV2ZWwiLCJ0b3RhbExldmVscyIsInN0YXRlIiwidXBkYXRlIiwidGlsZVBvc2l0aW9uIiwiX3VwZGF0ZSIsImNoaWxkcmVuIiwibGVuZ3RoIiwiY2xhc3MiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQSxNQUFNQSxTQUFTQyxRQUFRLGdCQUFSLENBQWY7QUFDQSxNQUFNQyxRQUFRRCxRQUFRLGVBQVIsQ0FBZDs7QUFFQSxNQUFNRSxLQUFOLENBQVk7QUFDWEMsVUFBUztBQUNSO0FBQ0EsT0FBS0MsR0FBTCxHQUFXLEtBQUtDLElBQUwsQ0FBVUMsR0FBVixDQUFjQyxPQUFkLENBQXNCLFVBQVUsS0FBS0YsSUFBTCxDQUFVRyxZQUExQyxFQUF3RCxFQUF4RCxFQUE0RCxFQUE1RCxDQUFYO0FBQ0EsT0FBS0osR0FBTCxDQUFTSyxlQUFULENBQXlCLFNBQXpCO0FBQ0EsT0FBS0wsR0FBTCxDQUFTTSxRQUFULEdBQW9CLElBQXBCOztBQUVBLE9BQUtDLEVBQUwsR0FBVSxLQUFLTixJQUFMLENBQVVDLEdBQVYsQ0FBY00sVUFBZCxDQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQixLQUEvQixFQUFzQyxLQUF0QyxFQUE2QyxJQUE3QyxDQUFWO0FBQ0EsT0FBS0MsS0FBTCxDQUFXQyxTQUFYLENBQXFCLENBQXJCLEVBQXdCLENBQXhCLEVBQTJCLEtBQTNCLEVBQWtDLEtBQWxDOztBQUVBLE9BQUtDLGFBQUwsR0FBcUIsS0FBS1gsR0FBTCxDQUFTWSxXQUFULENBQXFCLE1BQXJCLENBQXJCO0FBQ0EsT0FBS0QsYUFBTCxDQUFtQkUsV0FBbkI7QUFDQSxPQUFLRixhQUFMLENBQW1CRyxRQUFuQixHQUE4QixLQUE5Qjs7QUFFQSxPQUFLQyxjQUFMLEdBQXNCLEtBQUtmLEdBQUwsQ0FBU1ksV0FBVCxDQUFxQixNQUFyQixDQUF0QjtBQUNBLE9BQUtHLGNBQUwsQ0FBb0JGLFdBQXBCO0FBQ0EsT0FBS0UsY0FBTCxDQUFvQkQsUUFBcEIsR0FBK0IsS0FBL0I7O0FBRUE7QUFDQSxNQUFJRSxNQUFNLEVBQVY7QUFDQSxPQUFJLElBQUlDLENBQVIsSUFBYSxLQUFLakIsR0FBTCxDQUFTa0IsUUFBVCxDQUFrQixDQUFsQixFQUFxQkMsY0FBbEMsRUFBa0Q7QUFDakQsT0FBRyxLQUFLbkIsR0FBTCxDQUFTa0IsUUFBVCxDQUFrQixDQUFsQixFQUFxQkMsY0FBckIsQ0FBb0NGLENBQXBDLEVBQXVDRyxLQUF2QyxLQUFpRCxPQUFwRCxFQUE2REosSUFBSUssSUFBSixDQUFTLENBQUNKLENBQVYsRUFBN0QsS0FDSyxLQUFLakIsR0FBTCxDQUFTc0IsWUFBVCxDQUFzQixDQUFDTCxDQUF2QixFQUEwQixJQUExQixFQUFnQyxLQUFLTixhQUFyQztBQUNMOztBQUVELE9BQUtZLFVBQUwsR0FBa0IsS0FBS3RCLElBQUwsQ0FBVXVCLE9BQVYsQ0FBa0J0QixHQUFsQixDQUFzQnVCLE9BQU9DLE1BQVAsQ0FBY0MsZ0JBQXBDLENBQWxCO0FBQ0EsT0FBS0osVUFBTCxDQUFnQkssT0FBaEIsQ0FBd0IsS0FBSzVCLEdBQUwsQ0FBUzZCLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFBbUJDLElBQTNDLEVBQWlEZCxHQUFqRDs7QUFFQSxPQUFLZSxnQkFBTDtBQUNBLE9BQUtDLGdCQUFMO0FBQ0EsT0FBS0MsbUJBQUw7QUFDQSxPQUFLQyxZQUFMO0FBQ0EsT0FBS0MsY0FBTDs7QUFFQTtBQUNBLE9BQUtDLE9BQUwsR0FBZSxLQUFLbEMsR0FBTCxDQUFTbUMsS0FBVCxFQUFmOztBQUVBO0FBQ0EsTUFBSUMsT0FBTyxLQUFLdEMsR0FBTCxDQUFTdUMsT0FBVCxDQUFpQkMsYUFBakIsQ0FBK0IsQ0FBL0IsQ0FBWDtBQUNBLE9BQUtBLGFBQUwsR0FBcUIsSUFBSWYsT0FBT2dCLFNBQVgsQ0FBcUJILEtBQUtJLENBQTFCLEVBQTZCSixLQUFLSyxDQUFsQyxFQUFxQ0wsS0FBS00sS0FBMUMsRUFBaUROLEtBQUtPLE1BQXRELENBQXJCO0FBQ0FDLFVBQVFDLEdBQVIsQ0FBWSxLQUFLUCxhQUFqQjs7QUFFQTtBQUNBLE1BQUlRLFlBQVksS0FBS2hELEdBQUwsQ0FBU3VDLE9BQVQsQ0FBaUJVLE1BQWpCLENBQXdCLENBQXhCLENBQWhCO0FBQ0EsT0FBS0EsTUFBTCxHQUFjLElBQUl0RCxNQUFKLENBQVcsSUFBWCxFQUFpQnFELFVBQVVOLENBQVYsR0FBWU0sVUFBVUosS0FBVixHQUFnQixDQUE3QyxFQUFnREksVUFBVUwsQ0FBVixHQUFZSyxVQUFVSCxNQUFWLEdBQWlCLENBQTdFLENBQWQ7QUFDQTtBQUNEVixrQkFBaUI7QUFDaEIsT0FBS2UsT0FBTCxHQUFlLEtBQUtqRCxJQUFMLENBQVVDLEdBQVYsQ0FBY21DLEtBQWQsRUFBZjtBQUNBLE9BQUtyQyxHQUFMLENBQVN1QyxPQUFULENBQWlCWSxPQUFqQixJQUE0QixLQUFLbkQsR0FBTCxDQUFTdUMsT0FBVCxDQUFpQlksT0FBakIsQ0FBeUJDLE9BQXpCLENBQWtDQyxLQUFELElBQVc7QUFDdkUsT0FBSUMsUUFBUSxJQUFJekQsS0FBSixDQUFVLElBQVYsRUFBZ0J3RCxNQUFNWCxDQUFOLEdBQVFXLE1BQU1ULEtBQU4sR0FBWSxDQUFwQyxFQUF1Q1MsTUFBTVYsQ0FBTixHQUFRVSxNQUFNUixNQUFOLEdBQWEsQ0FBNUQsRUFBK0RRLE1BQU1FLFVBQU4sQ0FBaUJDLElBQWhGLENBQVo7QUFDQSxRQUFLTixPQUFMLENBQWFoRCxHQUFiLENBQWlCb0QsTUFBTUcsTUFBdkI7QUFDQSxHQUgyQixDQUE1QjtBQUlBO0FBQ0R2QixnQkFBZTtBQUNkLE9BQUt3QixLQUFMLEdBQWEsS0FBS3hELEdBQUwsQ0FBU21DLEtBQVQsRUFBYjtBQUNBLE9BQUtxQixLQUFMLENBQVdDLFVBQVgsR0FBd0IsSUFBeEI7QUFDQSxPQUFLM0QsR0FBTCxDQUFTdUMsT0FBVCxDQUFpQm1CLEtBQWpCLElBQTBCLEtBQUsxRCxHQUFMLENBQVN1QyxPQUFULENBQWlCbUIsS0FBakIsQ0FBdUJOLE9BQXZCLENBQWdDZCxJQUFELElBQVU7QUFDbEUsT0FBSXNCLEVBQUo7QUFDQSxPQUFHdEIsS0FBS2lCLFVBQUwsQ0FBZ0JDLElBQWhCLElBQXdCLE9BQTNCLEVBQW9DSSxLQUFLLENBQUwsQ0FBcEMsS0FDSyxJQUFHdEIsS0FBS2lCLFVBQUwsQ0FBZ0JDLElBQWhCLElBQXdCLFFBQTNCLEVBQXFDSSxLQUFLLENBQUwsQ0FBckMsS0FDQSxJQUFHdEIsS0FBS2lCLFVBQUwsQ0FBZ0JDLElBQWhCLElBQXdCLFdBQTNCLEVBQXdDSSxLQUFLLENBQUwsQ0FBeEMsS0FDQUEsS0FBSyxDQUFMOztBQUVMLE9BQUlDLE9BQU8sS0FBSzNELEdBQUwsQ0FBU3VELE1BQVQsQ0FBZ0JuQixLQUFLSSxDQUFMLEdBQU9KLEtBQUtNLEtBQUwsR0FBVyxDQUFsQyxFQUFxQ04sS0FBS0ssQ0FBTCxHQUFPTCxLQUFLTyxNQUFMLEdBQVksQ0FBeEQsRUFBMkQsT0FBM0QsRUFBb0VlLEVBQXBFLENBQVg7QUFDQUMsUUFBS0wsSUFBTCxHQUFZbEIsS0FBS2lCLFVBQUwsQ0FBZ0JDLElBQTVCO0FBQ0FLLFFBQUtDLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixHQUFoQjtBQUNBRixRQUFLRyxLQUFMLEdBQWEsS0FBSzlELEdBQUwsQ0FBUzhELEtBQVQsQ0FBZUgsS0FBS0ksS0FBcEIsRUFDWEMsRUFEVyxDQUNSLEVBQUN4QixHQUFFLEdBQUgsRUFBUUMsR0FBRyxHQUFYLEVBRFEsRUFDUyxHQURULEVBRVh1QixFQUZXLENBRVIsRUFBQ3hCLEdBQUcsR0FBSixFQUFTQyxHQUFHLEdBQVosRUFGUSxFQUVVLEdBRlYsRUFHWHVCLEVBSFcsQ0FHUixFQUFDeEIsR0FBRyxDQUFKLEVBQU9DLEdBQUcsQ0FBVixFQUhRLEVBR00sR0FITixFQUlYd0IsSUFKVyxHQUtYQyxLQUxXLEVBQWI7O0FBT0FQLFFBQUsvQyxRQUFMLEdBQWdCLEtBQWhCO0FBQ0EsUUFBSzRDLEtBQUwsQ0FBV3hELEdBQVgsQ0FBZTJELElBQWY7QUFDQSxHQW5CeUIsQ0FBMUI7QUFvQkE7QUFDRDVCLHVCQUFzQjtBQUNyQixPQUFLb0MsWUFBTCxHQUFvQixFQUFwQjtBQUNBLE9BQUtyRSxHQUFMLENBQVN1QyxPQUFULENBQWlCK0IsTUFBakIsSUFBMkIsS0FBS3RFLEdBQUwsQ0FBU3VDLE9BQVQsQ0FBaUIrQixNQUFqQixDQUF3QmxCLE9BQXhCLENBQWlDZCxJQUFELElBQVU7QUFDcEUsT0FBSWlDLFlBQVksSUFBSTlDLE9BQU9nQixTQUFYLENBQXFCSCxLQUFLSSxDQUExQixFQUE2QkosS0FBS0ssQ0FBbEMsRUFBcUNMLEtBQUtNLEtBQTFDLEVBQWlETixLQUFLTyxNQUF0RCxDQUFoQjtBQUNBLFFBQUt3QixZQUFMLENBQWtCaEQsSUFBbEIsQ0FBdUJrRCxTQUF2QjtBQUNBLEdBSDBCLENBQTNCO0FBSUE7QUFDRHZDLG9CQUFtQjtBQUNsQixPQUFLd0MsU0FBTCxHQUFpQixFQUFqQjtBQUNBLE9BQUt4RSxHQUFMLENBQVN1QyxPQUFULENBQWlCaUMsU0FBakIsSUFBOEIsS0FBS3hFLEdBQUwsQ0FBU3VDLE9BQVQsQ0FBaUJpQyxTQUFqQixDQUEyQnBCLE9BQTNCLENBQW9DZCxJQUFELElBQVU7QUFDMUUsT0FBSWlDLFlBQVksSUFBSTlDLE9BQU9nQixTQUFYLENBQXFCSCxLQUFLSSxDQUExQixFQUE2QkosS0FBS0ssQ0FBbEMsRUFBcUNMLEtBQUtNLEtBQTFDLEVBQWlETixLQUFLTyxNQUF0RCxDQUFoQjtBQUNBLFFBQUsyQixTQUFMLENBQWVuRCxJQUFmLENBQW9Ca0QsU0FBcEI7QUFDQSxHQUg2QixDQUE5QjtBQUlBOztBQUVEeEMsb0JBQW1CO0FBQ2xCLE9BQUswQyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0EsT0FBS3pFLEdBQUwsQ0FBU3VDLE9BQVQsQ0FBaUJrQyxTQUFqQixJQUE4QixLQUFLekUsR0FBTCxDQUFTdUMsT0FBVCxDQUFpQmtDLFNBQWpCLENBQTJCckIsT0FBM0IsQ0FBb0NkLElBQUQsSUFBVTtBQUMxRSxPQUFJaUMsWUFBWSxJQUFJOUMsT0FBT2dCLFNBQVgsQ0FBcUJILEtBQUtJLENBQTFCLEVBQTZCSixLQUFLSyxDQUFsQyxFQUFxQ0wsS0FBS00sS0FBMUMsRUFBaUROLEtBQUtPLE1BQXRELENBQWhCO0FBQ0EsT0FBSTVCLElBQUksQ0FBUjtBQUNBLFVBQU1xQixLQUFLaUIsVUFBTCxDQUFnQixTQUFTdEMsQ0FBekIsQ0FBTixFQUFtQztBQUNsQ3NELGNBQVUsU0FBU3RELENBQW5CLElBQXdCcUIsS0FBS2lCLFVBQUwsQ0FBZ0IsU0FBU3RDLENBQXpCLENBQXhCO0FBQ0FBO0FBQ0E7QUFDRCxRQUFLd0QsU0FBTCxDQUFlcEQsSUFBZixDQUFvQmtELFNBQXBCO0FBQ0EsR0FSNkIsQ0FBOUI7QUFTQTs7QUFFREcsYUFBWTtBQUNYLE9BQUt6RSxJQUFMLENBQVVHLFlBQVY7O0FBRUEsTUFBRyxLQUFLSCxJQUFMLENBQVVHLFlBQVYsSUFBMEIsS0FBS0gsSUFBTCxDQUFVMEUsV0FBdkMsRUFBb0QsS0FBS0MsS0FBTCxDQUFXUixLQUFYLENBQWlCLE9BQWpCLEVBQXBELEtBQ0ssS0FBS1EsS0FBTCxDQUFXUixLQUFYLENBQWlCLE1BQWpCO0FBQ0w7O0FBRURTLFVBQVM7QUFDUixPQUFLdEUsRUFBTCxDQUFRdUUsWUFBUixDQUFxQnBDLENBQXJCLElBQTBCLENBQTFCO0FBQ0EsT0FBS25DLEVBQUwsQ0FBUXVFLFlBQVIsQ0FBcUJuQyxDQUFyQixJQUEwQixDQUExQjs7QUFFQSxPQUFLTSxNQUFMLENBQVk4QixPQUFaO0FBQ0EsT0FBSSxJQUFJOUQsSUFBSSxDQUFaLEVBQWVBLElBQUksS0FBS2lDLE9BQUwsQ0FBYThCLFFBQWIsQ0FBc0JDLE1BQXpDLEVBQWlEaEUsR0FBakQsRUFBc0Q7QUFDckQsUUFBS2lDLE9BQUwsQ0FBYThCLFFBQWIsQ0FBc0IvRCxDQUF0QixFQUF5QmlFLEtBQXpCLENBQStCSCxPQUEvQjtBQUNBO0FBQ0Q7QUF4SFU7O0FBNEhaSSxPQUFPQyxPQUFQLEdBQWlCdEYsS0FBakIiLCJmaWxlIjoiTGV2ZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBQbGF5ZXIgPSByZXF1aXJlKCcuLi9nYW1lL1BsYXllcicpO1xyXG5jb25zdCBFbmVteSA9IHJlcXVpcmUoJy4uL2dhbWUvRW5lbXknKTtcclxuXHJcbmNsYXNzIExldmVsIHtcclxuXHRjcmVhdGUoKSB7XHJcblx0XHQvLyBUaWxlTWFwXHJcblx0XHR0aGlzLm1hcCA9IHRoaXMuZ2FtZS5hZGQudGlsZW1hcCgnbGV2ZWwnICsgdGhpcy5nYW1lLmN1cnJlbnRMZXZlbCwgMTYsIDE2KTtcclxuXHRcdHRoaXMubWFwLmFkZFRpbGVzZXRJbWFnZSgndGlsZW1hcCcpO1xyXG5cdFx0dGhpcy5tYXAuZGVidWdNYXAgPSB0cnVlO1xyXG5cclxuXHRcdHRoaXMuYmcgPSB0aGlzLmdhbWUuYWRkLnRpbGVTcHJpdGUoMCwgMCwgMTAwMDAsIDEwMDAwLCAnYmcnKTtcclxuXHRcdHRoaXMud29ybGQuc2V0Qm91bmRzKDAsIDAsIDEwMDAwLCAxMDAwMCk7XHJcblxyXG5cdFx0dGhpcy5maXJzdExheWVyTWFwID0gdGhpcy5tYXAuY3JlYXRlTGF5ZXIoJ21hcDEnKTtcclxuXHRcdHRoaXMuZmlyc3RMYXllck1hcC5yZXNpemVXb3JsZCgpO1xyXG5cdFx0dGhpcy5maXJzdExheWVyTWFwLnNtb290aGVkID0gZmFsc2U7XHJcblxyXG5cdFx0dGhpcy5zZWNvbmRMYXllck1hcCA9IHRoaXMubWFwLmNyZWF0ZUxheWVyKCdtYXAyJyk7XHJcblx0XHR0aGlzLnNlY29uZExheWVyTWFwLnJlc2l6ZVdvcmxkKCk7XHJcblx0XHR0aGlzLnNlY29uZExheWVyTWFwLnNtb290aGVkID0gZmFsc2U7XHJcblxyXG5cdFx0Ly8gUGF0aEZpbmRlclxyXG5cdFx0bGV0IGFyciA9IFtdO1xyXG5cdFx0Zm9yKGxldCBpIGluIHRoaXMubWFwLnRpbGVzZXRzWzBdLnRpbGVQcm9wZXJ0aWVzKSB7XHJcblx0XHRcdGlmKHRoaXMubWFwLnRpbGVzZXRzWzBdLnRpbGVQcm9wZXJ0aWVzW2ldLnNvbGlkID09PSAnZmFsc2UnKSBhcnIucHVzaCgraSk7XHJcblx0XHRcdGVsc2UgdGhpcy5tYXAuc2V0Q29sbGlzaW9uKCtpLCB0cnVlLCB0aGlzLmZpcnN0TGF5ZXJNYXApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMucGF0aGZpbmRlciA9IHRoaXMuZ2FtZS5wbHVnaW5zLmFkZChQaGFzZXIuUGx1Z2luLlBhdGhGaW5kZXJQbHVnaW4pO1xyXG5cdFx0dGhpcy5wYXRoZmluZGVyLnNldEdyaWQodGhpcy5tYXAubGF5ZXJzWzBdLmRhdGEsIGFycik7XHJcblxyXG5cdFx0dGhpcy5fY3JlYXRlVGV4dEFyZWFzKCk7XHJcblx0XHR0aGlzLl9jcmVhdGVEZWFkQXJlYXMoKTtcclxuXHRcdHRoaXMuX2NyZWF0ZVBhdHJ1bGVGbGFncygpO1xyXG5cdFx0dGhpcy5fY3JlYXRlSXRlbXMoKTtcclxuXHRcdHRoaXMuX2NyZWF0ZUVuZW1pZXMoKTtcclxuXHJcblx0XHQvLyBncm91cCBmb3IgYnVsbGV0c1xyXG5cdFx0dGhpcy5idWxsZXRzID0gdGhpcy5hZGQuZ3JvdXAoKTtcclxuXHJcblx0XHQvLyBOZXh0IGxldmVsIGFyZWFcclxuXHRcdGxldCByZWN0ID0gdGhpcy5tYXAub2JqZWN0cy5uZXh0TGV2ZWxBcmVhWzBdO1xyXG5cdFx0dGhpcy5uZXh0TGV2ZWxBcmVhID0gbmV3IFBoYXNlci5SZWN0YW5nbGUocmVjdC54LCByZWN0LnksIHJlY3Qud2lkdGgsIHJlY3QuaGVpZ2h0KTtcclxuXHRcdGNvbnNvbGUubG9nKHRoaXMubmV4dExldmVsQXJlYSk7XHJcblxyXG5cdFx0Ly8gUGxheWVyXHJcblx0XHRsZXQgcG9zUGxheWVyID0gdGhpcy5tYXAub2JqZWN0cy5wbGF5ZXJbMF07XHJcblx0XHR0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIodGhpcywgcG9zUGxheWVyLngrcG9zUGxheWVyLndpZHRoLzIsIHBvc1BsYXllci55K3Bvc1BsYXllci5oZWlnaHQvMik7XHJcblx0fVxyXG5cdF9jcmVhdGVFbmVtaWVzKCkge1xyXG5cdFx0dGhpcy5lbmVtaWVzID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xyXG5cdFx0dGhpcy5tYXAub2JqZWN0cy5zcGF3bmVyICYmIHRoaXMubWFwLm9iamVjdHMuc3Bhd25lci5mb3JFYWNoKChzcGF3bikgPT4ge1xyXG5cdFx0XHRsZXQgZW5lbXkgPSBuZXcgRW5lbXkodGhpcywgc3Bhd24ueCtzcGF3bi53aWR0aC8yLCBzcGF3bi55K3NwYXduLmhlaWdodC8yLCBzcGF3bi5wcm9wZXJ0aWVzLnR5cGUpO1xyXG5cdFx0XHR0aGlzLmVuZW1pZXMuYWRkKGVuZW15LnNwcml0ZSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0X2NyZWF0ZUl0ZW1zKCkge1xyXG5cdFx0dGhpcy5pdGVtcyA9IHRoaXMuYWRkLmdyb3VwKCk7XHJcblx0XHR0aGlzLml0ZW1zLmVuYWJsZUJvZHkgPSB0cnVlO1xyXG5cdFx0dGhpcy5tYXAub2JqZWN0cy5pdGVtcyAmJiB0aGlzLm1hcC5vYmplY3RzLml0ZW1zLmZvckVhY2goKHJlY3QpID0+IHtcclxuXHRcdFx0bGV0IGlkO1xyXG5cdFx0XHRpZihyZWN0LnByb3BlcnRpZXMudHlwZSA9PSAnY29pbnMnKSBpZCA9IDQ7XHJcblx0XHRcdGVsc2UgaWYocmVjdC5wcm9wZXJ0aWVzLnR5cGUgPT0gJ2hlYWx0aCcpIGlkID0gMTtcclxuXHRcdFx0ZWxzZSBpZihyZWN0LnByb3BlcnRpZXMudHlwZSA9PSAnY2FydHJpZGdlJykgaWQgPSAzO1xyXG5cdFx0XHRlbHNlIGlkID0gMDtcclxuXHJcblx0XHRcdGxldCBpdGVtID0gdGhpcy5hZGQuc3ByaXRlKHJlY3QueCtyZWN0LndpZHRoLzIsIHJlY3QueStyZWN0LmhlaWdodC8yLCAnaXRlbXMnLCBpZCk7XHJcblx0XHRcdGl0ZW0udHlwZSA9IHJlY3QucHJvcGVydGllcy50eXBlO1xyXG5cdFx0XHRpdGVtLmFuY2hvci5zZXQoMC41KTtcclxuXHRcdFx0aXRlbS50d2VlbiA9IHRoaXMuYWRkLnR3ZWVuKGl0ZW0uc2NhbGUpXHJcblx0XHRcdFx0LnRvKHt4OjEuMSwgeTogMS4xfSwgMzAwKVxyXG5cdFx0XHRcdC50byh7eDogMC44LCB5OiAwLjh9LCA0MDApXHJcblx0XHRcdFx0LnRvKHt4OiAxLCB5OiAxfSwgNDAwKVxyXG5cdFx0XHRcdC5sb29wKClcclxuXHRcdFx0XHQuc3RhcnQoKTtcclxuXHJcblx0XHRcdGl0ZW0uc21vb3RoZWQgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5pdGVtcy5hZGQoaXRlbSk7XHJcblx0XHR9KTtcdFx0XHJcblx0fVxyXG5cdF9jcmVhdGVQYXRydWxlRmxhZ3MoKSB7XHJcblx0XHR0aGlzLnBhdHJ1bGVGbGFncyA9IFtdO1xyXG5cdFx0dGhpcy5tYXAub2JqZWN0cy5tb3ZpbmcgJiYgdGhpcy5tYXAub2JqZWN0cy5tb3ZpbmcuZm9yRWFjaCgocmVjdCkgPT4ge1xyXG5cdFx0XHRsZXQgcmVjdGFuZ2xlID0gbmV3IFBoYXNlci5SZWN0YW5nbGUocmVjdC54LCByZWN0LnksIHJlY3Qud2lkdGgsIHJlY3QuaGVpZ2h0KVxyXG5cdFx0XHR0aGlzLnBhdHJ1bGVGbGFncy5wdXNoKHJlY3RhbmdsZSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0X2NyZWF0ZURlYWRBcmVhcygpIHtcclxuXHRcdHRoaXMuZGVhZEFyZWFzID0gW107XHJcblx0XHR0aGlzLm1hcC5vYmplY3RzLmRlYWRBcmVhcyAmJiB0aGlzLm1hcC5vYmplY3RzLmRlYWRBcmVhcy5mb3JFYWNoKChyZWN0KSA9PiB7XHJcblx0XHRcdGxldCByZWN0YW5nbGUgPSBuZXcgUGhhc2VyLlJlY3RhbmdsZShyZWN0LngsIHJlY3QueSwgcmVjdC53aWR0aCwgcmVjdC5oZWlnaHQpXHJcblx0XHRcdHRoaXMuZGVhZEFyZWFzLnB1c2gocmVjdGFuZ2xlKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0X2NyZWF0ZVRleHRBcmVhcygpIHtcclxuXHRcdHRoaXMudGV4dEFyZWFzID0gW107XHJcblx0XHR0aGlzLm1hcC5vYmplY3RzLnRleHRBcmVhcyAmJiB0aGlzLm1hcC5vYmplY3RzLnRleHRBcmVhcy5mb3JFYWNoKChyZWN0KSA9PiB7XHJcblx0XHRcdGxldCByZWN0YW5nbGUgPSBuZXcgUGhhc2VyLlJlY3RhbmdsZShyZWN0LngsIHJlY3QueSwgcmVjdC53aWR0aCwgcmVjdC5oZWlnaHQpXHJcblx0XHRcdGxldCBpID0gMTtcclxuXHRcdFx0d2hpbGUocmVjdC5wcm9wZXJ0aWVzWyd0ZXh0JyArIGldKSB7XHJcblx0XHRcdFx0cmVjdGFuZ2xlWyd0ZXh0JyArIGldID0gcmVjdC5wcm9wZXJ0aWVzWyd0ZXh0JyArIGldO1xyXG5cdFx0XHRcdGkrKztcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLnRleHRBcmVhcy5wdXNoKHJlY3RhbmdsZSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdG5leHRMZXZlbCgpIHtcclxuXHRcdHRoaXMuZ2FtZS5jdXJyZW50TGV2ZWwrKztcclxuXHJcblx0XHRpZih0aGlzLmdhbWUuY3VycmVudExldmVsIDw9IHRoaXMuZ2FtZS50b3RhbExldmVscykgdGhpcy5zdGF0ZS5zdGFydCgnTGV2ZWwnKTtcclxuXHRcdGVsc2UgdGhpcy5zdGF0ZS5zdGFydCgnTWVudScpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKCkge1xyXG5cdFx0dGhpcy5iZy50aWxlUG9zaXRpb24ueCArPSAxO1xyXG5cdFx0dGhpcy5iZy50aWxlUG9zaXRpb24ueSArPSAxO1xyXG5cclxuXHRcdHRoaXMucGxheWVyLl91cGRhdGUoKTtcclxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmVuZW1pZXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dGhpcy5lbmVtaWVzLmNoaWxkcmVuW2ldLmNsYXNzLl91cGRhdGUoKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExldmVsOyJdfQ==
},{"../game/Enemy":1,"../game/Player":4}],11:[function(require,module,exports){
class LevelManager {
	create() {
		this.world.setBounds(0, 0, 480, 320);
		this.bg = this.game.add.tileSprite(0, 0, this.world.width, this.world.height, 'bg');

		this.label = this.add.bitmapText(this.world.centerX, 50, 'font', 'LEVEL SELECT', 30);
		this.label.anchor.set(0.5);
		this.label.smoothed = false;

		this.buttonsLevelSelect = this.add.group();
		let i = 0;
		for (let y = 0; y < 3; y++) {
			for (let x = 0; x < 8; x++) {
				i++;
				let btn = this.add.bitmapText(45 * x + 80, 45 * y + 110, 'font', i, 18);
				btn.anchor.set(0.5);
				btn.inputEnabled = true;
				btn.level = i;
				if (i > this.game.totalLevels) {
					btn.tint = 0xB0B0B0;
					btn.disable = true;
				}
				this.buttonsLevelSelect.add(btn);
			}
		}
		this.buttonsLevelSelect.x = this.world.centerX - 30 * 8;
		this.buttonsLevelSelect.inputEnableChildren = true;

		this.buttonsLevelSelect.onChildInputDown.add(btn => {
			if (btn.disable) return;

			this.add.tween(btn.scale).to({ x: 1.3, y: 1.3 }, 300).start();
		});
		this.buttonsLevelSelect.onChildInputUp.add(btn => {
			if (btn.disable) return;

			this.game.currentLevel = btn.level;
			this.goLevel();
		}, this);

		this.buttonsLevelSelect.onChildInputOver.add(btn => {
			if (btn.disable) return;

			this.add.tween(btn.scale).to({ x: 1.3, y: 1.3 }, 300).start();
		});
		this.buttonsLevelSelect.onChildInputOut.add(btn => {
			if (btn.disable) return;

			this.add.tween(btn.scale).to({ x: 1, y: 1 }, 300).start();
		});
	}

	goLevel(i) {
		this.state.start('Level');
	}

	update() {
		this.bg.tilePosition.x += 1;
		this.bg.tilePosition.y += 1;
	}
}

module.exports = LevelManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxldmVsTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJMZXZlbE1hbmFnZXIiLCJjcmVhdGUiLCJ3b3JsZCIsInNldEJvdW5kcyIsImJnIiwiZ2FtZSIsImFkZCIsInRpbGVTcHJpdGUiLCJ3aWR0aCIsImhlaWdodCIsImxhYmVsIiwiYml0bWFwVGV4dCIsImNlbnRlclgiLCJhbmNob3IiLCJzZXQiLCJzbW9vdGhlZCIsImJ1dHRvbnNMZXZlbFNlbGVjdCIsImdyb3VwIiwiaSIsInkiLCJ4IiwiYnRuIiwiaW5wdXRFbmFibGVkIiwibGV2ZWwiLCJ0b3RhbExldmVscyIsInRpbnQiLCJkaXNhYmxlIiwiaW5wdXRFbmFibGVDaGlsZHJlbiIsIm9uQ2hpbGRJbnB1dERvd24iLCJ0d2VlbiIsInNjYWxlIiwidG8iLCJzdGFydCIsIm9uQ2hpbGRJbnB1dFVwIiwiY3VycmVudExldmVsIiwiZ29MZXZlbCIsIm9uQ2hpbGRJbnB1dE92ZXIiLCJvbkNoaWxkSW5wdXRPdXQiLCJzdGF0ZSIsInVwZGF0ZSIsInRpbGVQb3NpdGlvbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBLE1BQU1BLFlBQU4sQ0FBbUI7QUFDbEJDLFVBQVM7QUFDUixPQUFLQyxLQUFMLENBQVdDLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkIsR0FBM0IsRUFBZ0MsR0FBaEM7QUFDQSxPQUFLQyxFQUFMLEdBQVUsS0FBS0MsSUFBTCxDQUFVQyxHQUFWLENBQWNDLFVBQWQsQ0FBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBK0IsS0FBS0wsS0FBTCxDQUFXTSxLQUExQyxFQUFpRCxLQUFLTixLQUFMLENBQVdPLE1BQTVELEVBQW9FLElBQXBFLENBQVY7O0FBRUEsT0FBS0MsS0FBTCxHQUFhLEtBQUtKLEdBQUwsQ0FBU0ssVUFBVCxDQUFvQixLQUFLVCxLQUFMLENBQVdVLE9BQS9CLEVBQXdDLEVBQXhDLEVBQTRDLE1BQTVDLEVBQW9ELGNBQXBELEVBQW9FLEVBQXBFLENB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UixDQUFxQnBCLENBQXJCLElBQTBCLENBQTFCO0FBQ0EsT0FBS2hCLEVBQUwsQ0FBUW9DLFlBQVIsQ0FBcUJyQixDQUFyQixJQUEwQixDQUExQjtBQUNBO0FBM0RpQjs7QUE4RG5Cc0IsT0FBT0MsT0FBUCxHQUFpQjFDLFlBQWpCIiwiZmlsZSI6IkxldmVsTWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIExldmVsTWFuYWdlciB7XHJcblx0Y3JlYXRlKCkge1xyXG5cdFx0dGhpcy53b3JsZC5zZXRCb3VuZHMoMCwgMCwgNDgwLCAzMjApO1xyXG5cdFx0dGhpcy5iZyA9IHRoaXMuZ2FtZS5hZGQudGlsZVNwcml0ZSgwLCAwLCB0aGlzLndvcmxkLndpZHRoLCB0aGlzLndvcmxkLmhlaWdodCwgJ2JnJyk7XHJcblxyXG5cdFx0dGhpcy5sYWJlbCA9IHRoaXMuYWRkLmJpdG1hcFRleHQodGhpcy53b3JsZC5jZW50ZXJYLCA1MCwgJ2ZvbnQnLCAnTEVWRUwgU0VMRUNUJywgMzApO1xyXG5cdFx0dGhpcy5sYWJlbC5hbmNob3Iuc2V0KDAuNSk7XHJcblx0XHR0aGlzLmxhYmVsLnNtb290aGVkID0gZmFsc2U7XHJcblxyXG5cdFx0dGhpcy5idXR0b25zTGV2ZWxTZWxlY3QgPSB0aGlzLmFkZC5ncm91cCgpO1xyXG5cdFx0bGV0IGkgPSAwO1xyXG5cdFx0Zm9yKGxldCB5ID0gMDsgeSA8IDM7IHkrKykge1xyXG5cdFx0XHRmb3IobGV0IHggPSAwOyB4IDwgODsgeCsrKSB7XHJcblx0XHRcdFx0aSsrO1xyXG5cdFx0XHRcdGxldCBidG4gPSB0aGlzLmFkZC5iaXRtYXBUZXh0KDQ1KngrODAsIDQ1KnkrMTEwLCAnZm9udCcsIGksIDE4KTtcclxuXHRcdFx0XHRidG4uYW5jaG9yLnNldCgwLjUpO1xyXG5cdFx0XHRcdGJ0bi5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHRcdGJ0bi5sZXZlbCA9IGk7XHJcblx0XHRcdFx0aWYoaSA+IHRoaXMuZ2FtZS50b3RhbExldmVscykge1xyXG5cdFx0XHRcdFx0YnRuLnRpbnQgPSAweEIwQjBCMDtcclxuXHRcdFx0XHRcdGJ0bi5kaXNhYmxlID0gdHJ1ZTtcclxuXHRcdFx0XHR9IFxyXG5cdFx0XHRcdHRoaXMuYnV0dG9uc0xldmVsU2VsZWN0LmFkZChidG4pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLmJ1dHRvbnNMZXZlbFNlbGVjdC54ID0gdGhpcy53b3JsZC5jZW50ZXJYLTMwKjg7XHJcblx0XHR0aGlzLmJ1dHRvbnNMZXZlbFNlbGVjdC5pbnB1dEVuYWJsZUNoaWxkcmVuID0gdHJ1ZTtcclxuXHJcblx0XHR0aGlzLmJ1dHRvbnNMZXZlbFNlbGVjdC5vbkNoaWxkSW5wdXREb3duLmFkZCgoYnRuKSA9PiB7XHJcblx0XHRcdGlmKGJ0bi5kaXNhYmxlKSByZXR1cm47XHJcblxyXG5cdFx0XHR0aGlzLmFkZC50d2VlbihidG4uc2NhbGUpLnRvKHt4OiAxLjMsIHk6IDEuM30sIDMwMCkuc3RhcnQoKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5idXR0b25zTGV2ZWxTZWxlY3Qub25DaGlsZElucHV0VXAuYWRkKChidG4pID0+IHtcclxuXHRcdFx0aWYoYnRuLmRpc2FibGUpIHJldHVybjtcclxuXHJcblx0XHRcdHRoaXMuZ2FtZS5jdXJyZW50TGV2ZWwgPSBidG4ubGV2ZWw7XHJcblx0XHRcdHRoaXMuZ29MZXZlbCgpO1xyXG5cdFx0fSwgdGhpcyk7XHJcblxyXG5cdFx0dGhpcy5idXR0b25zTGV2ZWxTZWxlY3Qub25DaGlsZElucHV0T3Zlci5hZGQoKGJ0bikgPT4ge1xyXG5cdFx0XHRpZihidG4uZGlzYWJsZSkgcmV0dXJuO1xyXG5cclxuXHRcdFx0dGhpcy5hZGQudHdlZW4oYnRuLnNjYWxlKS50byh7eDogMS4zLCB5OiAxLjN9LCAzMDApLnN0YXJ0KCk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuYnV0dG9uc0xldmVsU2VsZWN0Lm9uQ2hpbGRJbnB1dE91dC5hZGQoKGJ0bikgPT4ge1xyXG5cdFx0XHRpZihidG4uZGlzYWJsZSkgcmV0dXJuO1xyXG5cclxuXHRcdFx0dGhpcy5hZGQudHdlZW4oYnRuLnNjYWxlKS50byh7eDogMSwgeTogMX0sIDMwMCkuc3RhcnQoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Z29MZXZlbChpKSB7XHJcblx0XHR0aGlzLnN0YXRlLnN0YXJ0KCdMZXZlbCcpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlKCkge1xyXG5cdFx0dGhpcy5iZy50aWxlUG9zaXRpb24ueCArPSAxO1xyXG5cdFx0dGhpcy5iZy50aWxlUG9zaXRpb24ueSArPSAxO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMZXZlbE1hbmFnZXI7Il19
},{}],12:[function(require,module,exports){
class Menu {
	create() {
		this.world.setBounds(0, 0, 480, 320);
		this.bg = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'bg');

		this.labelPath1 = this.add.bitmapText(87, 25, 'font', 'BLINK', 35);
		this.labelPath1.smoothed = false;
		this.add.tween(this.labelPath1).to({ alpha: 0 }, 200).to({ alpha: 1 }, 100).start().loop();

		this.labelPart2 = this.add.bitmapText(248, 35, 'font', 'SHOOTER', 25);
		this.labelPart2.smoothed = false;

		this.btnStart = this.add.bitmapText(this.world.centerX, this.world.centerY - 35, 'font', 'START', 30);
		this.btnStart.anchor.set(0.5);
		this.btnStart.inputEnabled = true;
		console.log(this.btnStart);
		this.btnStart.events.onInputDown.add(() => {
			this.add.tween(this.btnStart.scale).to({ x: 1.3, y: 1.3 }, 300).start();
		});
		this.btnStart.events.onInputUp.add(() => {
			this.state.start('LevelManager');
		});
		this.btnStart.events.onInputOver.add(() => {
			this.add.tween(this.btnStart.scale).to({ x: 1.3, y: 1.3 }, 300).start();
		});
		this.btnStart.events.onInputOut.add(() => {
			this.add.tween(this.btnStart.scale).to({ x: 1, y: 1 }, 300).start();
		});

		this.btnSettings = this.add.bitmapText(this.world.centerX, this.world.centerY + 10, 'font', 'SETTINGS', 30);
		this.btnSettings.anchor.set(0.5);
		this.btnSettings.inputEnabled = true;
		this.btnSettings.events.onInputDown.add(() => {
			this.add.tween(this.btnSettings.scale).to({ x: 1.3, y: 1.3 }, 300).start();
		});
		this.btnSettings.events.onInputUp.add(() => {
			this.state.start('Settings');
		});
		this.btnSettings.events.onInputOver.add(() => {
			this.add.tween(this.btnSettings.scale).to({ x: 1.3, y: 1.3 }, 300).start();
		});
		this.btnSettings.events.onInputOut.add(() => {
			this.add.tween(this.btnSettings.scale).to({ x: 1, y: 1 }, 300).start();
		});

		this.info = this.add.bitmapText(10, this.world.height - 75, 'font2', 'Powered by azbang @v0.1', 14);
		this.info.smoothed = false;
	}
	update() {
		this.bg.tilePosition.x += 1;
		this.bg.tilePosition.y += 1;
	}
}

module.exports = Menu;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lbnUuanMiXSwibmFtZXMiOlsiTWVudSIsImNyZWF0ZSIsIndvcmxkIiwic2V0Qm91bmRzIiwiYmciLCJhZGQiLCJ0aWxlU3ByaXRlIiwid2lkdGgiLCJoZWlnaHQiLCJsYWJlbFBhdGgxIiwiYml0bWFwVGV4dCIsInNtb290aGVkIiwidHdlZW4iLCJ0byIsImFscGhhIiwic3RhcnQiLCJsb29wIiwibGFiZWxQYXJ0MiIsImJ0blN0YXJ0IiwiY2VudGVyWCIsImNlbnRlclkiLCJhbmNob3IiLCJzZXQiLCJpbnB1dEVuYWJsZWQiLCJjb25zb2xlIiwibG9nIiwiZXZlbnRzIiwib25JbnB1dERvd24iLCJzY2FsZSIsIngiLCJ5Iiwib25JbnB1dFVwIiwic3RhdGUiLCJvbklucHV0T3ZlciIsIm9uSW5wdXRPdXQiLCJidG5TZXR0aW5ncyIsImluZm8iLCJ1cGRhdGUiLCJ0aWxlUG9zaXRpb24iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQSxNQUFNQSxJQUFOLENBQVc7QUFDVkMsVUFBUztBQUNSLE9BQUtDLEtBQUwsQ0FBV0MsU0FBWCxDQUFxQixDQUFyQixFQUF3QixDQUF4QixFQUEyQixHQUEzQixFQUFnQyxHQUFoQztBQUNBLE9BQUtDLEVBQUwsR0FBVSxLQUFLQyxHQUFMLENBQVNDLFVBQVQsQ0FBb0IsQ0FBcEIsRUFBdUIsQ0FBdkIsRUFBMEIsS0FBS0osS0FBTCxDQUFXSyxLQUFyQyxFQUE0QyxLQUFLTCxLQUFMLENBQVdNLE1BQXZELEVBQStELElBQS9ELENBQVY7O0FBRUEsT0FBS0MsVUFBTCxHQUFrQixLQUFLSixHQUFMLENBQVNLLFVBQVQsQ0FBb0IsRUFBcEIsRUFBd0IsRUFBeEIsRUFBNEIsTUFBNUIsRUFBb0MsT0FBcEMsRUFBNkMsRUFBN0MsQ0FBbEI7QUFDQSxPQUFLRCxVQUFMLENBQWdCRSxRQUFoQixHQUEyQixLQUEzQjtBQUNBLE9BQUtOLEdBQUwsQ0FBU08sS0FBVCxDQUFlLEtBQUtILFVBQXBCLEVBQ0VJLEVB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bnUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBNZW51IHtcclxuXHRjcmVhdGUoKSB7XHJcblx0XHR0aGlzLndvcmxkLnNldEJvdW5kcygwLCAwLCA0ODAsIDMyMCk7XHJcblx0XHR0aGlzLmJnID0gdGhpcy5hZGQudGlsZVNwcml0ZSgwLCAwLCB0aGlzLndvcmxkLndpZHRoLCB0aGlzLndvcmxkLmhlaWdodCwgJ2JnJyk7XHJcblxyXG5cdFx0dGhpcy5sYWJlbFBhdGgxID0gdGhpcy5hZGQuYml0bWFwVGV4dCg4NywgMjUsICdmb250JywgJ0JMSU5LJywgMzUpO1xyXG5cdFx0dGhpcy5sYWJlbFBhdGgxLnNtb290aGVkID0gZmFsc2U7XHJcblx0XHR0aGlzLmFkZC50d2Vlbih0aGlzLmxhYmVsUGF0aDEpXHJcblx0XHRcdC50byh7YWxwaGE6IDB9LCAyMDApXHJcblx0XHRcdC50byh7YWxwaGE6IDF9LCAxMDApXHJcblx0XHRcdC5zdGFydCgpXHJcblx0XHRcdC5sb29wKCk7XHJcblxyXG5cdFx0dGhpcy5sYWJlbFBhcnQyID0gdGhpcy5hZGQuYml0bWFwVGV4dCgyNDgsIDM1LCAnZm9udCcsICdTSE9PVEVSJywgMjUpO1xyXG5cdFx0dGhpcy5sYWJlbFBhcnQyLnNtb290aGVkID0gZmFsc2U7XHJcblxyXG5cdFx0dGhpcy5idG5TdGFydCA9IHRoaXMuYWRkLmJpdG1hcFRleHQodGhpcy53b3JsZC5jZW50ZXJYLCB0aGlzLndvcmxkLmNlbnRlclktMzUsICdmb250JywgJ1NUQVJUJywgMzApO1xyXG5cdFx0dGhpcy5idG5TdGFydC5hbmNob3Iuc2V0KDAuNSk7XHJcblx0XHR0aGlzLmJ0blN0YXJ0LmlucHV0RW5hYmxlZCA9IHRydWU7XHJcblx0XHRjb25zb2xlLmxvZyh0aGlzLmJ0blN0YXJ0KTtcclxuXHRcdHRoaXMuYnRuU3RhcnQuZXZlbnRzLm9uSW5wdXREb3duLmFkZCgoKSA9PiB7XHJcblx0XHRcdHRoaXMuYWRkLnR3ZWVuKHRoaXMuYnRuU3RhcnQuc2NhbGUpLnRvKHt4OiAxLjMsIHk6IDEuM30sIDMwMCkuc3RhcnQoKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5idG5TdGFydC5ldmVudHMub25JbnB1dFVwLmFkZCgoKSA9PiB7XHJcblx0XHRcdHRoaXMuc3RhdGUuc3RhcnQoJ0xldmVsTWFuYWdlcicpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLmJ0blN0YXJ0LmV2ZW50cy5vbklucHV0T3Zlci5hZGQoKCkgPT4ge1xyXG5cdFx0XHR0aGlzLmFkZC50d2Vlbih0aGlzLmJ0blN0YXJ0LnNjYWxlKS50byh7eDogMS4zLCB5OiAxLjN9LCAzMDApLnN0YXJ0KCk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuYnRuU3RhcnQuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKCgpID0+IHtcclxuXHRcdFx0dGhpcy5hZGQudHdlZW4odGhpcy5idG5TdGFydC5zY2FsZSkudG8oe3g6IDEsIHk6IDF9LCAzMDApLnN0YXJ0KCk7XHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0dGhpcy5idG5TZXR0aW5ncyA9IHRoaXMuYWRkLmJpdG1hcFRleHQodGhpcy53b3JsZC5jZW50ZXJYLCB0aGlzLndvcmxkLmNlbnRlclkrMTAsICdmb250JywgJ1NFVFRJTkdTJywgMzApO1xyXG5cdFx0dGhpcy5idG5TZXR0aW5ncy5hbmNob3Iuc2V0KDAuNSk7XHJcblx0XHR0aGlzLmJ0blNldHRpbmdzLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcblx0XHR0aGlzLmJ0blNldHRpbmdzLmV2ZW50cy5vbklucHV0RG93bi5hZGQoKCkgPT4ge1xyXG5cdFx0XHR0aGlzLmFkZC50d2Vlbih0aGlzLmJ0blNldHRpbmdzLnNjYWxlKS50byh7eDogMS4zLCB5OiAxLjN9LCAzMDApLnN0YXJ0KCk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuYnRuU2V0dGluZ3MuZXZlbnRzLm9uSW5wdXRVcC5hZGQoKCkgPT4ge1xyXG5cdFx0XHR0aGlzLnN0YXRlLnN0YXJ0KCdTZXR0aW5ncycpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLmJ0blNldHRpbmdzLmV2ZW50cy5vbklucHV0T3Zlci5hZGQoKCkgPT4ge1xyXG5cdFx0XHR0aGlzLmFkZC50d2Vlbih0aGlzLmJ0blNldHRpbmdzLnNjYWxlKS50byh7eDogMS4zLCB5OiAxLjN9LCAzMDApLnN0YXJ0KCk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuYnRuU2V0dGluZ3MuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKCgpID0+IHtcclxuXHRcdFx0dGhpcy5hZGQudHdlZW4odGhpcy5idG5TZXR0aW5ncy5zY2FsZSkudG8oe3g6IDEsIHk6IDF9LCAzMDApLnN0YXJ0KCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLmluZm8gPSB0aGlzLmFkZC5iaXRtYXBUZXh0KDEwLCB0aGlzLndvcmxkLmhlaWdodC03NSwgJ2ZvbnQyJywgJ1Bvd2VyZWQgYnkgYXpiYW5nIEB2MC4xJywgMTQpO1xyXG5cdFx0dGhpcy5pbmZvLnNtb290aGVkID0gZmFsc2U7XHJcblx0fVxyXG5cdHVwZGF0ZSgpIHtcclxuXHRcdHRoaXMuYmcudGlsZVBvc2l0aW9uLnggKz0gMTtcclxuXHRcdHRoaXMuYmcudGlsZVBvc2l0aW9uLnkgKz0gMTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudTsiXX0=
},{}],13:[function(require,module,exports){
class Preload {
	init() {
		this.game.totalLevels = 2;
	}
	preload() {
		this.load.audio('music1', '../assets/music/theme-1.ogg');
		this.load.audio('music2', '../assets/music/theme-2.ogg');
		this.load.audio('music3', '../assets/music/theme-3.ogg');
		this.load.audio('music4', '../assets/music/theme-4.wav');

		this.load.image('bg', '../assets/bg.png');
		this.load.image('tilemap', '../assets/levels/tilemap.png');
		this.load.image('lifebox', '../assets/hud/lifebox.png');
		this.load.image('liferect', '../assets/hud/liferect.png');
		this.load.image('score', '../assets/hud/score.png');
		this.load.image('window', '../assets/window.png');

		this.load.spritesheet('fx_jump', '../assets/FX/jump.png', 47, 45, 6);
		this.load.spritesheet('fx_fire', '../assets/FX/fire.png', 32, 33, 6);
		this.load.spritesheet('fx_explosion', '../assets/FX/explosion.png', 35, 36, 7);
		this.load.spritesheet('fx_hit', '../assets/FX/hit.png', 16, 16, 6);
		this.load.spritesheet('fx_collide', '../assets/FX/collide.png', 37, 37, 6);
		this.load.spritesheet('fx_voice', '../assets/hud/voice.png', 20, 20, 7);

		this.load.spritesheet('legs', '../assets/legs.png', 15, 17, 4);

		this.load.bitmapFont('font', '../assets/font.png', '../assets/font.xml');
		this.load.bitmapFont('font2', '../assets/font2.png', '../assets/font2.xml');

		this.load.atlas('heads', 'assets/atlases/heads.png', 'assets/atlases/heads.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('bodies', 'assets/atlases/bodies.png', 'assets/atlases/bodies.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('attachToBody', 'assets/atlases/attachToBody.png', 'assets/atlases/attachToBody.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('weapons', 'assets/atlases/weapons.png', 'assets/atlases/weapons.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('items', 'assets/atlases/items.png', 'assets/atlases/items.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('bullets', 'assets/atlases/bullets.png', 'assets/atlases/bullets.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

		// load levels
		let i = 1;
		for (; i <= this.game.totalLevels; i++) {
			this.load.tilemap('level' + i, '../assets/levels/test/level' + i + '.json', null, Phaser.Tilemap.TILED_JSON);
		}
	}

	create() {
		let musics = [this.add.audio('music1'), this.add.audio('music2'), this.add.audio('music3'), this.add.audio('music4')];
		for (let i = 0; i < musics.length; i++) {
			(() => {
				let next = i + 1 > musics.length - 1 ? 0 : i + 1;
				musics[i].onStop.add(() => musics[next].play());
			})();
		}
		musics[0].play();
		this.game.musics = musics;

		this.game.currentLevel = 1;
		this.state.start('Menu');
	}
}

module.exports = Preload;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByZWxvYWQuanMiXSwibmFtZXMiOlsiUHJlbG9hZCIsImluaXQiLCJnYW1lIiwidG90YWxMZXZlbHMiLCJwcmVsb2FkIiwibG9hZCIsImF1ZGlvIiwiaW1hZ2UiLCJzcHJpdGVzaGVldCIsImJpdG1hcEZvbnQiLCJhdGxhcyIsIlBoYXNlciIsIkxvYWRlciIsIlRFWFRVUkVfQVRMQVNfSlNPTl9IQVNIIiwiaSIsInRpbGVtYXAiLCJUaWxlbWFwIiwiVElMRURfSlNPTiIsImNyZWF0ZSIsIm11c2ljcyIsImFkZCIsImxlbmd0aCIsIm5leHQiLCJvblN0b3AiLCJwbGF5IiwiY3VycmVudExldmVsIiwic3RhdGUiLCJzdGFydCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBLE1BQU1BLE9BQU4sQ0FBYztBQUNiQyxRQUFPO0FBQ04sT0FBS0MsSUFBTCxDQUFVQyxXQUFWLEdBQXdCLENBQXhCO0FBQ0E7QUFDREMsV0FBVTtBQUNULE9BQUtDLElBQUwsQ0FBVUMsS0FBVixDQUFnQixRQUFoQixFQUEwQiw2QkFBMUI7QUFDQSxPQUFLRCxJQUFMLENBQVVDLEtBQVYsQ0FBZ0IsUUFBaEIsRUFBMEIsNkJBQTFCO0FBQ0EsT0FBS0QsSUFBTCxDQUFVQyxLQUFWLENBQWdCLFFBQWhCLEVBQTBCLDZCQUExQjtBQUNBLE9BQUtELElBQUwsQ0FBVUMsS0FBVixDQUFnQixRQUFoQixFQUEwQiw2QkFBMUI7O0FBRUEsT0FBS0QsSUFBTCxDQUFVRSxLQUFWLENBQWdCLElBQWhCLEVBQXNCLGtCQUF0QjtBQUNBLE9BQUtGLElBQUwsQ0FBVUUsS0FBVixDQUFnQixTQUFoQixFQUEyQiw4QkFBM0I7QUFDQSxPQUFLRixJQUFMLENBQVVFLEtBQVYsQ0FBZ0IsU0FBaEIsRUFBMkIsMkJBQTNCO0FBQ0EsT0FBS0YsSUFBTCxDQUFVRSxLQUFWLENBQWdCLFVBQWhCLEVBQTRCLDRCQUE1QjtBQUNBLE9BQUtGLElBQUwsQ0FBVUUsS0FBVixDQUFnQixPQUFoQixFQUF5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QWI7QUFNQSxPQUFJLElBQUlRLElBQUksQ0FBWixFQUFlQSxJQUFJSyxPQUFPRSxNQUExQixFQUFrQ1AsR0FBbEMsRUFBdUM7QUFDdEMsSUFBQyxNQUFNO0FBQ04sUUFBSVEsT0FBT1IsSUFBRSxDQUFGLEdBQU1LLE9BQU9FLE1BQVAsR0FBYyxDQUFwQixHQUF3QixDQUF4QixHQUE0QlAsSUFBRSxDQUF6QztBQUNBSyxXQUFPTCxDQUFQLEVBQVVTLE1BQVYsQ0FBaUJILEdBQWpCLENBQXFCLE1BQU1ELE9BQU9HLElBQVAsRUFBYUUsSUFBYixFQUEzQjtBQUNBLElBSEQ7QUFJQTtBQUNETCxTQUFPLENBQVAsRUFBVUssSUFBVjtBQUNBLE9BQUt0QixJQUFMLENBQVVpQixNQUFWLEdBQW1CQSxNQUFuQjs7QUFFQSxPQUFLakIsSUFBTCxDQUFVdUIsWUFBVixHQUF5QixDQUF6QjtBQUNBLE9BQUtDLEtBQUwsQ0FBV0MsS0FBWCxDQUFpQixNQUFqQjtBQUNBO0FBN0RZOztBQWdFZEMsT0FBT0MsT0FBUCxHQUFpQjdCLE9BQWpCIiwiZmlsZSI6IlByZWxvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBQcmVsb2FkIHtcclxuXHRpbml0KCkge1xyXG5cdFx0dGhpcy5nYW1lLnRvdGFsTGV2ZWxzID0gMjtcclxuXHR9XHJcblx0cHJlbG9hZCgpIHtcclxuXHRcdHRoaXMubG9hZC5hdWRpbygnbXVzaWMxJywgJy4uL2Fzc2V0cy9tdXNpYy90aGVtZS0xLm9nZycpO1xyXG5cdFx0dGhpcy5sb2FkLmF1ZGlvKCdtdXNpYzInLCAnLi4vYXNzZXRzL211c2ljL3RoZW1lLTIub2dnJyk7XHJcblx0XHR0aGlzLmxvYWQuYXVkaW8oJ211c2ljMycsICcuLi9hc3NldHMvbXVzaWMvdGhlbWUtMy5vZ2cnKTtcclxuXHRcdHRoaXMubG9hZC5hdWRpbygnbXVzaWM0JywgJy4uL2Fzc2V0cy9tdXNpYy90aGVtZS00LndhdicpO1xyXG5cclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnYmcnLCAnLi4vYXNzZXRzL2JnLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCd0aWxlbWFwJywgJy4uL2Fzc2V0cy9sZXZlbHMvdGlsZW1hcC5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnbGlmZWJveCcsICcuLi9hc3NldHMvaHVkL2xpZmVib3gucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2xpZmVyZWN0JywgJy4uL2Fzc2V0cy9odWQvbGlmZXJlY3QucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ3Njb3JlJywgJy4uL2Fzc2V0cy9odWQvc2NvcmUucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ3dpbmRvdycsICcuLi9hc3NldHMvd2luZG93LnBuZycpO1xyXG5cclxuXHRcdHRoaXMubG9hZC5zcHJpdGVzaGVldCgnZnhfanVtcCcsICcuLi9hc3NldHMvRlgvanVtcC5wbmcnLCA0NywgNDUsIDYpO1xyXG5cdFx0dGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdmeF9maXJlJywgJy4uL2Fzc2V0cy9GWC9maXJlLnBuZycsIDMyLCAzMywgNik7XHJcblx0XHR0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2Z4X2V4cGxvc2lvbicsICcuLi9hc3NldHMvRlgvZXhwbG9zaW9uLnBuZycsIDM1LCAzNiwgNyk7XHJcblx0XHR0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2Z4X2hpdCcsICcuLi9hc3NldHMvRlgvaGl0LnBuZycsIDE2LCAxNiwgNik7XHJcblx0XHR0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2Z4X2NvbGxpZGUnLCAnLi4vYXNzZXRzL0ZYL2NvbGxpZGUucG5nJywgMzcsIDM3LCA2KTtcclxuXHRcdHRoaXMubG9hZC5zcHJpdGVzaGVldCgnZnhfdm9pY2UnLCAnLi4vYXNzZXRzL2h1ZC92b2ljZS5wbmcnLCAyMCwgMjAsIDcpO1xyXG5cclxuXHRcdHRoaXMubG9hZC5zcHJpdGVzaGVldCgnbGVncycsICcuLi9hc3NldHMvbGVncy5wbmcnLCAxNSwgMTcsIDQpO1xyXG5cclxuXHRcdHRoaXMubG9hZC5iaXRtYXBGb250KCdmb250JywgJy4uL2Fzc2V0cy9mb250LnBuZycsICcuLi9hc3NldHMvZm9udC54bWwnKTtcclxuXHRcdHRoaXMubG9hZC5iaXRtYXBGb250KCdmb250MicsICcuLi9hc3NldHMvZm9udDIucG5nJywgJy4uL2Fzc2V0cy9mb250Mi54bWwnKTtcclxuXHJcblx0XHR0aGlzLmxvYWQuYXRsYXMoJ2hlYWRzJywgJ2Fzc2V0cy9hdGxhc2VzL2hlYWRzLnBuZycsICdhc3NldHMvYXRsYXNlcy9oZWFkcy5qc29uJywgUGhhc2VyLkxvYWRlci5URVhUVVJFX0FUTEFTX0pTT05fSEFTSCk7XHJcblx0XHR0aGlzLmxvYWQuYXRsYXMoJ2JvZGllcycsICdhc3NldHMvYXRsYXNlcy9ib2RpZXMucG5nJywgJ2Fzc2V0cy9hdGxhc2VzL2JvZGllcy5qc29uJywgUGhhc2VyLkxvYWRlci5URVhUVVJFX0FUTEFTX0pTT05fSEFTSCk7XHJcblx0XHR0aGlzLmxvYWQuYXRsYXMoJ2F0dGFjaFRvQm9keScsICdhc3NldHMvYXRsYXNlcy9hdHRhY2hUb0JvZHkucG5nJywgJ2Fzc2V0cy9hdGxhc2VzL2F0dGFjaFRvQm9keS5qc29uJywgUGhhc2VyLkxvYWRlci5URVhUVVJFX0FUTEFTX0pTT05fSEFTSCk7XHJcblx0XHR0aGlzLmxvYWQuYXRsYXMoJ3dlYXBvbnMnLCAnYXNzZXRzL2F0bGFzZXMvd2VhcG9ucy5wbmcnLCAnYXNzZXRzL2F0bGFzZXMvd2VhcG9ucy5qc29uJywgUGhhc2VyLkxvYWRlci5URVhUVVJFX0FUTEFTX0pTT05fSEFTSCk7XHJcblx0XHR0aGlzLmxvYWQuYXRsYXMoJ2l0ZW1zJywgJ2Fzc2V0cy9hdGxhc2VzL2l0ZW1zLnBuZycsICdhc3NldHMvYXRsYXNlcy9pdGVtcy5qc29uJywgUGhhc2VyLkxvYWRlci5URVhUVVJFX0FUTEFTX0pTT05fSEFTSCk7XHJcblx0XHR0aGlzLmxvYWQuYXRsYXMoJ2J1bGxldHMnLCAnYXNzZXRzL2F0bGFzZXMvYnVsbGV0cy5wbmcnLCAnYXNzZXRzL2F0bGFzZXMvYnVsbGV0cy5qc29uJywgUGhhc2VyLkxvYWRlci5URVhUVVJFX0FUTEFTX0pTT05fSEFTSCk7XHJcblxyXG5cdFx0Ly8gbG9hZCBsZXZlbHNcclxuXHRcdGxldCBpID0gMTtcclxuXHRcdGZvcig7IGkgPD0gdGhpcy5nYW1lLnRvdGFsTGV2ZWxzOyBpKyspIHtcclxuXHRcdFx0dGhpcy5sb2FkLnRpbGVtYXAoJ2xldmVsJyArIGksICcuLi9hc3NldHMvbGV2ZWxzL3Rlc3QvbGV2ZWwnICsgaSArICcuanNvbicsIG51bGwsIFBoYXNlci5UaWxlbWFwLlRJTEVEX0pTT04pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y3JlYXRlKCkge1xyXG5cdFx0bGV0IG11c2ljcyA9IFtcclxuXHRcdFx0dGhpcy5hZGQuYXVkaW8oJ211c2ljMScpLFxyXG5cdFx0XHR0aGlzLmFkZC5hdWRpbygnbXVzaWMyJyksXHJcblx0XHRcdHRoaXMuYWRkLmF1ZGlvKCdtdXNpYzMnKSxcclxuXHRcdFx0dGhpcy5hZGQuYXVkaW8oJ211c2ljNCcpXHJcblx0XHRdO1xyXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IG11c2ljcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHQoKCkgPT4ge1xyXG5cdFx0XHRcdGxldCBuZXh0ID0gaSsxID4gbXVzaWNzLmxlbmd0aC0xID8gMCA6IGkrMTtcclxuXHRcdFx0XHRtdXNpY3NbaV0ub25TdG9wLmFkZCgoKSA9PiBtdXNpY3NbbmV4dF0ucGxheSgpKTtcclxuXHRcdFx0fSkoKTtcclxuXHRcdH1cclxuXHRcdG11c2ljc1swXS5wbGF5KCk7XHJcblx0XHR0aGlzLmdhbWUubXVzaWNzID0gbXVzaWNzO1xyXG5cclxuXHRcdHRoaXMuZ2FtZS5jdXJyZW50TGV2ZWwgPSAxO1xyXG5cdFx0dGhpcy5zdGF0ZS5zdGFydCgnTWVudScpO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQcmVsb2FkOyJdfQ==
},{}],14:[function(require,module,exports){
class Settings {
	create() {
		this.world.setBounds(0, 0, 480, 320);
		this.bg = this.game.add.tileSprite(0, 0, this.world.width, this.world.height, 'bg');

		this.label = this.add.bitmapText(this.world.centerX, 50, 'font', 'SETTINGS', 30);
		this.label.anchor.set(0.5);
		this.label.smoothed = false;
	}
	update() {
		this.bg.tilePosition.x += 1;
		this.bg.tilePosition.y += 1;
	}
}

module.exports = Settings;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNldHRpbmdzLmpzIl0sIm5hbWVzIjpbIlNldHRpbmdzIiwiY3JlYXRlIiwid29ybGQiLCJzZXRCb3VuZHMiLCJiZyIsImdhbWUiLCJhZGQiLCJ0aWxlU3ByaXRlIiwid2lkdGgiLCJoZWlnaHQiLCJsYWJlbCIsImJpdG1hcFRleHQiLCJjZW50ZXJYIiwiYW5jaG9yIiwic2V0Iiwic21vb3RoZWQiLCJ1cGRhdGUiLCJ0aWxlUG9zaXRpb24iLCJ4IiwieSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBLE1BQU1BLFFBQU4sQ0FBZTtBQUNkQyxVQUFTO0FBQ1IsT0FBS0MsS0FBTCxDQUFXQyxTQUFYLENBQXFCLENBQXJCLEVBQXdCLENBQXhCLEVBQTJCLEdBQTNCLEVBQWdDLEdBQWhDO0FBQ0EsT0FBS0MsRUFBTCxHQUFVLEtBQUtDLElBQUwsQ0FBVUMsR0FBVixDQUFjQyxVQUFkLENBQXlCLENBQXpCLEVBQTRCLENBQTVCLEVBQStCLEtBQUtMLEtBQUwsQ0FBV00sS0FBMUMsRUFBaUQsS0FBS04sS0FBTCxDQUFXTyxNQUE1RCxFQUFvRSxJQUFwRSxDQUFWOztBQUVBLE9BQUtDLEtBQUwsR0FBYSxLQUFLSixHQUFMLENBQVNLLFVBQVQsQ0FBb0IsS0FBS1QsS0FBTCxDQUFXVSxPQUEvQixFQUF3QyxFQUF4QyxFQUE0QyxNQUE1QyxFQUFvRCxVQUFwRCxFQUFnRSxFQUFoRSxDQUFiO0FBQ0EsT0FBS0YsS0FBTCxDQUFXRyxNQUFYLENBQWtCQyxHQUFsQixDQUFzQixHQUF0QjtBQUNBLE9BQUtKLEtBQUwsQ0FBV0ssUUFBWCxHQUFzQixLQUF0QjtBQUNBO0FBQ0RDLFVBQVM7QUFDUixPQUFLWixFQUFMLENBQVFhLFlBQVIsQ0FBcUJDLENBQXJCLElBQTBCLENBQTFCO0FBQ0EsT0FBS2QsRUFBTCxDQUFRYSxZQUFSLENBQXFCRSxDQUFyQixJQUEwQixDQUExQjtBQUNBO0FBWmE7O0FBZWZDLE9BQU9DLE9BQVAsR0FBaUJyQixRQUFqQiIsImZpbGUiOiJTZXR0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNldHRpbmdzIHtcclxuXHRjcmVhdGUoKSB7XHJcblx0XHR0aGlzLndvcmxkLnNldEJvdW5kcygwLCAwLCA0ODAsIDMyMCk7XHJcblx0XHR0aGlzLmJnID0gdGhpcy5nYW1lLmFkZC50aWxlU3ByaXRlKDAsIDAsIHRoaXMud29ybGQud2lkdGgsIHRoaXMud29ybGQuaGVpZ2h0LCAnYmcnKTtcclxuXHJcblx0XHR0aGlzLmxhYmVsID0gdGhpcy5hZGQuYml0bWFwVGV4dCh0aGlzLndvcmxkLmNlbnRlclgsIDUwLCAnZm9udCcsICdTRVRUSU5HUycsIDMwKTtcclxuXHRcdHRoaXMubGFiZWwuYW5jaG9yLnNldCgwLjUpO1xyXG5cdFx0dGhpcy5sYWJlbC5zbW9vdGhlZCA9IGZhbHNlO1xyXG5cdH1cclxuXHR1cGRhdGUoKSB7XHJcblx0XHR0aGlzLmJnLnRpbGVQb3NpdGlvbi54ICs9IDE7XHJcblx0XHR0aGlzLmJnLnRpbGVQb3NpdGlvbi55ICs9IDE7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNldHRpbmdzOyJdfQ==
},{}]},{},[8])