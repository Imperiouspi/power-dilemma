import Phase from 'phaser'

export default class PowerIndicator extends Phaser.GameObjects.Image {
	constructor(scene, x, y, power) {
		super(scene, x, y, 'powerbar', {fontSize: '20px', fill: '#000'})
		this.scene = scene
		this.x = x
		this.y = y
		this.scene.registry.set('power', power)
		this.scaleX = 1.2
		this.pips = new Array(10)
		for (var i = this.pips.length - 1; i >= 0; i--) {
			this.pips[i] = new Phaser.GameObjects.Image(scene, x-90+20*i, y, 'pip')
			this.pips[i].setVisible(false)
		};
	}

	setPowerUse(power){
		this.scene.registry.set('power', power)
		this.updatePowerPips()
	}

	updatePowerPips() {
		if(this.scene.registry.values.power > this.pips.length) {
			var oldlength = this.pips.length
			for(var i = 0; i < this.scene.registry.values.power-this.pips.length+1; i++){
				var newpip = new Phaser.GameObjects.Image(this.scene, this.x-90+20*i+20*oldlength, this.y, 'pip')
				this.pips.push(newpip)
				this.scene.add.existing(newpip)
			}
		}
		for (var i = 0; i < this.scene.registry.values.power; i++) {
			this.pips[i].setVisible(true)
		};
		for (var i = this.pips.length - 1; i >= this.scene.registry.values.power; i--) {
			this.pips[i].setVisible(false)
		};
	}
}