import Phaser from 'phaser'

export default class ApplianceObject extends Phaser.GameObjects.Sprite {
	constructor(x, y, scene, key){
		super(scene, x,y, key)
		this.key = key
		this.type = 'appliance'
		this.activated = false
		this.animKey = 'oven'
		this.powerUse = 1
		this.cost = 100

		this.setInteractive()
		this.on('pointerdown', function(pointer){
			if (this.scene.registry.values.mode == 'delete'){
				this.scene.sellAppliance(pointer.x, pointer.y, this)
			} else if ((this.scene.registry.values.mode != 'placewall')||(this.scene.registry.values.mode != 'placewallsegment')){
				this.scene.storeAppliance(pointer.x, pointer.y, this)
			}
		}, this)

		this.on('pointerover', function(pointer){
			if(this.scene.registry.values.mode == 'delete'){this.tint = 0xdd0000}
		}, this)

		this.on('pointerout', function(pointer){
			this.tint = 0xffffff
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
			super.destroy()
		}
		catch(err){

		}
	}

}