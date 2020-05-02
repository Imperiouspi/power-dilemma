import Phase from 'phaser'
import UIBar from './uibar'

export default class PowerIndicator extends UIBar {
	constructor(scene, x, y, power) {
		super(scene, x, y, 'power', power, 10)
		this.scaleX = 1.2
	}
}