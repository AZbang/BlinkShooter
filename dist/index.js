(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Boot, Level, Player;

Level = require('./states/Level.coffee');

Player = require('./Player.coffee');

Boot = (function() {
  function Boot(game) {
    this.game = game;
    this.w = 480;
    this.h = 320;
    this.scale = window.innerWidth / this.w;
    this.root = document.getElementById('ShooterBlink');
  }

  Boot.prototype.preload = function() {
    this.load.tilemap('map', '../assets/levels/test/map.csv', null, Phaser.Tilemap.CSV);
    this.load.image('tilemap', '../assets/levels/tilemap.png');
    this.load.image('bg', '../assets/bg.png');
    this.load.image('person1', '../assets/_/characters/example.png');
    this.load.atlas('heads', 'assets/atlases/heads.png', 'assets/atlases/heads.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.load.atlas('bodies', 'assets/atlases/bodies.png', 'assets/atlases/bodies.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.load.atlas('attachToBody', 'assets/atlases/attachToBody.png', 'assets/atlases/attachToBody.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.load.atlas('weapons', 'assets/atlases/weapons.png', 'assets/atlases/weapons.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.load.atlas('items', 'assets/atlases/items.png', 'assets/atlases/items.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    return this.load.atlas('bullets', 'assets/atlases/bullets.png', 'assets/atlases/bullets.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
  };

  Boot.prototype.create = function() {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.scale.setMaximum();
    this.game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.level = new Level(this);
    return this.player = new Player(this, 400, 200);
  };

  Boot.prototype.update = function() {
    return this.player.update();
  };

  return Boot;

})();

module.exports = Boot;


},{"./Player.coffee":3,"./states/Level.coffee":6}],2:[function(require,module,exports){
var Entity, entities;

entities = require('./entities.json');

Entity = (function() {
  function Entity(game, x, y, type) {
    var _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
    this.type = type;
    this.game = game;
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
    this._entity = entities[type];
    this.hp = (_ref = this._entity.hp) != null ? _ref : 10;
    this.jump = (_ref1 = this._entity.jump) != null ? _ref1 : 2;
    this.speed = (_ref2 = this._entity.speed) != null ? _ref2 : 100;
    this.isJumping = false;
    this.headId = (_ref3 = this._entity.head) != null ? _ref3 : 0;
    this.bodyId = (_ref4 = this._entity.body) != null ? _ref4 : 0;
    this.weaponId = (_ref5 = this._entity.weapon) != null ? _ref5 : 0;
  }

  Entity.prototype._createPhaserObjects = function() {
    this.sptite = this.game.add.group();
    console.log(this.sprite);
    this.head = this.game.add.sprite(this.x, this.y, 'heads', this.headId);
    this.head.anchor.set(0.5);
    this.head.smoothed = false;
    this.sptite.add(this.head);
    this.body = this.game.add.sprite(this.x, this.y, 'bodies', this.bodyId);
    this.body.anchor.set(0.5);
    this.body.smoothed = false;
    this.sptite.add(this.body);
    this.attachToBody = this.game.add.sprite(this.x, this.y, 'attachToBody', this.weaponId);
    this.attachToBody.anchor.set(0.5);
    this.attachToBody.smoothed = false;
    this.sptite.add(this.attachToBody);
    this.weapon = this.game.add.weapon(10, 'bullets');
    this.weapon.setBulletFrames(this.weaponId, this.weaponId, true);
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.weapon.bulletSpeed = 400;
    this.weapon.fireRate = 50;
    return this.weapon.trackSprite(this.attachToBody, 16, 4, true);
  };

  return Entity;

})();

module.exports = Entity;


},{"./entities.json":4}],3:[function(require,module,exports){
var Entity, Player,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Entity = require('./Entity.coffee');

Player = (function(_super) {
  __extends(Player, _super);

  function Player(game, x, y) {
    Player.__super__.constructor.call(this, game, x, y, 'player');
    this._createPhaserObjects();
    console.log(this.sprite);
    this.game.physics.arcade.enable(this.sprite);
    this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    this.sprite.body.drag.set(150);
    this.sprite.body.maxVelocity.set(100);
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  }

  Player.prototype.update = function() {
    if (this.isJumping) {
      this.weapon.trackSprite(this.sprite, 16 * this.sprite.scale.x, 4 * this.sprite.scale.y, true);
    }
    if (this.cursors.up.isDown) {
      this.fire();
      this.game.physics.arcade.accelerationFromRotation(this.sprite.rotation, 300, this.sprite.body.acceleration);
    } else {
      this.sprite.body.acceleration.set(0);
    }
    if (this.cursors.left.isDown) {
      this.sprite.body.angularVelocity = -300;
    } else if (this.cursors.right.isDown) {
      this.sprite.body.angularVelocity = 300;
    } else {
      this.sprite.body.angularVelocity = 0;
    }
    if (this.jumpButton.isDown && !this.isJumping) {
      return this.jump(3);
    }
  };

  Player.prototype.fire = function() {
    var bullet;
    bullet = this.weapon.fire();
    if (bullet) {
      this.sprite.body.angularVelocity = -400;
      this.game.physics.arcade.accelerationFromRotation(this.sprite.rotation, 300, this.sprite.body.acceleration);
      bullet.smoothed = false;
      bullet.scale.setTo(this.sprite.scale.x / 2, this.sprite.scale.y / 2);
      return bullet.body.updateBounds();
    }
  };

  Player.prototype.jump = function(power) {
    this.isJumping = true;
    return this.game.add.tween(this.sprite.scale).to({
      x: power,
      y: power
    }, 300, Phaser.Easing.Quadratic.Out, true).onComplete.add(function() {
      this.sprite.body.updateBounds();
      return this.game.add.tween(this.sprite.scale).to({
        x: 1,
        y: 1
      }, 300, Phaser.Easing.Quintic.In, true).onComplete.add(function() {
        this.isJumping = false;
        return this.weapon.trackSprite(this.sprite, 16 * this.sprite.scale.x, 4 * this.sprite.scale.y, true);
      }, this);
    }, this);
  };

  return Player;

})(Entity);

module.exports = Player;


},{"./Entity.coffee":2}],4:[function(require,module,exports){
module.exports={
	"player": {
		"hp": 10,
		"jump": 3,
		"speed": 100,

		"head": 1,
		"body": 1,
		"weapon": 1
	}
}
},{}],5:[function(require,module,exports){
var Boot, game;

Boot = require('./Boot.coffee');

game = new Phaser.Game(480, 320, Phaser.AUTO, 'ShooterBlink');

game.state.add('Boot', Boot, true);


},{"./Boot.coffee":1}],6:[function(require,module,exports){
var Level;

Level = (function() {
  function Level(game) {
    this.map1 = game.add.tilemap('map', 16, 16);
    this.map1.addTilesetImage('tilemap');
    game.add.tileSprite(0, 0, 10000, 10000, 'bg');
    game.world.setBounds(0, 0, 10000, 10000);
    this.layer1 = this.map1.createLayer(0);
    this.layer1.resizeWorld();
  }

  return Level;

})();

module.exports = Level;


},{}]},{},[5])