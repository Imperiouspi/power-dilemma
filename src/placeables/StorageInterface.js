import Phaser from 'phaser'
import uiWidgets from 'phaser-ui-tools'

export default class StorageInterface extends uiWidgets.Viewport{
	constructor(scene){
		super(scene.game, 0, 0, 100, 100)
		this.objects = new Array(2) //1. appliances, 2. walls
		objects[0] = new Array(2) //number of appliances available
		objects[0] = new Array(1) //number of walls available
	}
}