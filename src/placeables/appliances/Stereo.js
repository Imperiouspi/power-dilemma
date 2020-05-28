import Phaser from 'phaser'
import ApplianceObject from './Appliance'

export default class StereoObject extends ApplianceObject {
	constructor(x,y,scene){
		super(x,y,scene, 'stereo')
		this.key = 'stereo'
		this.animKey = 'stereo'
		this.powerUse = 6
		this.cost = 450
	}

}