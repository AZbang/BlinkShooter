class Level
	constructor: (game) ->
		@map1 = game.add.tilemap('map', 16, 16)
		@map1.addTilesetImage('tilemap')

		game.add.tileSprite(0, 0, 10000, 10000, 'bg')
		game.world.setBounds(0, 0, 10000, 10000)

		@layer1 = @map1.createLayer 0
		do @layer1.resizeWorld


module.exports = Level