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
			var ob = this.scene.add.image(32,0, Util.ApplianceKeys[i])
			ob.setInteractive()
			var scene = this.scene
			ob.on('pointerdown', function(){
				if(scene.registry.get(this.texture.key) > 0){
					scene.events.emit('placeevent', this.texture.key)
					scene.registry.values.mode = 'place'
				}
			}, ob)
			column.addNode(ob)
			this.scene.registry.set(Util.ApplianceKeys[i], 0)
			var newText = this.scene.add.text(0, 0, `${Util.ApplianceKeys[i]}: 0`, {font: '12pt Trebuchet MS', fill: '#fff'})
			newText.key = Util.ApplianceKeys[i]
			column.addNode(newText)
		}

		this.update(this.children[0].children)
	}

	update(children){
		if(children !== undefined){
			for (var i = 1; i < children.length; i+=2) {
				children[i].setText(`${Util.ApplianceKeys[(i-1)/2]}: ${this.scene.registry.get(Util.ApplianceKeys[(i-1)/2])}`)
				this.update(children[i].children)
			}
		}
	}
}