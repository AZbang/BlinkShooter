Level = require './states/Level.coffee'
Player = require './Player.coffee'

class Boot
	constructor: (game) ->
		@game = game

		@w = 480
		@h = 320
		@scale = window.innerWidth/@w
		@root = document.getElementById 'ShooterBlink'

	preload: ->
		@load.tilemap 'map', '../assets/levels/test/map.csv', null, Phaser.Tilemap.CSV
		@load.image 'tilemap', '../assets/levels/tilemap.png'
		@load.image 'bg', '../assets/bg.png'
		@load.image 'person1', '../assets/_/characters/example.png'

		@load.atlas 'heads', 'assets/atlases/heads.png', 'assets/atlases/heads.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH
		@load.atlas 'bodies', 'assets/atlases/bodies.png', 'assets/atlases/bodies.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH
		@load.atlas 'attachToBody', 'assets/atlases/attachToBody.png', 'assets/atlases/attachToBody.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH
		@load.atlas 'weapons', 'assets/atlases/weapons.png', 'assets/atlases/weapons.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH
		@load.atlas 'items', 'assets/atlases/items.png', 'assets/atlases/items.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH
		@load.atlas 'bullets', 'assets/atlases/bullets.png', 'assets/atlases/bullets.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH


	create: ->
		@game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
		@game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT
		@game.scale.pageAlignHorizontally = on
		@game.scale.pageAlignVertically = on
		do @game.scale.setMaximum

		@game.renderer.renderSession.roundPixels = on
		Phaser.Canvas.setImageRenderingCrisp(@game.canvas)

		@game.physics.startSystem(Phaser.Physics.ARCADE)

		@level = new Level @
		@player = new Player @, 400, 200





	update: ->
		do @player.update

module.exports = Boot