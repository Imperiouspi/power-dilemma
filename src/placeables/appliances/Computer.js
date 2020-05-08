import Phaser from 'phaser'
import ApplianceObject from './Appliance'

export default class ComputerObject extends ApplianceObject {
	constructor(x,y,scene){
		super(x,y,scene, 'computer')
		this.key = 'computer'
		this.animKey = 'computer'
		this.powerUse = 1
	}

}