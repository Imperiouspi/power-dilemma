import Phaser from 'phaser'
import ApplianceObject from './Appliance'

export default class DryerObject extends ApplianceObject {
	constructor(x,y,scene){
		super(x,y,scene, 'dryer')
		this.key = 'dryer'
		this.animKey = 'dryer'
		this.powerUse = 10
		this.cost = 400
	}

}