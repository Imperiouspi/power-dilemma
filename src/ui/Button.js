import Phaser from 'phaser'

export default class Button extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, key, activate){
		super(scene, x, y, key)
		this.activate = activate
		this.setInteractive({useHandCursor: true})
		this.setFrame(0)
		this.setDepth(1)

		this.on('pointerover', function(pointer){
			this.setFrame(1)
		}, this)
		this.on('pointerout', function(pointer){
			this.setFrame(0)
		}, this)
		this.on('pointerdown', this.activate, this)
	}
}