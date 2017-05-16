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

		this.tweenBreathe = this.level.add.tween(this.sprite.scale).to({ x: 1.1, y: 1.1 }, 600).to({ x: 1, y: 1 }, 500).loop();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVudGl0eS5qcyJdLCJuYW1lcyI6WyJXZWFwb24iLCJyZXF1aXJlIiwiZW50aXRpZXMiLCJFbnRpdHkiLCJjb25zdHJ1Y3RvciIsImxldmVsIiwieCIsInkiLCJ0eXBlIiwiX2VudGl0eSIsImhwIiwianVtcGluZyIsImp1bXAiLCJzcGVlZCIsInJhZGl1c1Zpc2liaWxpdHkiLCJpc0p1bXBpbmciLCJpc0RlYWQiLCJoZWFkSWQiLCJoZWFkIiwiYm9keUlkIiwiYm9keSIsImF0dGFjaFRvQm9keUlkIiwiYXR0YWNoVG9Cb2R5Iiwid2VhcG9uSWQiLCJ3ZWFwb24iLCJfY3JlYXRlUGhhc2VyT2JqZWN0cyIsImZ4SnVtcCIsImFkZCIsInNwcml0ZSIsImFscGhhIiwic2NhbGUiLCJzZXQiLCJhbmNob3IiLCJzbW9vdGhlZCIsImFuaW1hdGlvbnMiLCJjbGFzcyIsIm1ha2UiLCJhZGRDaGlsZCIsInBoeXNpY3MiLCJhcmNhZGUiLCJlbmFibGUiLCJkcmFnIiwibWF4VmVsb2NpdHkiLCJzeW5jQm91bmRzIiwidHdlZW5CcmVhdGhlIiwidHdlZW4iLCJ0byIsImxvb3AiLCJzdGFydCIsIl91cGRhdGUiLCJjb2xsaWRlIiwiZmlyc3RMYXllck1hcCIsInVwZGF0ZSIsImJ1bGxldHMiLCJjaGlsZHJlbiIsImkiLCJsZW5ndGgiLCJuYW1lIiwidHlwZU93bmVyIiwib3ZlcmxhcCIsInBlcnNvbiIsImJ1bGxldCIsInZlbG9jaXR5IiwiTWF0aCIsImNvcyIsInJvdGF0aW9uIiwic2luIiwib25Xb3VuZGVkIiwia2lsbCIsImRlYWRBcmVhcyIsInJlY3QiLCJwbCIsIlBoYXNlciIsIlJlY3RhbmdsZSIsIndpZHRoIiwiaGVpZ2h0IiwiaW50ZXJzZWN0cyIsImFjY2VsZXJhdGlvbiIsImZhbGxEZWFkIiwidXBkYXRlVHJhY2siLCJwb3dlciIsInBhdXNlIiwidHdlZW5KdW1wIiwiRWFzaW5nIiwiUXVhZHJhdGljIiwiT3V0IiwiUXVpbnRpYyIsIkluIiwib25Db21wbGV0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ckRDLE1BQUc7QUFGa0QsR0FBM0MsRUFHUixHQUhRLEVBR0hpRSxPQUFPVyxNQUFQLENBQWNDLFNBQWQsQ0FBd0JHLEVBSHJCLEVBR3lCLElBSHpCLENBQVg7QUFJQUcsT0FBS0YsVUFBTCxDQUFnQjdELEdBQWhCLENBQW9CLE1BQU07QUFDekIsUUFBS2dFLE1BQUwsSUFBZSxLQUFLQSxNQUFMLEVBQWY7QUFDQSxHQUZEO0FBR0E7QUE1SVc7O0FBK0liQyxPQUFPQyxPQUFQLEdBQWlCMUYsTUFBakIiLCJmaWxlIjoiRW50aXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgV2VhcG9uID0gcmVxdWlyZSgnLi9XZWFwb24uanMnKTtcclxuY29uc3QgZW50aXRpZXMgPSByZXF1aXJlKCcuL2VudGl0aWVzLmpzb24nKTtcclxuXHJcbmNsYXNzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IobGV2ZWwsIHgsIHksIHR5cGUpIHtcclxuXHRcdHRoaXMudHlwZSA9IHR5cGU7XHJcblx0XHR0aGlzLmxldmVsID0gbGV2ZWw7XHJcblxyXG5cdFx0dGhpcy54ID0geCAhPSBudWxsID8geCA6IDA7XHJcblx0XHR0aGlzLnkgPSB5ICE9IG51bGwgPyB5IDogMDtcclxuXHJcblx0XHR0aGlzLl9lbnRpdHkgPSBlbnRpdGllc1t0eXBlXTtcclxuXHJcblx0XHR0aGlzLmhwID0gdGhpcy5fZW50aXR5LmhwICE9IG51bGwgPyB0aGlzLl9lbnRpdHkuaHAgOiAxMDtcclxuXHRcdHRoaXMuanVtcGluZyA9IHRoaXMuX2VudGl0eS5qdW1wICE9IG51bGwgPyB0aGlzLl9lbnRpdHkuanVtcCA6IDI7XHJcblx0XHR0aGlzLnNwZWVkID0gdGhpcy5fZW50aXR5LnNwZWVkICE9IG51bGwgPyB0aGlzLl9lbnRpdHkuc3BlZWQgOiAxMDA7XHJcblx0XHR0aGlzLnJhZGl1c1Zpc2liaWxpdHkgPSB0aGlzLl9lbnRpdHkucmFkaXVzVmlzaWJpbGl0eSAhPSBudWxsID8gdGhpcy5fZW50aXR5LnJhZGl1c1Zpc2liaWxpdHkgOiAxMDA7XHJcblx0XHR0aGlzLmlzSnVtcGluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuXHJcblx0XHR0aGlzLmhlYWRJZCA9IHRoaXMuX2VudGl0eS5oZWFkICE9IG51bGwgPyB0aGlzLl9lbnRpdHkuaGVhZCA6IDA7XHJcblx0XHR0aGlzLmJvZHlJZCA9IHRoaXMuX2VudGl0eS5ib2R5ICE9IG51bGwgPyB0aGlzLl9lbnRpdHkuYm9keSA6IDA7XHJcblx0XHR0aGlzLmF0dGFjaFRvQm9keUlkID0gdGhpcy5fZW50aXR5LmF0dGFjaFRvQm9keSAhPSBudWxsID8gdGhpcy5fZW50aXR5LmF0dGFjaFRvQm9keSA6IDA7XHJcblx0XHR0aGlzLndlYXBvbklkID0gdGhpcy5fZW50aXR5LndlYXBvbiAhPSBudWxsID8gdGhpcy5fZW50aXR5LndlYXBvbiA6ICdibGFzdGVyJztcclxuXHJcblx0XHR0aGlzLl9jcmVhdGVQaGFzZXJPYmplY3RzKCk7XHJcblx0fVxyXG5cclxuXHRfY3JlYXRlUGhhc2VyT2JqZWN0cygpIHtcclxuXHRcdHRoaXMuZnhKdW1wID0gdGhpcy5sZXZlbC5hZGQuc3ByaXRlKHRoaXMueCwgdGhpcy55LCAnZnhfanVtcCcsIDApO1xyXG5cdFx0dGhpcy5meEp1bXAuYWxwaGEgPSAwO1xyXG5cdFx0dGhpcy5meEp1bXAuc2NhbGUuc2V0KDIpO1xyXG5cdFx0dGhpcy5meEp1bXAuYW5jaG9yLnNldCgwLjUpO1xyXG5cdFx0dGhpcy5meEp1bXAuc21vb3RoZWQgPSBmYWxzZTtcclxuXHRcdHRoaXMuZnhKdW1wLmFuaW1hdGlvbnMuYWRkKCdhY3RpdmUnKTtcclxuXHJcblx0XHQvLyB0aGlzLmxlZ3MgPSB0aGlzLmxldmVsLmFkZC5zcHJpdGUodGhpcy54LCB0aGlzLnksICdsZWdzJywgMCk7XHJcblx0XHQvLyB0aGlzLmxlZ3MuYW5jaG9yLnNldCgwLjUpO1xyXG5cdFx0Ly8gdGhpcy5sZWdzLnNtb290aGVkID0gZmFsc2U7XHJcblx0XHQvLyB0aGlzLmxlZ3MuYW5pbWF0aW9ucy5hZGQoJ3dhbGsnKTtcclxuXHJcblx0XHR0aGlzLnNwcml0ZSA9IHRoaXMubGV2ZWwuYWRkLnNwcml0ZSh0aGlzLngsIHRoaXMueSwgJ2JvZGllcycsIHRoaXMuYm9keUlkKTtcclxuXHRcdHRoaXMuc3ByaXRlLmFuY2hvci5zZXQoMC41KTtcclxuXHRcdHRoaXMuc3ByaXRlLnNtb290aGVkID0gZmFsc2U7XHJcblx0XHR0aGlzLnNwcml0ZS5jbGFzcyA9IHRoaXM7XHJcblxyXG5cdFx0dGhpcy5oZWFkID0gdGhpcy5sZXZlbC5tYWtlLnNwcml0ZSgtMTIsIC03LCAnaGVhZHMnLCB0aGlzLmhlYWRJZCk7XHJcblx0XHR0aGlzLmhlYWQuc21vb3RoZWQgPSBmYWxzZTtcclxuXHRcdHRoaXMuc3ByaXRlLmFkZENoaWxkKHRoaXMuaGVhZCk7XHJcblxyXG5cdFx0dGhpcy5hdHRhY2hUb0JvZHkgPSB0aGlzLmxldmVsLm1ha2Uuc3ByaXRlKDMuNSwgLTQsICdhdHRhY2hUb0JvZHknLCB0aGlzLmF0dGFjaFRvQm9keUlkKTtcclxuXHRcdHRoaXMuYXR0YWNoVG9Cb2R5LnNtb290aGVkID0gZmFsc2U7XHJcblx0XHR0aGlzLnNwcml0ZS5hZGRDaGlsZCh0aGlzLmF0dGFjaFRvQm9keSk7XHRcclxuXHJcblx0XHR0aGlzLndlYXBvbiA9IG5ldyBXZWFwb24odGhpcywgdGhpcy53ZWFwb25JZCk7XHJcblx0XHRcclxuXHRcdHRoaXMubGV2ZWwucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHRoaXMuc3ByaXRlKTtcclxuXHRcdHRoaXMuc3ByaXRlLmJvZHkuZHJhZy5zZXQoMTUwKTtcclxuXHRcdHRoaXMuc3ByaXRlLmJvZHkubWF4VmVsb2NpdHkuc2V0KDEwMCk7XHJcblx0XHR0aGlzLnNwcml0ZS5zeW5jQm91bmRzID0gdHJ1ZTtcclxuXHJcblx0XHR0aGlzLnR3ZWVuQnJlYXRoZSA9IHRoaXMubGV2ZWwuYWRkLnR3ZWVuKHRoaXMuc3ByaXRlLnNjYWxlKVxyXG5cdFx0XHQudG8oe3g6MS4xLCB5OiAxLjF9LCA2MDApXHJcblx0XHRcdC50byh7eDogMSwgeTogMX0sIDUwMClcclxuXHRcdFx0Lmxvb3AoKTtcclxuXHRcdHRoaXMudHdlZW5CcmVhdGhlLnN0YXJ0KCk7XHJcblx0fVxyXG5cclxuXHRfdXBkYXRlKCkge1xyXG5cdFx0aWYodGhpcy5pc0RlYWQpIHJldHVybjtcclxuXHJcblx0XHQvLyBjb2xsaWRpbmcgd2l0aCBzb2xpZCB0aWxlc1xyXG5cdFx0dGhpcy5sZXZlbC5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHRoaXMuc3ByaXRlLCB0aGlzLmxldmVsLmZpcnN0TGF5ZXJNYXApO1xyXG5cclxuXHRcdC8vIHVwZGF0ZSB3ZWFwb24gY29sbGlzaW9uc1xyXG5cdFx0dGhpcy53ZWFwb24udXBkYXRlKCk7XHJcblxyXG5cdFx0Ly8gY29sbGlzaW9uIHBlcnNvbiB3aXRoIGJ1bGxldHNcclxuXHRcdGxldCBidWxsZXRzID0gdGhpcy5sZXZlbC5idWxsZXRzLmNoaWxkcmVuO1xyXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IGJ1bGxldHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYodGhpcy5jb25zdHJ1Y3Rvci5uYW1lID09PSBidWxsZXRzW2ldLnR5cGVPd25lcikgY29udGludWU7XHJcblxyXG5cdFx0XHR0aGlzLmxldmVsLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAoYnVsbGV0c1tpXSwgdGhpcy5zcHJpdGUsIChwZXJzb24sIGJ1bGxldCkgPT4ge1xyXG5cdFx0XHRcdGlmKCF0aGlzLmlzSnVtcGluZyAmJiBidWxsZXQuc2NhbGUueCA8IDEpIHtcclxuXHRcdFx0XHRcdHRoaXMuc3ByaXRlLmJvZHkudmVsb2NpdHkueCArPSBNYXRoLmNvcyh0aGlzLnNwcml0ZS5yb3RhdGlvbikgKiAxMDtcclxuXHRcdFx0XHRcdHRoaXMuc3ByaXRlLmJvZHkudmVsb2NpdHkueSArPSBNYXRoLnNpbih0aGlzLnNwcml0ZS5yb3RhdGlvbikgKiAxMDtcclxuXHRcdFx0XHRcdHRoaXMub25Xb3VuZGVkICYmIHRoaXMub25Xb3VuZGVkKCk7XHJcblx0XHRcdFx0XHRidWxsZXQua2lsbCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY29sbGlkaW5nIHdpdGggZW1wdHkgbWFwIChkZWFkKVxyXG5cdFx0aWYoIXRoaXMuaXNKdW1waW5nKSB7XHJcblx0XHRcdGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmxldmVsLmRlYWRBcmVhcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGxldCByZWN0ID0gdGhpcy5sZXZlbC5kZWFkQXJlYXNbaV07XHJcblxyXG5cdFx0XHRcdGxldCBwbCA9IG5ldyBQaGFzZXIuUmVjdGFuZ2xlKHRoaXMuc3ByaXRlLmJvZHkueCwgdGhpcy5zcHJpdGUuYm9keS55LCB0aGlzLnNwcml0ZS5ib2R5LndpZHRoLCB0aGlzLnNwcml0ZS5ib2R5LmhlaWdodCk7XHJcblx0XHRcdFx0aWYoUGhhc2VyLlJlY3RhbmdsZS5pbnRlcnNlY3RzKHJlY3QsIHBsKSkge1xyXG5cdFx0XHRcdFx0dGhpcy5zcHJpdGUuYm9keS5hY2NlbGVyYXRpb24uc2V0KDApO1xyXG5cdFx0XHRcdFx0dGhpcy5mYWxsRGVhZCgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHVwZGF0aW5nIHRyYWNraW5nIHdlYXBvbiB3aXRoIHNwcml0ZSBkdXJpbmcganVtcGluZ1xyXG5cdFx0aWYodGhpcy5pc0p1bXBpbmcpIHRoaXMud2VhcG9uLnVwZGF0ZVRyYWNrKCk7XHJcblxyXG5cdFx0Ly8gZXh0ZW5kcyB1cGRhdGUhXHJcblx0XHR0aGlzLnVwZGF0ZSAmJiB0aGlzLnVwZGF0ZSgpO1xyXG5cdH1cclxuXHJcblx0anVtcChwb3dlcj10aGlzLmp1bXBpbmcpIHtcclxuXHRcdHRoaXMuaXNKdW1waW5nID0gdHJ1ZTtcclxuXHRcdHRoaXMudHdlZW5CcmVhdGhlLnBhdXNlKCk7XHJcblxyXG5cdFx0dGhpcy50d2Vlbkp1bXAgPSB0aGlzLmxldmVsLmFkZC50d2Vlbih0aGlzLnNwcml0ZS5zY2FsZSlcclxuXHRcdFx0LnRvKHt4OiBwb3dlciwgeTogcG93ZXJ9LCAzMDAsIFBoYXNlci5FYXNpbmcuUXVhZHJhdGljLk91dClcclxuXHRcdFx0LnRvKHt4OiAxLCB5OiAxfSwgMzAwLCBQaGFzZXIuRWFzaW5nLlF1aW50aWMuSW4pXHJcblx0XHRcdC5zdGFydCgpO1xyXG5cdFx0dGhpcy50d2Vlbkp1bXAub25Db21wbGV0ZS5hZGQoKCkgPT4ge1xyXG5cdFx0XHR0aGlzLmlzSnVtcGluZyA9IGZhbHNlO1xyXG5cdFx0XHR0aGlzLnR3ZWVuQnJlYXRoZS5yZXN1bWUoKTtcclxuXHRcdFx0dGhpcy53ZWFwb24udXBkYXRlVHJhY2soKTtcclxuXHRcdH0sIHRoaXMpO1xyXG5cdH1cclxuXHJcblx0ZGVhZCgpIHtcclxuXHRcdHRoaXMuc3ByaXRlLmtpbGwoKTtcclxuXHRcdHRoaXMuaXNEZWFkID0gdHJ1ZTtcclxuXHRcdHRoaXMub25EZWFkICYmIHRoaXMub25EZWFkKCk7XHJcblx0fVxyXG5cclxuXHRmYWxsRGVhZCgpIHtcclxuXHRcdHRoaXMuaXNEZWFkID0gdHJ1ZTtcclxuXHRcdGxldCBkZWFkID0gdGhpcy5sZXZlbC5hZGQudHdlZW4odGhpcy5zcHJpdGUuc2NhbGUpLnRvKHtcclxuXHRcdFx0eDogMCwgXHJcblx0XHRcdHk6IDBcclxuXHRcdH0sIDMwMCwgUGhhc2VyLkVhc2luZy5RdWFkcmF0aWMuSW4sIHRydWUpO1xyXG5cdFx0ZGVhZC5vbkNvbXBsZXRlLmFkZCgoKSA9PiB7XHJcblx0XHRcdHRoaXMub25EZWFkICYmIHRoaXMub25EZWFkKCk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRW50aXR5OyJdfQ==
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

		this.buttonFire = this.level.add.sprite(435, 210, 'buttonFire');
		this.buttonFire.anchor.set(0.5);
		this.buttonFire.scale.set(2.5);
		this.buttonFire.smoothed = false;
		this.buttonFire.fixedToCamera = true;

		this.buttonJump = this.level.add.sprite(375, 230, 'buttonJump');
		this.buttonJump.anchor.set(0.5);
		this.buttonJump.scale.set(2);
		this.buttonJump.smoothed = false;
		this.buttonJump.fixedToCamera = true;
	}

	update() {
		// Items use
		this.level.physics.arcade.overlap(this.sprite, this.level.items, (sprite, item) => {
			if (item.isCollide) return;

			if (item.type == 'health') this.interface.setHP(this.interface.hp + 2);else if (item.type == 'coins') this.interface.setScores(this.interface.scores + 100);else if (item.type == 'cartridge') this.isCatridgeUse = true;

			item.tween && item.tween.stop();
			item.isCollide = true;
			this.level.add.tween(item.scale).to({ x: 0, y: 0 }, 600, Phaser.Easing.Bounce.In).start().onComplete.add(() => item.kill);
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

		let rad = Phaser.Math.degToRad(Phaser.Math.radToDeg(this.level.vjoy.rotation));
		if (this.level.vjoy.isDown) {
			this.level.physics.arcade.velocityFromRotation(rad, 100, this.sprite.body.velocity);
			this.sprite.rotation = rad;
		} else this.sprite.body.velocity.set(0);

		if (this.buttonFire.isDown && this.interface.scores) this.weapon.fire() && this.interface.setScores(this.interface.scores - 10);

		if (this.buttonJump.isDown && !this.isJumping) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXllci5qcyJdLCJuYW1lcyI6WyJFbnRpdHkiLCJyZXF1aXJlIiwiTGV2ZWxJbnRlcmZhY2UiLCJQbGF5ZXIiLCJjb25zdHJ1Y3RvciIsImxldmVsIiwieCIsInkiLCJjYW1lcmEiLCJmb2xsb3ciLCJzcHJpdGUiLCJQaGFzZXIiLCJDYW1lcmEiLCJGT0xMT1dfTE9DS09OIiwiaW50ZXJmYWNlIiwiaHAiLCJNYXRoIiwibWluIiwic2NvcmVzIiwiY3Vyc29ycyIsImlucHV0Iiwia2V5Ym9hcmQiLCJjcmVhdGVDdXJzb3JLZXlzIiwianVtcEJ1dHRvbiIsImFkZEtleSIsIktleWJvYXJkIiwiU1BBQ0VCQVIiLCJmaXJlQnV0dG9uIiwiWiIsImJ1dHRvbkZpcmUiLCJhZGQiLCJhbmNob3IiLCJzZXQiLCJzY2FsZSIsInNtb290aGVkIiwiZml4ZWRUb0NhbWVyYSIsImJ1dHRvbkp1bXAiLCJ1cGRhdGUiLCJwaHlzaWNzIiwiYXJjYWRlIiwib3ZlcmxhcCIsIml0ZW1zIiwiaXRlbSIsImlzQ29sbGlkZSIsInR5cGUiLCJzZXRIUCIsInNldFNjb3JlcyIsImlzQ2F0cmlkZ2VVc2UiLCJ0d2VlbiIsInN0b3AiLCJ0byIsIkVhc2luZyIsIkJvdW5jZSIsIkluIiwic3RhcnQiLCJvbkNvbXBsZXRlIiwia2lsbCIsInBsIiwiUmVjdGFuZ2xlIiwiYm9keSIsIndpZHRoIiwiaGVpZ2h0IiwiaW50ZXJzZWN0cyIsIm5leHRMZXZlbEFyZWEiLCJuZXh0TGV2ZWwiLCJpIiwidGV4dEFyZWFzIiwibGVuZ3RoIiwicmVjdCIsInNob3dUZXh0V2luZG93Iiwic3BsaWNlIiwicmFkIiwiZGVnVG9SYWQiLCJyYWRUb0RlZyIsInZqb3kiLCJyb3RhdGlvbiIsImlzRG93biIsInZlbG9jaXR5RnJvbVJvdGF0aW9uIiwidmVsb2NpdHkiLCJ3ZWFwb24iLCJmaXJlIiwiaXNKdW1waW5nIiwiZnhKdW1wIiwicGxheSIsImFscGhhIiwianVtcCIsImp1bXBpbmciLCJvbldvdW5kZWQi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QUFDLEtBQUtLLFNBQW5DLEVBQThDO0FBQzdDLFFBQUtDLE1BQUwsQ0FBWUMsSUFBWixDQUFpQixRQUFqQixFQUEyQixFQUEzQjtBQUNBLFFBQUtELE1BQUwsQ0FBWUUsS0FBWixHQUFvQixDQUFwQjtBQUNBLFFBQUtGLE1BQUwsQ0FBWTVFLENBQVosR0FBZ0IsS0FBS0ksTUFBTCxDQUFZaUQsSUFBWixDQUFpQnJELENBQWpCLEdBQW1CLENBQW5DO0FBQ0EsUUFBSzRFLE1BQUwsQ0FBWTNFLENBQVosR0FBZ0IsS0FBS0csTUFBTCxDQUFZaUQsSUFBWixDQUFpQnBELENBQWpCLEdBQW1CLENBQW5DO0FBQ0EsUUFBS0YsS0FBTCxDQUFXeUIsR0FBWCxDQUFla0IsS0FBZixDQUFxQixLQUFLa0MsTUFBMUIsRUFBa0NoQyxFQUFsQyxDQUFxQyxFQUFDa0MsT0FBTyxDQUFSLEVBQXJDLEVBQWlELEdBQWpELEVBQXNEOUIsS0FBdEQ7QUFDQSxRQUFLK0IsSUFBTCxDQUFVLEtBQUtDLE9BQWY7QUFDQTtBQUNEOztBQUVEQyxhQUFZO0FBQ1gsT0FBS3pFLFNBQUwsQ0FBZStCLEtBQWYsQ0FBcUIsS0FBSy9CLFNBQUwsQ0FBZUMsRUFBZixHQUFrQixDQUF2QztBQUNBLE9BQUtELFNBQUwsQ0FBZUMsRUFBZixLQUFzQixDQUF0QixJQUEyQixLQUFLeUUsTUFBTCxFQUEzQjtBQUNBOztBQUVEQSxVQUFTO0FBQ1IsT0FBS25GLEtBQUwsQ0FBV29GLEtBQVgsQ0FBaUJDLE9BQWpCO0FBQ0E7QUExRjBCOztBQTZGNUJDLE9BQU9DLE9BQVAsR0FBaUJ6RixNQUFqQiIsImZpbGUiOiJQbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBFbnRpdHkgPSByZXF1aXJlKCcuL0VudGl0eS5qcycpO1xyXG5jb25zdCBMZXZlbEludGVyZmFjZSA9IHJlcXVpcmUoJy4vTGV2ZWxJbnRlcmZhY2UnKTtcclxuXHJcbmNsYXNzIFBsYXllciBleHRlbmRzIEVudGl0eSB7XHJcblx0Y29uc3RydWN0b3IobGV2ZWwsIHgsIHkpIHtcclxuXHRcdHN1cGVyKGxldmVsLCB4LCB5LCAncGxheWVyJyk7XHJcblxyXG5cdFx0dGhpcy5sZXZlbC5jYW1lcmEuZm9sbG93KHRoaXMuc3ByaXRlLCBQaGFzZXIuQ2FtZXJhLkZPTExPV19MT0NLT04gLCAwLjEsIDAuMSk7XHJcblxyXG5cdFx0dGhpcy5pbnRlcmZhY2UgPSBuZXcgTGV2ZWxJbnRlcmZhY2UodGhpcy5sZXZlbCwge2hwOiBNYXRoLm1pbig4LCB0aGlzLmhwKSwgc2NvcmVzOiAxMDB9KTtcclxuXHJcblx0XHR0aGlzLmN1cnNvcnMgPSB0aGlzLmxldmVsLmlucHV0LmtleWJvYXJkLmNyZWF0ZUN1cnNvcktleXMoKTtcclxuXHRcdHRoaXMuanVtcEJ1dHRvbiA9IHRoaXMubGV2ZWwuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5TUEFDRUJBUik7XHJcblx0XHR0aGlzLmZpcmVCdXR0b24gPSB0aGlzLmxldmVsLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuWik7XHJcblxyXG5cdFx0dGhpcy5idXR0b25GaXJlID0gdGhpcy5sZXZlbC5hZGQuc3ByaXRlKDQzNSwgMjEwLCAnYnV0dG9uRmlyZScpO1xyXG5cdFx0dGhpcy5idXR0b25GaXJlLmFuY2hvci5zZXQoMC41KTtcclxuXHRcdHRoaXMuYnV0dG9uRmlyZS5zY2FsZS5zZXQoMi41KTtcclxuXHRcdHRoaXMuYnV0dG9uRmlyZS5zbW9vdGhlZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5idXR0b25GaXJlLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG5cclxuXHRcdHRoaXMuYnV0dG9uSnVtcCA9IHRoaXMubGV2ZWwuYWRkLnNwcml0ZSgzNzUsIDIzMCwgJ2J1dHRvbkp1bXAnKTtcclxuXHRcdHRoaXMuYnV0dG9uSnVtcC5hbmNob3Iuc2V0KDAuNSk7XHJcblx0XHR0aGlzLmJ1dHRvbkp1bXAuc2NhbGUuc2V0KDIpO1xyXG5cdFx0dGhpcy5idXR0b25KdW1wLnNtb290aGVkID0gZmFsc2U7XHJcblx0XHR0aGlzLmJ1dHRvbkp1bXAuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoKSB7XHJcblx0XHQvLyBJdGVtcyB1c2VcclxuXHRcdHRoaXMubGV2ZWwucGh5c2ljcy5hcmNhZGUub3ZlcmxhcCh0aGlzLnNwcml0ZSwgdGhpcy5sZXZlbC5pdGVtcywgKHNwcml0ZSwgaXRlbSkgPT4ge1xyXG5cdFx0XHRpZihpdGVtLmlzQ29sbGlkZSkgcmV0dXJuO1xyXG5cclxuXHRcdFx0aWYoaXRlbS50eXBlID09ICdoZWFsdGgnKSB0aGlzLmludGVyZmFjZS5zZXRIUCh0aGlzLmludGVyZmFjZS5ocCsyKTtcclxuXHRcdFx0ZWxzZSBpZihpdGVtLnR5cGUgPT0gJ2NvaW5zJykgdGhpcy5pbnRlcmZhY2Uuc2V0U2NvcmVzKHRoaXMuaW50ZXJmYWNlLnNjb3JlcysxMDApO1xyXG5cdFx0XHRlbHNlIGlmKGl0ZW0udHlwZSA9PSAnY2FydHJpZGdlJykgdGhpcy5pc0NhdHJpZGdlVXNlID0gdHJ1ZTtcclxuXHJcblx0XHRcdGl0ZW0udHdlZW4gJiYgaXRlbS50d2Vlbi5zdG9wKCk7XHJcblx0XHRcdGl0ZW0uaXNDb2xsaWRlID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5sZXZlbC5hZGQudHdlZW4oaXRlbS5zY2FsZSlcclxuXHRcdFx0XHQudG8oe3g6IDAsIHk6IDB9LCA2MDAsIFBoYXNlci5FYXNpbmcuQm91bmNlLkluKVxyXG5cdFx0XHRcdC5zdGFydCgpXHJcblx0XHRcdFx0Lm9uQ29tcGxldGUuYWRkKCgpID0+IGl0ZW0ua2lsbCk7XHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0bGV0IHBsID0gbmV3IFBoYXNlci5SZWN0YW5nbGUodGhpcy5zcHJpdGUuYm9keS54LCB0aGlzLnNwcml0ZS5ib2R5LnksIHRoaXMuc3ByaXRlLmJvZHkud2lkdGgsIHRoaXMuc3ByaXRlLmJvZHkuaGVpZ2h0KTtcclxuXHRcdFxyXG5cdFx0aWYodGhpcy5pc0NhdHJpZGdlVXNlKSB7XHJcblx0XHRcdGlmKFBoYXNlci5SZWN0YW5nbGUuaW50ZXJzZWN0cyh0aGlzLmxldmVsLm5leHRMZXZlbEFyZWEsIHBsKSkge1xyXG5cdFx0XHRcdHRoaXMubGV2ZWwubmV4dExldmVsKCk7XHJcblx0XHRcdFx0dGhpcy5pc0NhdHJpZGdlVXNlID0gZmFsc2U7XHJcblxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2hvdyB0ZXh0IHdpbmRvd1xyXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IHRoaXMubGV2ZWwudGV4dEFyZWFzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCByZWN0ID0gdGhpcy5sZXZlbC50ZXh0QXJlYXNbaV07XHJcblx0XHRcdGlmKFBoYXNlci5SZWN0YW5nbGUuaW50ZXJzZWN0cyhyZWN0LCBwbCkpIHtcclxuXHRcdFx0XHR0aGlzLmludGVyZmFjZS5zaG93VGV4dFdpbmRvdyhyZWN0KTtcclxuXHRcdFx0XHR0aGlzLmxldmVsLnRleHRBcmVhcy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGxldCByYWQgPSBQaGFzZXIuTWF0aC5kZWdUb1JhZChQaGFzZXIuTWF0aC5yYWRUb0RlZyh0aGlzLmxldmVsLnZqb3kucm90YXRpb24pKTtcclxuXHRcdGlmKHRoaXMubGV2ZWwudmpveS5pc0Rvd24pIHtcclxuXHRcdFx0dGhpcy5sZXZlbC5waHlzaWNzLmFyY2FkZS52ZWxvY2l0eUZyb21Sb3RhdGlvbihyYWQsIDEwMCwgdGhpcy5zcHJpdGUuYm9keS52ZWxvY2l0eSk7XHJcblx0XHRcdHRoaXMuc3ByaXRlLnJvdGF0aW9uID0gcmFkO1xyXG5cdFx0fSBlbHNlIHRoaXMuc3ByaXRlLmJvZHkudmVsb2NpdHkuc2V0KDApO1xyXG5cclxuXHRcdGlmKHRoaXMuYnV0dG9uRmlyZS5pc0Rvd24gJiYgdGhpcy5pbnRlcmZhY2Uuc2NvcmVzKVxyXG5cdFx0XHR0aGlzLndlYXBvbi5maXJlKCkgJiYgdGhpcy5pbnRlcmZhY2Uuc2V0U2NvcmVzKHRoaXMuaW50ZXJmYWNlLnNjb3Jlcy0xMCk7XHJcblxyXG5cdFx0aWYodGhpcy5idXR0b25KdW1wLmlzRG93biAmJiAhdGhpcy5pc0p1bXBpbmcpIHtcclxuXHRcdFx0dGhpcy5meEp1bXAucGxheSgnYWN0aXZlJywgMjApO1xyXG5cdFx0XHR0aGlzLmZ4SnVtcC5hbHBoYSA9IDE7XHJcblx0XHRcdHRoaXMuZnhKdW1wLnggPSB0aGlzLnNwcml0ZS5ib2R5LngrNTtcclxuXHRcdFx0dGhpcy5meEp1bXAueSA9IHRoaXMuc3ByaXRlLmJvZHkueSs1O1xyXG5cdFx0XHR0aGlzLmxldmVsLmFkZC50d2Vlbih0aGlzLmZ4SnVtcCkudG8oe2FscGhhOiAwfSwgNjAwKS5zdGFydCgpO1xyXG5cdFx0XHR0aGlzLmp1bXAodGhpcy5qdW1waW5nKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG9uV291bmRlZCgpIHtcclxuXHRcdHRoaXMuaW50ZXJmYWNlLnNldEhQKHRoaXMuaW50ZXJmYWNlLmhwLTEpO1xyXG5cdFx0dGhpcy5pbnRlcmZhY2UuaHAgPT09IDAgJiYgdGhpcy5vbkRlYWQoKTtcclxuXHR9XHJcblxyXG5cdG9uRGVhZCgpIHtcclxuXHRcdHRoaXMubGV2ZWwuc3RhdGUucmVzdGFydCgpO1xyXG5cdH1cclxufVxyXG5cdFx0XHRcclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXI7Il19
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
		this.level.physics.arcade.collide(this.weapon.bullets, this.level.firstLayerMap, (bullet, tile) => {
			this.fxCollide.x = bullet.x;
			this.fxCollide.y = bullet.y;
			this.fxCollide.alpha = 1;
			this.fxCollide.play('active', 100);
			this.level.add.tween(this.fxCollide).to({ alpha: 0 }, 300).start();
			tile.tint = 0xFCFF00;

			bullet.kill();
		});
	}
}

module.exports = Weapon;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldlYXBvbi5qcyJdLCJuYW1lcyI6WyJ3ZWFwb25zIiwicmVxdWlyZSIsIldlYXBvbiIsImNvbnN0cnVjdG9yIiwicGVyc29uIiwidHlwZSIsImxldmVsIiwiX3dlYXBvbnMiLCJpZCIsInRyYWNrWCIsInRyYWNrWSIsInNwZWVkIiwiZGFtYWdlIiwiZGVsYXkiLCJxdWFudGl0eSIsIndlYXBvbiIsImFkZCIsImJ1bGxldHMiLCJzZXRCdWxsZXRGcmFtZXMiLCJidWxsZXRLaWxsVHlwZSIsIlBoYXNlciIsIktJTExfV09STERfQk9VTkRTIiwiYnVsbGV0U3BlZWQiLCJmaXJlUmF0ZSIsInR5cGVPd25lciIsIm5hbWUiLCJmeEZpcmUiLCJzcHJpdGUiLCJhbHBoYSIsInNjYWxlIiwic2V0IiwiYW5jaG9yIiwic21vb3RoZWQiLCJhbmltYXRpb25zIiwiZnhDb2xsaWRlIiwidXBkYXRlVHJhY2siLCJ4IiwieSIsInRyYWNrU3ByaXRlIiwiZmlyZSIsImJ1bGxldCIsInNldFRvIiwiYm9keSIsInVwZGF0ZUJvdW5kcyIsInZlbG9jaXR5IiwiTWF0aCIsImNvcyIsInJvdGF0aW9uIiwic2luIiwiX3JvdGF0ZWRQb2ludCIsInBsYXkiLCJ0d2VlbiIsInRvIiwic3RhcnQiLCJ1cGRhdGUiLCJwaHlzaWNzIiwiYXJjYWRlIiwiY29sbGlkZSIsImZpcnN0TGF5ZXJNYXAiLCJ0aWxlIiwidGludCIsImtpbGwiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQSxNQUFNQSxVQUFVQyxRQUFRLGdCQUFSLENBQWhCOztBQUVBLE1BQU1DLE1BQU4sQ0FBYTtBQUNaQyxhQUFZQyxNQUFaLEVBQW9CQyxJQUFwQixFQUEwQjtBQUN6QixPQUFLQyxLQUFMLEdBQWFGLE9BQU9FLEtBQXBCO0FBQ0EsT0FBS0YsTUFBTCxHQUFjQSxNQUFkOztBQUVBLE9BQUtHLFFBQUwsR0FBZ0JQLFFBQVFLLElBQVIsQ0FBaEI7QUFDQSxPQUFLRyxFQUFMLEdBQVUsS0FBS0QsUUFB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cUNrQixFQUFyQyxDQUF3QyxFQUFDeEIsT0FBTyxDQUFSLEVBQXhDLEVBQW9ELEdBQXBELEVBQXlEeUIsS0FBekQ7QUFDQU0sUUFBS0MsSUFBTCxHQUFZLFFBQVo7O0FBRUFwQixVQUFPcUIsSUFBUDtBQUNBLEdBVEQ7QUFVQTtBQTVFVzs7QUErRWJDLE9BQU9DLE9BQVAsR0FBaUI3RCxNQUFqQiIsImZpbGUiOiJXZWFwb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB3ZWFwb25zID0gcmVxdWlyZSgnLi93ZWFwb25zLmpzb24nKTtcclxuXHJcbmNsYXNzIFdlYXBvbiB7XHJcblx0Y29uc3RydWN0b3IocGVyc29uLCB0eXBlKSB7XHJcblx0XHR0aGlzLmxldmVsID0gcGVyc29uLmxldmVsO1xyXG5cdFx0dGhpcy5wZXJzb24gPSBwZXJzb247XHJcblxyXG5cdFx0dGhpcy5fd2VhcG9ucyA9IHdlYXBvbnNbdHlwZV07XHJcblx0XHR0aGlzLmlkID0gdGhpcy5fd2VhcG9ucy5pZCAhPSBudWxsID8gdGhpcy5fd2VhcG9ucy5pZCA6IDA7XHJcblx0XHR0aGlzLnRyYWNrWCA9IHRoaXMuX3dlYXBvbnMudHJhY2tYICE9IG51bGwgPyB0aGlzLl93ZWFwb25zLnRyYWNrWCA6IDE2O1xyXG5cdFx0dGhpcy50cmFja1kgPSB0aGlzLl93ZWFwb25zLnRyYWNrWSAhPSBudWxsID8gdGhpcy5fd2VhcG9ucy50cmFja1kgOiA0O1xyXG5cdFx0dGhpcy5zcGVlZCA9IHRoaXMuX3dlYXBvbnMuc3BlZWQgIT0gbnVsbCA/IHRoaXMuX3dlYXBvbnMuc3BlZWQgOiAxMDA7XHJcblx0XHR0aGlzLmRhbWFnZSA9IHRoaXMuX3dlYXBvbnMuZGFtYWdlICE9IG51bGwgPyB0aGlzLl93ZWFwb25zLmRhbWFnZSA6IDE7XHJcblx0XHR0aGlzLmRlbGF5ID0gdGhpcy5fd2VhcG9ucy5kZWxheSAhPSBudWxsID8gdGhpcy5fd2VhcG9ucy5kZWxheSA6IDEwO1xyXG5cdFx0dGhpcy5xdWFudGl0eSA9IHRoaXMuX3dlYXBvbnMucXVhbnRpdHkgIT0gbnVsbCA/IHRoaXMuX3dlYXBvbnMucXVhbnRpdHkgOiAxO1xyXG5cclxuXHRcdHRoaXMud2VhcG9uID0gdGhpcy5sZXZlbC5hZGQud2VhcG9uKHRoaXMucXVhbnRpdHksICdidWxsZXRzJywgdGhpcy5pZCwgdGhpcy5sZXZlbC5idWxsZXRzKTtcclxuXHRcdHRoaXMud2VhcG9uLnNldEJ1bGxldEZyYW1lcyh0aGlzLmlkLCB0aGlzLmlkLCB0cnVlKTtcclxuXHRcdHRoaXMud2VhcG9uLmJ1bGxldEtpbGxUeXBlID0gUGhhc2VyLldlYXBvbi5LSUxMX1dPUkxEX0JPVU5EUztcclxuXHRcdHRoaXMud2VhcG9uLmJ1bGxldFNwZWVkID0gdGhpcy5zcGVlZDtcclxuXHRcdHRoaXMud2VhcG9uLmZpcmVSYXRlID0gdGhpcy5kZWxheTsgXHJcblx0XHR0aGlzLndlYXBvbi5idWxsZXRzLnR5cGVPd25lciA9IHRoaXMucGVyc29uLmNvbnN0cnVjdG9yLm5hbWU7XHJcblxyXG5cdFx0dGhpcy5meEZpcmUgPSB0aGlzLmxldmVsLmFkZC5zcHJpdGUoMCwgMCwgJ2Z4X2ZpcmUnLCAwKTtcclxuXHRcdHRoaXMuZnhGaXJlLmFscGhhID0gMDtcclxuXHRcdHRoaXMuZnhGaXJlLnNjYWxlLnNldCgyKTtcclxuXHRcdHRoaXMuZnhGaXJlLmFuY2hvci5zZXQoMC41KTtcclxuXHRcdHRoaXMuZnhGaXJlLnNtb290aGVkID0gZmFsc2U7XHJcblx0XHR0aGlzLmZ4RmlyZS5hbmltYXRpb25zLmFkZCgnYWN0aXZlJyk7XHJcblxyXG5cdFx0dGhpcy5meENvbGxpZGUgPSB0aGlzLmxldmVsLmFkZC5zcHJpdGUoMCwgMCwgJ2Z4X2V4cGxvc2lvbicsIDApO1xyXG5cdFx0dGhpcy5meENvbGxpZGUuYWxwaGEgPSAwO1xyXG5cdFx0dGhpcy5meENvbGxpZGUuYW5jaG9yLnNldCgwLjUpO1xyXG5cdFx0dGhpcy5meENvbGxpZGUuc21vb3RoZWQgPSBmYWxzZTtcclxuXHRcdHRoaXMuZnhDb2xsaWRlLmFuaW1hdGlvbnMuYWRkKCdhY3RpdmUnKTtcclxuXHJcblx0XHR0aGlzLnVwZGF0ZVRyYWNrKCk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGVUcmFjaygpIHtcclxuXHRcdGxldCB4ID0gdGhpcy50cmFja1gqdGhpcy5wZXJzb24uc3ByaXRlLnNjYWxlLng7XHJcblx0XHRsZXQgeSA9IHRoaXMudHJhY2tZKnRoaXMucGVyc29uLnNwcml0ZS5zY2FsZS55O1xyXG5cdFx0XHJcblx0XHR0aGlzLndlYXBvbi50cmFja1Nwcml0ZSh0aGlzLnBlcnNvbi5zcHJpdGUsIHgsIHksIHRydWUpO1xyXG5cdH1cclxuXHRmaXJlKCkge1xyXG5cdFx0bGV0IGJ1bGxldCA9IHRoaXMud2VhcG9uLmZpcmUoKTtcclxuXHJcblx0XHRpZihidWxsZXQpIHtcclxuXHRcdFx0YnVsbGV0LnNtb290aGVkID0gZmFsc2U7XHJcblx0XHRcdGJ1bGxldC5zY2FsZS5zZXRUbyh0aGlzLnBlcnNvbi5zcHJpdGUuc2NhbGUueC8yLCB0aGlzLnBlcnNvbi5zcHJpdGUuc2NhbGUueS8yKTtcclxuXHRcdFx0YnVsbGV0LmJvZHkudXBkYXRlQm91bmRzKCk7XHJcblxyXG5cdFx0XHR0aGlzLnBlcnNvbi5zcHJpdGUuYm9keS52ZWxvY2l0eS54IC09IE1hdGguY29zKHRoaXMucGVyc29uLnNwcml0ZS5yb3RhdGlvbikgKiAxMDA7XHJcblx0XHRcdHRoaXMucGVyc29uLnNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgLT0gTWF0aC5zaW4odGhpcy5wZXJzb24uc3ByaXRlLnJvdGF0aW9uKSAqIDEwMDtcclxuXHJcblx0XHRcdHRoaXMuZnhGaXJlLnNjYWxlLnggPSB0aGlzLnBlcnNvbi5zcHJpdGUuc2NhbGUueDtcclxuXHRcdFx0dGhpcy5meEZpcmUuc2NhbGUueSA9IHRoaXMucGVyc29uLnNwcml0ZS5zY2FsZS55O1xyXG5cdFx0XHR0aGlzLmZ4RmlyZS54ID0gdGhpcy53ZWFwb24uX3JvdGF0ZWRQb2ludC54O1xyXG5cdFx0XHR0aGlzLmZ4RmlyZS55ID0gdGhpcy53ZWFwb24uX3JvdGF0ZWRQb2ludC55O1xyXG5cdFx0XHR0aGlzLmZ4RmlyZS5hbHBoYSA9IDE7XHJcblx0XHRcdHRoaXMuZnhGaXJlLnBsYXkoJ2FjdGl2ZScsIDIwKTtcclxuXHRcdFx0dGhpcy5sZXZlbC5hZGQudHdlZW4odGhpcy5meEZpcmUpLnRvKHthbHBoYTogMH0sIDYwMCkuc3RhcnQoKTtcclxuXHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHR1cGRhdGUoKSB7XHJcblx0XHR0aGlzLmxldmVsLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUodGhpcy53ZWFwb24uYnVsbGV0cywgdGhpcy5sZXZlbC5maXJzdExheWVyTWFwLCAoYnVsbGV0LCB0aWxlKSA9PiB7XHJcblx0XHRcdHRoaXMuZnhDb2xsaWRlLnggPSBidWxsZXQueDtcclxuXHRcdFx0dGhpcy5meENvbGxpZGUueSA9IGJ1bGxldC55O1xyXG5cdFx0XHR0aGlzLmZ4Q29sbGlkZS5hbHBoYSA9IDE7XHJcblx0XHRcdHRoaXMuZnhDb2xsaWRlLnBsYXkoJ2FjdGl2ZScsIDEwMCk7XHJcblx0XHRcdHRoaXMubGV2ZWwuYWRkLnR3ZWVuKHRoaXMuZnhDb2xsaWRlKS50byh7YWxwaGE6IDB9LCAzMDApLnN0YXJ0KCk7XHJcblx0XHRcdHRpbGUudGludCA9IDB4RkNGRjAwO1xyXG5cclxuXHRcdFx0YnVsbGV0LmtpbGwoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXZWFwb247Il19
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
},{"./states/Boot.js":10,"./states/Level.js":11,"./states/LevelManager.js":12,"./states/Menu.js":13,"./states/Preload.js":14,"./states/Settings.js":15}],9:[function(require,module,exports){
var UI = {
	addTextButton: (x = 0, y = 0, textFamily, text, fontSize = 30, cb) => {
		let txt = UI.addText(x, y, textFamily, text, fontSize);
		UI.setButton(txt, cb);
		return txt;
	},

	addText: (x = 0, y = 0, textFamily, text, fontSize = 30) => {
		let txt = UI.game.add.bitmapText(x, y, textFamily, text, fontSize);
		txt.smoothed = false;
		txt.anchor.set(0.5);
		return txt;
	},

	addIconButton: (x = 0, y = 0, key, index, cb) => {
		let sprite = UI.game.add.sprite(x, y, key, index);
		sprite.smoothed = false;
		sprite.scale.set(1.5);
		UI.setButton(sprite, cb);
		return sprite;
	},

	setButton: (obj, cb) => {
		obj.inputEnabled = true;
		let x = obj.scale.x;
		let y = obj.scale.y;

		obj.events.onInputDown.add(() => {
			if (obj.disable) return;
			UI.game.add.tween(obj.scale).to({ x: x + 0.3, y: y + 0.3 }, 300).start();
		});
		obj.events.onInputUp.add(() => {
			if (obj.disable) return;
			cb();
		});
		obj.events.onInputOver.add(() => {
			if (obj.disable) return;
			UI.game.add.tween(obj.scale).to({ x: x + 0.3, y: y + 0.3 }, 300).start();
		});
		obj.events.onInputOut.add(() => {
			if (obj.disable) return;
			UI.game.add.tween(obj.scale).to({ x: x, y: y }, 300).start();
		});
	}
};

module.exports = UI;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlVJLmpzIl0sIm5hbWVzIjpbIlVJIiwiYWRkVGV4dEJ1dHRvbiIsIngiLCJ5IiwidGV4dEZhbWlseSIsInRleHQiLCJmb250U2l6ZSIsImNiIiwidHh0IiwiYWRkVGV4dCIsInNldEJ1dHRvbiIsImdhbWUiLCJhZGQiLCJiaXRtYXBUZXh0Iiwic21vb3RoZWQiLCJhbmNob3IiLCJzZXQiLCJhZGRJY29uQnV0dG9uIiwia2V5IiwiaW5kZXgiLCJzcHJpdGUiLCJzY2FsZSIsIm9iaiIsImlucHV0RW5hYmxlZCIsImV2ZW50cyIsIm9uSW5wdXREb3duIiwiZGlzYWJsZSIsInR3ZWVuIiwidG8iLCJzdGFydCIsIm9uSW5wdXRVcCIsIm9uSW5wdXRPdmVyIiwib25JbnB1dE91dCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLEtBQUs7QUFDUkMsZ0JBQWUsQ0FBQ0MsSUFBRSxDQUFILEVBQU1DLElBQUUsQ0FBUixFQUFXQyxVQUFYLEVBQXVCQyxJQUF2QixFQUE2QkMsV0FBUyxFQUF0QyxFQUEwQ0MsRUFBMUMsS0FBaUQ7QUFDL0QsTUFBSUMsTUFBTVIsR0FBR1MsT0FBSCxDQUFXUCxDQUFYLEVBQWNDLENBQWQsRUFBaUJDLFVBQWpCLEVBQTZCQyxJQUE3QixFQUFtQ0MsUUFBbkMsQ0FBVjtBQUNBTixLQUFHVSxTQUFILENBQWFGLEdBQWIsRUFBa0JELEVBQWxCO0FBQ0EsU0FBT0MsR0FBUDtBQUNBLEVBTE87O0FBT1JDLFVBQVMsQ0FBQ1AsSUFBRSxDQUFILEVBQU1DLElBQUUsQ0FBUixFQUFXQyxVQUFYLEVBQXVCQyxJQUF2QixFQUE2QkMsV0FBUyxFQUF0QyxLQUE2QztBQUNyRCxNQUFJRSxNQUFNUixHQUFHVyxJQUFILENBQVFDLEdBQVIsQ0FBWUMsVUFBWixDQUF1QlgsQ0FBdkIsRUFBMEJDLENBQTFCLEVBQTZCQyxVQUE3QixFQUF5Q0MsSUFBekMsRUFBK0NDLFFBQS9DLENBQVY7QUFDQUUsTUFBSU0sUUFBSixHQUFlLEtBQWY7QUFDQU4sTUFBSU8sTUFBSixDQUFXQyxHQUFYLENBQWUsR0FBZjtBQUNBLFNBQU9SLEdBQVA7QUFDQSxFQVpPOztBQWNSUyxnQkFBZSxDQUFDZixJQUFFLENBQUgsRUFBTUMsSUFBRSxDQUFSLEVBQVdlLEdBQVgsRUFBZ0JDLEtBQWhCLEVBQXVCWixFQUF2QixLQUE4QjtBQUM1QyxNQUFJYSxTQUFTcEIsR0FBR1csSUFBSCxDQUFRQyxHQUFSLENBQVlRLE1BQVosQ0FBbUJsQixDQUFuQixFQUFzQkMsQ0FBdEIsRUFBeUJlLEdBQXpCLEVBQThCQyxLQUE5QixDQUFiO0FBQ0FDLFNBQU9OLFFBQVAsR0FBa0IsS0FBbEI7QUFDQU0sU0FBT0MsS0FBUCxDQUFhTCxHQUFiLENBQWlCLEdBQWpCO0FBQ0FoQixLQUFHVSxTQUFILENBQWFVLE1BQWIsRUFBcUJiLEVBQXJCO0FBQ0EsU0FBT2EsTUFBUDtBQUNBLEVBcEJPOztBQXNCUlYsWUFBVyxDQUFDWSxHQUFELEVBQU1mLEVBQU4sS0FBYTtBQUN2QmUsTUFBSUMsWUFBSixHQUFtQixJQUFuQjtBQUNBLE1BQUlyQixJQUFJb0IsSUFBSUQsS0FBSixDQUFVbkIsQ0FBbEI7QUFDQSxNQUFJQyxJQUFJbUIsSUFBSUQsS0FBSixDQUFVbEIsQ0FBbEI7O0FBRUFtQixNQUFJRSxNQUFKLENBQVdDLFdBQVgsQ0FBdUJiLEdBQXZCLENBQTJCLE1BQU07QUFDaEMsT0FBR1UsSUFBSUksT0FBUCxFQUFnQjtBQUNoQjFCLE1BQUdXLElBQUgsQ0FBUUMsR0FBUixDQUFZZSxLQUFaLENBQWtCTCxJQUFJRCxLQUF0QixFQUE2Qk8sRUFBN0IsQ0FBZ0MsRUFBQzFCLEdBQUdBLElBQUUsR0FBTixFQUFXQyxHQUFHQSxJQUFFLEdBQWhCLEVBQWhDLEVBQXNELEdBQXRELEVBQTJEMEIsS0FBM0Q7QUFDQSxHQUhEO0FBSUFQLE1BQUlFLE1BQUosQ0FBV00sU0FBWCxDQUFxQmxCLEdBQXJCLENBQXlCLE1BQU07QUFDOUIsT0FBR1UsSUFBSUksT0FBUCxFQUFnQjtBQUNoQm5CO0FBQ0EsR0FIRDtBQUlBZSxNQUFJRSxNQUFKLENBQVdPLFdBQVgsQ0FBdUJuQixHQUF2QixDQUEyQixNQUFNO0FBQ2hDLE9BQUdVLElBQUlJLE9BQVAsRUFBZ0I7QUFDaEIxQixNQUFHVyxJQUFILENBQVFDLEdBQVIsQ0FBWWUsS0FBWixDQUFrQkwsSUFBSUQsS0FBdEIsRUFBNkJPLEVBQTdCLENBQWdDLEVBQUMxQixHQUFHQSxJQUFFLEdBQU4sRUFBV0MsR0FBR0EsSUFBRSxHQUFoQixFQUFoQyxFQUFzRCxHQUF0RCxFQUEyRDBCLEtBQTNEO0FBQ0EsR0FIRDtBQUlBUCxNQUFJRSxNQUFKLENBQVdRLFVBQVgsQ0FBc0JwQixHQUF0QixDQUEwQixNQUFNO0FBQy9CLE9BQUdVLElBQUlJLE9BQVAsRUFBZ0I7QUFDaEIxQixNQUFHVyxJQUFILENBQVFDLEdBQVIsQ0FBWWUsS0FBWixDQUFrQkwsSUFBSUQsS0FBdEIsRUFBNkJPLEVBQTdCLENBQWdDLEVBQUMxQixHQUFHQSxDQUFKLEVBQU9DLEdBQUdBLENBQVYsRUFBaEMsRUFBOEMsR0FBOUMsRUFBbUQwQixLQUFuRDtBQUNBLEdBSEQ7QUFJQTtBQTNDTyxDQUFUOztBQThDQUksT0FBT0MsT0FBUCxHQUFpQmxDLEVBQWpCIiwiZmlsZSI6IlVJLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFVJID0ge1xyXG5cdGFkZFRleHRCdXR0b246ICh4PTAsIHk9MCwgdGV4dEZhbWlseSwgdGV4dCwgZm9udFNpemU9MzAsIGNiKSA9PiB7XHJcblx0XHRsZXQgdHh0ID0gVUkuYWRkVGV4dCh4LCB5LCB0ZXh0RmFtaWx5LCB0ZXh0LCBmb250U2l6ZSk7XHJcblx0XHRVSS5zZXRCdXR0b24odHh0LCBjYik7XHJcblx0XHRyZXR1cm4gdHh0O1xyXG5cdH0sXHJcblxyXG5cdGFkZFRleHQ6ICh4PTAsIHk9MCwgdGV4dEZhbWlseSwgdGV4dCwgZm9udFNpemU9MzApID0+IHtcclxuXHRcdGxldCB0eHQgPSBVSS5nYW1lLmFkZC5iaXRtYXBUZXh0KHgsIHksIHRleHRGYW1pbHksIHRleHQsIGZvbnRTaXplKTtcclxuXHRcdHR4dC5zbW9vdGhlZCA9IGZhbHNlO1xyXG5cdFx0dHh0LmFuY2hvci5zZXQoMC41KTtcclxuXHRcdHJldHVybiB0eHQ7XHJcblx0fSxcclxuXHJcblx0YWRkSWNvbkJ1dHRvbjogKHg9MCwgeT0wLCBrZXksIGluZGV4LCBjYikgPT4ge1xyXG5cdFx0bGV0IHNwcml0ZSA9IFVJLmdhbWUuYWRkLnNwcml0ZSh4LCB5LCBrZXksIGluZGV4KTtcclxuXHRcdHNwcml0ZS5zbW9vdGhlZCA9IGZhbHNlO1xyXG5cdFx0c3ByaXRlLnNjYWxlLnNldCgxLjUpO1xyXG5cdFx0VUkuc2V0QnV0dG9uKHNwcml0ZSwgY2IpO1xyXG5cdFx0cmV0dXJuIHNwcml0ZTtcclxuXHR9LFxyXG5cclxuXHRzZXRCdXR0b246IChvYmosIGNiKSA9PiB7XHJcblx0XHRvYmouaW5wdXRFbmFibGVkID0gdHJ1ZTtcclxuXHRcdGxldCB4ID0gb2JqLnNjYWxlLng7XHJcblx0XHRsZXQgeSA9IG9iai5zY2FsZS55O1xyXG5cclxuXHRcdG9iai5ldmVudHMub25JbnB1dERvd24uYWRkKCgpID0+IHtcclxuXHRcdFx0aWYob2JqLmRpc2FibGUpIHJldHVybjtcclxuXHRcdFx0VUkuZ2FtZS5hZGQudHdlZW4ob2JqLnNjYWxlKS50byh7eDogeCswLjMsIHk6IHkrMC4zfSwgMzAwKS5zdGFydCgpO1xyXG5cdFx0fSk7XHJcblx0XHRvYmouZXZlbnRzLm9uSW5wdXRVcC5hZGQoKCkgPT4ge1xyXG5cdFx0XHRpZihvYmouZGlzYWJsZSkgcmV0dXJuO1xyXG5cdFx0XHRjYigpO1xyXG5cdFx0fSk7XHJcblx0XHRvYmouZXZlbnRzLm9uSW5wdXRPdmVyLmFkZCgoKSA9PiB7XHJcblx0XHRcdGlmKG9iai5kaXNhYmxlKSByZXR1cm47XHJcblx0XHRcdFVJLmdhbWUuYWRkLnR3ZWVuKG9iai5zY2FsZSkudG8oe3g6IHgrMC4zLCB5OiB5KzAuM30sIDMwMCkuc3RhcnQoKTtcclxuXHRcdH0pO1xyXG5cdFx0b2JqLmV2ZW50cy5vbklucHV0T3V0LmFkZCgoKSA9PiB7XHJcblx0XHRcdGlmKG9iai5kaXNhYmxlKSByZXR1cm47XHJcblx0XHRcdFVJLmdhbWUuYWRkLnR3ZWVuKG9iai5zY2FsZSkudG8oe3g6IHgsIHk6IHl9LCAzMDApLnN0YXJ0KCk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVUk7Il19
},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
const Player = require('../game/Player');
const Enemy = require('../game/Enemy');

const UI = require('../mixins/UI.js');

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

		this.info = UI.addText(10, 220, 'font2', 'Powered by azbang @v0.1', 14);
		this.info.anchor.set(0);
		this.info.fixedToCamera = true;

		// PathFinder
		let arr = [];
		let props = this.map.tilesets[0].tileProperties;

		for (let i in props) {
			if (props[i].solid === 'false') arr.push(+i);else if (props[i].solid === 'true') this.map.setCollision(+i, true, this.firstLayerMap);
		}

		this.vjoy = this.game.plugins.add(Phaser.Plugin.VJoy);
		this.vjoy.enable();
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
			let item;
			if (rect.properties.type == 'coins') {
				let order = rect.properties.order || 0;

				item = this.add.sprite(rect.x + rect.width / 2, rect.y + rect.height / 2, 'token', 0);
				item.animations.add('rotation');
				item.play('rotation', 7, true);
				item.scale.set(0.7);
				if (order) item.tint = 0xFFE400;
				item.tween = this.add.tween(item.scale).to({ x: 0.9, y: 0.9 }, 300).to({ x: 0.7, y: 0.7 }, 400).loop().start();
			} else {
				let id;
				if (rect.properties.type == 'health') id = 1;else if (rect.properties.type == 'cartridge') id = 3;
				item = this.add.sprite(rect.x + rect.width / 2, rect.y + rect.height / 2, 'items', id);
				item.tween = this.add.tween(item.scale).to({ x: 1.1, y: 1.1 }, 300).to({ x: 0.8, y: 0.8 }, 400).to({ x: 1, y: 1 }, 400).loop().start();
			}
			item.type = rect.properties.type;
			item.anchor.set(0.5);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxldmVsLmpzIl0sIm5hbWVzIjpbIlBsYXllciIsInJlcXVpcmUiLCJFbmVteSIsIlVJIiwiTGV2ZWwiLCJjcmVhdGUiLCJtYXAiLCJnYW1lIiwiYWRkIiwidGlsZW1hcCIsImN1cnJlbnRMZXZlbCIsImFkZFRpbGVzZXRJbWFnZSIsImRlYnVnTWFwIiwiYmciLCJ0aWxlU3ByaXRlIiwid29ybGQiLCJzZXRCb3VuZHMiLCJmaXJzdExheWVyTWFwIiwiY3JlYXRlTGF5ZXIiLCJyZXNpemVXb3JsZCIsInNtb290aGVkIiwic2Vjb25kTGF5ZXJNYXAiLCJpbmZvIiwiYWRkVGV4dCIsImFuY2hvciIsInNldCIsImZpeGVkVG9DYW1lcmEiLCJhcnIiLCJwcm9wcyIsInRpbGVzZXRzIiwidGlsZVByb3BlcnRpZXMiLCJpIiwic29saWQiLCJwdXNoIiwic2V0Q29sbGlzaW9uIiwidmpveSIsInBsdWdpbnMiLCJQaGFzZXIiLCJQbHVnaW4iLCJWSm95IiwiZW5hYmxlIiwicGF0aGZpbmRlciIsIlBhdGhGaW5kZXJQbHVnaW4iLCJzZXRHcmlkIiwibGF5ZXJzIiwiZGF0YSIsIl9jcmVhdGVUZXh0QXJlYXMiLCJfY3JlYXRlRGVhZEFyZWFzIiwiX2NyZWF0ZVBhdHJ1bGVGbGFncyIsIl9jcmVhdGVJdGVtcyIsIl9jcmVhdGVFbmVtaWVzIiwiYnVsbGV0cyIsImdyb3VwIiwicmVjdCIsIm9iamVjdHMiLCJuZXh0TGV2ZWxBcmVhIiwiUmVjdGFuZ2xlIiwieCIsInkiLCJ3aWR0aCIsImhlaWdodCIsInBvc1BsYXllciIsInBsYXllciIsImVuZW1pZXMiLCJzcGF3bmVyIiwiZm9yRWFjaCIsInNwYXduIiwiZW5lbXkiLCJwcm9wZXJ0aWVzIiwidHlwZSIsInNwcml0ZSIsIml0ZW1zIiwiZW5hYmxlQm9keSIsIml0ZW0iLCJvcmRlciIsImFuaW1hdGlvbnMiLCJwbGF5Iiwic2NhbGUiLCJ0aW50IiwidHdlZW4iLCJ0byIsImxvb3AiLCJzdGFydCIsImlkIiwicGF0cnVsZUZsYWdzIiwibW92aW5nIiwicmVjdGFuZ2xlIiwiZGVhZEFyZWFzIiwidGV4dEFyZWFzIiwibmV4dExldmVsIiwidG90YWxMZXZlbHMiLCJzdGF0ZSIsInVwZGF0ZSIsInRpbGVQb3NpdGlvbiIsIl91cGRhdGUiLCJjaGlsZHJlbiIsImxlbmd0aCIsImNsYXNzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTUEsU0FBU0MsUUFBUSxnQkFBUixDQUFmO0FBQ0EsTUFBTUMsUUFBUUQsUUFBUSxlQUFSLENBQWQ7O0FBRUEsTUFBTUUsS0FBS0YsUUFBUSxpQkFBUixDQUFYOztBQUVBLE1BQU1HLEtBQU4sQ0FBWTtBQUNYQyxVQUFTO0FBQ1I7QUFDQSxPQUFLQyxHQUFMLEdBQVcsS0FBS0MsSUFBTCxDQUFVQyxHQUFWLENBQWNDLE9BQWQsQ0FBc0IsVUFBVSxLQUFLRixJQUFMLENBQVVHLFlBQTFDLEVBQXdELEVBQXhELEVBQTRELEVBQTVELENBQVg7QUFDQSxPQUFLSixHQUFMLENBQVNLLGVBQVQsQ0FBeUIsU0FBekI7QUFDQSxPQUFLTCxHQUFMLENBQVNNLFFBQVQsR0FBb0IsSUFBcEI7O0FBRUEsT0FBS0MsRUFBTCxHQUFVLEtBQUtOLElBQUwsQ0FBVUMsR0FBVixDQUFjTSxVQUFkLENBQXlCLENBQXpCLEVBQTRCLENBQTVCLEVBQStCLEtBQS9CLEVBQXNDLEtBQXRDLEVBQTZDLElBQTdDLENBQVY7QUFDQSxPQUFLQyxLQUFMLENBQVdDLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkIsS0FBM0IsRUFBa0MsS0FBbEM7O0FBRUEsT0FBS0MsYUFBTCxHQUFxQixLQUFLWCxHQUFMLENBQVNZLFdBQVQsQ0FBcUIsTUFBckIsQ0FBckI7QUFDQSxPQUFLRCxhQUFMLENBQW1CRSxXQUFuQjtBQUNBLE9BQUtGLGFBQUwsQ0FBbUJHLFFBQW5CLEdBQThCLEtBQTlCOztBQUVBLE9BQUtDLGNBQUwsR0FBc0IsS0FBS2YsR0FBTCxDQUFTWSxXQUFULENBQXFCLE1BQXJCLENBQXRC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Iiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUGxheWVyID0gcmVxdWlyZSgnLi4vZ2FtZS9QbGF5ZXInKTtcclxuY29uc3QgRW5lbXkgPSByZXF1aXJlKCcuLi9nYW1lL0VuZW15Jyk7XHJcblxyXG5jb25zdCBVSSA9IHJlcXVpcmUoJy4uL21peGlucy9VSS5qcycpO1xyXG5cclxuY2xhc3MgTGV2ZWwge1xyXG5cdGNyZWF0ZSgpIHtcclxuXHRcdC8vIFRpbGVNYXBcclxuXHRcdHRoaXMubWFwID0gdGhpcy5nYW1lLmFkZC50aWxlbWFwKCdsZXZlbCcgKyB0aGlzLmdhbWUuY3VycmVudExldmVsLCAxNiwgMTYpO1xyXG5cdFx0dGhpcy5tYXAuYWRkVGlsZXNldEltYWdlKCd0aWxlbWFwJyk7XHJcblx0XHR0aGlzLm1hcC5kZWJ1Z01hcCA9IHRydWU7XHJcblxyXG5cdFx0dGhpcy5iZyA9IHRoaXMuZ2FtZS5hZGQudGlsZVNwcml0ZSgwLCAwLCAxMDAwMCwgMTAwMDAsICdiZycpO1xyXG5cdFx0dGhpcy53b3JsZC5zZXRCb3VuZHMoMCwgMCwgMTAwMDAsIDEwMDAwKTtcclxuXHJcblx0XHR0aGlzLmZpcnN0TGF5ZXJNYXAgPSB0aGlzLm1hcC5jcmVhdGVMYXllcignbWFwMScpO1xyXG5cdFx0dGhpcy5maXJzdExheWVyTWFwLnJlc2l6ZVdvcmxkKCk7XHJcblx0XHR0aGlzLmZpcnN0TGF5ZXJNYXAuc21vb3RoZWQgPSBmYWxzZTtcclxuXHJcblx0XHR0aGlzLnNlY29uZExheWVyTWFwID0gdGhpcy5tYXAuY3JlYXRlTGF5ZXIoJ21hcDInKTtcclxuXHRcdHRoaXMuc2Vjb25kTGF5ZXJNYXAucmVzaXplV29ybGQoKTtcclxuXHRcdHRoaXMuc2Vjb25kTGF5ZXJNYXAuc21vb3RoZWQgPSBmYWxzZTtcclxuXHJcblx0XHR0aGlzLmluZm8gPSBVSS5hZGRUZXh0KDEwLCAyMjAsICdmb250MicsICdQb3dlcmVkIGJ5IGF6YmFuZyBAdjAuMScsIDE0KTtcclxuXHRcdHRoaXMuaW5mby5hbmNob3Iuc2V0KDApO1xyXG5cdFx0dGhpcy5pbmZvLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG5cclxuXHRcdC8vIFBhdGhGaW5kZXJcclxuXHRcdGxldCBhcnIgPSBbXTtcclxuXHRcdGxldCBwcm9wcyA9ICB0aGlzLm1hcC50aWxlc2V0c1swXS50aWxlUHJvcGVydGllcztcclxuXHJcblx0XHRmb3IobGV0IGkgaW4gcHJvcHMpIHtcclxuXHRcdFx0aWYocHJvcHNbaV0uc29saWQgPT09ICdmYWxzZScpIGFyci5wdXNoKCtpKTtcclxuXHRcdFx0ZWxzZSBpZihwcm9wc1tpXS5zb2xpZCA9PT0gJ3RydWUnKSB0aGlzLm1hcC5zZXRDb2xsaXNpb24oK2ksIHRydWUsIHRoaXMuZmlyc3RMYXllck1hcCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy52am95ID0gdGhpcy5nYW1lLnBsdWdpbnMuYWRkKFBoYXNlci5QbHVnaW4uVkpveSk7XHJcblx0XHR0aGlzLnZqb3kuZW5hYmxlKCk7XHJcblx0XHR0aGlzLnBhdGhmaW5kZXIgPSB0aGlzLmdhbWUucGx1Z2lucy5hZGQoUGhhc2VyLlBsdWdpbi5QYXRoRmluZGVyUGx1Z2luKTtcclxuXHRcdHRoaXMucGF0aGZpbmRlci5zZXRHcmlkKHRoaXMubWFwLmxheWVyc1swXS5kYXRhLCBhcnIpO1xyXG5cclxuXHRcdHRoaXMuX2NyZWF0ZVRleHRBcmVhcygpO1xyXG5cdFx0dGhpcy5fY3JlYXRlRGVhZEFyZWFzKCk7XHJcblx0XHR0aGlzLl9jcmVhdGVQYXRydWxlRmxhZ3MoKTtcclxuXHRcdHRoaXMuX2NyZWF0ZUl0ZW1zKCk7XHJcblx0XHR0aGlzLl9jcmVhdGVFbmVtaWVzKCk7XHJcblxyXG5cdFx0Ly8gZ3JvdXAgZm9yIGJ1bGxldHNcclxuXHRcdHRoaXMuYnVsbGV0cyA9IHRoaXMuYWRkLmdyb3VwKCk7XHJcblxyXG5cdFx0Ly8gTmV4dCBsZXZlbCBhcmVhXHJcblx0XHRsZXQgcmVjdCA9IHRoaXMubWFwLm9iamVjdHMubmV4dExldmVsQXJlYVswXTtcclxuXHRcdHRoaXMubmV4dExldmVsQXJlYSA9IG5ldyBQaGFzZXIuUmVjdGFuZ2xlKHJlY3QueCwgcmVjdC55LCByZWN0LndpZHRoLCByZWN0LmhlaWdodCk7XHJcblxyXG5cdFx0Ly8gUGxheWVyXHJcblx0XHRsZXQgcG9zUGxheWVyID0gdGhpcy5tYXAub2JqZWN0cy5wbGF5ZXJbMF07XHJcblx0XHR0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIodGhpcywgcG9zUGxheWVyLngrcG9zUGxheWVyLndpZHRoLzIsIHBvc1BsYXllci55K3Bvc1BsYXllci5oZWlnaHQvMik7XHJcblx0fVxyXG5cdF9jcmVhdGVFbmVtaWVzKCkge1xyXG5cdFx0dGhpcy5lbmVtaWVzID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xyXG5cdFx0dGhpcy5tYXAub2JqZWN0cy5zcGF3bmVyICYmIHRoaXMubWFwLm9iamVjdHMuc3Bhd25lci5mb3JFYWNoKChzcGF3bikgPT4ge1xyXG5cdFx0XHRsZXQgZW5lbXkgPSBuZXcgRW5lbXkodGhpcywgc3Bhd24ueCtzcGF3bi53aWR0aC8yLCBzcGF3bi55K3NwYXduLmhlaWdodC8yLCBzcGF3bi5wcm9wZXJ0aWVzLnR5cGUpO1xyXG5cdFx0XHR0aGlzLmVuZW1pZXMuYWRkKGVuZW15LnNwcml0ZSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0X2NyZWF0ZUl0ZW1zKCkge1xyXG5cdFx0dGhpcy5pdGVtcyA9IHRoaXMuYWRkLmdyb3VwKCk7XHJcblx0XHR0aGlzLml0ZW1zLmVuYWJsZUJvZHkgPSB0cnVlO1xyXG5cdFx0dGhpcy5tYXAub2JqZWN0cy5pdGVtcyAmJiB0aGlzLm1hcC5vYmplY3RzLml0ZW1zLmZvckVhY2goKHJlY3QpID0+IHtcclxuXHRcdFx0bGV0IGl0ZW07XHJcblx0XHRcdGlmKHJlY3QucHJvcGVydGllcy50eXBlID09ICdjb2lucycpIHtcclxuXHRcdFx0XHRsZXQgb3JkZXIgPSByZWN0LnByb3BlcnRpZXMub3JkZXIgfHwgMDtcclxuXHJcblx0XHRcdFx0aXRlbSA9IHRoaXMuYWRkLnNwcml0ZShyZWN0LngrcmVjdC53aWR0aC8yLCByZWN0LnkrcmVjdC5oZWlnaHQvMiwgJ3Rva2VuJywgMCk7XHJcblx0XHRcdFx0aXRlbS5hbmltYXRpb25zLmFkZCgncm90YXRpb24nKTtcclxuXHRcdFx0XHRpdGVtLnBsYXkoJ3JvdGF0aW9uJywgNywgdHJ1ZSk7XHJcblx0XHRcdFx0aXRlbS5zY2FsZS5zZXQoMC43KTtcclxuXHRcdFx0XHRpZihvcmRlcikgaXRlbS50aW50ID0gMHhGRkU0MDA7XHJcblx0XHRcdFx0aXRlbS50d2VlbiA9IHRoaXMuYWRkLnR3ZWVuKGl0ZW0uc2NhbGUpXHJcblx0XHRcdFx0XHQudG8oe3g6MC45LCB5OiAwLjl9LCAzMDApXHJcblx0XHRcdFx0XHQudG8oe3g6IDAuNywgeTogMC43fSwgNDAwKVxyXG5cdFx0XHRcdFx0Lmxvb3AoKVxyXG5cdFx0XHRcdFx0LnN0YXJ0KCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGV0IGlkO1xyXG5cdFx0XHRcdGlmKHJlY3QucHJvcGVydGllcy50eXBlID09ICdoZWFsdGgnKSBpZCA9IDE7XHJcblx0XHRcdFx0ZWxzZSBpZihyZWN0LnByb3BlcnRpZXMudHlwZSA9PSAnY2FydHJpZGdlJykgaWQgPSAzO1xyXG5cdFx0XHRcdGl0ZW0gPSB0aGlzLmFkZC5zcHJpdGUocmVjdC54K3JlY3Qud2lkdGgvMiwgcmVjdC55K3JlY3QuaGVpZ2h0LzIsICdpdGVtcycsIGlkKTtcclxuXHRcdFx0XHRpdGVtLnR3ZWVuID0gdGhpcy5hZGQudHdlZW4oaXRlbS5zY2FsZSlcclxuXHRcdFx0XHRcdC50byh7eDoxLjEsIHk6IDEuMX0sIDMwMClcclxuXHRcdFx0XHRcdC50byh7eDogMC44LCB5OiAwLjh9LCA0MDApXHJcblx0XHRcdFx0XHQudG8oe3g6IDEsIHk6IDF9LCA0MDApXHJcblx0XHRcdFx0XHQubG9vcCgpXHJcblx0XHRcdFx0XHQuc3RhcnQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpdGVtLnR5cGUgPSByZWN0LnByb3BlcnRpZXMudHlwZTtcclxuXHRcdFx0aXRlbS5hbmNob3Iuc2V0KDAuNSk7XHJcblx0XHRcdGl0ZW0uc21vb3RoZWQgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5pdGVtcy5hZGQoaXRlbSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0X2NyZWF0ZVBhdHJ1bGVGbGFncygpIHtcclxuXHRcdHRoaXMucGF0cnVsZUZsYWdzID0gW107XHJcblx0XHR0aGlzLm1hcC5vYmplY3RzLm1vdmluZyAmJiB0aGlzLm1hcC5vYmplY3RzLm1vdmluZy5mb3JFYWNoKChyZWN0KSA9PiB7XHJcblx0XHRcdGxldCByZWN0YW5nbGUgPSBuZXcgUGhhc2VyLlJlY3RhbmdsZShyZWN0LngsIHJlY3QueSwgcmVjdC53aWR0aCwgcmVjdC5oZWlnaHQpXHJcblx0XHRcdHRoaXMucGF0cnVsZUZsYWdzLnB1c2gocmVjdGFuZ2xlKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRfY3JlYXRlRGVhZEFyZWFzKCkge1xyXG5cdFx0dGhpcy5kZWFkQXJlYXMgPSBbXTtcclxuXHRcdHRoaXMubWFwLm9iamVjdHMuZGVhZEFyZWFzICYmIHRoaXMubWFwLm9iamVjdHMuZGVhZEFyZWFzLmZvckVhY2goKHJlY3QpID0+IHtcclxuXHRcdFx0bGV0IHJlY3RhbmdsZSA9IG5ldyBQaGFzZXIuUmVjdGFuZ2xlKHJlY3QueCwgcmVjdC55LCByZWN0LndpZHRoLCByZWN0LmhlaWdodClcclxuXHRcdFx0dGhpcy5kZWFkQXJlYXMucHVzaChyZWN0YW5nbGUpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRfY3JlYXRlVGV4dEFyZWFzKCkge1xyXG5cdFx0dGhpcy50ZXh0QXJlYXMgPSBbXTtcclxuXHRcdHRoaXMubWFwLm9iamVjdHMudGV4dEFyZWFzICYmIHRoaXMubWFwLm9iamVjdHMudGV4dEFyZWFzLmZvckVhY2goKHJlY3QpID0+IHtcclxuXHRcdFx0bGV0IHJlY3RhbmdsZSA9IG5ldyBQaGFzZXIuUmVjdGFuZ2xlKHJlY3QueCwgcmVjdC55LCByZWN0LndpZHRoLCByZWN0LmhlaWdodClcclxuXHRcdFx0bGV0IGkgPSAxO1xyXG5cdFx0XHR3aGlsZShyZWN0LnByb3BlcnRpZXNbJ3RleHQnICsgaV0pIHtcclxuXHRcdFx0XHRyZWN0YW5nbGVbJ3RleHQnICsgaV0gPSByZWN0LnByb3BlcnRpZXNbJ3RleHQnICsgaV07XHJcblx0XHRcdFx0aSsrO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMudGV4dEFyZWFzLnB1c2gocmVjdGFuZ2xlKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0bmV4dExldmVsKCkge1xyXG5cdFx0dGhpcy5nYW1lLmN1cnJlbnRMZXZlbCsrO1xyXG5cclxuXHRcdGlmKHRoaXMuZ2FtZS5jdXJyZW50TGV2ZWwgPD0gdGhpcy5nYW1lLnRvdGFsTGV2ZWxzKSB0aGlzLnN0YXRlLnN0YXJ0KCdMZXZlbCcpO1xyXG5cdFx0ZWxzZSB0aGlzLnN0YXRlLnN0YXJ0KCdNZW51Jyk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGUoKSB7XHJcblx0XHR0aGlzLmJnLnRpbGVQb3NpdGlvbi54ICs9IDE7XHJcblx0XHR0aGlzLmJnLnRpbGVQb3NpdGlvbi55ICs9IDE7XHJcblxyXG5cdFx0dGhpcy5wbGF5ZXIuX3VwZGF0ZSgpO1xyXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IHRoaXMuZW5lbWllcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR0aGlzLmVuZW1pZXMuY2hpbGRyZW5baV0uY2xhc3MuX3VwZGF0ZSgpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGV2ZWw7Il19
},{"../game/Enemy":1,"../game/Player":4,"../mixins/UI.js":9}],12:[function(require,module,exports){
const UI = require('../mixins/UI.js');

class LevelManager {
	create() {
		this.world.setBounds(0, 0, 480, 320);
		this.bg = this.game.add.tileSprite(0, 0, this.world.width, this.world.height, 'bg');

		this.label = UI.addText(this.world.centerX + 20, 50, 'font', 'LEVEL SELECT', 30);
		this.buttonsLevelSelect = this.add.group();
		let i = 0;
		for (let y = 0; y < 3; y++) {
			for (let x = 0; x < 8; x++) {
				i++;
				let btn = UI.addTextButton(45 * x + 80, 45 * y + 110, 'font', i, 18, () => {
					this.game.currentLevel = btn.level;
					this.goLevel();
				});
				btn.level = i;
				if (i > this.game.totalLevels) {
					btn.tint = 0xB0B0B0;
					btn.disable = true;
				}
				this.buttonsLevelSelect.add(btn);
			}
		}
		this.buttonsLevelSelect.x = this.world.centerX - 30 * 8;

		this.btnClose = UI.addIconButton(60, 45, 'ui', 0, () => this.state.start('Menu'));

		this.info = UI.addText(10, 220, 'font2', 'Powered by azbang @v0.1', 14);
		this.info.anchor.set(0);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxldmVsTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJVSSIsInJlcXVpcmUiLCJMZXZlbE1hbmFnZXIiLCJjcmVhdGUiLCJ3b3JsZCIsInNldEJvdW5kcyIsImJnIiwiZ2FtZSIsImFkZCIsInRpbGVTcHJpdGUiLCJ3aWR0aCIsImhlaWdodCIsImxhYmVsIiwiYWRkVGV4dCIsImNlbnRlclgiLCJidXR0b25zTGV2ZWxTZWxlY3QiLCJncm91cCIsImkiLCJ5IiwieCIsImJ0biIsImFkZFRleHRCdXR0b24iLCJjdXJyZW50TGV2ZWwiLCJsZXZlbCIsImdvTGV2ZWwiLCJ0b3RhbExldmVscyIsInRpbnQiLCJkaXNhYmxlIiwiYnRuQ2xvc2UiLCJhZGRJY29uQnV0dG9uIiwic3RhdGUiLCJzdGFydCIsImluZm8iLCJhbmNob3IiLCJzZXQiLCJ1cGRhdGUiLCJ0aWxlUG9zaXRpb24iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQSxNQUFNQSxLQUFLQyxRQUFRLGlCQUFSLENBQVg7O0FBRUEsTUFBTUMsWUFBTixDQUFtQjtBQUNsQkMsVUFBUztBQUNSLE9BQUtDLEtBQUwsQ0FBV0MsU0FBWCxDQUFxQixDQUFyQixFQUF3QixDQUF4QixFQUEyQixHQUEzQixFQUFnQyxHQUFoQztBQUNBLE9BQUtDLEVBQUwsR0FBVSxLQUFLQyxJQUFMLENBQVVDLEdBQVYsQ0FBY0MsVUFBZCxDQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQixLQUFLTCxLQUFMLENBQVdNLEtBQTFDLEVBQWlELEtBQUtOLEtBQUwsQ0FBV08sTUFBNUQsRUFBb0UsSUFBcEUsQ0FBVjs7QUFFQSxPQUFLQyxLQUFMLEdBQWFaLEdBQUdhLE9BQUgsQ0FBVyxLQUFLVCxLQUFMLENBQVdVLE9BQVgsR0FBbUIsRUFBOUIsRUFBa0MsRUFBbEMsRUFBc0MsTUFBdEMsRUFBOEMsY0FBOUMsRUFBOEQsRUFBOUQsQ0FBYjtBQUNBLE9BQUtDLGtCQUFMLEdBQTBCLEtBQUtQLEdBQUwsQ0FBU1EsS0FBVCxFQUExQjtBQUNBLE1BQUlDLElBQUksQ0FBUjtBQUNBLE9BQUksSUFBSUMsSUFBSSxDQUFaLEVBQWVBLElBQUksQ0FBbkIsRUFBc0JBLEdBQXRCLEVBQTJCO0FBQzFCLFFBQUksSUFBSUMsSUFBSSxDQUFaLEVBQWVBLElBQUksQ0FBbkIsRUFBc0JBLEdBQXRCLEVBQTJCO0FBQzFCRjtBQUNBLFFBQUlHLE1BQU1wQixHQUFHcUIsYUFBSCxDQUFpQixLQUFHRixDQUFILEdBQUssRUFBdEIsRUFBMEIsS0FBR0QsQ0FBSCxHQUFLLEdBQS9CLEVBQW9DLE1BQXBDLEVBQTRDRCxDQUE1QyxFQUErQyxFQUEvQyxFQUFtRCxNQUFNO0FBQ2xFLFVBQUtWLElBQUwsQ0FBVWUsWUFBVixHQUF5QkYsSUFBSUcsS0FBN0I7QUFDQSxVQUFLQyxPQUFMO0FBQ0EsS0FIUyxDQUFWO0FBSUFKLFFBQUlHLEtBQUosR0FBWU4sQ0FBWjtBQUNBLFFBQUdBLElBQUksS0FBS1YsSUFBTCxDQUFVa0IsV0FBakIsRUFBOEI7QUFDN0JMLFNBQUlNLElBQUosR0FBVyxRQUFYO0FBQ0FOLFNBQUlPLE9BQUosR0FBYyxJQUFkO0FBQ0E7QUFDRCxTQUFLWixrQkFBTCxDQUF3QlAsR0FBeEIsQ0FBNEJZLEdBQTVCO0FBQ0E7QUFDRDtBQUNELE9BQUtMLGtCQUFMLENBQXdCSSxDQUF4QixHQUE0QixLQUFLZixLQUFMLENBQVdVLE9BQVgsR0FBbUIsS0FBRyxDQUFsRDs7QUFFQSxPQUFLYyxRQUFMLEdBQWdCNUIsR0FBRzZCLGFBQUgsQ0FBaUIsRUFBakIsRUFBcUIsRUFBckIsRUFBeUIsSUFBekIsRUFBK0IsQ0FBL0IsRUFBa0MsTUFBTSxLQUFLQyxLQUFMLENBQVdDLEtBQVgsQ0FBaUIsTUFBakIsQ0FBeEMsQ0FBaEI7O0FBRUEsT0FBS0MsSUFBTCxHQUFZaEMsR0FBR2EsT0FBSCxDQUFXLEVBQVgsRUFBZSxHQUFmLEVBQW9CLE9BQXBCLEVBQTZCLHlCQUE3QixFQUF3RCxFQUF4RCxDQUFaO0FBQ0EsT0FBS21CLElBQUwsQ0FBVUMsTUFBVixDQUFpQkMsR0FBakIsQ0FBcUIsQ0FBckI7QUFDQTs7QUFFRFYsU0FBUVAsQ0FBUixFQUFXO0FBQ1YsT0FBS2EsS0FBTCxDQUFXQyxLQUFYLENBQWlCLE9BQWpCO0FBQ0E7O0FBRURJLFVBQVM7QUFDUixPQUFLN0IsRUFBTCxDQUFROEIsWUFBUixDQUFxQmpCLENBQXJCLElBQTBCLENBQTFCO0FBQ0EsT0FBS2IsRUFBTCxDQUFROEIsWUFBUixDQUFxQmxCLENBQXJCLElBQTBCLENBQTFCO0FBQ0E7QUF0Q2lCOztBQXlDbkJtQixPQUFPQyxPQUFQLEdBQWlCcEMsWUFBakIiLCJmaWxlIjoiTGV2ZWxNYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgVUkgPSByZXF1aXJlKCcuLi9taXhpbnMvVUkuanMnKTtcclxuXHJcbmNsYXNzIExldmVsTWFuYWdlciB7XHJcblx0Y3JlYXRlKCkge1xyXG5cdFx0dGhpcy53b3JsZC5zZXRCb3VuZHMoMCwgMCwgNDgwLCAzMjApO1xyXG5cdFx0dGhpcy5iZyA9IHRoaXMuZ2FtZS5hZGQudGlsZVNwcml0ZSgwLCAwLCB0aGlzLndvcmxkLndpZHRoLCB0aGlzLndvcmxkLmhlaWdodCwgJ2JnJyk7XHJcblxyXG5cdFx0dGhpcy5sYWJlbCA9IFVJLmFkZFRleHQodGhpcy53b3JsZC5jZW50ZXJYKzIwLCA1MCwgJ2ZvbnQnLCAnTEVWRUwgU0VMRUNUJywgMzApO1xyXG5cdFx0dGhpcy5idXR0b25zTGV2ZWxTZWxlY3QgPSB0aGlzLmFkZC5ncm91cCgpO1xyXG5cdFx0bGV0IGkgPSAwO1xyXG5cdFx0Zm9yKGxldCB5ID0gMDsgeSA8IDM7IHkrKykge1xyXG5cdFx0XHRmb3IobGV0IHggPSAwOyB4IDwgODsgeCsrKSB7XHJcblx0XHRcdFx0aSsrO1xyXG5cdFx0XHRcdGxldCBidG4gPSBVSS5hZGRUZXh0QnV0dG9uKDQ1KngrODAsIDQ1KnkrMTEwLCAnZm9udCcsIGksIDE4LCAoKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLmdhbWUuY3VycmVudExldmVsID0gYnRuLmxldmVsO1xyXG5cdFx0XHRcdFx0dGhpcy5nb0xldmVsKCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0YnRuLmxldmVsID0gaTtcclxuXHRcdFx0XHRpZihpID4gdGhpcy5nYW1lLnRvdGFsTGV2ZWxzKSB7XHJcblx0XHRcdFx0XHRidG4udGludCA9IDB4QjBCMEIwO1xyXG5cdFx0XHRcdFx0YnRuLmRpc2FibGUgPSB0cnVlO1xyXG5cdFx0XHRcdH0gXHJcblx0XHRcdFx0dGhpcy5idXR0b25zTGV2ZWxTZWxlY3QuYWRkKGJ0bik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHRoaXMuYnV0dG9uc0xldmVsU2VsZWN0LnggPSB0aGlzLndvcmxkLmNlbnRlclgtMzAqODtcclxuXHJcblx0XHR0aGlzLmJ0bkNsb3NlID0gVUkuYWRkSWNvbkJ1dHRvbig2MCwgNDUsICd1aScsIDAsICgpID0+IHRoaXMuc3RhdGUuc3RhcnQoJ01lbnUnKSk7XHJcblxyXG5cdFx0dGhpcy5pbmZvID0gVUkuYWRkVGV4dCgxMCwgMjIwLCAnZm9udDInLCAnUG93ZXJlZCBieSBhemJhbmcgQHYwLjEnLCAxNCk7XHJcblx0XHR0aGlzLmluZm8uYW5jaG9yLnNldCgwKTtcclxuXHR9XHJcblxyXG5cdGdvTGV2ZWwoaSkge1xyXG5cdFx0dGhpcy5zdGF0ZS5zdGFydCgnTGV2ZWwnKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZSgpIHtcclxuXHRcdHRoaXMuYmcudGlsZVBvc2l0aW9uLnggKz0gMTtcclxuXHRcdHRoaXMuYmcudGlsZVBvc2l0aW9uLnkgKz0gMTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGV2ZWxNYW5hZ2VyOyJdfQ==
},{"../mixins/UI.js":9}],13:[function(require,module,exports){
const UI = require('../mixins/UI.js');

class Menu {
	create() {
		this.world.setBounds(0, 0, 480, 320);
		this.bg = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'bg');

		this.labelPath1 = UI.addText(160, 50, 'font', 'BLINK', 35);
		this.add.tween(this.labelPath1).to({ alpha: 0 }, 200).to({ alpha: 1 }, 100).start().loop();

		this.labelPart2 = UI.addText(320, 55, 'font', 'SHOOTER', 25);

		this.btnStart = UI.addTextButton(this.world.centerX, this.world.centerY - 35, 'font', 'START', 30, () => {
			this.state.start('LevelManager');
		});
		this.btnSettings = UI.addTextButton(this.world.centerX, this.world.centerY + 10, 'font', 'SETTINGS', 30, () => {
			this.state.start('Settings');
		});

		this.info = UI.addText(10, 220, 'font2', 'Powered by azbang @v0.1', 14);
		this.info.anchor.set(0);
	}
	update() {
		this.bg.tilePosition.x += 1;
		this.bg.tilePosition.y += 1;
	}
}

module.exports = Menu;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lbnUuanMiXSwibmFtZXMiOlsiVUkiLCJyZXF1aXJlIiwiTWVudSIsImNyZWF0ZSIsIndvcmxkIiwic2V0Qm91bmRzIiwiYmciLCJhZGQiLCJ0aWxlU3ByaXRlIiwid2lkdGgiLCJoZWlnaHQiLCJsYWJlbFBhdGgxIiwiYWRkVGV4dCIsInR3ZWVuIiwidG8iLCJhbHBoYSIsInN0YXJ0IiwibG9vcCIsImxhYmVsUGFydDIiLCJidG5TdGFydCIsImFkZFRleHRCdXR0b24iLCJjZW50ZXJYIiwiY2VudGVyWSIsInN0YXRlIiwiYnRuU2V0dGluZ3MiLCJpbmZvIiwiYW5jaG9yIiwic2V0IiwidXBkYXRlIiwidGlsZVBvc2l0aW9uIiwieCIsInkiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQSxNQUFNQSxLQUFLQyxRQUFRLGlCQUFSLENBQVg7O0FBRUEsTUFBTUMsSUFBTixDQUFXO0FBQ1ZDLFVBQVM7QUFDUixPQUFLQyxLQUFMLENBQVdDLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkIsR0FBM0IsRUFBZ0MsR0FBaEM7QUFDQSxPQUFLQyxFQUFMLEdBQVUsS0FBS0MsR0FBTCxDQUFTQyxVQUFULENBQW9CLENBQXBCLEVBQXVCLENBQXZCLEVBQTBCLEtBQUtKLEtBQUwsQ0FBV0ssS0FBckMsRUFBNEMsS0FBS0wsS0FBTCxDQUFXTSxNQUF2RCxFQUErRCxJQUEvRCxDQUFWOztBQUVBLE9BQUtDLFVBQUwsR0FBa0JYLEdBQUdZLE9BQUgsQ0FBVyxHQUFYLEVBQWdCLEVBQWhCLEVBQW9CLE1BQXBCLEVBQTRCLE9BQTVCLEVBQXFDLEVBQXJDLENBQWxCO0FBQ0EsT0FBS0wsR0FBTCxDQUFTTSxLQUFULENBQWUsS0FBS0YsVUFBcEIsRUFDRUcsRUFERixDQUNLLEVBQUNDLE9BQU8sQ0FBUixFQURMLEVBQ2lCLEdBRGpCLEVBRUVELEVBRkYsQ0FFSyxFQUFDQyxPQUFPLENBQVIsRUFGTCxFQUVpQixHQUZqQixFQUdFQyxLQUhGLEdBSUVDLElBSkY7O0FBTUEsT0FBS0MsVUFBTCxHQUFrQmxCLEdBQUdZLE9BQUgsQ0FBVyxHQUFYLEVBQWdCLEVBQWhCLEVBQW9CLE1BQXBCLEVBQTRCLFNBQTVCLEVBQXVDLEVBQXZDLENBQWxCOztBQUdBLE9BQUtPLFFBQUwsR0FBZ0JuQixHQUFHb0IsYUFBSCxDQUFpQixLQUFLaEIsS0FBTCxDQUFXaUIsT0FBNUIsRUFBcUMsS0FBS2pCLEtBQUwsQ0FBV2tCLE9BQVgsR0FBbUIsRUFBeEQsRUFBNEQsTUFBNUQsRUFBb0UsT0FBcEUsRUFBNkUsRUFBN0UsRUFBaUYsTUFBTTtBQUN0RyxRQUFLQyxLQUFMLENBQVdQLEtBQVgsQ0FBaUIsY0FBakI7QUFDQSxHQUZlLENBQWhCO0FBR0EsT0FBS1EsV0FBTCxHQUFtQnhCLEdBQUdvQixhQUFILENBQWlCLEtBQUtoQixLQUFMLENBQVdpQixPQUE1QixFQUFxQyxLQUFLakIsS0FBTCxDQUFXa0IsT0FBWCxHQUFtQixFQUF4RCxFQUE0RCxNQUE1RCxFQUFvRSxVQUFwRSxFQUFnRixFQUFoRixFQUFvRixNQUFNO0FBQzVHLFFBQUtDLEtBQUwsQ0FBV1AsS0FBWCxDQUFpQixVQUFqQjtBQUNBLEdBRmtCLENBQW5COztBQUlBLE9BQUtTLElBQUwsR0FBWXpCLEdBQUdZLE9BQUgsQ0FBVyxFQUFYLEVBQWUsR0FBZixFQUFvQixPQUFwQixFQUE2Qix5QkFBN0IsRUFBd0QsRUFBeEQsQ0FBWjtBQUNBLE9BQUthLElBQUwsQ0FBVUMsTUFBVixDQUFpQkMsR0FBakIsQ0FBcUIsQ0FBckI7QUFDQTtBQUNEQyxVQUFTO0FBQ1IsT0FBS3RCLEVBQUwsQ0FBUXVCLFlBQVIsQ0FBcUJDLENBQXJCLElBQTBCLENBQTFCO0FBQ0EsT0FBS3hCLEVBQUwsQ0FBUXVCLFlBQVIsQ0FBcUJFLENBQXJCLElBQTBCLENBQTFCO0FBQ0E7QUE1QlM7O0FBK0JYQyxPQUFPQyxPQUFQLEdBQWlCL0IsSUFBakIiLCJmaWxlIjoiTWVudS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFVJID0gcmVxdWlyZSgnLi4vbWl4aW5zL1VJLmpzJyk7XHJcblxyXG5jbGFzcyBNZW51IHtcclxuXHRjcmVhdGUoKSB7XHJcblx0XHR0aGlzLndvcmxkLnNldEJvdW5kcygwLCAwLCA0ODAsIDMyMCk7XHJcblx0XHR0aGlzLmJnID0gdGhpcy5hZGQudGlsZVNwcml0ZSgwLCAwLCB0aGlzLndvcmxkLndpZHRoLCB0aGlzLndvcmxkLmhlaWdodCwgJ2JnJyk7XHJcblxyXG5cdFx0dGhpcy5sYWJlbFBhdGgxID0gVUkuYWRkVGV4dCgxNjAsIDUwLCAnZm9udCcsICdCTElOSycsIDM1KTtcclxuXHRcdHRoaXMuYWRkLnR3ZWVuKHRoaXMubGFiZWxQYXRoMSlcclxuXHRcdFx0LnRvKHthbHBoYTogMH0sIDIwMClcclxuXHRcdFx0LnRvKHthbHBoYTogMX0sIDEwMClcclxuXHRcdFx0LnN0YXJ0KClcclxuXHRcdFx0Lmxvb3AoKTtcclxuXHJcblx0XHR0aGlzLmxhYmVsUGFydDIgPSBVSS5hZGRUZXh0KDMyMCwgNTUsICdmb250JywgJ1NIT09URVInLCAyNSk7XHJcblxyXG5cclxuXHRcdHRoaXMuYnRuU3RhcnQgPSBVSS5hZGRUZXh0QnV0dG9uKHRoaXMud29ybGQuY2VudGVyWCwgdGhpcy53b3JsZC5jZW50ZXJZLTM1LCAnZm9udCcsICdTVEFSVCcsIDMwLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMuc3RhdGUuc3RhcnQoJ0xldmVsTWFuYWdlcicpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLmJ0blNldHRpbmdzID0gVUkuYWRkVGV4dEJ1dHRvbih0aGlzLndvcmxkLmNlbnRlclgsIHRoaXMud29ybGQuY2VudGVyWSsxMCwgJ2ZvbnQnLCAnU0VUVElOR1MnLCAzMCwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLnN0YXRlLnN0YXJ0KCdTZXR0aW5ncycpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5pbmZvID0gVUkuYWRkVGV4dCgxMCwgMjIwLCAnZm9udDInLCAnUG93ZXJlZCBieSBhemJhbmcgQHYwLjEnLCAxNCk7XHJcblx0XHR0aGlzLmluZm8uYW5jaG9yLnNldCgwKTtcclxuXHR9XHJcblx0dXBkYXRlKCkge1xyXG5cdFx0dGhpcy5iZy50aWxlUG9zaXRpb24ueCArPSAxO1xyXG5cdFx0dGhpcy5iZy50aWxlUG9zaXRpb24ueSArPSAxO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW51OyJdfQ==
},{"../mixins/UI.js":9}],14:[function(require,module,exports){
const UI = require('../mixins/UI.js');

class Preload {
		init() {
				UI.game = this;
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

				this.load.image('vjoy_body', '../assets/UI/body.png');
				this.load.image('vjoy_cap', '../assets/UI/button.png');

				this.load.image('buttonJump', '../assets/UI/buttonJump.png');
				this.load.image('buttonFire', '../assets/UI/buttonFire.png');

				this.load.spritesheet('fx_jump', '../assets/FX/jump.png', 47, 45, 6);
				this.load.spritesheet('fx_fire', '../assets/FX/fire.png', 32, 33, 6);
				this.load.spritesheet('fx_explosion', '../assets/FX/explosion.png', 35, 36, 7);
				this.load.spritesheet('fx_hit', '../assets/FX/hit.png', 16, 16, 6);
				this.load.spritesheet('fx_collide', '../assets/FX/collide.png', 37, 37, 6);
				this.load.spritesheet('fx_voice', '../assets/hud/voice.png', 20, 20, 7);

				this.load.spritesheet('token', '../assets/token1.png', 20, 20, 9);

				this.load.spritesheet('legs', '../assets/legs.png', 15, 17, 4);

				this.load.bitmapFont('font', '../assets/font.png', '../assets/font.xml');
				this.load.bitmapFont('font2', '../assets/font2.png', '../assets/font2.xml');

				this.load.atlas('ui', 'assets/atlases/ui.png', 'assets/atlases/ui.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByZWxvYWQuanMiXSwibmFtZXMiOlsiVUkiLCJyZXF1aXJlIiwiUHJlbG9hZCIsImluaXQiLCJnYW1lIiwidG90YWxMZXZlbHMiLCJwcmVsb2FkIiwibG9hZCIsImF1ZGlvIiwiaW1hZ2UiLCJzcHJpdGVzaGVldCIsImJpdG1hcEZvbnQiLCJhdGxhcyIsIlBoYXNlciIsIkxvYWRlciIsIlRFWFRVUkVfQVRMQVNfSlNPTl9IQVNIIiwiaSIsInRpbGVtYXAiLCJUaWxlbWFwIiwiVElMRURfSlNPTiIsImNyZWF0ZSIsIm11c2ljcyIsImFkZCIsImxlbmd0aCIsIm5leHQiLCJvblN0b3AiLCJwbGF5IiwiY3VycmVudExldmVsIiwic3RhdGUiLCJzdGFydCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBLE1BQU1BLEtBQUtDLFFBQVEsaUJBQVIsQ0FBWDs7QUFFQSxNQUFNQyxPQUFOLENBQWM7QUFDYkMsU0FBTztBQUNOSCxPQUFHSSxJQUFILEdBQVUsSUFBVjtBQUNBLFNBQUtBLElBQUwsQ0FBVUMsV0FBVixHQUF3QixDQUF4QjtBQUNBO0FBQ0RDLFlBQVU7QUFDVCxTQUFLQyxJQUFMLENBQVVDLEtBQVYsQ0FBZ0IsUUFBaEIsRUFBMEIsNkJBQTFCO0FBQ0EsU0FBS0QsSUFBTCxDQUFVQyxLQUFWLENBQWdCLFFBQWhCLEVBQTBCLDZCQUExQjtBQUNBLFNBQUtELElBQUwsQ0FBVUMsS0FBVixDQUFnQixRQUFoQixFQUEwQiw2QkFBMUI7QUFDQSxTQUFLRCxJQUFMLENBQVVDLEtBQVYsQ0FBZ0IsUUFBaEIsRUFBMEIsNkJBQTFCOztBQUVBLFNBQUtELElBQUwsQ0FBVUUsS0FBVixDQUFnQixJQUFoQixFQUFzQixrQkFBdEI7QUFDQSxTQUFLRixJQUFMLENBQVVFLEtBQVYsQ0FBZ0IsU0FBaEIsRUFBMkIsOEJBQTNCO0FBQ0EsU0FBS0YsSUFBTCxDQUFVRSxLQUFWLENBQWdCLFNBQWhCLEVBQTJCLDJCQUEzQjtBQUNBLFNBQUtGLElBQUwsQ0FB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OztBQTBFZEMsT0FBT0MsT0FBUCxHQUFpQjdCLE9BQWpCIiwiZmlsZSI6IlByZWxvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBVSSA9IHJlcXVpcmUoJy4uL21peGlucy9VSS5qcycpO1xyXG5cclxuY2xhc3MgUHJlbG9hZCB7XHJcblx0aW5pdCgpIHtcclxuXHRcdFVJLmdhbWUgPSB0aGlzO1xyXG5cdFx0dGhpcy5nYW1lLnRvdGFsTGV2ZWxzID0gMjtcclxuXHR9XHJcblx0cHJlbG9hZCgpIHtcclxuXHRcdHRoaXMubG9hZC5hdWRpbygnbXVzaWMxJywgJy4uL2Fzc2V0cy9tdXNpYy90aGVtZS0xLm9nZycpO1xyXG5cdFx0dGhpcy5sb2FkLmF1ZGlvKCdtdXNpYzInLCAnLi4vYXNzZXRzL211c2ljL3RoZW1lLTIub2dnJyk7XHJcblx0XHR0aGlzLmxvYWQuYXVkaW8oJ211c2ljMycsICcuLi9hc3NldHMvbXVzaWMvdGhlbWUtMy5vZ2cnKTtcclxuXHRcdHRoaXMubG9hZC5hdWRpbygnbXVzaWM0JywgJy4uL2Fzc2V0cy9tdXNpYy90aGVtZS00LndhdicpO1xyXG5cclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnYmcnLCAnLi4vYXNzZXRzL2JnLnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCd0aWxlbWFwJywgJy4uL2Fzc2V0cy9sZXZlbHMvdGlsZW1hcC5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnbGlmZWJveCcsICcuLi9hc3NldHMvaHVkL2xpZmVib3gucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ2xpZmVyZWN0JywgJy4uL2Fzc2V0cy9odWQvbGlmZXJlY3QucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ3Njb3JlJywgJy4uL2Fzc2V0cy9odWQvc2NvcmUucG5nJyk7XHJcblx0XHR0aGlzLmxvYWQuaW1hZ2UoJ3dpbmRvdycsICcuLi9hc3NldHMvd2luZG93LnBuZycpO1xyXG5cclxuXHRcdHRoaXMubG9hZC5pbWFnZSgndmpveV9ib2R5JywgJy4uL2Fzc2V0cy9VSS9ib2R5LnBuZycpO1xyXG5cdFx0dGhpcy5sb2FkLmltYWdlKCd2am95X2NhcCcsICcuLi9hc3NldHMvVUkvYnV0dG9uLnBuZycpO1xyXG5cclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnYnV0dG9uSnVtcCcsICcuLi9hc3NldHMvVUkvYnV0dG9uSnVtcC5wbmcnKTtcclxuXHRcdHRoaXMubG9hZC5pbWFnZSgnYnV0dG9uRmlyZScsICcuLi9hc3NldHMvVUkvYnV0dG9uRmlyZS5wbmcnKTtcclxuXHJcblx0XHR0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2Z4X2p1bXAnLCAnLi4vYXNzZXRzL0ZYL2p1bXAucG5nJywgNDcsIDQ1LCA2KTtcclxuXHRcdHRoaXMubG9hZC5zcHJpdGVzaGVldCgnZnhfZmlyZScsICcuLi9hc3NldHMvRlgvZmlyZS5wbmcnLCAzMiwgMzMsIDYpO1xyXG5cdFx0dGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdmeF9leHBsb3Npb24nLCAnLi4vYXNzZXRzL0ZYL2V4cGxvc2lvbi5wbmcnLCAzNSwgMzYsIDcpO1xyXG5cdFx0dGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdmeF9oaXQnLCAnLi4vYXNzZXRzL0ZYL2hpdC5wbmcnLCAxNiwgMTYsIDYpO1xyXG5cdFx0dGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdmeF9jb2xsaWRlJywgJy4uL2Fzc2V0cy9GWC9jb2xsaWRlLnBuZycsIDM3LCAzNywgNik7XHJcblx0XHR0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2Z4X3ZvaWNlJywgJy4uL2Fzc2V0cy9odWQvdm9pY2UucG5nJywgMjAsIDIwLCA3KTtcclxuXHJcblx0XHR0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3Rva2VuJywgJy4uL2Fzc2V0cy90b2tlbjEucG5nJywgMjAsIDIwLCA5KTtcclxuXHJcblx0XHR0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2xlZ3MnLCAnLi4vYXNzZXRzL2xlZ3MucG5nJywgMTUsIDE3LCA0KTtcclxuXHJcblx0XHR0aGlzLmxvYWQuYml0bWFwRm9udCgnZm9udCcsICcuLi9hc3NldHMvZm9udC5wbmcnLCAnLi4vYXNzZXRzL2ZvbnQueG1sJyk7XHJcblx0XHR0aGlzLmxvYWQuYml0bWFwRm9udCgnZm9udDInLCAnLi4vYXNzZXRzL2ZvbnQyLnBuZycsICcuLi9hc3NldHMvZm9udDIueG1sJyk7XHJcblxyXG5cdFx0dGhpcy5sb2FkLmF0bGFzKCd1aScsICdhc3NldHMvYXRsYXNlcy91aS5wbmcnLCAnYXNzZXRzL2F0bGFzZXMvdWkuanNvbicsIFBoYXNlci5Mb2FkZXIuVEVYVFVSRV9BVExBU19KU09OX0hBU0gpO1xyXG5cdFx0dGhpcy5sb2FkLmF0bGFzKCdoZWFkcycsICdhc3NldHMvYXRsYXNlcy9oZWFkcy5wbmcnLCAnYXNzZXRzL2F0bGFzZXMvaGVhZHMuanNvbicsIFBoYXNlci5Mb2FkZXIuVEVYVFVSRV9BVExBU19KU09OX0hBU0gpO1xyXG5cdFx0dGhpcy5sb2FkLmF0bGFzKCdib2RpZXMnLCAnYXNzZXRzL2F0bGFzZXMvYm9kaWVzLnBuZycsICdhc3NldHMvYXRsYXNlcy9ib2RpZXMuanNvbicsIFBoYXNlci5Mb2FkZXIuVEVYVFVSRV9BVExBU19KU09OX0hBU0gpO1xyXG5cdFx0dGhpcy5sb2FkLmF0bGFzKCdhdHRhY2hUb0JvZHknLCAnYXNzZXRzL2F0bGFzZXMvYXR0YWNoVG9Cb2R5LnBuZycsICdhc3NldHMvYXRsYXNlcy9hdHRhY2hUb0JvZHkuanNvbicsIFBoYXNlci5Mb2FkZXIuVEVYVFVSRV9BVExBU19KU09OX0hBU0gpO1xyXG5cdFx0dGhpcy5sb2FkLmF0bGFzKCd3ZWFwb25zJywgJ2Fzc2V0cy9hdGxhc2VzL3dlYXBvbnMucG5nJywgJ2Fzc2V0cy9hdGxhc2VzL3dlYXBvbnMuanNvbicsIFBoYXNlci5Mb2FkZXIuVEVYVFVSRV9BVExBU19KU09OX0hBU0gpO1xyXG5cdFx0dGhpcy5sb2FkLmF0bGFzKCdpdGVtcycsICdhc3NldHMvYXRsYXNlcy9pdGVtcy5wbmcnLCAnYXNzZXRzL2F0bGFzZXMvaXRlbXMuanNvbicsIFBoYXNlci5Mb2FkZXIuVEVYVFVSRV9BVExBU19KU09OX0hBU0gpO1xyXG5cdFx0dGhpcy5sb2FkLmF0bGFzKCdidWxsZXRzJywgJ2Fzc2V0cy9hdGxhc2VzL2J1bGxldHMucG5nJywgJ2Fzc2V0cy9hdGxhc2VzL2J1bGxldHMuanNvbicsIFBoYXNlci5Mb2FkZXIuVEVYVFVSRV9BVExBU19KU09OX0hBU0gpO1xyXG5cclxuXHRcdC8vIGxvYWQgbGV2ZWxzXHJcblx0XHRsZXQgaSA9IDE7XHJcblx0XHRmb3IoOyBpIDw9IHRoaXMuZ2FtZS50b3RhbExldmVsczsgaSsrKSB7XHJcblx0XHRcdHRoaXMubG9hZC50aWxlbWFwKCdsZXZlbCcgKyBpLCAnLi4vYXNzZXRzL2xldmVscy90ZXN0L2xldmVsJyArIGkgKyAnLmpzb24nLCBudWxsLCBQaGFzZXIuVGlsZW1hcC5USUxFRF9KU09OKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNyZWF0ZSgpIHtcclxuXHRcdGxldCBtdXNpY3MgPSBbXHJcblx0XHRcdHRoaXMuYWRkLmF1ZGlvKCdtdXNpYzEnKSxcclxuXHRcdFx0dGhpcy5hZGQuYXVkaW8oJ211c2ljMicpLFxyXG5cdFx0XHR0aGlzLmFkZC5hdWRpbygnbXVzaWMzJyksXHJcblx0XHRcdHRoaXMuYWRkLmF1ZGlvKCdtdXNpYzQnKVxyXG5cdFx0XTtcclxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBtdXNpY3MubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0KCgpID0+IHtcclxuXHRcdFx0XHRsZXQgbmV4dCA9IGkrMSA+IG11c2ljcy5sZW5ndGgtMSA/IDAgOiBpKzE7XHJcblx0XHRcdFx0bXVzaWNzW2ldLm9uU3RvcC5hZGQoKCkgPT4gbXVzaWNzW25leHRdLnBsYXkoKSk7XHJcblx0XHRcdH0pKCk7XHJcblx0XHR9XHJcblx0XHRtdXNpY3NbMF0ucGxheSgpO1xyXG5cdFx0dGhpcy5nYW1lLm11c2ljcyA9IG11c2ljcztcclxuXHJcblx0XHR0aGlzLmdhbWUuY3VycmVudExldmVsID0gMTtcclxuXHRcdHRoaXMuc3RhdGUuc3RhcnQoJ01lbnUnKTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUHJlbG9hZDsiXX0=
},{"../mixins/UI.js":9}],15:[function(require,module,exports){
const UI = require('../mixins/UI.js');

class Settings {
		create() {
				this.world.setBounds(0, 0, 480, 320);
				this.bg = this.game.add.tileSprite(0, 0, this.world.width, this.world.height, 'bg');

				this.label = UI.addText(this.world.centerX + 20, 50, 'font', 'SETTINGS', 30);

				this.btnClose = UI.addIconButton(110, 45, 'ui', 0, () => this.state.start('Menu'));

				this.param1 = UI.addText(this.world.centerX, 130, 'font', 'MUSIC ON', 30);
				this.param2 = UI.addText(this.world.centerX, 170, 'font', 'SOUNDS ON', 30);

				this.info = UI.addText(10, 220, 'font2', 'Powered by azbang @v0.1', 14);
				this.info.anchor.set(0);
		}
		update() {
				this.bg.tilePosition.x += 1;
				this.bg.tilePosition.y += 1;
		}
}

module.exports = Settings;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNldHRpbmdzLmpzIl0sIm5hbWVzIjpbIlVJIiwicmVxdWlyZSIsIlNldHRpbmdzIiwiY3JlYXRlIiwid29ybGQiLCJzZXRCb3VuZHMiLCJiZyIsImdhbWUiLCJhZGQiLCJ0aWxlU3ByaXRlIiwid2lkdGgiLCJoZWlnaHQiLCJsYWJlbCIsImFkZFRleHQiLCJjZW50ZXJYIiwiYnRuQ2xvc2UiLCJhZGRJY29uQnV0dG9uIiwic3RhdGUiLCJzdGFydCIsInBhcmFtMSIsInBhcmFtMiIsImluZm8iLCJhbmNob3IiLCJzZXQiLCJ1cGRhdGUiLCJ0aWxlUG9zaXRpb24iLCJ4IiwieSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBLE1BQU1BLEtBQUtDLFFBQVEsaUJBQVIsQ0FBWDs7QUFFQSxNQUFNQyxRQUFOLENBQWU7QUFDZEMsV0FBUztBQUNSLFNBQUtDLEtBQUwsQ0FBV0MsU0FBWCxDQUFxQixDQUFyQixFQUF3QixDQUF4QixFQUEyQixHQUEzQixFQUFnQyxHQUFoQztBQUNBLFNBQUtDLEVBQUwsR0FBVSxLQUFLQyxJQUFMLENBQVVDLEdBQVYsQ0FBY0MsVUFBZCxDQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQixLQUFLTCxLQUFMLENBQVdNLEtBQTFDLEVBQWlELEtBQUtOLEtBQUwsQ0FBV08sTUFBNUQsRUFBb0UsSUFBcEUsQ0FBVjs7QUFFQSxTQUFLQyxLQUFMLEdBQWFaLEdBQUdhLE9BQUgsQ0FBVyxLQUFLVCxLQUFMLENBQVdVLE9BQVgsR0FBbUIsRUFBOUIsRUFBa0MsRUFBbEMsRUFBc0MsTUFBdEMsRUFBOEMsVUFBOUMsRUFBMEQsRUFBMUQsQ0FBYjs7QUFFQSxTQUFLQyxRQUFMLEdBQWdCZixHQUFHZ0IsYUFBSCxDQUFpQixHQUFqQixFQUFzQixFQUF0QixFQUEwQixJQUExQixFQUFnQyxDQUFoQyxFQUFtQyxNQUFNLEtBQUtDLEtBQUwsQ0FBV0MsS0FBWCxDQUFpQixNQUFqQixDQUF6QyxDQUFoQjs7QUFFQSxTQUFLQyxNQUFMLEdBQWNuQixHQUFHYSxPQUFILENBQVcsS0FBS1QsS0FBTCxDQUFXVSxPQUF0QixFQUErQixHQUEvQixFQUFvQyxNQUFwQyxFQUE0QyxVQUE1QyxFQUF3RCxFQUF4RCxDQUFkO0FBQ0EsU0FBS00sTUFBTCxHQUFjcEIsR0FBR2EsT0FBSCxDQUFXLEtBQUtULEtBQUwsQ0FBV1UsT0FBdEIsRUFBK0IsR0FBL0IsRUFBb0MsTUFBcEMsRUFBNEMsV0FBNUMsRUFBeUQsRUFBekQsQ0FBZDs7QUFFQSxTQUFLTyxJQUFMLEdBQVlyQixHQUFHYSxPQUFILENBQVcsRUFBWCxFQUFlLEdBQWYsRUFBb0IsT0FBcEIsRUFBNkIseUJBQTdCLEVBQXdELEVBQXhELENBQVo7QUFDQSxTQUFLUSxJQUFMLENBQVVDLE1BQVYsQ0FBaUJDLEdBQWpCLENBQXFCLENBQXJCO0FBQ0E7QUFDREMsV0FBUztBQUNSLFNBQUtsQixFQUFMLENBQVFtQixZQUFSLENBQXFCQyxDQUFyQixJQUEwQixDQUExQjtBQUNBLFNBQUtwQixFQUFMLENBQVFtQixZQUFSLENBQXFCRSxDQUFyQixJQUEwQixDQUExQjtBQUNBO0FBbEJhOztBQXFCZkMsT0FBT0MsT0FBUCxHQUFpQjNCLFFBQWpCIiwiZmlsZSI6IlNldHRpbmdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgVUkgPSByZXF1aXJlKCcuLi9taXhpbnMvVUkuanMnKTtcclxuXHJcbmNsYXNzIFNldHRpbmdzIHtcclxuXHRjcmVhdGUoKSB7XHJcblx0XHR0aGlzLndvcmxkLnNldEJvdW5kcygwLCAwLCA0ODAsIDMyMCk7XHJcblx0XHR0aGlzLmJnID0gdGhpcy5nYW1lLmFkZC50aWxlU3ByaXRlKDAsIDAsIHRoaXMud29ybGQud2lkdGgsIHRoaXMud29ybGQuaGVpZ2h0LCAnYmcnKTtcclxuXHJcblx0XHR0aGlzLmxhYmVsID0gVUkuYWRkVGV4dCh0aGlzLndvcmxkLmNlbnRlclgrMjAsIDUwLCAnZm9udCcsICdTRVRUSU5HUycsIDMwKTtcclxuXHJcblx0XHR0aGlzLmJ0bkNsb3NlID0gVUkuYWRkSWNvbkJ1dHRvbigxMTAsIDQ1LCAndWknLCAwLCAoKSA9PiB0aGlzLnN0YXRlLnN0YXJ0KCdNZW51JykpO1xyXG5cclxuXHRcdHRoaXMucGFyYW0xID0gVUkuYWRkVGV4dCh0aGlzLndvcmxkLmNlbnRlclgsIDEzMCwgJ2ZvbnQnLCAnTVVTSUMgT04nLCAzMCk7XHJcblx0XHR0aGlzLnBhcmFtMiA9IFVJLmFkZFRleHQodGhpcy53b3JsZC5jZW50ZXJYLCAxNzAsICdmb250JywgJ1NPVU5EUyBPTicsIDMwKTtcclxuXHJcblx0XHR0aGlzLmluZm8gPSBVSS5hZGRUZXh0KDEwLCAyMjAsICdmb250MicsICdQb3dlcmVkIGJ5IGF6YmFuZyBAdjAuMScsIDE0KTtcclxuXHRcdHRoaXMuaW5mby5hbmNob3Iuc2V0KDApO1xyXG5cdH1cclxuXHR1cGRhdGUoKSB7XHJcblx0XHR0aGlzLmJnLnRpbGVQb3NpdGlvbi54ICs9IDE7XHJcblx0XHR0aGlzLmJnLnRpbGVQb3NpdGlvbi55ICs9IDE7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNldHRpbmdzOyJdfQ==
},{"../mixins/UI.js":9}]},{},[8])