import Phaser from 'phaser'

export default class FurnitureObject extends Phaser.GameObjects.Image{
	constructor(scene, x, y, key){
		super(scene, x,y, key)
		this.setInteractive()
		this.on('pointerdown', function(pointer){
			if (this.scene.registry.values.mode == 'delete'){
				this.scene.furniture.remove(this, true, true)
				this.destroy()
			}
		}, this)
		this.on('pointerover', function(pointer){
			if(this.scene.registry.values.mode == 'delete'){this.tint = 0xdd0000}
		}, this)

		this.on('pointerout', function(pointer){
			this.tint = 0xffffff
		}, this)
	}
}