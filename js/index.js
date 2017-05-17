const Boot = require('./states/Boot.js');
const Preload = require('./states/Preload.js');
const Menu = require('./states/Menu.js');
const Level = require('./states/Level.js');
const Settings = require('./states/Settings.js');
const LevelManager = require('./states/LevelManager.js');

var ready = () => {
	var game = new Phaser.Game(480, 320, Phaser.AUTO, 'ShooterBlink');

	game.state.add('Menu', Menu);
	game.state.add('Settings', Settings);
	game.state.add('Level', Level);
	game.state.add('LevelManager', LevelManager);
	game.state.add('Preload', Preload);
	game.state.add('Boot', Boot, true);
}

if(window.cordova) document.addEventListener('deviceready', ready, false);
else window.onload = ready;
