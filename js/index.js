var Boot = require('./Boot.js');

var game = new Phaser.Game(480, 320, Phaser.AUTO, 'ShooterBlink');
game.state.add('Boot', Boot, true);