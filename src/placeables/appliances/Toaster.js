import Phaser from 'phaser'
import ApplianceObject from './Appliance'

export default class ToasterObject extends ApplianceObject {
	constructor(x,y,scene){
		super(x,y,scene, 'toaster')
		this.key = 'toaster'
		this.animKey = 'toaster'
		this.powerUse = 4
		this.cost = 90
	}

}