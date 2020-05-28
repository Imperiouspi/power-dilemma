import Phaser from 'phaser'
import ApplianceObject from './Appliance'

export default class DishwasherObject extends ApplianceObject {
	constructor(x,y,scene){
		super(x,y,scene, 'dishwasher')
		this.key = 'dishwasher'
		this.animKey = 'dishwasher'
		this.powerUse = 10
		this.cost = 400
	}

}