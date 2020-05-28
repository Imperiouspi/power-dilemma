import Phaser from 'phaser'
import ApplianceObject from './Appliance'

export default class TVObject extends ApplianceObject {
	constructor(x,y,scene){
		super(x,y,scene, 'tv')
		this.key = 'tv'
		this.animKey = 'tv'
		this.powerUse = 7
		this.cost = 600
	}

}