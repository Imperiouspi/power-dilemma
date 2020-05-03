import Phaser from 'phaser'

import RoomScene from './scenes/RoomScene'
import UIScene from './scenes/UIScene'
import LoseScene from './scenes/LoseScene'
import PlaceScene from './scenes/PlaceScene'

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
	scene: [RoomScene, UIScene, LoseScene]
}

export default new Phaser.Game(config)
