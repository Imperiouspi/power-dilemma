import Phaser from 'phaser'
import ApplianceObject from './Appliance'

export default class FridgeObject extends ApplianceObject {
	constructor(x,y,scene){
		super(x,y,scene)
		this.key = 'oven'
		this.animKey = 'oven'
		this.powerUse = 2
		this.tint = 0xff00
	}

}