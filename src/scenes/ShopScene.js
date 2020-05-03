import Phaser from 'phaser'

export default class ShopScene extends Phaser.Scene
{
	constructor()
	{
		super({key: 'shop-scene', active: false})
	}

	create(data){
		this.add.rectangle(data.x, data.y, 100, 100, 0xffffff)
	}
}