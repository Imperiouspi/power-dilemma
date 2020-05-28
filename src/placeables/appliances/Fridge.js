import Phaser from 'phaser'
import ApplianceObject from './Appliance'

export default class FridgeObject extends ApplianceObject {
	constructor(x,y,scene){
		super(x,y,scene, 'fridge')
		this.key = 'fridge'
		this.animKey = 'fridge'
		this.powerUse = 12
		this.cost = 1200
	}

}