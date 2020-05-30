import Phaser from 'phaser'

export default class GenScene extends Phaser.Scene
{
	constructor()
	{
		super({key: 'gen-scene', active: false})
	}

	preload(){
		this.load.image('gen', 'assets/Generation Screen.png')
	}

	create(){
		var bg = this.add.image(400, 300, 'gen')
		this.scene.setVisible(false)
	}
}