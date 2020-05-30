import Phaser from 'phaser'
import RoomScene from './scenes/RoomScene'
import UIScene from './scenes/UIScene'
import LoseScene from './scenes/LoseScene'
import GenScene from './scenes/GenScene'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	background: 0x00ff00,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	scene: [RoomScene, UIScene, GenScene, LoseScene]
}

export default new Phaser.Game(config)
