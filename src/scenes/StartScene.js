import Phaser from 'phaser'
import Button from '../ui/Button'

export default class StartScene extends Phaser.Scene
{
	constructor()
	{
		super({key: 'start-scene', active: true})
	}

	preload(){
		this.load.image('start', 'assets/Title Screen.png')
		this.load.spritesheet('start-icon', 'assets/Icon-Start.png', 
			{frameWidth: 192, frameHeight: 64})
	}

	create(){
		this.add.image(400,300,'start')
		var start = new Button(this, 400, 544, 'start-icon', function(){
			this.scene.scene.run('room-scene')
			this.scene.scene.switch('ui-scene')
		})
		this.add.existing(start)
	}
}