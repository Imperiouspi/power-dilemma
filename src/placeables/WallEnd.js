import Phaser from 'phaser'

export default class WallEndObject extends Phaser.GameObjects.Image {
	constructor(scene, x,y, key){
		super(scene, x,y, key)
		this.type = 'wallend'
		this.cost = 0
		this.scene.registry.values.balance -= this.cost

		this.setInteractive();
		this.on('pointerdown', function(pointer){
			console.log('thing')
			if(this.scene.registry.values.mode == 'delete'){this.scene.sellWallEnd(pointer.x, pointer.y, this)}
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