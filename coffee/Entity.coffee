entities = require './entities.json'

class Entity
	constructor: (game, x, y, @type) ->
		@game = game

		@x = x ? 0
		@y = y ? 0

		@_entity = entities[type]

		@hp = @_entity.hp ? 10
		@jump = @_entity.jump ? 2
		@speed = @_entity.speed ? 100
		@isJumping = off

		@headId = @_entity.head ? 0
		@bodyId = @_entity.body ? 0
		@weaponId = @_entity.weapon ? 0

	_createPhaserObjects: ->
		@sptite = do @game.add.group
		console.log @sprite

		@head = @game.add.sprite(@x, @y, 'heads', @headId)
		@head.anchor.set 0.5
		@head.smoothed = off
		@sptite.add @head

		@body = @game.add.sprite(@x, @y, 'bodies', @bodyId)
		@body.anchor.set 0.5
		@body.smoothed = off
		@sptite.add @body

		@attachToBody = @game.add.sprite(@x, @y, 'attachToBody', @weaponId)
		@attachToBody.anchor.set 0.5
		@attachToBody.smoothed = off
		@sptite.add @attachToBody

		@weapon = @game.add.weapon 10, 'bullets'
		@weapon.setBulletFrames @weaponId, @weaponId, on
		@weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
		@weapon.bulletSpeed = 400
		@weapon.fireRate = 50
		@weapon.trackSprite @attachToBody, 16, 4, on

module.exports = Entity