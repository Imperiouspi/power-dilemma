import Phaser from 'phaser'

import RoomScene from './scenes/RoomScene'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	scene: [RoomScene]
}

export default new Phaser.Game(config)
