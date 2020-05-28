import Phaser from 'phaser'
import ApplianceObject from './Appliance'

export default class FanObject extends ApplianceObject {
	constructor(x,y,scene){
		super(x,y,scene, 'fan')
		this.key = 'fan'
		this.animKey = 'fan'
		this.powerUse = 4
		this.cost = 85
	}

}