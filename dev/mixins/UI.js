var UI = {
	addTextButton: (x=0, y=0, textFamily, text, fontSize=30, cb) => {
		let txt = UI.addText(x, y, textFamily, text, fontSize);
		UI.setButton(txt, cb);
		return txt;
	},

	addText: (x=0, y=0, textFamily, text, fontSize=30) => {
		let txt = UI.game.add.bitmapText(x, y, textFamily, text, fontSize);
		txt.smoothed = false;
		txt.anchor.set(0.5);
		return txt;
	},

	addIconButton: (x=0, y=0, key, index, cb) => {
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
			if(obj.disable) return;
			UI.game.add.tween(obj.scale).to({x: x+0.3, y: y+0.3}, 300).start();
		});
		obj.events.onInputUp.add(() => {
			if(obj.disable) return;
			cb();
		});
		obj.events.onInputOver.add(() => {
			if(obj.disable) return;
			UI.game.add.tween(obj.scale).to({x: x+0.3, y: y+0.3}, 300).start();
		});
		obj.events.onInputOut.add(() => {
			if(obj.disable) return;
			UI.game.add.tween(obj.scale).to({x: x, y: y}, 300).start();
		});
	}
}

module.exports = UI;