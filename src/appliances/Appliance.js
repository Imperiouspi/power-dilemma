import Phaser from 'phaser'

export default class ApplianceObject extends Phaser.GameObjects.Sprite {
	constructor(x,y,scene){
		super(scene, x,y, 'appliance')
		this.activated = false
		this.animKey = 'oven'
		this.power = 1
		this.setInteractive();
		this.on('pointerdown', function(pointer){
			this.scene.removeAppliance(pointer.x, pointer.y, this)
		}, this)
	}

	activate(){
		this.play(this.animKey)
	}

	play(key){
		super.play(key)
	}

	destroy(){
		if(this.activated){this.scene.power.add(-this.power)}
		super.destroy()
	}

}