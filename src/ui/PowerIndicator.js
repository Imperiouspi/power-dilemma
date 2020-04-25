import Phase from 'phaser'

export default class PowerIndicator extends Phaser.GameObjects.Image {
	constructor(scene, x, y, power) {
		super(scene, x, y, 'powerbar')
		this.scene = scene
		this.x = x
		this.y = y
		this.power = power
		this.scaleX = 1.2
		this.pips = new Array(10)
		for (var i = this.pips.length - 1; i >= 0; i--) {
			this.pips[i] = new Phaser.GameObjects.Image(scene, x-90+20*i, y, 'pip')
			this.pips[i].setVisible(false)
		};
	}

	setPowerUse(power){
		this.power = power
		this.updatePowerPips()
	}

	add(watts) {
		if(this.power + watts > this.pips.length) {
			var oldlength = this.pips.length
			for(var i = 0; i < watts; i++){
				console.log("increase")
				this.pips.push(new Phaser.GameObjects.Image(this.scene, this.x-90+20*i+20*oldlength, this.y, 'pip'))
				this.scene.add.existing(this.pips[this.pips.length-1])
				this.pips[this.pips.length-1].setVisible(true)
				console.log(this.pips.length)
			}
		}
		this.setPowerUse(this.power + watts)
	}

	updatePowerPips() {
		console.log(this.pips.length)
		for (var i = 0; i < this.power; i++) {
			this.pips[i].setVisible(true)
		};
		for (var i = this.pips.length - 1; i >= this.power; i--) {
			this.pips[i].setVisible(false)
		};
	}
}