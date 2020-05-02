import Phaser from 'phaser'

export default class LoseScene extends Phaser.Scene
{
	constructor()
	{
		super({key: 'lose-scene', active: false})
	}

	create(){
		var loseText = new Phaser.GameObjects.Text(this, 300, 400, this.registry.values.lose, { fontSize: '32px', fill: '#fff' })
		this.add.existing(loseText)
	}
}