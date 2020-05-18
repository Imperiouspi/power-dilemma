import Phaser from 'phaser'

export default class ApplianceObject extends Phaser.GameObjects.Sprite {
	constructor(x,y,scene, key){
		super(scene, x,y, key)
		this.key = key
		this.type = 'appliance'
		this.activated = false
		this.animKey = 'oven'
		this.powerUse = 1
		this.cost = 100
		this.scene.registry.values.balance -= this.cost

		this.setInteractive();
		this.on('pointerdown', function(pointer){
			this.scene.removeAppliance(pointer.x, pointer.y, this)
		}, this)
	}

	activate(onoff){
		this.scene.registry.values.power += this.powerUse * onoff
		if(onoff == 1) {
			this.activated = true
			this.setFrame(1)
		} else if(onoff == -1){
			this.activated = false
			this.setFrame(0)
		}
	}

	play(key){
		super.play(key)
	}

	destroy(){
		try{
			if(this.activated){this.scene.registry.values.power -= this.powerUse}
			this.scene.registry.values.balance += this.cost
			super.destroy()
		}
		catch(err){

		}
	}

}