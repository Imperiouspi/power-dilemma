import Phase from 'phaser'

const formatPower = (power, gen) => `${power} | ${gen}`

export default class PowerIndicator extends Phaser.GameObjects.Text {
	constructor(scene, x, y, power, gen) {
		super(scene, x, y, formatPower(power, gen), {font: '18pt Trebuchet MS', fill: '#ff0'})
		this.scene = scene
		this.x = x
		this.y = y
		this.scene.registry.set('power', power)
		this.scene.registry.set('generated', gen)
	}

	setpower(power){
		this.scene.registry.set('power', power)
		this.updatepower()
	}

	setgenerated(gen){
		this.scene.registry.set('generated', gen)
		this.updatepower()
	}

	updatePower() {
		this.setText(formatPower(this.scene.registry.values.power.toFixed(0), this.scene.registry.values.generated.toFixed(0)))
	}
}