Boot = require './Boot.coffee'

game = new Phaser.Game(480, 320, Phaser.AUTO, 'ShooterBlink')
game.state.add('Boot', Boot, on)