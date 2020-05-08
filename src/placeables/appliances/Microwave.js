import Phaser from 'phaser'
import ApplianceObject from './Appliance'

export default class MicrowaveObject extends ApplianceObject {
	constructor(x,y,scene){
		super(x,y,scene, 'microwave')
		this.key = 'microwave'
		this.animKey = 'microwave'
		this.powerUse = 1
	}

}