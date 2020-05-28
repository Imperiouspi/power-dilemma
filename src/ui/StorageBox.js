import Phaser from 'phaser'
import {Viewport} from 'phaser-ui-tools'
import {Column} from 'phaser-ui-tools'
import Util from '../Util'

export default class StorageBox extends Viewport{
	constructor(scene, x, y, width, height){
		super(scene, x, y, width, height)

		var column = new Column(this.scene)
		this.addNode(column)

		for (var i = 0; i < Util.ApplianceKeys.length; i++) {
			var ob = this.scene.add.image(0,0, Util.ApplianceKeys[i])
			ob.setInteractive()
			var scene = this.scene
			ob.on('pointerdown', function(){
				if(scene.registry.get(this.texture.key) > 0){
					scene.events.emit('placeevent', this.texture.key)
					scene.registry.values.mode = 'place'
				}
			}, ob)
			column.addNode(ob)

			newText = this.scene.add.text(0, 0, `${Util.ApplianceKeys[i]}: 0`, {font: '12pt Trebuchet MS', fill: '#fff'})
			newText.key = Util.ApplianceKeys[i]
			column.addNode(newText)
		}

		var wall = this.scene.add.image(0,0, 'woodwall-segment')
		wall.setInteractive()
		var scene = this.scene
		wall.on('pointerdown', function(){
			if(scene.registry.get('woodwall') > 0){
				scene.events.emit('placewallevent', 'woodwall')
				scene.registry.values.mode = 'placewall'
			}
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
				children[i].setText(`${Util.Objects[(i-1)/2]}: ${this.scene.registry.get(Util.Objects[(i-1)/2])}`)
				this.update(children[i].children)
			}
		}
	}
}