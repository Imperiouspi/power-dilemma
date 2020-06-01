import Phaser from 'phaser'
import {Viewport} from 'phaser-ui-tools'
import {Column} from 'phaser-ui-tools'
import Util from '../Util'

export default class FurnitureBox extends Viewport{
	constructor(scene, x, y, width, height){
		super(scene, x, y, width, height)

		var column = new Column(this.scene)
		this.addNode(column)

		for (var i = 0; i < Util.FurnitureKeys.length; i++) {
			var ob = this.scene.add.image(32,0, Util.FurnitureKeys[i])
			ob.setInteractive()
			var scene = this.scene
			ob.on('pointerdown', function(){
				scene.events.emit('placefurnitureevent', this.texture.key)
				scene.registry.values.mode = 'placefurniture'
			}, ob)
			column.addNode(ob)
			this.scene.registry.set(Util.FurnitureKeys[i], 0)
			newText = this.scene.add.text(0, 0, `${Util.FurnitureKeys[i]}`, {font: '12pt Trebuchet MS', fill: '#fff'})
			newText.key = Util.FurnitureKeys[i]
			column.addNode(newText)
		}

		var wall = this.scene.add.image(32,0, 'woodwall-segment')
		wall.setInteractive()
		var scene = this.scene
		wall.on('pointerdown', function(){
			scene.events.emit('placewallevent', 'woodwall')
			scene.registry.values.mode = 'placewall'
		}, wall)
		column.addNode(wall)

		var newText = this.scene.add.text(0, 0, '-100', {font: '12pt Trebuchet MS', fill: '#fff'})
		newText.key = 'woodwall'
		column.addNode(newText)

		this.update(this.children[0].children)
	}

	update(children){
		if(children !== undefined){
			for (var i = 1; i < children.length; i+=2) {
				children[i].setText(`${Util.staticObjects[(i-1)/2]}`)
				this.update(children[i].children)
			}
		}
	}
}