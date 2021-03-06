import Phaser from 'phaser'

export default class WallObject extends Phaser.GameObjects.Image {
	constructor(scene, x,y, key){
		super(scene, x,y, key)
		this.type = 'wall'
		this.cost = 0
		this.scene.registry.values.balance -= this.cost

		this.setInteractive();
		this.on('pointerdown', function(pointer){
			if(this.scene.registry.values.mode == 'delete'){this.scene.sellWall(pointer.x, pointer.y, this)}
		}, this)

		this.on('pointerover', function(pointer){
			if(this.scene.registry.values.mode == 'delete'){this.tint = 0xdd0000}
		}, this)

		this.on('pointerout', function(pointer){
			this.tint = 0xffffff
		}, this)
	}

	destroy(){
		try{
			super.destroy()
		}
		catch(err){

		}
	}

}