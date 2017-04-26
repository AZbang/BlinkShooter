Entity = require './Entity.coffee'

class Player extends Entity
	constructor: (game, x, y) ->
		super game, x, y, 'player'

		do @_createPhaserObjects

		console.log @sprite
		@game.physics.arcade.enable(@sprite)
		@game.camera.follow(@sprite, Phaser.Camera.FOLLOW_LOCKON , 0.1, 0.1)

		@sprite.body.drag.set 150
		@sprite.body.maxVelocity.set 100

		@cursors = @game.input.keyboard.createCursorKeys()
		@jumpButton = @game.input.keyboard.addKey Phaser.Keyboard.SPACEBAR


	update: ->
		if @isJumping
			@weapon.trackSprite @sprite, 16*@sprite.scale.x, 4*@sprite.scale.y, on

		if @cursors.up.isDown
			do @fire
			@game.physics.arcade.accelerationFromRotation @sprite.rotation, 300, @sprite.body.acceleration
		
		else
			@sprite.body.acceleration.set 0

		if @cursors.left.isDown
			@sprite.body.angularVelocity = -300

		else if @cursors.right.isDown
			@sprite.body.angularVelocity = 300
		
		else
			@sprite.body.angularVelocity = 0

		if @jumpButton.isDown and not @isJumping
			@jump 3

	fire: ->
		bullet = do @weapon.fire

		if bullet
			@sprite.body.angularVelocity = -400
			@game.physics.arcade.accelerationFromRotation @sprite.rotation, 300, @sprite.body.acceleration
			bullet.smoothed = off
			bullet.scale.setTo @sprite.scale.x/2, @sprite.scale.y/2
			do bullet.body.updateBounds

	jump: (power) ->
		@isJumping = on

		@game.add.tween(@sprite.scale)
			.to({
				x: power
				y: power
			}, 300, Phaser.Easing.Quadratic.Out, on)
			.onComplete.add(->
				do @sprite.body.updateBounds
				@game.add.tween(@sprite.scale)
					.to({
						x: 1
						y: 1
					}, 300, Phaser.Easing.Quintic.In, on)
					.onComplete.add(->
						@isJumping = off
						@weapon.trackSprite @sprite, 16*@sprite.scale.x, 4*@sprite.scale.y, on
					, @)
			, @)
			
module.exports = Player