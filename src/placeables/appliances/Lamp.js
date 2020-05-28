import Phaser from 'phaser'
import ApplianceObject from './Appliance'

export default class LampObject extends ApplianceObject {
	constructor(x,y,scene){
		super(x,y,scene, 'lamp')
		this.key = 'lamp'
		this.animKey = 'lamp'
		this.powerUse = 4
		this.cost = 100
	}

}