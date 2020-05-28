import Phaser from 'phaser'
import {Viewport} from 'phaser-ui-tools'
import {Column} from 'phaser-ui-tools'
import Util from '../Util'

export default class ShopBox extends Viewport{
	constructor(scene, x, y, width, height){
		super(scene, x, y, width, height)

		var column = new Column(this.scene)

		this.addNode(column)

		for (var i = 0; i < Util.ApplianceKeys.length; i++) {
			var ob = this.scene.add.image(32,0, Util.ApplianceKeys[i])

			ob.setInteractive()
			var scene = this.scene
			ob.on('pointerdown', function(){
				scene.events.emit('placeevent', this.texture.key)
				var cost = Util.getApplianceCost(this.texture.key)
				scene.registry.values.balance -= cost
				scene.registry.set(this.texture.key, scene.registry.get(this.texture.key) + 1)
				scene.registry.values.mode = 'place'
			}, ob)
			column.addNode(ob)

			var newText = this.scene.add.text(32, 0, `${Util.ApplianceKeys[i]}:\n$${Util.ApplianceCost[i]}\n${Util.ApplianceEnergy[i]} kWh`, {font: '12pt Trebuchet MS', fill: '#fff'})
			newText.key = Util.ApplianceKeys[i]
			column.addNode(newText)
		}
	}
}