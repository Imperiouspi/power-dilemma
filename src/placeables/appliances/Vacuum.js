import Phaser from 'phaser'
import ApplianceObject from './Appliance'

export default class VacuumObject extends ApplianceObject {
	constructor(x,y,scene){
		super(x,y,scene, 'vacuum')
		this.key = 'vacuum'
		this.animKey = 'vacuum'
		this.powerUse = 5
		this.cost = 380
	}

}