import Phase from 'phaser'

export default class UIBar extends Phaser.GameObjects.Image {
	constructor(scene, x, y, key, value, length) {
		super(scene, x, y, `${key}bar`)
		this.scene = scene
		this.x = x
		this.y = y
		this.key = key
		this.scene.registry.set(this.key, value)
		this.pips = new Array(length)
		for (var i = this.pips.length - 1; i >= 0; i--) {
			this.pips[i] = new Phaser.GameObjects.Image(scene, x-90+20*i, y, `${key}-pip`)
			this.pips[i].setVisible(false)
		};
	}

	setValue(value){
		this.scene.registry.set(this.key, value)
		this.updateBar()
	}

	updateBar() {
		if(this.scene.registry.get(this.key) > this.pips.length) {
			var oldlength = this.pips.length
			for(var i = 0; i < this.scene.registry.get(this.key)-this.pips.length+1; i++){
				var newpip = new Phaser.GameObjects.Image(this.scene, this.x-90+20*i+20*oldlength, this.y, `${this.key}-pip`)
				this.pips.push(newpip)
				this.scene.add.existing(newpip)
			}
		}
		for (var i = 0; i < this.scene.registry.get(this.key); i++) {
			this.pips[i].setVisible(true)
		};
		for (var i = this.pips.length - 1; i >= this.scene.registry.get(this.key); i--) {
			this.pips[i].setVisible(false)
		};
	}
}