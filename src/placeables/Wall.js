import Phaser from 'phaser'

export default class WallObject extends Phaser.GameObjects.Image {
	constructor(x,y,scene){
		super(scene, x,y, 'appliance')
		this.cost = 100
		this.type = 'wall'
		this.scene.registry.values.balance -= this.cost

		this.setInteractive();
		this.on('pointerdown', function(pointer){
			this.scene.removeAppliance(pointer.x, pointer.y, this)
		}, this)

		this.on('pointerover', function(pointer){
			
		})

		this.on('pointerout', function(pointer){
			
		})
	}

	destroy(){
		try{
			this.scene.registry.values.balance += this.cost
			super.destroy()
		}
		catch(err){

		}
	}

}