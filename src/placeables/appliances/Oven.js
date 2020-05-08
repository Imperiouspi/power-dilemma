import Phaser from 'phaser'
import ApplianceObject from './Appliance'

export default class OvenObject extends ApplianceObject {
	constructor(x,y,scene){
		super(x, y, scene, 'oven')
		this.key = 'oven'
		this.animKey = 'oven'
		this.powerUse = 1
	}

}